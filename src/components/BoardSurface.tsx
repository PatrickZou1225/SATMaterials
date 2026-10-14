import { useCallback, useEffect, useMemo, useRef, useState, type ComponentProps, type PointerEvent as ReactPointerEvent } from 'react'
import { ChevronLeft, ChevronRight, Maximize, Minus, MoveHorizontal, Paintbrush, Plus } from 'lucide-react'
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
  // Collapse Excalidraw's drawing-tool palette; a small pill brings it back.
  hideTools?: boolean
  onToggleTools?: () => void
  // Presentation mode: hide all of Excalidraw's own chrome (toolbar, menus).
  zen?: boolean
  // `structural` is false for UI-only changes (tool/ink/viewport), which lets the
  // caller avoid flagging a board dirty just because we recoloured the pen.
  onSceneChange?: (scene: BoardScene, meta: { structural: boolean }) => void
}

// The Excalidraw change handler is a stable callback so that zooming — which
// re-renders this component via the % readout — does not re-render the whole
// Excalidraw tree on every wheel tick.
type ExcalidrawOnChange = NonNullable<ComponentProps<typeof Excalidraw>['onChange']>

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

export default function BoardSurface({ pdf, page, editable, theme, hideProperties, onToggleProperties, hideTools, onToggleTools, zen, onSceneChange }: BoardSurfaceProps) {
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
  // Current handout page (fed by onChange below), for the bottom page bar.
  const [pageInfo, setPageInfo] = useState<{ current: number; total: number } | null>(null)
  // Screen x of the handout column's right edge, so the drag handle can hug the
  // PDF boundary instead of floating at the screen edge.
  const [pageEdgeX, setPageEdgeX] = useState<number | null>(null)
  // "Fit to window": keep the page scaled to the host whenever the window
  // resizes — the reference app's "fit page to window display size" button.
  const [fitWindow, setFitWindow] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('sat_board_fit_window') === '1')
  // "Collapse the handout": park the viewport on the empty board to the right
  // of the page column and remember where the PDF was, so the toggle restores
  // it exactly — ClassIn's collapse/expand, mapped onto a single canvas.
  const [collapsed, setCollapsed] = useState(false)
  const collapsedViewRef = useRef<{ scrollX: number; scrollY: number; zoom: number } | null>(null)
  // ClassIn-style font gate (fed by onChange below): the text island — text
  // colour / size / align — belongs to the text TOOL. It may appear only after
  // the teacher deliberately picks that tool; a text that is merely selected
  // or being edited (double-click-to-type) stays quiet. board-text-tool also
  // re-admits the island in zen / with the manual props toggle on; index.css
  // holds the three rules.
  const [textToolOn, setTextToolOn] = useState(false)
  const [quietText, setQuietText] = useState(false)
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
      // Lock every handout page so the PDF reads as one fixed document: pages
      // cannot be dragged apart or selected by accident, so the pen and text
      // tool land on the ink layer instead of re-selecting the page image.
      elements: [...(bgParts?.elements ?? []), ...restored.elements].map((el) => (pdfPageOf(el) !== null ? { ...el, locked: true } : el)),
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

  // Canvas colour behind the board: blank boards carry it on the page
  // background, handout boards on the saved scene (default white). The 背景
  // palette in BoardEditor rewrites the matching value and this effect pushes it
  // onto the live canvas — `initialData` is memoised on page.id, so it alone
  // would not repaint.
  const canvasColor = page.background.type === 'blank'
    ? page.background.color
    : (typeof page.scene.appState.viewBackgroundColor === 'string' ? page.scene.appState.viewBackgroundColor : '#ffffff')
  useEffect(() => {
    apiRef.current?.updateScene({ appState: { viewBackgroundColor: canvasColor }, captureUpdate: CaptureUpdateAction.NEVER })
  }, [canvasColor, page.id])

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

  // Zooming moves the viewport in bursts, and rasterising a page is heavy
  // main-thread canvas work. Completing a batch of renders mid-gesture made the
  // board visibly churn under the cursor, so renders now wait for the gesture to
  // settle (and passes are throttled) before swapping bitmaps in.
  const lastZoomAtRef = useRef(0)
  const renderTimerRef = useRef(0)
  const scheduleRenderRef = useRef<() => void>(() => {})
  useEffect(() => {
    scheduleRenderRef.current = () => {
      if (renderTimerRef.current) return
      renderTimerRef.current = window.setTimeout(() => {
        renderTimerRef.current = 0
        if (Date.now() - lastZoomAtRef.current < 250) { scheduleRenderRef.current(); return }
        renderVisibleRef.current()
      }, 160)
    }
    return () => window.clearTimeout(renderTimerRef.current)
  }, [])

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
  // of locked pages, so the surface behaves like a PDF reader: the wheel /
  // trackpad scrolls the document straight down (vertical only — any sideways
  // drift is what made the board feel like it was floating away), Ctrl+wheel
  // and pinch zoom in place about the viewport centre across the full 0.1–4
  // range, and the floating cluster offers −/+/fit controls. Fit is the way
  // back from any view.
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

  const applyZoom = (api: ExcalidrawImperativeAPI, next: number, px: number, py: number) => {
    const app = api.getAppState()
    const oldZoom = app.zoom.value
    // Zoom far out enough to see the whole document; the fit button is the way
    // back, so no artificial floor sits above Excalidraw's own 0.1.
    const zoom = Math.min(4, Math.max(0.1, next))
    if (zoom === oldZoom) return
    // Keep the scene point under (px, py) fixed on screen.
    const sceneX = px / oldZoom - app.scrollX
    const sceneY = py / oldZoom - app.scrollY
    lastZoomAtRef.current = Date.now()
    api.updateScene({
      appState: { zoom: { value: zoom as NormalizedZoomValue }, scrollX: px / zoom - sceneX, scrollY: py / zoom - sceneY },
      captureUpdate: CaptureUpdateAction.NEVER,
    })
    scheduleRenderRef.current()
  }

  const zoomByStep = (api: ExcalidrawImperativeAPI, factor: number) => {
    const host = hostRef.current
    if (!host) return
    applyZoom(api, api.getAppState().zoom.value * factor, host.clientWidth / 2, host.clientHeight / 2)
  }

  // "Fit page": centre the nearest handout page. Old-style boards (a PDF page
  // as the background) fit that page; blank boards fit whatever has been
  // drawn, or recentre the origin when empty.
  const fitPage = (api: ExcalidrawImperativeAPI, target?: { x: number; y: number; width: number; height: number } | null) => {
    const host = hostRef.current
    if (!host) return
    setCollapsed(false)
    const focus = target ?? nearestPage(api) ?? (bgSizeRef.current ? { x: 0, y: 0, ...bgSizeRef.current } : null)
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

  // Jump to a specific handout page without changing the zoom: park its top at
  // the viewport top with a small margin and centre it horizontally. This is
  // how the teacher advances a lesson — far less motion than scrolling.
  const goToPage = (api: ExcalidrawImperativeAPI, target: number) => {
    const host = hostRef.current
    if (!host) return
    setCollapsed(false)
    const el = pageElements(api).find((pageEl) => pdfPageOf(pageEl) === target)
    if (!el) return
    const zoom = api.getAppState().zoom.value
    api.updateScene({
      appState: {
        scrollX: el.x + el.width / 2 - host.clientWidth / 2 / zoom,
        scrollY: el.y - FIT_MARGIN / zoom,
      },
      captureUpdate: CaptureUpdateAction.NEVER,
    })
    lastZoomAtRef.current = Date.now()
    scheduleRenderRef.current()
  }

  const toggleFitWindow = () => {
    const next = !fitWindow
    setFitWindow(next)
    try { window.localStorage.setItem('sat_board_fit_window', next ? '1' : '0') } catch { /* ignore */ }
    const api = apiRef.current
    if (next && api) fitPage(api)
  }

  const toggleCollapse = (api: ExcalidrawImperativeAPI) => {
    const host = hostRef.current
    if (!host) return
    const app = api.getAppState()
    const zoom = app.zoom.value
    if (!collapsed) {
      const pages = pageElements(api)
      if (pages.length === 0) return
      // The blackboard lives just right of the page column.
      const rightEdge = Math.max(...pages.map((el) => el.x + el.width))
      collapsedViewRef.current = { scrollX: app.scrollX, scrollY: app.scrollY, zoom }
      const cx = rightEdge + host.clientWidth / 2 / zoom + 240
      api.updateScene({
        appState: { scrollX: host.clientWidth / 2 / zoom - cx },
        captureUpdate: CaptureUpdateAction.NEVER,
      })
      setCollapsed(true)
    } else {
      const saved = collapsedViewRef.current
      if (saved) {
        api.updateScene({
          appState: { zoom: { value: saved.zoom as NormalizedZoomValue }, scrollX: saved.scrollX, scrollY: saved.scrollY },
          captureUpdate: CaptureUpdateAction.NEVER,
        })
      }
      setCollapsed(false)
    }
    lastZoomAtRef.current = Date.now()
    scheduleRenderRef.current()
  }

  // Edge handle: drag right to enlarge, drag left to shrink — the conventional
  // window-edge resize (站长's feedback: 往右=加大, 往左=缩小). The page's left
  // edge stays pinned at its drag-start position while the right edge follows
  // the hand. Page rendering settles once the drag ends.
  const resizeDragRef = useRef<{ startX: number; startZoom: number; anchorX: number } | null>(null)
  const onResizeDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const api = apiRef.current
    const host = hostRef.current
    if (!api || !host) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const app = api.getAppState()
    const el = nearestPage(api)
    const anchorX = el
      ? Math.min(host.clientWidth - 8, Math.max(8, (el.x + app.scrollX) * app.zoom.value))
      : host.clientWidth / 2
    resizeDragRef.current = { startX: e.clientX, startZoom: app.zoom.value, anchorX }
  }
  const onResizeMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const api = apiRef.current
    const host = hostRef.current
    const drag = resizeDragRef.current
    if (!api || !host || !drag) return
    // 300px of travel ≈ 1.5x; shrinking and growing are both clamped.
    const factor = Math.max(0.4, Math.min(2.5, 1 + (e.clientX - drag.startX) / 300))
    applyZoom(api, drag.startZoom * factor, drag.anchorX, host.clientHeight / 2)
  }
  const onResizeUp = () => { resizeDragRef.current = null }

  // "Adapt to window": while enabled, rescaling the window rescales the page.
  useEffect(() => {
    const host = hostRef.current
    if (!host || !fitWindow) return
    let timer = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => { const api = apiRef.current; if (api) fitPage(api) }, 200)
    })
    ro.observe(host)
    return () => { window.clearTimeout(timer); ro.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitWindow])

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
      if (e.ctrlKey) {
        // Pinch (arrives as ctrl+wheel) and Ctrl+wheel: zoom about the centre of
        // the viewport, NOT the pointer. Pointer-anchored zoom slides the whole
        // page sideways under the hand, which reads as the board drifting and
        // gets genuinely nauseating on a large handout page — centre-anchored
        // zoom just scales in place. Gentle steps: a mouse notch (~±100) moves
        // about 0.82×/1.22×, and oversized deltas are clamped.
        const factor = Math.min(1.25, Math.max(0.8, Math.exp(-e.deltaY * 0.002)))
        applyZoom(api, app.zoom.value * factor, host.clientWidth / 2, host.clientHeight / 2)
      } else if (e.shiftKey) {
        // Shift+wheel: horizontal scroll, for boards wider than the viewport.
        const dx = e.deltaY !== 0 ? e.deltaY : e.deltaX
        api.updateScene({ appState: { scrollX: app.scrollX - dx / app.zoom.value }, captureUpdate: CaptureUpdateAction.NEVER })
        scheduleRenderRef.current()
      } else {
        // Plain wheel / two-finger swipe: scroll the handout straight up/down —
        // the page stays nailed to the vertical axis no matter how the fingers
        // drift, which is the calmest way through a long document. Horizontal
        // movement (rarely needed) lives on Shift+wheel.
        api.updateScene({
          appState: { scrollY: app.scrollY - e.deltaY / app.zoom.value },
          captureUpdate: CaptureUpdateAction.NEVER,
        })
        scheduleRenderRef.current()
      }
    }
    // Capture phase so Excalidraw's own (bubbling) wheel handler never sees it.
    host.addEventListener('wheel', onWheel, { capture: true, passive: false })
    return () => host.removeEventListener('wheel', onWheel, { capture: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = useCallback<ExcalidrawOnChange>((els, appStateState, filesState) => {
    // A tool change shows/hides the properties panel — re-glue the handle.
    scheduleMeasureRef.current()
    // Scrolling/panning can bring new handout pages into view.
    scheduleRenderRef.current()
    setZoomPct(Math.round(appStateState.zoom.value * 100))
    // Drive the font gate above: remember whether the text tool is on, and
    // whether a text is only selected / being edited. Excalidraw pops the
    // island for all three cases (see showSelectedShapeActions); the teacher
    // wants the options only in the first.
    const toolIsText = appStateState.activeTool?.type === 'text'
    const shouldQuiet = !toolIsText && (Boolean(appStateState.editingTextElement) ||
      els.some((el) => el.type === 'text' && !el.isDeleted && Boolean(appStateState.selectedElementIds[el.id])))
    setTextToolOn((prev) => (prev === toolIsText ? prev : toolIsText))
    setQuietText((prev) => (prev === shouldQuiet ? prev : shouldQuiet))
    // Track which handout page the viewport is on, for the bottom page bar.
    const pageEls = els.filter((el) => el.type === 'image' && pdfPageOf(el) !== null)
    if (pageEls.length === 0) {
      setPageInfo(null)
      setPageEdgeX(null)
    } else {
      const zoomNow = appStateState.zoom.value
      const centreY = -appStateState.scrollY + (hostRef.current?.clientHeight ?? 0) / zoomNow / 2
      let best = pageEls[0]
      let bestDist = Infinity
      for (const el of pageEls) {
        const dist = Math.abs(el.y + el.height / 2 - centreY)
        if (dist < bestDist) { bestDist = dist; best = el }
      }
      const current = pdfPageOf(best) ?? 1
      const total = pageEls.length
      setPageInfo((prev) => (prev && prev.current === current && prev.total === total ? prev : { current, total }))
      // Hug the PDF's right edge; clamped so the hot zone stays reachable when
      // the boundary slides off-screen.
      const hostW = hostRef.current?.clientWidth ?? 0
      const edge = Math.round((best.x + best.width + appStateState.scrollX) * zoomNow)
      const clamped = Math.max(6, Math.min(hostW - 6, edge))
      setPageEdgeX((prev) => (prev === clamped ? prev : clamped))
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, onSceneChange, backgroundElementId])

  const initialData = useMemo((): ExcalidrawInitialDataState => ({
    elements,
    appState: {
      ...appState,
      collaborators: new Map(),
      currentItemStrokeColor: inkColor,
      viewBackgroundColor: canvasColor,
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
    <div ref={hostRef} className={`relative h-full w-full${hideProperties ? ' board-hide-props' : ''}${hideTools ? ' board-hide-tools' : ''}${quietText ? ' board-quiet-text' : ''}${textToolOn ? ' board-text-tool' : ''}${zen ? ' board-zen' : ''}`}>
      <Excalidraw
        key={page.id}
        excalidrawAPI={(api) => { apiRef.current = api }}
        initialData={initialData}
        viewModeEnabled={!editable}
        theme={theme}
        onChange={handleChange}
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
        <button type="button" title="适应窗口：窗口大小变化时自动缩放到整页" aria-label="适应窗口" onClick={toggleFitWindow} className={`h-8 rounded-lg px-2 text-[11px] font-semibold transition ${fitWindow ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>适配</button>
        {pageInfo && (
          <button type="button" title={collapsed ? '显示讲义' : '收起讲义（腾出黑板，再点回来）'} aria-label={collapsed ? '显示讲义' : '收起讲义'} onClick={() => { const api = apiRef.current; if (api) toggleCollapse(api) }} className={`h-8 rounded-lg px-2 text-[11px] font-semibold transition ${collapsed ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{collapsed ? '显示讲义' : '收起讲义'}</button>
        )}
      </div>
      {pageInfo && (
        <div className={`absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-slate-200 bg-white/95 px-1.5 py-1 text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 ${zen ? 'bottom-16' : 'bottom-4'}`}>
          <button type="button" title="上一页" aria-label="上一页" disabled={pageInfo.current <= 1} onClick={() => { const api = apiRef.current; if (api) goToPage(api, Math.max(1, pageInfo.current - 1)) }} className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"><ChevronLeft size={15} /></button>
          <span className="min-w-[78px] text-center text-xs font-semibold tabular-nums">第 {pageInfo.current} / {pageInfo.total} 页</span>
          <button type="button" title="下一页" aria-label="下一页" disabled={pageInfo.current >= pageInfo.total} onClick={() => { const api = apiRef.current; if (api) goToPage(api, Math.min(pageInfo.total, pageInfo.current + 1)) }} className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"><ChevronRight size={15} /></button>
        </div>
      )}
      {hideTools && onToggleTools && (
        <button type="button" onClick={onToggleTools} title="显示工具栏" aria-label="显示工具栏" className="absolute left-1/2 top-2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-slate-800">
          <Paintbrush size={14} />工具栏
        </button>
      )}
      {pageInfo && (
        <button type="button" onClick={() => { const api = apiRef.current; if (api) toggleCollapse(api) }} title={collapsed ? '展开讲义（回到收起前的位置）' : '最小化讲义（收起 PDF，腾出黑板）'} aria-label={collapsed ? '展开讲义' : '最小化讲义'} className={`absolute right-4 z-10 grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-slate-800 ${zen ? 'top-14' : 'top-4'}`}>
          {collapsed ? <Maximize size={15} /> : <Minus size={15} />}
        </button>
      )}
      {pageInfo && pageEdgeX !== null && (
        <button
          type="button"
          title="按住左右拖动：往右拉放大，往左拉缩小"
          aria-label="拖动缩放讲义"
          onPointerDown={onResizeDown}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeUp}
          onPointerCancel={onResizeUp}
          style={{ left: pageEdgeX - 6 }}
          className="group absolute top-1/2 z-10 h-[70%] w-3 -translate-y-1/2 cursor-ew-resize touch-none bg-transparent"
        >
          <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-200 bg-white/90 text-slate-500 opacity-0 shadow-md backdrop-blur transition-opacity duration-150 group-hover:opacity-100 group-active:opacity-100 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300">
            <MoveHorizontal size={14} />
          </span>
        </button>
      )}
    </div>
  )
}
