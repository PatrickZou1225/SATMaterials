import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Cloud, FileText, Trash2, Upload } from 'lucide-react'
import DriveUsageBar from '../components/DriveUsageBar'
import { useAccount } from '../context/account'
import { deleteLibraryFile, driveUsage, listLibraryFiles, uploadLibraryFile, STORAGE_QUOTA_BYTES, type LibraryFile } from '../lib/library'

const books = [
  {
    title: '大师之书',
    subtitle: "Master's Book · 26 Spring",
    detail: '8 个章节 · 258 道题',
    href: '/my-books/masters-book',
  },
  {
    title: '抵达之书',
    subtitle: 'SAT Arrival Book · 26 Revised',
    detail: '8 个章节 · 136 道题',
    href: '/my-books/arrival-book',
  },
]

function formatSize(bytes: number | null): string {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export default function Bookshelf() {
  const account = useAccount()
  const [files, setFiles] = useState<LibraryFile[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [usageKey, setUsageKey] = useState(0)

  const refresh = useCallback(async () => {
    try {
      setFiles(await listLibraryFiles())
    } catch {
      setError('读取云盘失败。')
    }
    setLoading(false)
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const upload = async (picked: File | null) => {
    if (!picked || !account?.user) return
    setBusy(true)
    setError('')
    try {
      const used = await driveUsage(account.user.id)
      if (used + picked.size > STORAGE_QUOTA_BYTES) {
        setError('云盘空间不足，请先删除一些文件再上传。')
        setBusy(false)
        return
      }
      const row = await uploadLibraryFile(picked, account.user.id)
      setFiles((prev) => [row, ...prev])
      setUsageKey((k) => k + 1)
    } catch {
      setError('上传失败，请重试。')
    }
    setBusy(false)
  }

  const remove = async (row: LibraryFile) => {
    if (!window.confirm(`删除云盘里的「${row.name}」？`)) return
    await deleteLibraryFile(row)
    setFiles((prev) => prev.filter((f) => f.id !== row.id))
    setUsageKey((k) => k + 1)
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400"><BookOpen size={18} /> 私人电子讲义</div>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">我的讲义</h1>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {books.map((book) => (
            <Link key={book.href} to={book.href} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300"><BookOpen size={24} /></div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{book.title}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{book.subtitle}</p>
                  <p className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400">{book.detail}</p>
                </div>
                <ChevronRight className="mb-1 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500" />
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300"><Cloud size={18} /> 我的云盘</div>
              <p className="text-sm text-slate-500 dark:text-slate-400">上传你的 PDF 讲义，讲解时在黑板上一键加载。</p>
            </div>
            <label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 ${busy ? 'opacity-50' : ''}`}>
              <Upload size={16} />{busy ? '上传中…' : '上传 PDF'}
              <input type="file" accept="application/pdf" disabled={busy} className="hidden" onChange={(e) => void upload(e.target.files?.[0] ?? null)} />
            </label>
          </div>

          <DriveUsageBar teacherId={account?.user?.id} refreshKey={usageKey} className="mb-4 max-w-sm" />

          {error && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {loading && <p className="p-5 text-sm text-slate-500">正在读取…</p>}
            {!loading && files.length === 0 && <p className="p-5 text-sm text-slate-500">云盘还是空的，点右上角上传第一个 PDF。</p>}
            {files.map((row) => (
              <div key={row.id} className="group flex items-center gap-3 px-4 py-3">
                <FileText size={18} className="shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{row.name}</div>
                  <div className="text-xs text-slate-400">{formatSize(row.size_bytes)} · {new Date(row.created_at).toLocaleDateString('zh-CN')}</div>
                </div>
                <Link to="/board" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">去黑板</Link>
                <button type="button" onClick={() => void remove(row)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800" aria-label="删除"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
