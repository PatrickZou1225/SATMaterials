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
}

export const topicNames: Record<string, string> = {
  zhuzhi: '主旨与细节题',
  chongci_zhuzhi: '冲刺班 · 全文主旨题',
  huaxianmudi: '划线目的题',
  quanwenjiegou: '全文结构题',
  quanwenzhuzhi: '全文主旨题',
}

export const levelNames: Record<
  string,
  { name: string; label: string; color: string; bg: string; border: string }
> = {
  level1: { name: 'Level 1', label: '新手保护期', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-300' },
  level2: { name: 'Level 2', label: '渐入佳境', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950', border: 'border-amber-300' },
  level3: { name: 'Level 3', label: '试试就逝世', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-300' },
}
