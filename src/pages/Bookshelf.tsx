import { BookOpen, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const books = [
  {
    title: '大师之书',
    subtitle: "Master's Book · 26 Spring",
    detail: '8 个章节 · 258 道题',
    href: '/my-books/masters-book',
  },
  {
    title: '抵达之书',
    subtitle: 'SAT Arrival Book · 26 Revised',
    detail: '8 个章节 · 136 道题',
    href: '/my-books/arrival-book',
  },
]

export default function Bookshelf() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400"><BookOpen size={18} /> 私人电子讲义</div>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">我的讲义</h1>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {books.map((book) => (
            <Link key={book.href} to={book.href} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300"><BookOpen size={24} /></div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{book.title}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{book.subtitle}</p>
                  <p className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400">{book.detail}</p>
                </div>
                <ChevronRight className="mb-1 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
