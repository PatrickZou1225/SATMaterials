// ============================================================
//  阅读专项题目数据
//  新增 topic/level 在这里添加对应数组，并在 topicData 中注册
// ============================================================

export interface ReadingQuestion {
  id: number
  passage: string
  question: string
  options: string[]
  answer: number // 0=A, 1=B, 2=C, 3=D
  explanation: string // 中文解析
}

// ── 主旨与细节题 Level 1（新手保护期）──
const zhuzhi_level1: ReadingQuestion[] = [
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
    explanation:
      '文章核心逻辑：发现异常自转 → 用计算机模型研究 → 提出"地下海洋"假说。D 选项准确概括了这个因果链。A 说"首次确认"过于绝对（文中只是"proposed"）；B 与文意相反；C 歪曲了模型的用途（模型是研究引力和潮汐力的，不是直接识别海洋的）。',
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
    explanation:
      '文章重点在最后一句的假说：shimmering 是专门针对大黄蜂的防御，因为面对其他更大捕食者时不会出现。C 精确对应。A 把 hornets 说成"主要天敌"无文本依据；B 说"多种昆虫都有"文中没提；D 说"不确定如何防御更大捕食者"偏离重点。',
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
    explanation:
      '文章结构：已有预测（羽毛结构随温度变化）→ 尚未在山地验证 → Barve 的研究提供了新证据支持。C 准确概括了"为已有预测提供新支持"。A 说"contradicting"与文意相反；B 制造了"长度 vs 结构"的假对立；D 说"没有光滑部分"不准确（是比例不同，不是没有）。',
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
    explanation:
      '文章前半定义背景（微塑料+海洋），后半引出核心发现：珊瑚每年可能储存大量微塑料。D 精准概括。A 偏离微塑料主题；B 只说了背景信息；C 太笼统，没有涉及微塑料这个关键点。',
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
    explanation:
      '关键句：\"Continuous as the stars...They stretched in never-ending line\"。诗人用银河星星的比喻强调水仙花延绵不绝（never-ending），D 对应"似乎永无尽头"。A"闪烁"是星星的特点但不是比喻重点；B 无依据；C"fluttering and dancing"描述的是水仙花本身，不是与星星的相似点。',
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
    explanation:
      '推理链：Minatogawa 有更新世人类祖先化石 → 但要研究"最早的多细胞生物"得去 Mistaken Point。最早多细胞生物远早于更新世人类祖先，因此 C（来自更古老的时期）成立。A 的"种类更少"无依据；B 歪曲了信息（Mistaken Point 研究的是多细胞生物，不是人类）；D 的"最有价值"过于绝对。',
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
    explanation:
      '两个温度作用：① 冰保存了凉鞋 1700 年（低温保护）→ ② 2019 年特别炎热的夏天冰融化，凉鞋重见天日（高温揭露）。C 精确概括了温度的双重角色。A 过度推断；B 说反了（是冰保护了它，不是移出冰才保护）；D 无文本依据。',
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
    explanation:
      '文章逻辑：盲鳗的黏液线 → 强韧有弹性 → 科学家试图在实验室复制 → 做成环保面料替代石油基纤维。D 准确概括。A 太窄（只说了不适合养殖这个细节）；B 偏离重点；C 说"石油基面料"恰恰搞反了（是替代石油基，不是开发石油基）。',
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
    explanation:
      '关键转折：\"However\" 之后指出肖像画数量下降的趋势在摄影发明之前就已确立（established before），所以摄影可能不是主因 → 其他因素可能更直接。D 准确。A 无依据（没提画家转行）；B 与数据矛盾（确实在减少）；C 的"艺术价值更高"属于无中生有。',
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
    explanation:
      '诗歌核心情感：\"I wish I could remember\" + \"So blind was I to see and to foresee\" → 当初没预见到这段关系的重要性（blind to foresee），所以没留下记忆（unrecorded did it slip away），如今后悔。D 完整概括。A 无"周年纪念"相关内容；B 的"挽救关系"偏离主题；C 说"庆祝"与诗歌的遗憾基调矛盾。',
  },
]

// ============================================================
//  题目数据映射 — 后续新增 topic/level 在这里添加
// ============================================================
export const topicData: Record<string, Record<string, ReadingQuestion[]>> = {
  zhuzhi: {
    level1: zhuzhi_level1,
  },
}

export const topicNames: Record<string, string> = {
  zhuzhi: '主旨与细节题',
}

export const levelNames: Record<
  string,
  { name: string; label: string; color: string; bg: string; border: string }
> = {
  level1: { name: 'Level 1', label: '新手保护期', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300' },
  level2: { name: 'Level 2', label: '渐入佳境', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300' },
  level3: { name: 'Level 3', label: '试试就逝世', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300' },
}
