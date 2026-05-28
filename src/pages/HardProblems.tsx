import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PenLine, BookOpen, Calculator, ChevronRight, ArrowLeft, Flame, Zap, Trophy, Star } from 'lucide-react'

// ── 难题集阅读题型（FSP目的题拆分为3个子题型）──
const topicRouteKeys: Record<string, string> = {
  '主旨与细节题': 'zhuzhi',
  '划线目的题': 'huaxianmudi',
  '全文结构题': 'quanwenjiegou',
  '全文主旨题': 'quanwenzhuzhi',
}

type Tab = 'grammar' | 'reading' | 'math'

interface KnowledgeItem {
  title: string
  description: string
  points: string[]
}

interface ReadingTopic {
  title: string
  description: string
}

const grammarTopics: KnowledgeItem[] = [
  { title: '主谓一致', description: '掌握主语与谓语动词在数和人称上的一致关系', points: ['单数/复数主语判断', '不定代词的主谓一致', '倒装句中的主谓一致', '集体名词的用法'] },
  { title: '动词时态与语态', description: '正确使用各种时态，区分主动与被动语态', points: ['一般/进行/完成时态', '过去与现在的时态切换', '被动语态的构成', '虚拟语气基础'] },
  { title: '标点符号', description: '逗号、分号、冒号、破折号等的正确用法', points: ['逗号的常见用法', '分号连接独立分句', '冒号引出解释', '破折号的强调作用'] },
  { title: '句子结构', description: '识别并修正句子碎片、连写句和平行结构问题', points: ['句子碎片修正', '连写句与逗号拼接', '平行结构', '修饰语的正确位置'] },
  { title: '代词与指代', description: '确保代词指代清晰明确，避免歧义', points: ['代词与先行词一致', '模糊指代的修正', '关系代词的选择', '反身代词的用法'] },
]

const readingTopics: ReadingTopic[] = [
  { title: '主旨与细节题', description: '把握文章核心观点，定位关键细节信息' },
  { title: '划线目的题', description: '分析文中划线部分在上下文中的功能与目的' },
  { title: '全文结构题', description: '理解文章整体结构、段落组织与逻辑推进' },
  { title: '全文主旨题', description: '归纳整篇文章的中心思想与核心论点' },
  { title: '文学文本题', description: '理解小说、诗歌等文学作品的叙事技巧与主题' },
  { title: '双篇题', description: '比较两篇文章的观点异同与逻辑关系' },
  { title: '图表题', description: '结合图表数据与文本信息进行综合分析' },
  { title: '推断题', description: '基于文本信息进行合理的逻辑推断' },
  { title: '循证题', description: '从文中找到支持特定结论的证据' },
  { title: '例证题', description: '理解作者使用例子的目的与论证效果' },
  { title: '语境词汇题', description: '根据上下文推断词汇在特定语境中的含义' },
  { title: '逻辑词汇填空题', description: '选择恰当的逻辑连接词，把握句间关系' },
]

const mathTopics: KnowledgeItem[] = [
  { title: '线性方程与不等式', description: '一元一次方程、不等式及线性函数的应用', points: ['方程的解法', '不等式的求解与图示', '线性函数的斜率与截距', '方程组的求解'] },
  { title: '二次方程与高级代数', description: '二次方程、多项式与高次函数', points: ['因式分解', '求根公式', '顶点式与标准式', '多项式运算'] },
  { title: '数据分析与统计', description: '统计量的计算与数据图表的分析', points: ['均值、中位数、众数', '标准差与数据分布', '散点图与趋势线', '概率基础'] },
  { title: '几何与三角', description: '平面几何、立体几何与三角函数基础', points: ['勾股定理', '圆的方程与性质', '三角函数基础', '面积与体积计算'] },
  { title: '比率、比例与百分比', description: '实际问题中的比率、比例与百分比应用', points: ['比例关系的建立', '百分比增减计算', '单位换算', '实际应用题'] },
]

const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string; activeColor: string }[] = [
  { key: 'grammar', label: '文法', icon: <PenLine size={20} />, color: 'text-rose-600', activeColor: 'bg-rose-600' },
  { key: 'reading', label: '阅读', icon: <BookOpen size={20} />, color: 'text-emerald-600', activeColor: 'bg-emerald-600' },
  { key: 'math', label: '数学', icon: <Calculator size={20} />, color: 'text-blue-600', activeColor: 'bg-blue-600' },
]

const borderColors: Record<Tab, string> = {
  grammar: 'hover:border-rose-300 dark:hover:border-rose-800',
  reading: 'hover:border-emerald-300 dark:hover:border-emerald-800',
  math: 'hover:border-blue-300 dark:hover:border-blue-800',
}

const dotColors: Record<Tab, string> = {
  grammar: 'bg-rose-500',
  reading: 'bg-emerald-500',
  math: 'bg-blue-500',
}

const classList = [
  { key: 'nenghan', name: '能夯班', icon: <Flame size={28} />, color: 'from-orange-500 to-red-500', bg: 'bg-orange-50 dark:bg-orange-950', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300', desc: '夯实基础，系统构建SAT知识体系' },
  { key: 'qianghua', name: '强化班', icon: <Zap size={28} />, color: 'from-amber-500 to-yellow-500', bg: 'bg-amber-50 dark:bg-amber-950', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', desc: '强化训练，突破薄弱环节' },
  { key: 'chongci', name: '冲刺班', icon: <Trophy size={28} />, color: 'from-purple-500 to-indigo-500', bg: 'bg-purple-50 dark:bg-purple-950', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300', desc: '考前冲刺，高频难题集中突破' },
  { key: 'mijuan', name: '密卷班', icon: <Star size={28} />, color: 'from-rose-500 to-pink-500', bg: 'bg-rose-50 dark:bg-rose-950', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-300', desc: '密卷演练，模拟真题难度与出题思路' },
]

// ── 类型定义 ──
interface Props {
  selectedClass_?: string
}

export default function HardProblems({ selectedClass_ }: Props) {
  const { className } = useParams<{ className?: string }>()
  const selectedClass = className || selectedClass_ || ''
  const [activeTab, setActiveTab] = useState<Tab>('reading')
  const current = tabs.find(t => t.key === activeTab)!

  const classInfo = classList.find(c => c.key === selectedClass)

  // ── 班级选择页 ──
  if (!selectedClass || !classInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6">
            <ArrowLeft size={16} /> 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">难题集训练</h1>
          <p className="text-gray-500 dark:text-slate-400 mb-10">选择班级，开始针对性难题突破训练</p>

          <div className="grid sm:grid-cols-2 gap-6">
            {classList.map(cls => (
              <Link
                key={cls.key}
                to={`/hard-problems/${cls.key}`}
                className={`${cls.bg} ${cls.border} border-2 rounded-2xl p-8 transition-all hover:shadow-lg hover:scale-[1.02] group`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${cls.color} text-white mb-4 shadow-md`}>
                  {cls.icon}
                </div>
                <h2 className={`text-xl font-bold mb-2 ${cls.text}`}>{cls.name}</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">{cls.desc}</p>
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors">
                  进入训练 <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── 该班级的题型练习页 ──
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link to="/hard-problems" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <ArrowLeft size={16} /> 难题集
          </Link>
          <span className="text-gray-300 dark:text-slate-600">/</span>
          <span className={`font-bold ${classInfo.text}`}>{classInfo.name}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">{classInfo.name} · 难题集</h1>
        <p className="text-gray-500 dark:text-slate-400 mb-10">按题型分类的专项突破训练，FSP目的题已拆分为划线目的题、全文结构题、全文主旨题</p>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? `${tab.activeColor} text-white shadow-md`
                  : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Topic cards */}
        {activeTab === 'reading' ? (
          <div className="grid md:grid-cols-2 gap-6">
            {readingTopics.map((item, i) => {
              const topicKey = topicRouteKeys[item.title]
              const hasContent = topicKey !== undefined
              const cardClass = `bg-white dark:bg-slate-900 rounded-2xl border-2 border-transparent dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 p-6 transition-all hover:shadow-md ${hasContent ? '' : 'opacity-60'}`
              const inner = (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{item.title}</h3>
                    <span className="text-emerald-600 dark:text-emerald-400 mt-1"><ChevronRight size={18} /></span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">{item.description}</p>
                  {hasContent ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">进入练习 <ChevronRight size={14} /></span>
                  ) : (
                    <span className="text-xs text-gray-300 dark:text-slate-600">即将上线</span>
                  )}
                </>
              )
              if (hasContent) {
                return <Link key={i} to={`/knowledge/reading/${topicKey}/level1`} className={cardClass}>{inner}</Link>
              }
              return <div key={i} className={cardClass}>{inner}</div>
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'grammar' ? grammarTopics : mathTopics).map((item, i) => (
              <div
                key={i}
                className={`bg-white dark:bg-slate-900 rounded-2xl border-2 border-transparent dark:border-slate-700 ${borderColors[activeTab]} p-6 transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{item.title}</h3>
                  <span className={`${current.color} mt-1`}><ChevronRight size={18} /></span>
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">{item.description}</p>
                <div className="space-y-2">
                  {item.points.map(point => (
                    <div key={point} className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[activeTab]} shrink-0`} />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/practice"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors"
          >
            开始综合练习 <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
