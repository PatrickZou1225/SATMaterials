import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { ChevronRight, Minimize2, MoveHorizontal, X } from 'lucide-react'
import BoardSurface from './BoardSurface'
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
// blackboard with a floating, resizable handout window on top. Each layer has
// its own camera, so zooming or collapsing the PDF never scales or hides the
// notes written on the blackboard.
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
  const [winLeft, setWinLeft] = useState(12)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const measure = () => setBox({ w: host.clientWidth, h: host.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(host)
    return () => ro.disconnect()
  }, [])

  const width = Math.min(
    winW || Math.max(360, Math.round(box.w * 0.62)),
    Math.max(320, box.w - 24),
  )
  const left = Math.max(8, Math.min(winLeft, Math.max(8, box.w - width - 8)))

  const dragRef = useRef<{ x: number; left: number } | null>(null)
  const onDragDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { x: e.clientX, left }
  }
  const onDragMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const maxLeft = Math.max(8, box.w - width - 8)
    setWinLeft(Math.max(8, Math.min(drag.left + e.clientX - drag.x, maxLeft)))
  }
  const onDragUp = () => { dragRef.current = null }

  const resizeRef = useRef<{ x: number; width: number } | null>(null)
  const onResizeDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    resizeRef.current = { x: e.clientX, width }
  }
  const onResizeMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = resizeRef.current
    if (!drag) return
    const maxW = Math.max(320, box.w - left - 8)
    setWinW(Math.max(320, Math.min(drag.width + e.clientX - drag.x, maxW)))
  }
  const onResizeUp = () => { resizeRef.current = null }

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
        insertQuestion={handoutPage ? null : insertQuestion}
        onSceneChange={onSceneChange ? (scene, meta) => onSceneChange(boardPage.id, scene, meta) : undefined}
      />

      {handoutPage && (
        <div
          aria-hidden={collapsed}
          className={`absolute z-20 flex flex-col overflow-hidden rounded-xl border border-white/15 bg-slate-900/95 shadow-2xl transition-opacity duration-150 ${collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
          style={{ left, width, top: 8, height: Math.max(240, box.h - 16) }}
        >
          <div
            onPointerDown={onDragDown}
            onPointerMove={onDragMove}
            onPointerUp={onDragUp}
            onPointerCancel={onDragUp}
            className="flex h-9 shrink-0 cursor-move touch-none items-center gap-2 border-b border-white/10 bg-slate-900 px-2.5 text-white/80"
          >
            <MoveHorizontal size={14} className="shrink-0 text-white/40" />
            <span className="min-w-0 flex-1 truncate text-xs font-semibold">{handoutPage.name}</span>
            <button
              type="button"
              title="收起讲义（黑板笔记不受影响）"
              aria-label="收起讲义"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setCollapsed(true)}
              className="grid h-6 w-6 place-items-center rounded-md text-white/70 transition hover:bg-white/15"
            >
              <Minimize2 size={13} />
            </button>
            {editable && onCloseHandout && (
              <button
                type="button"
                title="关闭这份讲义（从这块板移除）"
                aria-label="关闭讲义"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={onCloseHandout}
                className="grid h-6 w-6 place-items-center rounded-md text-white/70 transition hover:bg-white/15"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="relative min-h-0 flex-1">
            <BoardSurface
              key={handoutPage.id}
              pdf={pdf}
              page={handoutPage}
              editable={editable}
              theme={theme}
              hideTools={hideTools}
              zen={zen}
              onCollapse={() => setCollapsed(true)}
              insertQuestion={insertQuestion}
              onClosePage={onCloseHandout}
              onSceneChange={onSceneChange ? (scene, meta) => onSceneChange(handoutPage.id, scene, meta) : undefined}
            />
          </div>
          <div
            role="separator"
            aria-label="拖动调整讲义窗口宽度"
            onPointerDown={onResizeDown}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeUp}
            onPointerCancel={onResizeUp}
            className="absolute right-0 top-0 z-30 h-full w-1.5 cursor-ew-resize touch-none bg-transparent hover:bg-blue-500/40"
          />
        </div>
      )}

      {handoutPage && collapsed && (
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
