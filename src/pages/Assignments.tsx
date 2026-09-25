import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { useAccount } from '../context/account'
import { supabase } from '../lib/supabase'
import { buildQuestionBank } from '../lib/questionBank'

type Student = { id: string; display_name: string; email: string }
type Assignment = {
  id: string
  title: string
  instructions: string
  due_at: string | null
  status: 'draft' | 'published' | 'closed'
  created_at: string
}

export default function Assignments() {
  const account = useAccount()
  const isTeacher = account?.profile?.role === 'teacher'
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const bank = useMemo(() => buildQuestionBank(), [])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openSets, setOpenSets] = useState<Set<string>>(new Set())
  const [openModules, setOpenModules] = useState<Set<string>>(new Set())

  const loadAssignments = useCallback(async () => {
    if (!supabase) return { data: [] as Assignment[], error: null }
    const { data, error } = await supabase
      .from('assignments')
      .select('id, title, instructions, due_at, status, created_at')
      .order('created_at', { ascending: false })
    return { data: (data ?? []) as Assignment[], error }
  }, [])

  useEffect(() => {
    void loadAssignments().then(({ data, error }) => {
      if (error) setMessage('暂时无法读取作业。')
      else setAssignments(data)
    })
  }, [loadAssignments])

  useEffect(() => {
    if (!supabase || !isTeacher) return
    supabase.from('profiles').select('id, display_name, email').eq('role', 'student').order('display_name')
      .then(({ data, error }) => {
        if (error) setMessage('暂时无法读取学生名单。')
        else setStudents((data ?? []) as Student[])
      })
  }, [isTeacher])

  const setKeys = (setId: string) => {
    const set = bank.sets.find(s => s.id === setId)
    return set ? set.modules.flatMap(module => module.questions.map(q => q.key)) : []
  }
  const moduleKeys = (setId: string, moduleNum: number) => {
    const set = bank.sets.find(s => s.id === setId)
    const module = set?.modules.find(m => m.moduleNum === moduleNum)
    return module ? module.questions.map(q => q.key) : []
  }
  const toggleKeys = (keys: string[], selectAll: boolean) => {
    setSelectedKeys(prev => {
      const next = new Set(prev)
      keys.forEach(key => { if (selectAll) next.add(key); else next.delete(key) })
      return [...next]
    })
  }
  const toggleOne = (key: string) => {
    setSelectedKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }
  const allSelected = (keys: string[]) => keys.length > 0 && keys.every(key => selectedKeys.includes(key))

  const createAssignment = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase || !account || selectedStudents.length === 0) {
      setMessage('请至少选择一名学生。')
      return
    }
    setSaving(true)
    setMessage('')
    const { data, error } = await supabase.from('assignments').insert({
      title: title.trim(),
      instructions: instructions.trim(),
      due_at: dueAt ? new Date(dueAt).toISOString() : null,
      created_by: account.user.id,
    }).select('id').single()

    if (error || !data) {
      setMessage(error?.message ?? '创建作业失败。')
      setSaving(false)
      return
    }

    const { error: recipientError } = await supabase.from('assignment_recipients').insert(
      selectedStudents.map(studentId => ({ assignment_id: data.id, student_id: studentId })),
    )
    if (recipientError) {
      await supabase.from('assignments').delete().eq('id', data.id)
      setMessage('分配学生失败，作业未保存。')
      setSaving(false)
      return
    }

    const orderedKeys = bank.sets
      .flatMap(set => set.modules.flatMap(module => module.questions.map(q => q.key)))
      .filter(key => selectedKeys.includes(key))
    if (orderedKeys.length > 0) {
      const { error: questionError } = await supabase.from('assignment_questions').insert(
        orderedKeys.map((key, index) => ({ assignment_id: data.id, position: index + 1, question_key: key })),
      )
      if (questionError) {
        await supabase.from('assignments').delete().eq('id', data.id)
        setMessage('保存题目失败，作业未保存。')
        setSaving(false)
        return
      }
    }

    setTitle('')
    setInstructions('')
    setDueAt('')
    setSelectedStudents([])
    setSelectedKeys([])
    setMessage('作业已发布。')
    const refreshed = await loadAssignments()
    if (!refreshed.error) setAssignments(refreshed.data)
    setSaving(false)
  }

  if (!account?.profile) return <PageMessage text="正在读取账号资料…" />

  return <div className="max-w-5xl mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold">{isTeacher ? '作业管理' : '我的作业'}</h1>
    <p className="mt-2 text-slate-500 dark:text-slate-400">{isTeacher ? '向学生发布学习任务并查看作业列表。' : '查看老师分配给你的学习任务。'}</p>

    {isTeacher && <form onSubmit={createAssignment} className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
      <h2 className="text-xl font-semibold">布置新作业</h2>
      <label className="block text-sm">标题
        <input required maxLength={120} value={title} onChange={event => setTitle(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2" />
      </label>
      <label className="block text-sm">作业说明
        <textarea rows={3} value={instructions} onChange={event => setInstructions(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2" />
      </label>
      <label className="block text-sm">截止时间
        <input type="datetime-local" value={dueAt} onChange={event => setDueAt(event.target.value)} className="mt-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2" />
      </label>
      <fieldset>
        <legend className="text-sm mb-2">从题库选题（可选）</legend>
        <p className="text-sm text-slate-500 dark:text-slate-400">已选 {selectedKeys.length} 题。</p>
        <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700 overflow-hidden">
          {bank.sets.map(set => {
            const keys = setKeys(set.id)
            const setOpen = openSets.has(set.id)
            return <div key={set.id}>
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
                <button type="button" onClick={() => setOpenSets(prev => { const next = new Set(prev); setOpen ? next.delete(set.id) : next.add(set.id); return next })} className="flex-1 text-left text-sm font-medium">{setOpen ? '▾' : '▸'} {set.title}</button>
                <label className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                  <input type="checkbox" checked={allSelected(keys)} onChange={event => toggleKeys(keys, event.target.checked)} />
                  整套 {set.questionCount} 题
                </label>
              </div>
              {setOpen && <div className="px-4 py-3 space-y-3">
                {set.modules.map(module => {
                  const mKeys = moduleKeys(set.id, module.moduleNum)
                  const mKey = `${set.id}:${module.moduleNum}`
                  const mOpen = openModules.has(mKey)
                  return <div key={mKey}>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setOpenModules(prev => { const next = new Set(prev); mOpen ? next.delete(mKey) : next.add(mKey); return next })} className="flex-1 text-left text-sm font-medium">{mOpen ? '▾' : '▸'} {module.name}</button>
                      <label className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                        <input type="checkbox" checked={allSelected(mKeys)} onChange={event => toggleKeys(mKeys, event.target.checked)} />
                        全选 {module.questions.length} 题
                      </label>
                    </div>
                    {mOpen && <ul className="mt-2 space-y-1 pl-4">
                      {module.questions.map(q => <li key={q.key} className="flex items-start gap-2 text-sm">
                        <input type="checkbox" className="mt-1" checked={selectedKeys.includes(q.key)} onChange={() => toggleOne(q.key)} />
                        <span className="text-slate-600 dark:text-slate-300">第 {q.question.id} 题 · {truncate(q.question.question)}</span>
                      </li>)}
                    </ul>}
                  </div>
                })}
              </div>}
            </div>
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm mb-2">分配学生</legend>
        <div className="grid sm:grid-cols-2 gap-2">
          {students.map(student => <label key={student.id} className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm">
            <input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={event => setSelectedStudents(current => event.target.checked ? [...current, student.id] : current.filter(id => id !== student.id))} />
            <span>{student.display_name} <span className="text-slate-400">{student.email}</span></span>
          </label>)}
          {students.length === 0 && <p className="text-sm text-slate-500">暂无已注册学生。</p>}
        </div>
      </fieldset>
      <button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:opacity-60">{saving ? '发布中…' : '发布作业'}</button>
    </form>}

    {message && <p role="status" className="mt-5 text-sm text-blue-600 dark:text-blue-400">{message}</p>}

    <section className="mt-8 space-y-3">
      <h2 className="text-xl font-semibold">作业列表</h2>
      {assignments.map(assignment => <article key={assignment.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-semibold text-lg">{assignment.title}</h3>
          <span className="text-xs rounded-full bg-blue-50 dark:bg-blue-950 px-2.5 py-1 text-blue-700 dark:text-blue-300">{assignment.status === 'published' ? '进行中' : assignment.status === 'closed' ? '已结束' : '草稿'}</span>
        </div>
        {assignment.instructions && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{assignment.instructions}</p>}
        <p className="mt-3 text-xs text-slate-400">{assignment.due_at ? `截止：${new Date(assignment.due_at).toLocaleString('zh-CN')}` : '未设置截止时间'}</p>
      </article>)}
      {assignments.length === 0 && <p className="text-slate-500">暂时没有作业。</p>}
    </section>
  </div>
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[50vh] grid place-items-center text-slate-500">{text}</div>
}

const truncate = (text: string, max = 60) => (text.length > max ? text.slice(0, max) + '…' : text)
