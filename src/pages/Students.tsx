import { useCallback, useEffect, useState } from 'react'
import { useAccount } from '../context/account'
import { supabase } from '../lib/supabase'
import { PAID_YEARS, YEAR_PRICE } from '../lib/access'

type Student = { id: string; display_name: string; email: string }
type Entitlement = { id: string; student_id: string; year: number }

// Teacher-side roster: see every student and which real-paper years they own.
// Unlocking is manual for now (no payment integration); this page is also where
// the phase-⑤ monitoring views will live later.
export default function Students() {
  const account = useAccount()
  const isTeacher = account?.profile?.role === 'teacher'

  const [students, setStudents] = useState<Student[]>([])
  const [entitlements, setEntitlements] = useState<Entitlement[]>([])
  const [message, setMessage] = useState('')

  const refresh = useCallback(async () => {
    if (!supabase) return
    const [studentRes, entitlementRes] = await Promise.all([
      supabase.from('profiles').select('id, display_name, email').eq('role', 'student').order('display_name'),
      supabase.from('entitlements').select('id, student_id, year'),
    ])
    if (studentRes.error) setMessage('暂时无法读取学生名单。')
    else setStudents((studentRes.data ?? []) as Student[])
    if (entitlementRes.error) setMessage('暂时无法读取解锁记录。')
    else setEntitlements((entitlementRes.data ?? []) as Entitlement[])
  }, [])

  useEffect(() => { void refresh() }, [refresh])

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
    <p className="mt-2 text-slate-500 dark:text-slate-400">查看学生名单，并手动开通真题年份。</p>

    {message && <p role="status" className="mt-4 text-sm text-red-600 dark:text-red-400">{message}</p>}

    <section className="mt-8 space-y-3">
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
