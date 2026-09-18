import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import PasswordGate from './PasswordGate'
import { supabase } from '../lib/supabase'
import { AccountContext, type Profile } from '../context/account'

export default function AccountGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getUser()
      .then(({ data }) => { if (active) setUser(data.user) })
      .catch(() => { if (active) setMessage('暂时无法连接登录服务，请稍后刷新页面。') })
      .finally(() => { if (active) setLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user ?? null)
        if (!session?.user) setProfile(null)
      }
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    if (!supabase || !user) return
    let active = true
    supabase.from('profiles').select('display_name, role').eq('id', user.id).single()
      .then(({ data }) => { if (active) setProfile(data as Profile | null) })
    return () => { active = false }
  }, [user])

  if (!supabase) return <PasswordGate>{children}</PasswordGate>

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    setSubmitting(true)
    setMessage('')
    const result = mode === 'register'
      ? await supabase.auth.signUp({
          email: email.trim(), password,
          options: {
            data: { display_name: displayName.trim() },
            emailRedirectTo: window.location.origin,
          },
        })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (result.error) {
      setMessage(result.error.message)
    } else if (mode === 'register' && !result.data.session) {
      setMessage('注册信息已提交，请查收验证邮件，完成验证后登录。')
      setMode('login')
    }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-screen grid place-items-center text-slate-600">正在检查登录状态…</div>

  if (!user) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 grid place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SAT Prep</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{mode === 'login' ? '登录后继续学习' : '注册学生账号'}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'register' && <label className="block text-sm text-slate-700 dark:text-slate-200">姓名或昵称
            <input required maxLength={60} value={displayName} onChange={event => setDisplayName(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" />
          </label>}
          <label className="block text-sm text-slate-700 dark:text-slate-200">邮箱
            <input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" />
          </label>
          <label className="block text-sm text-slate-700 dark:text-slate-200">密码
            <input required type="password" minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={event => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" />
          </label>
          {message && <p role="status" className="text-sm text-slate-600 dark:text-slate-300">{message}</p>}
          <button disabled={submitting} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{submitting ? '请稍候…' : mode === 'login' ? '登录' : '注册'}</button>
        </form>
        <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage('') }} className="mt-5 text-sm text-blue-600 dark:text-blue-400">
          {mode === 'login' ? '没有账号？注册' : '已有账号？登录'}
        </button>
      </div>
    </div>
  }

  return <AccountContext.Provider value={{ user, profile, signOut: async () => { if (supabase) await supabase.auth.signOut() } }}>
    {children}
  </AccountContext.Provider>
}
