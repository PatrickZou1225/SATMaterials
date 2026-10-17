import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ClipboardCopy, Cloud, Download, FileText, History, Image as ImageIcon, LayoutGrid, Maximize, Minimize, Paintbrush, Palette, PanelTop, PanelTopClose, Plus, Presentation, Save, Search, Trash2, X } from 'lucide-react'
import CloudDrivePicker from '../components/CloudDrivePicker'
import { useAccount } from '../context/account'
import { supabase } from '../lib/supabase'
import { useFullscreen } from '../lib/fullscreen'
import { loadPdf, newId, type Board, type PDFDocumentProxy } from '../lib/board'
import { attachPageFiles, blankPage, collectPageFiles, layoutPdfPages, parsePages, PDF_PAGE_GAP, pdfPageOf, stripPageFiles, stripPdfBitmaps, type BoardPage, type BoardScene } from '../lib/boardPages'
import { downloadBoardFiles, removeBoardFiles, saveBoardFiles } from '../lib/boardFiles'
import { libraryFileUrl, type LibraryFile } from '../lib/library'
import type { BankQuestion, QuestionBank } from '../lib/questionBank'

const BoardSurface = lazy(() => import('../components/BoardSurface'))

// The 背景 palette: blank boards are blackboards by default, and any board —
// handout included — can put its pages on one of these colours.
const CANVAS_COLORS = [
  { color: '#000000', label: '黑色（黑板）' },
  { color: '#ffffff', label: '白色' },
  { color: '#0f172a', label: '深蓝' },
  { color: '#fef9c3', label: '米黄' },
  { color: '#dcfce7', label: '浅绿' },
]

function readTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('sat_theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function timestamp(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`
}

export default function BoardEditor() {
  const { boardId } = useParams<{ boardId: string }>()
  const isSession = !boardId
  const account = useAccount()
  const navigate = useNavigate()
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
  const theme = readTheme()

  const [board, setBoard] = useState<Board | null>(null)
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [pages, setPages] = useState<BoardPage[]>(() => [blankPage('第 1 页')])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft')
  const [loading, setLoading] = useState(!isSession)
  const [busy, setBusy] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [message, setMessage] = useState('')
  // 保存 opens a menu: store on the site, or copy the board as an image to the
  // clipboard (nothing written anywhere — the teacher saves storage that way).
  const [saveMenuOpen, setSaveMenuOpen] = useState(false)
  const saveMenuRef = useRef<HTMLDivElement | null>(null)
  // 背景 palette: pick the canvas colour for the board being viewed.
  const [bgMenuOpen, setBgMenuOpen] = useState(false)
  const bgMenuRef = useRef<HTMLDivElement | null>(null)
  // 搜题: keyword search over the whole question bank; a hit is formatted and
  // handed to the board as one text element (see pickBankQuestion below).
  const [qSearchOpen, setQSearchOpen] = useState(false)
  const [qQuery, setQQuery] = useState('')
  const [qResults, setQResults] = useState<BankQuestion[] | null>(null)
  const [qBusy, setQBusy] = useState(false)
  const qSearchRef = useRef<HTMLDivElement | null>(null)
  const bankRef = useRef<QuestionBank | null>(null)
  const qSearchSeqRef = useRef(0)
  const insertSerialRef = useRef(0)
  const [insertQuestion, setInsertQuestion] = useState<{ title: string; text: string; serial: number } | null>(null)
  // Any untouched drawing stays local until the teacher hits 保存 — nothing is
  // written to the server (or counted against storage) until then.
  const [dirty, setDirty] = useState(false)

  const [title, setTitle] = useState('')
  const [hideTools, setHideTools] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('sat_board_hide_tools') === '1')
  // The page-thumbnail rail eats width when projecting; let it fold away too.
  const [pagesOpen, setPagesOpen] = useState(() => typeof window === 'undefined' || window.localStorage.getItem('sat_board_pages_open') !== '0')
  // 投屏 mode: hide all our chrome and Excalidraw's side menus, leaving the
  // handout full-bleed with a floating rail and page bar.
  const [zen, setZen] = useState(false)
  // The thumbnail overlay stays closed in 投屏 (only the ▦ rail button opens it).
  const [zenPages, setZenPages] = useState(false)
  // Hide the site-wide nav (without fullscreen) so the handout gets the height.
  const [navHidden, setNavHidden] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('sat_board_hide_nav') === '1')
  // The cloud-drive file this board's handout came from (used when saving).
  const [sourcePdf, setSourcePdf] = useState<{ path: string; name: string } | null>(null)
  const [cloudOpen, setCloudOpen] = useState(false)

  const sceneRef = useRef<BoardScene | null>(null)
  const currentIndexRef = useRef(0)
  currentIndexRef.current = currentIndex

  // Load an existing saved board (edit mode only).
  useEffect(() => {
    if (isSession) {
      setBoard(null)
      setPages([blankPage('第 1 页')])
      setCurrentIndex(0)
      setTitle('')
      setSourcePdf(null)
      setPdf(null)
      setStatus('draft')
      setLoading(false)
      setDirty(false)
      sceneRef.current = null
      return
    }
    let active = true
    void (async () => {
      if (!supabase) { if (active) setLoading(false); return }
      setLoading(true)
      const { data, error } = await supabase.from('boards').select('*').eq('id', boardId).single()
      if (!active) return
      if (error || !data) { setMessage('找不到这块板书，或你没有访问权限。'); setLoading(false); return }
      const row = data as Board
      let loaded = parsePages(row.pages)
      if (!loaded.length) loaded = [blankPage('第 1 页')]
      if (row.files_path) {
        try { loaded = attachPageFiles(loaded, await downloadBoardFiles(row.files_path)) } catch { /* drawings still load; pasted images may be missing */ }
      }
      if (!active) return
      setBoard(row)
      setTitle(row.title)
      setStatus(row.status)
      setPages(loaded)
      setCurrentIndex(0)
      setDirty(false)
      sceneRef.current = null
      setSourcePdf(row.pdf_path ? { path: row.pdf_path, name: row.pdf_name ?? 'PDF' } : null)
      if (row.pdf_path) {
        const { data: urlData } = supabase.storage.from('boards').getPublicUrl(row.pdf_path)
        try {
          const doc = await loadPdf(urlData.publicUrl)
          if (active) setPdf(doc)
        } catch {
          if (active) setMessage('PDF 加载失败。')
        }
      }
      setLoading(false)
    })()
    return () => { active = false }
  }, [boardId, isSession])

  const currentPage = pages[currentIndex] ?? pages[0]

  const onPickCloudFile = async (row: LibraryFile) => {
    setCloudOpen(false)
    if (!supabase) return
    setMessage('正在加载讲义…')
    // Snapshot the live scene BEFORE the (slow) PDF load, so nothing the teacher
    // has already drawn or pasted can be lost while we wait.
    const base = mergedPages()
    const index = currentIndexRef.current
    const current = base[index] ?? base[0]
    try {
      const doc = await loadPdf(libraryFileUrl(row))
      // One board holds the whole PDF: every page becomes an image element in a
      // vertical column, so the teacher scrolls one board and can drag any page's
      // corners to resize it (ClassIn-style).
      const layout = await layoutPdfPages(doc)
      const { buildHandoutElements, buildHandoutFiles } = await import('../lib/boardPdf')
      // Merge the handout into the board the teacher is on, below whatever is
      // already there. Opening a separate board and jumping to it left the
      // teacher's notes off-screen, which looked like they had disappeared.
      const existing = current.scene.elements
      const bottom = existing.length
        ? existing.reduce((max, el) => Math.max(max, el.y + el.height), -Infinity) + PDF_PAGE_GAP
        : 0
      const page: BoardPage = {
        // A fresh page id forces BoardSurface to re-initialise Excalidraw with the
        // combined scene — the canvas only reloads when the page id changes.
        id: newId(),
        name: existing.length ? current.name : row.name,
        // Keep the board's background: the white sheets sit on the blackboard as
        // before, and light ink on a coloured board stays visible.
        background: current.background,
        scene: {
          elements: [
            ...existing,
            ...buildHandoutElements(layout).map((el) => ({ ...el, y: el.y + bottom })),
          ] as BoardScene['elements'],
          files: { ...current.scene.files, ...buildHandoutFiles(layout) },
          // No saved viewport -> BoardSurface fits the first handout page, so the
          // teacher lands on the PDF and can scroll up to their notes.
          appState: {},
        },
      }
      setPdf(doc)
      setSourcePdf({ path: row.storage_path, name: row.name })
      setPages(base.map((p, i) => (i === index ? page : p)))
      if (!title.trim()) setTitle(row.name)
      sceneRef.current = null
      setDirty(true)
      setMessage(`已加载讲义（${doc.numPages} 页），接在板书下方——往上滚可回到板书。`)
    } catch {
      setMessage('PDF 加载失败。')
    }
  }

  const mergedPages = useCallback((): BoardPage[] => {
    const live = sceneRef.current
    if (!live) return pages
    return pages.map((p, i) => (i === currentIndexRef.current ? { ...p, scene: live } : p))
  }, [pages])

  const toggleNav = () => {
    setNavHidden((v) => {
      window.localStorage.setItem('sat_board_hide_nav', v ? '0' : '1')
      return !v
    })
  }

  const toggleTools = () => {
    setHideTools((v) => {
      window.localStorage.setItem('sat_board_hide_tools', v ? '0' : '1')
      return !v
    })
  }

  const togglePages = () => {
    setPagesOpen((v) => {
      window.localStorage.setItem('sat_board_pages_open', v ? '0' : '1')
      return !v
    })
  }

  const switchTo = (index: number) => {
    if (index === currentIndexRef.current) return
    const live = sceneRef.current
    if (live) setPages((prev) => prev.map((p, i) => (i === currentIndexRef.current ? { ...p, scene: live } : p)))
    sceneRef.current = null
    setCurrentIndex(index)
  }

  const addBlank = () => {
    const next = pages.length + 1
    setPages((prev) => {
      const copy = [...prev]
      const live = sceneRef.current
      if (live) copy[currentIndexRef.current] = { ...copy[currentIndexRef.current], scene: live }
      copy.push(blankPage(`第 ${next} 页`, CANVAS_COLORS[0].color, false))
      return copy
    })
    sceneRef.current = null
    setCurrentIndex(pages.length)
    setDirty(true)
  }

  const removePage = (index: number) => {
    if (pages.length <= 1) { setMessage('至少保留一页。'); return }
    if (!window.confirm('删除这一页？上面的板书会一起删掉。')) return
    const copy = pages.filter((_, i) => i !== index)
    sceneRef.current = null
    setPages(copy)
    setCurrentIndex((i) => Math.min(i, copy.length - 1))
    setDirty(true)
  }

  // The PDF window's ✕: remove the handout pages from the board the teacher is
  // viewing, leaving everything they drew or pasted on that board intact.
  const closeHandout = () => {
    if (!window.confirm('关闭这份讲义？画在讲义上的内容也会一起移除（之后可以从「我的云盘」重新打开）。')) return
    const base = mergedPages()
    const index = currentIndexRef.current
    const current = base[index]
    if (!current) return
    const elements = current.scene.elements.filter((el) => pdfPageOf(el) === null)
    if (elements.length === current.scene.elements.length) return
    const files = { ...current.scene.files }
    for (const id of Object.keys(files)) if (id.startsWith('pdf-')) delete files[id]
    const page: BoardPage = {
      // New id so BoardSurface reloads the scene without the handout pages.
      id: newId(),
      name: current.name,
      background: current.background,
      scene: { ...current.scene, elements, files },
    }
    const next = base.map((p, i) => (i === index ? page : p))
    setPages(next)
    sceneRef.current = null
    setDirty(true)
    // Drop the loaded document once no board still shows its pages.
    if (!next.some((p) => p.scene.elements.some((el) => pdfPageOf(el) !== null))) {
      setPdf(null)
      setSourcePdf(null)
    }
    setMessage('已移除讲义，板书保留。')
  }

  const save = async (nextStatus?: 'draft' | 'published') => {
    if (!supabase || !account?.user) return
    setBusy(true)
    setMessage('')
    const next = mergedPages()
    setPages(next)
    // Page bitmaps are rendered on demand and are huge; reset every page element
    // back to its tiny placeholder before anything is measured or stored.
    const stamped = stripPdfBitmaps(next)
    // Big data URLs go to Storage; the row keeps only small drawings + the path.
    const files = collectPageFiles(stamped)
    const hasFiles = Object.keys(files).length > 0
    const pageRows = stripPageFiles(stamped)

    if (!board) {
      const id = newId()
      const finalTitle = title.trim() || '未命名板书'
      let filesPath: string | null = null
      let filesBytes: number | null = null
      if (hasFiles) {
        try {
          const up = await saveBoardFiles(files, account.user.id, id)
          filesPath = up.path
          filesBytes = up.bytes
        } catch {
          setBusy(false)
          setMessage('保存失败，请重试。')
          return
        }
      }
      const { data, error } = await supabase
        .from('boards')
        .insert({
          id,
          title: finalTitle,
          teacher_id: account.user.id,
          status: nextStatus ?? 'draft',
          pdf_path: sourcePdf?.path ?? null,
          pdf_name: sourcePdf?.name ?? null,
          page_count: pageRows.length,
          pages: pageRows,
          files_path: filesPath,
          files_bytes: filesBytes,
        })
        .select('id')
        .single()
      setBusy(false)
      if (error || !data) { setMessage('保存失败，请重试。'); return }
      setLoading(true)
      navigate(`/board/${id}/edit`, { replace: true })
      return
    }

    let filesPath = board.files_path ?? null
    let filesBytes = board.files_bytes ?? null
    if (hasFiles) {
      try {
        const up = await saveBoardFiles(files, account.user.id, board.id)
        filesPath = up.path
        filesBytes = up.bytes
      } catch {
        setBusy(false)
        setMessage('保存失败，请重试。')
        return
      }
    } else if (filesPath) {
      await removeBoardFiles(filesPath)
      filesPath = null
      filesBytes = null
    }

    const { error } = await supabase
      .from('boards')
      .update({ pages: pageRows, page_count: pageRows.length, title: title.trim() || board.title, pdf_path: sourcePdf?.path ?? null, pdf_name: sourcePdf?.name ?? null, status: nextStatus ?? status, files_path: filesPath, files_bytes: filesBytes, updated_at: new Date().toISOString() })
      .eq('id', board.id)
    if (error) setMessage('保存失败，请重试。')
    else {
      if (nextStatus) setStatus(nextStatus)
      setBoard({ ...board, files_path: filesPath, files_bytes: filesBytes })
      setDirty(false)
      setMessage(nextStatus === 'published' ? '已发布，学生现在可以回看了。' : '已保存。')
    }
    setBusy(false)
  }

  const exportImage = async () => {
    setExporting(true)
    setMessage('')
    try {
      const next = mergedPages()
      setPages(next)
      const { exportBoardLongImage } = await import('../lib/boardExport')
      const blob = await exportBoardLongImage(next)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.trim() || '板书'}-${timestamp()}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setMessage(e instanceof Error && e.message ? e.message : '导出失败，请重试。')
    }
    setExporting(false)
  }

  // Hide the site nav via a body class (Layout renders it above this page);
  // leaving the board always restores it.
  useEffect(() => {
    document.body.classList.toggle('board-hide-nav', navHidden)
    return () => document.body.classList.remove('board-hide-nav')
  }, [navHidden])

  // Outside click closes the 保存 / 背景 / 搜题 menus; picking an item closes them too.
  useEffect(() => {
    if (!saveMenuOpen && !bgMenuOpen && !qSearchOpen) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (saveMenuRef.current && !saveMenuRef.current.contains(t)) setSaveMenuOpen(false)
      if (bgMenuRef.current && !bgMenuRef.current.contains(t)) setBgMenuOpen(false)
      if (qSearchRef.current && !qSearchRef.current.contains(t)) setQSearchOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [saveMenuOpen, bgMenuOpen, qSearchOpen])

  // Wrap plain text into ≤max-width lines (CJK counts double). Long unbroken
  // runs — Chinese has no spaces — are hard-split so nothing overflows the page.
  const hardWrap = (text: string, max = 72): string => {
    const widthOf = (s: string) => { let w = 0; for (const ch of s) w += ch.charCodeAt(0) > 0x2e80 ? 2 : 1; return w }
    const out: string[] = []
    for (const para of text.split('\n')) {
      let line = ''
      for (let word of para.split(' ')) {
        if (widthOf(line ? `${line} ${word}` : word) <= max) { line = line ? `${line} ${word}` : word; continue }
        if (line) out.push(line)
        while (widthOf(word) > max) {
          let cut = ''
          for (const ch of word) { if (widthOf(cut + ch) > max) break; cut += ch }
          out.push(cut)
          word = word.slice(cut.length)
        }
        line = word
      }
      out.push(line)
    }
    return out.join('\n')
  }

  // Keyword scan over every set → module → question; capped so huge matches
  // stay snappy. The bank loads lazily (dynamic import) on first use.
  const runQuestionSearch = async (query: string) => {
    const needle = query.trim().toLowerCase()
    if (needle.length < 2) { setQResults(null); return }
    const seq = ++qSearchSeqRef.current
    if (!bankRef.current) {
      setQBusy(true)
      const { buildQuestionBank } = await import('../lib/questionBank')
      bankRef.current = buildQuestionBank()
    }
    setQBusy(false)
    const hits: BankQuestion[] = []
    outer: for (const set of bankRef.current.sets) {
      for (const mod of set.modules) {
        for (const q of mod.questions) {
          const hay = `${q.question.passage}\n${q.question.question}\n${q.question.options.join('\n')}`.toLowerCase()
          if (hay.includes(needle)) {
            hits.push(q)
            if (hits.length >= 30) break outer
          }
        }
      }
    }
    if (seq === qSearchSeqRef.current) setQResults(hits)
  }

  // Format a bank question as one board text block: passage, prompt, options.
  // Wrapped by hand — Excalidraw text only breaks at the newlines we give it.
  const pickBankQuestion = (q: BankQuestion) => {
    setQSearchOpen(false)
    const title = `【${q.setTitle} · 模块${q.moduleNum} · 第${q.question.id}题】`
    const parts: string[] = []
    if (q.question.passage?.trim()) parts.push(hardWrap(q.question.passage.trim()))
    parts.push(hardWrap(q.question.question.trim()))
    parts.push(q.question.options
      .map((opt, i) => hardWrap(`${'ABCD'[i] ?? String(i + 1)}) ${opt.trim()}`, 68).replace(/\n/g, '\n    '))
      .join('\n'))
    if (q.question.image || q.question.table) parts.push('（此题含图表，请对照题库原图）')
    setInsertQuestion({ title, text: parts.join('\n\n'), serial: ++insertSerialRef.current })
  }

  // Blank boards keep their colour on the page background (ink colour follows
  // it); handout boards keep it on the saved scene. BoardSurface applies the
  // change to the live canvas.
  const setCanvasColor = (color: string) => {
    setBgMenuOpen(false)
    setPages((prev) => prev.map((p, i) => i !== currentIndex ? p : (
      p.background.type === 'blank'
        ? { ...p, background: { ...p.background, color } }
        : { ...p, scene: { ...p.scene, appState: { ...p.scene.appState, viewBackgroundColor: color } } }
    )))
    setDirty(true)
  }

  // Like 导出长图, but lands in the clipboard — ready to paste into WeChat,
  // slides or the class chat, with nothing stored on the site.
  const copyImage = async () => {
    setExporting(true)
    setMessage('')
    try {
      const next = mergedPages()
      setPages(next)
      const { exportBoardLongImage } = await import('../lib/boardExport')
      const blob = await exportBoardLongImage(next)
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setMessage('已复制到剪贴板 ✓ 直接粘贴即可')
      } catch {
        // Safari only allows clipboard writes inside the click's own tick;
        // fall back to a download rather than failing outright.
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.trim() || '板书'}-${timestamp()}.png`
        a.click()
        URL.revokeObjectURL(url)
        setMessage('浏览器不允许直接复制，已改为下载图片。')
      }
    } catch (e) {
      setMessage(e instanceof Error && e.message ? e.message : '生成图片失败，请重试。')
    }
    setExporting(false)
  }

  if (!supabase) return <PageMessage text="尚未连接服务器，暂时无法使用讲解区。" />
  if (account?.profile && account.profile.role !== 'teacher') return <PageMessage text="仅老师可以编辑板书。" />

  if (loading) return <PageMessage text="正在加载板书…" />
  if (!isSession && (!board || !currentPage)) return (
    <div className="max-w-xl mx-auto px-4 py-10 text-center">
      <p className="text-slate-500">{message || '找不到这块板书。'}</p>
      <Link to="/board" className="mt-4 inline-block text-blue-600 hover:underline">返回讲解区</Link>
    </div>
  )

  const btn = 'inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800'

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 flex flex-col bg-slate-100 dark:bg-slate-950' : `flex flex-col bg-slate-100 dark:bg-slate-950 ${navHidden ? 'h-screen' : 'h-[calc(100vh-4rem)]'}`}>
      {!zen && navHidden && (
        <button type="button" onClick={toggleNav} className="fixed left-3 top-3 z-40 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-slate-800">
          <PanelTop size={14} />顶部栏
        </button>
      )}
      {/* relative z-30: the board <main> below paints later in tree order, so
          without a stacking context here the 保存 / 背景 / 搜题 dropdowns that
          hang out of this bar were rendered underneath it and never seen. */}
      {!zen && !navHidden && <div className="relative z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5">
          <input
            value={title}
            maxLength={120}
            onChange={(e) => { setTitle(e.target.value); setDirty(true) }}
            placeholder="板书标题"
            className="mr-2 w-[200px] truncate rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-slate-800 hover:border-slate-200 focus:border-slate-300 focus:outline-none dark:text-slate-100 dark:hover:border-slate-700"
          />

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 px-1 dark:border-slate-700">
            <button type="button" onClick={() => switchTo(Math.max(0, currentIndex - 1))} disabled={currentIndex <= 0} className="grid h-8 w-8 place-items-center text-slate-600 disabled:opacity-30 dark:text-slate-300" aria-label="上一页"><ChevronLeft size={16} /></button>
            <span className="min-w-[64px] text-center text-xs text-slate-500">{currentIndex + 1} / {pages.length}</span>
            <button type="button" onClick={() => switchTo(Math.min(pages.length - 1, currentIndex + 1))} disabled={currentIndex >= pages.length - 1} className="grid h-8 w-8 place-items-center text-slate-600 disabled:opacity-30 dark:text-slate-300" aria-label="下一页"><ChevronRight size={16} /></button>
          </div>

          {dirty
            ? <span className="hidden items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />未保存</span>
            : message && <span className="hidden text-xs text-emerald-700 dark:text-emerald-400 sm:inline">{message}</span>}

          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={() => setCloudOpen(true)} className={btn}><Cloud size={15} />我的云盘</button>
            <div ref={qSearchRef} className="relative">
              <button type="button" onClick={() => { setQSearchOpen((v) => !v); setQResults(null) }} className={btn}><Search size={15} />搜题</button>
              {qSearchOpen && (
                <div className="absolute right-0 top-full z-30 mt-1 w-96 overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <div className="border-b border-slate-100 p-2 dark:border-slate-800">
                    <input
                      autoFocus
                      value={qQuery}
                      onChange={(e) => { setQQuery(e.target.value); void runQuestionSearch(e.target.value) }}
                      placeholder="输入题目关键词（≥2 个字），例如 cross-text、双篇"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {qBusy && <p className="px-3 py-2 text-xs text-slate-400">正在载入题库…</p>}
                    {!qBusy && qResults === null && <p className="px-3 py-2 text-xs text-slate-400">输入关键词从全部真题里搜；点结果就把题目贴到当前这块黑板上。</p>}
                    {!qBusy && qResults?.length === 0 && <p className="px-3 py-2 text-xs text-slate-400">没有找到匹配的题目，换个关键词试试。</p>}
                    {qResults?.map((q) => (
                      <button key={q.key} type="button" onClick={() => pickBankQuestion(q)} className="block w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="block text-[11px] font-semibold text-blue-600 dark:text-blue-400">{q.setTitle} · 模块{q.moduleNum} · 第{q.question.id}题</span>
                        <span className="mt-0.5 block truncate text-xs text-slate-600 dark:text-slate-300">{q.question.question.replace(/\s+/g, ' ').slice(0, 80)}{q.question.question.length > 80 ? '…' : ''}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="mx-0.5 h-5 w-px shrink-0 bg-slate-200 dark:bg-slate-700" />
            <button type="button" onClick={() => { setZenPages(false); setZen(true); if (!isFullscreen) toggleFullscreen() }} className={btn}><Presentation size={15} />投屏</button>
            <span className="mx-0.5 h-5 w-px shrink-0 bg-slate-200 dark:bg-slate-700" />
            <button type="button" onClick={() => void exportImage()} disabled={exporting} className={btn}><Download size={15} />{exporting ? '导出中…' : '导出长图'}</button>
            <div ref={saveMenuRef} className="relative">
              <button type="button" disabled={busy} onClick={() => setSaveMenuOpen((v) => !v)} className={btn}><Save size={15} />保存</button>
              {saveMenuOpen && (
                <div className="absolute right-0 top-full z-30 mt-1 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <button type="button" onClick={() => { setSaveMenuOpen(false); void save() }} className="flex w-full items-start gap-2 px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Save size={15} className="mt-0.5 shrink-0 text-slate-500" />
                    <span>
                      <span className="block text-sm font-semibold text-slate-700 dark:text-slate-100">保存到网站</span>
                      <span className="block text-xs text-slate-500">历史板书、发布给学生用</span>
                    </span>
                  </button>
                  <button type="button" disabled={exporting} onClick={() => { setSaveMenuOpen(false); void copyImage() }} className="flex w-full items-start gap-2 border-t border-slate-100 px-3 py-2.5 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-800 dark:hover:bg-slate-800">
                    <ClipboardCopy size={15} className="mt-0.5 shrink-0 text-slate-500" />
                    <span>
                      <span className="block text-sm font-semibold text-slate-700 dark:text-slate-100">复制图片到剪贴板</span>
                      <span className="block text-xs text-slate-500">不保存到网站、不占空间</span>
                    </span>
                  </button>
                  <p className="border-t border-slate-100 px-3 py-2 text-[11px] leading-snug text-slate-400 dark:border-slate-800">复制图片只带走图片，板子本身不会存下来；想以后还能打开或发布给学生，请选「保存到网站」。</p>
                </div>
              )}
            </div>
            {status === 'published'
              ? <button type="button" disabled={busy} onClick={() => void save('draft')} className={btn}>取消发布</button>
              : <button type="button" disabled={busy} onClick={() => void save('published')} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">发布给学生</button>}
            <span className="mx-0.5 h-5 w-px shrink-0 bg-slate-200 dark:bg-slate-700" />
            <Link to="/board/archive" title="历史板书" aria-label="历史板书" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"><History size={16} /></Link>
            <button type="button" onClick={togglePages} title={pagesOpen ? '收起页面栏' : '展开页面栏'} className={`rounded-lg border p-2 ${pagesOpen ? 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800'}`} aria-label="页面列表"><LayoutGrid size={16} /></button>
            <button type="button" onClick={toggleNav} title={navHidden ? '展开顶部导航' : '收起顶部导航（全站导航和这一栏一起收，腾出讲义空间）'} className={`rounded-lg border p-2 ${navHidden ? 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800'}`} aria-label="顶部导航">{navHidden ? <PanelTop size={16} /> : <PanelTopClose size={16} />}</button>
            <button type="button" onClick={toggleTools} title={hideTools ? '显示工具条' : '收起工具条'} className={`rounded-lg border p-2 ${hideTools ? 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800'}`} aria-label="工具栏"><Paintbrush size={16} /></button>
            <button type="button" onClick={toggleFullscreen} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" aria-label="全屏">{isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}</button>
            <div ref={bgMenuRef} className="relative">
              <button type="button" onClick={() => setBgMenuOpen((v) => !v)} title="画布背景颜色" aria-label="画布背景颜色" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"><Palette size={16} /></button>
              {bgMenuOpen && (
                <div className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-left shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <p className="px-3 pb-1 pt-1.5 text-[11px] font-semibold text-slate-400">画布背景</p>
                  {CANVAS_COLORS.map(({ color, label }) => (
                    <button key={color} type="button" onClick={() => setCanvasColor(color)} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
                      <span className="h-4 w-4 shrink-0 rounded-full border border-slate-300 dark:border-slate-600" style={{ backgroundColor: color }} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>}

      <div className="flex min-h-0 flex-1">
        {!zen && pagesOpen && (
        <aside className="relative flex w-32 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <button type="button" onClick={togglePages} title="收起页面栏" aria-label="收起页面栏" className="absolute -right-3 top-2 z-10 grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"><ChevronLeft size={14} /></button>
          <div className="flex-1 space-y-2 overflow-y-auto p-2">
            {pages.map((page, index) => (
              <button
                key={page.id}
                type="button"
                onClick={() => switchTo(index)}
                className={`group relative block w-full overflow-hidden rounded-lg border-2 text-left ${index === currentIndex ? 'border-blue-500' : 'border-slate-200 dark:border-slate-700'}`}
              >
                <div className="flex h-20 items-center justify-center text-xs" style={{ backgroundColor: page.background.type === 'blank' ? page.background.color : '#ffffff', color: page.background.type === 'blank' && page.background.color !== '#ffffff' ? '#e2e8f0' : '#475569' }}>
                  {page.background.type === 'pdf' ? <span className="flex flex-col items-center gap-1"><FileText size={18} />P{page.background.pdfPage}</span> : <ImageIcon size={18} />}
                </div>
                <div className="truncate bg-slate-50 px-1.5 py-1 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">{index + 1}. {page.name}</div>
                {pages.length > 1 && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); removePage(index) }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); removePage(index) } }}
                    className="absolute right-1 top-1 hidden rounded bg-black/50 p-0.5 text-white group-hover:block"
                    aria-label="删除页"
                  >
                    <Trash2 size={12} />
                  </span>
                )}
              </button>
            ))}
          </div>
          <button type="button" onClick={addBlank} className="m-2 inline-flex items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"><Plus size={14} />空白板</button>
        </aside>
        )}

        <main className="relative min-h-0 flex-1">
          {currentPage.background.type === 'pdf' && !pdf
            ? <div className="grid h-full place-items-center text-slate-500">PDF 加载中…</div>
            : <Suspense fallback={<div className="grid h-full place-items-center text-slate-500">正在加载白板…</div>}>
                <BoardSurface
                  key={currentPage.id}
                  pdf={pdf}
                  page={currentPage}
                  editable
                  theme={theme}
                  hideTools={hideTools}
                  zen={zen}
                  insertQuestion={insertQuestion}
                  onClosePage={closeHandout}
                  onSceneChange={(scene, meta) => {
                    // Excalidraw fires once on mount with the loaded scene; only
                    // later callbacks mean the teacher actually drew something.
                    // UI-only changes (tool/ink/viewport) never flag the board.
                    const first = sceneRef.current === null
                    sceneRef.current = scene
                    if (!first && meta.structural) setDirty(true)
                  }}
                />
              </Suspense>}
        </main>
      </div>

      {zen && (
        <>
          {/* Right rail (ClassIn style): the app-level actions a lesson needs —
              open a handout, add a blank page, browse pages, save, export. The
              drawing tools keep living in Excalidraw's own palette up top. */}
          <div className="fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-1 rounded-2xl border border-white/15 bg-black/60 p-1.5 backdrop-blur">
            <ZenButton title="我的云盘（打开讲义）" onClick={() => setCloudOpen(true)}><Cloud size={17} /></ZenButton>
            <ZenButton title="新建空白板" onClick={addBlank}><Plus size={17} /></ZenButton>
            <ZenButton title="页面列表" onClick={() => setZenPages((v) => !v)} active={zenPages}><LayoutGrid size={17} /></ZenButton>
            <ZenButton title="导出长图" onClick={() => void exportImage()}><Download size={17} /></ZenButton>
            <ZenButton title="保存" onClick={() => void save()} disabled={busy}><Save size={17} /></ZenButton>
          </div>

          {zenPages && (
            <aside className="fixed right-[62px] top-1/2 z-40 flex max-h-[72vh] w-28 -translate-y-1/2 flex-col gap-1.5 overflow-y-auto rounded-xl border border-white/15 bg-black/70 p-1.5 backdrop-blur">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => switchTo(index)}
                  className={`block w-full overflow-hidden rounded-lg border-2 ${index === currentIndex ? 'border-blue-400' : 'border-white/15'}`}
                >
                  <div className="flex h-14 items-center justify-center text-[10px]" style={{ backgroundColor: page.background.type === 'blank' ? page.background.color : '#ffffff', color: page.background.type === 'blank' && page.background.color !== '#ffffff' ? '#e2e8f0' : '#475569' }}>
                    {page.background.type === 'pdf' ? `P${page.background.pdfPage}` : <ImageIcon size={14} />}
                  </div>
                  <div className="truncate bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">{index + 1}</div>
                </button>
              ))}
            </aside>
          )}

          {/* Page bar, mirroring ClassIn's ‹ 29/58 › strip. */}
          <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2 py-1 backdrop-blur">
            <button type="button" onClick={() => switchTo(Math.max(0, currentIndex - 1))} disabled={currentIndex <= 0} className="grid h-8 w-8 place-items-center rounded-full text-white/85 hover:bg-white/15 disabled:opacity-30" aria-label="上一页"><ChevronLeft size={18} /></button>
            <span className="min-w-[64px] text-center text-sm font-semibold text-white/85">{currentIndex + 1} / {pages.length}</span>
            <button type="button" onClick={() => switchTo(Math.min(pages.length - 1, currentIndex + 1))} disabled={currentIndex >= pages.length - 1} className="grid h-8 w-8 place-items-center rounded-full text-white/85 hover:bg-white/15 disabled:opacity-30" aria-label="下一页"><ChevronRight size={18} /></button>
          </div>

          {(dirty || message) && (
            <div className="pointer-events-none fixed bottom-4 left-4 z-40 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white/85 backdrop-blur">
              {dirty ? '未保存' : message}
            </div>
          )}

          <button
            type="button"
            onClick={() => setZen(false)}
            className="fixed right-4 top-4 z-40 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3.5 py-2 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-black/80"
          >
            <X size={15} />退出投屏
          </button>
        </>
      )}

      <CloudDrivePicker open={cloudOpen} onClose={() => setCloudOpen(false)} onPick={(row) => void onPickCloudFile(row)} />
    </div>
  )
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[50vh] grid place-items-center text-slate-500">{text}</div>
}

function ZenButton({ title, onClick, active, disabled, children }: { title: string; onClick: () => void; active?: boolean; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-xl transition disabled:opacity-40 ${active ? 'bg-blue-600 text-white' : 'text-white/85 hover:bg-white/15'}`}
    >
      {children}
    </button>
  )
}
