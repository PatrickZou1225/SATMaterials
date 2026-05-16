import { Link } from 'react-router-dom'
import { Calculator, BookOpen, ArrowRight } from 'lucide-react'

export default function Subjects() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">学习科目</h1>
        <p className="text-gray-500 mb-10">选择你要练习的科目，针对性提升各个知识点</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Math */}
          <div className="bg-white rounded-2xl border p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-xl"><Calculator size={28} className="text-blue-600" /></div>
              <div>
                <h2 className="text-xl font-bold">数学</h2>
                <p className="text-sm text-gray-400">Math</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6">覆盖代数、高级数学、数据分析与几何，对应SAT数学模块的所有考点。</p>
            <div className="space-y-2 mb-8">
              {['线性方程与函数', '二次方程', '数据分析与统计', '几何与三角', '比率与比例'].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /> {t}
                </div>
              ))}
            </div>
            <Link to="/practice?subject=math" className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm">
              开始数学练习 <ArrowRight size={16} />
            </Link>
          </div>

          {/* Reading */}
          <div className="bg-white rounded-2xl border p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 rounded-xl"><BookOpen size={28} className="text-emerald-600" /></div>
              <div>
                <h2 className="text-xl font-bold">阅读与写作</h2>
                <p className="text-sm text-gray-400">Reading & Writing</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6">涵盖词汇理解、文本分析、语法修辞和论证推理，全面提升语言能力。</p>
            <div className="space-y-2 mb-8">
              {['词汇理解与语境', '文本分析与推断', '语法与句子结构', '修辞技巧', '论证与推理'].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> {t}
                </div>
              ))}
            </div>
            <Link to="/practice?subject=reading" className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold text-sm">
              开始阅读练习 <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Score targets */}
        <div className="mt-10 bg-white rounded-2xl border p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">目标分数路径</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { range: '1000-1100', label: '基础入门', color: 'bg-gray-100 text-gray-700' },
              { range: '1100-1300', label: '稳步提升', color: 'bg-blue-100 text-blue-700' },
              { range: '1300-1450', label: '冲击优秀', color: 'bg-indigo-100 text-indigo-700' },
              { range: '1450-1600', label: '顶尖备考', color: 'bg-purple-100 text-purple-700' },
            ].map(s => (
              <div key={s.range} className={`${s.color} rounded-xl p-5 text-center`}>
                <div className="text-xl font-bold mb-1">{s.range}</div>
                <div className="text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
