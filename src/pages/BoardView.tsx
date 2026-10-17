import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Maximize, Minimize, Pencil } from 'lucide-react'
import { useAccount } from '../context/account'
import { supabase } from '../lib/supabase'
import { useFullscreen } from '../lib/fullscreen'
import { loadPdf, newId, type Board, type PDFDocumentProxy } from '../lib/board'
import { attachPageFiles, layoutPdfPages, parsePages, pdfPageOf, type BoardPage, type BoardScene, type PdfPageLayout } from '../lib/boardPages'
import { downloadBoardFiles } from '../lib/boardFiles'

const BoardSurface = lazy(() => import('../components/BoardSurface'))

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
  const [pdfLayout, setPdfLayout] = useState<PdfPageLayout[] | null>(null)
  const [pages, setPages] = useState<BoardPage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // The student's live viewport, so a flip keeps their zoom and horizontal
  // position and lands at the top/bottom edge the wheel asked for.
  const liveAppStateRef = useRef<BoardScene['appState'] | null>(null)

  useEffect(() => {
    let active = true
    void (async () => {
      if (!supabase) { if (active) { setError('尚未连接服务器。'); setLoading(false) } return }
      const { data, error: err } = await supabase.from('boards').select('*').eq('id', boardId).single()
      if (!active) return
      if (err || !data) { setError('找不到这块板书，或你没有访问权限。'); setLoading(false); return }
      const row = data as Board
      let loaded = parsePages((row as unknown as { pages: unknown }).pages)
      if (row.files_path) {
        try { loaded = attachPageFiles(loaded, await downloadBoardFiles(row.files_path)) } catch { /* drawings still load without pasted images */ }
      }
      // Open handouts with the sheet re-docked on the left, not wherever the
      // saved viewport happened to leave it.
      loaded = loaded.map((p) => (p.handout ? { ...p, scene: { ...p.scene, appState: {} } } : p))
      if (!active) return
      setBoard(row)
      setPages(loaded)
      if (row.pdf_path) {
        const { data: urlData } = supabase.storage.from('boards').getPublicUrl(row.pdf_path)
        try {
          const doc = await loadPdf(urlData.publicUrl)
          if (active) setPdf(doc)
          try {
            const layout = await layoutPdfPages(doc)
            if (active) setPdfLayout(layout)
          } catch { /* flipping unavailable; the saved page still shows */ }
        } catch {
          if (active) setError('PDF 加载失败。')
        }
      }
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

  const currentPage = pages[Math.min(currentIndex, pages.length - 1)]

  // Read-only flipping: swap the sheet and its own notes, exactly like the
  // editor — but nothing is persisted here.
  const flippingRef = useRef(false)
  const flipHandout = async (target: number, viewScrollY?: number) => {
    if (flippingRef.current) return
    const page = pages[currentIndex]
    const h = page?.handout
    if (!h || !pdf || !pdfLayout) return
    const next = Math.max(1, Math.min(h.pageCount, target))
    if (next === h.page) return
    flippingRef.current = true
    try {
      const { buildSheet } = await import('../lib/boardPdf')
      const layout = pdfLayout[next - 1]
      if (!layout) return
      const notes = page.scene.elements.filter((el) => pdfPageOf(el) === null)
      const allNotes = { ...h.notes, [h.page]: notes }
      // Rasterise the incoming page before the canvas swaps, so it paints the
      // real sheet on its first frame instead of flashing the placeholder.
      const sheet = await buildSheet(pdf, layout, allNotes[next] ?? [])
      const keptFiles = Object.fromEntries(Object.entries(page.scene.files).filter(([id]) => !id.startsWith('pdf-bm-')))
      const nextPage: BoardPage = {
        ...page,
        // New id so BoardSurface rebuilds the canvas with the new sheet.
        id: newId(),
        scene: {
          elements: sheet.elements as BoardScene['elements'],
          files: { ...keptFiles, ...sheet.files },
          // Keep the student's zoom / page position across flips; a scroll-driven
          // flip passes where the new sheet should land (top or bottom).
          appState: {
            ...(liveAppStateRef.current ?? page.scene.appState),
            ...(typeof viewScrollY === 'number' ? { scrollY: viewScrollY } : {}),
          },
        },
        handout: { ...h, page: next, notes: allNotes },
      }
      setPages((prev) => prev.map((p, i) => (i === currentIndex ? nextPage : p)))
    } finally {
      flippingRef.current = false
    }
  }

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 flex flex-col bg-slate-100 dark:bg-slate-950' : 'flex h-[calc(100vh-4rem)] flex-col bg-slate-100 dark:bg-slate-950'}>
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
          <span className="mr-auto max-w-[60%] truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{board.title}</span>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 px-1 dark:border-slate-700">
            <button type="button" onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex <= 0} className="grid h-8 w-8 place-items-center text-slate-600 disabled:opacity-30 dark:text-slate-300" aria-label="上一页"><ChevronLeft size={16} /></button>
            <span className="min-w-[64px] text-center text-xs text-slate-500">{currentIndex + 1} / {pages.length}</span>
            <button type="button" onClick={() => setCurrentIndex((i) => Math.min(pages.length - 1, i + 1))} disabled={currentIndex >= pages.length - 1} className="grid h-8 w-8 place-items-center text-slate-600 disabled:opacity-30 dark:text-slate-300" aria-label="下一页"><ChevronRight size={16} /></button>
          </div>
          {isTeacher && <Link to={`/board/${board.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><Pencil size={15} />编辑</Link>}
          <button type="button" onClick={toggleFullscreen} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" aria-label="全屏">{isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}</button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-32 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex-1 space-y-2 overflow-y-auto p-2">
            {pages.map((page, index) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`block w-full overflow-hidden rounded-lg border-2 text-left ${index === currentIndex ? 'border-blue-500' : 'border-slate-200 dark:border-slate-700'}`}
              >
                <div className="flex h-20 items-center justify-center text-xs" style={{ backgroundColor: page.background.type === 'blank' ? page.background.color : '#ffffff', color: page.background.type === 'blank' && page.background.color !== '#ffffff' ? '#e2e8f0' : '#475569' }}>
                  {page.background.type === 'pdf' ? <span className="flex flex-col items-center gap-1"><FileText size={18} />P{page.background.pdfPage}</span> : <ImageIcon size={18} />}
                </div>
                <div className="truncate bg-slate-50 px-1.5 py-1 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">{index + 1}. {page.name}</div>
              </button>
            ))}
          </div>
        </aside>

        <main className="relative min-h-0 flex-1">
          {currentPage.background.type === 'pdf' && !pdf
            ? <div className="grid h-full place-items-center text-slate-500">PDF 加载中…</div>
            : <Suspense fallback={<div className="grid h-full place-items-center text-slate-500">正在加载白板…</div>}>
                <BoardSurface key={currentPage.id} pdf={pdf} page={currentPage} editable={false} theme={theme} onFlip={currentPage.handout ? (n, viewScrollY) => void flipHandout(n, viewScrollY) : undefined} onSceneChange={(scene) => { liveAppStateRef.current = scene.appState }} />
              </Suspense>}
        </main>
      </div>
    </div>
  )
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[50vh] grid place-items-center text-slate-500">{text}</div>
}
