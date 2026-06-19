export interface KnowledgeBaseEntry {
  id: string
  title: string
  description: string
  content: string
  tags: string[]
}

const knowledgeBaseSearch: KnowledgeBaseEntry[] = [
  // ── 从知识库 markdown 文件提取的 SAT 阅读核心概念 ──
  {
    id: 'kb-vocab',
    title: '词汇题 (Words in Context)',
    description: 'SAT 词汇题考查在特定语境中精确理解词语含义的能力，不是考背过多少单词。',
    content: '核心概念：SAT 词汇题考查你是否能在一个语境中精确理解词语的含义。不是考你背过多少单词，而是考你是否理解词语在这个具体句子里的精确含义。已收录词汇：meticulous 一丝不苟的，ambiguous 模糊的有歧义的，pragmatic 务实的注重实际的。考查方式：直接问近义词、语境中词义、词义辨析。解题策略：不认识的词回忆词根词缀，认识的词不要只看中文翻译注意英文原义细微差别，排除法。易错陷阱：中文翻译的偏差（ambiguous 和 vague 都翻译成模糊但意思不同），感情色彩搞反（pragmatic 是中性偏褒义不是贬义）。',
    tags: ['词汇', '语境', 'SAT阅读', 'Craft and Structure', '词汇题', 'Words in Context']
  },
  {
    id: 'kb-main-idea',
    title: '主旨与细节题 (Central Ideas and Details)',
    description: '概括文本核心信息，区分主旨与细节，识别作者核心观点。',
    content: '核心概念：主旨题问"这文本在说什么"，细节题问"文中哪句话说了这个"。文本类型：科学发现型（新研究推翻旧观点）、假说验证型（提出假说→实验→结论）、对比论证型（两种观点对比）、文学文本型（人物情感变化）。解题策略：读完全文在脑中用自己的话说出主旨，问自己"如果只能告诉别人一句话这篇文章说了什么"。正确选项通常是原文逻辑链的最简洁概括。错误选项模式：方向颠倒（原文支持选项说反对）、无中生有（原文没提的绝对化表述）、范围改变（偷换概念或张冠李戴）、绝对化（原文说可能选项说确认）。',
    tags: ['主旨', '细节', 'SAT阅读', 'Information and Ideas', 'Central Ideas', '主旨题', '细节题']
  },
  {
    id: 'kb-rhetoric',
    title: '修辞目的题 (Text Structure and Purpose)',
    description: '判断句子在文本中的功能与作用，分析作者为什么写这句话。',
    content: '核心概念：修辞目的题问的是"作者为什么写这句话"或"这句话在文中起什么作用"。解题策略：先定位问题问的是哪句话，读这句话+前一句+后一句，判断关系（引出下文？承接上文？建立对比？举例说明？）。整体结构题：把文章分成两个动作（先做什么后做什么）再匹配选项。常见文本结构模式：概述→例子、问题→方案、现象→解释、观点→反驳。易错陷阱：功能方向搞反（引出下文说成总结上文）、结构描述半对半错（动词在原文无对应）。',
    tags: ['修辞目的', '文本结构', 'SAT阅读', 'Craft and Structure', 'Text Structure', '修辞目的题', 'FSP目的题']
  },
  {
    id: 'kb-cross-text',
    title: '双篇关系题 (Cross-Text Connections)',
    description: '比较两篇文本的观点关系，判断一致、不一致或部分一致。',
    content: '核心概念：双篇题考查两篇文章观点的关系。四种关系类型：补充（Text 2 补充 Text 1 未考虑的因素）、挑战（Text 2 直接质疑 Text 1 的结论或方法）、限定（Text 2 部分同意但增加条件）、方法论分歧（双方用不同方法得出不同结论）。解题策略：分别用一句话概括 Text 1 和 Text 2 的核心立场，判断关系方向（一致/不一致/部分一致）。排除张冠李戴（A的观点安到B头上）、程度搞错（补充≠彻底否定）、杜撰观点（选项说Text 2持某个立场但Text 2根本没提）。',
    tags: ['双篇', '对比', 'SAT阅读', 'Cross-Text', '双篇关系题', '双篇题']
  },
  {
    id: 'kb-inference',
    title: '推断题 (Inferences)',
    description: '基于文本信息进行合理的逻辑推断，补全推理链。',
    content: '核心概念：推断题要求基于文本信息进行逻辑推理，补全推理链的最后一环。解题策略：找到文中离破折号最近的逻辑前提，判断推理方向（原因→结果？证据→结论？机制→推演？）。选项必须被前文逻辑必然地推出，不能只是"可能"。排除跨度过大的（原文只说相关选项说因果）、方向反了的、偷换话题的。易错陷阱：过度推断（原文说可能选项说必然）、推理方向反了（原文说需要增加选项说减少）。',
    tags: ['推断', '推理', 'SAT阅读', 'Information and Ideas', 'Inferences', '推断题']
  },
  {
    id: 'kb-strategies',
    title: 'SAT 阅读通用策略',
    description: '时间管理、读文顺序、排除法、标注技巧等通用解题方法。',
    content: '时间管理：每道题建议不超过1.5分钟，遇到卡壳的题先标记（Flag）做完一轮再回来看。读文顺序：推荐题干→文章→选项。先读题干知道要问什么带着目的读文章，读文章抓结构和逻辑链不纠结生词，看选项用排除法。不推荐先读选项再读文章（容易被错误选项带偏）。排除法四步：排除反义的（看方向支持/反对增加/减少）、排除绝对化的（找 only/all/must/first/confirmed）、排除无中生有的（在原文找不到依据）、二选一比较（剩两个时选更贴合原文措辞的）。做记号：However/But/Yet转折后面是重点，Therefore/Thus/Hence结论句，For example例子服务于观点，propose/suggest/hypothesize假说不是事实。不确定时：优先选更窄的选项（范围小的通常更安全）、优先选更温和的选项（may/suggest 比 must/prove 更可能正确）。',
    tags: ['策略', '时间管理', '排除法', 'SAT阅读', '通用策略', '解题方法']
  },
  {
    id: 'kb-traps',
    title: 'SAT 阅读易错陷阱汇总',
    description: '九种在所有题型中反复出现的陷阱类型及识别方法。',
    content: '陷阱分类：1.方向颠倒（选项说反了文中的意思最常见也最容易排除）；2.绝对化（原文是可能/提出选项说确认/证明）；3.无中生有（选项里出现了原文根本没提到的内容）；4.偷换概念（用相近但不同的概念替换原文）；5.部分正确≠完全正确（部分信息对但混杂了一处错误）；6.背景知识干扰（用自己的常识而不是文章内容来答题）；7.结构题特有陷阱（功能方向搞反、结构描述半对半错）；8.双篇题特有陷阱（杜撰观点、程度搞错、张冠李戴）；9.推断题特有陷阱（过度推断、推理方向反了）。识别方法：每选一个选项都问自己"这个答案的依据是文章里哪一句话？"',
    tags: ['陷阱', '易错', 'SAT阅读', '避坑', '排除法', '常见错误']
  },
  {
    id: 'kb-cross-refs',
    title: 'SAT 阅读跨题型关联',
    description: '不同题型之间的共同逻辑和底层能力要求。',
    content: '贯穿所有题型的底层能力：读懂文本→定位信息→逻辑推理→排除干扰→选出最优。不同题型的区别只在于哪个环节是重点。跨文本类型的共同逻辑：科学文本和历史文本都有假说-证据-结论的逻辑链，都考察作者观点vs作者引用的他人观点的区分，都容易出现过度推断式错误选项。诗歌和散文都使用比喻/类比作为核心表达手段，都需要区分字面意思和比喻含义，错误选项往往在字面意思上做手脚。',
    tags: ['跨题型', '底层能力', 'SAT阅读', '逻辑推理', '关联']
  },

  // ── 从 Knowledge.tsx 提取的专题知识点 ──
  {
    id: 'topic-grammar-1',
    title: '文法 — 主谓一致',
    description: '掌握主语与谓语动词在数和人称上的一致关系',
    content: '单数/复数主语判断、不定代词的主谓一致、倒装句中的主谓一致、集体名词的用法',
    tags: ['文法', '主谓一致', '语法', 'Writing', 'Standard English Conventions']
  },
  {
    id: 'topic-grammar-2',
    title: '文法 — 动词时态与语态',
    description: '正确使用各种时态，区分主动与被动语态',
    content: '一般/进行/完成时态、过去与现在的时态切换、被动语态的构成、虚拟语气基础',
    tags: ['文法', '时态', '语态', '语法', 'Writing']
  },
  {
    id: 'topic-grammar-3',
    title: '文法 — 标点符号',
    description: '逗号、分号、冒号、破折号等的正确用法',
    content: '逗号的常见用法、分号连接独立分句、冒号引出解释、破折号的强调作用',
    tags: ['文法', '标点', '语法', 'Writing', 'Punctuation']
  },
  {
    id: 'topic-grammar-4',
    title: '文法 — 句子结构',
    description: '识别并修正句子碎片、连写句和平行结构问题',
    content: '句子碎片修正、连写句与逗号拼接、平行结构、修饰语的正确位置',
    tags: ['文法', '句子结构', '语法', 'Writing']
  },
  {
    id: 'topic-grammar-5',
    title: '文法 — 代词与指代',
    description: '确保代词指代清晰明确，避免歧义',
    content: '代词与先行词一致、模糊指代的修正、关系代词的选择、反身代词的用法',
    tags: ['文法', '代词', '指代', '语法', 'Writing']
  },
  {
    id: 'topic-reading-1',
    title: '阅读 — 主旨与细节题',
    description: '把握文章核心观点，定位关键细节信息',
    content: 'SAT阅读主旨题考查对文章核心观点的理解和概括能力，细节题考查定位和还原关键信息的能力。三个难度等级：Level 1 新手保护期、Level 2 渐入佳境、Level 3 试试就逝世。',
    tags: ['阅读', '主旨', '细节', 'Central Ideas', '阅读专项']
  },
  {
    id: 'topic-reading-2',
    title: '阅读 — FSP目的题',
    description: '分析作者写作意图与文本功能目的',
    content: 'FSP目的题考查对文本中特定句子或段落功能的理解，包括引出下文、总结上文、建立对比、举例说明等功能。',
    tags: ['阅读', '修辞目的', 'FSP', 'Text Structure', '阅读专项']
  },
  {
    id: 'topic-reading-3',
    title: '阅读 — 文学文本题',
    description: '理解小说、诗歌等文学作品的叙事技巧与主题',
    content: '文学文本题涉及小说、诗歌、戏剧等文学体裁，考查叙事视角、人物塑造、比喻意象、情感基调等文学分析能力。',
    tags: ['阅读', '文学', '诗歌', '小说', 'Literature', '阅读专项']
  },
  {
    id: 'topic-reading-4',
    title: '阅读 — 双篇题',
    description: '比较两篇文章的观点异同与逻辑关系',
    content: '双篇题要求同时阅读两篇短文，比较它们的观点关系（一致、对立、补充、限定），是SAT阅读中难度较高的题型。',
    tags: ['阅读', '双篇', '对比', 'Cross-Text', '阅读专项']
  },
  {
    id: 'topic-reading-5',
    title: '阅读 — 图表题',
    description: '结合图表数据与文本信息进行综合分析',
    content: '图表题要求将表格或图表中的定量信息与文本中的定性信息结合起来分析，考查数据解读和综合推理能力。',
    tags: ['阅读', '图表', '数据', 'Quantitative', '阅读专项']
  },
  {
    id: 'topic-reading-6',
    title: '阅读 — 推断题',
    description: '基于文本信息进行合理的逻辑推断',
    content: '推断题考查从已知信息推导未知信息的能力，需要识别文本中的逻辑链并判断哪个结论可以被必然推出。',
    tags: ['阅读', '推断', '推理', 'Inferences', '阅读专项']
  },
  {
    id: 'topic-reading-7',
    title: '阅读 — 循证题',
    description: '从文中找到支持特定结论的证据',
    content: '循证题（Command of Evidence）要求从文本中找出最能支持或削弱某个结论的具体证据，考查证据评估能力。',
    tags: ['阅读', '循证', '证据', 'Command of Evidence', '阅读专项']
  },
  {
    id: 'topic-reading-8',
    title: '阅读 — 例证题',
    description: '理解作者使用例子的目的与论证效果',
    content: '例证题考查理解作者为什么使用某个具体例子，以及这个例子如何服务于整体论证结构。',
    tags: ['阅读', '例证', '论证', '阅读专项']
  },
  {
    id: 'topic-reading-9',
    title: '阅读 — 语境词汇题',
    description: '根据上下文推断词汇在特定语境中的含义',
    content: '语境词汇题（Words in Context）考查在特定上下文中精确理解词语含义的能力。重点不是背单词，而是利用上下文线索（对比信号、冒号解释、因果逻辑等）推断词义。',
    tags: ['阅读', '词汇', '语境', 'Words in Context', '阅读专项']
  },
  {
    id: 'topic-reading-10',
    title: '阅读 — 逻辑词汇填空题',
    description: '选择最恰当的逻辑词汇完成文本，把握句间逻辑关系',
    content: '逻辑词汇填空题（Words in Logic）考查选择最逻辑精确的词语完成文本。核心方法：先识别同向/反向逻辑信号（反向优先扫描），再预测填空方向，最后匹配选项。同向信号包括冒号、因果、例证，反向信号包括 but/however/although/despite/while/unlike/rather than。还需注意词汇搭配（collocation）和语义精准度（precision）。',
    tags: ['阅读', '逻辑', '词汇填空', 'Words in Logic', '阅读专项', '逻辑词汇']
  },
  // ── 数学专题 ──
  {
    id: 'topic-math-1',
    title: '数学 — 线性方程与不等式',
    description: '一元一次方程、不等式及线性函数的应用',
    content: '方程的解法、不等式的求解与图示、线性函数的斜率与截距、方程组的求解',
    tags: ['数学', '线性方程', '不等式', 'Math', 'Heart of Algebra']
  },
  {
    id: 'topic-math-2',
    title: '数学 — 二次方程与高级代数',
    description: '二次方程、多项式与高次函数',
    content: '因式分解、求根公式、顶点式与标准式、多项式运算',
    tags: ['数学', '二次方程', '代数', 'Math', 'Passport to Advanced Math']
  },
  {
    id: 'topic-math-3',
    title: '数学 — 数据分析与统计',
    description: '统计量的计算与数据图表的分析',
    content: '均值、中位数、众数、标准差与数据分布、散点图与趋势线、概率基础',
    tags: ['数学', '数据分析', '统计', 'Math', 'Problem Solving and Data Analysis']
  },
  {
    id: 'topic-math-4',
    title: '数学 — 几何与三角',
    description: '平面几何、立体几何与三角函数基础',
    content: '勾股定理、圆的方程与性质、三角函数基础、面积与体积计算',
    tags: ['数学', '几何', '三角', 'Math', 'Additional Topics']
  },
  {
    id: 'topic-math-5',
    title: '数学 — 比率、比例与百分比',
    description: '实际问题中的比率、比例与百分比应用',
    content: '比例关系的建立、百分比增减计算、单位换算、实际应用题',
    tags: ['数学', '比率', '比例', '百分比', 'Math']
  },
  // ── 难题集班级 ──
  {
    id: 'class-nenghan',
    title: '能夯班 — 基础夯实',
    description: '系统构建SAT知识体系，夯实各科基础',
    content: '能夯班面向SAT基础阶段学员，系统讲解数学、阅读、文法的核心知识点和解题方法。适合刚开始准备SAT或基础薄弱的学生。',
    tags: ['班级', '基础', '能夯班', '夯实']
  },
  {
    id: 'class-qianghua',
    title: '强化班 — 专项突破',
    description: '强化训练，突破薄弱环节与中高难度题型',
    content: '强化班针对已有一定基础的学员，通过大量中等难度题目的训练，突破薄弱环节，提升解题速度和准确率。',
    tags: ['班级', '强化', '强化班', '突破']
  },
  {
    id: 'class-chongci',
    title: '冲刺班 — 考前冲刺',
    description: '考前冲刺，高频难题集中突破',
    content: '冲刺班针对考前1-2个月的学员，集中攻克高频难题和易错题型，模拟真实考试节奏，冲刺高分。',
    tags: ['班级', '冲刺', '冲刺班', '考前']
  },
  {
    id: 'class-mijuan',
    title: '密卷班 — 真题演练',
    description: '模拟真题难度与出题思路，密卷演练',
    content: '密卷班使用高仿真模拟题，完全按照SAT真实考试难度和出题思路设计，帮助学员熟悉考试节奏和陷阱。',
    tags: ['班级', '密卷', '密卷班', '真题', '模考']
  },
]

export default knowledgeBaseSearch
