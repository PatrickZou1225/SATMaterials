import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { BookOpen, Menu, X, Moon, Sun, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAccount } from '../context/account'

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-300 transition-colors'

const navMockClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-purple-600 dark:text-purple-300' : 'hover:text-purple-600 dark:hover:text-purple-300 transition-colors'

// Routes that take over the whole screen while a student is answering. The
// global nav and footer step aside there so nothing competes with the question.
const FOCUS_ROUTES = [
  /^\/mock-test\/[^/]+\/[^/]+$/,
  /^\/knowledge\/reading\/[^/]+\/[^/]+$/,
  /^\/official-practice$/,
  /^\/assignments\/[^/]+$/,
]

export default function Layout() {
  const account = useAccount()
  const { pathname } = useLocation()
  const focusMode = FOCUS_ROUTES.some((pattern) => pattern.test(pathname))
  const isTeacher = account?.profile?.role === 'teacher'
  const isOwner = account?.profile?.is_owner === true
  const [menuOpen, setMenuOpen] = useState(false)
  // One-shot message left by AccountGate (e.g. invite redemption result).
  const [flash, setFlash] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem('sat_theme')
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const stored = window.localStorage.getItem('sat_flash')
    if (stored) {
      window.localStorage.removeItem('sat_flash')
      setFlash(stored)
    }
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    window.localStorage.setItem('sat_theme', theme)
  }, [theme])

  const themeBtn = (
    <button
      type="button"
      onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {!focusMode && <header className="border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
            <BookOpen size={24} />
            SAT Prep
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <nav className="flex items-center gap-4 whitespace-nowrap">
              <NavLink to="/subjects" className={navClass}>科目</NavLink>
              <NavLink to="/knowledge" className={navClass}>专项</NavLink>
              <NavLink to="/practice" className={navClass}>练习</NavLink>
              <NavLink to="/mock-test" className={navMockClass}>模考</NavLink>
              <NavLink to="/official-practice" className={navClass}>样题</NavLink>
              {account && <NavLink to="/assignments" className={navClass}>作业</NavLink>}
              {isTeacher && <NavLink to="/bank" className={navClass}>题库</NavLink>}
              {isTeacher && <NavLink to="/students" className={navClass}>学生</NavLink>}
              {isTeacher && <NavLink to="/monitor" className={navClass}>学习情况</NavLink>}
              {isOwner && <NavLink to="/teachers" className={navClass}>老师</NavLink>}
              {isOwner && <NavLink to="/my-books/masters-book" className={navClass}>我的讲义</NavLink>}
              <NavLink to="/faq" className={navClass}>FAQ</NavLink>
              <NavLink to="/search" className={navClass}>
                <Search size={15} className="inline mr-1 -mt-0.5" />
                搜索
              </NavLink>
            </nav>
            {account && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300 whitespace-nowrap">
                <span className={`px-2 py-0.5 rounded-full font-semibold ${isTeacher ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                  {isTeacher ? '老师' : '学生'}
                </span>
                <button type="button" onClick={() => void account.signOut()} className="text-blue-600 dark:text-blue-400 hover:underline">退出</button>
              </div>
            )}
            {themeBtn}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 px-4 py-4 flex flex-col gap-4 text-sm font-medium">
            <NavLink to="/subjects" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">科目</NavLink>
            <NavLink to="/knowledge" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">专项</NavLink>
            <NavLink to="/practice" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">练习</NavLink>
            <NavLink to="/mock-test" onClick={() => setMenuOpen(false)} className="hover:text-purple-600 dark:hover:text-purple-300">模考</NavLink>
            <NavLink to="/official-practice" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">样题</NavLink>
            {account && <NavLink to="/assignments" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">作业</NavLink>}
            {isTeacher && <NavLink to="/bank" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">题库</NavLink>}
            {isTeacher && <NavLink to="/students" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">学生</NavLink>}
            {isTeacher && <NavLink to="/monitor" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">学习情况</NavLink>}
            {isOwner && <NavLink to="/teachers" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">老师</NavLink>}
            {isOwner && <NavLink to="/my-books/masters-book" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">我的讲义</NavLink>}
            <NavLink to="/faq" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">FAQ</NavLink>
            <NavLink to="/search" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">搜索</NavLink>
            <NavLink to="/practice" onClick={() => setMenuOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center">开始练习</NavLink>
            {account && <button type="button" onClick={() => void account.signOut()} className="text-left text-blue-600 dark:text-blue-400">{account.profile?.display_name || account.user.email} · 退出登录</button>}
            {themeBtn}
          </div>
        )}
      </header>}

      {flash && <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
          <span>{flash}</span>
          <button type="button" onClick={() => setFlash('')} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300" aria-label="关闭提示">×</button>
        </div>
      </div>}

      <main>
        <Outlet />
      </main>

      {!focusMode && <footer className="border-t py-10 px-4 text-center text-sm text-gray-500 dark:text-slate-400 border-slate-200 dark:border-slate-700">
        © 2026 SAT Prep · 专业SAT备考平台 · 助力梦想大学之路
      </footer>}
    </div>
  )
}
