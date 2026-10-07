import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, XCircle, RotateCcw, Flag, Lightbulb, LayoutGrid, Bookmark, Maximize, Minimize } from 'lucide-react'
import { topicData, topicNames, levelNames, type ReadingQuestion } from '../data/readingQuestions'
import { formatPassageHtml } from '../lib/passage'
import { useFullscreen } from '../lib/fullscreen'

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
  const [chromeHidden, setChromeHidden] = useState(false)
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-slate-400 mb-4">暂无题目，敬请期待！</p>
          <Link to="/knowledge" className="text-emerald-600 dark:text-emerald-400 hover:underline">← 返回知识点</Link>
        </div>
      </div>
    )
  }

  // ── 完成页面 ──
  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-10 text-center">
            <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '💪' : '📖'}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">练习完成！</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-2">{topicName} · {levelInfo?.name}</p>

            <div className="my-6">
              <span className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{score}</span>
              <span className="text-2xl text-gray-400 dark:text-slate-500"> / {questions.length}</span>
            </div>
            <p className="text-gray-500 dark:text-slate-400 mb-8">
              正确率 <span className="font-bold text-emerald-600 dark:text-emerald-400">{pct}%</span>
              <span className="mx-2 text-gray-300 dark:text-slate-600">·</span>
              用时 <span className="font-bold text-gray-700 dark:text-slate-300 font-mono tabular-nums">{formatTime(elapsedSeconds)}</span>
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
                          ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900'
                          : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700'
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
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors font-semibold"
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
    <div className="h-screen overflow-hidden bg-white text-slate-900 flex flex-col">

      {/* ══════════ 顶部工具栏 —— 复刻 Bluebook ══════════ */}
      <header className="border-b border-dashed border-[#3c4043] bg-[#e4eaf4] px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/knowledge" className="shrink-0 text-slate-700 hover:text-black transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold leading-tight text-[#16181d]">{topicName}</p>
              {levelInfo && <p className="mt-0.5 text-xs font-medium text-slate-600">{levelInfo.name}</p>}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center">
            <button
              type="button"
              onClick={() => setTimerRunning(r => !r)}
              title={timerRunning ? '点击暂停' : '点击继续'}
              className={`text-2xl font-bold tabular-nums transition-colors ${timerRunning ? 'text-[#16181d]' : 'text-slate-400'}`}
            >
              {formatTime(elapsedSeconds)}
            </button>
            <button
              type="button"
              onClick={() => setChromeHidden(v => !v)}
              className="mt-0.5 rounded-full border border-slate-500 bg-white px-4 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {chromeHidden ? 'Show' : 'Hide'}
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-4 text-slate-700">
            <button
              type="button"
              onClick={toggleFlag}
              className={`inline-flex items-center gap-1.5 text-sm font-medium hover:text-black transition-colors ${flagged[current.id] ? 'text-amber-600' : ''}`}
            >
              <Flag size={16} className={flagged[current.id] ? 'fill-amber-400 text-amber-500' : ''} /> Mark for Review
            </button>
            <button
              type="button"
              onClick={() => setShowNav(v => !v)}
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-black transition-colors"
            >
              <LayoutGrid size={16} /> 题号
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? '退出全屏（Esc）' : '全屏做题'}
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-black transition-colors"
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />} 全屏
            </button>
          </div>
        </div>
      </header>

      {/* ── 题号导航弹窗 ── */}
      {showNav && (
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm px-4 py-3">
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
                        ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : answered
                          ? correct
                            ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900'
                            : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white dark:border-slate-800" />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-400 dark:text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 dark:bg-green-950 inline-block" /> 正确</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 dark:bg-red-950 inline-block" /> 错误</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 dark:bg-slate-800 inline-block" /> 未答</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> 标记</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ 移动端 Passage/Question 切换 Tab ══════════ */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 flex">
        <button
          onClick={() => setMobileView('passage')}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
            mobileView === 'passage'
              ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
              : 'text-gray-400 dark:text-slate-500'
          }`}
        >
          Passage
        </button>
        <button
          onClick={() => setMobileView('question')}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
            mobileView === 'question'
              ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
              : 'text-gray-400 dark:text-slate-500'
          }`}
        >
          Question
        </button>
      </div>

      {/* ══════════ 题目主体 ══════════ */}
      <main className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">

        {/* ── 左栏 / 移动端 Passage —— Bluebook 正文栏 ── */}
        <div className={`${mobileView === 'passage' ? 'block' : 'hidden'} ${chromeHidden ? 'md:hidden' : 'md:block'} border-r-[6px] border-[#d6d6d6] bg-white overflow-y-auto min-h-0 md:w-1/2`}>
          <div className="px-8 py-10 sm:px-12">
            <div
              className="sat-reading mx-auto max-w-[62ch] text-[#16181d]"
              dangerouslySetInnerHTML={{ __html: formatPassageHtml(current.passage) }}
            />
            {current.chartImage && (
              <img src={current.chartImage} alt="Chart" className="mx-auto mt-8 max-w-full" />
            )}
            {/* 移动端：读完文章后的快捷按钮 */}
            <div className="md:hidden mt-8">
              <button
                onClick={() => setMobileView('question')}
                className="w-full py-3 bg-[#0b57d0] text-white rounded-lg font-semibold hover:bg-[#0a4bb5] transition-colors flex items-center justify-center gap-2"
              >
                查看题目 <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ── 右栏 / 移动端 Question —— Bluebook 题目栏 ── */}
        <div className={`${mobileView === 'question' ? 'block' : 'hidden'} md:block ${chromeHidden ? 'md:w-full' : 'md:w-1/2'} bg-white overflow-y-auto flex flex-col min-h-0`}>
          <div className="px-8 py-8 flex-1 flex flex-col">
            {/* 题号行：黑方块题号 + Mark for Review */}
            <div className="flex items-center gap-4 border-b border-dashed border-[#3c4043] pb-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center bg-[#16181d] text-base font-bold text-white">{currentIndex + 1}</span>
              <button
                type="button"
                onClick={toggleFlag}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#16181d]"
              >
                <Bookmark size={17} className={flagged[current.id] ? 'fill-[#f2b230] text-[#f2b230]' : ''} />
                Mark for Review
              </button>
            </div>

            {/* 题目 */}
            <p className="sat-reading mt-6 font-semibold text-[#16181d]">
              {current.question}
            </p>

            {/* 选项 */}
            <div className="space-y-3 flex-1">
              {current.options.map((opt, optIdx) => {
                const label = OPTION_LABELS[optIdx]
                let base =
                  'sat-reading w-full text-left flex items-center gap-3 rounded-lg border-[1.5px] px-4 py-3 transition-colors cursor-pointer'

                if (!isRevealed) {
                  base +=
                    selected[current.id] === optIdx
                      ? 'border-[#0b57d0] bg-[#e8f0fe] font-medium'
                      : 'border-[#3c4043] hover:bg-slate-50'
                } else {
                  if (optIdx === current.answer) {
                    base += 'border-green-600 bg-green-50 font-semibold'
                  } else if (optIdx === selected[current.id] && selected[current.id] !== current.answer) {
                    base += 'border-red-500 bg-red-50'
                  } else {
                    base += 'border-slate-300 text-slate-400'
                  }
                }

                return (
                  <button key={optIdx} className={base} onClick={() => handleSelect(optIdx)}>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-[1.5px] text-sm font-bold
                        ${!isRevealed
                          ? selected[current.id] === optIdx
                            ? 'border-[#0b57d0] bg-[#0b57d0] text-white'
                            : 'border-[#3c4043] text-[#16181d]'
                          : optIdx === current.answer
                            ? 'border-green-600 bg-green-600 text-white'
                            : optIdx === selected[current.id]
                              ? 'border-red-500 bg-red-500 text-white'
                              : 'border-slate-300 text-slate-400'
                        }`}
                    >
                      {label}
                    </span>
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>

            {/* 答题反馈 + 解析 */}
            {isRevealed && (
              <div className={`mt-6 p-4 rounded-xl border ${isCorrect ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'}`}>
                <p className="flex items-center gap-2 font-semibold text-sm mb-1 text-slate-900 dark:text-slate-100">
                  {isCorrect
                    ? <><CheckCircle size={16} className="text-green-500" /> 回答正确！</>
                    : <><XCircle size={16} className="text-red-500" /> 回答错误</>
                  }
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-300 mb-3">
                  正确答案是 <span className="font-bold">{OPTION_LABELS[current.answer]}</span>
                </p>
                {/* 解析 */}
                {current.explanation && (
                  <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-slate-700/60">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1.5">
                      <Lightbulb size={14} className="text-amber-500" /> 解题思路
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
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
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between sticky bottom-0 z-30">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed
            text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          <ChevronLeft size={18} /> Back
        </button>

        <div className="text-sm text-gray-400 dark:text-slate-500 hidden sm:block">
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
