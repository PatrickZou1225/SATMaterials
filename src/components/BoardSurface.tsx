import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize, Minus, Plus } from 'lucide-react'
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

  // Percent readout for the zoom cluster (fed by onChange below).
  const [zoomPct, setZoomPct] = useState(100)
  // The wheel listener is attached once, so the viewport helpers below read
  // live values through refs instead of closing over render-scoped state.
  const bgSizeRef = useRef<{ width: number; height: number } | null>(null)
  bgSizeRef.current = bg ? { width: bg.width, height: bg.height } : null

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

  // ---------------------------------------------------------------------------
  // Viewport model (document-viewer style). The handout is one very tall column
  // of pages, so the surface behaves like a PDF reader: the plain wheel/trackpad
  // scrolls VERTICALLY through the column (locked to the axis — the old free
  // two-axis panning is what read as drifting), ⌘/Ctrl+wheel and pinch zoom
  // about the pointer, and the floating cluster offers −/+/fit controls.
  // The zoom-out floor is "one whole page fits", so the handout can never
  // shrink into a dot in a sea of black.
  const FIT_MARGIN = 24

  const pageElements = (api: ExcalidrawImperativeAPI) =>
    api.getSceneElements().filter((el) => el.type === 'image' && pdfPageOf(el) !== null)

  // The page whose centre sits nearest the viewport centre (falls back to the
  // first page when the centre is off the column).
  const nearestPage = (api: ExcalidrawImperativeAPI) => {
    const host = hostRef.current
    const pages = pageElements(api)
    if (!host || pages.length === 0) return null
    const app = api.getAppState()
    const centreY = -app.scrollY + host.clientHeight / app.zoom.value / 2
    let best = pages[0]
    let bestDist = Infinity
    for (const el of pages) {
      const dist = Math.abs(el.y + el.height / 2 - centreY)
      if (dist < bestDist) { bestDist = dist; best = el }
    }
    return best
  }

  const fitZoomFor = (box: { width: number; height: number }) => {
    const host = hostRef.current
    if (!host) return 0.4
    return Math.max(0.1, Math.min((host.clientWidth - FIT_MARGIN) / box.width, (host.clientHeight - FIT_MARGIN) / box.height, 4))
  }

  // The lowest zoom the current page allows: it must still fill the viewport.
  const minZoom = (api: ExcalidrawImperativeAPI) => {
    const el = nearestPage(api) ?? bgSizeRef.current
    return el ? fitZoomFor(el) * 0.95 : 0.1
  }

  const applyZoom = (api: ExcalidrawImperativeAPI, next: number, px: number, py: number) => {
    const app = api.getAppState()
    const oldZoom = app.zoom.value
    const zoom = Math.min(4, Math.max(minZoom(api), next))
    if (zoom === oldZoom) return
    // Keep the scene point under (px, py) fixed on screen.
    const sceneX = px / oldZoom - app.scrollX
    const sceneY = py / oldZoom - app.scrollY
    api.updateScene({
      appState: { zoom: { value: zoom as NormalizedZoomValue }, scrollX: px / zoom - sceneX, scrollY: py / zoom - sceneY },
      captureUpdate: CaptureUpdateAction.NEVER,
    })
    renderVisibleRef.current()
  }

  const zoomByStep = (api: ExcalidrawImperativeAPI, factor: number) => {
    const host = hostRef.current
    if (!host) return
    applyZoom(api, api.getAppState().zoom.value * factor, host.clientWidth / 2, host.clientHeight / 2)
  }

  // "Fit page": centre the nearest handout page. Old-style boards (a PDF page
  // as the background) fit that page; blank boards fit whatever has been
  // drawn, or recentre the origin when empty.
  const fitPage = (api: ExcalidrawImperativeAPI) => {
    const host = hostRef.current
    if (!host) return
    const focus = nearestPage(api) ?? (bgSizeRef.current ? { x: 0, y: 0, ...bgSizeRef.current } : null)
    if (focus) {
      const zoom = fitZoomFor(focus)
      api.updateScene({
        appState: {
          zoom: { value: zoom as NormalizedZoomValue },
          scrollX: host.clientWidth / 2 / zoom - (focus.x + focus.width / 2),
          scrollY: host.clientHeight / 2 / zoom - (focus.y + focus.height / 2),
        },
        captureUpdate: CaptureUpdateAction.NEVER,
      })
    } else {
      const els = api.getSceneElements().filter((el) => !el.isDeleted)
      if (els.length) {
        const minX = Math.min(...els.map((el) => el.x))
        const minY = Math.min(...els.map((el) => el.y))
        const maxX = Math.max(...els.map((el) => el.x + el.width))
        const maxY = Math.max(...els.map((el) => el.y + el.height))
        const zoom = fitZoomFor({ width: maxX - minX || 1, height: maxY - minY || 1 })
        api.updateScene({
          appState: {
            zoom: { value: zoom as NormalizedZoomValue },
            scrollX: host.clientWidth / 2 / zoom - (minX + maxX) / 2,
            scrollY: host.clientHeight / 2 / zoom - (minY + maxY) / 2,
          },
          captureUpdate: CaptureUpdateAction.NEVER,
        })
      } else {
        api.updateScene({
          appState: { zoom: { value: 1 as NormalizedZoomValue }, scrollX: host.clientWidth / 2, scrollY: host.clientHeight / 2 },
          captureUpdate: CaptureUpdateAction.NEVER,
        })
      }
    }
    renderVisibleRef.current()
  }

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
      if (e.ctrlKey || e.metaKey) {
        // Pinch (arrives as ctrl+wheel) and ⌘/Ctrl+wheel: zoom about the pointer.
        const rect = host.getBoundingClientRect()
        const factor = Math.min(2, Math.max(0.5, Math.exp(-e.deltaY * 0.002)))
        applyZoom(api, app.zoom.value * factor, e.clientX - rect.left, e.clientY - rect.top)
      } else if (e.shiftKey) {
        // Shift+wheel: horizontal scroll, for boards wider than the viewport.
        const dx = e.deltaY !== 0 ? e.deltaY : e.deltaX
        api.updateScene({ appState: { scrollX: app.scrollX - dx / app.zoom.value }, captureUpdate: CaptureUpdateAction.NEVER })
        renderVisibleRef.current()
      } else {
        // Plain wheel / two-finger swipe: vertical scroll through the handout —
        // locked to the axis, so the board never drifts sideways mid-lesson.
        api.updateScene({ appState: { scrollY: app.scrollY - e.deltaY / app.zoom.value }, captureUpdate: CaptureUpdateAction.NEVER })
        renderVisibleRef.current()
      }
    }
    // Capture phase so Excalidraw's own (bubbling) wheel handler never sees it.
    host.addEventListener('wheel', onWheel, { capture: true, passive: false })
    return () => host.removeEventListener('wheel', onWheel, { capture: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          setZoomPct(Math.round(appStateState.zoom.value * 100))
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
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-0.5 rounded-xl border border-slate-200 bg-white/95 p-1 text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
        <button type="button" title="缩小" aria-label="缩小" onClick={() => { const api = apiRef.current; if (api) zoomByStep(api, 1 / 1.25) }} className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800"><Minus size={16} /></button>
        <span className="min-w-[46px] text-center text-xs font-semibold tabular-nums">{zoomPct}%</span>
        <button type="button" title="放大" aria-label="放大" onClick={() => { const api = apiRef.current; if (api) zoomByStep(api, 1.25) }} className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800"><Plus size={16} /></button>
        <span className="mx-0.5 h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <button type="button" title="回到整页" aria-label="回到整页" onClick={() => { const api = apiRef.current; if (api) fitPage(api) }} className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800"><Maximize size={16} /></button>
      </div>
    </div>
  )
}
