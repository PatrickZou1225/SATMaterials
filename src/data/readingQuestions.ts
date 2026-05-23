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

// ============================================================
//  题目数据映射 — 后续新增 topic/level 在这里添加
// ============================================================
export const topicData: Record<string, Record<string, ReadingQuestion[]>> = {
  zhuzhi: {
    level1: zhuzhi_level1,
    level2: zhuzhi_level2,
    level3: zhuzhi_level3,
  },
}

export const topicNames: Record<string, string> = {
  zhuzhi: '主旨与细节题',
}

export const levelNames: Record<
  string,
  { name: string; label: string; color: string; bg: string; border: string }
> = {
  level1: { name: 'Level 1', label: '新手保护期', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-300' },
  level2: { name: 'Level 2', label: '渐入佳境', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950', border: 'border-amber-300' },
  level3: { name: 'Level 3', label: '试试就逝世', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-300' },
}
