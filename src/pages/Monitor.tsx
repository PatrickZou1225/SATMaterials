import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useAccount } from '../context/account'
import { supabase } from '../lib/supabase'
import { buildQuestionBank, type BankQuestion } from '../lib/questionBank'
import { formatPassageHtml } from '../lib/passage'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

type Student = { id: string; display_name: string; email: string }
type Assignment = { id: string; title: string }
type Recipient = { assignment_id: string; student_id: string }
type Submission = { id: string; assignment_id: string; student_id: string; status: string; submitted_at: string | null }
type Attempt = {
  id: string
  student_id: string
  set_id: string
  module_num: number
  correct_count: number | null
  total_questions: number
  submitted_at: string | null
}
type QuestionRef = { question_key: string }
// One wrong answer, from either an assignment submission or a mock-test attempt.
type Wrong = { key: string; selected: number | null; correct: number; source: string }

// Teacher-side monitoring: for each of the caller's students, what assignments
// they were given, how they scored, what mock tests they ran, and which questions
// they got wrong. RLS already scopes every read to the teacher's own students.
export default function Monitor() {
  const account = useAccount()
  const isTeacher = account?.profile?.role === 'teacher'
  const bank = useMemo(() => buildQuestionBank(), [])

  const [students, setStudents] = useState<Student[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [assignmentQuestions, setAssignmentQuestions] = useState<{ assignment_id: string; question_key: string }[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [submissionAnswers, setSubmissionAnswers] = useState<(QuestionRef & { submission_id: string; selected_answer: number | null })[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [attemptAnswers, setAttemptAnswers] = useState<(QuestionRef & { attempt_id: string; selected_answer: number | null })[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!supabase || !isTeacher) return
    let active = true
    const client = supabase

    const load = async () => {
      const [studentRes, assignmentRes, recipientRes, aqRes, submissionRes, saRes, attemptRes, aaRes] = await Promise.all([
        client.from('profiles').select('id, display_name, email').eq('role', 'student').order('display_name'),
        client.from('assignments').select('id, title'),
        client.from('assignment_recipients').select('assignment_id, student_id'),
        client.from('assignment_questions').select('assignment_id, question_key'),
        client.from('submissions').select('id, assignment_id, student_id, status, submitted_at'),
        client.from('submission_answers').select('submission_id, question_key, selected_answer'),
        client.from('attempts').select('id, student_id, set_id, module_num, correct_count, total_questions, submitted_at').eq('status', 'submitted'),
        client.from('attempt_answers').select('attempt_id, question_key, selected_answer'),
      ])
      if (!active) return

      if (studentRes.error) setMessage('暂时无法读取学习记录。')
      setStudents((studentRes.data ?? []) as Student[])
      setAssignments((assignmentRes.data ?? []) as Assignment[])
      setRecipients((recipientRes.data ?? []) as Recipient[])
      setAssignmentQuestions((aqRes.data ?? []) as { assignment_id: string; question_key: string }[])
      setSubmissions((submissionRes.data ?? []) as Submission[])
      setSubmissionAnswers((saRes.data ?? []) as (QuestionRef & { submission_id: string; selected_answer: number | null })[])
      setAttempts((attemptRes.data ?? []) as Attempt[])
      setAttemptAnswers((aaRes.data ?? []) as (QuestionRef & { attempt_id: string; selected_answer: number | null })[])
      setLoading(false)
    }

    void load()
    return () => { active = false }
  }, [isTeacher])

  const titleOf = useMemo(() => new Map(assignments.map((a) => [a.id, a.title])), [assignments])
  const submissionsById = useMemo(() => new Map(submissions.map((s) => [s.id, s])), [submissions])
  const attemptsById = useMemo(() => new Map(attempts.map((a) => [a.id, a])), [attempts])

  const byStudentId = useMemo(() => {
    const group = <T extends { student_id: string }>(rows: T[]) => {
      const map = new Map<string, T[]>()
      for (const row of rows) map.set(row.student_id, [...(map.get(row.student_id) ?? []), row])
      return map
    }
    return {
      recipients: group(recipients),
      submissions: group(submissions),
      attempts: group(attempts),
    }
  }, [recipients, submissions, attempts])

  const answersBySubmission = useMemo(() => {
    const map = new Map<string, Map<string, number | null>>()
    for (const row of submissionAnswers) {
      const inner = map.get(row.submission_id) ?? new Map<string, number | null>()
      inner.set(row.question_key, row.selected_answer)
      map.set(row.submission_id, inner)
    }
    return map
  }, [submissionAnswers])

  const wrongByStudent = useMemo(() => {
    const map = new Map<string, Wrong[]>()
    const push = (studentId: string, wrong: Wrong) =>
      map.set(studentId, [...(map.get(studentId) ?? []), wrong])

    for (const row of submissionAnswers) {
      if (row.selected_answer === null) continue
      const submission = submissionsById.get(row.submission_id)
      if (!submission) continue
      const entry = bank.byKey.get(row.question_key)
      if (!entry || entry.question.answer === row.selected_answer) continue
      push(submission.student_id, { key: row.question_key, selected: row.selected_answer, correct: entry.question.answer, source: '作业' })
    }

    for (const row of attemptAnswers) {
      if (row.selected_answer === null) continue
      const attempt = attemptsById.get(row.attempt_id)
      if (!attempt) continue
      const entry = bank.byKey.get(row.question_key)
      if (!entry || entry.question.answer === row.selected_answer) continue
      push(attempt.student_id, { key: row.question_key, selected: row.selected_answer, correct: entry.question.answer, source: '模拟' })
    }

    return map
  }, [submissionAnswers, attemptAnswers, submissionsById, attemptsById, bank])

  if (!account?.profile) return <PageMessage text="正在读取账号资料…" />
  if (!supabase) return <PageMessage text="尚未连接服务器，暂时无法使用。" />
  if (!isTeacher) return <PageMessage text="仅老师可以查看学习情况。" />
  if (loading) return <PageMessage text="正在读取学习记录…" />

  return <div className="max-w-4xl mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold">学习情况</h1>
    <p className="mt-2 text-slate-500 dark:text-slate-400">每个学生的作业完成情况、真题模拟成绩与错题清单。</p>
    {message && <p role="status" className="mt-4 text-sm text-blue-600 dark:text-blue-400">{message}</p>}

    <section className="mt-6 space-y-3">
      {students.map((student) => <StudentCard
        key={student.id}
        student={student}
        bank={bank}
        assignmentIds={(byStudentId.recipients.get(student.id) ?? []).map((r) => r.assignment_id)}
        titleOf={titleOf}
        submissions={byStudentId.submissions.get(student.id) ?? []}
        answersBySubmission={answersBySubmission}
        questionKeysByAssignment={assignmentQuestions}
        attempts={byStudentId.attempts.get(student.id) ?? []}
        wrong={wrongByStudent.get(student.id) ?? []}
      />)}
      {students.length === 0 && <p className="text-slate-500">还没有已注册的学生。</p>}
    </section>
  </div>
}

function StudentCard({
  student, bank, assignmentIds, titleOf, submissions, answersBySubmission, questionKeysByAssignment, attempts, wrong,
}: {
  student: Student
  bank: ReturnType<typeof buildQuestionBank>
  assignmentIds: string[]
  titleOf: Map<string, string>
  submissions: Submission[]
  answersBySubmission: Map<string, Map<string, number | null>>
  questionKeysByAssignment: { assignment_id: string; question_key: string }[]
  attempts: Attempt[]
  wrong: Wrong[]
}) {
  const [open, setOpen] = useState(false)

  const submissionOf = (assignmentId: string) => submissions.find((s) => s.assignment_id === assignmentId)
  const submittedCount = assignmentIds.filter((id) => submissionOf(id)?.status === 'submitted').length

  const scoreOf = (assignmentId: string) => {
    const keys = questionKeysByAssignment.filter((q) => q.assignment_id === assignmentId).map((q) => q.question_key)
    const answers = submissionOf(assignmentId) && answersBySubmission.get(submissionOf(assignmentId)!.id)
    const correct = keys.filter((key) => {
      const entry = bank.byKey.get(key)
      return entry && answers?.get(key) === entry.question.answer
    }).length
    return { correct, total: keys.length }
  }

  const moduleName = (attempt: Attempt) =>
    bank.sets.find((s) => s.id === attempt.set_id)?.modules.find((m) => m.moduleNum === attempt.module_num)?.name ?? `Module ${attempt.module_num}`
  const setTitle = (attempt: Attempt) =>
    bank.sets.find((s) => s.id === attempt.set_id)?.title ?? attempt.set_id

  return <article className="rounded-xl border border-slate-200 dark:border-slate-700">
    <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-2 px-5 py-4 text-left">
      {open ? <ChevronDown size={16} className="shrink-0" /> : <ChevronRight size={16} className="shrink-0" />}
      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-lg">{student.display_name}</span>
        <span className="block text-sm text-slate-400">{student.email}</span>
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400 text-right">
        {assignmentIds.length} 份作业（{submittedCount} 已交）· {attempts.length} 次模拟 · {wrong.length} 道错题
      </span>
    </button>

    {open && <div className="border-t border-slate-200 dark:border-slate-700 px-5 py-4 space-y-6">
      <section>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">作业</h3>
        <div className="mt-2 space-y-1.5">
          {assignmentIds.map((id) => {
            const submission = submissionOf(id)
            const { correct, total } = scoreOf(id)
            const label = submission?.status === 'submitted' ? `已交 ${correct}/${total}` : submission ? '进行中' : '未开始'
            return <div key={id} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate">{titleOf.get(id) ?? id}</span>
              <span className={submission?.status === 'submitted' ? 'text-green-600 dark:text-green-400 shrink-0' : 'text-slate-400 shrink-0'}>{label}</span>
            </div>
          })}
          {assignmentIds.length === 0 && <p className="text-sm text-slate-400">没有布置过作业。</p>}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">真题模拟</h3>
        <div className="mt-2 space-y-1.5">
          {attempts.map((attempt) => <div key={attempt.id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="truncate">{setTitle(attempt)} · {moduleName(attempt)}</span>
            <span className="shrink-0 text-slate-500 dark:text-slate-400">
              {attempt.correct_count ?? 0}/{attempt.total_questions}
              {attempt.submitted_at && ` · ${new Date(attempt.submitted_at).toLocaleDateString('zh-CN')}`}
            </span>
          </div>)}
          {attempts.length === 0 && <p className="text-sm text-slate-400">还没有做过真题模拟。</p>}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">错题</h3>
        <div className="mt-2 space-y-2">
          {wrong.map((item, index) => <WrongRow key={`${item.key}-${index}`} item={item} bank={bank} />)}
          {wrong.length === 0 && <p className="text-sm text-slate-400">暂无错题。</p>}
        </div>
      </section>
    </div>}
  </article>
}

function WrongRow({ item, bank }: { item: Wrong; bank: ReturnType<typeof buildQuestionBank> }) {
  const entry: BankQuestion | undefined = bank.byKey.get(item.key)
  const [open, setOpen] = useState(false)
  const stem = entry?.question.question ?? item.key

  return <div className="rounded-lg border border-slate-200 dark:border-slate-700">
    <button type="button" onClick={() => setOpen((v) => !v)} disabled={!entry}
      className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm">
      <span className="shrink-0 rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-xs text-slate-500 dark:text-slate-400">{item.source}</span>
      <span className="flex-1 min-w-0">
        <span className="block truncate">{stem}</span>
        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
          学生选 {item.selected === null ? '未答' : OPTION_LABELS[item.selected]}
          <span className="mx-1 text-slate-300 dark:text-slate-600">·</span>
          正确答案 <span className="text-green-600 dark:text-green-400">{OPTION_LABELS[item.correct]}</span>
        </span>
      </span>
    </button>
    {open && entry && <div className="border-t border-slate-200 dark:border-slate-700 p-4">
      <div className="text-sm leading-7 font-serif text-slate-900 dark:text-slate-100"
        dangerouslySetInnerHTML={{ __html: formatPassageHtml(entry.question.passage, entry.question.underline) }} />
      {entry.question.table && <div className="mt-4 overflow-x-auto">
        {entry.question.table.title && <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{entry.question.table.title}</p>}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>{entry.question.table.headers.map((header, i) => <th key={i} className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-left font-semibold bg-slate-100 dark:bg-slate-700">{header}</th>)}</tr>
          </thead>
          <tbody>
            {entry.question.table.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c} className="border border-slate-300 dark:border-slate-600 px-3 py-2">{cell}</td>)}</tr>)}
          </tbody>
        </table>
      </div>}
      {entry.question.image && <img src={entry.question.image} alt="Figure" className="mt-4 max-w-full h-auto rounded-lg border border-slate-200 dark:border-slate-700" />}
      <p className="mt-4 font-semibold font-serif text-slate-900 dark:text-slate-100">{entry.question.question}</p>
      <ul className="mt-3 space-y-2">
        {entry.question.options.map((option, index) => <li key={index}
          className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-sm font-serif ${
            index === entry.question.answer
              ? 'border-green-400 bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-200'
              : index === item.selected
                ? 'border-red-300 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
          <span className="shrink-0 w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center mt-0.5">{OPTION_LABELS[index]}</span>
          <span className="leading-relaxed">{option}</span>
        </li>)}
      </ul>
    </div>}
  </div>
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[50vh] grid place-items-center text-slate-500">{text}</div>
}
