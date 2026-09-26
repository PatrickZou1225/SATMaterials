import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, Plus, Search, Trash2 } from 'lucide-react'
import { useAccount } from '../context/account'
import { supabase } from '../lib/supabase'
import { buildQuestionBank, type BankModule } from '../lib/questionBank'
import { DOMAIN_ORDER, domainLabel, skillLabel } from '../lib/skills'
import { TEACHER_PRICE_YEAR, useTeacherStatus } from '../lib/teacher'

type Student = { id: string; display_name: string; email: string }
type Assignment = {
  id: string
  title: string
  instructions: string
  due_at: string | null
  status: 'draft' | 'published' | 'closed'
  created_at: string
}
type ClassRow = { id: string; name: string; memberIds: string[] }
type ModuleStat = { students: Set<string>; correct: number; total: number }

type DeployMode = 'compose' | 'fullset' | 'skill'
type SubjectFilter = 'all' | '阅读与文法' | '数学'
type TeacherTab = 'create' | 'classes' | 'list'

const PAGE_SIZE = 15

const statKey = (setId: string, moduleNum: number) => `${setId}:${moduleNum}`
const accuracy = (correct: number, total: number) => (total > 0 ? Math.round((correct / total) * 100) : null)

// One selectable row in the right-hand bank panel: a whole set (整套 mode), a
// single module (组卷 mode), or a knowledge point (知识点 mode). `keys` are the
// question_keys it contributes.
type PickerRow = {
  id: string
  title: string
  parent: string
  questionCount: number
  keys: string[]
  students: number
  accuracy: number | null
  subject?: string
  // Knowledge-point rows aggregate across sets, so per-module accuracy doesn't
  // apply; this carries their coverage line instead.
  note?: string
}

export default function Assignments() {
  const account = useAccount()
  const isTeacher = account?.profile?.role === 'teacher'
  const { loading: teacherLoading, active: teacherActive } = useTeacherStatus()
  const bank = useMemo(() => buildQuestionBank(), [])

  const [tab, setTab] = useState<TeacherTab>('create')
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [stats, setStats] = useState<Map<string, ModuleStat>>(new Map())
  const [mySubmissions, setMySubmissions] = useState<Map<string, string>>(new Map())

  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [mode, setMode] = useState<DeployMode>('compose')
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all')
  const [query, setQuery] = useState('')
  const [selectedOnly, setSelectedOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const [newClassName, setNewClassName] = useState('')
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null)
  const [classMessage, setClassMessage] = useState('')

  const refreshAssignments = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('assignments')
      .select('id, title, instructions, due_at, status, created_at')
      .order('created_at', { ascending: false })
    if (error) setMessage('暂时无法读取作业。')
    else setAssignments((data ?? []) as Assignment[])
  }, [])

  const refreshClasses = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('classes')
      .select('id, name, class_members(student_id)')
      .order('created_at')
    if (error) {
      setClassMessage('暂时无法读取班级。')
      return
    }
    setClasses((data ?? []).map((row) => ({
      id: row.id as string,
      name: row.name as string,
      memberIds: ((row.class_members ?? []) as { student_id: string }[]).map((m) => m.student_id),
    })))
  }, [])

  useEffect(() => { void refreshAssignments() }, [refreshAssignments])

  useEffect(() => {
    if (!supabase || !isTeacher) return
    void supabase.from('profiles').select('id, display_name, email').eq('role', 'student').order('display_name')
      .then(({ data, error }) => {
        if (error) setMessage('暂时无法读取学生名单。')
        else setStudents((data ?? []) as Student[])
      })
    void refreshClasses()
  }, [isTeacher, refreshClasses])

  useEffect(() => {
    if (!supabase || isTeacher || !account?.user) return
    void supabase.from('submissions').select('assignment_id, status')
      .then(({ data }) => {
        const next = new Map<string, string>()
        for (const row of (data ?? []) as { assignment_id: string; status: string }[]) next.set(row.assignment_id, row.status)
        setMySubmissions(next)
      })
  }, [isTeacher, account?.user])

  useEffect(() => {
    if (!supabase || !isTeacher) return
    void supabase.from('attempts')
      .select('set_id, module_num, student_id, correct_count, total_questions')
      .eq('status', 'submitted')
      .then(({ data }) => {
        const next = new Map<string, ModuleStat>()
        for (const row of (data ?? []) as { set_id: string; module_num: number; student_id: string; correct_count: number | null; total_questions: number }[]) {
          const key = statKey(row.set_id, row.module_num)
          const stat = next.get(key) ?? { students: new Set<string>(), correct: 0, total: 0 }
          stat.students.add(row.student_id)
          stat.correct += row.correct_count ?? 0
          stat.total += row.total_questions
          next.set(key, stat)
        }
        setStats(next)
      })
  }, [isTeacher])

  const studentName = (id: string) => students.find((s) => s.id === id)?.display_name ?? id

  const rows: PickerRow[] = useMemo(() => {
    const matchesQuery = (text: string) => text.toLowerCase().includes(query.trim().toLowerCase())
    const keepModule = (module: BankModule) => subjectFilter === 'all' || module.subject === subjectFilter

    if (mode === 'skill') {
      // One row per knowledge point, pooling its questions across every set so a
      // teacher can drill a single skill.
      const groups = new Map<string, { domain: string; keys: string[]; sets: Set<string>; modules: Set<string> }>()
      for (const set of bank.sets) {
        for (const module of set.modules) {
          for (const q of module.questions) {
            const skill = q.question.skill
            if (!skill) continue
            const group = groups.get(skill) ?? { domain: q.question.domain ?? '', keys: [], sets: new Set<string>(), modules: new Set<string>() }
            group.keys.push(q.key)
            group.sets.add(set.id)
            group.modules.add(statKey(set.id, module.moduleNum))
            groups.set(skill, group)
          }
        }
      }
      return [...groups.entries()]
        .map(([skill, group]) => ({ skill, group, rank: DOMAIN_ORDER.indexOf(group.domain) }))
        .sort((a, b) => (a.rank - b.rank) || a.skill.localeCompare(b.skill))
        .map(({ skill, group }) => ({
          id: `skill:${skill}`,
          title: skillLabel(skill),
          parent: domainLabel(group.domain),
          questionCount: group.keys.length,
          keys: group.keys,
          students: 0,
          accuracy: null,
          note: `覆盖 ${group.sets.size} 套 / ${group.modules.size} 个模块 · ${skill}`,
        }))
        .filter((row) => matchesQuery(`${row.parent} ${row.title} ${row.note}`))
    }

    if (mode === 'fullset') {
      return bank.sets.map((set) => {
        const modules = set.modules.filter(keepModule)
        const keys = modules.flatMap((m) => m.questions.map((q) => q.key))
        const perModule = modules.map((m) => stats.get(statKey(set.id, m.moduleNum))).filter(Boolean) as ModuleStat[]
        const seen = new Set<string>()
        let correct = 0
        let total = 0
        for (const stat of perModule) {
          stat.students.forEach((id) => seen.add(id))
          correct += stat.correct
          total += stat.total
        }
        return {
          id: `set:${set.id}`,
          title: set.title,
          parent: `${modules.length} 模块 · ${keys.length} 题`,
          questionCount: keys.length,
          keys,
          students: seen.size,
          accuracy: accuracy(correct, total),
        }
      }).filter((row) => row.questionCount > 0 && matchesQuery(row.title))
    }

    const out: PickerRow[] = []
    for (const set of bank.sets) {
      for (const module of set.modules) {
        if (!keepModule(module)) continue
        const keys = module.questions.map((q) => q.key)
        const stat = stats.get(statKey(set.id, module.moduleNum))
        out.push({
          id: `mod:${set.id}:${module.moduleNum}`,
          title: module.name,
          parent: set.title,
          questionCount: keys.length,
          keys,
          students: stat ? stat.students.size : 0,
          accuracy: stat ? accuracy(stat.correct, stat.total) : null,
          subject: module.subject,
        })
      }
    }
    return out.filter((row) => matchesQuery(`${row.parent} ${row.title}`))
  }, [bank, mode, subjectFilter, query, stats])

  const visibleRows = selectedOnly ? rows.filter((row) => row.keys.some((key) => selectedKeys.includes(key))) : rows
  const pageCount = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pagedRows = visibleRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const allSelected = (keys: string[]) => keys.length > 0 && keys.every((key) => selectedKeys.includes(key))
  const toggleRow = (keys: string[], on: boolean) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      keys.forEach((key) => (on ? next.add(key) : next.delete(key)))
      return [...next]
    })
  }
  const rowChecked = (row: PickerRow) => allSelected(row.keys)

  const recipientIds = useMemo(() => {
    const set = new Set(selectedStudentIds)
    for (const classId of selectedClassIds) {
      classes.find((c) => c.id === classId)?.memberIds.forEach((id) => set.add(id))
    }
    return [...set]
  }, [selectedStudentIds, selectedClassIds, classes])

  const createAssignment = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase || !account) return
    if (recipientIds.length === 0) {
      setMessage('请至少选择一名学生或一个班级。')
      return
    }
    if (selectedKeys.length === 0) {
      setMessage('请至少选择一道题。')
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
      recipientIds.map((studentId) => ({ assignment_id: data.id, student_id: studentId })),
    )
    if (recipientError) {
      await supabase.from('assignments').delete().eq('id', data.id)
      setMessage('分配学生失败，作业未保存。')
      setSaving(false)
      return
    }

    const orderedKeys = bank.sets
      .flatMap((set) => set.modules.flatMap((m) => m.questions.map((q) => q.key)))
      .filter((key) => selectedKeys.includes(key))
    const { error: questionError } = await supabase.from('assignment_questions').insert(
      orderedKeys.map((key, index) => ({ assignment_id: data.id, position: index + 1, question_key: key })),
    )
    if (questionError) {
      await supabase.from('assignments').delete().eq('id', data.id)
      setMessage('保存题目失败，作业未保存。')
      setSaving(false)
      return
    }

    setTitle('')
    setInstructions('')
    setDueAt('')
    setSelectedClassIds([])
    setSelectedStudentIds([])
    setSelectedKeys([])
    setMessage(`作业已布置给 ${recipientIds.length} 名学生，共 ${orderedKeys.length} 题。`)
    setTab('list')
    await refreshAssignments()
    setSaving(false)
  }

  const createClass = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase || !account) return
    const name = newClassName.trim()
    if (!name) return
    setClassMessage('')
    const { error } = await supabase.from('classes').insert({ name, teacher_id: account.user.id })
    if (error) {
      setClassMessage(error.message)
      return
    }
    setNewClassName('')
    await refreshClasses()
  }

  const addMember = async (classId: string, studentId: string) => {
    if (!supabase || !studentId) return
    const { error } = await supabase.from('class_members').insert({ class_id: classId, student_id: studentId })
    if (error) {
      setClassMessage(error.message)
      return
    }
    await refreshClasses()
  }

  const removeMember = async (classId: string, studentId: string) => {
    if (!supabase) return
    await supabase.from('class_members').delete().eq('class_id', classId).eq('student_id', studentId)
    await refreshClasses()
  }

  const deleteClass = async (classId: string) => {
    if (!supabase) return
    await supabase.from('classes').delete().eq('id', classId)
    setSelectedClassIds((prev) => prev.filter((id) => id !== classId))
    await refreshClasses()
  }

  if (!account?.profile) return <PageMessage text="正在读取账号资料…" />
  if (!supabase) return <PageMessage text="尚未连接服务器，暂时无法使用作业功能。" />

  if (!isTeacher) {
    return <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">我的作业</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">查看老师分配给你的学习任务。</p>
      <section className="mt-8 space-y-3">
        {assignments.map((assignment) => <StudentAssignmentCard key={assignment.id} assignment={assignment} status={mySubmissions.get(assignment.id) ?? null} />)}
        {assignments.length === 0 && <p className="text-slate-500">暂时没有作业。</p>}
      </section>
    </div>
  }

  if (teacherLoading) return <PageMessage text="正在检查订阅…" />
  if (!teacherActive) {
    return <div className="min-h-[60vh] grid place-items-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">订阅已到期</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-1">作业管理已暂停，你的班级、作业和学生数据都还在。</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">续费 ¥{TEACHER_PRICE_YEAR}/年即可恢复，请联系站长。</p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">返回首页</Link>
      </div>
    </div>
  }

  return <div className="max-w-6xl mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold">作业管理</h1>
    <p className="mt-2 text-slate-500 dark:text-slate-400">从题库按整套题、单个 Module 或知识点组卷，布置给班级或指定学生。</p>

    <div className="mt-6 flex gap-1 border-b border-slate-200 dark:border-slate-700">
      {([['create', '布置作业'], ['classes', '班级管理'], ['list', '作业列表']] as [TeacherTab, string][]).map(([key, label]) =>
        <button
          key={key}
          type="button"
          onClick={() => setTab(key)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === key
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >{label}</button>)}
    </div>

    {tab === 'create' && <form onSubmit={createAssignment} className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr] items-start">
      {/* 左栏：配置 */}
      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <label className="block text-sm">
            <span className="flex items-center justify-between"><span>作业名称</span><span className="text-xs text-slate-400">{title.length}/120</span></span>
            <input required maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="请输入作业名称"
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2" />
          </label>

          <label className="block text-sm">作业说明
            <textarea rows={2} value={instructions} onChange={(e) => setInstructions(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2" />
          </label>

          <label className="block text-sm">截止时间
            <input type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2" />
          </label>
        </section>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <div>
            <p className="text-sm font-medium">选择班级</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {classes.map((c) => <button key={c.id} type="button"
                onClick={() => setSelectedClassIds((prev) => prev.includes(c.id) ? prev.filter((id) => id !== c.id) : [...prev, c.id])}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selectedClassIds.includes(c.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                }`}
              >{c.name}（{c.memberIds.length}人）</button>)}
              {classes.length === 0 && <p className="text-sm text-slate-400">还没有班级，去「班级管理」建一个。</p>}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">选择学生</p>
            <div className="mt-2 max-h-52 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
              {students.map((student) => <label key={student.id} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <input type="checkbox" checked={selectedStudentIds.includes(student.id)}
                  onChange={(e) => setSelectedStudentIds((prev) => e.target.checked ? [...prev, student.id] : prev.filter((id) => id !== student.id))} />
                <span>{student.display_name} <span className="text-slate-400">{student.email}</span></span>
              </label>)}
              {students.length === 0 && <p className="px-3 py-2 text-sm text-slate-400">暂无已注册学生。</p>}
            </div>
          </div>

          {(selectedClassIds.length > 0 || selectedStudentIds.length > 0) && <div className="flex flex-wrap gap-2">
            {selectedClassIds.map((id) => <Chip key={id} label={`班级 ${classes.find((c) => c.id === id)?.name ?? ''}`} onRemove={() => setSelectedClassIds((prev) => prev.filter((x) => x !== id))} />)}
            {selectedStudentIds.map((id) => <Chip key={id} label={studentName(id)} onRemove={() => setSelectedStudentIds((prev) => prev.filter((x) => x !== id))} />)}
          </div>}

          <p className="text-xs text-slate-500 dark:text-slate-400">将布置给 {recipientIds.length} 名学生。</p>
        </section>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">布置方式</p>
            <div className="flex flex-wrap gap-2">
              <Toggle active={mode === 'compose'} onClick={() => { setMode('compose'); setPage(1) }} label="组卷" />
              <Toggle active={mode === 'fullset'} onClick={() => { setMode('fullset'); setPage(1) }} label="整套" />
              <Toggle active={mode === 'skill'} onClick={() => { setMode('skill'); setPage(1) }} label="知识点" />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {mode === 'compose' ? '按单个 Module 选题。'
                : mode === 'fullset' ? '整套题一起布置。'
                  : '按知识点布置，跨套题汇总同一考点的题目。'}
            </p>
          </div>
          {/* Knowledge points only exist for 阅读与文法 questions, so the subject
              split is meaningless in that mode. */}
          {mode !== 'skill' && <div>
            <p className="text-sm font-medium mb-2">分项</p>
            <div className="flex flex-wrap gap-2">
              {(['all', '阅读与文法', '数学'] as SubjectFilter[]).map((s) =>
                <Toggle key={s} active={subjectFilter === s} onClick={() => { setSubjectFilter(s); setPage(1) }} label={s === 'all' ? '全部' : s} />)}
            </div>
          </div>}
        </section>
      </div>

      {/* 右栏：题库选题 */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col min-h-[520px]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => toggleRow(visibleRows.flatMap((r) => r.keys), !visibleRows.every(rowChecked))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm font-medium hover:border-blue-400">全选</button>
            <button type="button" onClick={() => setSelectedOnly((v) => !v)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium border transition-colors ${
                selectedOnly ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
              }`}>查看已选</button>
            <span className="text-sm text-slate-500 dark:text-slate-400">已选 {selectedKeys.length} 题</span>
          </div>
          <label className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} placeholder="输入搜索内容"
              className="w-56 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 pl-9 pr-3 py-1.5 text-sm" />
          </label>
        </div>

        <div className="flex-1 divide-y divide-slate-200 dark:divide-slate-700">
          {pagedRows.map((row) => <PickerRowView key={row.id} row={row} checked={rowChecked(row)} onToggle={(on) => toggleRow(row.keys, on)} />)}
          {pagedRows.length === 0 && <p className="p-6 text-sm text-slate-500">没有匹配的题目。</p>}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-700 p-4">
          <span className="text-sm text-slate-500 dark:text-slate-400">共 {visibleRows.length} 条</span>
          {pageCount > 1 && <div className="flex items-center gap-1">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => <button key={p} type="button" onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm ${p === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{p}</button>)}
          </div>}
          <button disabled={saving} className="rounded-lg bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700 disabled:opacity-60">
            {saving ? '布置中…' : '布置'}
          </button>
        </div>
      </section>
    </form>}

    {tab === 'create' && message && <p role="status" className="mt-4 text-sm text-blue-600 dark:text-blue-400">{message}</p>}

    {tab === 'classes' && <div className="mt-6 max-w-3xl space-y-4">
      <form onSubmit={createClass} className="flex gap-2">
        <input required maxLength={60} value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="新班级名称，例如 SAT 1v1"
          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2" />
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"><Plus size={16} />新建班级</button>
      </form>
      {classMessage && <p role="status" className="text-sm text-red-600 dark:text-red-400">{classMessage}</p>}

      <div className="space-y-3">
        {classes.map((c) => {
          const open = expandedClassId === c.id
          const available = students.filter((s) => !c.memberIds.includes(s.id))
          return <div key={c.id} className="rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 px-4 py-3">
              <button type="button" onClick={() => setExpandedClassId(open ? null : c.id)} className="flex-1 text-left font-medium inline-flex items-center gap-1.5">
                {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}{c.name}
                <span className="ml-1 text-sm font-normal text-slate-400">{c.memberIds.length} 人</span>
              </button>
              <button type="button" onClick={() => void deleteClass(c.id)} className="text-slate-400 hover:text-red-500" aria-label="删除班级"><Trash2 size={16} /></button>
            </div>
            {open && <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3 space-y-3">
              <div className="flex flex-wrap gap-2">
                {c.memberIds.map((id) => <Chip key={id} label={studentName(id)} onRemove={() => void removeMember(c.id, id)} />)}
                {c.memberIds.length === 0 && <p className="text-sm text-slate-400">班里还没有学生。</p>}
              </div>
              {available.length > 0 && <select defaultValue="" onChange={(e) => { void addMember(c.id, e.target.value); e.target.value = '' }}
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
                <option value="" disabled>添加学生…</option>
                {available.map((s) => <option key={s.id} value={s.id}>{s.display_name}（{s.email}）</option>)}
              </select>}
            </div>}
          </div>
        })}
        {classes.length === 0 && <p className="text-slate-500">还没有班级。</p>}
      </div>
    </div>}

    {tab === 'list' && <section className="mt-6 space-y-3">
      {assignments.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} />)}
      {assignments.length === 0 && <p className="text-slate-500">暂时没有作业。</p>}
    </section>}
  </div>
}

function PickerRowView({ row, checked, onToggle }: { row: PickerRow; checked: boolean; onToggle: (on: boolean) => void }) {
  return <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
    <input type="checkbox" checked={checked} onChange={(e) => onToggle(e.target.checked)} />
    <span className="flex-1 min-w-0">
      <span className="block truncate font-medium">{row.parent && `${row.parent} / `}{row.title}</span>
      <span className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>{row.questionCount} 题</span>
        {row.note
          ? <span className="truncate">{row.note}</span>
          : <>
            <span>正确率 {row.accuracy === null ? '—' : `${row.accuracy}%`}</span>
            <span>已作答 {row.students} 人</span>
          </>}
      </span>
    </span>
  </label>
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300">
    {label}
    <button type="button" onClick={onRemove} className="text-blue-400 hover:text-blue-700" aria-label={`移除 ${label}`}>×</button>
  </span>
}

function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return <button type="button" onClick={onClick}
    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      active ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-400'
    }`}>{label}</button>
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  return <article className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <h3 className="font-semibold text-lg">{assignment.title}</h3>
      <span className="text-xs rounded-full bg-blue-50 dark:bg-blue-950 px-2.5 py-1 text-blue-700 dark:text-blue-300">
        {assignment.status === 'published' ? '进行中' : assignment.status === 'closed' ? '已结束' : '草稿'}
      </span>
    </div>
    {assignment.instructions && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{assignment.instructions}</p>}
    <p className="mt-3 text-xs text-slate-400">{assignment.due_at ? `截止：${new Date(assignment.due_at).toLocaleString('zh-CN')}` : '未设置截止时间'}</p>
  </article>
}

function StudentAssignmentCard({ assignment, status }: { assignment: Assignment; status: string | null }) {
  const label = status === 'submitted' ? '已完成' : status === 'in_progress' ? '进行中' : '未开始'
  const tone = status === 'submitted'
    ? 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300'
    : status === 'in_progress'
      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
  return <article className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <h3 className="font-semibold text-lg">{assignment.title}</h3>
      <span className={`text-xs rounded-full px-2.5 py-1 ${tone}`}>{label}</span>
    </div>
    {assignment.instructions && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{assignment.instructions}</p>}
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-slate-400">{assignment.due_at ? `截止：${new Date(assignment.due_at).toLocaleString('zh-CN')}` : '未设置截止时间'}</p>
      <Link to={`/assignments/${assignment.id}`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
        {status === 'submitted' ? '查看结果' : status === 'in_progress' ? '继续做题' : '开始做题'}
      </Link>
    </div>
  </article>
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[50vh] grid place-items-center text-slate-500">{text}</div>
}
