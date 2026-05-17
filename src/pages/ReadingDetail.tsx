import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

interface Question {
  id: number
  passage: string
  question: string
  options: string[]
  answer: number // 0=A, 1=B, 2=C, 3=D
}

// ============================================================
//  主旨与细节题 — Level 1（新手保护期）10道题
// ============================================================
const zhuzhi_level1: Question[] = [
  {
    id: 1,
    passage:
      "NASA's Cassini probe has detected an unusual wobble in the rotation of Mimas, Saturn's smallest moon. Using a computer model to study Mimas's gravitational interactions with Saturn and tidal forces, geophysicist Alyssa Rhoden and colleagues have proposed that this wobble could be due to a liquid ocean moving beneath the moon's icy surface. The researchers believe other moons should be examined to see if they too might have oceans hidden beneath their surfaces.",
    question: 'Which choice best states the main idea of the text?',
    options: [
      "Rhoden and colleagues were the first to confirm that several of Saturn's moons contain hidden oceans.",
      'Research has failed to identify signs that there is an ocean hidden beneath the surface of Mimas.',
      "Rhoden and colleagues created a new computer model that identifies moons with hidden oceans without needing to analyze the moons' rotation.",
      'Research has revealed that an oddity in the rotation of Mimas could be explained by an ocean hidden beneath its surface.',
    ],
    answer: 3,
  },
  {
    id: 2,
    passage:
      'Shimmering is a collective defense behavior that researchers have observed in giant honeybee colonies. When shimmering, different groups of bees flip their bodies up and down in what looks like waves. This defense is initiated when hornets hover near a colony, serving to deter the hornets from approaching the bees. Researchers hypothesize that this behavior is a specialized defense response to hornets, as it is not observed when other, larger predators approach the colony.',
    question: 'Which choice best states the main idea of the text?',
    options: [
      'Hornets are known to be the main predator of giant honeybees.',
      'Several different species of insects use shimmering to defend against hornets.',
      'Researchers think that shimmering in giant honeybees is a specific defense against hornets.',
      'Researchers are unsure how giant honeybees defend against predators larger than hornets.',
    ],
    answer: 2,
  },
  {
    id: 3,
    passage:
      "Biologists have predicted that birds' feather structures vary with habitat temperature, but this hadn't been tested in mountain environments. Ornithologist Sahas Barve studied feathers from 249 songbird species inhabiting different elevations—and thus experiencing different temperatures—in the Himalaya Mountains. He found that feathers of high-elevation species not only have a greater proportion of warming downy sections to flat and smooth sections than do feathers of low-elevation species, but high-elevation species' feathers also tend to be longer, providing a thicker layer of insulation.",
    question: 'Which choice best states the main idea of the text?',
    options: [
      "Barve's investigation shows that some species of Himalayan songbirds have evolved feathers that better regulate body temperature than do the feathers of other species, contradicting previous predictions.",
      "The results of Barve's study suggest that the ability of birds to withstand cold temperatures is determined more strongly by feather length than feather structure, challenging an established belief.",
      'Barve found an association between habitat temperature and feather structure among Himalayan songbirds, lending new support to a general prediction.',
      'Barve discovered that songbirds have adapted to their environment by growing feathers without flat and smooth sections, complicating an earlier hypothesis.',
    ],
    answer: 2,
  },
  {
    id: 4,
    passage:
      'Microplastics are pieces of plastic that are smaller than a grain of rice. These small plastics can be found in large quantities in ocean waters. Ecologist Jessica Reichert and her team are studying the role reef-building corals have in capturing microplastics from ocean waters. Through research, her team has found that these corals may be storing up to 20 million kilograms of microplastics each year in their skeletons and tissues.',
    question: 'Which choice best states the main idea of the text?',
    options: [
      'Ecologists are interested in learning more about how certain corals build large reefs.',
      'Microplastics are small pieces of plastic that can be found in ocean waters.',
      'Questions remain around the impact certain corals have on ocean ecosystems.',
      'Ecologists predict that corals store large amounts of microplastics from ocean waters.',
    ],
    answer: 3,
  },
  {
    id: 5,
    passage:
      `The following text is from William Wordsworth's 1807 poem "I Wandered Lonely as a Cloud."\n\nI wandered lonely as a cloud\nThat floats on high o'er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils;\nBeside the lake, beneath the trees,\nFluttering and dancing in the breeze.\nContinuous as the stars that shine\nAnd twinkle on the milky way,\nThey stretched in never-ending line\nAlong the margin of a bay.`,
    question: 'Based on the text, in what way are the daffodils that the speaker encounters similar to stars in the Milky Way?',
    options: [
      'They appear to twinkle in the light.',
      'They can be seen during the night and day.',
      'They flutter and dance in the breeze.',
      'They seem to go on forever.',
    ],
    answer: 3,
  },
  {
    id: 6,
    passage:
      'Paleontologists searching for signs of ancient life have found many fossilized specimens of prehistoric human ancestors, including several from the Pleistocene era discovered in a geological formation in the Minatogawa quarry in Japan. However, to study the emergence of the earliest multicellular organisms to appear on Earth, researchers must turn elsewhere, such as to the Ediacaran geological formation at Mistaken Point in Canada. A UNESCO World Heritage Site, the 146-hectare reserve contains more than 10,000 fossils that together document a critical moment in evolutionary history.',
    question: 'What does the text indicate about the geological formation at Mistaken Point?',
    options: [
      'It holds a greater number of fossils but from a smaller variety of species than the formation in the Minatogawa quarry does.',
      'It has provided evidence that the earliest human species may have emerged before the Pleistocene era.',
      'It contains specimens from an older time period than those found in the formation in the Minatogawa quarry.',
      'It is widely considered by paleontologists to be the most valuable source of information about prehistoric life forms.',
    ],
    answer: 2,
  },
  {
    id: 7,
    passage:
      "The ice melted on a Norwegian mountain during a particularly warm summer in 2019, revealing a 1,700-year-old sandal to a mountaineer looking for artifacts. The sandal would normally have degraded quickly, but it was instead well preserved for centuries by the surrounding ice. According to archaeologist Espen Finstad and his team, the sandal, like those worn by imperial Romans, wouldn't have offered any protection from the cold in the mountains, so some kind of insulation, like fabric or animal skin, would have needed to be worn on the feet with the sandal.",
    question: 'What does the text indicate about the discovery of the sandal?',
    options: [
      'The discovery revealed that the Roman Empire had more influence on Norway than archaeologists previously assumed.',
      "The sandal would have degraded if it hadn't been removed from the ice.",
      'Temperatures contributed to both protecting and revealing the sandal.',
      'Archaeologists would have found the sandal eventually without help from the general public.',
    ],
    answer: 2,
  },
  {
    id: 8,
    passage:
      "To protect themselves when being attacked, hagfish—jawless marine animals that resemble eels—will release large quantities of slimy, mucus-like threads. Because these threads are unusually strong and elastic, scientist Atsuko Negishi and her colleagues have been trying to recreate them in a lab as an eco-friendly alternative to petroleum-based fibers that are often used in fabrics. The researchers want to reproduce the threads in the lab because farming hagfish for their slime would be expensive and potentially harmful to the hagfish.",
    question: "Which choice best states the text's main idea?",
    options: [
      'Hagfish are not well suited to being raised in captivity.',
      'The ability of hagfish to slime their attackers compensates for their being jawless.',
      'Hagfish have inspired researchers to develop a new petroleum-based fabric.',
      'The slimy threads that hagfish release might help researchers create a new kind of fabric.',
    ],
    answer: 3,
  },
  {
    id: 9,
    passage:
      "A common assumption among art historians is that the invention of photography in the mid-nineteenth century displaced the painted portrait in the public consciousness. The diminishing popularity of the portrait miniature, which coincided with the rise of photography, seems to support this claim. However, photography's impact on the portrait miniature may be overstated. Although records from art exhibitions in the Netherlands from 1820 to 1892 show a decrease in the number of both full-sized and miniature portraits submitted, this trend was established before the invention of photography.",
    question: "Based on the text, what can be concluded about the diminishing popularity of the portrait miniature in the nineteenth century?",
    options: [
      'As demand for portrait miniatures decreased, portrait artists likely shifted their creative focus to photography.',
      'The popularity of the portrait miniature likely persisted for longer than art historians have assumed.',
      'Although portrait miniatures became less common than photographs, they were widely regarded as having more artistic merit.',
      "Factors other than the rise of photography may be more directly responsible for the portrait miniature's decline.",
    ],
    answer: 3,
  },
  {
    id: 10,
    passage:
      `The following text is adapted from Christina Rossetti's 1881 poem "Monna Innominata 2":\n\nI wish I could remember that first day,\nFirst hour, first moment of your meeting me,\nIf bright or dim the season, it might be\nSummer or Winter for all I can say;\nSo unrecorded did it slip away,\nSo blind was I to see and to foresee,\nSo dull to mark the budding of my tree\nThat would not blossom yet for many a May.`,
    question: 'Which choice best states the main idea of the text?',
    options: [
      'As the anniversary of the beginning of an important relationship approaches, the speaker feels conflicted about how best to commemorate it.',
      'After years of neglecting a once valuable relationship, the speaker worries it may be too late for her to salvage the relationship.',
      'The speaker celebrates how the passage of time has strengthened a relationship that once seemed unimportant.',
      'Because the speaker did not anticipate how important a relationship would become, she cannot recall how the relationship began, which she regrets.',
    ],
    answer: 3,
  },
]

// ============================================================
//  题目数据映射 — 后续新增 topic/level 在这里添加
// ============================================================
const topicData: Record<string, Record<string, Question[]>> = {
  zhuzhi: {
    level1: zhuzhi_level1,
  },
}

const topicNames: Record<string, string> = {
  zhuzhi: '主旨与细节题',
}

const levelNames: Record<string, { name: string; label: string; color: string; bg: string; border: string }> = {
  level1: { name: 'Level 1', label: '新手保护期', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300' },
  level2: { name: 'Level 2', label: '渐入佳境', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300' },
  level3: { name: 'Level 3', label: '试试就逝世', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300' },
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

// ============================================================
//  单题卡片 — SAT 机考左右分栏布局
// ============================================================
function QuestionCard({
  q,
  idx,
  selected,
  revealed,
  onSelect,
  onReveal,
}: {
  q: Question
  idx: number
  selected: number | undefined
  revealed: boolean
  onSelect: (optIdx: number) => void
  onReveal: () => void
}) {
  const isCorrect = revealed && selected === q.answer

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      {/* 题号栏 */}
      <div className="flex items-center gap-3 px-6 py-3 border-b bg-gray-50">
        <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center shrink-0">
          {idx + 1}
        </span>
        {revealed && (
          isCorrect
            ? <span className="flex items-center gap-1 text-green-600 text-sm font-semibold"><CheckCircle size={15} /> 正确</span>
            : <span className="flex items-center gap-1 text-red-500 text-sm font-semibold"><XCircle size={15} /> 错误</span>
        )}
      </div>

      {/* 左右分栏主体 */}
      <div className="flex" style={{ minHeight: '320px' }}>

        {/* ── 左栏：文章 ── */}
        <div className="w-1/2 border-r overflow-y-auto p-6" style={{ maxHeight: '480px' }}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Passage</p>
          <div className="text-sm text-gray-800 leading-7 whitespace-pre-line">
            {q.passage}
          </div>
        </div>

        {/* ── 右栏：题目 + 选项 + 按钮 ── */}
        <div className="w-1/2 overflow-y-auto p-6 flex flex-col" style={{ maxHeight: '480px' }}>
          <p className="text-sm font-semibold text-gray-900 leading-relaxed mb-5">
            {q.question}
          </p>

          <div className="space-y-3 flex-1">
            {q.options.map((opt, optIdx) => {
              const label = OPTION_LABELS[optIdx]
              let base =
                'w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border text-sm transition-all '

              if (!revealed) {
                base +=
                  selected === optIdx
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700'
              } else {
                if (optIdx === q.answer) {
                  base += 'border-green-500 bg-green-50 text-green-900 font-semibold'
                } else if (optIdx === selected && selected !== q.answer) {
                  base += 'border-red-400 bg-red-50 text-red-700'
                } else {
                  base += 'border-gray-100 text-gray-400'
                }
              }

              return (
                <button key={optIdx} className={base} onClick={() => onSelect(optIdx)}>
                  {/* 字母圆圈 */}
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center mt-0.5
                      ${!revealed
                        ? selected === optIdx
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-gray-300 text-gray-500'
                        : optIdx === q.answer
                          ? 'border-green-500 bg-green-500 text-white'
                          : optIdx === selected
                            ? 'border-red-400 bg-red-400 text-white'
                            : 'border-gray-200 text-gray-400'
                      }`}
                  >
                    {label}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              )
            })}
          </div>

          {/* 确认按钮 */}
          {!revealed && (
            <button
              onClick={onReveal}
              disabled={selected === undefined}
              className="mt-5 self-start px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              确认答案
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
//  页面主体
// ============================================================
export default function ReadingDetail() {
  const { topic = 'zhuzhi', level = 'level1' } = useParams<{ topic: string; level: string }>()
  const questions = topicData[topic]?.[level] ?? []
  const levelInfo = levelNames[level]
  const topicName = topicNames[topic] ?? topic

  const [selected, setSelected] = useState<Record<number, number>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const handleSelect = (qId: number, optIdx: number) => {
    if (revealed[qId]) return
    setSelected(prev => ({ ...prev, [qId]: optIdx }))
  }

  const handleReveal = (qId: number) => {
    setRevealed(prev => ({ ...prev, [qId]: true }))
  }

  const answeredCount = Object.keys(revealed).length
  const score = questions.filter(q => revealed[q.id] && selected[q.id] === q.answer).length

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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* 顶部导航 */}
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> 返回知识点
        </Link>

        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{topicName}</h1>
          {levelInfo && (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${levelInfo.bg} ${levelInfo.color} ${levelInfo.border}`}>
              {levelInfo.name} · {levelInfo.label}
            </span>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-8">共 {questions.length} 道题 · 左侧阅读文章，右侧作答</p>

        {/* 进度条 */}
        {answeredCount > 0 && (
          <div className="mb-8 p-4 bg-white rounded-xl border flex items-center gap-4">
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              {score} / {answeredCount} 正确
            </span>
          </div>
        )}

        {/* 题目列表 */}
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              q={q}
              idx={idx}
              selected={selected[q.id]}
              revealed={!!revealed[q.id]}
              onSelect={(optIdx) => handleSelect(q.id, optIdx)}
              onReveal={() => handleReveal(q.id)}
            />
          ))}
        </div>

        {/* 全部完成 */}
        {answeredCount === questions.length && (
          <div className="mt-10 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
            <p className="text-2xl font-bold text-emerald-700 mb-1">🎉 完成！</p>
            <p className="text-gray-600 mb-4">
              得分：<span className="font-bold text-emerald-700">{score} / {questions.length}</span>
            </p>
            <Link
              to="/knowledge"
              className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors text-sm"
            >
              返回知识点
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
