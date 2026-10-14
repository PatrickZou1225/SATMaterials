import { useEffect, useState } from 'react'
import { driveUsage, formatBytes, STORAGE_QUOTA_BYTES } from '../lib/library'

type Props = {
  teacherId?: string
  // Bump this to re-read usage after an upload/delete.
  refreshKey?: number
  className?: string
}

// How full the 1 GB cloud drive is. Counts uploaded PDFs plus images pasted onto
// boards — the two things that actually take up space.
export default function DriveUsageBar({ teacherId, refreshKey = 0, className = '' }: Props) {
  const [used, setUsed] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    void driveUsage(teacherId).then((v) => { if (active) setUsed(v) })
    return () => { active = false }
  }, [teacherId, refreshKey])

  const pct = used === null ? 0 : (used / STORAGE_QUOTA_BYTES) * 100
  const warn = pct >= 90

  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>云盘容量</span>
        <span>{used === null ? '统计中…' : `${formatBytes(used)} / ${formatBytes(STORAGE_QUOTA_BYTES)}`}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full rounded-full transition-all ${warn ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: used === null ? '0%' : `${Math.max(2, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
  )
}
