import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CaptureUpdateAction, Excalidraw, restore } from '@excalidraw/excalidraw'
import type { DataURL, ExcalidrawImperativeAPI, ExcalidrawInitialDataState, NormalizedZoomValue } from '@excalidraw/excalidraw/types'
import type { FileId } from '@excalidraw/excalidraw/element/types'
import '@excalidraw/excalidraw/index.css'
import type { PDFDocumentProxy } from '../lib/board'
import type { BoardScene, BoardPage } from '../lib/boardPages'
import { defaultInkColor, pdfBitmapId, pdfPageOf, renderPdfPageToDataUrl } from '../lib/boardPages'
import { buildBackgroundElement } from '../lib/boardExport'

export type BoardSurfaceProps = {
  pdf: PDFDocumentProxy | null
  page: BoardPage
  editable: boolean
  theme: 'light' | 'dark'
  // Collapse Excalidraw's shape-properties panel to free up board space.
  hideProperties?: boolean
  onToggleProperties?: () => void
  // Presentation mode: hide all of Excalidraw's own chrome (toolbar, menus).
  zen?: boolean
  // `structural` is false for UI-only changes (tool/ink/viewport), which lets the
  // caller avoid flagging a board dirty just because we recoloured the pen.
  onSceneChange?: (scene: BoardScene, meta: { structural: boolean }) => void
}

// The PDF handout page is baked into the scene as a locked image element so the
// teacher and students can draw on top of it but never drag it away. It is
// generated client-side on every load and stripped again before saving, so the
// stored scene stays small no matter how large the PDF is.
function useBackgroundImage(pdf: PDFDocumentProxy | null, page: BoardPage) {
  const [image, setImage] = useState<{ id: string; dataUrl: string; width: number; height: number } | null>(null)
  const background = page.background
  const pdfPageNumber = background.type === 'pdf' ? background.pdfPage : 0

  useEffect(() => {
    if (background.type !== 'pdf' || !pdf) { setImage(null); return }
    let active = true
    void (async () => {
      try {
        const rendered = await renderPdfPageToDataUrl(pdf, background.pdfPage)
        if (active) setImage({ id: `bg-${page.id}`, ...rendered })
      } catch {
        if (active) setImage(null)
      }
    })()
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, page.id, pdfPageNumber])

  return image
}

export default function BoardSurface({ pdf, page, editable, theme, hideProperties, onToggleProperties, zen, onSceneChange }: BoardSurfaceProps) {
  const bg = useBackgroundImage(pdf, page)
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null)
  const hostRef = useRef<HTMLDivElement | null>(null)
  // Where to glue the collapse handle: the top-right corner of Excalidraw's
  // shape-properties panel. Null until the panel first appears.
  const [panelPos, setPanelPos] = useState<{ top: number; left: number } | null>(null)
  const [panelVisible, setPanelVisible] = useState(false)
  const lastPosRef = useRef<{ top: number; left: number } | null>(null)
  const scheduleMeasureRef = useRef<() => void>(() => {})

  const backgroundElementId = bg?.id ?? null

  // A handout page carries the whole PDF as a column of image elements. Its
  // bitmaps are rendered lazily (see renderVisibleRef). A saved board restores
  // its own viewport; on a fresh load we fit the first page instead — never
  // `scrollToContent`, which would zoom out to fit all ~58 pages at once.
  const needsFit = page.scene.appState.scrollX === undefined

  // Build the scene Excalidraw boots with: background image (if any) first, then
  // the teacher's saved drawing on top.
  const { elements, appState, files } = useMemo(() => {
    const bgParts = bg ? buildBackgroundElement(bg) : null
    const restored = restore(
      { elements: page.scene.elements, appState: page.scene.appState, files: page.scene.files },
      null,
      null,
    )
    return {
      elements: [...(bgParts?.elements ?? []), ...restored.elements],
      appState: restored.appState,
      files: { ...(bgParts?.files ?? {}), ...restored.files },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bg, page.id])

  // Excalidraw can ignore `currentItemStrokeColor` from initialData (it keeps its
  // own last-used colour), which left dark ink on the black board. Force it onto
  // the pen whenever the page or its background changes.
  const inkColor = defaultInkColor(page.background)
  useEffect(() => {
    apiRef.current?.updateScene({ appState: { currentItemStrokeColor: inkColor }, captureUpdate: CaptureUpdateAction.NEVER })
  }, [inkColor, page.id])

  const prevElementsRef = useRef<readonly unknown[] | null>(null)

  // Structural change = something worth saving. Swapping a page element to its
  // real bitmap rewrites only its fileId, which must NOT count as a change (it
  // happens automatically while scrolling); moving or resizing a page must.
  type Elementish = { x: number; y: number; width: number; height: number; angle: number; customData?: unknown }
  const isStructural = (el: Elementish, p: Elementish) => {
    if (pdfPageOf(el) !== null || pdfPageOf(p) !== null) {
      return el.x !== p.x || el.y !== p.y || el.width !== p.width || el.height !== p.height || el.angle !== p.angle
    }
    return el !== p
  }

  // Handout bitmaps are huge, so only pages currently on screen are rasterised
  // and swapped in; off-screen pages keep their tiny grey placeholder. The real
  // bitmaps are never persisted (stripPdfBitmaps resets them before saving).
  const renderingRef = useRef<Set<number>>(new Set())
  const renderVisibleRef = useRef<() => void>(() => {})
  useEffect(() => {
    const renderVisible = () => {
      const api = apiRef.current
      const host = hostRef.current
      if (!api || !host || !pdf) return
      const app = api.getAppState()
      const zoom = app.zoom.value
      const top = -app.scrollY
      const bottom = top + host.clientHeight / zoom
      // A page element may point at its bitmap id while the bitmap itself was
      // dropped (e.g. after switching pages, whose saved files carry only the
      // placeholder), so check the file really exists before skipping.
      const files = api.getFiles()
      // Render a page slightly before it scrolls into view, so it's ready.
      const pad = 400
      const viewCenter = (top + bottom) / 2
      const pending: { p: number; center: number }[] = []
      for (const el of api.getSceneElements()) {
        const p = pdfPageOf(el)
        if (p === null || el.type !== 'image') continue
        if (el.y > bottom + pad || el.y + el.height < top - pad) continue
        if ((el.fileId === pdfBitmapId(p) && !!files[el.fileId]) || renderingRef.current.has(p)) continue
        pending.push({ p, center: el.y + el.height / 2 })
      }
      // Excalidraw never frees a decoded bitmap, so rasterising a whole 58-page
      // column could exhaust memory. Render only the nearest few per pass; more
      // follow as the teacher scrolls.
      pending.sort((a, b) => Math.abs(a.center - viewCenter) - Math.abs(b.center - viewCenter))
      for (const { p } of pending.slice(0, 8)) {
        renderingRef.current.add(p)
        void (async () => {
          try {
            const rendered = await renderPdfPageToDataUrl(pdf, p)
            api.addFiles([{ id: pdfBitmapId(p) as FileId, mimeType: 'image/png', dataURL: rendered.dataUrl as DataURL, created: Date.now() }])
            api.updateScene({
              elements: api.getSceneElements().map((cur) => (pdfPageOf(cur) === p ? { ...cur, fileId: pdfBitmapId(p) as FileId } : cur)),
              captureUpdate: CaptureUpdateAction.NEVER,
            })
          } catch {
            // Leave the placeholder in place; a later scroll can retry.
          } finally {
            renderingRef.current.delete(p)
          }
        })()
      }
    }
    renderVisibleRef.current = renderVisible
    renderVisible()
  }, [pdf, page.id])

  // Fit the first page of a freshly loaded handout so it opens readable instead
  // of showing origin at whatever Excalidraw's default zoom is.
  useEffect(() => {
    if (!needsFit) return
    const api = apiRef.current
    const host = hostRef.current
    if (!api || !host) return
    const first = page.scene.elements.find((el) => pdfPageOf(el) !== null)
    if (!first) return
    const raf = requestAnimationFrame(() => {
      const zoom = Math.max(0.1, Math.min((host.clientWidth - 24) / first.width, (host.clientHeight - 24) / first.height, 4))
      // sceneX(screenX) = screenX / zoom - scrollX, so park the page centre mid-view.
      const scrollX = host.clientWidth / 2 / zoom - first.x - first.width / 2
      const scrollY = host.clientHeight / 2 / zoom - first.y - first.height / 2
      api.updateScene({
        appState: { zoom: { value: zoom as NormalizedZoomValue }, scrollX, scrollY },
        captureUpdate: CaptureUpdateAction.NEVER,
      })
      renderVisibleRef.current()
    })
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.id])

  // Excalidraw's wheel gesture pans the canvas by default; on an infinite board
  // that sends the handout drifting off-screen, which reads as vertigo when
  // presenting. Swap it for a document-viewer feel: the wheel/pinch zooms about
  // the pointer, and the zoom never goes below "whole page fits" so the page
  // can't shrink into a dot in a sea of black.
  const fitZoomRef = useRef(0.4)
  const hasPageRef = useRef(false)
  hasPageRef.current = !!bg
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const measureFit = () => {
      const pageW = bg?.width ?? 1000
      const pageH = bg?.height ?? 700
      const fit = Math.min((host.clientWidth - 24) / pageW, (host.clientHeight - 24) / pageH)
      fitZoomRef.current = Math.max(0.1, fit)
    }
    measureFit()
    const ro = new ResizeObserver(measureFit)
    ro.observe(host)
    return () => ro.disconnect()
  }, [bg?.width, bg?.height])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const onWheel = (e: WheelEvent) => {
      const api = apiRef.current
      if (!api) return
      // Let an in-canvas text box scroll its own content.
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.isContentEditable)) return
      e.preventDefault()
      e.stopPropagation()
      const app = api.getAppState()
      const rect = host.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      const oldZoom = app.zoom.value
      // Pinch gestures arrive as ctrl+wheel with much smaller deltas.
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015))
      const min = hasPageRef.current ? fitZoomRef.current * 0.95 : 0.1
      const zoom = Math.min(4, Math.max(min, oldZoom * factor))
      if (zoom === oldZoom) return
      const sceneX = px / oldZoom - app.scrollX
      const sceneY = py / oldZoom - app.scrollY
      api.updateScene({
        appState: { zoom: { value: zoom as NormalizedZoomValue }, scrollX: px / zoom - sceneX, scrollY: py / zoom - sceneY },
        captureUpdate: CaptureUpdateAction.NEVER,
      })
      renderVisibleRef.current()
    }
    // Capture phase so Excalidraw's own (bubbling) wheel handler never sees it.
    host.addEventListener('wheel', onWheel, { capture: true, passive: false })
    return () => host.removeEventListener('wheel', onWheel, { capture: true })
  }, [])

  const initialData = useMemo((): ExcalidrawInitialDataState => ({
    elements,
    appState: {
      ...appState,
      collaborators: new Map(),
      currentItemStrokeColor: inkColor,
      viewBackgroundColor: page.background.type === 'blank' ? page.background.color : '#ffffff',
      gridSize: page.background.type === 'blank' && page.background.grid ? 20 : undefined,
      gridModeEnabled: page.background.type === 'blank' ? page.background.grid : false,
    },
    files,
    scrollToContent: false,
  }), [elements, appState, files, page.id])

  // Glue the collapse handle to the properties panel's top-right corner. The
  // panel lives inside Excalidraw's own DOM, so we measure it and float a button
  // just outside its right edge. Re-measures only when the panel appears/stops.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let raf = 0
    let hadPanel: boolean | null = null
    const measure = () => {
      const panel = host.querySelector<HTMLElement>('.selected-shape-actions')
      const r = panel?.getBoundingClientRect()
      const visible = !!(r && r.width > 0)
      if (visible === hadPanel) return
      hadPanel = visible
      setPanelVisible(visible)
      const hb = host.getBoundingClientRect()
      if (visible && r) lastPosRef.current = { top: r.top - hb.top + 6, left: r.right - hb.left + 8 }
      else if (!lastPosRef.current) lastPosRef.current = { top: 96, left: 12 }
      setPanelPos(lastPosRef.current)
    }
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure) }
    scheduleMeasureRef.current = schedule
    const mo = new MutationObserver(schedule)
    mo.observe(host, { childList: true, subtree: true })
    const ro = new ResizeObserver(schedule)
    ro.observe(host)
    schedule()
    return () => { cancelAnimationFrame(raf); mo.disconnect(); ro.disconnect() }
  }, [page.id, hideProperties, zen])

  const handle = panelPos
    ? { top: panelPos.top, left: hideProperties ? 12 : panelPos.left }
    : null

  return (
    <div ref={hostRef} className={`relative h-full w-full${hideProperties ? ' board-hide-props' : ''}${zen ? ' board-zen' : ''}`}>
      <Excalidraw
        key={page.id}
        excalidrawAPI={(api) => { apiRef.current = api }}
        initialData={initialData}
        viewModeEnabled={!editable}
        theme={theme}
        onChange={(els, appStateState, filesState) => {
          // A tool change shows/hides the properties panel — re-glue the handle.
          scheduleMeasureRef.current()
          // Scrolling/panning can bring new handout pages into view.
          renderVisibleRef.current()
          if (!editable || !onSceneChange) return
          const prev = prevElementsRef.current
          const structural = !prev || prev.length !== els.length || els.some((el, i) => isStructural(el as unknown as Elementish, prev[i] as unknown as Elementish))
          prevElementsRef.current = els
          const filtered = els.filter((el) => el.id !== backgroundElementId)
          const cleanedFiles = { ...filesState }
          if (backgroundElementId) delete cleanedFiles[backgroundElementId]
          // Never carry rasterised page bitmaps into the saved scene.
          for (const id of Object.keys(cleanedFiles)) if (id.startsWith('pdf-bm-')) delete cleanedFiles[id]
          onSceneChange({
            elements: filtered as unknown as BoardScene['elements'],
            files: cleanedFiles,
            appState: {
              viewBackgroundColor: appStateState.viewBackgroundColor,
              scrollX: appStateState.scrollX,
              scrollY: appStateState.scrollY,
              zoom: appStateState.zoom,
              gridSize: appStateState.gridSize,
              gridModeEnabled: appStateState.gridModeEnabled,
            },
          }, { structural })
        }}
      />
      {editable && !zen && handle && onToggleProperties && (hideProperties || panelVisible) && (
        <button
          type="button"
          onClick={onToggleProperties}
          style={{ top: handle.top, left: handle.left }}
          title={hideProperties ? '展开属性面板' : '收起属性面板'}
          aria-label={hideProperties ? '展开属性面板' : '收起属性面板'}
          className="absolute z-10 grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {hideProperties ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}
    </div>
  )
}
