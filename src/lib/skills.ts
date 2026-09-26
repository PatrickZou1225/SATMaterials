// Chinese labels for the knowledge points tagged onto every question (see
// scripts/veritas/skills.mjs for how the tags are derived). Teachers pick
// assignments by these labels, so the Chinese name comes first and the canonical
// English skill is kept alongside it.

export const DOMAIN_ORDER = [
  'Information and Ideas',
  'Craft and Structure',
  'Expression of Ideas',
  'Standard English Conventions',
]

const DOMAIN_LABELS: Record<string, string> = {
  'Information and Ideas': '信息与观点',
  'Craft and Structure': '技巧与结构',
  'Expression of Ideas': '观点表达',
  'Standard English Conventions': '标准英语规范',
}

const SKILL_LABELS: Record<string, string> = {
  'Central Ideas and Details-Main Ideas': '主旨与细节 · 主旨',
  'Central Ideas and Details-Details': '主旨与细节 · 细节',
  'Central Ideas and Details-Summary': '主旨与细节 · 概括',
  'Command of Evidence-Textual Evidence (illustration/quotation)': '文本循证 · 引用/举例',
  'Command of Evidence-Textual Evidence (strengthen/weaken)': '文本循证 · 加强/削弱',
  'Command of Evidence-Quantitative Evidence': '定量循证 · 图表/数据',
  'Inferences-Making Logical Inferences': '推断 · 逻辑推断',
  'Inferences-Interpreting Implied Meanings': '推断 · 隐含含义',
  "Inferences-Inferring Author's Tone, Attitude, or Purpose": '推断 · 语气/态度/目的',

  'Words in Context-Precise Word Meanings': '词义题 · 精准词义',
  'Words in Context-Distinguishing Among Nuanced Synonyms': '词义题 · 近义词辨析',
  'Words in Context-Rhetorical Word Choice': '词义题 · 修辞性选词',
  "Text Structure and Purpose-Determining Author's Purpose": '结构与目的 · 作者目的',
  'Text Structure and Purpose-Text Structure': '结构与目的 · 文本结构',
  'Text Structure and Purpose-Part-Whole Relationships': '结构与目的 · 局部与整体',
  'Text Structure and Purpose-Argument Development and Logical Organization': '结构与目的 · 论证展开',
  "Cross-Text Connections-Comparing and Contrasting Authors' Perspectives": '双篇 · 观点对比',
  'Cross-Text Connections-Analyzing How One Text Relates to Another': '双篇 · 篇间关系',

  'Rhetorical Synthesis-Logical Combination of Information': '修辞综合 · 信息整合',
  'Rhetorical Synthesis-Evaluating Relevance of Information (Add/Delete)': '修辞综合 · 信息取舍',
  'Rhetorical Synthesis-Revising for Effective Introductions/Conclusions': '修辞综合 · 开头/结尾',
  'Transitions-Logical Transition Words and Phrases': '逻辑连接 · 过渡词',
  'Transitions-Cohesion and Coherence Between Sentences': '逻辑连接 · 句间连贯',

  'Boundaries-Punctuation': '句子边界 · 标点',
  'Boundaries-Sentence Completeness': '句子边界 · 句完整性',
  'Boundaries-Possessive Nouns and Plural Forms': '句子边界 · 所有格/复数',
  'Form, Structure, and Sense-Verb Tense, Aspect, and Mood': '形式与意义 · 动词时态语态',
  'Form, Structure, and Sense-Subject-Verb Agreement': '形式与意义 · 主谓一致',
  'Form, Structure, and Sense-Pronoun-Antecedent Agreement and Clarity': '形式与意义 · 代词指代',
  'Form, Structure, and Sense-Conventional Expression': '形式与意义 · 惯用法',

  // Tags that name only a skill family (no sub-skill).
  'Words in Context': '词义题',
  'Text Structure and Purpose': '结构与目的',
  'Rhetorical Synthesis': '修辞综合',
  'Transitions': '逻辑连接',
  'Boundaries': '句子边界',
  'Form, Structure, and Sense': '形式与意义',
}

export const domainLabel = (domain?: string) => (domain ? DOMAIN_LABELS[domain] ?? domain : '未分类')

export const skillLabel = (skill?: string) => (skill ? SKILL_LABELS[skill] ?? skill : '未标注知识点')
