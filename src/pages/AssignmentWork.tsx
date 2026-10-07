import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAccount } from '../context/account'
import { buildQuestionBank, type BankQuestion } from '../lib/questionBank'
import { formatPassageHtml } from '../lib/passage'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

type Assignment = { id: string; title: string; instructions: string; due_at: string | null }
type Phase = 'loading' | 'doing' | 'done' | 'error'

// Student side of an assignment: renders the questions the teacher picked, one per
// screen, and records each answer against a row in public.submissions.
export default function AssignmentWork() {
  const { assignmentId = '' } = useParams<{ assignmentId: string }>()
  const account = useAccount()
  const navigate = useNavigate()
  const bank = useMemo(() => buildQuestionBank(), [])

  const [phase, setPhase] = useState<Phase>('loading')
  const [message, setMessage] = useState('')
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [questions, setQuestions] = useState<BankQuestion[]>([])
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!supabase || !account?.user || !assignmentId) return
    let active = true
    const userId = account.user.id
    const client = supabase

    const load = async () => {
      const { data: assignmentRow, error: assignmentError } = await client
        .from('assignments')
        .select('id, title, instructions, due_at')
        .eq('id', assignmentId)
        .single()
      if (!active) return
      if (assignmentError || !assignmentRow) {
        setMessage('找不到这份作业，可能已被老师撤回。')
        setPhase('error')
        return
      }
      setAssignment(assignmentRow as Assignment)

      const { data: questionRows, error: questionError } = await client
        .from('assignment_questions')
        .select('question_key, position')
        .eq('assignment_id', assignmentId)
        .order('position')
      if (!active) return
      if (questionError) {
        setMessage('暂时无法读取作业题目。')
        setPhase('error')
        return
      }
      const entries = ((questionRows ?? []) as { question_key: string }[])
        .map((row) => bank.byKey.get(row.question_key))
        .filter((entry): entry is BankQuestion => Boolean(entry))
      setQuestions(entries)

      // Reuse an existing submission if the student already started, otherwise
      // open one so answers have somewhere to land.
      const { data: existing } = await client
        .from('submissions')
        .select('id, status')
        .eq('assignment_id', assignmentId)
        .eq('student_id', userId)
        .maybeSingle()
      if (!active) return

      let activeSubmissionId = existing?.id as string | undefined
      let alreadyDone = existing?.status === 'submitted'

      if (!activeSubmissionId) {
        const { data: created, error: createError } = await client
          .from('submissions')
          .insert({ assignment_id: assignmentId, student_id: userId })
          .select('id')
          .single()
        if (!active) return
        if (createError || !created) {
          setMessage('无法开始这份作业，请稍后重试。')
          setPhase('error')
          return
        }
        activeSubmissionId = created.id as string
        alreadyDone = false
      }
      setSubmissionId(activeSubmissionId)

      const { data: answerRows } = await client
        .from('submission_answers')
        .select('question_key, selected_answer')
        .eq('submission_id', activeSubmissionId)
      if (!active) return
      const restored: Record<string, number> = {}
      for (const row of (answerRows ?? []) as { question_key: string; selected_answer: number | null }[]) {
        if (row.selected_answer !== null) restored[row.question_key] = row.selected_answer
      }
      setSelected(restored)
      setPhase(alreadyDone ? 'done' : 'doing')
    }

    void load()
    return () => { active = false }
  }, [assignmentId, account?.user, bank])

  const choose = useCallback(async (entry: BankQuestion, optionIndex: number) => {
    if (!supabase || !submissionId || phase === 'done') return
    setSelected((prev) => ({ ...prev, [entry.key]: optionIndex }))
    await supabase.from('submission_answers').upsert(
      { submission_id: submissionId, question_key: entry.key, selected_answer: optionIndex },
      { onConflict: 'submission_id,question_key' },
    )
  }, [submissionId, phase])

  const submit = async () => {
    if (!supabase || !submissionId) return
    setSubmitting(true)
    const { error } = await supabase
      .from('submissions')
      .update({ status: 'submitted', submitted_at: new Date().toISOString() })
      .eq('id', submissionId)
    setSubmitting(false)
    if (error) {
      setMessage('交卷失败，请稍后重试。')
      return
    }
    setPhase('done')
    setCurrentIndex(0)
  }

  if (!supabase) return <PageMessage text="尚未连接服务器。" />
  if (phase === 'loading') return <PageMessage text="正在读取作业…" />
  if (phase === 'error') return <div className="min-h-[60vh] grid place-items-center text-center px-4">
    <div>
      <p className="text-slate-500">{message}</p>
      <Link to="/assignments" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">← 返回我的作业</Link>
    </div>
  </div>
  if (questions.length === 0) return <div className="min-h-[60vh] grid place-items-center text-center px-4">
    <div>
      <p className="text-slate-500">这份作业还没有题目。</p>
      <Link to="/assignments" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">← 返回我的作业</Link>
    </div>
  </div>

  const current = questions[currentIndex]
  const answeredCount = questions.filter((q) => selected[q.key] !== undefined).length
  const score = questions.filter((q) => selected[q.key] === q.question.answer).length
  const reviewing = phase === 'done'

  return <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-6 px-4">
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => navigate('/assignments')} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400">
          <ArrowLeft size={16} /> 返回我的作业
        </button>
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span>已答 {answeredCount} / {questions.length}</span>
          {!reviewing && <button type="button" onClick={() => void submit()} disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            <Send size={15} />{submitting ? '提交中…' : '交卷'}
          </button>}
        </div>
      </div>

      <h1 className="mt-4 text-2xl font-bold">{assignment?.title}</h1>
      {assignment?.instructions && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{assignment.instructions}</p>}
      {assignment?.due_at && <p className="mt-1 text-xs text-slate-400">截止：{new Date(assignment.due_at).toLocaleString('zh-CN')}</p>}

      {reviewing && <p className="mt-4 rounded-xl border border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30 px-4 py-3 text-sm text-green-800 dark:text-green-200">
        已完成，得分 {score} / {questions.length}（{Math.round((score / questions.length) * 100)}%）。
      </p>}
      {message && <p role="status" className="mt-4 text-sm text-red-600 dark:text-red-400">{message}</p>}

      {/* 题号导航 */}
      <div className="mt-5 flex flex-wrap gap-2">
        {questions.map((q, index) => <button key={q.key} type="button" onClick={() => setCurrentIndex(index)}
          className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
            index === currentIndex
              ? 'border-blue-500 bg-blue-600 text-white'
              : reviewing && selected[q.key] === q.question.answer
                ? 'border-green-400 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300'
                : reviewing && selected[q.key] !== undefined
                  ? 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300'
                  : selected[q.key] !== undefined
                    ? 'border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'
                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
          }`}>{index + 1}</button>)}
      </div>

      {/* 题目 */}
      <article className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="flex items-center gap-4 border-b border-dashed border-[#3c4043] px-8 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center bg-[#16181d] text-base font-bold text-white">{currentIndex + 1}</span>
          <span className="text-sm font-semibold text-[#16181d]">共 {questions.length} 题</span>
        </div>
        <div className="p-8 sm:p-10">
          <div className="sat-reading max-w-[62ch] text-[#16181d]"
            dangerouslySetInnerHTML={{ __html: formatPassageHtml(current.question.passage, current.question.underline) }} />

          {current.question.table && <div className="mt-5 overflow-x-auto">
            {current.question.table.title && <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{current.question.table.title}</p>}
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>{current.question.table.headers.map((header, i) => <th key={i} className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-left font-semibold bg-slate-100 dark:bg-slate-700">{header}</th>)}</tr>
              </thead>
              <tbody>
                {current.question.table.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c} className="border border-slate-300 dark:border-slate-600 px-3 py-2">{cell}</td>)}</tr>)}
              </tbody>
            </table>
          </div>}

          {current.question.image && <img src={current.question.image} alt="Figure" className="mt-5 max-w-full h-auto rounded-lg border border-slate-200 dark:border-slate-700" />}

          <p className="sat-reading mt-8 max-w-[62ch] font-semibold text-[#16181d]">{current.question.question}</p>

          <ul className="mt-5 max-w-[62ch] space-y-3">
            {current.question.options.map((option, index) => {
              const chosen = selected[current.key] === index
              const isAnswer = current.question.answer === index
              const tone = reviewing
                ? isAnswer
                  ? 'border-green-600 bg-green-50 font-semibold'
                  : chosen
                    ? 'border-red-500 bg-red-50'
                    : 'border-slate-300 text-slate-400'
                : chosen
                  ? 'border-[#0b57d0] bg-[#e8f0fe] font-medium'
                  : 'border-[#3c4043] hover:bg-slate-50'
              const circle = reviewing
                ? isAnswer
                  ? 'border-green-600 bg-green-600 text-white'
                  : chosen
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-slate-300 text-slate-400'
                : chosen
                  ? 'border-[#0b57d0] bg-[#0b57d0] text-white'
                  : 'border-[#3c4043] text-[#16181d]'
              return <li key={index}>
                <button type="button" disabled={reviewing} onClick={() => void choose(current, index)}
                  className={`sat-reading w-full flex items-center gap-3 rounded-lg border-[1.5px] px-4 py-3 text-left transition-colors ${tone}`}>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-[1.5px] text-sm font-bold ${circle}`}>{OPTION_LABELS[index]}</span>
                  <span>{option}</span>
                </button>
              </li>
            })}
          </ul>

          {reviewing && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            你的答案：{selected[current.key] !== undefined ? OPTION_LABELS[selected[current.key]] : '未作答'}
            {selected[current.key] !== current.question.answer && ` · 正确答案：${OPTION_LABELS[current.question.answer]}`}
          </p>}
        </div>
      </article>

      <div className="mt-5 flex items-center justify-between">
        <button type="button" disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium disabled:opacity-40">
          <ChevronLeft size={16} /> 上一题
        </button>
        <button type="button" disabled={currentIndex + 1 >= questions.length} onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium disabled:opacity-40">
          下一题 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[60vh] grid place-items-center text-slate-500">{text}</div>
}
