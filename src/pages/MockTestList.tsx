import { Link } from 'react-router-dom'
import { Clock, FileText, ArrowRight, Construction } from 'lucide-react'
import { allMockTests } from '../data/mockTestQuestions'

const subjectColors: Record<string, string> = {
  '阅读与文法': 'border-purple-300 bg-purple-50 text-purple-700',
  '数学': 'border-blue-300 bg-blue-50 text-blue-700'
}

export default function MockTestList() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-10">
          <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            模拟测试
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">SAT 真题模拟</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            选择一套真题开始计时模拟考试。每套题包含 <strong>阅读与文法</strong> 和 <strong>数学</strong> 两大板块，各有两个 Module。
          </p>
        </div>

        {/* 套题列表 */}
        <div className="space-y-6">
          {allMockTests.map(test => (
            <div key={test.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              {/* 套题标题 */}
              <div className="px-6 py-4 border-b bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{test.title}</h2>
                  <p className="text-sm text-gray-500">
                    共 {test.modules.length} 个 Module
                    {test.modules.some(m => m.questions.length === 0) && (
                      <span className="ml-2 text-amber-600">（部分模块题目待补充）</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Module 列表 */}
              <div className="divide-y">
                {test.modules.map((mod, idx) => {
                  const isReady = mod.questions.length > 0
                  return (
                    <div
                      key={mod.name}
                      className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* 模块标识 */}
                        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${subjectColors[mod.subject] || 'border-gray-300 bg-gray-50 text-gray-600'}`}>
                          {mod.subject}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800">{mod.name}</span>
                            {isReady ? (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">已上线</span>
                            ) : (
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">待补充</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FileText size={13} /> {isReady ? `${mod.questions.length} 题` : '—'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={13} /> {mod.timeMinutes} 分钟
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      {isReady ? (
                        <Link
                          to={`/mock-test/${test.id}/${idx}`}
                          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
                        >
                          开始 <ArrowRight size={16} />
                        </Link>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed">
                          <Construction size={15} /> 敬请期待
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 考试说明 */}
        <div className="mt-10 bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-3">SAT 机考结构说明</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="font-semibold text-purple-800 mb-2">阅读与文法</p>
              <ul className="space-y-1">
                <li>Module 1：27 题 / 32 分钟</li>
                <li>Module 2：27 题 / 32 分钟</li>
                <li className="text-gray-400">合计约 54 题 / 64 分钟</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="font-semibold text-blue-800 mb-2">数学</p>
              <ul className="space-y-1">
                <li>Module 1：22 题 / 35 分钟</li>
                <li>Module 2：22 题 / 35 分钟</li>
                <li className="text-gray-400">合计约 44 题 / 70 分钟</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
