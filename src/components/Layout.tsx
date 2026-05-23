import { Outlet, NavLink } from 'react-router-dom'
import { BookOpen, Menu, X, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem('sat_theme')
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

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
      <header className="border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
            <BookOpen size={24} />
            SAT Prep
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <nav className="flex items-center gap-6">
              <NavLink to="/subjects" className={({ isActive }) => isActive ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-300 transition-colors'}>科目</NavLink>
              <NavLink to="/knowledge" className={({ isActive }) => isActive ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-300 transition-colors'}>专项知识点</NavLink>
              <NavLink to="/practice" className={({ isActive }) => isActive ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-300 transition-colors'}>练习</NavLink>
              <NavLink to="/mock-test" className={({ isActive }) => isActive ? 'text-purple-600 dark:text-purple-300' : 'hover:text-purple-600 dark:hover:text-purple-300 transition-colors'}>模拟测试</NavLink>
              <NavLink to="/faq" className={({ isActive }) => isActive ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-300 transition-colors'}>常见问题</NavLink>
            </nav>
            <NavLink to="/practice" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">开始练习</NavLink>
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
            <NavLink to="/knowledge" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">专项知识点</NavLink>
            <NavLink to="/practice" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">练习</NavLink>
            <NavLink to="/mock-test" onClick={() => setMenuOpen(false)} className="hover:text-purple-600 dark:hover:text-purple-300">模拟测试</NavLink>
            <NavLink to="/faq" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-300">常见问题</NavLink>
            <NavLink to="/practice" onClick={() => setMenuOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center">开始练习</NavLink>
            {themeBtn}
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t py-10 px-4 text-center text-sm text-gray-500 dark:text-slate-400 border-slate-200 dark:border-slate-700">
        © 2026 SAT Prep · 专业SAT备考平台 · 助力梦想大学之路
      </footer>
    </div>
  )
}
