import { useState, useEffect } from 'react'
import questions, { type Question, type Subject, type Difficulty } from '../data/questions'
import { CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react'

type Filter = { subject: Subject | 'all'; difficulty: Difficulty | 'all' }

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── localStorage ──
const STORAGE_KEY = 'sat-practice-progress'

interface SavedState {
  filter: Filter
  queue: Question[]
  index: number
  score: { correct: number; total: number }
}

function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

function saveState(state: SavedState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

function clearState() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

export default function Practice() {
  const saved = loadState()
  const [filter, setFilter] = useState<Filter>(saved?.filter ?? { subject: 'all', difficulty: 'all' })
  const [queue, setQueue] = useState<Question[]>(saved?.queue ?? [])
  const [index, setIndex] = useState(saved?.index ?? 0)
  const [score, setScore] = useState(saved?.score ?? { correct: 0, total: 0 })
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [initialized, setInitialized] = useState(!!saved)

  useEffect(() => {
    if (initialized) return
    let filtered = questions
    if (filter.subject !== 'all') filtered = filtered.filter(q => q.subject === filter.subject)
    if (filter.difficulty !== 'all') filtered = filtered.filter(q => q.difficulty === filter.difficulty)
    const shuffled = fisherYatesShuffle(filtered)
    setQueue(shuffled)
    setInitialized(true)
  }, [filter, initialized])

  // 持久化
  useEffect(() => {
    if (!initialized) return
    saveState({ filter, queue, index, score })
  }, [filter, queue, index, score, initialized])

  const current = queue[index]

  const handleSelect = (i: number) => {
    if (showResult) return
    setSelected(i)
    setShowResult(true)
    const isCorrect = i === current.answer
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }))
  }

  const handleNext = () => {
    if (index + 1 >= queue.length) {
      setFinished(true)
    } else {
      setIndex(i => i + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  const handleRestart = () => {
    const shuffled = fisherYatesShuffle(queue)
    setQueue(shuffled)
    setIndex(0)
    setSelected(null)
    setShowResult(false)
    setScore({ correct: 0, total: 0 })
    setFinished(false)
    clearState()
  }

  const difficultyLabel = { easy: '简单', medium: '中等', hard: '困难' }
  const difficultyColor = { easy: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950', medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950', hard: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950' }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">练习题</h1>
        <p className="text-gray-500 dark:text-slate-400 mb-8">选择科目和难度，开始练习</p>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-4 mb-6 flex flex-wrap gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">科目</label>
            <select
              className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm"
              value={filter.subject}
              onChange={e => setFilter(f => ({ ...f, subject: e.target.value as Subject | 'all' }))}
            >
              <option value="all">全部科目</option>
              <option value="math">数学</option>
              <option value="reading">阅读与写作</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">难度</label>
            <select
              className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm"
              value={filter.difficulty}
              onChange={e => setFilter(f => ({ ...f, difficulty: e.target.value as Difficulty | 'all' }))}
            >
              <option value="all">全部难度</option>
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
          </div>
          <div className="flex items-end">
            <span className="text-sm text-gray-500 dark:text-slate-400">{queue.length} 道题</span>
          </div>
        </div>

        {/* Finished screen */}
        {finished && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-10 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">练习完成！</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-6">
              共 {score.total} 题，答对 <span className="text-green-600 dark:text-green-400 font-bold">{score.correct}</span> 题，
              正确率 <span className="text-blue-600 dark:text-blue-400 font-bold">{Math.round(score.correct / score.total * 100)}%</span>
            </p>
            <button onClick={handleRestart} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold">
              <RotateCcw size={18} /> 再练一次
            </button>
          </div>
        )}

        {/* Question card */}
        {!finished && current && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 md:p-8">
            {/* Progress */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-500 dark:text-slate-400">第 {index + 1} / {queue.length} 题</span>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  {current.subject === 'math' ? '数学' : '阅读与写作'}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor[current.difficulty]}`}>
                  {difficultyLabel[current.difficulty]}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
                  {current.topic}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 mb-8">
              <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${(index / queue.length) * 100}%` }} />
            </div>

            {/* Question */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6 leading-relaxed">{current.question}</h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {current.options.map((opt, i) => {
                let cls = 'w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all '
                if (!showResult) {
                  cls += selected === i ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50'
                } else if (i === current.answer) {
                  cls += 'border-green-500 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200'
                } else if (selected === i) {
                  cls += 'border-red-400 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200'
                } else {
                  cls += 'border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-600'
                }
                return (
                  <button key={i} className={cls} onClick={() => handleSelect(i)}>
                    <span className="flex items-center gap-3">
                      {showResult && i === current.answer && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                      {showResult && selected === i && i !== current.answer && <XCircle size={16} className="text-red-500 shrink-0" />}
                      {opt}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {showResult && (
              <div className={`p-4 rounded-xl mb-6 ${selected === current.answer ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'}`}>
                <p className="font-semibold mb-1 text-sm text-slate-900 dark:text-slate-100">{selected === current.answer ? '✅ 回答正确！' : '❌ 回答错误'}</p>
                <p className="text-sm text-gray-700 dark:text-slate-300">{current.explanation}</p>
              </div>
            )}

            {/* Next button */}
            {showResult && (
              <button onClick={handleNext} className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2">
                {index + 1 >= queue.length ? '查看结果' : '下一题'} <ChevronRight size={18} />
              </button>
            )}

            {/* Score */}
            <div className="mt-4 text-center text-sm text-gray-400 dark:text-slate-500">
              已答 {score.total} 题 · 答对 {score.correct} 题
            </div>
          </div>
        )}

        {!finished && queue.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-10 text-center text-gray-500 dark:text-slate-400">
            没有找到符合条件的题目，请调整筛选条件
          </div>
        )}
      </div>
    </div>
  )
}
