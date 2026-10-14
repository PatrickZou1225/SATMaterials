import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import BoardEditor from './BoardEditor'
import { useAccount } from '../context/account'
import { supabase } from '../lib/supabase'
import { TEACHER_PRICE_YEAR, useTeacherStatus, formatDate } from '../lib/teacher'
import type { Board as BoardRow } from '../lib/board'

const STATUS_LABEL: Record<BoardRow['status'], string> = {
  draft: '草稿',
  published: '已发布',
  archived: '已归档',
}

// `/board` — teachers land straight on a blackboard; students see the list of
// published boards to review.
export default function Board() {
  const account = useAccount()
  if (!account?.profile) return <PageMessage text="正在读取账号资料…" />
  if (!supabase) return <PageMessage text="尚未连接服务器，暂时无法使用讲解区。" />
  if (account.profile.role === 'teacher') return <TeacherBlackboard />
  return <StudentBoardList />
}

function TeacherBlackboard() {
  const { loading, active } = useTeacherStatus()
  if (loading) return <PageMessage text="正在检查订阅…" />
  if (!active) return (
    <div className="min-h-[60vh] grid place-items-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">订阅已到期</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-1">讲解区已暂停，你的板书都还在。</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">续费 ¥{TEACHER_PRICE_YEAR}/年即可恢复，请联系站长。</p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">返回首页</Link>
      </div>
    </div>
  )
  return <BoardEditor />
}

function StudentBoardList() {
  const [boards, setBoards] = useState<BoardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const refresh = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('boards')
      .select('id, title, status, page_count, pdf_path, pdf_name, created_at, updated_at')
      .order('updated_at', { ascending: false })
    if (error) setMessage('暂时无法读取板书。')
    else setBoards((data ?? []) as BoardRow[])
    setLoading(false)
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">讲解区</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">老师发布的板书，可随时回看。</p>
      {message && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{message}</p>}
      <section className="mt-8 space-y-3">
        {boards.map((board) => <StudentBoardCard key={board.id} board={board} />)}
        {!loading && boards.length === 0 && <p className="text-slate-500">暂时没有板书。</p>}
      </section>
    </div>
  )
}

function StudentBoardCard({ board }: { board: BoardRow }) {
  return (
    <Link to={`/board/${board.id}`} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700">
      <div className="flex min-w-0 items-center gap-3">
        <FileText size={18} className="shrink-0 text-blue-600 dark:text-blue-400" />
        <div className="min-w-0">
          <div className="truncate font-semibold text-slate-900 dark:text-slate-100">{board.title}</div>
          <div className="truncate text-xs text-slate-400">{board.page_count} 页 · 更新于 {formatDate(board.updated_at)}</div>
        </div>
      </div>
      <span className="shrink-0 text-sm font-semibold text-blue-600 dark:text-blue-400">打开 →</span>
    </Link>
  )
}

// `/board/archive` — a teacher's saved boards.
export function BoardArchive() {
  const [boards, setBoards] = useState<BoardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const refresh = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('boards')
      .select('id, title, status, page_count, pdf_path, pdf_name, created_at, updated_at')
      .order('updated_at', { ascending: false })
    if (error) setMessage('暂时无法读取板书。')
    else setBoards((data ?? []) as BoardRow[])
    setLoading(false)
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const remove = async (id: string) => {
    if (!supabase) return
    if (!window.confirm('确定删除这块板书吗？')) return
    await supabase.from('boards').delete().eq('id', id)
    await refresh()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">历史板书</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">讲过的板书存档，学生只读回看。</p>
        </div>
        <Link to="/board" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={18} /> 打开黑板
        </Link>
      </div>

      {message && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{message}</p>}

      <section className="mt-8 space-y-3">
        {boards.map((board) => (
          <div key={board.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <FileText size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="truncate font-semibold text-slate-900 dark:text-slate-100">{board.title}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${board.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>{STATUS_LABEL[board.status]}</span>
              </div>
              <p className="mt-1 truncate text-xs text-slate-400">{board.pdf_name ?? '未上传 PDF'} · {board.page_count} 页 · 更新于 {formatDate(board.updated_at)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/board/${board.id}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">回看</Link>
              <Link to={`/board/${board.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><Pencil size={15} />编辑</Link>
              <button type="button" onClick={() => void remove(board.id)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" aria-label="删除板书"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {!loading && boards.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">
            还没有保存的板书。点右上角「打开黑板」开始讲解。
          </div>
        )}
      </section>
    </div>
  )
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[50vh] grid place-items-center text-slate-500">{text}</div>
}
