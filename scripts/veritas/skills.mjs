// Canonical SAT Reading & Writing knowledge points (知识点), used to tag every
// question so the assignment composer can assign by skill. Veritas embeds its
// classification in the captured page text after 添加知识点, but the blob is a
// concatenation of internal tags (e.g. "Transitions - EasyTransitions-Logical
// Transition Words and Phrases", "词汇题(逻辑)Words in Context-Precise Word
// Meanings"), so we normalize it and keep the longest canonical label that
// appears — that is the one Veritas appended last, and the authoritative one.

const DOMAIN = {
  info: 'Information and Ideas',
  craft: 'Craft and Structure',
  expression: 'Expression of Ideas',
  conventions: 'Standard English Conventions',
}

// Finest available label: domain + skill + sub-skill.
const SKILLS = [
  [DOMAIN.info, 'Central Ideas and Details-Main Ideas'],
  [DOMAIN.info, 'Central Ideas and Details-Details'],
  [DOMAIN.info, 'Central Ideas and Details-Summary'],
  [DOMAIN.info, 'Command of Evidence-Textual Evidence (illustration/quotation)'],
  [DOMAIN.info, 'Command of Evidence-Textual Evidence (strengthen/weaken)'],
  [DOMAIN.info, 'Command of Evidence-Quantitative Evidence'],
  [DOMAIN.info, "Inferences-Inferring Author's Tone, Attitude, or Purpose"],
  [DOMAIN.info, 'Inferences-Making Logical Inferences'],
  [DOMAIN.info, 'Inferences-Interpreting Implied Meanings'],

  [DOMAIN.craft, 'Words in Context-Precise Word Meanings'],
  [DOMAIN.craft, 'Words in Context-Distinguishing Among Nuanced Synonyms'],
  [DOMAIN.craft, 'Words in Context-Rhetorical Word Choice'],
  [DOMAIN.craft, "Text Structure and Purpose-Determining Author's Purpose"],
  [DOMAIN.craft, 'Text Structure and Purpose-Text Structure'],
  [DOMAIN.craft, 'Text Structure and Purpose-Part-Whole Relationships'],
  [DOMAIN.craft, 'Text Structure and Purpose-Argument Development and Logical Organization'],
  [DOMAIN.craft, "Cross-Text Connections-Comparing and Contrasting Authors' Perspectives"],
  [DOMAIN.craft, 'Cross-Text Connections-Analyzing How One Text Relates to Another'],

  [DOMAIN.expression, 'Rhetorical Synthesis-Logical Combination of Information'],
  [DOMAIN.expression, 'Rhetorical Synthesis-Evaluating Relevance of Information (Add/Delete)'],
  [DOMAIN.expression, 'Rhetorical Synthesis-Revising for Effective Introductions/Conclusions'],
  [DOMAIN.expression, 'Transitions-Logical Transition Words and Phrases'],
  [DOMAIN.expression, 'Transitions-Cohesion and Coherence Between Sentences'],

  [DOMAIN.conventions, 'Boundaries-Punctuation'],
  [DOMAIN.conventions, 'Boundaries-Sentence Completeness'],
  [DOMAIN.conventions, 'Boundaries-Possessive Nouns and Plural Forms'],
  [DOMAIN.conventions, 'Form, Structure, and Sense-Verb Tense, Aspect, and Mood'],
  [DOMAIN.conventions, 'Form, Structure, and Sense-Subject-Verb Agreement'],
  [DOMAIN.conventions, 'Form, Structure, and Sense-Pronoun-Antecedent Agreement and Clarity'],
  [DOMAIN.conventions, 'Form, Structure, and Sense-Conventional Expression'],
]

// Tags that name a skill family but no sub-skill, plus the bare family names
// Veritas sometimes emits alone (e.g. "Rhetorical Synthesis - Medium"). Mapped
// to a canonical label so the assignable buckets stay few and stable. The
// difficulty suffix is stripped by BASE_TAGS below.
const BASE = [
  ['Information and Ideas-Quantitative Evidence', DOMAIN.info, 'Command of Evidence-Quantitative Evidence'],
  ['Craft and Structure-Text Structure and Purpose', DOMAIN.craft, 'Text Structure and Purpose'],
  ['Craft and Structure-Words in Context', DOMAIN.craft, 'Words in Context'],
  ['Expression of Ideas-Rhetorical Synthesis', DOMAIN.expression, 'Rhetorical Synthesis'],
  ['Expression of Ideas-Transitions', DOMAIN.expression, 'Transitions'],
  ['Standard English Conventions-Boundaries', DOMAIN.conventions, 'Boundaries'],
  ['Standard English Conventions-Form, Structure, and Sense', DOMAIN.conventions, 'Form, Structure, and Sense'],
  ['Standard English Conventions-Form', DOMAIN.conventions, 'Form, Structure, and Sense'],

  // Bare family names, which Veritas pairs with a difficulty ("X - Medium").
  ['Rhetorical Synthesis', DOMAIN.expression, 'Rhetorical Synthesis'],
  ['Transitions', DOMAIN.expression, 'Transitions'],
  ['Boundaries', DOMAIN.conventions, 'Boundaries'],
  ['Form, Structure, and Sense', DOMAIN.conventions, 'Form, Structure, and Sense'],
  ['Words in Context', DOMAIN.craft, 'Words in Context'],
  ['Text Structure and Purpose', DOMAIN.craft, 'Text Structure and Purpose'],
]

const strip = (value) =>
  String(value || '')
    .replace(/[​‌‍﻿]/g, '')
    .normalize('NFKC')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    // Comma spacing is inconsistent in the source ("Tone, Attitude" vs
    // "Tone,Attitude"), so drop it on both sides before comparing.
    .replace(/,\s*/g, ',')

// Match on the stripped form; emit the original label so the stored skill keeps
// its proper spacing ("Form, Structure, and Sense-...").
const BY_LENGTH = SKILLS.map(([domain, skill]) => [strip(skill), domain, skill]).sort(
  (a, b) => b[0].length - a[0].length,
)
const BASE_ORDERED = BASE.flatMap(([tag, domain, skill]) =>
  [...new Set([tag, `${tag} - Easy`, `${tag} - Medium`, `${tag} - Hard`])].map((variant) => [
    strip(variant),
    domain,
    skill,
  ]),
).sort((a, b) => b[0].length - a[0].length)

const BLOB = /添加知识点\s+(.+?)\s+题目信息/

// Returns { domain, skill } for a raw Veritas record, or null when untagged.
export const inferSkill = (record) => {
  const text = `${record.rawText || ''} ${record.explanation || ''}`
  const match = BLOB.exec(text)
  if (!match) return null
  const blob = strip(match[1])
  for (const [needle, domain, skill] of BY_LENGTH) {
    if (blob.includes(needle)) return { domain, skill }
  }
  for (const [tag, domain, skill] of BASE_ORDERED) {
    if (blob.includes(tag)) return { domain, skill }
  }
  return null
}
