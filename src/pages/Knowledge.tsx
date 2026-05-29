import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PenLine, BookOpen, Calculator, ChevronRight, ArrowLeft } from 'lucide-react'

// 各阅读 topic 对应的路由 key（无内容则留空）
const topicRouteKeys: Record<string, string> = {
  '主旨与细节题': 'zhuzhi',
  '冲刺班 · 全文主旨题': 'chongci_zhuzhi',
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
  levels: { name: string; label: string; color: string; bg: string; routeKey?: string }[]
}

const grammarTopics: KnowledgeItem[] = [
  {
    title: '主谓一致',
    description: '掌握主语与谓语动词在数和人称上的一致关系',
    points: ['单数/复数主语判断', '不定代词的主谓一致', '倒装句中的主谓一致', '集体名词的用法'],
  },
  {
    title: '动词时态与语态',
    description: '正确使用各种时态，区分主动与被动语态',
    points: ['一般/进行/完成时态', '过去与现在的时态切换', '被动语态的构成', '虚拟语气基础'],
  },
  {
    title: '标点符号',
    description: '逗号、分号、冒号、破折号等的正确用法',
    points: ['逗号的常见用法', '分号连接独立分句', '冒号引出解释', '破折号的强调作用'],
  },
  {
    title: '句子结构',
    description: '识别并修正句子碎片、连写句和平行结构问题',
    points: ['句子碎片修正', '连写句与逗号拼接', '平行结构', '修饰语的正确位置'],
  },
  {
    title: '代词与指代',
    description: '确保代词指代清晰明确，避免歧义',
    points: ['代词与先行词一致', '模糊指代的修正', '关系代词的选择', '反身代词的用法'],
  },
]

const levelDefs = [
  { name: 'Level 1', label: '新手保护期', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' },
  { name: 'Level 2', label: '渐入佳境', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800' },
  { name: 'Level 3', label: '试试就逝世', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' },
]

const readingTopics: ReadingTopic[] = [
  {
    title: '主旨与细节题',
    description: '把握文章核心观点，定位关键细节信息',
    levels: levelDefs,
  },
  {
    title: 'FSP目的题',
    description: '分析作者写作意图与文本功能目的',
    levels: levelDefs,
  },
  {
    title: '文学文本题',
    description: '理解小说、诗歌等文学作品的叙事技巧与主题',
    levels: levelDefs,
  },
  {
    title: '双篇题',
    description: '比较两篇文章的观点异同与逻辑关系',
    levels: levelDefs,
  },
  {
    title: '图表题',
    description: '结合图表数据与文本信息进行综合分析',
    levels: levelDefs,
  },
  {
    title: '推断题',
    description: '基于文本信息进行合理的逻辑推断',
    levels: levelDefs,
  },
  {
    title: '循证题',
    description: '从文中找到支持特定结论的证据',
    levels: levelDefs,
  },
  {
    title: '例证题',
    description: '理解作者使用例子的目的与论证效果',
    levels: levelDefs,
  },
  {
    title: '语境词汇题',
    description: '根据上下文推断词汇在特定语境中的含义',
    levels: levelDefs,
  },
  {
    title: '逻辑词汇填空题',
    description: '选择恰当的逻辑连接词，把握句间关系',
    levels: levelDefs,
  },
]

const classTopics: ReadingTopic[] = [
  {
    title: '冲刺班 · 全文主旨题',
    description: '冲刺班难题集 — 15 道全文主旨实战训练',
    levels: [{ name: '难题集', label: '15 题', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800' }],
  },
]

const mathTopics: KnowledgeItem[] = [
  {
    title: '线性方程与不等式',
    description: '一元一次方程、不等式及线性函数的应用',
    points: ['方程的解法', '不等式的求解与图示', '线性函数的斜率与截距', '方程组的求解'],
  },
  {
    title: '二次方程与高级代数',
    description: '二次方程、多项式与高次函数',
    points: ['因式分解', '求根公式', '顶点式与标准式', '多项式运算'],
  },
  {
    title: '数据分析与统计',
    description: '统计量的计算与数据图表的分析',
    points: ['均值、中位数、众数', '标准差与数据分布', '散点图与趋势线', '概率基础'],
  },
  {
    title: '几何与三角',
    description: '平面几何、立体几何与三角函数基础',
    points: ['勾股定理', '圆的方程与性质', '三角函数基础', '面积与体积计算'],
  },
  {
    title: '比率、比例与百分比',
    description: '实际问题中的比率、比例与百分比应用',
    points: ['比例关系的建立', '百分比增减计算', '单位换算', '实际应用题'],
  },
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

export default function Knowledge() {
  const [activeTab, setActiveTab] = useState<Tab>('grammar')
  const current = tabs.find(t => t.key === activeTab)!

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6">
          <ArrowLeft size={16} /> 返回首页
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">专项知识点</h1>
        <p className="text-gray-500 dark:text-slate-400 mb-10">按知识点分类的专项突破训练，精准定位薄弱环节</p>

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

        {/* Knowledge cards */}
        {activeTab === 'reading' ? (
          <>
            {/* 题型专项知识点 */}
            <div className="grid md:grid-cols-2 gap-6">
              {readingTopics.map((item, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-transparent dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 p-6 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{item.title}</h3>
                    <span className="text-emerald-600 dark:text-emerald-400 mt-1"><ChevronRight size={18} /></span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">{item.description}</p>
                  <div className="flex gap-3">
                    {item.levels.map((lv, j) => {
                      const topicKey = topicRouteKeys[item.title]
                      const levelKey = lv.routeKey || `level${j + 1}`
                      const hasContent = topicKey !== undefined
                      const btnClass = `flex-1 ${lv.bg} border rounded-xl px-3 py-3 text-center transition-all hover:shadow-sm hover:scale-[1.02]`
                      if (hasContent && topicKey) {
                        return (
                          <Link
                            key={j}
                            to={`/knowledge/reading/${topicKey}/${levelKey}`}
                            className={btnClass}
                          >
                            <div className={`text-xs font-bold ${lv.color} mb-1`}>{lv.name}</div>
                            <div className="text-xs text-gray-600 dark:text-slate-400">{lv.label}</div>
                          </Link>
                        )
                      }
                      return (
                        <button
                          key={j}
                          className={btnClass}
                          title="题目即将上线，敬请期待"
                        >
                          <div className={`text-xs font-bold ${lv.color} mb-1`}>{lv.name}</div>
                          <div className="text-xs text-gray-600 dark:text-slate-400">{lv.label}</div>
                          <div className="text-[10px] text-gray-300 dark:text-slate-600 mt-0.5">即将上线</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* 班型难题集 */}
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full inline-block" />
                班型难题集
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {classTopics.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 p-6 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{item.title}</h3>
                      <span className="text-purple-600 dark:text-purple-400 mt-1"><ChevronRight size={18} /></span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">{item.description}</p>
                    <div className="flex gap-3">
                      {item.levels.map((lv, j) => {
                        const topicKey = topicRouteKeys[item.title]
                        const levelKey = lv.routeKey || `level${j + 1}`
                        const hasContent = topicKey !== undefined
                        const btnClass = `flex-1 ${lv.bg} border rounded-xl px-3 py-3 text-center transition-all hover:shadow-sm hover:scale-[1.02]`
                        if (hasContent && topicKey) {
                          return (
                            <Link
                              key={j}
                              to={`/knowledge/reading/${topicKey}/${levelKey}`}
                              className={btnClass}
                            >
                              <div className={`text-xs font-bold ${lv.color} mb-1`}>{lv.name}</div>
                              <div className="text-xs text-gray-600 dark:text-slate-400">{lv.label}</div>
                            </Link>
                          )
                        }
                        return (
                          <button
                            key={j}
                            className={btnClass}
                            title="题目即将上线，敬请期待"
                          >
                            <div className={`text-xs font-bold ${lv.color} mb-1`}>{lv.name}</div>
                            <div className="text-xs text-gray-600 dark:text-slate-400">{lv.label}</div>
                            <div className="text-[10px] text-gray-300 dark:text-slate-600 mt-0.5">即将上线</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
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
            开始专项练习 <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
