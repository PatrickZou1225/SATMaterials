import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Flag, Clock, AlertTriangle, Send } from 'lucide-react'
import { getTestSet, type MockTestQuestion } from '../data/mockTestQuestions'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

function formatTime(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const sec = s % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(m)}:${pad(sec)}`
}

// ============================================================
//  模拟测试页面 — 计时真题模拟（无逐题反馈，交卷后统一出分）
//  URL: /mock-test/:testId/:moduleIndex
// ============================================================
export default function MockTest() {
  const { testId, moduleIndex } = useParams<{ testId: string; moduleIndex: string }>()
  const navigate = useNavigate()
  const modIdx = parseInt(moduleIndex ?? '0', 10)

  const testSet = getTestSet(testId ?? '')
  const moduleData = testSet?.modules?.[modIdx]

  useEffect(() => {
    if (!testSet || !moduleData) {
      navigate('/mock-test', { replace: true })
    }
  }, [testSet, moduleData, navigate])

  if (!testSet || !moduleData) return null
  const questions: MockTestQuestion[] = moduleData.questions

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-slate-400 mb-4">该模块题目尚未上线，敬请期待！</p>
          <Link to="/mock-test" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">← 返回套题列表</Link>
        </div>
      </div>
    )
  }

  const totalTime = moduleData.timeMinutes * 60

  // phase: start | testing | finished | timeup
  const [phase, setPhase] = useState<'start' | 'testing' | 'finished' | 'timeup'>('start')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<Record<number, boolean>>({})
  const [showNav, setShowNav] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)
  const [mobileView, setMobileView] = useState<'passage' | 'question'>('passage')
  const [remainingSeconds, setRemainingSeconds] = useState(totalTime)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // 计时
  useEffect(() => {
    if (!timerRunning || phase !== 'testing') {
      clearTimer()
      return
    }
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearTimer()
          setPhase('timeup')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return clearTimer
  }, [timerRunning, phase, clearTimer])

  const handleStart = () => {
    setPhase('testing')
    setTimerRunning(true)
    setRemainingSeconds(totalTime)
  }

  // 交卷
  const handleSubmit = () => {
    clearTimer()
    setTimerRunning(false)
    setShowSubmit(false)
    setPhase('finished')
  }

  const current = questions[currentIndex]
  const answeredCount = Object.keys(selected).length

  const handleSelect = (optIdx: number) => {
    if (!current) return
    setSelected(prev => ({ ...prev, [current.id]: optIdx }))
  }

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setShowSubmit(true)
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
    setShowNav(false)
    setMobileView('passage')
  }

  const handleRestart = () => {
    setPhase('start')
    setCurrentIndex(0)
    setSelected({})
    setFlagged({})
    setShowNav(false)
    setMobileView('passage')
    setRemainingSeconds(totalTime)
    setTimerRunning(false)
  }

  const toggleFlag = () => {
    if (!current) return
    setFlagged(prev => ({ ...prev, [current.id]: !prev[current.id] }))
  }

  const accentColor = moduleData.subject === '阅读与文法' ? 'purple' : 'blue'

  // ============================================================
  //  开始页面
  // ============================================================
  if (phase === 'start') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-10">
            <div className="text-center mb-8">
              <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4 ${
                moduleData.subject === '阅读与文法'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
              }`}>
                {moduleData.subject}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100 mb-2">
                {testSet.title}
              </h1>
              <p className="text-gray-500 dark:text-slate-400 text-lg">{moduleData.name}</p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-4 text-lg">考试信息</h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-slate-400">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                  <span>科目</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200">{moduleData.subject}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                  <span>模块</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200">{moduleData.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                  <span>题目数量</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200">{questions.length} 题</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>时间限制</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200">{moduleData.timeMinutes} 分钟</span>
                </div>
              </div>
            </div>

            <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <span>
                  考试开始后计时器将启动<strong>倒数</strong>，时间到后会自动交卷。
                  可在题目间自由切换，<strong>交卷前可随时修改答案</strong>。
                  做完后点击"交卷"查看成绩。
                </span>
              </p>
            </div>

            <button
              onClick={handleStart}
              className={`w-full py-4 text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2 ${
                moduleData.subject === '阅读与文法'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Clock size={22} /> 开始考试
            </button>

            <Link to="/mock-test" className="block text-center mt-4 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 text-sm transition-colors">
              返回套题列表
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  //  完成/超时页面 — 统一显示对错
  // ============================================================
  if (phase === 'finished' || phase === 'timeup') {
    const score = questions.filter(q => selected[q.id] === q.answer).length
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
    const usedTime = totalTime - remainingSeconds

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-10 text-center">
            {phase === 'timeup' && (
              <div className="flex items-center justify-center gap-2 mb-4 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 rounded-xl py-2 px-4 text-sm font-semibold">
                <AlertTriangle size={18} /> 时间到，考试已自动交卷
              </div>
            )}
            <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '💪' : '📖'}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">模拟测试完成！</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-2">{testSet.title} · {moduleData.subject} · {moduleData.name}</p>

            <div className="my-6">
              <span className="text-5xl font-bold text-purple-600 dark:text-purple-400">{score}</span>
              <span className="text-2xl text-gray-400 dark:text-slate-500"> / {questions.length}</span>
            </div>
            <p className="text-gray-500 dark:text-slate-400 mb-2">
              已答 <span className="font-bold text-gray-700 dark:text-slate-300">{answeredCount}</span> / {questions.length} 题
            </p>
            <p className="text-gray-500 dark:text-slate-400 mb-8">
              正确率 <span className="font-bold text-purple-600 dark:text-purple-400">{pct}%</span>
              <span className="mx-2 text-gray-300 dark:text-slate-600">·</span>
              用时 <span className="font-bold text-gray-700 dark:text-slate-300 font-mono tabular-nums">{formatTime(usedTime)}</span>
              <span className="mx-2 text-gray-300 dark:text-slate-600">·</span>
              剩余 <span className="font-bold text-gray-700 dark:text-slate-300 font-mono tabular-nums">{formatTime(remainingSeconds)}</span>
            </p>

            {/* 每题回顾 */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {questions.map((q, idx) => {
                const hasAnswer = selected[q.id] !== undefined
                const correct = hasAnswer && selected[q.id] === q.answer
                return (
                  <div
                    key={q.id}
                    className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center
                      ${hasAnswer
                        ? correct
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                          : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300'
                        : 'bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500'
                      }`}
                  >
                    {idx + 1}
                  </div>
                )
              })}
            </div>
            <div className="flex gap-4 justify-center mb-8 text-xs text-gray-400 dark:text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/40 inline-block" /> 正确</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/40 inline-block" /> 错误</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 dark:bg-slate-800 inline-block" /> 未答</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleRestart}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
              >
                <RotateCcw size={18} /> 重做本模块
              </button>
              <Link
                to="/mock-test"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors font-semibold"
              >
                返回套题列表
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  //  做题界面（无逐题反馈）
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex flex-col">

      {/* 顶部工具栏 */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/mock-test" className="text-gray-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="hidden sm:block">
            <span className="text-sm font-bold text-gray-800 dark:text-slate-200">{testSet.title}</span>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              {moduleData.subject} · {moduleData.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
            {currentIndex + 1} / {questions.length}
          </span>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold tabular-nums transition-colors ${
            remainingSeconds <= 300
              ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300 animate-pulse'
              : remainingSeconds <= 600
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                : accentColor === 'purple'
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
          }`}>
            <Clock size={14} />
            {formatTime(remainingSeconds)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFlag}
            className={`p-2 rounded-lg transition-colors ${flagged[current.id] ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
            title="标记此题"
          >
            <Flag size={18} />
          </button>
          <button
            onClick={() => setShowNav(v => !v)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold text-gray-600 dark:text-slate-400 transition-colors"
          >
            题号导航
          </button>
        </div>
      </header>

      {/* 进度条 */}
      <div className="w-full bg-gray-200 dark:bg-slate-700 h-1">
        <div
          className={`h-1 transition-all duration-300 ${accentColor === 'purple' ? 'bg-purple-500' : 'bg-blue-500'}`}
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* 题号导航弹窗 */}
      {showNav && (
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm px-4 py-3">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const isAnswered = selected[q.id] !== undefined
                const isCurrent = idx === currentIndex
                const isFlagged = flagged[q.id]
                return (
                  <button
                    key={q.id}
                    onClick={() => handleJump(idx)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-colors relative
                      ${isCurrent
                        ? `ring-2 ${accentColor === 'purple' ? 'ring-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'ring-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'}`
                        : isAnswered
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white dark:border-slate-900" />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-400 dark:text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-100 dark:bg-purple-900/30 inline-block" /> 已答</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 dark:bg-slate-800 inline-block" /> 未答</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> 标记</span>
            </div>
          </div>
        </div>
      )}

      {/* 移动端 Passage/Question 切换 */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 flex">
        <button
          onClick={() => setMobileView('passage')}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
            mobileView === 'passage'
              ? accentColor === 'purple' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500' : 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-400 dark:text-slate-500'
          }`}
        >
          Passage
        </button>
        <button
          onClick={() => setMobileView('question')}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
            mobileView === 'question'
              ? accentColor === 'purple' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500' : 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-400 dark:text-slate-500'
          }`}
        >
          Question
        </button>
      </div>

      {/* 题目主体 */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* 左栏 Passage */}
        <div className={`md:w-1/2 border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto ${mobileView === 'passage' ? 'block' : 'hidden md:block'}`}>
          <div className="p-5 sm:p-8">
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4">Passage</p>
            <div
              className="text-sm text-gray-800 dark:text-slate-200 leading-7 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: current.passage }}
            />
            {current.image && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">Figure</p>
                <img src={current.image} alt="Figure" className="max-w-full h-auto rounded-lg" />
              </div>
            )}
            <div className="md:hidden mt-6">
              <button
                onClick={() => setMobileView('question')}
                className={`w-full py-3 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                  accentColor === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                查看题目 <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 右栏 Question */}
        <div className={`md:w-1/2 bg-white dark:bg-slate-900 overflow-y-auto flex flex-col ${mobileView === 'question' ? 'block' : 'hidden md:block'}`}>
          <div className="p-5 sm:p-8 flex-1 flex flex-col">
            <p className="text-[15px] font-semibold text-gray-900 dark:text-slate-100 leading-relaxed mb-6">
              {current.question}
            </p>

            <div className="space-y-3 flex-1">
              {current.options.map((opt, optIdx) => {
                const label = OPTION_LABELS[optIdx]
                const isSelected = selected[current.id] === optIdx
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(optIdx)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 text-sm transition-all cursor-pointer ${
                      isSelected
                        ? `border-${accentColor}-500 bg-${accentColor}-50 dark:bg-${accentColor}-900/30 text-${accentColor}-900 dark:text-${accentColor}-300 font-medium`
                        : `border-gray-200 dark:border-slate-700 hover:border-${accentColor}-300 hover:bg-${accentColor}-50/50 dark:hover:bg-${accentColor}-900/20 text-gray-700 dark:text-slate-300`
                    }`}
                  >
                    <span className={`shrink-0 w-7 h-7 rounded-full border-2 text-xs font-bold flex items-center justify-center mt-0.5 ${
                      isSelected
                        ? `border-${accentColor}-500 bg-${accentColor}-500 text-white`
                        : 'border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400'
                    }`}>
                      {label}
                    </span>
                    <span className="leading-relaxed pt-0.5">{opt}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {/* 底部操作栏 */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between sticky bottom-0 z-30">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          <ChevronLeft size={18} /> Back
        </button>

        <div className="text-sm text-gray-400 dark:text-slate-500 hidden sm:block">
          已答 {answeredCount} / {questions.length} 题
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSubmit(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
              border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Send size={16} /> 交卷
          </button>

          {currentIndex + 1 >= questions.length ? (
            <button
              onClick={() => setShowSubmit(true)}
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors text-white ${
                accentColor === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              交卷 <Send size={16} />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors text-white ${
                accentColor === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Next <ChevronRight size={18} />
            </button>
          )}
        </div>
      </footer>

      {/* 交卷确认弹窗 */}
      {showSubmit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 max-w-sm w-full text-center border border-gray-200 dark:border-slate-700">
            <Send size={32} className="mx-auto mb-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">确认交卷？</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
              你已回答 <strong>{answeredCount}</strong> / {questions.length} 题
            </p>
            {answeredCount < questions.length && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
                还有 <strong>{questions.length - answeredCount}</strong> 题未作答，交卷后这些题将计为错误
              </p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowSubmit(false)}
                className="flex-1 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl font-semibold text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                继续答题
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors"
              >
                确认交卷
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
