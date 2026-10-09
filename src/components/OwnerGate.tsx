import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from '../context/account'

export default function OwnerGate({ children }: { children: ReactNode }) {
  const account = useAccount()

  if (!account?.profile) return <PageMessage text="正在读取账号资料…" />
  if (!account.profile.is_owner) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">私人讲义</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">这个页面仅限站长账号访问。</p>
          <Link to="/" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[50vh] grid place-items-center text-slate-500">{text}</div>
}
