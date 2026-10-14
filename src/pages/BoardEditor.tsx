import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ClipboardCopy, Cloud, Download, FileText, History, Image as ImageIcon, LayoutGrid, Maximize, Minimize, Paintbrush, PanelLeftClose, Plus, Presentation, Save, SlidersHorizontal, Trash2, X } from 'lucide-react'
import CloudDrivePicker from '../components/CloudDrivePicker'
import { useAccount } from '../context/account'
import { supabase } from '../lib/supabase'
import { useFullscreen } from '../lib/fullscreen'
import { loadPdf, newId, type Board, type PDFDocumentProxy } from '../lib/board'
import { attachPageFiles, blankPage, collectPageFiles, layoutPdfPages, parsePages, stripPageFiles, stripPdfBitmaps, type BoardPage, type BoardScene } from '../lib/boardPages'
import { downloadBoardFiles, removeBoardFiles, saveBoardFiles } from '../lib/boardFiles'
import { libraryFileUrl, type LibraryFile } from '../lib/library'

const BoardSurface = lazy(() => import('../components/BoardSurface'))

const BLANK_COLORS = ['#000000', '#ffffff', '#0f172a', '#fef9c3', '#dcfce7']

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
  // Any untouched drawing stays local until the teacher hits 保存 — nothing is
  // written to the server (or counted against storage) until then.
  const [dirty, setDirty] = useState(false)

  const [title, setTitle] = useState('')
  // Excalidraw's shape-properties panel sits on the left the whole time a tool
  // is active. Let the teacher collapse it; the choice sticks between lessons.
  const [hideProps, setHideProps] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('sat_board_hide_props') === '1')
  const [hideTools, setHideTools] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('sat_board_hide_tools') === '1')
  // The page-thumbnail rail eats width when projecting; let it fold away too.
  const [pagesOpen, setPagesOpen] = useState(() => typeof window === 'undefined' || window.localStorage.getItem('sat_board_pages_open') !== '0')
  // 投屏 mode: hide all our chrome and Excalidraw's side menus, leaving the
  // handout full-bleed with a floating rail and page bar.
  const [zen, setZen] = useState(false)
  // The thumbnail overlay stays closed in 投屏 (only the ▦ rail button opens it).
  const [zenPages, setZenPages] = useState(false)
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
    // An untouched single blank page is replaced by the handout; anything the
    // teacher already drew stays and the handout is added as one more board.
    // Excalidraw fires onChange on mount, so sceneRef is already populated — the
    // live scene's element count, not sceneRef itself, is what says "untouched".
    const liveElements = (sceneRef.current ?? pages[0]?.scene)?.elements ?? []
    const pristine = pages.length === 1 && pages[0].background.type === 'blank' && liveElements.length === 0
    try {
      const doc = await loadPdf(libraryFileUrl(row))
      // One board holds the whole PDF: every page becomes an image element in a
      // vertical column, so the teacher scrolls one board and can drag any page's
      // corners to resize it (ClassIn-style).
      const layout = await layoutPdfPages(doc)
      const { buildHandoutElements, buildHandoutFiles } = await import('../lib/boardPdf')
      const handout: BoardPage = {
        id: newId(),
        name: row.name,
        background: { type: 'blank', color: '#ffffff', grid: false },
        scene: { elements: buildHandoutElements(layout), files: buildHandoutFiles(layout), appState: {} },
      }
      setPdf(doc)
      setSourcePdf({ path: row.storage_path, name: row.name })
      const merged = pristine ? [handout] : [...mergedPages(), handout]
      setPages(merged)
      setCurrentIndex(merged.length - 1)
      if (!title.trim()) setTitle(row.name)
      sceneRef.current = null
      setDirty(true)
      setMessage('')
    } catch {
      setMessage('PDF 加载失败。')
    }
  }

  const mergedPages = useCallback((): BoardPage[] => {
    const live = sceneRef.current
    if (!live) return pages
    return pages.map((p, i) => (i === currentIndexRef.current ? { ...p, scene: live } : p))
  }, [pages])

  const toggleProps = () => {
    setHideProps((v) => {
      window.localStorage.setItem('sat_board_hide_props', v ? '0' : '1')
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
      copy.push(blankPage(`第 ${next} 页`, BLANK_COLORS[0], false))
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
      const blob = await exportBoardLongImage(next, pdf)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.trim() || '板书'}-${timestamp()}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setMessage('导出失败，请重试。')
    }
    setExporting(false)
  }

  // Outside click closes the 保存 menu; picking an item closes it too.
  useEffect(() => {
    if (!saveMenuOpen) return
    const onDown = (e: PointerEvent) => {
      if (saveMenuRef.current && !saveMenuRef.current.contains(e.target as Node)) setSaveMenuOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [saveMenuOpen])

  // Like 导出长图, but lands in the clipboard — ready to paste into WeChat,
  // slides or the class chat, with nothing stored on the site.
  const copyImage = async () => {
    setExporting(true)
    setMessage('')
    try {
      const next = mergedPages()
      setPages(next)
      const { exportBoardLongImage } = await import('../lib/boardExport')
      const blob = await exportBoardLongImage(next, pdf)
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
    } catch {
      setMessage('生成图片失败，请重试。')
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
    <div className={isFullscreen ? 'fixed inset-0 z-50 flex flex-col bg-slate-100 dark:bg-slate-950' : 'flex h-[calc(100vh-4rem)] flex-col bg-slate-100 dark:bg-slate-950'}>
      {!zen && <div className="border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
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

          <div className="ml-auto flex items-center gap-2">
            {dirty
              ? <span className="hidden items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />未保存</span>
              : message && <span className="hidden text-xs text-emerald-700 dark:text-emerald-400 sm:inline">{message}</span>}
            <button type="button" onClick={() => { setZenPages(false); setZen(true); if (!isFullscreen) toggleFullscreen() }} className={btn}><Presentation size={15} />投屏</button>
            <button type="button" onClick={() => setCloudOpen(true)} className={btn}><Cloud size={15} />我的云盘</button>
            <button type="button" onClick={() => void exportImage()} disabled={exporting} className={btn}><Download size={15} />{exporting ? '导出中…' : '导出长图'}</button>
            <Link to="/board/archive" className={btn}><History size={15} />历史板书</Link>
            <button type="button" onClick={toggleProps} title={hideProps ? '显示属性面板' : '收起属性面板'} className={`rounded-lg border p-2 ${hideProps ? 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800'}`} aria-label="属性面板">{hideProps ? <SlidersHorizontal size={16} /> : <PanelLeftClose size={16} />}</button>
            <button type="button" onClick={toggleTools} title={hideTools ? '显示工具栏' : '收起工具栏'} className={`rounded-lg border p-2 ${hideTools ? 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800'}`} aria-label="工具栏"><Paintbrush size={16} /></button>
            <button type="button" onClick={toggleFullscreen} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" aria-label="全屏">{isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}</button>
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
                </div>
              )}
            </div>
            {status === 'published'
              ? <button type="button" disabled={busy} onClick={() => void save('draft')} className={btn}>取消发布</button>
              : <button type="button" disabled={busy} onClick={() => void save('published')} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">发布给学生</button>}
          </div>
        </div>
      </div>}

      <div className="flex min-h-0 flex-1">
        {zen ? null : pagesOpen ? (
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
        ) : (
          <button type="button" onClick={togglePages} title="展开页面栏" aria-label="展开页面栏" className="grid w-8 shrink-0 place-items-center border-r border-slate-200 bg-white text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"><ChevronRight size={16} /></button>
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
                  hideProperties={hideProps}
                  onToggleProperties={toggleProps}
                  hideTools={hideTools}
                  onToggleTools={toggleTools}
                  zen={zen}
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
            <ZenButton title={hideProps ? '显示属性面板' : '收起属性面板'} onClick={toggleProps} active={hideProps}><SlidersHorizontal size={17} /></ZenButton>
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
