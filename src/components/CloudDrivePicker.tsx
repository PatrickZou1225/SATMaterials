import { useCallback, useEffect, useState } from 'react'
import { FileText, Trash2, Upload, X } from 'lucide-react'
import DriveUsageBar from './DriveUsageBar'
import { useAccount } from '../context/account'
import { deleteLibraryFile, driveUsage, listLibraryFiles, uploadLibraryFile, STORAGE_QUOTA_BYTES, type LibraryFile } from '../lib/library'

type Props = {
  open: boolean
  onClose: () => void
  onPick: (file: LibraryFile) => void
}

export default function CloudDrivePicker({ open, onClose, onPick }: Props) {
  const account = useAccount()
  const [files, setFiles] = useState<LibraryFile[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [usageKey, setUsageKey] = useState(0)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setFiles(await listLibraryFiles())
    } catch {
      setError('读取云盘失败。')
    }
    setLoading(false)
  }, [])

  useEffect(() => { if (open) void refresh() }, [open, refresh])

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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">我的云盘</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="关闭"><X size={18} /></button>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <label className={`inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 ${busy ? 'opacity-50' : ''}`}>
            <Upload size={15} />{busy ? '上传中…' : '上传 PDF'}
            <input type="file" accept="application/pdf" disabled={busy} className="hidden" onChange={(e) => void upload(e.target.files?.[0] ?? null)} />
          </label>
          <span className="text-xs text-slate-400">点文件即可加载到黑板</span>
        </div>

        <DriveUsageBar teacherId={account?.user?.id} refreshKey={usageKey} className="px-4 py-3" />

        {error && <p className="px-4 pt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {loading && <p className="p-4 text-sm text-slate-500">正在读取…</p>}
          {!loading && files.length === 0 && <p className="p-4 text-sm text-slate-500">云盘还是空的，先上传一个 PDF。</p>}
          {files.map((row) => (
            <div key={row.id} className="group flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              <button type="button" onClick={() => onPick(row)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                <FileText size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="min-w-0 truncate text-sm text-slate-800 dark:text-slate-100">{row.name}</span>
              </button>
              <button type="button" onClick={() => void remove(row)} className="rounded p-1 text-slate-400 opacity-0 hover:text-red-600 group-hover:opacity-100" aria-label="删除"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
