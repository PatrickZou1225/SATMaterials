import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, XCircle, RotateCcw, Flag, Lightbulb, Clock } from 'lucide-react'
import { topicData, topicNames, levelNames, type ReadingQuestion } from '../data/readingQuestions'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

// ── localStorage 工具 ──
function getStorageKey(topic: string, level: string) {
  return `sat-reading-${topic}-${level}`
}

interface SavedProgress {
  selected: Record<number, number>
  revealed: Record<number, boolean>
  flagged: Record<number, boolean>
  currentIndex: number
  elapsedSeconds?: number
}

function formatTime(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

function loadProgress(topic: string, level: string): SavedProgress | null {
  try {
    const raw = localStorage.getItem(getStorageKey(topic, level))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveProgress(topic: string, level: string, data: SavedProgress) {
  try {
    localStorage.setItem(getStorageKey(topic, level), JSON.stringify(data))
  } catch {
    // storage full — silent fail
  }
}

function clearProgress(topic: string, level: string) {
  try {
    localStorage.removeItem(getStorageKey(topic, level))
  } catch {
    // ignore
  }
}

// ============================================================
//  页面主体 — 一页一题 SAT 机考模式（移动端适配 + 解析 + 进度保存）
// ============================================================
export default function ReadingDetail() {
  const { topic = 'zhuzhi', level = 'level1' } = useParams<{ topic: string; level: string }>()
  const questions: ReadingQuestion[] = topicData[topic]?.[level] ?? []
  const levelInfo = levelNames[level]
  const topicName = topicNames[topic] ?? topic

  // 从 localStorage 恢复进度
  const saved = loadProgress(topic, level)

  const [currentIndex, setCurrentIndex] = useState(saved?.currentIndex ?? 0)
  const [selected, setSelected] = useState<Record<number, number>>(saved?.selected ?? {})
  const [revealed, setRevealed] = useState<Record<number, boolean>>(saved?.revealed ?? {})
  const [flagged, setFlagged] = useState<Record<number, boolean>>(saved?.flagged ?? {})
  const [finished, setFinished] = useState(false)
  const [showNav, setShowNav] = useState(false)
  // 移动端切换 passage / question 视图
  const [mobileView, setMobileView] = useState<'passage' | 'question'>('passage')
  // 正向计时（秒）
  const [elapsedSeconds, setElapsedSeconds] = useState(saved?.elapsedSeconds ?? 0)
  const [timerRunning, setTimerRunning] = useState(true)

  // 自动保存进度（1秒防抖，避免计时器每秒触发写入）
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveProgress(topic, level, { selected, revealed, flagged, currentIndex, elapsedSeconds })
    }, 1000)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [topic, level, selected, revealed, flagged, currentIndex, elapsedSeconds])

  // 计时器：finished 或暂停时停走
  useEffect(() => {
    if (finished || !timerRunning) return
    const id = window.setInterval(() => {
      setElapsedSeconds(s => s + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [finished, timerRunning])

  const current = questions[currentIndex]
  const totalAnswered = Object.keys(revealed).length
  const score = questions.filter(q => revealed[q.id] && selected[q.id] === q.answer).length

  const handleSelect = (optIdx: number) => {
    if (!current || revealed[current.id]) return
    setSelected(prev => ({ ...prev, [current.id]: optIdx }))
  }

  const handleReveal = () => {
    if (!current || selected[current.id] === undefined) return
    setRevealed(prev => ({ ...prev, [current.id]: true }))
  }

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrentIndex(i => i + 1)
      setMobileView('passage')
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
      setMobileView('passage')
    }
  }

  const handleJump = (idx: number) => {
    setCurrentIndex(idx)
    setFinished(false)
    setShowNav(false)
    setMobileView('passage')
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelected({})
    setRevealed({})
    setFlagged({})
    setFinished(false)
    setMobileView('passage')
    setElapsedSeconds(0)
    setTimerRunning(true)
    clearProgress(topic, level)
  }

  const toggleFlag = () => {
    if (!current) return
    setFlagged(prev => ({ ...prev, [current.id]: !prev[current.id] }))
  }

  // 空题库
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">暂无题目，敬请期待！</p>
          <Link to="/knowledge" className="text-emerald-600 hover:underline">← 返回知识点</Link>
        </div>
      </div>
    )
  }

  // ── 完成页面 ──
  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border shadow-sm p-6 sm:p-10 text-center">
            <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '💪' : '📖'}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">练习完成！</h2>
            <p className="text-gray-500 mb-2">{topicName} · {levelInfo?.name}</p>

            <div className="my-6">
              <span className="text-5xl font-bold text-emerald-600">{score}</span>
              <span className="text-2xl text-gray-400"> / {questions.length}</span>
            </div>
            <p className="text-gray-500 mb-8">
              正确率 <span className="font-bold text-emerald-600">{pct}%</span>
              <span className="mx-2 text-gray-300">·</span>
              用时 <span className="font-bold text-gray-700 font-mono tabular-nums">{formatTime(elapsedSeconds)}</span>
            </p>

            {/* 每题回顾 */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {questions.map((q, idx) => {
                const answered = revealed[q.id]
                const correct = answered && selected[q.id] === q.answer
                return (
                  <button
                    key={q.id}
                    onClick={() => handleJump(idx)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-colors
                      ${answered
                        ? correct
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleRestart}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
              >
                <RotateCcw size={18} /> 重新练习
              </button>
              <Link
                to="/knowledge"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
              >
                返回知识点
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── 做题界面（一页一题）──
  const isRevealed = !!revealed[current.id]
  const isCorrect = isRevealed && selected[current.id] === current.answer
  const hasSelected = selected[current.id] !== undefined

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* ══════════ 顶部工具栏 ══════════ */}
      <header className="bg-white border-b px-4 py-2.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/knowledge" className="text-gray-400 hover:text-emerald-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="hidden sm:block">
            <span className="text-sm font-bold text-gray-800">{topicName}</span>
            {levelInfo && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${levelInfo.bg} ${levelInfo.color}`}>
                {levelInfo.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <button
            onClick={() => setTimerRunning(r => !r)}
            title={timerRunning ? '点击暂停' : '点击继续'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold tabular-nums transition-colors ${
              timerRunning
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <Clock size={14} className={timerRunning ? '' : 'opacity-60'} />
            {formatTime(elapsedSeconds)}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFlag}
            className={`p-2 rounded-lg transition-colors ${flagged[current.id] ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:bg-gray-100'}`}
            title="标记此题"
          >
            <Flag size={18} />
          </button>
          <button
            onClick={() => setShowNav(v => !v)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-600 transition-colors"
          >
            题号导航
          </button>
        </div>
      </header>

      {/* ── 进度条 ── */}
      <div className="w-full bg-gray-200 h-1">
        <div
          className="bg-emerald-500 h-1 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* ── 题号导航弹窗 ── */}
      {showNav && (
        <div className="bg-white border-b shadow-sm px-4 py-3">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const answered = revealed[q.id]
                const correct = answered && selected[q.id] === q.answer
                const isCurrent = idx === currentIndex
                const isFlagged = flagged[q.id]
                return (
                  <button
                    key={q.id}
                    onClick={() => handleJump(idx)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-colors relative
                      ${isCurrent
                        ? 'ring-2 ring-emerald-500 bg-emerald-50 text-emerald-700'
                        : answered
                          ? correct
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white" />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 inline-block" /> 正确</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 inline-block" /> 错误</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 inline-block" /> 未答</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> 标记</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ 移动端 Passage/Question 切换 Tab ══════════ */}
      <div className="md:hidden bg-white border-b flex">
        <button
          onClick={() => setMobileView('passage')}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
            mobileView === 'passage'
              ? 'text-emerald-600 border-b-2 border-emerald-500'
              : 'text-gray-400'
          }`}
        >
          Passage
        </button>
        <button
          onClick={() => setMobileView('question')}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
            mobileView === 'question'
              ? 'text-emerald-600 border-b-2 border-emerald-500'
              : 'text-gray-400'
          }`}
        >
          Question
        </button>
      </div>

      {/* ══════════ 题目主体 ══════════ */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* ── 左栏 / 移动端 Passage ── */}
        <div className={`md:w-1/2 border-r bg-white overflow-y-auto ${
          mobileView === 'passage' ? 'block' : 'hidden md:block'
        }`}>
          <div className="p-5 sm:p-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Passage</p>
            <div className="text-sm text-gray-800 leading-7 whitespace-pre-line">
              {current.passage}
            </div>
            {/* 移动端：读完文章后的快捷按钮 */}
            <div className="md:hidden mt-6">
              <button
                onClick={() => setMobileView('question')}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                查看题目 <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ── 右栏 / 移动端 Question ── */}
        <div className={`md:w-1/2 bg-white overflow-y-auto flex flex-col ${
          mobileView === 'question' ? 'block' : 'hidden md:block'
        }`}>
          <div className="p-5 sm:p-8 flex-1 flex flex-col">
            {/* 题目 */}
            <p className="text-[15px] font-semibold text-gray-900 leading-relaxed mb-6">
              {current.question}
            </p>

            {/* 选项 */}
            <div className="space-y-3 flex-1">
              {current.options.map((opt, optIdx) => {
                const label = OPTION_LABELS[optIdx]
                let base =
                  'w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 text-sm transition-all cursor-pointer '

                if (!isRevealed) {
                  base +=
                    selected[current.id] === optIdx
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-gray-700'
                } else {
                  if (optIdx === current.answer) {
                    base += 'border-green-500 bg-green-50 text-green-900 font-semibold'
                  } else if (optIdx === selected[current.id] && selected[current.id] !== current.answer) {
                    base += 'border-red-400 bg-red-50 text-red-700'
                  } else {
                    base += 'border-gray-100 text-gray-400'
                  }
                }

                return (
                  <button key={optIdx} className={base} onClick={() => handleSelect(optIdx)}>
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full border-2 text-xs font-bold flex items-center justify-center mt-0.5
                        ${!isRevealed
                          ? selected[current.id] === optIdx
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-gray-300 text-gray-500'
                          : optIdx === current.answer
                            ? 'border-green-500 bg-green-500 text-white'
                            : optIdx === selected[current.id]
                              ? 'border-red-400 bg-red-400 text-white'
                              : 'border-gray-200 text-gray-400'
                        }`}
                    >
                      {label}
                    </span>
                    <span className="leading-relaxed pt-0.5">{opt}</span>
                  </button>
                )
              })}
            </div>

            {/* 答题反馈 + 解析 */}
            {isRevealed && (
              <div className={`mt-6 p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="flex items-center gap-2 font-semibold text-sm mb-1">
                  {isCorrect
                    ? <><CheckCircle size={16} className="text-green-500" /> 回答正确！</>
                    : <><XCircle size={16} className="text-red-500" /> 回答错误</>
                  }
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  正确答案是 <span className="font-bold">{OPTION_LABELS[current.answer]}</span>
                </p>
                {/* 解析 */}
                {current.explanation && (
                  <div className="mt-3 pt-3 border-t border-gray-200/60">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                      <Lightbulb size={14} className="text-amber-500" /> 解题思路
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {current.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ══════════ 底部操作栏 ══════════ */}
      <footer className="bg-white border-t px-4 py-3 flex items-center justify-between sticky bottom-0 z-30">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed
            text-gray-600 hover:bg-gray-100"
        >
          <ChevronLeft size={18} /> Back
        </button>

        <div className="text-sm text-gray-400 hidden sm:block">
          已答 {totalAnswered} / {questions.length} 题
          {totalAnswered > 0 && <span className="ml-2 text-emerald-600 font-semibold">{score} 正确</span>}
        </div>

        {!isRevealed ? (
          <button
            onClick={handleReveal}
            disabled={!hasSelected}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed
              bg-emerald-600 text-white hover:bg-emerald-700"
          >
            确认答案
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors
              bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {currentIndex + 1 >= questions.length ? '查看结果' : 'Next'} <ChevronRight size={18} />
          </button>
        )}
      </footer>
    </div>
  )
}
