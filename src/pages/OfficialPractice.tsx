import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronRight, Lock, Maximize, Minimize, RotateCcw } from 'lucide-react'
import {
  allOfficialTypes,
  officialKey,
  OFFICIAL_DIFFICULTIES,
  type OfficialDifficulty,
  type OfficialQuestion,
} from '../data/officialSamples'
import { officialSections, officialTypeLabel, officialTypes, sampleKeys } from '../lib/questionBank'
import { formatPassageHtml } from '../lib/passage'
import { OFFICIAL_HARD_PRICE, OFFICIAL_HARD_PRODUCT, useAccess } from '../lib/access'
import { useFullscreen } from '../lib/fullscreen'
import UnlockDialog from '../components/UnlockDialog'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

// Look a question up by its assignment key to reach the written rationale, which
// is not part of the shared MockTestQuestion shape the bank stores.
const officialByKey = new Map<string, OfficialQuestion>()
for (const type of allOfficialTypes) {
  for (const difficulty of OFFICIAL_DIFFICULTIES) {
    for (const question of type.difficulties[difficulty]) {
      officialByKey.set(officialKey(type.slug, difficulty, question.qid), question)
    }
  }
}

type Phase = 'setup' | 'doing' | 'done'

// Free self-serve practice over the College Board official samples: pick a question
// type, difficulty and count, then work one question at a time with immediate
// feedback and the rationale.
export default function OfficialPractice() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [slug, setSlug] = useState(officialTypes[0]?.slug ?? '')
  const [difficulty, setDifficulty] = useState<OfficialDifficulty | null>(null)
  const [count, setCount] = useState(10)
  const [keys, setKeys] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [picked, setPicked] = useState<Record<string, number>>({})
  const [showPay, setShowPay] = useState(false)

  const { canAccessProduct } = useAccess()
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
  const canHard = canAccessProduct(OFFICIAL_HARD_PRODUCT)
  // Hard is a paid pool; everything else is free to everyone.
  const openDiffs = OFFICIAL_DIFFICULTIES.filter((d) => d !== 'Hard' || canHard)

  const poolSize = useMemo(() => {
    const info = officialTypes.find((t) => t.slug === slug)
    if (!info) return 0
    return openDiffs
      .filter((d) => !difficulty || d === difficulty)
      .reduce((n, d) => n + info.counts[d], 0)
  }, [slug, difficulty, openDiffs])

  const start = () => {
    const pool: string[] = []
    const type = allOfficialTypes.find((t) => t.slug === slug)
    if (!type) return
    for (const d of openDiffs) {
      if (difficulty && d !== difficulty) continue
      for (const q of type.difficulties[d]) pool.push(officialKey(slug, d, q.qid))
    }
    const size = Math.max(1, Math.min(count, pool.length))
    setKeys(sampleKeys(pool, size))
    setPicked({})
    setCurrent(0)
    setPhase('doing')
  }

  const reset = () => {
    setPhase('setup')
    setKeys([])
    setPicked({})
    setCurrent(0)
  }

  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0b57d0]">
            <ArrowLeft size={16} /> 返回首页
          </Link>
          <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <BookOpen size={22} />
            <h1 className="text-2xl font-bold">官方样题练习</h1>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            从 College Board 官方样题中挑一个题型，随时随地自主练习，做完立即看解析。
          </p>

          <div className="mt-6 space-y-8 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
            <section>
              <SectionLabel>题型</SectionLabel>
              <div className="space-y-6">
                {officialSections.map((section) => (
                  <div key={section.key}>
                    <p className="mb-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200">{section.label}</p>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {section.types.map((type) => {
                        const active = slug === type.slug
                        return (
                          <button key={type.slug} type="button" onClick={() => setSlug(type.slug)}
                            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-all ${
                              active
                                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/20'
                            }`}>
                            <span className="truncate">{type.label}</span>
                            <span className={`shrink-0 text-xs tabular-nums ${active ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>{type.total}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>难度</SectionLabel>
              <div className="flex flex-wrap gap-2.5">
                <button type="button" onClick={() => setDifficulty(null)}
                  className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                    difficulty === null
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/20'
                  }`}>All</button>
                {OFFICIAL_DIFFICULTIES.map((d) => {
                  const locked = d === 'Hard' && !canHard
                  return (
                    <button key={d} type="button" onClick={() => (locked ? setShowPay(true) : setDifficulty(d))}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                        difficulty === d
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                          : locked
                            ? 'border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/20'
                      }`}>
                      {locked && <Lock size={13} />}{d}
                    </button>
                  )
                })}
              </div>
              {!canHard && <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
                Hard 题需 ¥{OFFICIAL_HARD_PRICE} 解锁，<button type="button" onClick={() => setShowPay(true)} className="underline hover:no-underline">立即解锁</button>。Easy、Medium 题免费。
              </p>}
            </section>

            <section>
              <SectionLabel>数量</SectionLabel>
              <div className="flex items-center gap-4">
                <input type="number" min={1} max={poolSize || 1} value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-center tabular-nums focus:border-blue-500 focus:outline-none" />
                <span className="text-sm text-slate-500 dark:text-slate-400">当前范围共 <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">{poolSize}</span> 题</span>
              </div>
            </section>

            <button type="button" onClick={start} disabled={poolSize === 0}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 sm:w-auto">
              开始练习 <ChevronRight size={18} />
            </button>
          </div>
        </div>
        {showPay && <UnlockDialog
          title="解锁官方 Hard 题"
          price={`¥${OFFICIAL_HARD_PRICE}`}
          note="开通后可永久练习全部官方 Hard 题。老师布置的作业不受此限制。"
          onClose={() => setShowPay(false)} />}
      </div>
    )
  }

  const questions = keys
    .map((key) => ({ key, question: officialByKey.get(key) }))
    .filter((entry): entry is { key: string; question: OfficialQuestion } => Boolean(entry.question))
  const total = questions.length
  const currentEntry = questions[Math.min(current, total - 1)]
  const correctCount = questions.filter((q) => picked[q.key] === q.question.answer).length
  const answered = questions.filter((q) => picked[q.key] !== undefined).length

  if (phase === 'done') {
    const score = Math.round((correctCount / total) * 100)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-bold">练习完成</h1>
          <p className="mt-4 text-lg">
            得分 <span className="font-bold text-blue-600 dark:text-blue-400">{correctCount}</span> / {total}
            <span className="ml-2 text-slate-500 dark:text-slate-400">（{score}%）</span>
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            题型：{officialTypeLabel(slug)}{difficulty ? ` · ${difficulty}` : ''}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button type="button" onClick={start}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700">
              <RotateCcw size={16} /> 再来一组
            </button>
            <button type="button" onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-5 py-2.5 font-medium text-slate-700 dark:text-slate-200">
              换个题型
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentEntry) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-500">
        <div className="text-center">
          <p>这个范围暂无题目。</p>
          <button type="button" onClick={reset} className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">← 重新选择</button>
        </div>
      </div>
    )
  }

  const { key, question } = currentEntry
  const chosen = picked[key]
  const revealed = chosen !== undefined
  const isLast = current + 1 >= total

  const choose = (optionIndex: number) => {
    if (revealed) return
    setPicked((prev) => ({ ...prev, [key]: optionIndex }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
          <button type="button" onClick={reset} className="hover:text-blue-600 dark:hover:text-blue-400">← 退出练习</button>
          <div className="flex items-center gap-3">
            <span>已答 {answered} / {total} · 正确 {correctCount}</span>
            <button type="button" onClick={toggleFullscreen}
              title={isFullscreen ? '退出全屏（Esc）' : '全屏做题'}
              className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400">
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />} 全屏
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {questions.map((q, index) => {
            const answeredThis = picked[q.key] !== undefined
            const right = picked[q.key] === q.question.answer
            const tone = index === current
              ? 'border-blue-500 bg-blue-600 text-white'
              : answeredThis
                ? right
                  ? 'border-green-400 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300'
                  : 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300'
                : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
            return (
              <button key={q.key} type="button" onClick={() => setCurrent(index)}
                className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${tone}`}>{index + 1}</button>
            )
          })}
        </div>

        <article className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center gap-4 border-b border-dashed border-[#3c4043] px-8 py-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center bg-[#16181d] text-base font-bold text-white">{current + 1}</span>
            <span className="sat-reading font-semibold text-[#16181d]">{officialTypeLabel(slug)}</span>
            <span className="ml-auto text-xs font-medium text-slate-500">共 {total} 题</span>
          </div>
          <div className="p-8 sm:p-10">
            <div className="sat-reading max-w-[62ch] text-[#16181d]"
              dangerouslySetInnerHTML={{ __html: formatPassageHtml(question.passage, question.underline) }} />

            {question.image && <img src={question.image} alt="Figure" className="mt-6 max-w-full h-auto" />}

            <p className="sat-reading mt-8 max-w-[62ch] font-semibold text-[#16181d]">{question.question}</p>

            <ul className="mt-5 max-w-[62ch] space-y-3">
              {question.options.map((option, index) => {
                const isAnswer = question.answer === index
                const tone = revealed
                  ? isAnswer
                    ? 'border-green-600 bg-green-50 font-semibold'
                    : chosen === index
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-300 text-slate-400'
                  : chosen === index
                    ? 'border-[#0b57d0] bg-[#e8f0fe] font-medium'
                    : 'border-[#3c4043] hover:bg-slate-50'
                const circle = revealed
                  ? isAnswer
                    ? 'border-green-600 bg-green-600 text-white'
                    : chosen === index
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-slate-300 text-slate-400'
                  : chosen === index
                    ? 'border-[#0b57d0] bg-[#0b57d0] text-white'
                    : 'border-[#3c4043] text-[#16181d]'
                return (
                  <li key={index}>
                    <button type="button" disabled={revealed} onClick={() => choose(index)}
                      className={`sat-reading w-full flex items-center gap-3 rounded-lg border-[1.5px] px-4 py-3 text-left transition-colors disabled:cursor-default ${tone}`}>
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-[1.5px] text-sm font-bold ${circle}`}>{OPTION_LABELS[index]}</span>
                      <span>{option}</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {revealed && (
              <div className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                chosen === question.answer
                  ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30'
                  : 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30'
              }`}>
                <p className={`font-semibold ${chosen === question.answer ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                  {chosen === question.answer ? '回答正确' : `回答错误 · 正确答案：${OPTION_LABELS[question.answer]}`}
                </p>
                {question.rationale && (
                  <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">{question.rationale}</p>
                )}
              </div>
            )}
          </div>
        </article>

        <div className="mt-5 flex items-center justify-between">
          <button type="button" disabled={current === 0} onClick={() => setCurrent((i) => Math.max(0, i - 1))}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium disabled:opacity-40">上一题</button>
          <button type="button" disabled={!revealed}
            onClick={() => { if (isLast) setPhase('done'); else setCurrent((i) => i + 1) }}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40">
            {isLast ? '查看结果' : '下一题'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Small uppercase label over a hairline, separating the setup card's sections.
function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="mb-3 flex items-center gap-3">
    <span className="text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500">{children}</span>
    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
  </div>
}
