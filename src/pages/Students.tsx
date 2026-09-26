import { useCallback, useEffect, useState } from 'react'
import { Copy, Plus } from 'lucide-react'
import { useAccount } from '../context/account'
import { supabase } from '../lib/supabase'
import { PAID_YEARS, YEAR_PRICE } from '../lib/access'

type Student = { id: string; display_name: string; email: string }
type Entitlement = { id: string; student_id: string; year: number }
type Invite = { code: string; created_at: string }

// Teacher-side roster: see every student and which real-paper years they own.
// Unlocking is manual for now (no payment integration). Learning-record
// monitoring lives on its own page (src/pages/Monitor.tsx).
export default function Students() {
  const account = useAccount()
  const isTeacher = account?.profile?.role === 'teacher'

  const [students, setStudents] = useState<Student[]>([])
  const [entitlements, setEntitlements] = useState<Entitlement[]>([])
  const [pending, setPending] = useState<Invite[]>([])
  const [message, setMessage] = useState('')

  // Row-level security already limits students to the caller's own roster
  // (the owner sees everyone), so no extra filter is needed here.
  const refresh = useCallback(async () => {
    if (!supabase) return
    const [studentRes, entitlementRes, inviteRes] = await Promise.all([
      supabase.from('profiles').select('id, display_name, email').eq('role', 'student').order('display_name'),
      supabase.from('entitlements').select('id, student_id, year'),
      supabase.from('invites').select('code, created_at').eq('kind', 'student').is('used_by', null).order('created_at', { ascending: false }),
    ])
    if (studentRes.error) setMessage('暂时无法读取学生名单。')
    else setStudents((studentRes.data ?? []) as Student[])
    if (entitlementRes.error) setMessage('暂时无法读取解锁记录。')
    else setEntitlements((entitlementRes.data ?? []) as Entitlement[])
    if (!inviteRes.error) setPending((inviteRes.data ?? []) as Invite[])
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const createInvite = async () => {
    if (!supabase || !account) return
    setMessage('')
    const { error } = await supabase.from('invites').insert({ kind: 'student', created_by: account.user.id })
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
      setMessage('学生邀请链接已复制，发给学生即可。')
    } catch {
      setMessage(link)
    }
  }

  const unlockedYears = (studentId: string) =>
    entitlements.filter((e) => e.student_id === studentId).map((e) => e.year)

  const grant = async (studentId: string, year: number) => {
    if (!supabase || !account) return
    setMessage('')
    const { error } = await supabase.from('entitlements').insert({
      student_id: studentId,
      year,
      granted_by: account.user.id,
    })
    if (error) {
      setMessage(error.message)
      return
    }
    await refresh()
  }

  const revoke = async (studentId: string, year: number) => {
    if (!supabase) return
    setMessage('')
    const { error } = await supabase.from('entitlements').delete().eq('student_id', studentId).eq('year', year)
    if (error) {
      setMessage(error.message)
      return
    }
    await refresh()
  }

  if (!account?.profile) return <PageMessage text="正在读取账号资料…" />
  if (!supabase) return <PageMessage text="尚未连接服务器，暂时无法使用。" />
  if (!isTeacher) return <PageMessage text="仅老师可以查看学生管理。" />

  return <div className="max-w-4xl mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold">学生管理</h1>
    <p className="mt-2 text-slate-500 dark:text-slate-400">把学生邀请链接发给学生，注册后自动归到你名下。再手动开通真题年份。</p>

    {message && <p role="status" className="mt-4 text-sm text-blue-600 dark:text-blue-400 break-all">{message}</p>}

    <section className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-lg">学生邀请链接</h2>
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
      {students.map((student) => {
        const owned = unlockedYears(student.id)
        return <article key={student.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-lg">{student.display_name}</h2>
              <p className="text-sm text-slate-400">{student.email}</p>
            </div>
            <select
              value=""
              onChange={(e) => { if (e.target.value) void grant(student.id, Number(e.target.value)) }}
              className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
            >
              <option value="" disabled>开通年份…</option>
              {PAID_YEARS.filter((year) => !owned.includes(year)).map((year) => (
                <option key={year} value={year}>{year} 年（¥{YEAR_PRICE[year]}）</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {PAID_YEARS.map((year) => {
              const has = owned.includes(year)
              return <button
                key={year}
                type="button"
                disabled={!has}
                onClick={() => has && void revoke(student.id, year)}
                title={has ? '点击取消解锁' : '未解锁'}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  has
                    ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950/40 dark:text-green-300 hover:border-red-300 hover:text-red-600'
                    : 'border-dashed border-slate-300 dark:border-slate-600 text-slate-400 cursor-default'
                }`}
              >
                {year} {has ? '已解锁' : '未解锁'}
              </button>
            })}
          </div>
        </article>
      })}
      {students.length === 0 && <p className="text-slate-500">还没有已注册的学生。</p>}
    </section>
  </div>
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[50vh] grid place-items-center text-slate-500">{text}</div>
}
