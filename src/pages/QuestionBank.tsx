import { useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useAccount } from '../context/account'
import { buildQuestionBank, type BankQuestion } from '../lib/questionBank'
import { formatPassageHtml } from '../lib/passage'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

const matches = (entry: BankQuestion, query: string) => {
  if (!query) return true
  const haystack = `${entry.question.passage} ${entry.question.question}`.toLowerCase()
  return haystack.includes(query.toLowerCase())
}

export default function QuestionBank() {
  const account = useAccount()
  const isTeacher = account?.profile?.role === 'teacher'
  const bank = useMemo(() => buildQuestionBank(), [])
  const [openSetId, setOpenSetId] = useState<string | null>(null)
  const [moduleNum, setModuleNum] = useState<number | null>(null)
  const [query, setQuery] = useState('')

  if (!account?.profile) return <PageMessage text="正在读取账号资料…" />
  if (!isTeacher) return <PageMessage text="题库仅老师可访问。" />

  const openSet = bank.sets.find((set) => set.id === openSetId)
  const openModule = openSet?.modules.find((module) => module.moduleNum === moduleNum) ?? openSet?.modules[0]

  if (!openSet) {
    return <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">题库</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">共 {bank.sets.length} 套题，{bank.byKey.size} 道题。</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {bank.sets.map((set) => <button
          key={set.id}
          onClick={() => { setOpenSetId(set.id); setModuleNum(set.modules[0]?.moduleNum ?? null); setQuery('') }}
          className="text-left rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
        >
          <h2 className="font-semibold text-lg">{set.title}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{set.modules.length} 个模块 · {set.questionCount} 题</p>
          <p className="mt-3 text-xs text-slate-400">{set.id}</p>
        </button>)}
      </div>
    </div>
  }

  const visible = openModule ? openModule.questions.filter((entry) => matches(entry, query)) : []

  return <div className="max-w-5xl mx-auto px-4 py-10">
    <button onClick={() => setOpenSetId(null)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400">
      <ChevronLeft size={16} /> 返回题库
    </button>

    <h1 className="mt-4 text-3xl font-bold">{openSet.title}</h1>
    <p className="mt-2 text-slate-500 dark:text-slate-400">{openSet.modules.length} 个模块 · {openSet.questionCount} 题</p>

    <div className="mt-6 flex flex-wrap gap-2">
      {openSet.modules.map((module) => <button
        key={module.moduleNum}
        onClick={() => { setModuleNum(module.moduleNum); setQuery('') }}
        className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
          module.moduleNum === openModule?.moduleNum
            ? 'border-blue-500 bg-blue-600 text-white'
            : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-400'
        }`}
      >
        {module.name} · {module.questions.length} 题
      </button>)}
    </div>

    <input
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder="搜索题干或文章关键词…"
      className="mt-6 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5"
    />

    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">显示 {visible.length} / {openModule?.questions.length ?? 0} 题</p>

    <div className="mt-4 space-y-6">
      {visible.map((entry) => <QuestionPreview key={entry.key} entry={entry} />)}
      {visible.length === 0 && <p className="text-slate-500">没有匹配的题目。</p>}
    </div>
  </div>
}

function QuestionPreview({ entry }: { entry: BankQuestion }) {
  const { question } = entry
  return <article className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-5 py-3">
      <span className="font-semibold">第 {question.id} 题</span>
      <code className="text-xs text-slate-500 dark:text-slate-400">{entry.key}</code>
    </div>

    <div className="p-5">
      <div
        className="text-base leading-8 font-serif text-slate-900 dark:text-slate-100"
        dangerouslySetInnerHTML={{ __html: formatPassageHtml(question.passage) }}
      />

      {question.table && <div className="mt-5 overflow-x-auto">
        {question.table.title && <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{question.table.title}</p>}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>{question.table.headers.map((header, i) => <th key={i} className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-left font-semibold bg-slate-100 dark:bg-slate-700">{header}</th>)}</tr>
          </thead>
          <tbody>
            {question.table.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c} className="border border-slate-300 dark:border-slate-600 px-3 py-2">{cell}</td>)}</tr>)}
          </tbody>
        </table>
      </div>}

      {question.image && <img src={question.image} alt="Figure" className="mt-5 max-w-full h-auto rounded-lg border border-slate-200 dark:border-slate-700" />}

      <p className="mt-5 font-semibold font-serif text-slate-900 dark:text-slate-100">{question.question}</p>

      <ul className="mt-4 space-y-2">
        {question.options.map((option, index) => <li
          key={index}
          className={`flex items-start gap-3 rounded-lg border px-4 py-2.5 font-serif ${
            index === question.answer
              ? 'border-green-400 bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-200'
              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <span className="shrink-0 w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center mt-0.5">{OPTION_LABELS[index]}</span>
          <span className="leading-relaxed">{option}</span>
        </li>)}
      </ul>
    </div>
  </article>
}

function PageMessage({ text }: { text: string }) {
  return <div className="min-h-[50vh] grid place-items-center text-slate-500">{text}</div>
}
