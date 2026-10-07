#!/usr/bin/env node
// Parse College Board official SAT question-bank PDFs into structured JSON.
// Uses `pdftotext -raw` (clean prose, intact apostrophes) for text, and
// `pdftotext -layout` (aligned columns) to detect/reconstruct tables later.
//
// Usage: node scripts/parse-official-samples.mjs "/path/to/SAT 官方样题"
// Writes one JSON file per question type into data/official-samples/.

import { execFileSync } from 'node:child_process'
import { readdirSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join, basename } from 'node:path'

const SRC = process.argv[2]
const OUT = new URL('../data/official-samples/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })

// Canonical skill metadata per PDF filename (uppercase key).
const SKILLS = {
  'BOUNDARIES': { skill: 'Boundaries', domain: 'Standard English Conventions', label: '句子边界' },
  'CENTRAL IDEAS AND DETAILS': { skill: 'Central Ideas and Details', domain: 'Information and Ideas', label: '主旨与细节' },
  'COMMAND OF EVIDENCE': { skill: 'Command of Evidence', domain: 'Information and Ideas', label: '循证' },
  'CROSS TEXT CONNECTIONS': { skill: 'Cross-Text Connections', domain: 'Craft and Structure', label: '双篇关联' },
  'FORM, STRUCTURE, AND SENSE': { skill: 'Form, Structure, and Sense', domain: 'Standard English Conventions', label: '形式与意义' },
  'INFERENCES': { skill: 'Inferences', domain: 'Information and Ideas', label: '推断' },
  'RHETORICAL SYNTHESIS': { skill: 'Rhetorical Synthesis', domain: 'Expression of Ideas', label: '修辞综合' },
  'TEXT STRUCTURE AND PURPOSE': { skill: 'Text Structure and Purpose', domain: 'Craft and Structure', label: '文本结构与目的' },
  'TRANSITIONS': { skill: 'Transitions', domain: 'Expression of Ideas', label: '逻辑连接' },
  'WORDS IN CONTEXT': { skill: 'Words in Context', domain: 'Craft and Structure', label: '语境词汇' },
}

// A question's task sentence ("Which choice…", "According to…", …) always starts
// with one of these. We split the passage from the stem by taking the LAST such
// line in the "Question" block.
const STEM_START = /^(which|what|how|why|when|where|who\b|the student wants|as used in the text|based on\b|according to\b)/i

const ANSWER_LETTER = { A: 0, B: 1, C: 2, D: 3 }

function titleCase(name) {
  return name
    .split(/\s+/)
    .map((w) => (['and', 'of', 'to', 'in', 'the'].includes(w.toLowerCase()) ? w.toLowerCase() : w[0] + w.slice(1).toLowerCase()))
    .join(' ')
}

function parseFilename(f) {
  // e.g. "WORDS IN CONTEXT (EASY).pdf" / "CROSS TEXT CONNECTIONS (EASY.pdf" (missing paren)
  const m = f.match(/^(.+?)\s*\(?\s*(EASY|MEDIUM|HARD)\s*\)?\.pdf$/i)
  if (!m) throw new Error(`Cannot parse filename: ${f}`)
  const key = m[1].trim().toUpperCase()
  const meta = SKILLS[key]
  if (!meta) throw new Error(`Unknown skill "${m[1]}"`)
  return { ...meta, difficulty: titleCase(m[2]) }
}

function rawText(pdfPath) {
  return execFileSync('pdftotext', ['-raw', pdfPath, '-'], { encoding: 'utf8' })
}

function layoutText(pdfPath) {
  return execFileSync('pdftotext', ['-layout', pdfPath, '-'], { encoding: 'utf8' })
}

// Rejoin wrapped prose lines (single newlines) into sentences; blank lines
// separate paragraphs. Returns an array of paragraphs.
function rejoinLines(text) {
  return text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s{2,}/g, ' ')
}

function splitPassageStem(qSection) {
  const lines = qSection.split('\n')
  let stemIdx = -1
  for (let i = lines.length - 1; i >= 0; i--) {
    if (STEM_START.test(lines[i].trim())) { stemIdx = i; break }
  }
  if (stemIdx !== -1) {
    return {
      passage: rejoinLines(lines.slice(0, stemIdx).join('\n')),
      stem: rejoinLines(lines.slice(stemIdx).join('\n')),
    }
  }
  // Fallback: the stem opens with words our keyword list doesn't catch ("The
  // text makes which point…", "Information in the text best supports…",
  // "Assuming participants…"). The boundary between passage and stem is the
  // last sentence break in the block, so cut there.
  const joined = qSection
  const breaks = [...joined.matchAll(/[.?!]["”]?\s+(?=[A-Z“"])/g)]
  if (breaks.length) {
    const last = breaks[breaks.length - 1]
    const cut = last.index + last[0].length
    return { passage: rejoinLines(joined.slice(0, cut)), stem: rejoinLines(joined.slice(cut)) }
  }
  return { passage: rejoinLines(qSection), stem: '' }
}

// Turn "While researching… notes:\nSue is…\nThe Field…" into passage + bullet list.
// Returns the passage string with notes rendered as `• ` markers (the renderer
// already expands `•`/`·` into <ul> items).
function handleNotes(passage) {
  const idx = passage.search(/has taken the following notes:/i)
  if (idx === -1) return passage
  const intro = passage.slice(0, idx + 'has taken the following notes:'.length)
  const rest = passage.slice(intro.length).trim()
  const notes = rest.split(/\.\s+(?=[A-Z])/).map((n) => n.trim()).filter(Boolean).map((n) => n.endsWith('.') ? n : n + '.')
  return intro + '\n\n' + notes.map((n) => `• ${n}`).join('\n')
}

function parseQuestion(block) {
  // block begins after "Question ID: <hex>"
  const lines = block.split('\n')
  const qid = (lines[0] || '').trim()

  // Locate section boundaries (headers sit on their own lines in -raw output).
  let qStart = -1, aStart = -1, caStart = -1, rStart = -1
  for (let i = 1; i < lines.length; i++) {
    const t = lines[i].trim()
    if (qStart === -1 && t === 'Question') qStart = i
    else if (aStart === -1 && t === 'Answer') aStart = i
    else if (caStart === -1 && /^Correct Answer:/.test(t)) caStart = i
    else if (rStart === -1 && t === 'Rationale') rStart = i
  }
  if (qStart === -1 || aStart === -1 || caStart === -1) return null

  const qSection = lines.slice(qStart + 1, aStart).join('\n')
  let { passage, stem } = splitPassageStem(qSection)
  passage = handleNotes(passage)

  // Options between "Answer" and "Correct Answer:".
  const optionText = lines.slice(aStart + 1, caStart).join('\n').trim()
  const options = []
  let current = null
  for (const line of optionText.split('\n')) {
    if (!line.trim()) continue
    const m = line.match(/^\s*([A-D])\.\s*(.*)$/)
    // A label-less line is usually a wrapped continuation (a superscript or a
    // long option breaking onto the next line). But when the PDF drops an
    // option's "D." label entirely, that option arrives as a fresh sentence
    // right after the previous one closed: previous text ends in terminal
    // punctuation and this line opens a new capitalised sentence.
    const orphan =
      current !== null &&
      options.length < 3 &&
      /[.?!]["”]?$/.test(current) &&
      /^[A-Z“"]/.test(line.trim())
    if (m) {
      if (current) options.push(current)
      current = m[2].trim()
    } else if (orphan) {
      options.push(current)
      current = line.trim()
    } else if (current !== null) {
      current += ' ' + line.trim()
    }
  }
  if (current) options.push(current)

  const answerLetter = lines[caStart].replace('Correct Answer:', '').trim()[0]
  const answer = ANSWER_LETTER[answerLetter]

  const rationale = rStart === -1 ? '' : rejoinLines(lines.slice(rStart + 1).join('\n'))

  // Blank-fill marker → add to underline for highlighting.
  const underline = []
  const blankMatch = passage.match(/_+/)
  if (blankMatch && blankMatch[0].length >= 3) underline.push(blankMatch[0])

  // Visual detection (Command of Evidence quantitative-evidence questions).
  const stemLower = stem.toLowerCase()
  const hasTable = /data from the table|shown in the table|according to the table|based on the table/.test(stemLower)
  const hasGraph = /data from the graph|according to the graph|the graph shows|in the graph|bar chart|scatterplot/.test(stemLower)

  return {
    qid,
    passage,
    question: stem,
    options,
    answer,
    rationale,
    underline,
    hasTable,
    hasGraph,
  }
}

const result = {} // skill -> { skill, domain, label, difficulties: { Easy:[], Medium:[], Hard:[] } }

for (const f of readdirSync(SRC)) {
  if (!f.toLowerCase().endsWith('.pdf')) continue
  const meta = parseFilename(f)
  const key = meta.skill
  if (!result[key]) result[key] = { skill: meta.skill, domain: meta.domain, label: meta.label, difficulties: { Easy: [], Medium: [], Hard: [] } }

  const pdfPath = join(SRC, f)
  const raw = rawText(pdfPath).replace(/\f/g, '\n')
  const blocks = raw.split(/Question ID:\s*/).slice(1)

  let parsed = 0, failed = 0
  for (const block of blocks) {
    const q = parseQuestion(block)
    if (q) { result[key].difficulties[meta.difficulty].push(q); parsed++ }
    else failed++
  }
  console.log(`${f}: ${parsed} parsed, ${failed} failed (difficulty ${meta.difficulty})`)
}

for (const [skill, data] of Object.entries(result)) {
  const slug = skill.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const path = join(OUT, `${slug}.json`)
  writeFileSync(path, JSON.stringify(data, null, 2))
  const total = Object.values(data.difficulties).reduce((n, arr) => n + arr.length, 0)
  console.log(`WROTE ${basename(path)}: ${total} questions`)
}
