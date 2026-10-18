import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Maximize, Minimize, Pencil } from 'lucide-react'
import { useAccount } from '../context/account'
import { supabase } from '../lib/supabase'
import { useFullscreen } from '../lib/fullscreen'
import { loadPdf, type Board, type PDFDocumentProxy } from '../lib/board'
import { attachPageFiles, groupBoardPages, HANDOUT_BG, layoutPdfPages, parsePages, pdfPageOf, splitBoardPages, type BoardPage } from '../lib/boardPages'
import { downloadBoardFiles } from '../lib/boardFiles'

const BoardWorkspace = lazy(() => import('../components/BoardWorkspace'))

function readTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('sat_theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function BoardView() {
  const { boardId = '' } = useParams<{ boardId: string }>()
  const account = useAccount()
  const isTeacher = account?.profile?.role === 'teacher'
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
  const theme = readTheme()
  const [board, setBoard] = useState<Board | null>(null)
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [pages, setPages] = useState<BoardPage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void (async () => {
      if (!supabase) { if (active) { setError('尚未连接服务器。'); setLoading(false) } return }
      const { data, error: err } = await supabase.from('boards').select('*').eq('id', boardId).single()
      if (!active) return
      if (err || !data) { setError('找不到这块板书，或你没有访问权限。'); setLoading(false); return }
      const row = data as Board
      let loaded = parsePages((row as unknown as { pages: unknown }).pages)
      // Old handout boards baked in a white canvas; show them on the same
      // eye-friendly backdrop the editor now uses.
      loaded = loaded.map((p) => (
        p.background.type === 'blank' && p.background.color === '#ffffff' &&
        p.scene.elements.some((el) => pdfPageOf(el) !== null)
          ? { ...p, background: { ...p.background, color: HANDOUT_BG } }
          : p
      ))
      if (row.files_path) {
        try { loaded = attachPageFiles(loaded, await downloadBoardFiles(row.files_path)) } catch { /* drawings still load without pasted images */ }
      }
      if (!active) return
      setBoard(row)
      if (row.pdf_path) {
        const { data: urlData } = supabase.storage.from('boards').getPublicUrl(row.pdf_path)
        try {
          const doc = await loadPdf(urlData.publicUrl)
          if (!active) return
          setPdf(doc)
          try {
            const layout = await layoutPdfPages(doc)
            // Boards saved while handouts were single sheets kept only the page
            // on screen; rebuild the continuous column now that page sizes are
            // known.
            if (loaded.some((p) => p.handout)) {
              const { expandHandoutPages } = await import('../lib/boardPdf')
              loaded = expandHandoutPages(loaded, layout)
            }
          } catch { /* pages stay as saved; the sheet still scrolls */ }
        } catch {
          if (active) setError('PDF 加载失败。')
        }
      }
      if (!active) return
      // Old boards mixed the PDF and the notes in one scene; split them into
      // the two layers the viewer renders side by side.
      setPages(splitBoardPages(loaded))
      setLoading(false)
    })()
    return () => { active = false }
  }, [boardId])

  if (loading) return <PageMessage text="正在加载板书…" />
  if (!board || pages.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-10 text-center">
      <p className="text-slate-500">{error || '这块板书还没有内容。'}</p>
      <Link to="/board" className="mt-4 inline-block text-blue-600 hover:underline">返回讲解区</Link>
    </div>
  )

  const pairs = useMemo(() => groupBoardPages(pages), [pages])
  const pairIndex = Math.min(currentIndex, Math.max(0, pairs.length - 1))
  const currentPair = pairs[pairIndex]

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 flex flex-col bg-slate-100 dark:bg-slate-950' : 'flex h-[calc(100vh-4rem)] flex-col bg-slate-100 dark:bg-slate-950'}>
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
          <span className="mr-auto max-w-[60%] truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{board.title}</span>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 px-1 dark:border-slate-700">
            <button type="button" onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={pairIndex <= 0} className="grid h-8 w-8 place-items-center text-slate-600 disabled:opacity-30 dark:text-slate-300" aria-label="上一页"><ChevronLeft size={16} /></button>
            <span className="min-w-[64px] text-center text-xs text-slate-500">{pairIndex + 1} / {pairs.length}</span>
            <button type="button" onClick={() => setCurrentIndex((i) => Math.min(pairs.length - 1, i + 1))} disabled={pairIndex >= pairs.length - 1} className="grid h-8 w-8 place-items-center text-slate-600 disabled:opacity-30 dark:text-slate-300" aria-label="下一页"><ChevronRight size={16} /></button>
          </div>
          {isTeacher && <Link to={`/board/${board.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><Pencil size={15} />编辑</Link>}
          <button type="button" onClick={toggleFullscreen} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" aria-label="全屏">{isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}</button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-32 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex-1 space-y-2 overflow-y-auto p-2">
            {pairs.map((pair, index) => {
              const board = pair.board
              return (
                <button
                  key={pair.key}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`block w-full overflow-hidden rounded-lg border-2 text-left ${index === pairIndex ? 'border-blue-500' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <div className="flex h-20 items-center justify-center text-xs" style={{ backgroundColor: board.background.type === 'blank' ? board.background.color : '#ffffff', color: board.background.type === 'blank' && board.background.color !== '#ffffff' ? '#e2e8f0' : '#475569' }}>
                    {pair.handout ? <span className="flex flex-col items-center gap-1"><FileText size={18} />讲义</span> : <ImageIcon size={18} />}
                  </div>
                  <div className="truncate bg-slate-50 px-1.5 py-1 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">{index + 1}. {pair.handout?.name ?? board.name}</div>
                </button>
              )
            })}
          </div>
        </aside>

        <main className="relative min-h-0 flex-1">
          <Suspense fallback={<div className="grid h-full place-items-center text-slate-500">正在加载白板…</div>}>
            <BoardWorkspace
              pdf={pdf}
              boardPage={currentPair.board}
              handoutPage={currentPair.handout ?? null}
              editable={false}
              theme={theme}
            />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[50vh] grid place-items-center text-slate-500">{text}</div>
}
