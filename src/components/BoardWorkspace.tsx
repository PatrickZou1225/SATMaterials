import { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import BoardSurface, { type BoardToolState } from './BoardSurface'
import type { PDFDocumentProxy } from '../lib/board'
import type { BoardPage, BoardScene } from '../lib/boardPages'

export type BoardWorkspaceProps = {
  pdf: PDFDocumentProxy | null
  boardPage: BoardPage
  handoutPage: BoardPage | null
  editable: boolean
  theme: 'light' | 'dark'
  hideTools?: boolean
  zen?: boolean
  insertQuestion?: { title: string; text: string; serial: number } | null
  onCloseHandout?: () => void
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
  editable,
  theme,
  hideTools,
  zen,
  insertQuestion,
  onCloseHandout,
  onSceneChange,
}: BoardWorkspaceProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  // Window geometry: 0 width means "auto" (62% of the workspace).
  const [winW, setWinW] = useState(0)
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
    setWinW(Math.max(320, Math.min(Math.round(next), maxW)))
  }

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
        hideTools={hideTools}
        zen={zen}
        hideZoom
        externalTool={tool}
        onToolStateChange={updateTool}
        insertQuestion={handoutPage ? null : insertQuestion}
        onSceneChange={onSceneChange ? (scene, meta) => onSceneChange(boardPage.id, scene, meta) : undefined}
      />

      {handout && (
        <div
          aria-hidden={collapsed}
          className={`absolute z-20 overflow-hidden transition-opacity duration-150 ${collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
          style={{ left, width, top: 0, height: box.h }}
        >
          <BoardSurface
            key={handout.id}
            pdf={pdf}
            page={handout}
            editable={editable}
            theme={theme}
            hideTools={hideTools}
            zen={zen}
            embedded
            externalTool={tool}
            onToolStateChange={updateTool}
            onCollapse={() => setCollapsed(true)}
            insertQuestion={insertQuestion}
            onClosePage={onCloseHandout}
            onResizePaneTo={resizePaneTo}
            onSceneChange={onSceneChange ? (scene, meta) => onSceneChange(handout.id, scene, meta) : undefined}
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
