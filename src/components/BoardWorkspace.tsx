import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react'
import { ChevronRight, X } from 'lucide-react'
import BoardSurface, { type BoardToolState } from './BoardSurface'
import type { PDFDocumentProxy } from '../lib/board'
import type { BoardPage, BoardScene } from '../lib/boardPages'

export type BoardWorkspaceProps = {
  pdf: PDFDocumentProxy | null
  boardPage: BoardPage
  handoutPage: BoardPage | null
  // Every handout opened on this board; when there is more than one a tab strip
  // appears so the teacher can flip between them without leaving the board.
  handouts?: BoardPage[]
  editable: boolean
  theme: 'light' | 'dark'
  zen?: boolean
  railHost?: HTMLElement | null
  insertQuestion?: { title: string; text: string; originalText: string; serial: number } | null
  onSave?: () => void
  saveMenu?: ReactNode
  saveWrapRef?: Ref<HTMLDivElement>
  onSelectHandout?: (id: string) => void
  onCloseHandout?: (id: string) => void
  onSceneChange?: (pageId: string, scene: BoardScene, meta: { structural: boolean }) => void
}

// Two independent Excalidraw canvases stacked like ClassIn: a full-screen
// blackboard with the handout pane docked on the left. Each layer keeps its own
// camera, so zooming or collapsing the PDF never scales or hides the notes.
// The pane has no chrome of its own — it paints the same colour as the board,
// and the blackboard's single tool rail drives both layers.
export default function BoardWorkspace({
  pdf,
  boardPage,
  handoutPage,
  handouts = [],
  editable,
  theme,
  zen,
  railHost,
  insertQuestion,
  onSave,
  saveMenu,
  saveWrapRef,
  onSelectHandout,
  onCloseHandout,
  onSceneChange,
}: BoardWorkspaceProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  // Window geometry: 0 width means "auto" (62% of the workspace).
  const [winW, setWinW] = useState(0)
  // Maximized: the handout covers the whole workspace until toggled back.
  const [maximized, setMaximized] = useState(false)
  // Bumped on every maximize/restore so the pane refits the sheet to its new width.
  const [fitSignal, setFitSignal] = useState(0)
  const [collapsed, setCollapsed] = useState(false)
  const [tool, setTool] = useState<BoardToolState | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const measure = () => setBox({ w: host.clientWidth, h: host.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(host)
    return () => ro.disconnect()
  }, [])

  const left = 8
  const width = Math.min(
    winW || Math.max(360, Math.round(box.w * 0.62)),
    Math.max(320, box.w - left - 8),
  )

  // The drag handle lives on the PDF sheet's right edge (inside the embedded
  // surface), so the pane hugs the sheet while the sheet is stretched.
  const resizePaneTo = (next: number) => {
    const maxW = Math.max(320, box.w - left - 8)
    setMaximized(false)
    setWinW(Math.max(320, Math.min(Math.round(next), maxW)))
  }

  const toggleMaximize = () => {
    setCollapsed(false)
    setMaximized((v) => !v)
    setFitSignal((n) => n + 1)
  }

  // A 搜题 result always lands on the blackboard. If the handout window is
  // covering it full-screen, restore the window so the pasted text is visible
  // instead of landing on a canvas the teacher cannot see.
  useEffect(() => {
    if (!insertQuestion || insertQuestion.serial === 0 || !maximized) return
    setMaximized(false)
    setFitSignal((n) => n + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insertQuestion?.serial])

  const updateTool = (state: BoardToolState) => setTool((prev) => (
    prev && prev.tool === state.tool && prev.strokeColor === state.strokeColor &&
    prev.strokeWidth === state.strokeWidth && prev.fontSize === state.fontSize
      ? prev
      : state
  ))

  // Match the pane's backdrop to the blackboard so the PDF sheet reads as one
  // document floating on the same surface, not a second mini-board.
  const chromeColor = boardPage.background.type === 'blank' ? boardPage.background.color : '#000000'
  const handout = handoutPage && handoutPage.background.type === 'blank'
    ? { ...handoutPage, background: { ...handoutPage.background, color: chromeColor } }
    : handoutPage

  return (
    <div ref={hostRef} className="relative h-full w-full overflow-hidden bg-black">
      <BoardSurface
        key={boardPage.id}
        pdf={pdf}
        page={boardPage}
        editable={editable}
        theme={theme}
        zen={zen}
        railHost={railHost}
        hideZoom
        externalTool={tool}
        onToolStateChange={updateTool}
        onSave={onSave}
        saveMenu={saveMenu}
        saveWrapRef={saveWrapRef}
        insertQuestion={insertQuestion}
        onSceneChange={onSceneChange ? (scene, meta) => onSceneChange(boardPage.id, scene, meta) : undefined}
      />

      {handout && (
        <div
          aria-hidden={collapsed}
          className={`absolute z-20 overflow-hidden transition-opacity duration-150 ${collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
          style={maximized ? { left: 0, width: box.w, top: 0, height: box.h } : { left, width, top: 0, height: box.h }}
        >
          <BoardSurface
            key={handout.id}
            pdf={pdf}
            page={handout}
            editable={editable}
            theme={theme}
            zen={zen}
            embedded
            externalTool={tool}
            onToolStateChange={updateTool}
            onCollapse={() => setCollapsed(true)}
            onMaximize={toggleMaximize}
            maximized={maximized}
            fitSignal={fitSignal}
            onClosePage={onCloseHandout ? () => onCloseHandout(handout.id) : undefined}
            onResizePaneTo={resizePaneTo}
            onSceneChange={onSceneChange ? (scene, meta) => onSceneChange(handout.id, scene, meta) : undefined}
            handoutTabs={handouts.length > 0 ? (
              <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none]">
                {handouts.map((h) => (
                  <span key={h.id} className="flex shrink-0 items-center">
                    <button
                      type="button"
                      onClick={() => onSelectHandout?.(h.id)}
                      title={h.name}
                      className={`max-w-[9rem] truncate rounded-lg px-2 py-1.5 text-[11px] font-semibold transition ${h.id === handout.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                    >
                      {h.name}
                    </button>
                    {editable && onCloseHandout && (
                      <button
                        type="button"
                        onClick={() => onCloseHandout(h.id)}
                        title="关闭这份讲义"
                        aria-label="关闭这份讲义"
                        className="ml-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            ) : undefined}
          />
        </div>
      )}

      {handout && collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="absolute left-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3.5 py-2 text-sm font-semibold text-white/90 shadow-lg backdrop-blur transition hover:bg-black/90"
        >
          <ChevronRight size={15} />显示讲义
        </button>
      )}
    </div>
  )
}
