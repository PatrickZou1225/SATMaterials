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
  chartImage?: string // 图表题专用：图表图片路径
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

// ── 主旨与细节题 Level 2（渐入佳境）──
const zhuzhi_level2: ReadingQuestion[] = [
  {
    id: 201,
    passage:
      "The most recent iteration of the immersive theater experience Sleep No More, which premiered in New York City in 2011, transforms its performance space—a five-story warehouse—into a 1930s-era hotel. Audience members, who wander through the labyrinthine venue at their own pace and follow the actors as they play out simultaneous, interweaving narrative loops, confront the impossibility of experiencing the production in its entirety. The play's refusal of narrative coherence thus hinges on the sense of spatial fragmentation that the venue's immense and intricate layout generates.",
    question: "What does the text most strongly suggest about Sleep No More's use of its performance space?",
    options: [
      "The production's dependence on a particular performance environment would likely make it difficult to reproduce exactly in a different theatrical space.",
      "Audience members who navigate the space according to a recommended itinerary will likely have a better grasp of the play's narrative than audience members who depart from that itinerary.",
      "The choice of a New York City venue likely enabled the play's creators to experiment with the use of theatrical space in a way that venues from earlier productions could not.",
      "Audience members likely find the experience of the play disappointing because they generally cannot make their way through the entire venue.",
    ],
    answer: 0,
    explanation:
      '文章核心逻辑：Sleep No More 将五层仓库改造为 1930 年代酒店，观众在迷宫中自由穿行，面临"无法体验完整叙事"的困境。该剧"拒绝叙事连贯性"完全依赖于这个特定场地带来的空间碎片化感受。因此，这种对特定表演环境的依赖使得在其他剧场复制该剧非常困难。A 选项准确概括了这一推论。',
  },
  {
    id: 202,
    passage:
      "The following text is from Mary Shelley's 1818 novel Frankenstein. Victor Frankenstein, who narrates this portion of text, describes the state of scientific knowledge as he began his own study of the natural world.\n\nThe untaught peasant beheld the elements around him and was acquainted with their practical uses. The most learned philosopher knew little more. He had partially unveiled the face of Nature, but her immortal lineaments were still a wonder and a mystery. He might dissect, anatomize, and give names; but, not to speak of a final cause, causes in their secondary and tertiary grades were utterly unknown to him. I had gazed upon the fortifications and impediments that seemed to keep human beings from entering the citadel of nature, and rashly and ignorantly I had repined.",
    question: "Which choice best describes the main idea of the text?",
    options: [
      "Victor became disappointed in science when he realized that the practical knowledge laypeople have of nature is often deeper than the scientific understanding.",
      "Victor was impressed by the layperson's practical understanding of nature but thought science provided a clearer understanding.",
      "Victor was immediately impressed by the advantages of the scientific approach to understanding natural phenomena.",
      "Victor thinks that conventional scientific approaches to understanding natural phenomena will not yield the answers he seeks.",
    ],
    answer: 3,
    explanation:
      'Victor 认为最博学的哲学家也只是"partially unveiled the face of Nature"，根本原因（secondary and tertiary causes）对科学家来说"utterly unknown"。他将科学方法比作"fortifications and impediments"（堡垒和障碍），阻挡人类进入自然的"citadel"（城堡）。这说明他认为传统科学方法无法给出他想要的答案。D 选项精准概括。',
  },
  {
    id: 203,
    passage:
      'Vadamalai Elangovan and Ganapathi Marimuthu showed that high moonlight intensity inhibits the activity of the greater short-nosed fruit bat (Cynopterus sphinx), a finding explicable in terms of benefits and costs: greater lunar intensity may not enable the bats to increase foraging success enough to offset the higher chance of detection by predatory owls or hawks. Though many other nocturnal mammals respond to lunar intensity variations similarly to greater short-nosed fruit bats, mongoose lemurs (Eulemur mongoz) display the opposite pattern, as their heavy reliance on visual foraging results in a different balance of reward and risk.',
    question: 'According to the text, what did Elangovan and Marimuthu find and why does that occur?',
    options: [
      'Greater short-nosed fruit bats tend to be more active during periods of high lunar intensity than at other times because such conditions allow them to increase their foraging success without making them easier to detect.',
      'Greater short-nosed fruit bats reduce their activity during periods of high lunar intensity because predators can more easily spot the bats in brighter conditions, and such conditions do not benefit the bats enough to justify that risk.',
      'During periods of high lunar intensity, greater short-nosed fruit bats reduce their activity because it is easier for predators to detect the bats in relatively bright conditions than it is for predators to detect mongoose lemurs in such conditions.',
      'During periods of high lunar intensity, mongoose lemurs show a different behavioral response than greater short-nosed fruit bats and many other nocturnal mammals do because the risks to mongoose lemurs under such conditions are greater.',
    ],
    answer: 1,
    explanation:
      '文章明确表述了成本-收益逻辑：月光强度高 → 蝙蝠被捕食者发现的风险增加（cost）→ 但觅食成功率不足以抵消这个风险（benefit不够大）→ 因此蝙蝠减少活动。B 选项完整概括了这个因果链。A 说反了（蝙蝠是减少而非增加活动）；C 引入与狐猴的比较来解释蝙蝠的行为，歪曲了原文；D 讨论狐猴行为的原因，但没有回答题干关于 Elangovan 和 Marimuthu 发现的问题。',
  },
  {
    id: 204,
    passage:
      "A number of artists associated with hyperpop, a movement in electronic music that emerged in the 2010s, aggressively manipulate their recorded voice. The duo 100 gecs, for example, shifts the pitch of lead singer Laura Les's vocals to be much higher than that of her natural range. And even the hyperpop artists who don't rely on pitch-shifting, such as Shygirl, often distort their vocals using digital tools. Rather than being an arbitrary stylistic choice, hyperpop's persistent modification of the voice functions as a commentary on how digital technology mediates human experience today.",
    question: 'Based on the text, the author would be most likely to disagree with which statement about vocal manipulation in hyperpop?',
    options: [
      'It is an aesthetic feature that has little or no social importance.',
      "It confirms hyperpop's ability to offset certain negative effects of digital technology.",
      "It is a symbol of the influence that hyperpop exerts on listeners' sense of self.",
      'It represents changes to human experience brought about by technology.',
    ],
    answer: 0,
    explanation:
      '作者明确说声音修改变造不是"arbitrary stylistic choice"，而是"functions as a commentary on how digital technology mediates human experience today"（对数字技术如何中介人类体验的评论）。这说明作者认为它具有社会意义，因此最不同意 A 选项"仅仅是一种没有社会重要性的美学特征"。',
  },
  {
    id: 205,
    passage:
      "A number of artists associated with hyperpop, a movement in electronic music that emerged in the 2010s, aggressively manipulate their recorded voice. The singer Dorian Electra, for example, shifts the pitch of their vocals to be much deeper than that of Electra's natural range. And even the hyperpop artists who don't rely on pitch-shifting, such as Rina Sawayama, often distort their vocals using digital tools. By persistently modifying the voice, hyperpop invites the listener to reflect on the extent to which digital technology mediates the human experience today.",
    question: 'Which description of vocal manipulation in hyperpop is best supported by the text?',
    options: [
      "It serves as an example of digital technology's negative influence on daily life.",
      'It represents the continuity of human experience despite social and historical change.',
      'It functions as a commentary on contemporary social conditions.',
      "It symbolizes the power of contemporary music to influence listeners' sense of self.",
    ],
    answer: 2,
    explanation:
      '文章最后一句指出 hyperpop 的声音修改"invites the listener to reflect on the extent to which digital technology mediates the human experience today"（邀请听众反思数字技术在多大程度上中介了当今的人类体验）。这是一种对当代社会状况的评论。C 选项最准确。A 的"negative influence"文中未提及；B 的"continuity"与文中强调的变化相反；D 缩小了范围（不仅是"sense of self"）。',
  },
  {
    id: 206,
    passage:
      "The following text is adapted from Daniel Defoe's 1704 nonfiction book The Storm.\n\nThe sermon is a sound of words spoken to the ear, and prepared only for present meditation and extends no farther than the strength of memory can convey it; a book printed is a record, remaining in every man's possession, always ready to renew its acquaintance with his memory, and always ready to be produced as an authority or voucher to any reports he makes out of it, and conveys its contents for ages to come, to the eternity of mortal time, when the author is forgotten in his grave.",
    question: 'Which choice best states the main idea of the text?',
    options: [
      'People are less likely to forget a message when they hear it spoken aloud than they are when they read it in print.',
      'Unless a spoken message is delivered by a confident orator, it may be ignored.',
      'Most authors have little hope of being remembered well past their lifetimes.',
      'Words committed to print have a greater permanence than messages that are merely spoken aloud.',
    ],
    answer: 3,
    explanation:
      '文章核心对比：讲道（spoken）受限于记忆的强度，无法传之久远；而印刷的书（printed）是永久的记录，可以流传到"the eternity of mortal time"（凡人时间的永恒），即使作者已被遗忘。D 准确概括了印刷文字比口头语言更具持久性这一主旨。A 与文意相反；B 无根据；C 只是结尾的一个细节，不是主旨。',
  },
  {
    id: 207,
    passage:
      "In what is now Minnesota, the Shakopee Mdewakanton Sioux Community operates the Hoéokata Ti, a cultural center. Relying on traditional knowledge to guide the design of exhibits, this institution presents Dakota history and culture to the tribe's citizens. The Turtle Mountain Band of Chippewa, a tribe in North Dakota, employs a similar strategy in its own cultural center. Both centers contrast with museums that aren't Indigenous-led; when displaying Indigenous artifacts, such museums tend to anticipate mainly non-Indigenous audiences and rely on Euro-centric strategies for designing exhibits.",
    question: 'The text best supports which conclusion about the cultural center operated by the Turtle Mountain Band of Chippewa?',
    options: [
      'Its exhibits are likely intended to reconcile Indigenous perspectives with Euro-centric perspectives.',
      'Its exhibits likely rely on the traditional knowledge of multiple tribes.',
      'Its ability to present history and culture to tribal citizens is limited by its physical size.',
      'Its exhibits are likely designed for the benefit of audiences consisting mainly of tribal citizens.',
    ],
    answer: 3,
    explanation:
      '文章指出 Shakopee 文化中心"presents Dakota history and culture to the tribe\'s citizens"，而 Turtle Mountain 采用了"a similar strategy"。对比之下，非原住民主导的博物馆则"anticipate mainly non-Indigenous audiences"。因此可以推断 Turtle Mountain 的展览面向的主要是部落公民。D 选项正确。',
  },
  {
    id: 208,
    passage:
      "The following text is adapted from Lady Gregory's 1904 play Spreading the News. Jack Smith and Bartley Fallon have encountered each other at the local fair.\n\nJACK: It isn't to the fair I came myself, but up to the Five Acre Meadow I'm going, where I have a contract for the hay. We'll get a share of it into tramps [drying stacks] to-day.\nBARTLEY: You will not get it into tramps to-day. The rain will be down on it by evening, and on myself too. It's seldom I ever started on a journey but the rain would come down on me before I'd find any place of shelter.\nJACK: If it didn't itself, Bartley, it is my belief you would carry a leaky pail on your head in place of a hat, that way you'd not be without some cause of complaining.",
    question: 'Based on the text, what does Jack most likely believe about Bartley?',
    options: [
      'Bartley will be able to help Jack with cutting the hay.',
      "Bartley is concerned that Jack hasn't prepared for the weather.",
      'Bartley is a poor judge of the weather.',
      'Bartley will find fault with any situation.',
    ],
    answer: 3,
    explanation:
      'Jack 的讽刺性回应是关键："如果天不下雨，我相信你也会在头上顶个漏水的桶而不是帽子，这样你就不愁没东西抱怨了。"（If it didn\'t itself, Bartley, it is my belief you would carry a leaky pail on your head in place of a hat, that way you\'d not be without some cause of complaining.）这说明 Jack 认为 Bartley 天生爱抱怨，不管什么情况都能找到抱怨的理由。D 准确。',
  },
  {
    id: 209,
    passage:
      "Fernand Braudel and other historians of capitalism rarely discuss domestic capitalism in Africa before the period of European colonization, implicitly presenting capitalism as external to and imposed on Africa. John Iliffe and other Africanist scholars have shown, however, that in parts of Africa, institutionally protected private land ownership, the existence of salaried labor, and other features of capitalism predated colonization. One reason for this discrepancy is that historians of capitalism tend to focus on longitudinal economic data drawn from archival records, which do not exist for much of precolonial Africa.",
    question: 'Which statement about Iliffe and other Africanist scholars is best supported by information in the text?',
    options: [
      'They likely make use of different types of evidence than historians of capitalism typically rely on.',
      'They likely have a different view about which activities should be considered capitalist in nature than historians of capitalism do.',
      'They likely differ from historians of capitalism in the methods they use to derive longitudinal economic data from archival records.',
      'They likely view capitalism as having been more beneficial for Africa than historians of capitalism do.',
    ],
    answer: 0,
    explanation:
      '文章指出差异的原因是：资本主义史学家依赖档案记录中的纵向经济数据，而这些数据在前殖民时期的非洲大部分不存在。因此，Africanist scholars 必然使用了不同类型的证据（如土地所有权制度、雇佣劳动等制度性证据）来论证他们的观点。A 正确。C 的问题在于 Africanist scholars 根本不是从档案记录中推导纵向经济数据的——他们用的是完全不同的证据类型。',
  },
]

// ── 主旨与细节题 Level 3（试试就逝世）──
const zhuzhi_level3: ReadingQuestion[] = [
  {
    id: 301,
    passage:
      "The following text is Emily Dickinson's circa 1873 poem \"There is no Frigate like a Book.\" A Frigate is a light fast ship; coursers are swift horses.\n\nThere is no Frigate like a Book\nTo take us Lands away\nNor any Coursers like a Page\nOf prancing Poetry—\nThis Traverse may the poorest take\nWithout oppress of Toll—\nHow frugal is the Chariot\nThat bears the Human soul.",
    question: 'Which choice best states the main idea of the text?',
    options: [
      'Reading gives people a reprieve from the financial focus of modern life.',
      'Poetry can forge connections between people from different cultures.',
      'People can learn more about distant places by reading books than by traveling to those places.',
      'Literature can metaphorically transport people to new places regardless of their means.',
    ],
    answer: 3,
    explanation:
      'Dickinson 使用了一系列交通工具的比喻（Frigate 军舰、Coursers 骏马、Chariot 战车）来对比书籍：书籍是最快的船、最好的马、最节俭的战车。"the poorest take / Without oppress of Toll"强调穷人也能免票乘坐。核心主旨：文学可以比喻性地带人远行，不分贫富。D 精准概括。C 过于字面化——Dickinson 强调的是 metaphorical transport，并非真的在比较读书和旅行的学习效果。',
  },
  {
    id: 302,
    passage:
      "The Federalist Papers are a collection of essays written by Alexander Hamilton, John Jay, and James Madison and published pseudonymously in the New York Packet and other New York newspapers in 1787-88. Though the authorship of most of the essays is certain, that of some is obscure: for instance, while No. 15, \"The Insufficiency of the Present Confederation to Preserve the Union,\" was surely penned by Hamilton, No. 62, \"The Senate,\" may have been written by either Hamilton or Madison. The difficulty of determining No. 62's author arises not from a lack of evidence but from too much contradictory evidence.",
    question: 'Based on the text, which choice best explains why it is challenging to confidently assign authorship of the essay "The Senate"?',
    options: [
      'Support can be found for a strong case that either Hamilton or Madison was the sole author of "The Senate."',
      'The evidence that would indisputably prove that either Hamilton or Madison was the sole author of "The Senate" has been lost.',
      'Evidence shows that two versions of "The Senate," one authored by Hamilton and another authored by Madison, appeared in different New York newspapers.',
      'It is most likely that "The Senate" was the product of a collaborative effort between Hamilton and Madison.',
    ],
    answer: 0,
    explanation:
      '文章最后一句是关键："The difficulty...arises not from a lack of evidence but from too much contradictory evidence."说明既有支持 Hamilton 的证据，也有支持 Madison 的证据——两者都有力，所以难以定论。A 正确。B 说证据"已丢失"与原文相反（不是缺少证据，而是证据太多且矛盾）；D 的"合作作品"只是推测。',
  },
  {
    id: 303,
    passage:
      'Shanlin Liu and colleagues relied on historical DNA (hDNA)—genomic data incidentally preserved in specimens housed in natural history collections—to investigate the evolutionary history of the rhinoceros family (Rhinocerotidae). Although this approach offers unique benefits, such as the ability to ascertain the biogeographical origins of organisms, it remains a relatively underutilized resource because hDNA is often to some extent degraded, a situation not easily remediable under current methodological paradigm and with extant DNA extraction and analysis technologies.',
    question: 'Information in the text best supports which statement about hDNA?',
    options: [
      'It may be underused because of its controversial status among scientists.',
      'It tends to be much more degraded than other types of DNA of comparable age.',
      'It may yield insights that other types of genomic data cannot.',
      'It has thus far proved valuable mainly to researchers studying mammals.',
    ],
    answer: 2,
    explanation:
      '文章提到 hDNA 提供"unique benefits, such as the ability to ascertain the biogeographical origins of organisms"（独特优势，如确定生物地理起源）。这说明 hDNA 能产生其他基因组数据无法提供的洞见。C 正确。A 的"controversial status"无根据（少用是因为技术限制，不是争议）；B 的比较级"much more degraded than other types"文中未做此比较。',
  },
  {
    id: 304,
    passage:
      "Meredith E. Protas and colleagues have explored how convergent evolution—a phenomenon that occurs when the same trait evolves independently in two reproductively separate lineages—can result from a genetic mechanism shared by both lineages. Meanwhile, Cynthia C. Steiner and colleagues have investigated how convergence occurs through different genetic mechanisms, but the relative prevalence of convergence through shared and different genetic processes is still poorly understood. This motivated biologists Delbert A. Green II and Cassandra G. Extavour to evaluate both types of convergence in a single study for their 2012 paper.",
    question: 'Which choice best states the main idea of the text?',
    options: [
      "Before Green and Extavour's study, convergent evolution was assumed to require a shared genetic mechanism between two lineages that share the trait.",
      "Both the study by Protas and colleagues and that by Green and Extavour compare convergence through shared genetic mechanisms to convergence through different genetic mechanisms.",
      "Green and Extavour's study addresses convergent evolution more comprehensively than the studies by Protas and colleagues and Steiner and colleagues do.",
      "Green and Extavour's study was conducted using data from the studies by Protas and colleagues and Steiner and colleagues.",
    ],
    answer: 2,
    explanation:
      '文章逻辑：Protas 研究了 shared mechanism（共享机制），Steiner 研究了 different mechanisms（不同机制），但"the relative prevalence...is still poorly understood"（哪种更普遍仍不清楚）。于是 Green 和 Extavour 在一项研究中同时评估两种类型。这说明他们的研究比前人的单一维度研究更全面。C 准确。',
  },
  {
    id: 305,
    passage:
      "The following text is from Nathaniel Hawthorne's 1830 short story \"Sir William Phips.\"\n\nFew of the personages of past times (except such as have gained renown in fireside legends as well as in written history) are anything but mere names to their successors. They seldom stand up in our imaginations like men. The knowledge, communicated by the historian and biographer, is analogous to that which we acquire of a country by the map—minute, perhaps, and accurate, and available for all necessary purposes, but cold and naked, and wholly destitute of the mimic charm produced by landscape painting.",
    question: 'Which choice best states the main idea of the text?',
    options: [
      'Historians and biographers should write about little-known people as well as famous people.',
      'Paintings may be more beautiful than maps, but maps are more useful than paintings.',
      'The lives of historical figures are usually documented as a collection of facts, rather than as a representation of their personalities.',
      'Historians should record fictional stories told about famous figures as well as stories that are strictly truthful.',
    ],
    answer: 2,
    explanation:
      'Hawthorne 将历史学家的知识比作地图："minute, perhaps, and accurate...but cold and naked"——细节精确但冰冷裸露，缺乏风景画的"mimic charm"。同理，历史人物被记录为"mere names"，不能像真人一样"stand up in our imaginations"。主旨：历史记录只是事实的堆砌，缺少对人物个性的生动呈现。C 精准。',
  },
  {
    id: 306,
    passage:
      "The following text is from Anthony Trollope's 1855 novel The Warden. The narrator is describing a rectory, the residence of a clergyperson.\n\nThere was an air of heaviness about the rooms which might have been avoided without any sacrifice of propriety; colours might have been better chosen and lights more perfectly diffused; but perhaps in doing so the thorough clerical aspect of the whole might have been somewhat marred: at any rate, it was not without ample consideration that those thick, dark, costly carpets were put down; those embossed, but sombre [wallpapers] hung up; those heavy curtains draped so as to half exclude the light of the sun.",
    question: 'What does the text most strongly suggest about the rooms in the rectory?',
    options: [
      'They are meant to feel comfortable but are in reality uninviting.',
      'They have been furnished with the intention of maintaining a sense of appropriateness.',
      'They are decorated in a style that strikes the narrator as too extravagant.',
      'They have many decorations the narrator finds good looking, but they are not particularly practical.',
    ],
    answer: 1,
    explanation:
      '关键句："perhaps in doing so the thorough clerical aspect of the whole might have been somewhat marred"（但如果那样做，整体的彻底"神职人员风格"就会被破坏）。这说明房间的装修——厚重、暗沉、昂贵——是为了维持一种"得体的神职人员气质"（propriety / clerical aspect），而不是为了舒适或美观。B 准确。A 的"meant to feel comfortable"与原文相反（故意选择沉重暗沉的风格）；C 的"extravagant"虽然提到 costly，但不是叙述者批评的重点。',
  },
  {
    id: 307,
    passage:
      'Why do some people with high incomes vote for politicians supporting higher taxes on those with high incomes like themselves? Economists Benjamin Enke et al. propose that values are a luxury good: that is, the higher one\'s income, the more weight one has the liberty to assign to one\'s values when voting. Thus, Enke et al. suggest that although the behavior of high-income earners who advocate for higher taxes may seem counterintuitive, such people likely do so because they feel enabled by their economic security to take a stance they think is morally correct.',
    question: 'Which choice best states the main idea of the text?',
    options: [
      'A group of economists asserts that people with relatively high incomes are consequently enabled to take certain considerations into account when voting.',
      'According to a group of economists, politicians who support higher taxes on those with high incomes must convince a sufficient number of people with such incomes to vote against their material interest if the politicians are to be elected.',
      'A team of economists finds that people who vote for higher taxes on those with high incomes are likely to think their moral values coincide with their material interests.',
      "According to a team of economists, the higher a voter's income, the more likely that voter's values are to conflict with their material interests.",
    ],
    answer: 0,
    explanation:
      '文章核心论点："values are a luxury good"——收入越高，越有余裕在投票时考虑价值观而非物质利益。高收入者支持加税看似违背物质利益，实则是经济安全感让他们能按道德信念投票。A 准确概括："高收入使人有能力在投票时考虑其他因素"。D 将"价值观与物质利益的冲突"表述为收入越高越可能发生，但文章说的是高收入使人更自由地按价值观投票（不一定是冲突）。',
  },
]

// ── 冲刺班 · 主旨题 Level 1 ──
const chongci_zhuzhi_level1: ReadingQuestion[] = [
  {
    id: 1,
    passage:
      'Postcranial skeletal pneumaticity (PSP), a system of skeletal air sacs, occurred in three Cretaceous clades, including pterosaurs (e.g., Pteranodon); past studies have hypothesized that the trait was homologous (originating from a shared ancestor). With this in mind, Tito Aureliano et al. examined fossils of common ancestors of the clades using microtomography, finding openings in bones—a possible indicator of PSP—but of sizes inconsistent with PSP. The team reported other findings contradicting the homology hypothesis as well, concluding that PSP likely evolved independently in each clade.',
    question: 'Which choice best states the main idea of the text?',
    options: [
      'Aureliano et al. found openings in bones in fossils of common ancestors of pterosaurs and two other Cretaceous clades, but the team determined that the sizes of the openings were too varied to be indicative of PSP, thereby weakening the homology hypothesis.',
      'Although past studies by paleontologists concluded that PSP in pterosaurs and two other Cretaceous clades was likely attributable to a common ancestor, those paleontologists lacked access to technology that led Aureliano et al. to reach a different conclusion.',
      'Previous studies hypothesized that PSP originated in a shared ancestor of pterosaurs and two other clades, but the findings of Aureliano et al. suggest that PSP evolved independently in pterosaurs and was subsequently inherited by the other two clades.',
      'Aureliano et al. found that pterosaurs and two other Cretaceous clades with PSP likely lacked a common ancestor with the trait, leading the team to posit a different evolutionary origin for PSP than that posited in earlier studies.',
    ],
    answer: 3,
    explanation:
      '文章结论：PSP 在各 clade 中独立进化（evolved independently in each clade）。D 选项准确概括：Aureliano 团队认为这些 clades 没有共同祖先携带 PSP，提出了与早期研究不同的进化起源。C 选项错误——文章说"independently in EACH clade"而非 pterosaurs 先有再传给其他。',
  },
  {
    id: 2,
    passage:
      'Studies of ocean wave breaking have predominantly focused on traveling waves (those propagating along the horizontal plane), so Mark McAllister et al. utilized a circular wave tank to produce and study spike waves, axisymmetric standing waves that can erupt vertically when traveling waves propagating in opposing directions intersect. Traveling waves break when wave steepness (height-to-length ratio) passes a critical threshold; breaking thus constrains wave height. McAllister et al. found that spike waves can exceed that constraint, as other factors than just steepness (e.g. jet stability and cavity shape) mediate spike-wave breaking.',
    question: 'Which choice best states the main idea of the text?',
    options: [
      'McAllister et al. suggest that spike waves can form when traveling waves propagating in opposing directions intersect and that spike waves tend to be higher than traveling waves.',
      'The process of breaking limits the height of traveling waves, but the study by McAllister et al. suggests that spike waves can exceed those limits if their height-to-length ratio reaches a critical threshold.',
      'The study by McAllister et al. suggests that when traveling waves intersect in specific ways, the resulting wave may be higher than would be expected based on the properties of traveling waves.',
      'Previous studies have suggested that steepness mediates breaking in traveling waves, but the study by McAllister et al. shows that jet stability and cavity shape may also influence breaking in such waves.',
    ],
    answer: 2,
    explanation:
      '研究核心发现：spike waves 可以突破 traveling waves 的高度限制，因为 spike wave breaking 由 steepness 以外的因素（jet stability, cavity shape）决定。C 选项准确概括："相交产生的波可能比 traveling waves 属性所预期的更高"。B 选项错误——spike waves 不需要达到 critical threshold 就能突破限制。D 选项将发现错误归结为 traveling waves 的 breaking 机制。',
  },
  {
    id: 3,
    passage:
      "Mauricio Drelichman and Hans-Joachim Voth's research into the debt defaults of Philip II (who ruled an empire including Spain and much of Belgium from 1556 to 1598) relates to other work on European early modern state finance, including Hoffman and Norberg's research on the relationship between state finance and political development. But Drelichman and Voth's unique contribution to the field is their reconstruction of the earliest extant set of annual fiscal records for any sovereign state, demonstrating in turn that Philip's defaults were caused by short-term cash shortages, not long-term unsustainable debts.",
    question: 'Which choice best states the main idea of the text?',
    options: [
      'Analysis of the earliest available records of a sovereign state\'s finances can be found not in the work of Hoffman and Norberg but in that of Drelichman and Voth.',
      'Drelichman and Voth advanced the field of research on European early modern state finance by assembling a novel collection of evidence that gave them insight into Philip II\'s debt defaults.',
      'The research by Drelichman and Voth suggests that the logistics of ruling both Spain and much of Belgium led to short-term problems with cash that forced Philip II to default on his debts.',
      "Drelichman and Voth's research on Philip II's debt defaults builds on earlier work by Hoffman and Norberg, adding nuance to the earlier work's findings.",
    ],
    answer: 1,
    explanation:
      '文章重点："But Drelichman and Voth\'s unique contribution..."——他们的独特贡献是重建了最早的年度财政记录，从而证明 Philip 的违约是短期现金流问题而非长期不可持续债务。B 选项准确概括了这个贡献。A 选项过于狭隘（只说记录在哪），C 选项只关注具体发现而忽略了方法论贡献，D 选项弱化了他们工作的独创性。',
  },
  {
    id: 4,
    passage:
      "The following text is adapted from Mark Twain's 1876 novel The Adventures of Tom Sawyer. Aunt Polly is having dinner with Tom, her mischievous young nephew.\n\nAunt Polly asked Tom questions that were full of guile, and very deep—for she wanted to trap him into damaging revealments. Like many other simple-hearted souls, it was her pet vanity to believe she was endowed with a talent for dark and mysterious diplomacy, and she loved to contemplate her most transparent devices as marvels of low cunning.",
    question: 'Which choice best describes how Aunt Polly is presented in the text?',
    options: [
      "The narrator gently makes fun of Aunt Polly's mistaken confidence in her subtlety.",
      "The narrator humorously exaggerates Aunt Polly's view of herself as an intellectual.",
      'The narrator characterizes Aunt Polly as being excessively nosy about other people\'s private lives.',
      "The narrator emphasizes that Aunt Polly's intentions are good even when she behaves impolitely.",
    ],
    answer: 0,
    explanation:
      '叙述者用 ironic tone 描写 Polly 姨妈：她把"最透明的伎俩"（most transparent devices）当成"高深谋略的杰作"（marvels of low cunning），这是 gentle mockery。A 选项准确：叙述者温和地取笑了 Aunt Polly 对自己精明的错误自信。"simple-hearted souls"和"pet vanity"体现了 gentle 而非 harsh 的嘲讽。',
  },
  {
    id: 5,
    passage:
      "Eighteenth-century economist Adam Smith is famed for his metaphor of the invisible hand, which he putatively used to illustrate a robust model of how individuals produce aggregate benefits by pursuing their own economic interests. Note 'putatively': as Gavin Kennedy has shown, Smith deploys this metaphor only once in his economic writings—to make a narrow point about the then-dominant economic theory of mercantilism—and it was largely ignored until some twentieth-century economists eager to secure an intellectual pedigree for their views elevated it to a fully-fledged paradigm.",
    question: 'Which choice best states the main idea of the text?',
    options: [
      "The reputation of Smith's metaphor of the invisible hand is not due to the importance of the metaphor in Smith's work but rather to the promotion of the metaphor by some later economists for their own ends.",
      "Smith's metaphor of the invisible hand has been interpreted as a model of how individuals acting in their own interest produce aggregate benefits, but it was intended as a subtle critique of the economic theory of mercantilism.",
      "Some twentieth-century economists gave Smith's metaphor of the invisible hand a significance it does not have in Smith's work, but it is nevertheless a useful model of how individuals produce aggregate benefits by pursuing their own economic interests.",
      "Although Smith is famed for his metaphor of the invisible hand, the metaphor was largely ignored until economists in the twentieth century came to realize that the metaphor was a robust model that anticipated their own views.",
    ],
    answer: 0,
    explanation:
      '文章论点：invisible hand 的盛名并非来自 Smith 本人的重视——他只在一处用过，且只针对 mercantilism——而是 20 世纪经济学家为了给自己的观点找学术谱系而把它捧上神坛。A 选项精准概括："reputation...not due to importance in Smith\'s work but to promotion by later economists for their own ends"。C 选项后半句说"still a useful model"与文章批评立场矛盾。',
  },
  {
    id: 6,
    passage:
      "Why do some people with high incomes vote for politicians supporting higher taxes on those with high incomes like themselves? Economists Benjamin Enke et al. propose that values are a luxury good: that is, the higher one's income, the more weight one has the liberty to assign to one's values when voting. Thus, Enke et al. suggest that although the behavior of high-income earners who advocate for higher taxes may seem counterintuitive, such people likely do so because they feel enabled by their economic security to take a stance they think is morally correct.",
    question: 'Which choice best states the main idea of the text?',
    options: [
      'A group of economists asserts that people with relatively high incomes are consequently enabled to take certain considerations into account when voting.',
      'According to a group of economists, politicians who support higher taxes on those with high incomes must convince a sufficient number of people with such incomes to vote against their material interest if the politicians are to be elected.',
      'A team of economists finds that people who vote for higher taxes on those with high incomes are likely to think their moral values coincide with their material interests.',
      "According to a team of economists, the higher a voter's income, the more likely that voter's values are to conflict with their material interests.",
    ],
    answer: 0,
    explanation:
      '核心概念："values are a luxury good"——收入越高，在投票时越有余裕考虑价值观而非物质利益。A 选项准确概括："高收入使人有能力在投票时考虑其他因素"。D 选项错误地将"价值观与物质利益冲突"表述为必然结论，但文章说的是经济安全感让人能按道德信念投票，未必冲突。',
  },
  {
    id: 7,
    passage:
      "Philosophers note that many people have an intuitive sense that while we ought not to lie, there may be circumstances in which lying is permissible. If this intuition is correct and we lack an inviolable duty to speak truthfully, what grounds opposition to lying in the first place? Japa Pallikkathayil has advanced one answer by appealing to a duty to respect others' agential interests: the possession of false beliefs constrains agency, and thus we ought not to impede the formation of true beliefs unless doing so prevents a greater constraint on someone's agency or an otherwise impermissible end.",
    question: 'Which choice best states the main idea of the text?',
    options: [
      "Pallikkathayil's argument suggests that if we have a duty to respect other people's agential interests and if possession of false beliefs constrains agency, then we have an inviolable duty to speak truthfully.",
      "Pallikkathayil's argument shows that if our intuition that circumstances may make lying permissible is correct, then it is unclear whether there are any grounds for an opposition to lying in the first place.",
      "One potential means of justifying opposition to lying is Pallikkathayil's argument that we have an obligation to respect other people's agency that entails a commitment to truthfulness except in certain circumstances.",
      "Many people have an intuitive sense that lying is permissible in some circumstances but lack a principled way to identify those circumstances, and Pallikkathayil's argument may provide a means of resolving that problem.",
    ],
    answer: 2,
    explanation:
      '文章结构：提出问题（如果撒谎有时是允许的，反对撒谎的理据是什么？）→ Pallikkathayil 的回答（尊重他人的 agential interests → 不应阻碍真实信念的形成，除非阻止更大的 agency 限制）。核心是一种"允许例外"的反对撒谎的理由。C 选项准确概括："opposition to lying...except in certain circumstances"。A 选项错误地把有限制的义务说成"inviolable"。',
  },
  {
    id: 8,
    passage:
      "Within higher education, studying philosophy requires that students be conversant with the field's foundational texts and historical figures. By contrast, doing philosophy within or beyond the academy demands the creative, self-directed application of acquired expertise to enduring questions about the nature of existence and knowledge. While both approaches engage with influential figures, those who do philosophy treat such figures as vital interlocutors who facilitate new insights rather than as ossified authorities who, though relevant to the present, primarily represent the discipline's past.",
    question: 'Based on the text, which choice best describes the relationship between doing philosophy and studying philosophy?',
    options: [
      'Doing philosophy involves developing novel ideas through imagined dialogue with past philosophers based on knowledge of those philosophers\' views acquired by studying philosophy.',
      'Doing philosophy helps students formulate concrete solutions to practical issues, whereas studying philosophy prioritizes engagement with historical arguments in the field.',
      'Doing philosophy represents a departure from the norms that govern scholarly inquiry, whereas studying philosophy requires conformation to these norms.',
      'Doing philosophy requires students to challenge the ideas articulated by past philosophers, especially when these ideas are broadly accepted by other people studying philosophy.',
    ],
    answer: 0,
    explanation:
      '文章关键对比：studying philosophy = 熟悉经典文本和历史人物；doing philosophy = 在知识基础上创造性地应用，把历史人物当作"vital interlocutors who facilitate new insights"。A 准确描述了这个关系：doing philosophy 是通过与过去哲学家的"想象对话"发展新见解，而这种对话的基础（knowledge of those philosophers\' views）来自 studying philosophy。',
  },
  {
    id: 9,
    passage:
      "The following text is from Mary Shelley's 1818 novel Frankenstein. Victor Frankenstein, who narrates this portion of text, describes the state of scientific knowledge as he began his own study of the natural world.\n\nThe untaught peasant beheld the elements around him and was acquainted with their practical uses. The most learned philosopher knew little more. He had partially unveiled the face of Nature, but her immortal lineaments were still a wonder and a mystery. He might dissect, anatomize, and give names; but, not to speak of a final cause, causes in their secondary and tertiary grades were utterly unknown to him. I had gazed upon the fortifications and impediments that seemed to keep human beings from entering the citadel of nature, and rashly and ignorantly I had repined.",
    question: 'Which choice best describes the main idea of the text?',
    options: [
      'Victor became disappointed in science when he realized that the practical knowledge laypeople have of nature is often deeper than the scientific understanding.',
      'Victor was impressed by the layperson\'s practical understanding of nature but thought science provided a clearer understanding.',
      'Victor was immediately impressed by the advantages of the scientific approach to understanding natural phenomena.',
      'Victor thinks that conventional scientific approaches to understanding natural phenomena will not yield the answers he seeks.',
    ],
    answer: 3,
    explanation:
      'Victor 的观点：最博学的哲学家也只揭开了自然的面纱一角，深层原因（secondary and tertiary causes）完全未知。他将科学比作"堡垒"，感到自己"rashly and ignorantly"在抱怨。D 选项准确：他认为传统科学方法无法给出他寻求的答案。A 选项错在说 laypeople 的知识比科学更深——文本说两者都 similarly limited。',
  },
  {
    id: 10,
    passage:
      "In their meta-analysis of research on advergames (videogames developed to promote products or services), Zeph M.C. van Berlo et al. confirm that such games, though they can elicit player interest, may not facilitate subsequent recall of product and brand information. This phenomenon can be explained by the finite nature of cognitive capacity as it is articulated in Annie Lang's limited capacity model of motivated mediated message processing. In this case, players' cognitive resources are directed foremost toward the advergame's mechanics, leaving little or no capacity for encoding and storing the information the advertiser intends to be salient.",
    question: 'Which choice best states the main idea of the text?',
    options: [
      'The limited capacity model of motivated mediated message processing developed by Lang provides a means of explaining the finding by van Berlo et al. that players may not readily recollect the brand and product information embedded in advergames.',
      'The meta-analysis by van Berlo et al. reveals that higher engagement in advergame mechanics is linked to lower effectiveness in persuading players to purchase particular brands and products.',
      'Although the limited capacity model of motivated mediated message processing developed by Lang suggests otherwise, advergames can succeed as marketing tools, provided that they achieve a balance between game mechanics and the promotion of a brand or product.',
      'Research by van Berlo et al. corroborates Lang\'s conclusion that because people predominantly focus on game mechanics when playing video games, it is difficult for advergames to communicate brand and product information in ways that are highly memorable.',
    ],
    answer: 0,
    explanation:
      '文章结构：van Berlo 的 meta-analysis 发现 advergames 不利于品牌回忆 → 这个现象可以用 Lang 的 limited capacity model 解释 → 玩家认知资源被游戏机制耗尽，无法编码广告信息。A 选项准确概括了这个"发现+理论解释"的逻辑。D 选项将关系说成"corroborate Lang\'s conclusion"，但 Lang 的模型是被用来解释 van Berlo 的发现，而非 van Berlo 验证了 Lang 的结论。',
  },
  {
    id: 11,
    passage:
      "The following text is adapted from William Shakespeare's 1597 play The Tragedy of King Richard III. Richard is reflecting on the recent arrest of his brother, the Duke of Clarence, on suspicion of treason against King Edward IV. Derby, Hastings, Buckingham, Rivers, Dorset, and Grey are also members of the English nobility.\n\nRICHARD: I do the wrong, and first begin to brawl. / The secret mischiefs that I set flowing / I lay unto the grievous charge of others. / Clarence, whom I indeed have cast in darkness, / I do beweep to many simple [gullible people], / Namely, to Derby, Hastings, Buckingham; / And tell them 'tis the Queen and her allies / That stir the King against the Duke my brother. / Now they believe it, and withal whet me / To be revenged on Rivers, Dorset, Grey.",
    question: 'Which choice best describes what happens in the text?',
    options: [
      'Richard attributes Clarence\'s troubles to both his own secret plotting and the distrust of Clarence that the queen and her allies Derby, Hastings, and Buckingham have planted in the king\'s mind.',
      'Richard describes having wept as he informed Derby, Hastings, and Buckingham that the queen and her allies convinced the king to act against Clarence, and says that the earnestness of his grief caused them to accept his version of events.',
      'Richard acknowledges that his mischievous nature has spurred him to commit misdeeds in the past, including instigating enmity between the king and Clarence, but he reports that he has hitherto not lost the trust of the queen and her allies.',
      'Richard indicates that he has pretended to be aggrieved about Clarence\'s arrest while secretly having orchestrated it himself, and that his listeners have accepted his version of events and encouraged him to seek revenge.',
    ],
    answer: 1,
    explanation:
      'Richard 在独白中坦白：是他自己把 Clarence 送进了监狱（"I indeed have cast in darkness"），但他假装悲伤（"do beweep"），告诉 Derby 等人是皇后和她的同盟在挑拨离间。他们相信了，并鼓励 Richard 去报复。B 选项准确描述了 Richard 的表层行为（哭着告诉别人是皇后害了 Clarence）。注意：Richard 的真实动机是隐藏的，问题问的是"what happens"（文本中发生了什么），而非深层的心理分析。',
  },
  {
    id: 12,
    passage:
      'The following text is from George Eliot\'s 1857 short story "The Sad Fortunes of the Rev. Amos Barton." The Countess Czerlaski is a newcomer to the town of Milby.\n\nIt is true, the Countess was a little vain, a little ambitious, a little selfish, a little shallow and frivolous, a little given to white lies,—But who considers such slight blemishes, such moral pimples as these, disqualifications for entering into the most respectable society! Indeed, the severest ladies in Milby would have been perfectly aware that these characteristics would have created no wide distinction between the Countess Czerlaski and themselves; and since it was clear there was a wide distinction—why, it must lie in the possession of some vices from which they were undeniably free.',
    question: 'Which choice best states the main idea of the text?',
    options: [
      'The residents of Milby had initially viewed the Countess Czerlaski with suspicion, but they have gradually come to see her as mostly harmless.',
      'Although the Countess Czerlaski actively cultivates a sense of mystery about her, her background is less interesting than what many residents of Milby have been led to believe.',
      'Although the residents of Milby are generally thought to be hospitable, the Countess Czerlaski has committed many social blunders that have caused her to be widely disliked.',
      'Some residents of Milby are determined to disapprove of the Countess Czerlaski, even though the reasons for their dislike are largely groundless.',
    ],
    answer: 3,
    explanation:
      '文章运用了反讽和讽刺：叙述者说 Countess 的缺点只是"moral pimples"（道德上的青春痘），而且 Milby 最严厉的女士们其实自己也有同样的缺点——既然这些缺点不能解释她们与 Countess 之间的"巨大差异"，那她们对 Countess 的反感必然是建立在其他莫须有的理由上的。D 选项准确抓住了这个讽刺核心：Milby 的居民执意不赞成 Countess，但理由站不住脚。',
  },
  {
    id: 13,
    passage:
      'The following text is from Ralph Waldo Emerson\'s 1841 essay "The Method of Nature."\n\nThe scholars are the priests of that thought which establishes the foundations of the earth. No matter what is their special work or profession, they stand for the spiritual interest of the world, and it is a common calamity if they neglect their post in a country where the material interest is so predominant as it is in America.',
    question: 'Which choice best states the main idea of the text?',
    options: [
      'Military experience encourages Americans to contemplate aspects of human life that they would not choose to otherwise.',
      'It is unfortunate that so many intellectuals are concerned with material things rather than ideas.',
      'Many descriptions of the role of scholars in society unfairly diminish their importance.',
      'In a country whose citizens are largely preoccupied with tangible gains, it is crucial that some people work to foster and preserve ideas.',
    ],
    answer: 3,
    explanation:
      'Emerson 的核心论点：学者是"思想的祭司"，代表世界的"精神利益"；在美国这样一个"物质利益"占主导地位的国家，学者如果失职将是一场灾难。D 选项精确转述了这层意思：在全民追逐物质利益的国家，必须有人致力于培养和保存思想。A 偏离主题（军事经验）；B 方向反了（学者是守护思想的人，不是沉迷物质的人）；C 与文意无关。',
  },
  {
    id: 14,
    passage:
      'Meredith E. Protas and colleagues have explored how convergent evolution—a phenomenon that occurs when the same trait evolves independently in two reproductively separate lineages—can result from a genetic mechanism shared by both lineages. Meanwhile, Cynthia C. Steiner and colleagues have investigated how convergence occurs through different genetic mechanisms, but the relative prevalence of convergence through shared and different genetic processes is still poorly understood. This motivated biologists Delbert A. Green II and Cassandra G. Extavour to evaluate both types of convergence in a single study for their 2012 paper.',
    question: 'Which choice best states the main idea of the text?',
    options: [
      'Before Green and Extavour\'s study, convergent evolution was assumed to require a shared genetic mechanism between two lineages that share the trait.',
      'Both the study by Protas and colleagues and that by Green and Extavour compare convergence through shared genetic mechanisms to convergence through different genetic mechanisms.',
      'Green and Extavour\'s study addresses convergent evolution more comprehensively than the studies by Protas and colleagues and Steiner and colleagues do.',
      'Green and Extavour\'s study was conducted using data from the studies by Protas and colleagues and Steiner and colleagues.',
    ],
    answer: 2,
    explanation:
      '文章结构清晰：Protas 研究 shared mechanism → Steiner 研究 different mechanism → 但没人知道哪种更普遍 → Green & Extavour 把两种类型放在同一篇研究里评估。C 选项准确概括：Green & Extavour 的研究比前人更全面（因为前人各看一种，他们两种一起看）。A 歪曲文意（并非"assumed to require"）；B 错误（Protas 只看 shared，并非比较两种）；D 无中生有（没说用了前人的数据）。',
  },
  {
    id: 15,
    passage:
      'While no one doubts that politicians are influenced by a variety of incentives, it is generally agreed that they seek to support policies their constituents favor—after all, they risk losing office if they do not. Direct contact with constituents via such means as public events and emails from voters is a major source of politicians\' beliefs about their constituents\' views, but it is susceptible to a selection effect. There is little reason to presume that individuals with the time, resources, and strength of feeling to directly engage with their representatives are themselves broadly representative.',
    question: 'Which choice best states the main idea of the text?',
    options: [
      'People who are likely to contact their elected representatives do not tend to be representative of politicians\' constituents generally.',
      'Direct contact with constituents shapes politicians\' beliefs about policies their constituents favor, and they try to act in accordance with those beliefs.',
      'Politicians aim to advocate for their constituents\' policy preferences, but politicians\' understanding of those preferences may be skewed.',
      'Although politicians have an incentive to act in accordance with their constituents\' views, that is not the only incentive.',
    ],
    answer: 2,
    explanation:
      '文章逻辑：政治家有动机支持选民偏好的政策（否则会丢官）→ 他们通过直接接触了解选民观点 → 但直接接触存在"selection effect"（选择偏差）→ 愿意花时间联系政治家的那批人并不代表全体选民。C 选项完整概括了这个两段式逻辑：政治家想代表选民，但他们对选民偏好的理解可能被扭曲。A 只说了选择偏差本身，没提对政治家的影响；B 完全漏掉了选择偏差这个核心缺陷；D 偏离主题（文章说的是信息偏差，不是多种激励）。',
  },
]

// ============================================================
//  难题集 FSP 拆分的子题型（空数组，待后续添加题目）
// ============================================================
const fsp_huaxian_level1: ReadingQuestion[] = [
  {
    id: 4001,
    passage: "The following text is from William Shakespeare's circa 1611 play The Winter's Tale. Camillo has been away from his home in Sicily and serves in the court of Polixenes, the king of Bohemia. He has asked Polixenes for permission to return to Sicily.\n\nPOLIXENES: I pray thee, good Camillo, be no more importunate. 'Tis a sickness denying thee anything, a death to grant this.\nCAMILLO: It is fifteen years since I saw my country. Though I have for the most part been aired abroad, I desire to lay my bones there. Besides, the penitent king, my master, hath sent for me, <u>to whose feeling sorrows I might be some allay—or I o'erween [presume] to think so</u>—which is another spur to my departure.",
    question: 'Which choice best describes the function of the underlined portion in the text as a whole?',
    options: [
      'It bolsters the idea that Camillo\'s primary motivation to return home is his concern for the king of Sicily\'s well-being in his absence.',
      'It suggests that Camillo feels compelled to persuade Polixenes that Camillo\'s decision to leave the court is justified.',
      'It establishes Camillo\'s hope that Polixenes will be comforted knowing that Camillo isn\'t departing at his own discretion.',
      'It conveys Camillo\'s recognition that one benefit his presence may afford the king of Sicily is merely speculative.',
    ],
    answer: 3,
    explanation: 'Camillo says he "might be some allay" to the king\'s sorrows but adds "or I o\'erween to think so," acknowledging this belief may be presumptuous/speculative.',
  },
  {
    id: 4002,
    passage: 'The following text is from William Carlos Williams\'s 1925 creative nonfiction book In the American Grain. Williams is discussing how works by nineteenth-century US poet and fiction writer Edgar Allan Poe were received by American readers.\n\nPoe must suffer by his originality. Invent that which is new, even if it be made of <u>pine from your own yard</u>, and there\'s none to know what you have done. It is because there\'s no name. This is the cause of Poe\'s lack of recognition. He was American. He was the astounding, inconceivable growth of his locality.',
    question: 'As used in the text, what does the underlined figurative phrase most nearly mean?',
    options: [
      'Personal experiences that are hard for others to comprehend',
      'Ideas you have never previously expressed',
      'Elements of the culture in which you live',
      'Inspiration you received while reading independently',
    ],
    answer: 2,
    explanation: '"Pine from your own yard" figuratively refers to materials drawn from one\'s own cultural environment/local context. Poe was American and his originality came from his "locality."',
  },
  {
    id: 4003,
    passage: 'The scenario of a dwarf mongoose engaging in territorial conflict with an outgroup dwarf mongoose illustrates a major dimension of social life across animal species, from the solitary to those with complex sociality: <u>intraspecific contact with perceived outsiders</u>. Though one prominent hypothesis posits that sophisticated cognitive adaptations are primarily driven by the demands of various behaviors within established social groups (e.g., cooperative response to predation), interactions with same-species outsiders arguably contribute comparably by favoring nuanced analysis (e.g., evaluation of relative physical status).',
    question: 'Which choice best describes the function of the underlined portion in the text as a whole?',
    options: [
      'It establishes that perceiving an individual of the same species as an outsider exemplifies the kind of analysis mentioned later in the text.',
      'It identifies a particular type of social interaction whose relevance to higher cognition in animals is the overall focus of the text.',
      'It narrows the text\'s focus from the full complement of social life dimensions across species to one applicable to only a subset of species.',
      'It presents a specific example that illustrates a broader phenomenon that the text goes on to discuss in more abstract terms.',
    ],
    answer: 3,
    explanation: 'The dwarf mongoose example is a specific illustration of "intraspecific contact with perceived outsiders," a broad phenomenon the text then discusses.',
  },
  {
    id: 4004,
    passage: 'Most Native languages belong to language families, or groups of languages whose structural and lexical correspondence likely derives from their descent from a single language spoken long ago. A minority—such as Washoe, which is spoken in California and Nevada, and Chitimacha, which is spoken in Louisiana—are isolates, having no demonstrable genealogical relationship to other languages. <u>Yet Washoe and Chitimacha, like all isolates, are potentially remnants of families whose other members vanished before the historical record could attest to them, perhaps through the geographical expansion of extant families.</u>',
    question: 'Which choice best describes the function of the underlined sentence in the text as a whole?',
    options: [
      'It implies that a nonisolate language may have influenced both Washoe and Chitimacha to such a degree that their relationship to their former families is no longer discernible.',
      'It suggests that the ancestral languages of both Washoe and Chitimacha were likely isolates that replaced nonisolate languages through geographic expansion in the distant past.',
      'It asserts that the historical record tends to overrepresent nonisolate languages relative to isolates, such that the origins of Washoe and Chitimacha are obscure to scholars in the present day.',
      'It presents a hypothesis that isolates like Washoe and Chitimacha may not be truly isolated but rather the sole surviving members of once-larger language families.',
    ],
    answer: 3,
    explanation: 'The underlined sentence suggests isolates are "potentially remnants of families whose other members vanished"—they may be survivors of extinct families.',
  },
  {
    id: 4005,
    passage: 'A trend away from stable, relatively high humidity in the Middle East over the past 8 million years can be inferred from the composition of cave formations dating to different periods. Cave formations from about 7 million years ago mainly consist of <u>transparent columnar calcite</u>, indicative of an underground water system regularly replenished by rainfall. Cave formations younger than approximately 1 million years, however, mainly consist of <u>branching, opaque (and sometimes colorful) material, often with more frequent growth interruptions</u>, indicating an intermittent water supply.',
    question: 'Which choice best describes the function of the two underlined portions in the text as a whole?',
    options: [
      'They identify different characteristics of cave formations that when considered together provide evidence for a long-term shift toward lower and more variable humidity in the Middle East.',
      'They describe divergent features of cave formations that when taken together imply decreasing variation in Middle Eastern rainfall over time.',
      'They draw a contrast between Middle Eastern cave formations that is suggestive of geographic differences in the underground water systems of the region.',
      'They present two competing hypotheses about the relationship between cave formation composition and humidity levels in the Middle East.',
    ],
    answer: 0,
    explanation: 'The older formations (transparent calcite) indicate stable high humidity; younger ones (opaque, interrupted growth) indicate intermittent water. Together they show a shift.',
  },
  {
    id: 4006,
    passage: 'Guadalupe Romero Vilanueva et al. conducted radiocarbon analysis of paint used in rock art at the Patagonian archaeological site Cueva Huenul 1, revealing that images of a comblike motif date to as early as 8,000 years ago, predating other paintings in the region by several millennia. The motif was subsequently reproduced multiple times at the site over the next 3,000 years, <u>a period coinciding with extremely arid conditions and slightly negative population growth</u>. The motif may therefore have functioned to help preserve cultural knowledge during a time of ecological and demographic stress.',
    question: 'Which choice best describes the function of the underlined portion in the text as a whole?',
    options: [
      'It emphasizes the historical conditions that explain why production of the painted motif described in the text abruptly ceased after 3,000 years of continued use.',
      'It provides context that informs the text\'s claim about why the peoples of Patagonia chose Cueva Huenul 1 as a culturally significant site.',
      'It explains the environmental circumstances that account for the rarity of rock art dating to the same period as the motif discussed in the text.',
      'It describes conditions that support the text\'s interpretation of the motif\'s purpose as a mechanism for preserving cultural knowledge.',
    ],
    answer: 3,
    explanation: 'The arid conditions and population stress support the hypothesis that the motif served to preserve cultural knowledge during difficult times.',
  },
  {
    id: 4007,
    passage: 'Several sociologists have observed that the word "culture," though commonly used in academic literature, is an ultimately hazy concept. For example, Victoria Bonnell and Lynn Hunt have noted that "many critics have pointed to the vagueness of the concept of culture." <u>Does the concept of culture encompass knowledge, or laws, or both these things and others?</u> For casual usage, such haziness is permissible—we know culture when we see it—but for researchers, a standardization of the term is called for if sociology is to truly progress.',
    question: 'Which choice best describes the function of the underlined sentence in the text as a whole?',
    options: [
      'It lists two essential components of what is referred to by Bonnell and Hunt as "culture."',
      'It presents a point regarding the definition of "culture" on which nonspecialists and specialists tend to disagree.',
      'It describes the questions first raised by Bonnell and Hunt\'s inquiry into the meaning of the word "culture."',
      'It illustrates a difficulty associated with the meaning of "culture" that the author believes holds back an academic field.',
    ],
    answer: 3,
    explanation: 'The question "Does culture encompass knowledge, or laws, or both?" illustrates the vagueness problem that, per the author, must be resolved for sociology to progress.',
  },
  {
    id: 4008,
    passage: 'The following text is from Anne Spencer\'s 1922 poem "Translation."\n\nWe trekked into a far country,\nMy friend and I.\nOur deeper content was never spoken,\nBut each knew all the other said.\nHe told me how calm his soul was laid\nBy the lack of <u>anvil and strife</u>.\n"The wooing kestrel," I said, "mutes his mating-note\nTo please the harmony of this sweet silence."',
    question: 'Which choice best describes the function of the reference to "anvil and strife" in the text as a whole?',
    options: [
      'It illustrates how the speaker and her friend have developed such a firm friendship despite rarely discussing their feelings.',
      'It symbolizes the speaker\'s friend\'s view that meaningful work and social engagement are core components of a fulfilling life.',
      'It represents a strong contrast to the speaker\'s friend\'s current experience of tranquility.',
      'It emphasizes a difference between the natural world and the experience of the speaker and her friend.',
    ],
    answer: 2,
    explanation: '"Anvil and strife" represents noise, conflict, and labor—the opposite of the "calm" and "sweet silence" the friend currently experiences.',
  },
  {
    id: 4009,
    passage: 'The Museum of Modern Art (MOMA) in New York City has an exhibition of video games that includes Pac-Man from 1980, which museum visitors can play on site, and SimCity 2000 from 1994, which visitors can see only in a video presentation. MOMA claims the video presentations are only for games that would be impractical to display in a playable form, but <u>video games are an inherently interactive medium</u>, a feature that is grossly absent in a video-only presentation.',
    question: 'Which choice best describes the function of the underlined sentence in the text as a whole?',
    options: [
      'It identifies a feature of many video games that is not shared by some of the games included in MOMA\'s exhibition.',
      'It provides a claim about video games as art that both MOMA and the author accept as true.',
      'It describes a misconception about video games that the author believes is evident in MOMA\'s choice about which video games to exhibit.',
      'It presents a consideration that the author thinks partly undermines MOMA\'s approach to exhibiting video games.',
    ],
    answer: 3,
    explanation: 'The statement that video games are "inherently interactive" undermines MOMA\'s justification for showing some games as video-only presentations.',
  },
  {
    id: 4010,
    passage: 'In 1965, poet and scholar Dudley Randall founded Broadside Press in Detroit, Michigan. With the goal of making the work of Black poets widely available to the public, Randall published and distributed broadsides: individual poems printed on single sheets of paper. <u>Since these broadsides became associated with the innovative aesthetics of the Black Arts Movement (1965–1975),</u> Randall\'s publication format may likewise seem to have been pioneering, but, in fact, broadside poetry had also flourished in seventeenth-century London, where single-sheet popular ballads flooded the marketplace.',
    question: 'Which choice best describes the function of the underlined portion in the text as a whole?',
    options: [
      'It undermines the argument that Randall\'s method for publishing poetry was a largely novel one.',
      'It identifies a reason for a possible misconception regarding Randall\'s publication of broadsides.',
      'It explains why Randall\'s broadsides were important to the Black Arts Movement.',
      'It provides context for Randall\'s decision to publish work by Black poets as broadsides.',
    ],
    answer: 0,
    explanation: 'The underlined portion notes that broadside poetry "had also flourished in seventeenth-century London," undermining any claim that Randall\'s format was entirely new.',
  },
  {
    id: 4011,
    passage: '<u>Benjamin Prud\'homme and colleagues have explored how convergent evolution—a phenomenon that occurs when the same trait evolves independently in two reproductively separate lineages—can result from a genetic mechanism shared by both lineages.</u> Meanwhile, Cynthia C. Steiner and colleagues have investigated how convergence occurs through different genetic mechanisms. However, the relative prevalence of convergence through shared and different genetic processes is still poorly understood. This motivated biologists Delbert A. Green II and Cassandra G. Extavour to evaluate both types of convergence in a single study for their 2012 paper.',
    question: 'Which choice best states the function of the underlined sentence in the text as a whole?',
    options: [
      'It introduces researchers who will be discussed in greater detail later in the text.',
      'It gives an example of how some scientists had studied a phenomenon before another study mentioned later in the text was conducted.',
      'It outlines a study that was influenced by the researchers mentioned later in the text.',
      'It clarifies a concept that is unclear in some of the studies mentioned in the text.',
    ],
    answer: 1,
    explanation: 'The underlined sentence describes Steiner and colleagues\' research as prior work, setting up the motivation for Green and Extavour\'s later, more comprehensive study.',
  },
  {
    id: 4012,
    passage: 'Editor Jared Shurin\'s 2023 anthology The Big Book of Cyberpunk contains 108 stories, an enormous number. The anthology has a vast chronological scope, including both James Tiptree Jr.\'s "The Girl Who Was Plugged In" (1973) and Lavanya Lakshminarayan\'s "Etudes" (2020). In his introduction, Shurin defines cyberpunk as a subgenre of speculative fiction concerning "the influence of technology on the scale, the pace, or the pattern of human affairs"; however, many critics have previously argued that <u>cyberpunk is a literary movement that is not just idea driven but that has distinctive aesthetic components as well.</u>',
    question: 'Which choice best describes the function of the underlined portion in the text as a whole?',
    options: [
      'It points out a characteristic that is shared by the work of Tiptree and Lakshminarayan.',
      'It explains one of several points of disagreement that an editor of a cyberpunk anthology has with a group of critics.',
      'It explains why some critics think that a particular anthology of cyberpunk stories should not be considered a definitive summary of its genre.',
      'It suggests a way in which a particular editor\'s definition of cyberpunk may be considered incomplete.',
    ],
    answer: 3,
    explanation: 'The critics\' view that cyberpunk also has "distinctive aesthetic components" suggests Shurin\'s purely idea-driven definition may be incomplete.',
  },
  {
    id: 4013,
    passage: '<u>Individual elephants and Arctic herbivores such as caribou tend to have fixed geographic ranges throughout their lifetimes,</u> which had prompted some researchers to speculate that the Arctic woolly mammoth, an extinct elephantid, might have exhibited similar behavior. Mammoth tusks grew in sequential layers, incorporating ingested minerals and organics, and so each ivory stratum reflects the ratio of strontium isotopes (87Sr/86Sr) in the local environment; thus, the sequence of strata shows where the animal roamed during life. Recent analysis of the strontium ratios in the strata of one Arctic woolly mammoth tusk in relation to the geographic distribution of strontium ratios in the environment shows the animal\'s range begin to expand as it reached sexual maturity, only to contract again in its final 1.5 years.',
    question: 'Which choice best describes the function of the underlined statement in the text as a whole?',
    options: [
      'It discusses a characteristic shared by certain animals in order to explain why researchers raised a possibility that turned out not to be supported by data described later in the text.',
      'It illustrates a pattern of behavior among certain animals in order to present a theory about exceptions to that pattern that is weakened by a finding described later in the text.',
      'It describes a similarity in the behavior of certain animals in order to show why a method described later in the text did not reveal whether another animal also showed that behavior.',
      'It introduces a trait shared by certain animals in order to contextualize a hypothesis about the origin of that trait that is advanced later in the text.',
    ],
    answer: 0,
    explanation: 'The underlined statement notes elephants/caribou have fixed ranges, which prompted speculation about mammoths—but tusk analysis showed mammoth ranges actually expanded and contracted.',
  },
  {
    id: 4014,
    passage: 'The following text is from Mary Shelley\'s 1818 novel Frankenstein. Victor Frankenstein, who is narrating this portion of text, describes the state of scientific knowledge as he began his own study of the natural world.\n\nThe untaught peasant beheld the elements around him and was acquainted with their practical uses. The most learned philosopher knew little more. He had partially unveiled the face of Nature, but her immortal lineaments were still a wonder and a mystery. <u>He might dissect, anatomise, and give names; but, not to speak of a final cause, causes in their secondary and tertiary grades were utterly unknown to him.</u> I had gazed upon the fortifications and impediments that seemed to keep human beings from entering the citadel of nature, and rashly and ignorantly I had repined.',
    question: 'Which choice best describes the function of the underlined sentence in the text as a whole?',
    options: [
      'It explains what can be gained from a scientific approach to understanding natural phenomena.',
      'It describes an intensely debated scientific controversy that Victor dedicated his life to resolving.',
      'It undermines the idea that a practical approach to understanding natural phenomena is inferior to a scientific approach.',
      'It suggests that Victor did not discover what he wanted to know from the scientific research available to him.',
    ],
    answer: 3,
    explanation: 'Victor sees scientific knowledge as "fortifications and impediments" blocking entry to nature\'s "citadel"—science failed to give him the answers he sought.',
  },
  {
    id: 4015,
    passage: 'Typically, synthetic leather is petroleum based, but materials scientists searching for an ecologically sustainable alternative have used various bacteria that secrete linear chains of glucose, forming a dense mesh of cellulose called a pellicle, which is leatherlike except in color. The standard process for dyeing leather generates substantial wastewater and other undesirable byproducts, so <u>adopting such a regimen would run counter to the ecological promise of the pellicle approach</u>. To address this, Kenneth T. Walker and colleagues worked to modify Komagataeibacter rhaeticus bacteria to produce a pellicle with embedded pigmentation cells, thereby allowing the pellicle to "dye" itself from the inside.',
    question: 'Which choice best describes the function of the underlined portion in the text as a whole?',
    options: [
      'To illustrate how the researchers adapted the pellicle approach to overcome a potential impediment to their main goal as presented in the text',
      'To concede that the researchers\' main goal as described in the text will be challenging to achieve due to the standard coloring approach being impractical for use on a pellicle',
      'To indicate the characteristic of conventional synthetic leathers that makes those leathers poorly suited to achieve the researchers\' main goal as presented in the text',
      'To describe a consideration that led the researchers to employ an alternative approach to coloring a pellicle that allowed them to achieve their main goal as presented in the text',
    ],
    answer: 3,
    explanation: 'The underlined portion explains the problem (standard dyeing creates pollution, counter to ecological goals), which motivated Walker\'s team to develop the self-dyeing pellicle.',
  },
]
const fsp_huaxian_level2: ReadingQuestion[] = []
const fsp_huaxian_level3: ReadingQuestion[] = []
const fsp_jiegou_level1: ReadingQuestion[] = []
const fsp_jiegou_level2: ReadingQuestion[] = []
const fsp_jiegou_level3: ReadingQuestion[] = []
const fsp_zhuzhi_level1: ReadingQuestion[] = []
const fsp_zhuzhi_level2: ReadingQuestion[] = []
const fsp_zhuzhi_level3: ReadingQuestion[] = []

// ============================================================
//  图表题（冲刺班难题集）— 21 题
// ============================================================
const tubiaoti_level1: ReadingQuestion[] = [
  {
    id: 5001,
    passage: 'While US public charities, like Commonfund, must file Form 990 yearly with the IRS, private foundations, such as Lilly Endowment Inc., must file a different form, 990-PF. In addition, foundations that engage in certain prohibited activities must also file Form 4720 and pay a penalty tax on the money involved. Private foundations are prohibited from holding excess interests in a business enterprise, "self-dealing" (conducting activities that benefit foundation insiders), making taxable expenditures such as outlays for lobbying, and failing to cross a required threshold in making charitable distributions from income. Out of the organizations that filed Form 990-PF in the years 2003–2005, __________',
    question: 'Which choice most effectively uses data from the graph to complete the assertion?',
    options: [
      'those that also filed Form 4720 collectively paid larger penalties for failing to meet the minimum charitable distribution requirement than for other reasons.',
      'those that also filed Form 4720 paid a larger penalty for failing to meet a minimum charitable distribution requirement than those organizations that filed Form 990 but also filed Form 4720 for the same reason.',
      'those that were also required to file Form 4720 because they had excess holdings in a business enterprise paid, on average, a larger penalty than those organizations that filed Form 4720 because they engaged in self-dealing.',
      'a smaller percentage of those that also filed Form 4720 did so because they engaged in self-dealing than the percentage of those that filed Form 4720 because they did not meet the minimum charitable distribution requirement.',
    ],
    answer: 0,
    explanation: 'The graph shows the distribution of reasons for filing Form 4720. The percentage for failing to meet the minimum charitable distribution requirement is larger than the percentage for self-dealing, supporting option D.',
    chartImage: '/images/chart-questions/chart_01.png',
  },
  {
    id: 5002,
    passage: 'To understand how expressions of anger in reviews of products affect readers of those reviews, business scholar Dezhi Yin and colleagues measured study participants\' responses to three versions of the same negative review—a control review expressing no anger, a review expressing a high degree of anger, and a review expressing a low degree of anger. Reviewing the data, a student concludes that the mere presence of anger in a review may not negatively affect readers\' perceptions of the review, but a high degree of anger in a review does worsen readers\' perceptions of the review.',
    question: 'Which choice best describes data from the graph that support the student\'s conclusion?',
    options: [
      'On average, participants\' ratings of the helpfulness of the review were substantially higher than were participants\' ratings of the reviewed product regardless of which type of review participants had seen.',
      'Compared with participants who saw the control review, participants who saw the low-anger review rated the review as slightly more helpful, whereas participants who saw the high-anger review rated the review as less helpful.',
      'Participants who saw the low-anger review rated the review as slightly more helpful than participants who saw the control review did, but participants\' attitude toward the reviewed product was slightly worse when participants saw the low-anger review than when they saw the no-anger review.',
      'Compared with participants who saw the low-anger review, participants who saw the high-anger review rated the review as less helpful and had a less positive attitude toward the reviewed product.',
    ],
    answer: 1,
    explanation: 'The student concludes that mere presence of anger may not hurt (low-anger slightly better than control) but high anger does hurt (high-anger worse). Option B captures both parts: low-anger rated slightly more helpful, high-anger rated less helpful.',
    chartImage: '/images/chart-questions/chart_02.svg',
  },
  {
    id: 5003,
    passage: 'Domestic sheep\'s wild ancestor, the mouflon, has a coarse outer coat and an inner coat of wool fiber that is finer in diameter and therefore much softer. In some domestic breeds, such as the Spanish Merino, the outer fiber is only marginally coarser than the inner, and the wool is soft overall. Thus, Merino wool is ideal for delicate garments worn against the skin. Meanwhile, the Navajo-Churro has been selected to retain the marked distinction between outer and inner fiber that the Merino has lost. Being coarser than Merino wool overall, Navajo-Churro wool yields a more durable yarn, which Diné (Navajo) weavers use in their celebrated rugs. Yet a comparison of the fiber characteristics of all three sheep reveals that __________',
    question: 'Which choice most effectively uses data from the table to complete the text?',
    options: [
      'the Mouflon is the only one of the three sheep to have a highly variable diameter of its outer fiber.',
      'domestication resulted in a counterintuitive increase in the inner fiber\'s minimum diameter, making the inner fiber of the Merino and the Navajo-Churro less suitable for delicate garments than the mouflon\'s inner fiber is.',
      'the domestication of the mouflon and the subsequent selection process that produced the Merino and the Navajo-Churro resulted in greater softness of outer and inner fiber alike.',
      'the selection process that enabled the Navajo-Churro to retain its somewhat coarse outer fiber also resulted in inner fiber that, at its softest, is softer than either the mouflon\'s or the Merino\'s inner fiber.',
    ],
    answer: 3,
    explanation: 'The table data shows Navajo-Churro inner fiber minimum diameter is finer (softer) than both mouflon and Merino, supporting D. This is a surprising finding given Navajo-Churro\'s overall coarseness.',
    chartImage: '/images/chart-questions/chart_03.png',
  },
  {
    id: 5004,
    passage: 'A sociology student is reading an essay on the median age of first marriage in Western countries throughout the twentieth century. The author of the essay cites factors common to these countries that the author believes caused an increase in the median age of first marriage, such as new technologies that shortened the time needed for domestic chores, making two-person households less necessary and living alone more viable. The student asserts that beyond these factors there must be additional ones specific to particular Western countries that influenced the increase of age at first marriage.',
    question: 'Which choice most effectively uses data from the graph that support the student\'s assertion?',
    options: [
      'Between 1970 and 2000, the median age of first marriage rose more sharply for men in England and Wales than it did for men in the United States.',
      'In England and Wales, the median age of first marriage was consistently higher for men than for women between 1900 and 2000, but this was not always the case in the United States.',
      'The median age of first marriage for men in England and Wales was lower in 1970 than in 1950 or 1990.',
      'Between 1900 and 2000, the median age of first marriage for women in England and Wales was consistently higher than for women in the United States, as was the case for men.',
    ],
    answer: 0,
    explanation: 'The student says country-specific factors must exist. Option A shows different rates of increase between countries, supporting the idea that factors beyond the common ones affected each country differently.',
    chartImage: '/images/chart-questions/chart_04.png',
  },
  {
    id: 5005,
    passage: 'The late Hemphillian (Hh) North American Land Mammal Age includes the subdivisions Hh3, 6.8 million years ago (Ma) to 6 Ma, and Hh4, 6 Ma to 4.75 Ma. While mammalian fossils have indicated that Florida\'s Montbrook Fossil Site (MFS) and Palmetto Fauna of the Bone Valley Region (PFBV) date to Hh4, a more precise determination of the sites\' ages has proved challenging. Stephanie R. Killingsworth et al. compared average ratios of strontium-87 to strontium-86 (⁸⁷Sr/⁸⁶Sr) in fossil shark teeth from MFS and PFBV—0.709000 and 0.709028, respectively—to ⁸⁷Sr/⁸⁶Sr ratios in the global strontium seawater curve, a record that shows how ⁸⁷Sr/⁸⁶Sr ratios in seawater correspond to numerical ages and that is used to date fossils and, by extension, fossil sites. The researchers concluded that __________',
    question: 'Which choice most effectively uses data from the table to complete the statement?',
    options: [
      'mammalian fossil evidence offers less dating precision than do ⁸⁷Sr/⁸⁶Sr ratios in fossil shark teeth and that PFBV likely was deposited closer to the Hh3-Hh4 boundary than was MFS.',
      'the average ⁸⁷Sr/⁸⁶Sr ratios in the fossil shark teeth from MFS and PFBV resolve previous uncertainty about the sites\' relative ages by indicating that both sites were deposited contemporaneously during the late Hh.',
      'the average ⁸⁷Sr/⁸⁶Sr ratios in the fossil shark teeth from MFS and PFBV only partially support the site age estimates previously established through mammalian fossil evidence.',
      'the average ⁸⁷Sr/⁸⁶Sr ratios in the fossil shark teeth from MFS and PFBV corroborate that both MFS and PFBV fall within Hh4 but suggest that PFBV was likely deposited more recently than MFS.',
    ],
    answer: 3,
    explanation: 'Both sites date to Hh4. MFS=0.709000, PFBV=0.709028. Higher ⁸⁷Sr/⁸⁶Sr ratio in seawater curve = more recent. PFBV has higher ratio, suggesting it was deposited more recently.',
    chartImage: '/images/chart-questions/chart_05.png',
  },
  {
    id: 5006,
    passage: 'A tariff is a tax on imported goods intended to protect domestic producers of similar goods from international competition. Eliminating tariffs can lead to an influx of cheaper imported goods, lowering prices; in a place where domestic production is relatively expensive, this influx can suppress domestic production, as the country\'s consumers favor more cheaply produced imported goods over domestically produced ones. A student consults a table showing projected changes in production and average market prices of agricultural commodities in four countries in a tariff-elimination scenario. Based on the data, the student claims that compared with India and Russia, agricultural production in Argentina and the United States is likely relatively inexpensive.',
    question: 'Which choice most effectively uses information from the text and data from the table to support the student\'s claim?',
    options: [
      'Although agricultural production in India and Russia would likely decrease if tariffs were eliminated, it would likely increase in both Argentina and the United States.',
      'Although eliminating tariffs would likely cause agricultural market prices to decrease in most locations, it would likely cause agricultural market prices to increase in both Argentina and the United States.',
      'Argentina and the United States are the only countries shown that are projected to see both an increase in agricultural production and a reduction in agricultural prices in the absence of tariffs.',
      'In the absence of tariffs, total agricultural production in Argentina and the United States would likely exceed that in India and Russia.',
    ],
    answer: 0,
    explanation: 'If production increases when tariffs are eliminated (Argentina, US), it means domestic production is relatively inexpensive and can compete. If production decreases (India, Russia), domestic production is expensive. Option A directly supports the claim.',
    chartImage: '/images/chart-questions/chart_06.png',
  },
  {
    id: 5007,
    passage: 'Interested in how differences in the color of dogs\' irises affect human responses to dogs, Akitsugu Konno et al. showed close-up images of dogs\' faces to human participants and asked them to rate the dogs\' traits and their own attitudes toward the dogs. Konno et al. suggest that differences in iris color led participants to view some dogs as more vulnerable and in need of protection than others and that this phenomenon could help explain the association the researchers observed between iris color and participants\' inclinations to interact with or keep dogs, as illustrated by the finding that __________',
    question: 'Which choice most effectively uses data from the table to complete the statement?',
    options: [
      'the more mature a dog was perceived to be, the more likely participants were to rate it as having light irises.',
      'participants favored the dogs in images 2 and 11, which they rated as less mature than the dogs in images 20 and 16.',
      'participants rated the dog in image 2 as less mature than the dog in image 11 and rated the dog in image 16 as less mature than the dog in image 20.',
      'dogs that participants rated as friendlier were also dogs that participants indicated a stronger willingness to interact with or keep.',
    ],
    answer: 1,
    explanation: 'The finding should link iris color to perceived vulnerability and willingness to interact/keep. Option B connects favorability (willingness to interact) with perceived maturity (vulnerability proxy), consistent with the researchers\' suggested mechanism.',
    chartImage: '/images/chart-questions/chart_07.png',
  },
  {
    id: 5008,
    passage: 'Some climate models for the western United States predict that while total annual precipitation may remain unchanged from the present level, precipitation will become concentrated into fewer but more intense rain and snow events. University of Texas climate scientist Geeta Persad and her colleagues simulated how the amount of water entering aquifers and the amount being used for irrigation purposes would change if this were to occur. Persad and her colleagues concluded that concentration of precipitation into fewer events would result in a higher number of dry days, triggering more irrigation, but that this change in irrigation output is highly sensitive to the baseline concentration of precipitation that currently exists in an area.',
    question: 'Which choice best describes data from the table that support Persad and her colleagues\' conclusion?',
    options: [
      'If baseline precipitation is somewhat concentrated, the amount of water being used for irrigation will increase 0.4% for surface water and 0.9% for groundwater, whereas the amount of water entering aquifers will increase 11.0% if baseline precipitation is evenly distributed.',
      'If baseline precipitation is somewhat concentrated, water use for irrigation will increase only slightly, whereas it will increase 9.0% for surface water and 7.9% for groundwater if baseline precipitation is evenly distributed.',
      'If baseline precipitation is somewhat concentrated, the amount of water entering aquifers will increase 4.9%, while the amount being used for irrigation will increase 0.4% for surface water and 0.9% for groundwater.',
      'If baseline precipitation is somewhat concentrated, water use for irrigation will decline by a small amount, whereas it will increase 11.0% for surface water and 9.0% for groundwater if baseline precipitation is evenly distributed.',
    ],
    answer: 1,
    explanation: 'The conclusion says the effect is "highly sensitive to baseline concentration." Option B shows this: small increase under "somewhat concentrated" vs large increase under "evenly distributed," illustrating the sensitivity.',
    chartImage: '/images/chart-questions/chart_08.png',
  },
  {
    id: 5009,
    passage: 'After sample A0106 was retrieved from the asteroid Ryugu, a portion of it was subjected to an extraction protocol in which small amounts of pulverized material were rinsed, sequentially, with hexane, dichloromethane, methanol, and finally a mixture of dichloromethane and methanol. Each rinse created a separate extract suitable for spectral analysis. Based on the table, both alkane and dimethyl sulfide compounds must have been present in the pulverized sample before the methanol-only extraction, because __________',
    question: 'Which choice uses data from the table to effectively complete the text?',
    options: [
      'the third extract in the sequence contains dimethyl sulfides and the fourth contains alkanes.',
      'the second extract in the sequence contains alkanes but no dimethyl sulfides.',
      'three of the four extracts contain alkanes but only one of the four contains dimethyl sulfides.',
      'the fourth extract in the sequence contains alkanes but no dimethyl sulfides.',
    ],
    answer: 0,
    explanation: 'The methanol-only extraction is the third step. The question asks why both compounds must have been present BEFORE the methanol-only step. Option A indicates dimethyl sulfides appear in the third extract and alkanes in the fourth, meaning both were still present in the sample before methanol extraction.',
    chartImage: '/images/chart-questions/chart_09.png',
  },
  {
    id: 5010,
    passage: 'Mycorrhizal fungi in soil benefits many plants, substantially increasing the mass of some. A student conducted an experiment to illustrate this effect. The student chose three plant species for the experiment, including two that are mycorrhizal hosts (species known to benefit from mycorrhizal fungi) and one nonmycorrhizal species (a species that doesn\'t benefit from and may even be harmed by mycorrhizal fungi). The student then grew several plants from each species both in soil containing mycorrhizal fungi and in soil that had been treated to kill mycorrhizal and other fungi. After several weeks, the student measured the plants\' average mass and was surprised to discover that __________',
    question: 'Which choice most effectively uses data from the table to complete the statement?',
    options: [
      'broccoli grown in soil containing mycorrhizal fungi had a slightly higher average mass than broccoli grown in soil that had been treated to kill fungi.',
      'corn grown in soil containing mycorrhizal fungi had a higher average mass than broccoli grown in soil containing mycorrhizal fungi.',
      'marigolds grown in soil containing mycorrhizal fungi had a much higher average mass than marigolds grown in soil that had been treated to kill fungi.',
      'corn had the highest average mass of all three species grown in soil that had been treated to kill fungi, while marigolds had the lowest.',
    ],
    answer: 0,
    explanation: 'The student was "surprised." The surprising result would be that marigolds (the nonmycorrhizal species) thrived with fungi, contrary to expectation that they would be harmed. Option C shows marigolds had much higher mass with fungi, which is surprising for a nonmycorrhizal species.',
    chartImage: '/images/chart-questions/chart_10.png',
  },
  {
    id: 5011,
    passage: 'The mating environment hypothesis predicts that populations of flowering plants compensate for reduced mating opportunities due to dichogamy (a plant\'s expression of male and female functions at separate times to prevent self-pollination) by adjusting the bias of floral sex allocation during the flowering period, increasing the probability of successful cross-plant pollination. Researchers tested the hypothesis by examining a population of broadleaf arrowhead, a plant for which bloom onset generally takes longer for male flowers than for female flowers, during the flowering season. They concluded that the mating environment hypothesis is not well supported by their observational data.',
    question: 'Which choice best describes data from the table that support the researchers\' conclusion?',
    options: [
      'Whereas the total number of open flowers per growth unit peaked on day 15, the proportion of male flowers experienced a peak earlier in the flowering season, on day 10.',
      'Sex allocations were largely evenly distributed on days 10 and 15 but were female biased on days 5 and 20.',
      'Although sex allocations became overwhelmingly female biased by day 20, male flowers\' estimated reproductive success rate did not vary from day 5 to 20.',
      'The proportion of male flowers remained constant throughout the flowering season while the total number of open flowers steadily increased.',
    ],
    answer: 2,
    explanation: 'The hypothesis predicts compensation for dichogamy through adjusted sex allocation. The data showing male peak (day 10) before total peak (day 15) would be consistent with normal dichogamy, not compensatory adjustment. This lack of compensation pattern fails to support the hypothesis.',
    chartImage: '/images/chart-questions/chart_11.png',
  },
  {
    id: 5012,
    passage: 'Kaiser Foundation Hospitals and other US public charities must file Form 990 yearly with the IRS, but private foundations, such as the Gordon and Betty Moore Foundation, must file a different form, 990-PF. In addition, foundations that engage in certain prohibited activities must also file Form 4720 and pay a penalty tax on the money involved. Private foundations are prohibited from doing the following: holding excess interests in a business enterprise, "self-dealing" (conducting activities that benefit foundation insiders), making taxable expenditures such as grants to noncharitable entities, and failing to cross a required threshold in making charitable distributions from income. Out of the organizations that filed Form 990-PF in the years 2003–2005, __________',
    question: 'Which choice most effectively uses data from the graph to complete the assertion?',
    options: [
      'those that filed Form 4720 were less likely to do so because they did not meet the minimum charitable distribution requirement than for other reasons.',
      'those that filed Form 4720 because they had excess holdings in a business enterprise paid, on average, a significantly smaller penalty than those organizations that filed Form 4720 because they made taxable expenditures.',
      'the percentage of those that filed Form 4720 because they made taxable expenditures was smaller than the percentage of those that did so because they did not meet the minimum charitable distribution requirement.',
      'more of those that filed Form 4720 failed to meet a minimum charitable distribution requirement than did those organizations that filed Form 990 but filed Form 4720 for the same reason.',
    ],
    answer: 2,
    explanation: 'The graph shows the distribution of reasons for filing Form 4720. The percentage for failing to meet distribution requirements is larger than the percentage for taxable expenditures, supporting option C.',
    chartImage: '/images/chart-questions/chart_12.png',
  },
  {
    id: 5013,
    passage: 'Honeybee hives consist mainly of hexagonal (six-sided) units called cells, in which queens lay eggs. Hexagonal cells for eggs that develop into nonreproductive workers are smaller than those for eggs that develop into reproductive drones, though the size difference varies by species. Difference in cell size results in a construction problem—it\'s hard to neatly connect sections of small cells to sections of large cells—that bees solve by building intermediate cells of different shapes between the worker and drone sections. A student studying beehive structure consults data on three species, concluding that __________',
    question: 'Which choice most effectively uses data from the graph to complete the student\'s conclusion?',
    options: [
      'both the western honeybee and the black dwarf honeybee probably reserve eight-sided cells for drone eggs, while the dwarf honeybee likely deposits drone eggs in seven-sided cells.',
      'the western honeybee probably relies on many more geometrical shapes when constructing cells than either the dwarf honeybee or the black dwarf honeybee does.',
      'cells for worker eggs are probably closer in size to cells for drone eggs in the hives of the western honeybee than in the hives of the dwarf honeybee and the black dwarf honeybee.',
      'the percentage of hexagonal cells is probably slightly lower in the hives of the western honeybee than in the hives of the dwarf honeybee and the black dwarf honeybee.',
    ],
    answer: 2,
    explanation: 'The size difference between worker and drone cells affects the need for intermediate (non-hexagonal) cells. If western honeybee worker and drone cells are closer in size, it would need fewer intermediate cells, which is supported by the graph data.',
    chartImage: '/images/chart-questions/chart_13.png',
  },
  {
    id: 5014,
    passage: 'Working in Ghana, Emmanuel Hanyabui and colleagues compared the impact on pineapple growth of different combinations of soil additives, including NPK fertilizer (an inorganic fertilizer containing nitrogen, phosphorus, and potassium), organic compost, and biochar (a carbon-rich material produced from organic waste matter). Based on data in the table, pineapple farmers with no access to inorganic soil additives would likely increase the weight and size of their fruits by the greatest amount by using __________',
    question: 'Which choice most effectively uses data from the table to complete the text?',
    options: [
      'compost alone.',
      'biochar alone.',
      'biochar and compost.',
      'biochar and NPK fertilizer.',
    ],
    answer: 2,
    explanation: 'The question specifies "no access to inorganic soil additives." NPK is inorganic, so options with NPK are excluded. Of the organic-only options (compost alone, biochar alone, biochar+compost), the table shows biochar+compost yields the greatest increase.',
    chartImage: '/images/chart-questions/chart_14.png',
  },
  {
    id: 5015,
    passage: 'Hemerocallis sp. plants typically carry a negative electrical charge, while bees and other pollinators tend to accumulate a positive charge. Given that negatively and positively charged objects attract, a research team hypothesized that the difference in charges could attract Hemerocallis sp. stamens to the plants\' pollinators. Based on the team\'s experiments, the hypothesis was well supported for positive charges above a certain threshold. The team found that foraging honeybees exceeded that threshold, which suggests that __________',
    question: 'Which choice most effectively uses data from the graph to complete the text?',
    options: [
      'red mason bees can also attract the stamens.',
      'red mason bees and European peacock caterpillars, with greater maximum charges than foraging honeybees have, cannot attract the stamens.',
      'European peacock caterpillars tend to repel the stamens.',
      'the threshold positive charge for a pollinator to attract the stamens must be greater than 100pC.',
    ],
    answer: 2,
    explanation: 'The graph shows charge levels for different pollinators. Foraging honeybees exceed the threshold and attract stamens. Red mason bees have similar or higher charge than honeybees, meaning they also exceed the threshold and can attract stamens.',
    chartImage: '/images/chart-questions/chart_15.png',
  },
  {
    id: 5016,
    passage: 'Laila Nazirah and colleagues found that tilling—the practice of turning soil with hoes, plows, or other machines before planting crops—was associated with an increased yield of rice. But some studies of other crops have found the opposite effect, raising the question of whether the increase in yield found by Nazirah and colleagues is specific to their study crop. However, this doesn\'t seem to be the case: __________',
    question: 'Which choice most effectively uses data from the table to complete the assertion?',
    options: [
      'Salem Alhaji Ali and colleagues reported an even larger positive effect of tilling on the yield of winter wheat.',
      'a study using rice yielded 4,370 kilograms per hectare with tilling and only 2,450 kilograms per hectare without tilling.',
      'crop yields with tilling have ranged from 3,078 kilograms per hectare for maize to 4,370 kilograms per hectare for rice.',
      'G.F. Botta and colleagues found a similar association in a study using soybeans.',
    ],
    answer: 3,
    explanation: 'The assertion is that the positive effect of tilling is NOT specific to rice. Option D shows soybeans also had a positive association with tilling, proving the effect generalizes to other crops.',
    chartImage: '/images/chart-questions/chart_16.png',
  },
  {
    id: 5017,
    passage: 'It may seem that the optimal strategy for an animal pursuing prey or escaping predators is to move at maximal speed, but the energy expense of exploiting full speed capacity can disfavor such a strategy even in escape contexts, as evidenced by the fact that __________',
    question: 'Which choice most effectively uses data from the graph to complete the text?',
    options: [
      'most lizard species use about the same percentage of their maximal speed when escaping predation as they do when pursuing prey.',
      'multiple lizard species move at an average of less than 90% of their maximal speed while escaping predation.',
      'more lizard species use, on average, 90%–100% of their maximal speed while escaping predation than use any other percentage of their maximal speed.',
      'at least 4 lizard species use, on average, less than 100% of their maximal speed while pursuing prey.',
    ],
    answer: 2,
    explanation: 'The claim is that even in escape (life-or-death) situations, animals don\'t use full speed due to energy costs. Option B shows that many species use less than 90% of maximal speed while escaping, supporting the claim that full speed is disfavored.',
    chartImage: '/images/chart-questions/chart_17.png',
  },
  {
    id: 5018,
    passage: 'Polyethylene (PE) plastic sheeting is used as agricultural mulch because it is effective at reducing the propagation of weeds. Seeking a biodegradable alternative, Waqas Ahmad and colleagues tended otherwise equivalent plots of strawberries mulched with PE sheeting or one of several newsprint pulp-based alternatives: just newsprint pulp (NP), pulp bound with guar gum (GG), or pulp bound with psyllium husk (PH). The graph represents strawberry plots for which all emerging weeds were left in place throughout the experiment. Once the fruit was harvested, the weeds were removed, dried, and weighed for dry biomass. Based on the results, there was not a predictable association between treatment effectiveness and fruit yield.',
    question: 'Which choice most effectively uses data from the graph to support the underlined claim?',
    options: [
      'The psyllium husk and guar gum treatments were associated with lower weed biomasses and higher fruit yields than the treatment with just newsprint pulp was.',
      'While the psyllium husk treatment was associated with a higher weed biomass than the guar gum treatment was, the guar gum treatment was associated with a higher fruit yield than the psyllium husk treatment was.',
      'While the guar gum and polyethylene treatments were associated with the lowest weed biomasses, the guar gum treatment was associated with the highest fruit yield and the polyethylene treatment was associated with the lowest fruit yield.',
      'The treatment with just newsprint pulp was associated with the highest weed biomass and was not one of the two treatments associated with the highest fruit yields.',
    ],
    answer: 0,
    explanation: 'The claim is "no predictable association between treatment effectiveness and fruit yield." Option C best supports this: GG and PE both had low weed biomass (effective weed control), but GG had highest fruit yield while PE had lowest—opposite outcomes despite similar weed control, proving no predictable association.',
    chartImage: '/images/chart-questions/chart_18.svg',
  },
  {
    id: 5019,
    passage: 'Some researchers studying Indigenous actors and filmmakers in the United States have turned their attention to the early days of cinema, particularly the 1910s and 1920s, when people like James Young Deer, Dark Cloud, Edwin Carewe, and Lillian St. Cyr (known professionally as Red Wing) were involved in one way or another with numerous films. In fact, so many films and associated records for this era have been lost that counts of those four figures\' output should be taken as bare minimums rather than totals; it\'s entirely possible, for example, that __________',
    question: 'Which choice most effectively uses data from the table to complete the example?',
    options: [
      'Dark Cloud acted in significantly fewer films than did Lillian St. Cyr, who is credited with 66 performances.',
      'Edwin Carewe\'s 47 credited acting roles includes only films made after 1934.',
      'Lillian St. Cyr acted in far more than 66 films and Edwin Carewe directed more than 58.',
      'James Young Deer actually directed 33 films and acted in only 10.',
    ],
    answer: 2,
    explanation: 'The claim is that counts are "bare minimums" because records were lost. Option C supports this by suggesting the actual numbers are "far more than" the recorded counts, consistent with the idea that records undercount.',
    chartImage: '/images/chart-questions/chart_19.png',
  },
  {
    id: 5020,
    passage: 'To understand the extent of deforestation in the Chorotega region of Costa Rica, Juan Pablo Arroyo Mora and colleagues used historical aerial photography and remote sensing data to track changes in the total number of forest patches in areas of different land use capability classes (categories that indicate possible uses of forest land). Due to the Chorotega region\'s accessibility, various types of forested areas were converted to cattle pasture as rising international meat prices drove a cattle ranching boom in the 1960s and 1970s: this conversion is evident in the __________',
    question: 'Which choice most effectively uses data from the graph to complete the assertion?',
    options: [
      'high number of patches in Class VII and Class VIII in 1986.',
      'difference between the number of patches in Class VII and in Class VI in 2000.',
      'increase in the number of patches for all Classes from 1979 to 2000.',
      'decrease in the number of patches for all classes from 1960 to 1979.',
    ],
    answer: 3,
    explanation: 'The cattle ranching boom in the 1960s-70s caused deforestation (forest → pasture). Deforestation would decrease the number of forest patches. Option D shows this decrease during the exact period of the cattle boom.',
    chartImage: '/images/chart-questions/chart_20.png',
  },
  {
    id: 5021,
    passage: 'Interested in how differences in the color of dogs\' irises affect human responses to dogs, Akitsugu Konno et al. showed close-up images of dogs\' faces to human participants and asked them to rate the dogs\' traits and their own attitudes toward the dogs. Konno et al. suggest that differences in iris color led participants to view some dogs as more vulnerable and in need of protection than others and that this phenomenon could help explain the association the researchers observed between iris color and participants\' inclinations to interact with or keep dogs, as illustrated by the finding that __________',
    question: 'Which choice most effectively uses data from the table to complete the statement?',
    options: [
      'participants rated the dog in image 3 as less mature than the dog in image 8 and rated the dog in image 14 as less mature than the dog in image 24.',
      'dogs that participants rated as friendlier were also dogs that participants indicated a stronger willingness to interact with or keep.',
      'the more mature a dog was perceived to be, the more likely participants were to rate it as having light irises.',
      'participants favored the dogs in images 3 and 8, which they rated as less mature than the dogs in images 24 and 14.',
    ],
    answer: 1,
    explanation: 'The finding should show the link between iris color → perceived vulnerability → willingness to interact. Option D shows participants favored dogs perceived as less mature (more vulnerable) with darker irises, supporting the mechanism the researchers describe.',
    chartImage: '/images/chart-questions/chart_21.svg',
  },
  {
    id: 5022,
    passage: 'Indonesia is trying to increase its electricity capacity (the maximum amount of electricity that can be generated) for renewable energy in order to reduce dependence on fossil fuels, which can be costly financially and environmentally. From 2017 to 2020, Indonesia\'s use of four renewable technologies has trended upward, but not uniformly: the electricity capacity of solar power fell from 97.4 megawatts in 2017 to 65.5 megawatts in 2018, and the electricity capacity of __________',
    question: 'Which choice most effectively uses data from the graph to complete the assertion?',
    options: [
      'both geothermal and wind neither increased nor decreased from 2019 to 2020.',
      'both wind and solar never surpassed that of renewable hydropower throughout the four-year period.',
      'wind was much lower in 2017 than it was in 2018, 2019, or 2020.',
      'renewable hydropower was much higher than that of solar for all four years.',
    ],
    answer: 2,
    explanation: 'The graph shows geothermal and wind capacity remained flat from 2019 to 2020, while other sources fluctuated. Option A correctly identifies this stability for both geothermal and wind.',
    chartImage: '/images/chart-questions/chart_22.png',
  },
  {
    id: 5023,
    passage: 'A Pew Research Center survey conducted in January 2024 found that three out of ten US adults make at least one New Year\'s resolution (a promise for the year ahead), while half of those who make a resolution make more than one. The survey asked participants what kinds of resolutions they made and separated them into several categories. The table presents percentages of people who make particular kinds of New Year\'s resolutions among those who choose to make them, indexed by age bracket.',
    question: 'Which choice best presents a conclusion about the habits of New Year\'s resolution makers that is best supported by information in the text and the table?',
    options: [
      'The majority of US adults who make resolutions related to health and exercise also make resolutions in multiple additional categories.',
      'Among all US adults, people become less likely to make New Year\'s resolutions as they age, regardless of the type of resolution.',
      'Resolution makers between the ages of 50 and 64 are more likely to make resolutions related to personal relationships and less likely to make resolutions related to finances than resolution makers between the ages of 30 and 49 are.',
      'Resolution makers between the ages of 18 and 29 are more likely to make resolutions about health and exercise than resolution makers between the ages of 30 and 49 are.',
    ],
    answer: 0,
    explanation: 'The table data shows that the 50-64 age bracket has higher percentages for personal relationship resolutions and lower percentages for finance resolutions compared to the 30-49 bracket, supporting option C.',
    chartImage: '/images/chart-questions/chart_23.png',
  },
  {
    id: 5024,
    passage: 'A 2022 US Department of Agriculture report by Kayode Ajewole et al. calculated average annual growth rates of agricultural exports from countries over the five years before and the five years following the creation of a free trade agreement (FTA) with the US. The table shows data for five countries in the study. (Post-FTA calculations included some anticipatory effects preceding the agreements\' official start.) Ajewole et al. note that an increase in the rate of exports to the US in the post-FTA period does not necessarily indicate that a country produced more goods for export as a result of the FTA. Rather, FTAs sometimes incentivize countries to redirect existing trade from nonmember countries to FTA partners, as is most likely the case with __________',
    question: 'Which choice most effectively uses data from the table to complete the statement?',
    options: [
      'Jordan, because the post-FTA period coincided with increasing rates of both its agricultural exports to the US and its total agricultural exports to countries not participating in the FTA.',
      'Australia, because its rate of agricultural exports to the US and its rate of total agricultural exports both decreased in the post-FTA period relative to the pre-FTA period.',
      'Morocco, because its rate of agricultural exports to the US increased in the post-FTA period relative to the pre-FTA period, while its rate of total agricultural exports decreased during the same period.',
      'Panama, because the post-FTA period saw a decrease in its rate of agricultural exports to the US but not in its rate of total agricultural exports.',
    ],
    answer: 2,
    explanation: 'The redirect hypothesis says trade shifts from nonmembers to FTA partners. Morocco shows increased exports to the US but decreased total exports, indicating trade was redirected rather than newly created. Option C supports this.',
    chartImage: '/images/chart-questions/chart_24.png',
  },
  {
    id: 5025,
    passage: 'To understand the extent of deforestation in the Chorotega region of Costa Rica, Juan Pablo Arroyo Mora and colleagues used historical aerial photography and remote sensing data to track changes in the total number of forest patches in areas of different land use capability classes (categories that indicate possible uses of forest land). Due to the Chorotega region\'s accessibility, various types of forested areas were converted to cattle pasture as rising international meat prices drove a cattle ranching boom in the 1960s and 1970s: this conversion is evident in the __________',
    question: 'Which choice most effectively uses data from the graph to complete the assertion?',
    options: [
      'high number of patches in Class VII and Class VIII in 1986.',
      'difference between the number of patches in Class VII and in Class VI in 2000.',
      'increase in the number of patches for all Classes from 1979 to 2000.',
      'decrease in the number of patches for all classes from 1960 to 1979.',
    ],
    answer: 3,
    explanation: 'The cattle ranching boom in the 1960s-70s caused deforestation (forest → pasture). Deforestation would decrease the number of forest patches. Option D shows this decrease during the exact period of the cattle boom.',
    chartImage: '/images/chart-questions/chart_25.png',
  },
]

// ── 推断题 Level 1（新手保护期 — Easy）──
const tuizhi_level1: ReadingQuestion[] = [
  {
    id: 6001,
    passage:
      'Previous research has shown that plant species with a narrow geographical range tend to be more genetically homogeneous than plant species with extensive ranges are. Based on these findings, researchers recently ran simulations to predict how the genetic variation of several species of Mammillaria, a genus of cactus found throughout the Americas, might change in different distribution conditions. One of these species, M. klissingiana, is found only in the state of Tamaulipas. The researchers simulated what would happen if M. klissingiana spread to new habitats outside Tamaulipas, and, consistent with previous findings, the results showed that ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'several other Mammillaria species could survive in Tamaulipas in the future.',
      'the genetic homogeneity of M. klissingiana decreased over time.',
      'there was a gradual increase in the genetic homogeneity of Mammillaria species in states neighboring Tamaulipas.',
      'Mammillaria species other than M. klissingiana would become more common in Tamaulipas.',
    ],
    answer: 1,
    explanation:
      '【Prediction 预测推理】已知规律：范围越窄→基因越同质。新条件：M. klissingiana 扩散到新栖息地（范围变广）。推断结果：同质性下降。B 严格遵循规律。A/C/D 讨论的都是其他物种，偏离了 M. klissingiana 这个核心变量。',
  },
  {
    id: 6002,
    passage:
      'The Study on Global Ageing and Adult Health (SAGE) seeks to discover long-term trends related to aging by compiling and analyzing evidence from approximately 66,000 participants in multiple countries. As with most longitudinal studies, extensive funding support is needed for SAGE to collect the relevant data over timescales and at intervals that will support robust conclusions. But the quality of a more constrained investigation, such as a sociology study seeking only to yield the average age at which people in a given city first become parents, is much less dependent on high levels of funding because ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'such studies are likely to be a lower priority for funding than SAGE.',
      'the sociology study is unlikely to be able to recruit 66,000 participants.',
      'expanding the scope of such studies is unlikely to be feasible.',
      'such studies are not trying to identify trends over time.',
    ],
    answer: 3,
    explanation:
      '【Applying Principle 原理应用】原理：纵向研究需要长期追踪时间变化→需要大量资金。小规模调查只需单时间点数据→不需要长期资金（因为不追踪趋势）。D 精准抓住核心区别。A 讨论"优先级"而非"资金需求"；B 讨论的是样本量，但原��的核心是"是否追踪时间"而不是样本大小。',
  },
  {
    id: 6003,
    passage:
      'In dialects of English spoken in Scotland, the "r" sound is strongly emphasized when it appears at the end of syllables (as in "car") or before other consonant sounds (as in "bird"). English dialects of the Upland South, a region stretching from Oklahoma to western Virginia, place similar emphasis on "r" at the ends of syllables and before other consonant sounds. Historical records show that the Upland South was colonized largely by people whose ancestors came from Scotland. Thus, linguists have concluded that ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'the English dialects spoken in the Upland South acquired their emphasis on the "r" sound from dialects spoken in Scotland.',
      'emphasis on the "r" sound will eventually spread from English dialects spoken in the Upland South to dialects spoken elsewhere.',
      'the English dialects spoken in Scotland were influenced by dialects spoken in the Upland South.',
      'people from Scotland abandoned their emphasis on the "r" sound after relocating to the Upland South.',
    ],
    answer: 0,
    explanation:
      '【Abduction 溯因推理】观察结果：两地有相同语言特征 + 历史联系（Upland South 殖民者来自苏格兰）。反推最合理原因：特征随移民从苏格兰传到 Upland South。A 准确。B 预测未来；C 因果方向颠倒；D 与事实矛盾（特征没有消失）。',
  },
  {
    id: 6004,
    passage:
      'In September of 1989, Indonesia liberalized its stock market, meaning that it began allowing foreign individuals and businesses to invest money in Indonesian companies. This was part of a wave of stock market liberalizations around the world — Jamaica in 1991, Nigeria in 1995, and so on. The standard view among economists at the time was that liberalization would make it easier for companies to raise money from investors. Economist Peter Blair Henry examined the economies of 11 countries that were part of the liberalization wave and found that, on average, companies based in those countries received significant increases in investment in the three years following liberalization, suggesting that ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'companies in Jamaica experienced a greater increase in investment following liberalization than did companies in Indonesia.',
      'companies in the countries Henry studied did not benefit from liberalization until at least three years after liberalization occurred.',
      'economists who held the standard view of liberalization failed to anticipate some serious negative effects of liberalization.',
      "economists' expectations about the effect of liberalization on investment were largely correct for the countries Henry studied.",
    ],
    answer: 3,
    explanation:
      '【Prediction 预测推理】已知：经济学家预期自由化→投资增加。Henry 研究结果：自由化后三年投资显著增长。推断：预期基本正确。D 准确。A 文章没有比较不同国家；B "至少三年后才受益"是对原文的时间歪曲；C "负面效果"原文未提。',
  },
  {
    id: 6005,
    passage:
      'Mariana Lopes Barata and Pedro Simoes Coelho collected data from 324 music-streaming service users to identify factors that influence users to opt for paid (premium) versions of music streaming services, like Apple Music. They hypothesized that hedonic motivation (the enjoyment that a consumer perceives to be associated with using a service) would be positively correlated with users\' intentions to adopt premium versions. The researchers asked participants to rate statements such as "Using paid music streaming services is pleasant." They found that, indeed, hedonic motivation positively influences the intention to adopt premium streaming service versions, which suggests that ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'it may be advantageous for music streaming companies to try to influence the extent to which potential users perceive the premium version as pleasant to use.',
      'participants who strongly agreed with the statement "Using paid music streaming services is pleasant" were more likely to express loyalty to Apple Music than to other streaming services.',
      'the statement "Using paid music streaming services is pleasant" is not a reliable measure of hedonic motivation.',
      "users' intentions to pay for premium streaming services are probably unaffected by factors other than hedonic motivation.",
    ],
    answer: 0,
    explanation:
      '【Applying Principle 原理应用】研究发现：享乐动机越高→越可能付费。应用：公司应该增强用户对产品的愉悦感知。A 精准应用了研究发现。B "忠诚度"偷换概念（原研究是"使用意愿"）；C 与研究结论相反；D "不受其他因素影响"过于绝对。',
  },
  {
    id: 6006,
    passage:
      'Though longitudinal studies like the Northern Ireland Longitudinal Study (NILS), which has surveyed approximately 500,000 participants in Northern Ireland to find trends in public health, are expensive because they are conducted over many years, by spanning these time frames, they can reveal causal patterns. But studies for which cause and effect is not at issue, like a public opinion study that merely seeks to determine the proportion of a city\'s population that supports a particular tax proposal, can succeed without longitudinal methods, which means that ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'the public opinion study could likely be completed at a considerably lower cost than NILS.',
      'longitudinal methods would likely be less suitable for studies in public opinion than for studies in public health.',
      'longitudinal methods would likely be less expensive for studies in public opinion than for studies in public health.',
      'the results from NILS would likely be more reliable than those from the public opinion study.',
    ],
    answer: 0,
    explanation:
      '【Applying Principle 原理应用】原理：追踪因果趋势→需要长期方法→昂贵。民意调查只需比例→不需要长期方法→不需要那么多资金→成本更低。A 精准。B 讨论"适合性"而非成本；C 方向反了；D "可靠性比较"原文未涉及。',
  },
]

// ── 推断题 Level 2（渐入佳境 — Medium）──
const tuizhi_level2: ReadingQuestion[] = [
  {
    id: 6101,
    passage:
      'Arthurian legends derive from many sources, such as Annales Cambriae, composed around 970, and the Mabinogion from the 12th and 13th centuries. One of the most significant sources, Geoffrey of Monmouth\'s History of the Kings of Britain, was written in Latin in the 1130s; some material from it was later adapted by the Norman poet Wace into the Roman de Brut in 1155. But while no source before 1155 includes references to the famous Round Table at which Arthur\'s knights assembled, both the Roman de Brut and Sir Thomas Malory\'s 15th-century compilation of Arthurian Legends, Le Morte d\'Arthur, do. It can therefore be inferred that ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'Malory did not use Annales Cambriae as a source for information he presented about the Round Table.',
      "Geoffrey of Monmouth's accounts of Arthurian legends in his History are more similar overall in content to the accounts in the Mabinogion than they are to the accounts in Roman de Brut.",
      'Geoffrey of Monmouth was unaware of stories of the Round Table when composing his History, though historians know that works containing such stories were available to him.',
      "Le Morte d'Arthur is more historically accurate than History, because the Mabinogion had not been written when Geoffrey of Monmouth was writing his work.",
    ],
    answer: 0,
    explanation:
      '【时间线推断】Annales Cambriae 写于约 970 年，早于 1155 年，而原文明确说 1155 年前的文献都没有 Round Table 的记载。因此，Malory 不可能从 Annales Cambriae 获得有关 Round Table 的信息，A 正确。B 比较整体内容，原文未涉及；C 声称当时已有相关作品可供 Geoffrey 使用，与原文信息不符；D 对历史准确性作了无依据的判断。',
  },
  {
    id: 6102,
    passage:
      'The Harlem Renaissance, which gave us great literary works like May Miller\'s play The Bog Guide and nonliterary works like James Van Der Zee\'s photograph Couple, Harlem, is often said to have ended in the 1930s shortly after the Great Depression began. But some scholars argue that the Harlem Renaissance never really ended because it continues to shape culture in the United States today. These scholars therefore suggest that ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'if a cultural movement has both literary and nonliterary innovations, then it is likely to be influential.',
      'if a cultural movement is very innovative, then it is unlikely to be able to sustain itself for long.',
      "if the literary works of a cultural movement are influential, then it doesn't matter whether the nonliterary works are.",
      'if the influence of a cultural movement continues, then in some sense the movement itself continues.',
    ],
    answer: 3,
    explanation:
      '【Applying Principle 原理应用】学者论证：HR 的影响持续到今天 → 所以 HR 没有真正结束。这个论证暗含的原理：持续的影响 = 运动本身的持续。D 把这个原理明确陈述出来。A/B/C 都偏离了论证的核心逻辑链条。',
  },
  {
    id: 6103,
    passage:
      'Architects looking for inspiration may examine photographs of iconic buildings such as the Forbidden City in Beijing. A two-dimensional photograph, however, cannot capture how a building interacts with its surroundings, whether by complementing, blending in with, or perhaps even clashing with sights and activities nearby. An image of the Forbidden City thus ______',
    question: 'Which choice most logically completes the text?',
    options: [
      "serves to exaggerate the building's historical importance.",
      "fails to convey the full impact of the building's design and structure.",
      'misrepresents how the building is perceived by people who have never visited Beijing.',
      "conceals the subtle deterioration of the building's materials.",
    ],
    answer: 1,
    explanation:
      "【Evaluation 评价限定】照片的局限：无法捕捉建筑与周围环境的互动。结论限定：照片不能完整传达建筑的设计和结构效果。B 精准概括了这个局限。A \"夸大历史重要性\"无依据；C 范围太窄；D \"材料老化\"完全无关。",
  },
  {
    id: 6104,
    passage:
      "Anne Bronte's 1847 novel Agnes Grey contains elements drawn from Bronte's own life: there are many parallels between the experiences of the novel's title character and those of Bronte, and as a result Agnes Grey is regularly described as an autobiographical novel. This characterization can be useful, but it also presents drawbacks in terms of how the work is perceived, as it may lead readers to believe that Bronte merely fictionalized true events, which, in an artistic field where creativity and inventiveness are prized, can suggest that ______",
    question: 'Which choice most logically completes the text?',
    options: [
      'Agnes Grey is less of an imaginative achievement than it actually is.',
      'the real-world counterparts of other characters in Agnes Grey are hard to identify.',
      'Bronte should not have claimed that Agnes Grey is based on real events.',
      'critics disagree about whether Agnes Grey shows greater originality than works without autobiographical elements.',
    ],
    answer: 0,
    explanation:
      '【Evaluation 评价限定】"自传体"标签→读者以为只是记录事实→在崇尚创意的文艺领域→作品被低估想象力。A 精准：被认为不如实际上的想象力成就。B "其他角色难以识别"不是核心问题；C "不应该声称"是评价作者而非作品；D "评论家分歧"未在原文提及。',
  },
  {
    id: 6105,
    passage:
      'Researchers who study olfaction — the sense of smell — define valence as a person\'s perception of how pleasant an odor is. Conventional wisdom holds that valence is culturally mediated. A team of scientists led by Artin Arshamian evaluated this view by testing how people from ten different places — including the Mah Meri people from a small community in the Malay Peninsula and the Imbabura Quichua people from a small community in Ecuador — ranked ten odors from most pleasant to least pleasant. In general, respondents ranked scents similarly regardless of where they lived, overwhelmingly choosing the odorant linalool as more pleasant than mushroom alcohol. These results call into question the idea that ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'differences in olfactory valence may be attributable to differences in personal taste.',
      "a person's location has no influence on that person's olfactory valence for a given odor.",
      'olfactory valence is influenced by cultural traditions.',
      'olfactory valence can be objectively measured across cultures.',
    ],
    answer: 2,
    explanation:
      '【Paradox 悖论解释 + Evaluation 评价限定】传统观点：文化调节气味偏好。实验发现：不同文化的人对气味的排名相似。这个结果质疑了传统观点——如果文化调节，不同文化应该有不同排名。C 是被质疑的观点。A "个人品味差异"不是传统观点的核心；B 与实验结果一致（不是被质疑的）；D "客观测量"是另一个维度。',
  },
  {
    id: 6106,
    passage:
      'British professional soccer team Manchester United Football Club, whose home uniform color is mainly red, won more than half its home matches between 1947 and 2003. This is a higher proportion of home matches than Hull City Association Football Club, whose home uniform color is not red, won during the same period. According to a study by Martin J. Attrill and colleagues, the color red can cause people to respond with fear and hesitation, which the researchers think helps explain Manchester United\'s success. Nadav Goldschmied and colleagues reanalyzed the published data from this study, however, and found no evidence that red uniformed teams are more likely than other teams to win, suggesting that Manchester United\'s performance at its home stadium ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'would probably have remained roughly the same if its players had not been wearing red uniforms.',
      "was likely influenced by its opponents' associations with the color red.",
      "was directly tied to its players' general satisfaction with their uniform color.",
      'may have influenced other teams to change their uniform colors.',
    ],
    answer: 0,
    explanation:
      '【Paradox 悖论解释】矛盾：Attrill 研究→红色有助于赢球。Goldschmied 再分析→无证据表明红色队服更可能赢球。解释矛盾：曼联的高胜率与红色无关→不穿红色胜率也一样。A 准确。B 支持 Attrill（与 Goldschmied 矛盾）；C "球员满意度"是新变量；D 偏离核心争议。',
  },
]

// ── 推断题 Level 3（试试就逝世 — Hard）──
const tuizhi_level3: ReadingQuestion[] = [
  {
    id: 6201,
    passage:
      'In June of 1987, South Korea liberalized its stock market, meaning that it began allowing foreign individuals and businesses to invest money in South Korean companies. This was part of a wave of stock market liberalization from the mid-1980s through the mid-1990s — Brazil in 1988, Venezuela in 1990, and so on. In an analysis of economic data from 1976 to 1993, Ross Levine and Sara Zervos found that liberalization did not lead to enduring increases in investment in companies based in countries that liberalized. Peter Blair Henry, however, found that, on average, investment in companies in liberalized countries increased significantly in the three years following liberalization. Taken together, these results suggest that ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'investment growth is likely to be more consistent in countries that liberalize than in countries that do not.',
      'it typically takes at least three years for companies to benefit from government policies allowing foreign investment, but governments rarely maintain such policies for that long.',
      "economists' expectations about the effect of liberalization on investment were largely correct.",
      'companies based in countries that begin allowing foreign investment will probably see short-term increases in investment, but that their gains are unlikely to last.',
    ],
    answer: 3,
    explanation:
      '【Prediction 双研究调和】关键：两个研究的时间尺度不同。Levine & Zervos（1976-1993）：无持久增长（长期）。Henry：三年内显著增长（短期）。两者不矛盾——短期有效，长期不持久。D 精准综合了两个发现。A 无比较国数据；B "至少三年"和"rarely maintain"是原文没有的假设；C 只匹配 Henry 而忽略 Levine。',
  },
  {
    id: 6202,
    passage:
      "Some ethicists hold that the moral goodness of an individual's actions depends solely on whether the actions themselves are good, irrespective of the context in which they are carried out. Philosopher L. Sebastian Purcell has shown that surviving works of Aztec (Nahua) philosophy express a very different view. Purcell reveals that these works posit an ethical system in which an individual's actions are judged in light of how well they accord with the individual's role in society and how well they contribute to the community. To the extent that these works are representative of Aztec thought, Purcell's analysis suggests that ______",
    question: 'Which choice most logically completes the text?',
    options: [
      "the Aztecs would have disputed the idea that the morality of an individual's actions can be assessed by appealing to standards of behavior that are independent of the individual's social circumstances.",
      "the Aztecs would not have accepted the notion that the morality of an individual's actions can be fairly evaluated by people who do not live in the same society as that individual.",
      'actions by members of Aztec society who contributed a great deal to their community could be judged as morally good even if those actions were inconsistent with behaviors the Aztecs regarded as good in all contexts.',
      'similar actions performed by people in different social roles in Aztec society would have been regarded as morally equivalent unless those actions led to different outcomes for the community.',
    ],
    answer: 0,
    explanation:
      '【Applying Principle 哲学原理应用】对比：Context-independent ethics（行为本身决定道德）vs Aztec context-dependent ethics（社会角色+社区贡献）。Aztec 哲学反对脱离社会情境的道德判断。A 精准——Aztec 拒绝"独立于社会情境的行为标准"。B 过度推广（"必须住在同一社会才能评价"）；C 歪曲了原文逻辑；D 与 Aztec 观点相反（角色不同→评价不同）。',
  },
  {
    id: 6203,
    passage:
      'The National Environmental Policy Act (NEPA) requires US federal agencies to assess environmental effects of potential actions, such as building highways. While many NEPA reviews require public comment, categorical exclusions (CEs) allow quick reviews with no public comment for actions that will minimally affect the environment. In 2020 the rule governing CEs was revised: before, CEs could be granted for actions that "do not individually or cumulatively have a significant effect on the human environment," but the revised rule allowed CEs if actions "normally do not have a significant effect on the human environment." Environmentalists found this revision to be potentially detrimental because ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'the increasing need to build new highways and rehabilitate older highways in the US incentivizes agencies to grant CEs after 2020 for reasons that would not have been considered valid prior to 2020.',
      'the 2020 relaxation of the rule regarding CEs would permit more exclusions, resulting in more reviews of actions by federal agencies and a paradoxically slower review process.',
      'the rule that governed CEs before 2020 allowed expedited reviews of actions that might have significant effects on the environment if those effects were believed to be rare, while the 2020 revision of the rule subjected such actions to slower reviews.',
      'the 2020 revision of the rule governing CEs would allow expedited reviews of actions that had a minimal environmental effect when considered on their own but a significant effect when considered together.',
    ],
    answer: 3,
    explanation:
      '【Paradox 政策悖论】核心变量变化：旧规则用"do not individually or cumulatively have"（不考虑累积效应），新规则用"normally do not"（删除了 cumulatively）。这意味着：单独影响小但需要很多次、累积影响大的行动→旧规则不豁免→新规则可能豁免。D 精准识别了这个关键变化。A 引入"高速公路需求"外部因素；B 逻辑矛盾（CE 本身是加速审查）；C 混淆了新旧规则。',
  },
  {
    id: 6204,
    passage:
      'Ants and aphids are known to be mutualistic: ants feed on the honeydew produced by aphids, while aphids benefit from ants\' protection against predators. If aphid colonies — which generally require relatively stable surfaces, such as trees or other woody plants, to thrive — are too small to produce significant volumes of honeydew, however, ants will prey on aphids. Researcher Tae-sung Kwon examined ant and aphid abundance in two habitats in South Korea, one on the mainland and one on Jeju Island. Though the habitats differed in some important respects, both were predominantly grassland, which could help explain why Kwon observed ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'different ant and aphid species on the mainland compared to those on the island.',
      'a positive correlation between aphid diversity and abundance on both the mainland and the island.',
      'a negative correlation between ant and aphid abundance on both the mainland and the island.',
      'diminished ant and aphid abundance on the mainland compared to that on the island.',
    ],
    answer: 2,
    explanation:
      '【Prediction 条件嵌套推理】多层条件链：(1)草地缺乏树木→蚜虫群体小；(2)群体小→蜜露不足；(3)蜜露不足→蚂蚁从合作转为捕食；(4)捕食→蚂蚁多则蚜虫少（负相关）。C 精准推导出负相关。B 正相关是典型共生模式，但草地环境改变了模式。A/D 讨论物种差异而非关系方向。',
  },
  {
    id: 6205,
    passage:
      'The single origin hypothesis of iron metallurgy posits that the craft originated in Anatolia (West Asia) circa 2200-2000 BCE before diffusing to other parts of the world, including Africa. Some proponents of the hypothesis argue that iron production technologies first arrived in North Africa through Carthage, where the earliest evidence of ironworking dates to approximately 800-600 BCE, before these technologies spread to sub-Saharan Africa over the following centuries. However, excavation of multiple sites on the Adamawa plateau in Central Africa conducted by Etienne Zangato and Augustin Holl uncovered evidence of iron workshops that may have been in operation as late as 900-750 BCE in Gbabari and as early as 2300-1900 BCE in Oboui and Gbatoro. These findings suggest that ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'iron production may have originated in Anatolia much earlier than the available evidence currently indicates.',
      'iron production technologies were likely transmitted from Anatolia to Central Africa via an alternate route than the one suggested by some proponents of the single origin hypothesis.',
      'iron production technologies found in Gbabari likely derived directly from technologies transmitted from Anatolia, but those found in Oboui and Gbatoro did not.',
      'iron production may have developed independently and relatively simultaneously in Anatolia and parts of Central Africa.',
    ],
    answer: 3,
    explanation:
      '【Paradox 科学悖论】时间线矛盾：中非 Oboui/Gbatoro (2300-1900 BCE) 比 Anatolia 起源 (2200-2000 BCE) 还要早或同时。如果中非更早，就无法从 Anatolia 传播。D 最简洁解释：两地独立且大约同时发展。A 无证据支持往前推 Anatolia 年代；B 替代路径无法解释中非更早；C Gbabari 晚于 Anatolia，但 Oboui/Gbatoro 更早，逻辑不通。',
  },
  {
    id: 6206,
    passage:
      'Whistler waves are low-frequency plasma waves that on Earth are typically generated by lightning. Numerous recordings of whistler waves on Venus have led many scientists to suggest that the planet\'s atmosphere is host to extensive amounts of lightning, and, in fact, Venusian whistler waves have similar energy signatures to those of whistler waves generated by lightning on Earth. The majority of Venusian whistler wave data come from two spacecraft missions — the Pioneer Venus Orbiter (PVO) and the Venus Express (VEX) — which have included few observations of other phenomena consistent with lightning occurrences (such as flashes of light), leading other scientists to suggest that ______',
    question: 'Which choice most logically completes the text?',
    options: [
      'there are geophysical characteristics of Venus not shared with Earth that promote the generation of whistler waves.',
      'the purported Venusian whistler waves must actually be some other type of atmospheric activity than whistler waves.',
      'Venusian lightning has properties that make it unlikely to generate whistler waves.',
      'similarities in the energy signatures of Venusian and Earth whistler waves may reflect imprecisions in the PVO and VEX data.',
    ],
    answer: 0,
    explanation:
      '【Paradox 科学悖论】矛盾：Venus 有 whistler waves（地球上由闪电产生）→但缺少闪电的其他证据（如闪光）。最佳解释：Venus 上有其他机制（非闪电）也能产生 whistler waves。A 直接提出替代机制—不同的地球物理特征。B "must be"太绝对；C 与"相似能量特征"矛盾；D 质疑数据，不如 A 简洁。',
  },
]

// ============================================================
//  题目数据映射 — 后续新增 topic/level 在这里添加
// ============================================================
export const topicData: Record<string, Record<string, ReadingQuestion[]>> = {
  zhuzhi: {
    level1: zhuzhi_level1,
    level2: zhuzhi_level2,
    level3: zhuzhi_level3,
  },
  chongci_zhuzhi: {
    level1: chongci_zhuzhi_level1,
  },
  // FSP 拆分的三个子题型（难题集专用）
  huaxianmudi: {
    level1: fsp_huaxian_level1,
    level2: fsp_huaxian_level2,
    level3: fsp_huaxian_level3,
  },
  quanwenjiegou: {
    level1: fsp_jiegou_level1,
    level2: fsp_jiegou_level2,
    level3: fsp_jiegou_level3,
  },
  quanwenzhuzhi: {
    level1: fsp_zhuzhi_level1,
    level2: fsp_zhuzhi_level2,
    level3: fsp_zhuzhi_level3,
  },
  tubiaoti: {
    level1: tubiaoti_level1,
  },
  tuizhi: {
    level1: tuizhi_level1,
    level2: tuizhi_level2,
    level3: tuizhi_level3,
  },
}

export const topicNames: Record<string, string> = {
  zhuzhi: '主旨与细节题',
  chongci_zhuzhi: '冲刺班 · 全文主旨题',
  huaxianmudi: '划线目的题',
  quanwenjiegou: '全文结构题',
  quanwenzhuzhi: '全文主旨题',
  tubiaoti: '图表题',
  tuizhi: '推断题',
}

export const levelNames: Record<
  string,
  { name: string; label: string; color: string; bg: string; border: string }
> = {
  level1: { name: 'Level 1', label: '新手保护期', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-300' },
  level2: { name: 'Level 2', label: '渐入佳境', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950', border: 'border-amber-300' },
  level3: { name: 'Level 3', label: '试试就逝世', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-300' },
}
