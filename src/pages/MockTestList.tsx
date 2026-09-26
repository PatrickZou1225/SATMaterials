import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, FileText, ArrowRight, Construction, Lock } from 'lucide-react'
import { allMockTests, type MockTestSet } from '../data/mockTestQuestions'
import { YEAR_PRICE, priceLabel, useYearAccess } from '../lib/access'
import UnlockDialog from '../components/UnlockDialog'

const subjectColors: Record<string, string> = {
  '阅读与文法': 'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  '数学': 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
}

export default function MockTestList() {
  const { canAccess } = useYearAccess()
  const [payYear, setPayYear] = useState<number | null>(null)

  // 按年份倒序分组（2026 → 2023）
  const years = [...new Set(allMockTests.map((test) => test.year))].sort((a, b) => b - a)
  const byYear = new Map<number, MockTestSet[]>()
  for (const test of allMockTests) {
    const list = byYear.get(test.year) ?? []
    list.push(test)
    byYear.set(test.year, list)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-10">
          <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            模拟测试
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-slate-100 mb-3">SAT 真题模拟</h1>
          <p className="text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
            选择一套真题开始计时模拟考试。每套题包含 <strong>阅读与文法</strong> 和 <strong>数学</strong> 两大板块，各有两个 Module。
          </p>
        </div>

        {/* 按年份分组 */}
        <div className="space-y-10">
          {years.map((year) => {
            const unlocked = canAccess(year)
            const tests = byYear.get(year) ?? []
            return (
              <section key={year}>
                <div className="flex items-center gap-3 mb-4">
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
                </div>

                {!unlocked && (
                  <p className="mb-4 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                    <Lock size={14} /> 需付费解锁本年度真题，或等待老师布置作业。
                  </p>
                )}

                <div className="space-y-6">
                  {tests.map((test) => (
                    <div key={test.id} className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden ${unlocked ? '' : 'opacity-70'}`}>
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{test.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          共 {test.modules.length} 个 Module
                          {test.modules.some((m) => m.questions.length === 0) && (
                            <span className="ml-2 text-amber-600 dark:text-amber-400">（部分模块题目待补充）</span>
                          )}
                        </p>
                      </div>

                      <div className="divide-y divide-gray-200 dark:divide-slate-700">
                        {test.modules.map((mod, idx) => {
                          const isReady = mod.questions.length > 0
                          const clickable = isReady && unlocked
                          return (
                            <div key={mod.name} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                              <div className="flex items-center gap-4">
                                <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${subjectColors[mod.subject] || 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
                                  {mod.subject}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-800 dark:text-slate-200">{mod.name}</span>
                                    {isReady ? (
                                      <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full font-medium">已上线</span>
                                    ) : (
                                      <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium">待补充</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1"><FileText size={13} /> {isReady ? `${mod.questions.length} 题` : '—'}</span>
                                    <span className="flex items-center gap-1"><Clock size={13} /> {mod.timeMinutes} 分钟</span>
                                  </div>
                                </div>
                              </div>

                              {clickable ? (
                                <Link to={`/mock-test/${test.id}/${idx}`}
                                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
                                  开始 <ArrowRight size={16} />
                                </Link>
                              ) : !isReady ? (
                                <span className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 rounded-lg text-sm font-semibold cursor-not-allowed">
                                  <Construction size={15} /> 敬请期待
                                </span>
                              ) : (
                                <button type="button" onClick={() => setPayYear(test.year)}
                                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/50">
                                  <Lock size={15} /> 解锁
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* 年份与价格说明 */}
        <div className="mt-10 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-3">真题年份与价格</h3>
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

        {/* 考试说明 */}
        <div className="mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-3">SAT 机考结构说明</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-slate-400">
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
        </div>
      </div>

      {payYear !== null && <UnlockDialog year={payYear} onClose={() => setPayYear(null)} />}
    </div>
  )
}
