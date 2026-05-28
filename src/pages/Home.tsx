import { Link } from 'react-router-dom'
import { ArrowRight, Calculator, BookOpen, PenLine, TrendingUp, Clock, Award, Target, Flame, Zap, Trophy, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero */}
      <section className="py-24 px-4 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            2026 全新SAT数字化考试备考
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-gray-900 dark:text-slate-100">
            轻松突破 <span className="text-blue-600 dark:text-blue-400">1500分</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-600 dark:text-slate-400">
            专业SAT备考平台，覆盖数学、阅读与写作全科目。智能练习系统 + 详解分析，让每一分钟的学习都高效有价值。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/practice" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-base">
              立即开始练习 <ArrowRight size={18} />
            </Link>
            <Link to="/subjects" className="px-8 py-3.5 border-2 border-gray-300 dark:border-slate-600 font-semibold rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-base">
              浏览学习资源
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-slate-400">
            {[['1000+', '练习题目'], ['3大', '核心科目'], ['详细', '答题解析'], ['免费', '开始使用']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">{num}</div>
                <div>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-slate-100">核心学习模块</h2>
          <p className="text-center mb-14 max-w-xl mx-auto text-gray-600 dark:text-slate-400">新版数字化SAT考试包含两大模块，我们为每个知识点提供针对性练习与专项突破</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 数学 */}
            <div className="p-6 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex flex-col">
              <div className="mb-4"><Calculator size={32} className="text-blue-600 dark:text-blue-400" /></div>
              <h3 className="text-xl font-bold mb-0.5">数学</h3>
              <p className="text-sm text-gray-400 dark:text-slate-500 mb-3">Math</p>
              <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-4">代数、高级数学、问题解决与数据分析，全面覆盖SAT数学考点。</p>
              <ul className="space-y-1.5 text-sm text-gray-600 dark:text-slate-400 flex-1 mb-6">
                {['线性方程与函数', '二次方程', '数据分析', '几何与三角'].map(t => <li key={t} className="flex items-center gap-2">✓ {t}</li>)}
              </ul>
              <Link to="/practice?subject=math" className="block text-center py-2.5 rounded-lg text-white text-sm font-semibold bg-blue-600 hover:bg-blue-700 transition-colors">开始学习</Link>
            </div>

            {/* 阅读与写作 */}
            <div className="p-6 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors flex flex-col">
              <div className="mb-4"><BookOpen size={32} className="text-emerald-600 dark:text-emerald-400" /></div>
              <h3 className="text-xl font-bold mb-0.5">阅读与写作</h3>
              <p className="text-sm text-gray-400 dark:text-slate-500 mb-3">Reading & Writing</p>
              <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-4">信息与理解、修辞与表达、标准英语规范，提升综合语言能力。</p>
              <ul className="space-y-1.5 text-sm text-gray-600 dark:text-slate-400 flex-1 mb-6">
                {['词汇理解', '文本分析', '语法修辞', '论证推理'].map(t => <li key={t} className="flex items-center gap-2">✓ {t}</li>)}
              </ul>
              <Link to="/practice?subject=reading" className="block text-center py-2.5 rounded-lg text-white text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 transition-colors">开始学习</Link>
            </div>

            {/* 模拟测试 */}
            <div className="p-6 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 transition-colors flex flex-col">
              <div className="mb-4"><PenLine size={32} className="text-purple-600 dark:text-purple-400" /></div>
              <h3 className="text-xl font-bold mb-0.5">模拟测试</h3>
              <p className="text-sm text-gray-400 dark:text-slate-500 mb-3">Full Practice Tests</p>
              <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-4">完整的SAT模拟试题，限时练习，体验真实考试环境。</p>
              <ul className="space-y-1.5 text-sm text-gray-600 dark:text-slate-400 flex-1 mb-6">
                {['完整模拟', '计时练习', '成绩分析', '错题回顾'].map(t => <li key={t} className="flex items-center gap-2">✓ {t}</li>)}
              </ul>
              <Link to="/mock-test" className="block text-center py-2.5 rounded-lg text-white text-sm font-semibold bg-purple-600 hover:bg-purple-700 transition-colors">开始模考</Link>
            </div>

            {/* 专项知识点 */}
            <div className="p-6 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 transition-colors flex flex-col">
              <div className="mb-4"><Target size={32} className="text-amber-600 dark:text-amber-400" /></div>
              <h3 className="text-xl font-bold mb-0.5">专项知识点</h3>
              <p className="text-sm text-gray-400 dark:text-slate-500 mb-3">Targeted Knowledge</p>
              <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-4">按知识点分类的专项突破训练，精准定位薄弱环节，逐个击破。</p>
              <ul className="space-y-1.5 text-sm text-gray-600 dark:text-slate-400 flex-1 mb-6">
                {['文法专项', '阅读专项', '数学专项', '考点精讲'].map(t => <li key={t} className="flex items-center gap-2">✓ {t}</li>)}
              </ul>
              <Link to="/knowledge" className="block text-center py-2.5 rounded-lg text-white text-sm font-semibold bg-amber-600 hover:bg-amber-700 transition-colors">开始学习</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 难题集训练 */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-amber-500/20 text-amber-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              难题集训练
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">四大班型 · 难题突破</h2>
            <p className="max-w-xl mx-auto text-slate-400">按班级分层训练，FSP目的题拆解为划线目的题、全文结构题、全文主旨题，靶向攻克重难点</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: '能夯班', desc: '夯实基础，系统构建SAT知识体系', icon: <Flame size={24} />, gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', key: 'nenghan' },
              { name: '强化班', desc: '强化训练，突破薄弱环节', icon: <Zap size={24} />, gradient: 'from-amber-500 to-yellow-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', key: 'qianghua' },
              { name: '冲刺班', desc: '考前冲刺，高频难题集中突破', icon: <Trophy size={24} />, gradient: 'from-purple-500 to-indigo-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', key: 'chongci' },
              { name: '密卷班', desc: '密卷演练，模拟真题难度与出题思路', icon: <Star size={24} />, gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', key: 'mijuan' },
            ].map(cls => (
              <Link
                key={cls.key}
                to={`/hard-problems/${cls.key}`}
                className={`${cls.bg} ${cls.border} border rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl group`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${cls.gradient} mb-4 shadow-lg`}>
                  {cls.icon}
                </div>
                <h3 className="text-lg font-bold mb-1.5">{cls.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{cls.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
                  进入训练 <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-slate-100">为什么选择我们？</h2>
          <p className="text-center mb-14 max-w-xl mx-auto text-gray-600 dark:text-slate-400">科学的备考方法 + 优质的练习资源，让你的SAT备考更有效率</p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: <TrendingUp size={28} className="text-blue-600 dark:text-blue-400" />, title: '智能题目推荐', desc: '根据你的答题情况，系统自动识别薄弱知识点，优先推送最需要加强的题目类型。' },
              { icon: <Clock size={28} className="text-blue-600 dark:text-blue-400" />, title: '限时答题训练', desc: '模拟真实SAT考试节奏，培养时间管理能力，让你在考场上从容应对每道题目。' },
              { icon: <Award size={28} className="text-blue-600 dark:text-blue-400" />, title: '详细解题分析', desc: '每道题都配有详细的解题思路和知识点讲解，不只告诉你答案，更帮你理解原理。' },
              { icon: <BookOpen size={28} className="text-blue-600 dark:text-blue-400" />, title: '权威题库资源', desc: '题目参照College Board官方样题风格设计，确保练习内容与真实SAT考试高度一致。' },
            ].map(f => (
              <div key={f.title} className="p-6 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-4">
                <div className="shrink-0 mt-1">{f.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-slate-100">{f.title}</h3>
                  <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">今天就开始备考吧</h2>
          <p className="text-blue-100 mb-8 text-lg">免费使用所有练习题和学习资源，距离理想大学更近一步。</p>
          <Link to="/practice" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-base">
            免费开始练习 <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
