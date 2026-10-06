import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Construction, Lock, Search } from 'lucide-react'
import { allMockTests, type MockTestSet } from '../data/mockTestQuestions'
import { monthLabel, monthOfSet } from '../lib/questionBank'
import { YEAR_PRICE, priceLabel, useYearAccess } from '../lib/access'
import UnlockDialog from '../components/UnlockDialog'

const subjectButton: Record<string, string> = {
  '阅读与文法': 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50',
  '数学': 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50',
}

// "Module 1 (Routing)" reads as noise on a chip; the number identifies the module.
const shortModuleName = (name: string) => name.match(/Module\s*\d+/i)?.[0] ?? name

// "SAT CMP 2026-C3-INT-01" → "C3-INT-01"; the year already lives in the tab above.
const shortTitle = (title: string) => title.replace(/^SAT CMP \d{4}-/, '')

export default function MockTestList() {
  const { canAccess } = useYearAccess()
  const [payYear, setPayYear] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [monthFilter, setMonthFilter] = useState<number | null>(null)
  const [activeYear, setActiveYear] = useState<number | 'all'>('all')

  // 按年份倒序分组（2026 → 2023）
  const years = [...new Set(allMockTests.map((test) => test.year))].sort((a, b) => b - a)
  const byYear = new Map<number, MockTestSet[]>()
  for (const test of allMockTests) {
    const list = byYear.get(test.year) ?? []
    list.push(test)
    byYear.set(test.year, list)
  }

  const months = useMemo(() => {
    const found = new Set<number>()
    for (const test of allMockTests) {
      const month = monthOfSet(test.id)
      if (month !== null) found.add(month)
    }
    return [...found].sort((a, b) => a - b)
  }, [])

  const trimmedQuery = query.trim().toLowerCase()
  const filtering = trimmedQuery !== '' || monthFilter !== null

  const matches = (test: MockTestSet) => {
    const month = monthOfSet(test.id)
    if (monthFilter !== null && month !== monthFilter) return false
    if (!trimmedQuery) return true
    return `${test.title} ${month ? monthLabel(month) : ''}`.toLowerCase().includes(trimmedQuery)
  }

  // 搜索/筛选时跨全年份查找；否则只看当前年份标签页
  const visibleYears = filtering ? years : (activeYear === 'all' ? years : [activeYear])

  const sections = visibleYears
    .map((year) => ({ year, tests: (byYear.get(year) ?? []).filter(matches) }))
    .filter((section) => section.tests.length > 0)

  const switchYear = (year: number | 'all') => {
    setActiveYear(year)
    setMonthFilter(null)
    setQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-8">
          <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            模拟测试
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-slate-100 mb-3">SAT 真题模拟</h1>
          <p className="text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
            选择一套真题开始计时模拟考试。每套题包含 <strong>阅读与文法</strong> 和 <strong>数学</strong> 两大板块，各有两个 Module。
          </p>
        </div>

        {/* 年份标签页 */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <YearTab active={activeYear === 'all'} onClick={() => switchYear('all')}>全部</YearTab>
          {years.map((year) => (
            <YearTab key={year} active={activeYear === year} onClick={() => switchYear(year)}>
              {year}
              <span className="opacity-60 font-normal">{byYear.get(year)?.length ?? 0} 套</span>
            </YearTab>
          ))}
        </div>

        {/* 搜索 + 月份筛选 */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索套题，如 C3、H8-INT"
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm text-gray-800 dark:text-slate-200" />
          </label>
          <div className="flex flex-wrap gap-1.5">
            <MonthChip active={monthFilter === null} onClick={() => setMonthFilter(null)}>全部</MonthChip>
            {months.map((month) => (
              <MonthChip key={month} active={monthFilter === month}
                onClick={() => setMonthFilter(monthFilter === month ? null : month)}>
                {monthLabel(month)}
              </MonthChip>
            ))}
          </div>
        </div>

        {/* 套题网格 */}
        <div className="space-y-8">
          {sections.map(({ year, tests }) => {
            const unlocked = canAccess(year)
            return (
              <section key={year}>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{year} 年真题</h2>
                  {unlocked ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold border border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300">
                      {priceLabel(year)}
                    </span>
                  ) : (
                    <button type="button" onClick={() => setPayYear(year)}
                      className="px-3 py-1 rounded-full text-xs font-bold border border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50">
                      {priceLabel(year)} 解锁
                    </button>
                  )}
                  {!unlocked && (
                    <span className="flex items-center gap-1.5 text-sm text-amber-700 dark:text-amber-300">
                      <Lock size={14} /> 需付费解锁本年度真题，或等待老师布置作业。
                    </span>
                  )}
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${unlocked ? '' : 'opacity-70'}`}>
                  {tests.map((test) => (
                    <div key={test.id}
                      className="flex flex-col gap-3 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-4 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                      <span className="font-semibold text-gray-900 dark:text-slate-100" title={test.title}>
                        {shortTitle(test.title)}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {test.modules.map((mod, idx) => {
                          const isReady = mod.questions.length > 0
                          const label = `${shortModuleName(mod.name)} · ${mod.questions.length}题`
                          const detail = `${mod.name} · ${mod.subject} · ${mod.questions.length} 题 · ${mod.timeMinutes} 分钟`

                          if (!isReady) {
                            return (
                              <span key={mod.name} title={`${mod.name} · 题目待补充`}
                                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-gray-400 dark:text-slate-500">
                                <Construction size={12} /> {shortModuleName(mod.name)} 待补充
                              </span>
                            )
                          }
                          if (!unlocked) {
                            return (
                              <button key={mod.name} type="button" onClick={() => setPayYear(test.year)} title={detail}
                                className="inline-flex items-center gap-1 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50">
                                <Lock size={12} /> {label}
                              </button>
                            )
                          }
                          return (
                            <Link key={mod.name} to={`/mock-test/${test.id}/${idx}`} title={detail}
                              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${subjectButton[mod.subject] || 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
                              {label} <ArrowRight size={12} />
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
          {sections.length === 0 && <p className="text-sm text-gray-500 dark:text-slate-400">没有匹配的套题。</p>}
        </div>

        {/* 年份与价格说明（可折叠） */}
        <details className="mt-10 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <summary className="flex items-center justify-between cursor-pointer select-none p-6 font-bold text-gray-800 dark:text-slate-200">
            真题年份与价格
            <ChevronDown size={18} className="text-gray-400 dark:text-slate-500" />
          </summary>
          <div className="px-6 pb-6">
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              {Object.entries(YEAR_PRICE).sort(([a], [b]) => Number(b) - Number(a)).map(([year, price]) => (
                <li key={year} className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2 last:border-0">
                  <span>{year} 年真题</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200">{price === 0 ? '免费' : `¥${price} 永久解锁`}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-gray-400 dark:text-slate-500">老师布置的作业在「我的作业」中完成，不受真题解锁限制。</p>
          </div>
        </details>

        {/* 考试说明（可折叠） */}
        <details className="mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <summary className="flex items-center justify-between cursor-pointer select-none p-6 font-bold text-gray-800 dark:text-slate-200">
            SAT 机考结构说明
            <ChevronDown size={18} className="text-gray-400 dark:text-slate-500" />
          </summary>
          <div className="px-6 pb-6 grid sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-slate-400">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <p className="font-semibold text-purple-800 dark:text-purple-300 mb-2">阅读与文法</p>
              <ul className="space-y-1">
                <li>Module 1：27 题 / 32 分钟</li>
                <li>Module 2：27 题 / 32 分钟</li>
                <li className="text-gray-400 dark:text-slate-500">合计约 54 题 / 64 分钟</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">数学</p>
              <ul className="space-y-1">
                <li>Module 1：22 题 / 35 分钟</li>
                <li>Module 2：22 题 / 35 分钟</li>
                <li className="text-gray-400 dark:text-slate-500">合计约 44 题 / 70 分钟</li>
              </ul>
            </div>
          </div>
        </details>
      </div>

      {payYear !== null && <UnlockDialog year={payYear} onClose={() => setPayYear(null)} />}
    </div>
  )
}

function YearTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? 'bg-purple-600 text-white shadow-sm'
          : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border border-gray-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500'
      }`}>
      {children}
    </button>
  )
}

function MonthChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'border-purple-500 bg-purple-600 text-white'
          : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:border-purple-400'
      }`}>
      {children}
    </button>
  )
}
