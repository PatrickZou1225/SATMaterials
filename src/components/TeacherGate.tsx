import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from '../context/account'
import { TEACHER_PRICE_YEAR, useTeacherStatus } from '../lib/teacher'

// Wraps teacher-only backend pages. A teacher whose subscription has lapsed keeps
// their account and data but cannot open the backend until it is renewed.
export default function TeacherGate({ children }: { children: ReactNode }) {
  const account = useAccount()
  const { loading, isTeacher, active, isOwner } = useTeacherStatus()

  if (!account?.profile) return <PageMessage text="正在读取账号资料…" />
  if (!isTeacher) return <PageMessage text="仅老师可以进入此页面。" />
  if (loading) return <PageMessage text="正在检查订阅…" />
  if (!active && !isOwner) {
    return <div className="min-h-[60vh] grid place-items-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">订阅已到期</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-1">后台功能已暂停，你的班级、作业和学生数据都还在。</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">续费 ¥{TEACHER_PRICE_YEAR}/年即可恢复，请联系站长。</p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
          返回首页
        </Link>
      </div>
    </div>
  }
  return <>{children}</>
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[50vh] grid place-items-center text-slate-500">{text}</div>
}
