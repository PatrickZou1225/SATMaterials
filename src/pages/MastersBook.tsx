import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Download, Expand, RefreshCw, Upload } from 'lucide-react'
import { supabase } from '../lib/supabase'

const BUCKET = 'private-books'
const FILE_PATH = 'masters-book-26spr.pdf'
const TOTAL_PAGES = 157

const chapters = [
  { title: '封面与目录', subtitle: 'Introduction', page: 1 },
  { title: '词汇题', subtitle: 'Verbals', page: 4 },
  { title: '目的题', subtitle: 'Function, Structure, Purpose', page: 17 },
  { title: '双篇题', subtitle: 'Cross-Texts', page: 40 },
  { title: '循证题', subtitle: 'Support / Weaken', page: 54 },
  { title: '图表题', subtitle: 'Quantitatives', page: 79 },
  { title: '推断题', subtitle: 'Inference', page: 107 },
  { title: '其他考点', subtitle: 'Other Key Points', page: 138 },
  { title: '复杂句与文学', subtitle: 'Complex Sentences / Literature', page: 147 },
]

type LoadState = 'loading' | 'ready' | 'missing' | 'error'

export default function MastersBook() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(() => {
    const stored = Number(window.localStorage.getItem('masters_book_page'))
    return Number.isInteger(stored) && stored >= 1 && stored <= TOTAL_PAGES ? stored : 1
  })
  const [pageInput, setPageInput] = useState(String(page))
  const [fileUrl, setFileUrl] = useState('')
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  const loadBook = useCallback(async () => {
    if (!supabase) {
      setLoadState('error')
      setMessage('网站尚未连接私有存储。')
      return
    }

    setLoadState('loading')
    setMessage('')
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(FILE_PATH, 60 * 60 * 4)
    if (error) {
      setLoadState(error.message.toLowerCase().includes('not found') ? 'missing' : 'error')
      setMessage(error.message.toLowerCase().includes('not found') ? '' : '暂时无法读取讲义，请稍后重试。')
      return
    }

    setFileUrl(data.signedUrl)
    setLoadState('ready')
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => void loadBook(), 0)
    return () => window.clearTimeout(timer)
  }, [loadBook])

  useEffect(() => {
    window.localStorage.setItem('masters_book_page', String(page))
  }, [page])

  const goToPage = (nextPage: number) => {
    if (!Number.isFinite(nextPage)) {
      setPageInput(String(page))
      return
    }
    const safePage = Math.min(TOTAL_PAGES, Math.max(1, Math.round(nextPage)))
    setPage(safePage)
    setPageInput(String(safePage))
  }

  const uploadBook = async (file: File) => {
    if (!supabase) return
    setUploading(true)
    setMessage('')
    const { error } = await supabase.storage.from(BUCKET).upload(FILE_PATH, file, {
      cacheControl: '3600',
      contentType: 'application/pdf',
      upsert: true,
    })
    setUploading(false)
    if (error) {
      setMessage(`上传失败：${error.message}`)
      return
    }
    await loadBook()
  }

  const viewerUrl = fileUrl ? `${fileUrl}#page=${page}&zoom=page-width&view=FitH` : ''

  if (loadState !== 'ready') {
    return (
      <div className="min-h-[70vh] grid place-items-center px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
          <BookOpen className="mx-auto mb-4 text-blue-600 dark:text-blue-400" size={42} />
          <h1 className="text-2xl font-bold">大师之书</h1>
          {loadState === 'loading' && <p className="mt-3 text-slate-500">正在打开私人讲义…</p>}
          {loadState === 'missing' && (
            <>
              <p className="mt-3 text-slate-500 dark:text-slate-400">私有书库已经准备好，请上传原始 PDF。</p>
              <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
                <Upload size={18} />
                {uploading ? '正在上传…' : '选择并上传 PDF'}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  disabled={uploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) void uploadBook(file)
                  }}
                />
              </label>
            </>
          )}
          {loadState === 'error' && (
            <button type="button" onClick={() => void loadBook()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              <RefreshCw size={18} />重新连接
            </button>
          )}
          {message && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{message}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-5 sm:px-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">大师之书</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Master&apos;s Book · 26 Spring · 私人讲义</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={fileUrl} download className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
            <Download size={17} />下载
          </a>
          <button type="button" onClick={() => void viewerRef.current?.requestFullscreen()} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Expand size={17} />全屏
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
          <div className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">章节目录</div>
          <nav className="space-y-1">
            {chapters.map((chapter) => {
              const nextChapter = chapters[chapters.indexOf(chapter) + 1]
              const active = page >= chapter.page && (!nextChapter || page < nextChapter.page)
              return (
                <button key={chapter.page} type="button" onClick={() => goToPage(chapter.page)} className={`w-full rounded-xl px-3 py-2.5 text-left transition ${active ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <span className="block text-sm font-semibold">{chapter.title}</span>
                  <span className="mt-0.5 block text-xs text-slate-400">{chapter.subtitle} · 第 {chapter.page} 页</span>
                </button>
              )
            })}
          </nav>
        </aside>

        <section ref={viewerRef} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 shadow-sm fullscreen:rounded-none fullscreen:border-0">
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2">
            <button type="button" onClick={() => goToPage(page - 1)} disabled={page === 1} className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800" aria-label="上一页"><ChevronLeft size={20} /></button>
            <form onSubmit={(event) => { event.preventDefault(); goToPage(Number(pageInput)) }} className="flex items-center gap-2 text-sm">
              <span>第</span>
              <input value={pageInput} onChange={(event) => setPageInput(event.target.value)} inputMode="numeric" className="w-16 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-center" aria-label="页码" />
              <span>/ {TOTAL_PAGES} 页</span>
            </form>
            <button type="button" onClick={() => goToPage(page + 1)} disabled={page === TOTAL_PAGES} className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800" aria-label="下一页"><ChevronRight size={20} /></button>
          </div>
          <iframe key={page} src={viewerUrl} title="大师之书 PDF 阅读器" className="h-[calc(100vh-13rem)] min-h-[620px] w-full bg-slate-200 dark:bg-slate-900 fullscreen:h-[calc(100vh-3.5rem)]" />
        </section>
      </div>
    </div>
  )
}
