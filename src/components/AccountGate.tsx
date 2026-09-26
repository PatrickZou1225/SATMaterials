import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import PasswordGate from './PasswordGate'
import { supabase } from '../lib/supabase'
import { AccountContext, type Profile } from '../context/account'

export default function AccountGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileState, setProfileState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [profileAttempt, setProfileAttempt] = useState(0)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [inviteCode, setInviteCode] = useState(() =>
    typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('invite') ?? '')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Invite codes arrive via a ?invite= link. The code is redeemable only once the
  // account is authenticated, which may be after email confirmation, so stash it
  // and consume it on the next sign-in.
  useEffect(() => {
    if (!supabase || !user) return
    const pending = window.localStorage.getItem('sat_pending_invite')
    if (!pending) return
    window.localStorage.removeItem('sat_pending_invite')
    void supabase.rpc('redeem_invite', { invite_code: pending }).then(({ data }) => {
      if (data === 'teacher') {
        window.localStorage.setItem('sat_flash', '老师账号已开通，欢迎使用后台。')
        setProfileAttempt(attempt => attempt + 1)
      } else if (data === 'student') {
        window.localStorage.setItem('sat_flash', '已加入你的老师。')
        setProfileAttempt(attempt => attempt + 1)
      } else {
        window.localStorage.setItem('sat_flash', '邀请码无效或已被使用，请向老师确认后重试。')
      }
    })
  }, [user])

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
    setProfileState('loading')
    supabase.from('profiles').select('display_name, role, is_owner').eq('id', user.id).single()
      .then(({ data, error }) => {
        if (!active) return
        setProfile(error ? null : data as Profile | null)
        setProfileState(error ? 'error' : 'ready')
      })
    return () => { active = false }
  }, [user, profileAttempt])

  if (!supabase) return <PasswordGate>{children}</PasswordGate>

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    setSubmitting(true)
    setMessage('')
    if (mode === 'register' && inviteCode.trim()) {
      window.localStorage.setItem('sat_pending_invite', inviteCode.trim())
    }
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
          {mode === 'register' && <label className="block text-sm text-slate-700 dark:text-slate-200">邀请码（老师提供，可选）
            <input value={inviteCode} onChange={event => setInviteCode(event.target.value)} placeholder="没有可不填"
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" />
            {inviteCode.trim() && <span className="mt-1 block text-xs text-blue-600 dark:text-blue-400">已带邀请码，注册后将自动开通。</span>}
          </label>}
          {message && <p role="status" className="text-sm text-slate-600 dark:text-slate-300">{message}</p>}
          <button disabled={submitting} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{submitting ? '请稍候…' : mode === 'login' ? '登录' : '注册'}</button>
        </form>
        <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage('') }} className="mt-5 text-sm text-blue-600 dark:text-blue-400">
          {mode === 'login' ? '没有账号？注册' : '已有账号？登录'}
        </button>
      </div>
    </div>
  }

  if (profileState === 'error') {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 grid place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-200 dark:border-slate-700 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">无法读取账号资料</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">请检查网络后重试，或退出后重新登录。</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={() => setProfileAttempt(attempt => attempt + 1)} className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700">重试</button>
          <button type="button" onClick={() => { if (supabase) void supabase.auth.signOut() }} className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">退出登录</button>
        </div>
      </div>
    </div>
  }

  if (!profile) return <div className="min-h-screen grid place-items-center text-slate-600">正在读取账号资料…</div>

  return <AccountContext.Provider value={{ user, profile, signOut: async () => { if (supabase) await supabase.auth.signOut() } }}>
    {children}
  </AccountContext.Provider>
}
