import { useEffect, useState } from 'react'
import { BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ListChecks, Maximize, Minimize, RotateCcw } from 'lucide-react'
import mastersBook from '../data/mastersBook.json'
import { useFullscreen } from '../lib/fullscreen'

type Question = {
  id: string
  number: number
  sourceNumber: number
  title: string
  content: string
  question: string
  options: string[]
  figures: string[]
  sourcePage: number
}

type NotePage = { page: number; content: string }
type Section = {
  id: string
  title: string
  subtitle: string
  sourcePages: number[]
  questions: Question[]
  notes?: NotePage[]
}
type SavedProgress = Record<string, number>

const LETTERS = ['A', 'B', 'C', 'D']

export default function MastersBook() {
  return <NativeBook data={mastersBook} title="大师之书" subtitle="Master's Book · 26 Spring" storageKey="masters_book_answers" />
}

export function NativeBook({ data, title, subtitle, storageKey }: { data: { sections: unknown }; title: string; subtitle: string; storageKey: string }) {
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
  const sections = data.sections as Section[]
  const [sectionIndex, setSectionIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [questionPickerOpen, setQuestionPickerOpen] = useState(true)
  const [answers, setAnswers] = useState<SavedProgress>(() => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || '{}') as SavedProgress
    } catch {
      return {}
    }
  })

  const section = sections[sectionIndex]
  const question = section.questions[questionIndex]
  const totalQuestions = sections.reduce((sum, item) => sum + item.questions.length, 0)
  const completedQuestions = Object.keys(answers).length

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(answers))
  }, [answers, storageKey])

  const chooseSection = (index: number) => {
    setSectionIndex(index)
    setQuestionIndex(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const moveQuestion = (direction: -1 | 1) => {
    const next = questionIndex + direction
    if (next >= 0 && next < section.questions.length) {
      setQuestionIndex(next)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const nextSection = sectionIndex + direction
    if (nextSection < 0 || nextSection >= sections.length) return
    setSectionIndex(nextSection)
    setQuestionIndex(direction === 1 ? 0 : Math.max(0, sections[nextSection].questions.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetProgress = () => {
    if (!window.confirm(`确定清除《${title}》的全部作答记录吗？`)) return
    setAnswers({})
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400"><BookOpen size={18} /> 私人电子讲义</div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{title}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle} · 网站原生题库版</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">已作答 <strong>{completedQuestions}</strong> / {totalQuestions}</div>
              <button type="button" onClick={toggleFullscreen} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" aria-label={isFullscreen ? '退出全屏' : '进入全屏'} title={isFullscreen ? '退出全屏（Esc）' : '进入全屏'}>
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                <span className="hidden sm:inline">{isFullscreen ? '退出全屏' : '全屏'}</span>
              </button>
              <button type="button" onClick={resetProgress} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" aria-label="清除作答记录"><RotateCcw size={18} /></button>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${totalQuestions ? (completedQuestions / totalQuestions) * 100 : 0}%` }} />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">章节目录</div>
            <nav className="space-y-1">
              {sections.map((item, index) => (
                <button key={item.id} type="button" onClick={() => chooseSection(index)} className={`w-full rounded-xl px-3 py-2.5 text-left transition ${sectionIndex === index ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}>
                  <span className="block text-sm font-semibold">{index + 1}. {item.title}</span>
                  <span className={`mt-0.5 block text-xs ${sectionIndex === index ? 'text-blue-100' : 'text-slate-400'}`}>{item.subtitle} · {item.questions.length ? `${item.questions.length} 题` : '知识点'}</span>
                </button>
              ))}
            </nav>
          </div>

        </aside>

        <main>
          {section.questions.length > 0 && (
            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className={`flex items-center justify-between ${questionPickerOpen ? 'mb-3' : ''}`}>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{section.title}题目 <span className="ml-2">{questionIndex + 1}/{section.questions.length}</span></div>
                <button type="button" onClick={() => setQuestionPickerOpen((open) => !open)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-300" aria-expanded={questionPickerOpen}>
                  {questionPickerOpen ? <><ChevronUp size={15} />收起题号</> : <><ChevronDown size={15} />展开题号</>}
                </button>
              </div>
              {questionPickerOpen && (
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-9 lg:grid-cols-12">
                  {section.questions.map((item, index) => (
                    <button key={item.id} type="button" onClick={() => setQuestionIndex(index)} className={`relative h-10 rounded-lg text-sm font-semibold transition ${index === questionIndex ? 'bg-blue-600 text-white shadow-sm' : answers[item.id] !== undefined ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`} aria-label={`第 ${index + 1} 题`}>
                      {index + 1}
                      {answers[item.id] !== undefined && index !== questionIndex && <Check size={10} className="absolute right-1 top-1" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {question ? (
            <QuestionView section={section} question={question} selected={answers[question.id]} onSelect={(option) => setAnswers((current) => ({ ...current, [question.id]: option }))} onPrevious={() => moveQuestion(-1)} onNext={() => moveQuestion(1)} canPrevious={sectionIndex > 0 || questionIndex > 0} canNext={sectionIndex < sections.length - 1 || questionIndex < section.questions.length - 1} />
          ) : <NotesView section={section} />}
        </main>
      </div>
    </div>
  )
}

function QuestionView({ section, question, selected, onSelect, onPrevious, onNext, canPrevious, canNext }: { section: Section; question: Question; selected: number | undefined; onSelect: (option: number) => void; onPrevious: () => void; onNext: () => void; canPrevious: boolean; canNext: boolean }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">{section.title} · 第 {question.number} 题</div>
            {question.title !== `第 ${question.number} 题` && <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{question.title}</h2>}
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">原讲义第 {question.sourcePage} 页</span>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-7 sm:py-8">
        {question.figures.map((figure, index) => (
          <figure key={figure} className="mb-7 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700">
            <img src={figure} alt={`${section.title}第 ${question.number} 题图表${index + 1}`} className="mx-auto max-h-[520px] w-auto max-w-full object-contain" />
          </figure>
        ))}
        {question.content && <div className="whitespace-pre-line font-serif text-[17px] leading-8 text-slate-800 dark:text-slate-100">{question.content}</div>}
        {question.question && <h3 className="mt-6 text-[17px] font-bold leading-7 text-slate-950 dark:text-white">{question.question}</h3>}

        <div className="mt-6 space-y-3">
          {question.options.map((option, index) => (
            <button key={`${question.id}-${index}`} type="button" onClick={() => onSelect(index)} className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition ${selected === index ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-950/40' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-blue-700 dark:hover:bg-slate-800'}`}>
              <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-sm font-bold ${selected === index ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-300'}`}>{LETTERS[index]}</span>
              <span className="font-serif text-[16px] leading-7 text-slate-800 dark:text-slate-100">{option}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <ListChecks className="mt-0.5 shrink-0" size={17} />
          <span>本页按原讲义内容呈现，用于阅读和自测。你的选择只保存在当前浏览器中，不会自动判分。</span>
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-7">
        <button type="button" onClick={onPrevious} disabled={!canPrevious} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800"><ChevronLeft size={18} />上一题</button>
        <button type="button" onClick={onNext} disabled={!canNext} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-30">下一题<ChevronRight size={18} /></button>
      </footer>
    </article>
  )
}

function NotesView({ section }: { section: Section }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6"><div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">第 7 章</div><h2 className="mt-1 text-2xl font-bold">{section.title}</h2><p className="mt-1 text-sm text-slate-500">{section.subtitle}</p></div>
      <div className="space-y-6">
        {(section.notes ?? []).map((note) => (
          <section key={note.page} className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
            <div className="mb-3 text-xs font-semibold text-slate-400">原讲义第 {note.page} 页</div>
            <p className="whitespace-pre-line font-serif text-[16px] leading-8 text-slate-800 dark:text-slate-100">{note.content}</p>
          </section>
        ))}
      </div>
    </article>
  )
}
