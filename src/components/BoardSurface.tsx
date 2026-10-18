import { useCallback, useEffect, useMemo, useRef, useState, type ComponentProps, type PointerEvent as ReactPointerEvent, type ReactNode, type Ref } from 'react'
import { BoxSelect, ChevronLeft, ChevronRight, Circle, Eraser, Maximize, Minus, MousePointer2, MoveHorizontal, Pencil, Save, Square, Type, X, ZoomOut } from 'lucide-react'
import { CaptureUpdateAction, convertToExcalidrawElements, Excalidraw, FONT_FAMILY, restore } from '@excalidraw/excalidraw'
import type { DataURL, ExcalidrawImperativeAPI, ExcalidrawInitialDataState, NormalizedZoomValue, ToolType } from '@excalidraw/excalidraw/types'
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
  // Collapse Excalidraw's drawing-tool palette (the top bar's brush button).
  hideTools?: boolean
  // Presentation mode: hide all of Excalidraw's own chrome (toolbar, menus).
  zen?: boolean
  // The blackboard layer keeps a fixed scale, so its zoom cluster is hidden.
  hideZoom?: boolean
  // When the surface sits in the floating handout window, its own "收起讲义"
  // button delegates to the window (which hides the whole window).
  onCollapse?: () => void
  // "最大化" of the handout window: widen it to the whole workspace.
  onMaximize?: () => void
  maximized?: boolean
  // Changes whenever the pane changes size through maximize/restore; refits the
  // sheet to the new width.
  fitSignal?: number
  // Part of the two-layer workspace: the blackboard rail is the only toolbar on
  // screen, so this surface hides its own rail, ink popups and edge controls.
  embedded?: boolean
  // Shared tool state so the single rail draws on both layers.
  externalTool?: BoardToolState | null
  onToolStateChange?: (state: BoardToolState) => void
  // Embedded handout: the page-edge drag also resizes the workspace pane, so the
  // window edge tracks the sheet's right edge while it is stretched.
  onResizePaneTo?: (width: number) => void
  // Editor actions in the drawing rail: save stays reachable even when the top
  // bar is collapsed for more canvas room.
  onSave?: () => void
  saveMenu?: ReactNode
  saveWrapRef?: Ref<HTMLDivElement>
  // One-shot request from the editor's 搜题 panel: formatted question text to
  // drop at the viewport centre. A fresh `serial` means "insert now".
  insertQuestion?: { title: string; text: string; serial: number } | null
  // The ✕ of the PDF window cluster: remove the handout board (the editor
  // confirms first). Not passed in read-only views — the button hides.
  onClosePage?: () => void
  // `structural` is false for UI-only changes (tool/ink/viewport), which lets the
  // caller avoid flagging a board dirty just because we recoloured the pen.
  onSceneChange?: (scene: BoardScene, meta: { structural: boolean }) => void
}

export type BoardToolState = {
  tool: ToolType
  strokeColor: string
  strokeWidth: number
  fontSize: number
}

// Same swatches Excalidraw's own properties panel offers: four neutral tints,
// then the vivid grid, then a rainbow wheel for a custom colour.
const INK_PALETTE = [
  '#ffffff', '#ced4da', '#495057', '#000000',
  '#e03131', '#f76707', '#f59f00', '#37b24d',
  '#15aabf', '#1971c2', '#7048e8', '#f06595',
]

const DRAW_SHAPES = [
  { type: 'freedraw', label: '画笔', Icon: Pencil },
  { type: 'line', label: '直线', Icon: Minus },
  { type: 'ellipse', label: '椭圆', Icon: Circle },
  { type: 'rectangle', label: '矩形', Icon: Square },
] as const
const DRAW_TOOL_TYPES: readonly string[] = DRAW_SHAPES.map((s) => s.type)

function InkPalette({ current, onPick }: { current: string; onPick: (color: string) => void }) {
  const isCurrent = (color: string) => current.toLowerCase() === color
  return (
    <div className="grid grid-cols-4 justify-items-center gap-2">
      {INK_PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          title={color}
          onClick={() => onPick(color)}
          style={{ background: color }}
          className={`h-7 w-7 rounded-full border transition ${isCurrent(color) ? 'border-transparent ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-white dark:ring-offset-slate-900' : 'border-black/10 dark:border-white/20'}`}
        />
      ))}
      <label
        title="自定义颜色"
        className={`relative h-7 w-7 cursor-pointer overflow-hidden rounded-full border transition ${INK_PALETTE.some(isCurrent) ? 'border-black/10 dark:border-white/20' : 'border-transparent ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-white dark:ring-offset-slate-900'}`}
      >
        <span className="absolute inset-0 block bg-[conic-gradient(#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)]" />
        <input type="color" value={current} onChange={(e) => onPick(e.target.value)} className="absolute -left-2 -top-2 h-10 w-10 cursor-pointer opacity-0" />
      </label>
    </div>
  )
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

export default function BoardSurface({ pdf, page, editable, theme, hideTools, zen, hideZoom, onCollapse, onMaximize, maximized, fitSignal, embedded, externalTool, onToolStateChange, onResizePaneTo, onSave, saveMenu, saveWrapRef, insertQuestion, onClosePage, onSceneChange }: BoardSurfaceProps) {
  const bg = useBackgroundImage(pdf, page)
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null)
  // The imperative API arrives only after Excalidraw mounts — and a page flip
  // remounts it via the `key` prop. Effects that must run against the live
  // instance depend on this state so they re-run with the new API instead of
  // bailing once on the null ref (which left flipped pages as a bare placeholder).
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null)
  const hostRef = useRef<HTMLDivElement | null>(null)
  const handleApi = useCallback((next: ExcalidrawImperativeAPI) => {
    apiRef.current = next
    setApi(next)
  }, [])

  const backgroundElementId = bg?.id ?? null

  // Percent readout for the zoom cluster (fed by onChange below).
  const [zoomPct, setZoomPct] = useState(100)
  // Current handout page (fed by onChange below), for the bottom page bar.
  const [pageInfo, setPageInfo] = useState<{ current: number; total: number } | null>(null)
  // Manual page jump: clicking the page readout swaps in a tiny input.
  const [pageInput, setPageInput] = useState<string | null>(null)
  // Screen x of the handout column's right edge, so the drag handle can hug the
  // PDF boundary instead of floating at the screen edge.
  const [pageEdgeX, setPageEdgeX] = useState<number | null>(null)
  // Screen x of the handout column's LEFT edge — the 目录 panel docks onto it
  // (inside the document, ClassIn-style) instead of floating in the margin.
  const [pageLeftX, setPageLeftX] = useState<number | null>(null)
  // The PDF's embedded outline (书签) with resolved page numbers — powers the
  // 目录 jump list. Empty when the document carries no outline.
  const [outline, setOutline] = useState<{ title: string; page: number; depth: number }[]>([])
  const [outlineOpen, setOutlineOpen] = useState(false)
  // "Fit to window": keep the page scaled to the host whenever the window
  // resizes — the reference app's "fit page to window display size" button.
  const [fitWindow] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('sat_board_fit_window') === '1')
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
  const [activeToolType, setActiveToolType] = useState<string>('selection')
  // The pen / text settings popups collapse when their rail button is clicked
  // again (the teacher asked for a way to put the popup away).
  const [penPanelOpen, setPenPanelOpen] = useState(true)
  const [textPanelOpen, setTextPanelOpen] = useState(true)
  // The brush can morph into a straight line / ellipse / rectangle (long-press
  // the rail button or pick it in the panel). The last choice sticks.
  const [drawTool, setDrawTool] = useState<'freedraw' | 'line' | 'ellipse' | 'rectangle'>('freedraw')
  // Long-press the rail brush to pop the four shape choices beside it.
  const [shapeMenuOpen, setShapeMenuOpen] = useState(false)
  const penHoldRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const penHoldFiredRef = useRef(false)
  const [marqueeMode, setMarqueeMode] = useState(false)
  const marqueeModeRef = useRef(false)
  const [quietText, setQuietText] = useState(false)
  const [inkCursor, setInkCursor] = useState({ strokeColor: '#ffffff', strokeWidth: 2, fontSize: 28 })
  // Last tool/ink combination broadcast to the workspace, so scrolls and other
  // UI-only changes do not spam the shared toolbar state.
  const reportedToolRef = useRef('')
  const textToolOn = activeToolType === 'text'
  const drawToolActive = DRAW_TOOL_TYPES.includes(activeToolType)
  const DrawIcon = DRAW_SHAPES.find((shape) => shape.type === drawTool)?.Icon ?? Pencil
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
  // own last-used colour), which left dark ink on the black board. Nudge it to
  // the legible default whenever the page or its background changes — but only
  // when the current colour is still one of Excalidraw's untouched defaults. A
  // colour the teacher picked (red, green…) must survive tool switches and
  // writing somewhere else.
  const inkColor = defaultInkColor(page.background)
  useEffect(() => {
    const api = apiRef.current
    if (!api) return
    const cur = api.getAppState().currentItemStrokeColor
    if ((cur === '#ffffff' || cur === '#1e1e1e') && cur !== inkColor) {
      api.updateScene({
        appState: { currentItemStrokeColor: inkColor },
        captureUpdate: CaptureUpdateAction.NEVER,
      })
    }
  }, [inkColor, page.id, api])

  // Mirror the shared rail onto this surface: the handout layer has no rail of
  // its own, but still has to draw with the tool the blackboard rail shows.
  useEffect(() => {
    const api = apiRef.current
    if (!api || !externalTool) return
    const app = api.getAppState()
    const currentTool = (app.activeTool?.type ?? 'selection') as ToolType
    const sameTool = currentTool === externalTool.tool
    const sameInk =
      (app.currentItemStrokeColor ?? '') === externalTool.strokeColor &&
      (app.currentItemStrokeWidth ?? 0) === externalTool.strokeWidth &&
      (app.currentItemFontSize ?? 0) === externalTool.fontSize
    if (sameTool && sameInk) return
    if (!sameTool) api.setActiveTool({ type: externalTool.tool })
    if (!sameInk) {
      api.updateScene({
        appState: {
          currentItemStrokeColor: externalTool.strokeColor,
          currentItemStrokeWidth: externalTool.strokeWidth,
          currentItemFontSize: externalTool.fontSize,
        },
        captureUpdate: CaptureUpdateAction.NEVER,
      })
    }
  }, [externalTool])

  // Text tool defaults the teacher asked for: Large size (S16 / M20 / L28 /
  // XL36) and the Normal family. Text elements copy these at creation time.
  useEffect(() => {
    apiRef.current?.updateScene({
      appState: { currentItemFontSize: 28, currentItemFontFamily: FONT_FAMILY.Nunito },
      captureUpdate: CaptureUpdateAction.NEVER,
    })
  }, [page.id, api])

  // Read the PDF's embedded outline for the 目录 list; resolve each destination
  // to a page number. Unresolvable entries are skipped, and documents without
  // an outline simply leave the list empty (the button stays hidden).
  useEffect(() => {
    let stale = false
    setOutline([])
    setOutlineOpen(false)
    if (!pdf) return
    void (async () => {
      try {
        const nodes = await pdf.getOutline()
        if (stale || !nodes || nodes.length === 0) return
        const items: { title: string; page: number; depth: number }[] = []
        const walk = async (list: typeof nodes, depth: number) => {
          for (const node of list) {
            if (stale || items.length >= 300) return
            try {
              const dest = typeof node.dest === 'string' ? await pdf.getDestination(node.dest) : node.dest
              const ref = Array.isArray(dest) ? dest[0] : null
              if (ref) {
                const index = await pdf.getPageIndex(ref as Parameters<PDFDocumentProxy['getPageIndex']>[0])
                items.push({ title: node.title.trim() || `第 ${index + 1} 页`, page: index + 1, depth })
              }
            } catch { /* skip this entry */ }
            if (node.items?.length) await walk(node.items, depth + 1)
          }
        }
        await walk(nodes, 0)
        if (!stale) setOutline(items)
      } catch { /* no outline — fine */ }
    })()
    return () => { stale = true }
  }, [pdf])

  // Land a 搜题 result on the board: one text element at the viewport centre,
  // selected so it can be dragged straight away. Captured IMMEDIATELY, so
  // Ctrl+Z takes it back off in one step.
  useEffect(() => {
    if (!insertQuestion || insertQuestion.serial === 0) return
    const api = apiRef.current
    if (!api) return
    const st = api.getAppState()
    const host = hostRef.current
    const cx = st.scrollX + (host?.clientWidth ?? 900) / 2 / st.zoom.value
    const cy = st.scrollY + (host?.clientHeight ?? 600) / 2 / st.zoom.value
    const [el] = convertToExcalidrawElements([{
      type: 'text',
      x: 0,
      y: 0,
      text: `${insertQuestion.title}\n\n${insertQuestion.text}`,
      fontSize: 20,
      fontFamily: FONT_FAMILY.Nunito,
      strokeColor: '#ffffff', // the legibility guard flips it if it lands on a page
    }])
    if (!el) return
    const placed = { ...el, x: cx - el.width / 2, y: cy - el.height / 2 }
    api.updateScene({
      elements: [...api.getSceneElements(), placed],
      appState: { selectedElementIds: { [placed.id]: true } },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insertQuestion?.serial])

  // Canvas colour behind the board: blank boards carry it on the page
  // background, handout boards on the saved scene (handouts default to the
  // blackboard look — the pages float as white sheets on black). The 背景
  // palette in BoardEditor rewrites the matching value and this effect pushes it
  // onto the live canvas — `initialData` is memoised on page.id, so it alone
  // would not repaint.
  const canvasColor = page.background.type === 'blank'
    ? page.background.color
    : (typeof page.scene.appState.viewBackgroundColor === 'string' ? page.scene.appState.viewBackgroundColor : '#000000')
  useEffect(() => {
    apiRef.current?.updateScene({ appState: { viewBackgroundColor: canvasColor }, captureUpdate: CaptureUpdateAction.NEVER })
  }, [canvasColor, page.id, api])

  const prevElementsRef = useRef<readonly unknown[] | null>(null)
  // True while any pointer is held — the settle-time ink guard must not replace
  // an element that is still being drawn/edited.
  const pointerHeldRef = useRef(false)
  const DRAW_TOOLS: readonly string[] = ['text', 'freedraw', 'rectangle', 'diamond', 'ellipse', 'arrow', 'line']

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
      // Render a page well before it scrolls into view — a full viewport ahead —
      // so continuous scrolling never lands on a grey placeholder.
      const pad = Math.max(400, host.clientHeight / zoom)
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
  }, [pdf, page.id, api])

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

  // A freshly loaded handout opens like a ClassIn document window: the page
  // docks FLUSH to the left edge at 100% (shrinking only if the window is
  // narrower than the sheet), leaving the right side of the canvas free for the
  // blackboard. The teacher can then drag the page's right edge to resize it.
  useEffect(() => {
    if (!needsFit) return
    const api = apiRef.current
    const host = hostRef.current
    if (!api || !host) return
    const first = page.scene.elements.find((el) => pdfPageOf(el) !== null)
    if (!first) return
    const raf = requestAnimationFrame(() => {
      // Horizontal margin 0: the sheet's left edge sits exactly on the board's
      // left edge, so nothing needs dragging into place on open.
      const marginTop = 24
      const zoom = Math.max(0.1, Math.min(1, host.clientWidth / first.width))
      // sceneX(screenX) = screenX / zoom - scrollX, so this parks the page's
      // top-left corner at the margin instead of centring it.
      const scrollX = -first.x
      const scrollY = marginTop / zoom - first.y
      api.updateScene({
        appState: { zoom: { value: zoom as NormalizedZoomValue }, scrollX, scrollY },
        captureUpdate: CaptureUpdateAction.NEVER,
      })
      renderVisibleRef.current()
    })
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.id, api])

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

  // "最大化" of the PDF window: fit the nearest page to the viewport WIDTH —
  // the document fills the window, its top parked at the margin.
  const maximizePage = (api: ExcalidrawImperativeAPI) => {
    const host = hostRef.current
    if (!host) return
    setCollapsed(false)
    const el = nearestPage(api)
    if (!el) return
    const zoom = Math.min(4, Math.max(0.1, (host.clientWidth - FIT_MARGIN) / el.width))
    api.updateScene({
      appState: {
        zoom: { value: zoom as NormalizedZoomValue },
        scrollX: host.clientWidth / 2 / zoom - (el.x + el.width / 2),
        scrollY: FIT_MARGIN / zoom - el.y,
      },
      captureUpdate: CaptureUpdateAction.NEVER,
    })
    lastZoomAtRef.current = Date.now()
    scheduleRenderRef.current()
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
        // Vertical only: the teacher places the sheet left/right by dragging
        // and a jump must not yank it back to centre. The old sign bug here
        // (scroll = scene − centre) parked the viewport in empty space; the
        // old horizontal recentring parked it in the middle of the canvas.
        scrollY: FIT_MARGIN / zoom - el.y,
      },
      captureUpdate: CaptureUpdateAction.NEVER,
    })
    lastZoomAtRef.current = Date.now()
    scheduleRenderRef.current()
  }

  const toggleCollapse = (api: ExcalidrawImperativeAPI) => {
    // In the two-layer workspace this surface lives inside the floating handout
    // window; collapsing means hiding that window, not panning a camera.
    if (onCollapse) { onCollapse(); return }
    const host = hostRef.current
    if (!host) return
    const app = api.getAppState()
    const zoom = app.zoom.value
    if (!collapsed) {
      const pages = pageElements(api)
      if (pages.length === 0) return
      // The blackboard lives just right of the page column. Park the page's
      // right edge exactly on the viewport's left edge: notes are usually
      // written right beside the sheet, and the old jump (half a viewport plus
      // 240) panned past them, so they looked deleted.
      const rightEdge = Math.max(...pages.map((el) => el.x + el.width))
      collapsedViewRef.current = { scrollX: app.scrollX, scrollY: app.scrollY, zoom }
      api.updateScene({
        appState: { scrollX: -rightEdge },
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
    const el = nearestPage(api)
    const dx = e.clientX - drag.startX
    // An embedded pane edge follows the hand 1:1: the scale factor is derived
    // from the sheet's on-screen width so its right edge lands exactly under the
    // pointer. The standalone board (no pane) keeps the coarser 300px ≈ 1.5x.
    const factor = onResizePaneTo && el
      ? Math.max(0.1 / drag.startZoom, Math.min(4 / drag.startZoom, 1 + dx / Math.max(1, el.width * drag.startZoom)))
      : Math.max(0.4, Math.min(2.5, 1 + dx / 300))
    applyZoom(api, drag.startZoom * factor, drag.anchorX, host.clientHeight / 2)
    if (onResizePaneTo && el) {
      const next = api.getAppState()
      const rightEdge = (el.x + el.width + next.scrollX) * next.zoom.value
      onResizePaneTo(Math.round(rightEdge + 8))
    }
  }
  const onResizeUp = () => { resizeDragRef.current = null }

  // The right-side tool rail (ClassIn layout): the handful of tools a lesson
  // needs. 框选 arms a "marquee first" selection — dragging anywhere (pages
  // included) draws a selection box instead of panning, so the teacher can
  // lasso their own text; 点击 restores the plain selection tool (drag on a
  // page = move the document).
  const setTool = (type: 'freedraw' | 'line' | 'ellipse' | 'rectangle' | 'text' | 'eraser') => {
    const api = apiRef.current
    if (!api) return
    marqueeModeRef.current = false
    setMarqueeMode(false)
    setShapeMenuOpen(false)
    api.setActiveTool({ type })
  }
  // Long-press the brush badge to morph it into a line / ellipse / rectangle.
  // A plain click still toggles the settings panel; the click that follows a
  // held press is swallowed so it does not immediately close the shape menu.
  const endPenHold = () => {
    if (penHoldRef.current) { clearTimeout(penHoldRef.current); penHoldRef.current = null }
  }
  const startPenHold = () => {
    penHoldFiredRef.current = false
    penHoldRef.current = setTimeout(() => {
      penHoldFiredRef.current = true
      setPenPanelOpen(false)
      setShapeMenuOpen(true)
      if (!drawToolActive) {
        marqueeModeRef.current = false
        setMarqueeMode(false)
        apiRef.current?.setActiveTool({ type: drawTool })
      }
    }, 450)
  }
  const onPenClick = () => {
    if (penHoldFiredRef.current) { penHoldFiredRef.current = false; return }
    if (shapeMenuOpen) { setShapeMenuOpen(false); return }
    if (drawToolActive) setPenPanelOpen((v) => !v)
    else { setPenPanelOpen(true); setTool(drawTool) }
  }
  // The shape row is a picker, not a settings panel: tapping anywhere else
  // (canvas or another tool) dismisses it.
  useEffect(() => {
    if (!shapeMenuOpen) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest('.board-tool-rail') || target?.closest('[data-shape-menu]')) return
      setShapeMenuOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [shapeMenuOpen])
  // Pen / text settings popups: apply to the pending tool values, and — when
  // the teacher has picked a tool that is already selected elements of that
  // kind — restyle those too, the way Excalidraw's own panel would.
  const applyInk = (kind: 'pen' | 'text', patch: { strokeColor?: string; strokeWidth?: number; fontSize?: number }) => {
    const api = apiRef.current
    if (!api) return
    const st = api.getAppState()
    const matchTypes = kind === 'pen' ? [...DRAW_TOOL_TYPES, 'diamond', 'arrow'] : ['text']
    let changed = false
    const elements = api.getSceneElements().map((el) => {
      if (!st.selectedElementIds[el.id] || el.isDeleted || !matchTypes.includes(el.type)) return el
      const next = kind === 'pen'
        ? { ...el, ...(patch.strokeColor ? { strokeColor: patch.strokeColor } : {}), ...(patch.strokeWidth ? { strokeWidth: patch.strokeWidth } : {}) }
        : { ...el, ...(patch.strokeColor ? { strokeColor: patch.strokeColor } : {}), ...(patch.fontSize !== undefined ? { fontSize: patch.fontSize } : {}) }
      changed = true
      return next
    })
    // The three currentItem* fields come as one required group in the API —
    // fill the untouched ones from the live state.
    const appStatePatch = {
      currentItemStrokeColor: patch.strokeColor ?? st.currentItemStrokeColor,
      currentItemStrokeWidth: patch.strokeWidth ?? st.currentItemStrokeWidth,
      currentItemFontSize: patch.fontSize ?? st.currentItemFontSize,
    }
    api.updateScene({
      elements: changed ? elements : api.getSceneElements(),
      appState: appStatePatch,
      captureUpdate: changed ? CaptureUpdateAction.IMMEDIATELY : CaptureUpdateAction.NEVER,
    })
  }

  const selectTool = (marquee: boolean) => {
    const api = apiRef.current
    if (!api) return
    marqueeModeRef.current = marquee
    setMarqueeMode(marquee)
    setShapeMenuOpen(false)
    api.setActiveTool({ type: 'selection' })
  }

  // The pointer workhorse (capture phase — Excalidraw swallows bubble-phase
  // pointer events): (1) with a draw tool, pre-pick the default ink colour by
  // where the pen lands on a handout board; (2) with the selection tool, drag
  // on a page pans the viewport — like grabbing the document window, so the
  // sheet travels with its annotations; (3) tracks the held pointer so the
  // settle-time colour guard never replaces an element mid-stroke.
  useEffect(() => {
    const host = hostRef.current
    if (!host || !editable) return
    let drag: { id: number; startX: number; startY: number; scrollX: number; scrollY: number; moved?: boolean } | null = null
    const onPage = (clientX: number, clientY: number) => {
      const api = apiRef.current
      if (!api) return false
      const st = api.getAppState()
      const rect = host.getBoundingClientRect()
      const sceneX = (clientX - rect.left) / st.zoom.value - st.scrollX
      const sceneY = (clientY - rect.top) / st.zoom.value - st.scrollY
      return api.getSceneElements().some((el) =>
        el.type === 'image' && !el.isDeleted && pdfPageOf(el) !== null &&
        sceneX >= el.x && sceneX <= el.x + el.width && sceneY >= el.y && sceneY <= el.y + el.height)
    }
    // Any element the teacher drew or pasted (text, screenshot, stroke) — but
    // not the locked handout pages. A press on one of these belongs to
    // Excalidraw (select / move it), not to our page-pan gesture.
    const onTeacherElement = (clientX: number, clientY: number) => {
      const api = apiRef.current
      if (!api) return false
      const st = api.getAppState()
      const rect = host.getBoundingClientRect()
      const sceneX = (clientX - rect.left) / st.zoom.value - st.scrollX
      const sceneY = (clientY - rect.top) / st.zoom.value - st.scrollY
      return api.getSceneElements().some((el) =>
        !el.isDeleted && !el.locked &&
        sceneX >= el.x && sceneX <= el.x + el.width && sceneY >= el.y && sceneY <= el.y + el.height)
    }
    const onDown = (e: PointerEvent) => {
      pointerHeldRef.current = true
      if (e.button !== 0) return
      const api = apiRef.current
      if (!api) return
      const t = e.target as HTMLElement | null
      if (t && t.closest('button, [data-board-scroll]')) return
      const tool = api.getAppState().activeTool.type
      // Before a draw tool starts an element on a handout board, pick the
      // default ink for where the pen lands: white belongs on the black canvas,
      // dark on a white page. Only the two default inks are switched — a
      // deliberately chosen colour is never overridden.
      if (DRAW_TOOLS.includes(tool) && api.getSceneElements().some((el) => el.type === 'image' && pdfPageOf(el) !== null)) {
        const want = onPage(e.clientX, e.clientY) ? '#1e1e1e' : '#ffffff'
        const cur = api.getAppState().currentItemStrokeColor
        if ((cur === '#ffffff' || cur === '#1e1e1e') && cur !== want) {
          api.updateScene({ appState: { currentItemStrokeColor: want }, captureUpdate: CaptureUpdateAction.NEVER })
        }
        return
      }
      if (tool !== 'selection' || marqueeModeRef.current) return
      if (!onPage(e.clientX, e.clientY)) return
      // Pressing the teacher's own text / screenshot must move that element, not
      // the page underneath it.
      if (onTeacherElement(e.clientX, e.clientY)) return
      const st = api.getAppState()
      drag = { id: e.pointerId, startX: e.clientX, startY: e.clientY, scrollX: st.scrollX, scrollY: st.scrollY }
    }
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return
      drag.moved = true
      const api = apiRef.current
      if (!api) return
      const zoom = api.getAppState().zoom.value
      // Grab-and-pull: the scene point under the hand stays under the hand,
      // so the scroll follows the drag (screen = (scene + scroll) * zoom).
      api.updateScene({
        appState: { scrollX: drag.scrollX + dx / zoom, scrollY: drag.scrollY + dy / zoom },
        captureUpdate: CaptureUpdateAction.NEVER,
      })
      scheduleRenderRef.current()
    }
    const onUp = (e: PointerEvent) => {
      pointerHeldRef.current = false
      if (!drag || e.pointerId !== drag.id) return
      const moved = drag.moved
      drag = null
      // Excalidraw treats a press on a locked page as empty canvas and draws a
      // marquee; drop whatever it selected while we were panning.
      if (moved) {
        const api = apiRef.current
        if (api) queueMicrotask(() => api.updateScene({ appState: { selectedElementIds: {} }, captureUpdate: CaptureUpdateAction.NEVER }))
      }
    }
    // Capture phase everywhere: Excalidraw's canvas swallows the bubble-phase
    // pointer events (it pointer-captures and stops propagation mid-drag).
    host.addEventListener('pointerdown', onDown, true)
    window.addEventListener('pointermove', onMove, true)
    window.addEventListener('pointerup', onUp, true)
    window.addEventListener('pointercancel', onUp, true)
    return () => {
      host.removeEventListener('pointerdown', onDown, true)
      window.removeEventListener('pointermove', onMove, true)
      window.removeEventListener('pointerup', onUp, true)
      window.removeEventListener('pointercancel', onUp, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable])

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

  // Maximize/restore changes the pane width; stretch the sheet to the new width
  // the way a document viewer would. The wait lets the pane's new width land in
  // layout before it is measured.
  useEffect(() => {
    if (!fitSignal) return
    const timer = window.setTimeout(() => {
      const api = apiRef.current
      const host = hostRef.current
      if (!api || !host) return
      const el = nearestPage(api)
      if (!el) return
      const zoom = Math.max(0.1, Math.min(4, host.clientWidth / el.width))
      applyZoom(api, zoom, host.clientWidth / 2, host.clientHeight / 2)
      // Keep the sheet flush with the pane's left edge, like a document page.
      api.updateScene({
        appState: { scrollX: -el.x, scrollY: api.getAppState().scrollY },
        captureUpdate: CaptureUpdateAction.NEVER,
      })
    }, 80)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitSignal])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const onWheel = (e: WheelEvent) => {
      const api = apiRef.current
      if (!api) return
      // Let an in-canvas text box scroll its own content.
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.isContentEditable)) return
      // …and never hijack the wheel over our own floating panels (the 目录
      // list) — scrolling those used to move the board instead, which slid the
      // handout out of view and made the list impossible to scroll.
      if (target && target.closest('[data-board-scroll]')) return
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
        // Plain wheel / two-finger swipe: scroll the document straight up/down.
        // The whole PDF is one tall column, so the hand never stops at a page
        // edge — one continuous scroll from the first page to the last.
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
    // Scrolling/panning can bring new handout pages into view.
    scheduleRenderRef.current()
    setZoomPct(Math.round(appStateState.zoom.value * 100))
    // Drive the font gate above: remember whether the text tool is on, and
    // whether a text is only selected / being edited. Excalidraw pops the
    // island for all three cases (see showSelectedShapeActions); the teacher
    // wants the options only in the first.
    const inkNow = {
      strokeColor: appStateState.currentItemStrokeColor ?? '#ffffff',
      strokeWidth: appStateState.currentItemStrokeWidth ?? 2,
      fontSize: appStateState.currentItemFontSize ?? 28,
    }
    setInkCursor((prev) => (prev.strokeColor === inkNow.strokeColor && prev.strokeWidth === inkNow.strokeWidth && prev.fontSize === inkNow.fontSize ? prev : inkNow))
    const toolType = appStateState.activeTool?.type ?? 'selection'
    if (toolType !== 'selection' && marqueeModeRef.current) {
      marqueeModeRef.current = false
      setMarqueeMode(false)
    }
    setActiveToolType((prev) => (prev === toolType ? prev : toolType))
    const toolKey = `${toolType}|${inkNow.strokeColor}|${inkNow.strokeWidth}|${inkNow.fontSize}`
    if (toolKey !== reportedToolRef.current) {
      reportedToolRef.current = toolKey
      onToolStateChange?.({ tool: toolType as ToolType, ...inkNow })
    }
    const toolIsText = toolType === 'text'
    const shouldQuiet = !toolIsText && (Boolean(appStateState.editingTextElement) ||
      els.some((el) => el.type === 'text' && !el.isDeleted && Boolean(appStateState.selectedElementIds[el.id])))
    setQuietText((prev) => (prev === shouldQuiet ? prev : shouldQuiet))
    // Track which handout page the viewport is on, for the bottom page bar.
    const pageEls = els.filter((el) => el.type === 'image' && pdfPageOf(el) !== null)
    if (pageEls.length === 0) {
      setPageInfo(null)
      setPageEdgeX(null)
      setPageLeftX(null)
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
      // A single-board handout knows its whole page count even though only the
      // current sheet is in the scene.
      const total = page.handout?.pageCount ?? pageEls.length
      setPageInfo((prev) => (prev && prev.current === current && prev.total === total ? prev : { current, total }))
      // Hug the PDF's right edge; clamped so the hot zone stays reachable when
      // the boundary slides off-screen.
      const hostW = hostRef.current?.clientWidth ?? 0
      const edge = Math.round((best.x + best.width + appStateState.scrollX) * zoomNow)
      const clamped = Math.max(6, Math.min(hostW - 6, edge))
      setPageEdgeX((prev) => (prev === clamped ? prev : clamped))
      const leftEdge = Math.round((best.x + appStateState.scrollX) * zoomNow)
      const clampedLeft = Math.max(6, Math.min(hostW - 6, leftEdge))
      setPageLeftX((prev) => (prev === clampedLeft ? prev : clampedLeft))
    }
    // Legibility guard for ink: the white default belongs on the black canvas,
    // but text / pen strokes / shape outlines that land on (or are dragged onto)
    // a white handout page would vanish. Flip only between the two default inks
    // and only when the position demands it — deliberately chosen colours are
    // never touched. The flip converges, so the updateScene below cannot loop
    // back through this handler.
    // Settle-time only — never touch an element the teacher is still creating
    // or editing (replacing it mid-stroke kills the in-progress element).
    if (pageEls.length > 0 && !pointerHeldRef.current && !appStateState.editingTextElement) {
      const INK_TYPES: readonly string[] = ['text', 'freedraw', 'rectangle', 'diamond', 'ellipse', 'arrow', 'line']
      const next = els.map((el) => {
        if (el.isDeleted || !INK_TYPES.includes(el.type)) return el
        if (el.type === 'text' && el.containerId) return el
        const colour = el.strokeColor
        if (colour !== '#ffffff' && colour !== '#1e1e1e') return el
        const cx = el.x + el.width / 2
        const cy = el.y + el.height / 2
        const onPage = pageEls.some((p) => cx >= p.x && cx <= p.x + p.width && cy >= p.y && cy <= p.y + p.height)
        const want = onPage ? '#1e1e1e' : '#ffffff'
        return want === colour ? el : { ...el, strokeColor: want }
      })
      if (next.some((el, i) => el !== els[i])) {
        queueMicrotask(() => {
          apiRef.current?.updateScene({
            elements: next as never,
            captureUpdate: CaptureUpdateAction.NEVER,
          })
        })
      }
    }
    if (!onSceneChange) return
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
      currentItemFontSize: 28,
      currentItemFontFamily: FONT_FAMILY.Nunito,
      viewBackgroundColor: canvasColor,
      gridSize: page.background.type === 'blank' && page.background.grid ? 20 : undefined,
      gridModeEnabled: page.background.type === 'blank' ? page.background.grid : false,
    },
    files,
    scrollToContent: false,
  }), [elements, appState, files, page.id])

  return (
    <div ref={hostRef} className={`relative h-full w-full${hideTools ? ' board-hide-tools' : ''}${quietText ? ' board-quiet-text' : ''}${textToolOn ? ' board-text-tool' : ''}${drawToolActive ? ' board-draw-tool' : ''}${zen ? ' board-zen' : ''}`}>
      <Excalidraw
        key={page.id}
        excalidrawAPI={handleApi}
        initialData={initialData}
        viewModeEnabled={!editable}
        theme={theme}
        onChange={handleChange}
        // Trim Excalidraw's ☰ menu down to what this board uses: its "Canvas
        // background" row fights the 背景 palette (light swatches only), and its
        // "Export image…" dialog exports the raw scene (handout rasters, a
        // transparent-checkerboard preview, no close button) — our own 导出长图 /
        // 复制图片 covers exporting.
        UIOptions={{ canvasActions: { changeViewBackgroundColor: false, saveAsImage: false } }}
      />
      {!hideZoom && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-0.5 rounded-xl border border-slate-200 bg-white/95 p-1 text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
          <button type="button" title={maximized ? '还原窗口' : '最大化（讲义铺满工作区）'} aria-label="最大化" onClick={onMaximize} disabled={!onMaximize} className={`grid h-8 w-8 place-items-center rounded-lg transition disabled:opacity-40 ${maximized ? 'bg-blue-600 text-white hover:bg-blue-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Maximize size={16} /></button>
          <button type="button" title="最小化（收起讲义，腾出黑板）" aria-label="最小化" onClick={() => { const api = apiRef.current; if (api) toggleCollapse(api) }} className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800"><Minus size={16} /></button>
          <button type="button" title={`100% 显示（当前 ${zoomPct}%）`} aria-label="100% 显示" onClick={() => { const api = apiRef.current; const host = hostRef.current; if (api && host) applyZoom(api, 1, host.clientWidth / 2, host.clientHeight / 2) }} className="h-8 rounded-lg px-2 text-[11px] font-semibold tabular-nums transition hover:bg-slate-100 dark:hover:bg-slate-800">{zoomPct}%</button>
        </div>
      )}
      {pageInfo && (
        <div className={`absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-slate-200 bg-white/95 px-1.5 py-1 text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 ${zen ? 'bottom-16' : 'bottom-4'}`}>
          {outline.length > 0 && (
            <>
              <button type="button" title="PDF 目录（书签）" aria-label="目录" onClick={() => setOutlineOpen((v) => !v)} className={`h-7 rounded-full px-2.5 text-[11px] font-semibold transition ${outlineOpen ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>目录</button>
              <span className="mx-0.5 h-4 w-px bg-slate-200 dark:bg-slate-700" />
            </>
          )}
          <button type="button" title="上一页" aria-label="上一页" disabled={pageInfo.current <= 1} onClick={() => { const api = apiRef.current; if (api) goToPage(api,Math.max(1, pageInfo.current - 1)) }} className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"><ChevronLeft size={15} /></button>
          {pageInput === null ? (
            <button type="button" title="点击输入页码跳转" onClick={() => setPageInput(String(pageInfo.current))} className="min-w-[78px] rounded-full px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums transition hover:bg-slate-100 dark:hover:bg-slate-800">第 {pageInfo.current} / {pageInfo.total} 页</button>
          ) : (
            <span className="flex items-center gap-1 px-1">
              <input
                autoFocus
                value={pageInput}
                inputMode="numeric"
                onChange={(e) => setPageInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const n = Number(pageInput)
                    if (n >= 1 && n <= pageInfo.total) {
                      const api = apiRef.current
                      if (api) goToPage(api,n)
                    }
                    setPageInput(null)
                  } else if (e.key === 'Escape') {
                    setPageInput(null)
                  }
                }}
                onBlur={() => setPageInput(null)}
                className="w-14 rounded-md border border-slate-300 bg-transparent px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums focus:border-blue-400 focus:outline-none dark:border-slate-600"
              />
              <span className="text-xs text-slate-500">/ {pageInfo.total} 页</span>
            </span>
          )}
          <button type="button" title="下一页" aria-label="下一页" disabled={pageInfo.current >= pageInfo.total} onClick={() => { const api = apiRef.current; if (api) goToPage(api,Math.min(pageInfo.total, pageInfo.current + 1)) }} className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"><ChevronRight size={15} /></button>
        </div>
      )}
      {outlineOpen && outline.length > 0 && (
        <div data-board-scroll style={{ left: pageLeftX === null ? 12 : Math.max(8, pageLeftX + 8), top: zen ? 56 : 12 }} className="absolute z-20 flex max-h-[60%] w-64 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/95 text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
          <p className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-400 dark:border-slate-800">PDF 目录</p>
          <div className="overflow-y-auto py-1">
            {outline.map((item, i) => (
              <button
                key={`${item.page}-${i}`}
                type="button"
                title={item.title}
                onClick={() => { const api = apiRef.current; if (api) goToPage(api,item.page) }}
                style={{ paddingLeft: 12 + item.depth * 14 }}
                className={`block w-full truncate py-1.5 pr-3 text-left text-xs transition hover:bg-slate-100 dark:hover:bg-slate-800 ${pageInfo && item.page === pageInfo.current ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      )}
      {editable && !hideTools && !embedded && shapeMenuOpen && (
        <div data-board-scroll data-shape-menu className={`absolute top-1/2 z-30 flex -translate-y-1/2 items-center gap-1 rounded-2xl border p-1.5 backdrop-blur ${zen ? 'right-[120px] border-white/15 bg-black/60' : 'right-[68px] border-slate-200 bg-white/95 shadow-sm dark:border-slate-700 dark:bg-slate-900/95'}`}>
          {DRAW_SHAPES.map(({ type, label, Icon }) => (
            <button
              key={type}
              type="button"
              title={label}
              aria-label={label}
              onClick={() => { setDrawTool(type); setTool(type); setPenPanelOpen(true) }}
              className={`grid h-9 w-9 place-items-center rounded-xl transition ${drawTool === type ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      )}
      {editable && !hideTools && !embedded && DRAW_TOOL_TYPES.includes(activeToolType) && penPanelOpen && (
        <div data-board-scroll className={`absolute top-1/2 z-20 flex w-48 -translate-y-1/2 flex-col gap-2.5 rounded-2xl border p-2.5 backdrop-blur ${zen ? 'right-[120px] border-white/15 bg-black/60' : 'right-[68px] border-slate-200 bg-white/95 shadow-sm dark:border-slate-700 dark:bg-slate-900/95'}`}>
          <div className="flex items-center gap-1">
            {DRAW_SHAPES.map(({ type, label, Icon }) => (
              <button
                key={type}
                type="button"
                title={label}
                aria-label={label}
                onClick={() => { setDrawTool(type); setTool(type) }}
                className={`grid h-9 flex-1 place-items-center rounded-lg transition ${activeToolType === type ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 4].map((w) => (
              <button key={w} type="button" title={`粗细 ${w}`} aria-label={`粗细 ${w}`} onClick={() => applyInk('pen', { strokeWidth: w })} className={`grid h-8 flex-1 place-items-center rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800 ${inkCursor.strokeWidth === w ? 'bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-600' : 'text-slate-600 dark:text-slate-200'}`}>
                <span className="block w-5 rounded bg-current" style={{ height: w === 1 ? 2 : w === 2 ? 3 : 5 }} />
              </button>
            ))}
          </div>
          <InkPalette current={inkCursor.strokeColor} onPick={(color) => applyInk('pen', { strokeColor: color })} />
        </div>
      )}
      {editable && !hideTools && !embedded && activeToolType === 'text' && textPanelOpen && (
        <div data-board-scroll className={`absolute top-1/2 z-20 flex w-44 -translate-y-1/2 flex-col gap-2 rounded-2xl border p-2.5 backdrop-blur ${zen ? 'right-[120px] border-white/15 bg-black/60' : 'right-[68px] border-slate-200 bg-white/95 shadow-sm dark:border-slate-700 dark:bg-slate-900/95'}`}>
          <div className="flex items-center gap-1">
            {[{ label: 'S', size: 16 }, { label: 'M', size: 20 }, { label: 'L', size: 28 }, { label: 'XL', size: 36 }].map(({ label, size }) => (
              <button key={label} type="button" title={`字号 ${label}（${size}px）`} aria-label={`字号 ${label}`} onClick={() => applyInk('text', { fontSize: size })} className={`h-8 flex-1 rounded-lg text-xs font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800 ${inkCursor.fontSize === size ? 'bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-600' : 'text-slate-600 dark:text-slate-200'}`}>{label}</button>
            ))}
          </div>
          <InkPalette current={inkCursor.strokeColor} onPick={(color) => applyInk('text', { strokeColor: color })} />
        </div>
      )}
      {editable && !hideTools && !embedded && (
        <div className={`board-tool-rail absolute top-1/2 z-20 flex -translate-y-1/2 flex-col gap-0.5 rounded-2xl border p-1.5 backdrop-blur ${zen ? 'right-[64px] border-white/15 bg-black/60' : 'right-3 border-slate-200 bg-white/95 shadow-sm dark:border-slate-700 dark:bg-slate-900/95'}`}>
          <button type="button" title="点击（选中/移动）" aria-label="点击" onClick={() => selectTool(false)} className={`grid h-9 w-9 place-items-center rounded-xl transition ${activeToolType === 'selection' && !marqueeMode ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}><MousePointer2 size={17} /></button>
          <button type="button" title="框选（圈住自己写的内容）" aria-label="框选" onClick={() => selectTool(true)} className={`grid h-9 w-9 place-items-center rounded-xl transition ${activeToolType === 'selection' && marqueeMode ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}><BoxSelect size={17} /></button>
          <button type="button" title="画笔（长按切换直线 / 椭圆 / 矩形）" aria-label="画笔" onPointerDown={startPenHold} onPointerUp={endPenHold} onPointerLeave={endPenHold} onPointerCancel={endPenHold} onClick={onPenClick} className={`grid h-9 w-9 place-items-center rounded-xl transition ${drawToolActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}><DrawIcon size={17} /></button>
          <button type="button" title="文字" aria-label="文字" onClick={() => { if (activeToolType === 'text') setTextPanelOpen((v) => !v); else { setTextPanelOpen(true); setTool('text') } }} className={`grid h-9 w-9 place-items-center rounded-xl transition ${activeToolType === 'text' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}><Type size={17} /></button>
          <button type="button" title="橡皮" aria-label="橡皮" onClick={() => setTool('eraser')} className={`grid h-9 w-9 place-items-center rounded-xl transition ${activeToolType === 'eraser' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}><Eraser size={17} /></button>
          {onSave && !zen && (
            <>
              <span className="my-0.5 h-px w-6 self-center bg-slate-200 dark:bg-slate-700" />
              <div ref={saveWrapRef} className="relative">
                <button type="button" title="保存板书" aria-label="保存板书" onClick={onSave} className="grid h-9 w-9 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"><Save size={17} /></button>
                {saveMenu}
              </div>
            </>
          )}
        </div>
      )}
      {pageInfo && collapsed && (
        <button type="button" onClick={() => { const api = apiRef.current; if (api) toggleCollapse(api) }} title="展开讲义（回到收起前的位置）" aria-label="展开讲义" className={`absolute right-4 z-10 grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-slate-800 ${zen ? 'top-14' : 'top-4'}`}>
          <Maximize size={15} />
        </button>
      )}
      {!embedded && pageInfo && !collapsed && pageEdgeX !== null && (
        <div className="absolute z-10 flex -translate-x-full items-center gap-0.5 rounded-xl border border-slate-200 bg-white/95 p-0.5 text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200" style={{ left: Math.max(164, pageEdgeX - 8), top: zen ? 56 : 12 }}>
          <button type="button" onClick={() => { const api = apiRef.current; if (api) maximizePage(api) }} title="最大化（页面铺满窗口宽度）" aria-label="最大化" className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800"><Maximize size={15} /></button>
          <button type="button" onClick={() => { const api = apiRef.current; if (api) toggleCollapse(api) }} title="最小化（收起讲义，腾出黑板）" aria-label="最小化" className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800"><Minus size={15} /></button>
          <button type="button" onClick={() => { const api = apiRef.current; if (api) zoomByStep(api, 1 / 1.25) }} title="缩小一档" aria-label="缩小" className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800"><ZoomOut size={15} /></button>
          {onClosePage && (
            <button type="button" onClick={onClosePage} title="关闭这份讲义（从这块板移除）" aria-label="关闭" className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800"><X size={15} /></button>
          )}
        </div>
      )}
      {pageInfo && pageEdgeX !== null && (
        <button
          type="button"
          aria-label={embedded ? '拖动调整讲义宽度' : '拖动缩放讲义'}
          onPointerDown={onResizeDown}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeUp}
          onPointerCancel={onResizeUp}
          style={{ left: pageEdgeX - 8 }}
          className="group absolute top-1/2 z-10 h-[70%] w-4 -translate-y-1/2 cursor-ew-resize touch-none bg-transparent"
        >
          {/* Just the arrow, only while the pointer is near the page edge. */}
          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-500 opacity-0 drop-shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-active:opacity-100 dark:text-slate-300">
            <MoveHorizontal size={16} />
          </span>
        </button>
      )}
    </div>
  )
}
