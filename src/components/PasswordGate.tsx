import { useState } from 'react'
import { BookOpen, Lock, Eye, EyeOff } from 'lucide-react'

const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD || ''

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('sat_auth') === 'true'
  )
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // 没有设置密码，直接放行
  if (!SITE_PASSWORD) {
    return <>{children}</>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // 模拟短暂延迟，避免暴力破解
    await new Promise(r => setTimeout(r, 600))
    if (input === SITE_PASSWORD) {
      sessionStorage.setItem('sat_auth', 'true')
      setAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setInput('')
    }
    setLoading(false)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-slate-800">
              <Lock size={28} className="text-blue-600" />
            </div>
            <h1 className="flex items-center justify-center gap-2 text-xl font-bold text-gray-900 dark:text-slate-100 mb-1">
              <BookOpen size={22} className="text-blue-600 dark:text-blue-400" />
              SAT Prep
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">请输入访问密码</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={input}
                  onChange={e => { setInput(e.target.value); setError(false) }}
                  placeholder="输入密码"
                  autoFocus
                  className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors pr-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                    error
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 dark:border-slate-600 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-500">密码错误，请重试</p>
              )}

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '验证中...' : '进入网站'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
