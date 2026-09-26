import { useCallback, useEffect, useState } from 'react'
import { Copy, Plus } from 'lucide-react'
import { useAccount } from '../context/account'
import { supabase } from '../lib/supabase'
import { TEACHER_PRICE_YEAR, formatDate } from '../lib/teacher'

type Teacher = { id: string; display_name: string; email: string; is_owner: boolean }
type Subscription = { teacher_id: string; expires_at: string }
type Invite = { code: string; created_at: string }

const YEAR_MS = 365 * 24 * 60 * 60 * 1000

// Owner-only console: hand out single-use teacher invites and keep the annual
// ¥199 subscriptions current. Payment itself happens off-site (Alipay QR).
export default function Teachers() {
  const account = useAccount()
  const isOwner = account?.profile?.is_owner === true

  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [subs, setSubs] = useState<Subscription[]>([])
  const [pending, setPending] = useState<Invite[]>([])
  const [message, setMessage] = useState('')

  const refresh = useCallback(async () => {
    if (!supabase) return
    const [teacherRes, subRes, inviteRes] = await Promise.all([
      supabase.from('profiles').select('id, display_name, email, is_owner').eq('role', 'teacher').order('display_name'),
      supabase.from('teacher_subscriptions').select('teacher_id, expires_at').order('expires_at', { ascending: false }),
      supabase.from('invites').select('code, created_at').eq('kind', 'teacher').is('used_by', null).order('created_at', { ascending: false }),
    ])
    if (teacherRes.error) setMessage('暂时无法读取老师名单。')
    else setTeachers((teacherRes.data ?? []) as Teacher[])
    if (!subRes.error) setSubs((subRes.data ?? []) as Subscription[])
    if (!inviteRes.error) setPending((inviteRes.data ?? []) as Invite[])
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const expiresFor = (teacherId: string) => {
    const rows = subs.filter((s) => s.teacher_id === teacherId)
    if (rows.length === 0) return null
    return rows.reduce((latest, row) => (row.expires_at > latest ? row.expires_at : latest), rows[0].expires_at)
  }

  const createInvite = async () => {
    if (!supabase || !account) return
    setMessage('')
    const { error } = await supabase.from('invites')
      .insert({ kind: 'teacher', created_by: account.user.id, duration_days: 365 })
    if (error) {
      setMessage(error.message)
      return
    }
    await refresh()
  }

  const renew = async (teacherId: string) => {
    if (!supabase) return
    setMessage('')
    const current = expiresFor(teacherId)
    const startFrom = current && new Date(current) > new Date() ? new Date(current) : new Date()
    const nextExpiry = new Date(startFrom.getTime() + YEAR_MS).toISOString()
    // Always append: the newest expiry wins, and it keeps a record of each renewal.
    const { error } = await supabase.from('teacher_subscriptions').insert({ teacher_id: teacherId, expires_at: nextExpiry })
    if (error) {
      setMessage(error.message)
      return
    }
    await refresh()
  }

  const copyLink = async (code: string) => {
    const link = `${window.location.origin}/?invite=${code}`
    try {
      await navigator.clipboard.writeText(link)
      setMessage('邀请链接已复制，发给老师即可。')
    } catch {
      setMessage(link)
    }
  }

  if (!account?.profile) return <PageMessage text="正在读取账号资料…" />
  if (!supabase) return <PageMessage text="尚未连接服务器。" />
  if (!isOwner) return <PageMessage text="仅站长可以进入此页面。" />

  return <div className="max-w-4xl mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold">老师管理</h1>
    <p className="mt-2 text-slate-500 dark:text-slate-400">
      老师 ¥{TEACHER_PRICE_YEAR}/年。生成一次性邀请链接发给对方，注册后自动开通一年。
    </p>

    {message && <p role="status" className="mt-4 text-sm text-blue-600 dark:text-blue-400 break-all">{message}</p>}

    <section className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-lg">待使用的邀请链接</h2>
        <button type="button" onClick={() => void createInvite()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={16} /> 生成邀请
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {pending.map((invite) => <div key={invite.code} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2">
          <code className="text-sm break-all">{invite.code}</code>
          <button type="button" onClick={() => void copyLink(invite.code)}
            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
            <Copy size={14} /> 复制链接
          </button>
        </div>)}
        {pending.length === 0 && <p className="text-sm text-slate-400">还没有未使用的邀请链接。</p>}
      </div>
    </section>

    <section className="mt-6 space-y-3">
      <h2 className="font-semibold text-lg">老师名单</h2>
      {teachers.map((teacher) => {
        const expiresAt = expiresFor(teacher.id)
        const expired = expiresAt !== null && new Date(expiresAt) <= new Date()
        return <article key={teacher.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">{teacher.display_name}{teacher.is_owner && <span className="ml-2 text-xs rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-2 py-0.5">站长</span>}</h3>
              <p className="text-sm text-slate-400">{teacher.email}</p>
              <p className={`mt-1 text-sm ${teacher.is_owner ? 'text-slate-400' : expired ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {teacher.is_owner ? '永久有效' : expiresAt === null ? '未开通' : `${expired ? '已到期' : '到期'}：${formatDate(expiresAt)}`}
              </p>
            </div>
            {!teacher.is_owner && <button type="button" onClick={() => void renew(teacher.id)}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium hover:border-blue-400">
              {expiresAt === null ? '开通一年' : '续费一年'}
            </button>}
          </div>
        </article>
      })}
      {teachers.length === 0 && <p className="text-slate-500">还没有老师。</p>}
    </section>
  </div>
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[50vh] grid place-items-center text-slate-500">{text}</div>
}
