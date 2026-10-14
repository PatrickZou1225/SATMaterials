import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CaptureUpdateAction, Excalidraw, restore } from '@excalidraw/excalidraw'
import type { ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types'
import '@excalidraw/excalidraw/index.css'
import type { PDFDocumentProxy } from '../lib/board'
import type { BoardScene, BoardPage } from '../lib/boardPages'
import { defaultInkColor, renderPdfPageToDataUrl } from '../lib/boardPages'
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
    scrollToContent: true,
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
          if (!editable || !onSceneChange) return
          const prev = prevElementsRef.current
          const structural = !prev || prev.length !== els.length || els.some((el, i) => el !== prev[i])
          prevElementsRef.current = els
          const filtered = els.filter((el) => el.id !== backgroundElementId)
          const cleanedFiles = { ...filesState }
          if (backgroundElementId) delete cleanedFiles[backgroundElementId]
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
