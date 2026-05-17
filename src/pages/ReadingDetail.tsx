import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, XCircle, RotateCcw, Flag } from 'lucide-react'

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
//  页面主体 — 一页一题 SAT 机考模式
// ============================================================
export default function ReadingDetail() {
  const { topic = 'zhuzhi', level = 'level1' } = useParams<{ topic: string; level: string }>()
  const questions = topicData[topic]?.[level] ?? []
  const levelInfo = levelNames[level]
  const topicName = topicNames[topic] ?? topic

  // 当前题号（0-based）
  const [currentIndex, setCurrentIndex] = useState(0)
  // 每道题的选择和是否已确认
  const [selected, setSelected] = useState<Record<number, number>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  // 标记的题目
  const [flagged, setFlagged] = useState<Record<number, boolean>>({})
  // 是否显示完成页
  const [finished, setFinished] = useState(false)
  // 是否展开题号导航面板
  const [showNav, setShowNav] = useState(false)

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
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1)
  }

  const handleJump = (idx: number) => {
    setCurrentIndex(idx)
    setFinished(false)
    setShowNav(false)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelected({})
    setRevealed({})
    setFlagged({})
    setFinished(false)
  }

  const toggleFlag = () => {
    if (!current) return
    setFlagged(prev => ({ ...prev, [current.id]: !prev[current.id] }))
  }

  // 空题库
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

  // ── 完成页面 ──
  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border shadow-sm p-10 text-center">
            <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '💪' : '📖'}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">练习完成！</h2>
            <p className="text-gray-500 mb-2">{topicName} · {levelInfo?.name}</p>

            {/* 分数大字 */}
            <div className="my-6">
              <span className="text-5xl font-bold text-emerald-600">{score}</span>
              <span className="text-2xl text-gray-400"> / {questions.length}</span>
            </div>
            <p className="text-gray-500 mb-8">
              正确率 <span className="font-bold text-emerald-600">{pct}%</span>
            </p>

            {/* 每题回顾缩略 */}
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
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
              >
                <RotateCcw size={18} /> 重新练习
              </button>
              <Link
                to="/knowledge"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
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
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* ══════════ 顶部工具栏 ══════════ */}
      <header className="bg-white border-b px-4 py-2.5 flex items-center justify-between sticky top-0 z-30">
        {/* 左：返回 + 标题 */}
        <div className="flex items-center gap-3">
          <Link
            to="/knowledge"
            className="text-gray-400 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="hidden sm:block">
            <span className="text-sm font-bold text-gray-800">{topicName}</span>
            {levelInfo && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${levelInfo.bg} ${levelInfo.color}`}>
                {levelInfo.name}
              </span>
            )}
          </div>
        </div>

        {/* 中：题号进度 */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* 右：题号面板切换 + 标记 */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFlag}
            className={`p-2 rounded-lg transition-colors ${flagged[current.id] ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:bg-gray-100'}`}
            title="标记此题"
          >
            <Flag size={18} />
          </button>
          <button
            onClick={() => setShowNav(v => !v)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-600 transition-colors"
          >
            题号导航
          </button>
        </div>
      </header>

      {/* ── 进度条 ── */}
      <div className="w-full bg-gray-200 h-1">
        <div
          className="bg-emerald-500 h-1 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* ── 题号导航弹窗 ── */}
      {showNav && (
        <div className="bg-white border-b shadow-sm px-4 py-3">
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
                        ? 'ring-2 ring-emerald-500 bg-emerald-50 text-emerald-700'
                        : answered
                          ? correct
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white" />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 inline-block" /> 正确</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 inline-block" /> 错误</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 inline-block" /> 未答</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> 标记</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ 题目主体 — SAT 左右分栏 ══════════ */}
      <main className="flex-1 flex overflow-hidden">

        {/* ── 左栏：文章 ── */}
        <div className="w-1/2 border-r bg-white overflow-y-auto">
          <div className="p-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Passage</p>
            <div className="text-sm text-gray-800 leading-7 whitespace-pre-line">
              {current.passage}
            </div>
          </div>
        </div>

        {/* ── 右栏：题目 + 选项 ── */}
        <div className="w-1/2 bg-white overflow-y-auto flex flex-col">
          <div className="p-8 flex-1 flex flex-col">
            {/* 题目 */}
            <p className="text-[15px] font-semibold text-gray-900 leading-relaxed mb-6">
              {current.question}
            </p>

            {/* 选项 */}
            <div className="space-y-3 flex-1">
              {current.options.map((opt, optIdx) => {
                const label = OPTION_LABELS[optIdx]
                let base =
                  'w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 text-sm transition-all cursor-pointer '

                if (!isRevealed) {
                  base +=
                    selected[current.id] === optIdx
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-gray-700'
                } else {
                  if (optIdx === current.answer) {
                    base += 'border-green-500 bg-green-50 text-green-900 font-semibold'
                  } else if (optIdx === selected[current.id] && selected[current.id] !== current.answer) {
                    base += 'border-red-400 bg-red-50 text-red-700'
                  } else {
                    base += 'border-gray-100 text-gray-400'
                  }
                }

                return (
                  <button key={optIdx} className={base} onClick={() => handleSelect(optIdx)}>
                    {/* 字母圆圈 */}
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full border-2 text-xs font-bold flex items-center justify-center mt-0.5
                        ${!isRevealed
                          ? selected[current.id] === optIdx
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-gray-300 text-gray-500'
                          : optIdx === current.answer
                            ? 'border-green-500 bg-green-500 text-white'
                            : optIdx === selected[current.id]
                              ? 'border-red-400 bg-red-400 text-white'
                              : 'border-gray-200 text-gray-400'
                        }`}
                    >
                      {label}
                    </span>
                    <span className="leading-relaxed pt-0.5">{opt}</span>
                  </button>
                )
              })}
            </div>

            {/* 答题反馈 */}
            {isRevealed && (
              <div className={`mt-6 p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="flex items-center gap-2 font-semibold text-sm mb-1">
                  {isCorrect
                    ? <><CheckCircle size={16} className="text-green-500" /> 回答正确！</>
                    : <><XCircle size={16} className="text-red-500" /> 回答错误</>
                  }
                </p>
                <p className="text-sm text-gray-600">
                  正确答案是 <span className="font-bold">{OPTION_LABELS[current.answer]}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ══════════ 底部操作栏 ══════════ */}
      <footer className="bg-white border-t px-4 py-3 flex items-center justify-between sticky bottom-0 z-30">
        {/* 左：上一题 */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed
            text-gray-600 hover:bg-gray-100"
        >
          <ChevronLeft size={18} /> Back
        </button>

        {/* 中：分数/进度 */}
        <div className="text-sm text-gray-400">
          已答 {totalAnswered} / {questions.length} 题
          {totalAnswered > 0 && <span className="ml-2 text-emerald-600 font-semibold">{score} 正确</span>}
        </div>

        {/* 右：确认 or 下一题 */}
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
