import { Outlet, NavLink } from 'react-router-dom'
import { BookOpen, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <BookOpen size={24} />
            SAT Prep
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink to="/subjects" className={({ isActive }) => isActive ? 'text-blue-600' : 'hover:text-blue-600 transition-colors'}>科目</NavLink>
            <NavLink to="/practice" className={({ isActive }) => isActive ? 'text-blue-600' : 'hover:text-blue-600 transition-colors'}>练习</NavLink>
            <NavLink to="/faq" className={({ isActive }) => isActive ? 'text-blue-600' : 'hover:text-blue-600 transition-colors'}>常见问题</NavLink>
            <NavLink to="/practice" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">开始练习</NavLink>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium">
            <NavLink to="/subjects" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">科目</NavLink>
            <NavLink to="/practice" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">练习</NavLink>
            <NavLink to="/faq" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">常见问题</NavLink>
            <NavLink to="/practice" onClick={() => setMenuOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center">开始练习</NavLink>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t py-10 px-4 text-center text-sm text-gray-500">
        © 2026 SAT Prep · 专业SAT备考平台 · 助力梦想大学之路
      </footer>
    </div>
  )
}
