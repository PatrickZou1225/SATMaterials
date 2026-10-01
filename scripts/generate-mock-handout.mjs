#!/usr/bin/env node
// Render a set's modules as a print-ready handout and turn it into a PDF.
//
//   node scripts/generate-mock-handout.mjs <set-id> [module-name ...]
//
// Without module names every module of the set is printed. The answer key goes
// on the last page.
//
// Passages are rendered with the same rules as src/lib/passage.ts (provenance
// line set apart, note lists as real bullets, vocabulary targets marked), so a
// printed handout matches what the site shows.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'

const run = promisify(execFile)
const ROOT = path.resolve(import.meta.dirname, '..')
const OUT_DIR = '/Users/patrickzou/Library/Mobile Documents/com~apple~CloudDocs/AI文件夹/PDF讲义'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const [setId, ...wantedModules] = process.argv.slice(2)
if (!setId) {
  console.error('Usage: node scripts/generate-mock-handout.mjs <set-id> [module-name ...]')
  process.exit(1)
}

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const INTRODUCTION_START =
  /^The following (?:text|passage|poem|excerpt) is (?:adapted from|excerpted from|translated from|taken from|from)\b/i
const DROP_CAP = /\s*\[([A-Z])\](?=[a-z])/g

// Mark the vocabulary target the question asks about, without leaving the
// highlighting to colour alone — handouts get printed in black and white.
function markTargets(text, underlines) {
  const segments = [{ text, marked: false }]

  for (const phrase of underlines) {
    if (!phrase) continue
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].marked) continue
      const at = segments[i].text.indexOf(phrase)
      if (at === -1) continue
      segments.splice(
        i,
        1,
        { text: segments[i].text.slice(0, at), marked: false },
        { text: phrase, marked: true },
        { text: segments[i].text.slice(at + phrase.length), marked: false },
      )
      i += 2
    }
  }

  return segments
    .filter((segment) => segment.text)
    .map((segment) =>
      segment.marked ? `<u>${escapeHtml(segment.text)}</u>` : escapeHtml(segment.text),
    )
    .join('')
}

function splitIntroduction(text) {
  if (!INTRODUCTION_START.test(text)) return null
  const sentence = text.match(/^[\s\S]*?\.(?=["”]?\s+[A-Z“"'])/)
  if (!sentence) return null
  let introduction = sentence[0].trim()
  let body = text.slice(sentence[0].length).trim()
  if (!body) return null
  if (/^["”]/.test(body)) {
    introduction += body[0]
    body = body.slice(1).trim()
  }
  return { introduction, body }
}

function formatParagraph(paragraph, underlines) {
  const trimmed = paragraph.trim()
  if (!/[•·]/.test(trimmed)) return `<p>${markTargets(trimmed, underlines)}</p>`

  const [intro, ...items] = trimmed.split(/\s*[•·]\s*/)
  return [
    intro.trim() ? `<p>${markTargets(intro.trim(), underlines)}</p>` : '',
    `<ul>${items
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => `<li>${markTargets(item, underlines)}</li>`)
      .join('')}</ul>`,
  ].join('')
}

function formatPassage(passage, underlines) {
  const text = String(passage).replace(DROP_CAP, '\n\n$1').trim()
  const split = splitIntroduction(text)
  const body = split ? split.body : text
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => formatParagraph(paragraph, underlines))
    .join('')

  return split
    ? `<p class="provenance">${escapeHtml(split.introduction)}</p>${paragraphs}`
    : paragraphs
}

const tableHtml = (table) => `
  <table class="data">
    ${table.title ? `<caption>${escapeHtml(table.title)}</caption>` : ''}
    <thead><tr>${table.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
    <tbody>${table.rows
      .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
      .join('')}</tbody>
  </table>`

const figureHtml = (image) =>
  `<img class="figure" src="file://${path.join(ROOT, 'public', decodeURIComponent(image))}" alt="" />`

const LETTERS = ['A', 'B', 'C', 'D']

const questionHtml = (question, moduleNumber) => `
  <section class="question">
    <div class="qnum">${moduleNumber}.${question.id}</div>
    <div class="passage">${formatPassage(question.passage, question.underline || [])}</div>
    ${question.table ? tableHtml(question.table) : ''}
    ${question.image ? figureHtml(question.image) : ''}
    <div class="prompt">
      <p class="stem">${escapeHtml(question.question)}</p>
      <ol class="options">
        ${question.options
          .map((option, index) => `<li><b>${LETTERS[index]}</b> ${escapeHtml(option)}</li>`)
          .join('')}
      </ol>
    </div>
  </section>`

const importFile = path.join(ROOT, 'src', 'data', 'veritas-imports', `${setId}-reading.ts`)
const source = await readFile(importFile, 'utf8').catch(() => {
  console.error(`No such set file: ${path.relative(ROOT, importFile)}`)
  process.exit(1)
})
const set = JSON.parse(
  source.slice(source.indexOf('{', source.indexOf('importedMockTest')), source.lastIndexOf('}') + 1),
)

const modules = wantedModules.length
  ? set.modules.filter((module) =>
      wantedModules.some((wanted) => module.name.toLowerCase().includes(wanted.toLowerCase())),
    )
  : set.modules

if (!modules.length) {
  console.error(
    `No module matched. "${set.title}" has: ${set.modules.map((m) => m.name).join(', ')}`,
  )
  process.exit(1)
}

const numbered = modules.map((module) => ({
  module,
  number: Number(module.name.match(/\d+/)?.[0] || 0),
}))

const answerKey = (item) => `
  <table class="answers">
    <caption>${escapeHtml(item.module.name)}</caption>
    <tbody><tr>
      ${item.module.questions.map((q) => `<td class="head">${q.id}</td>`).join('')}
    </tr><tr>
      ${item.module.questions.map((q) => `<td>${LETTERS[q.answer] ?? '?'}</td>`).join('')}
    </tr></tbody>
  </table>`

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(set.title)} 讲义</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: 11pt; line-height: 1.5; color: #111; }
  h1 { font-family: Helvetica, Arial, sans-serif; font-size: 16pt; margin: 0 0 2mm; }
  .meta { font-family: Helvetica, Arial, sans-serif; font-size: 9pt; color: #555; margin-bottom: 8mm; }
  h2 { font-family: Helvetica, Arial, sans-serif; font-size: 13pt; margin: 0 0 4mm; padding-bottom: 2mm; border-bottom: 2px solid #111; }
  .module { page-break-before: always; }
  .module:first-of-type { page-break-before: avoid; }
  .question { margin-bottom: 7mm; padding-bottom: 5mm; border-bottom: 1px dotted #bbb; }
  .question:last-child { border-bottom: none; }
  .qnum { font-family: Helvetica, Arial, sans-serif; font-size: 9pt; font-weight: bold; color: #666; margin-bottom: 1.5mm; }
  .passage p { margin: 0 0 3mm; text-align: justify; }
  .passage ul { margin: 0 0 3mm; padding-left: 6mm; }
  .passage li { margin-bottom: 1.5mm; }
  .provenance { font-size: 9pt; font-style: italic; color: #666; border-left: 2px solid #ccc; padding-left: 3mm; }
  u { text-decoration: underline; text-underline-offset: 2px; font-weight: 600; }
  table.data { border-collapse: collapse; width: 100%; margin: 0 0 4mm; font-family: Helvetica, Arial, sans-serif; font-size: 9pt; }
  table.data caption { caption-side: top; text-align: left; font-weight: bold; padding-bottom: 1.5mm; }
  table.data th, table.data td { border: 1px solid #999; padding: 1.2mm 2mm; text-align: left; }
  table.data th { background: #eee; }
  img.figure { display: block; max-width: 78%; max-height: 95mm; margin: 0 auto 4mm; }
  .prompt { break-inside: avoid; page-break-inside: avoid; }
  .stem { margin: 0 0 2.5mm; font-weight: bold; }
  .options { list-style: none; margin: 0; padding: 0; }
  .options li { margin-bottom: 1.5mm; padding-left: 6mm; text-indent: -6mm; }
  .options b { font-family: Helvetica, Arial, sans-serif; }
  .answers { border-collapse: collapse; margin-bottom: 6mm; font-family: Helvetica, Arial, sans-serif; font-size: 9pt; }
  .answers caption { caption-side: top; text-align: left; font-weight: bold; padding-bottom: 1.5mm; }
  .answers td { border: 1px solid #777; padding: 1.5mm 0; width: 6.5mm; text-align: center; }
  .answers td.head { background: #eee; font-weight: bold; }
</style>
</head>
<body>
  <h1>${escapeHtml(set.title)}</h1>
  <div class="meta">${modules.map((m) => escapeHtml(m.name)).join(' &nbsp;·&nbsp; ')} &nbsp;·&nbsp; 答案附在最后一页</div>
  ${numbered
    .map(
      (item) => `
  <section class="module">
    <h2>${escapeHtml(item.module.name)}<span style="font-weight:normal"> — ${item.module.questions.length} 题 · ${item.module.timeMinutes} 分钟</span></h2>
    ${item.module.questions.map((q) => questionHtml(q, item.number)).join('')}
  </section>`,
    )
    .join('')}
  <section class="module">
    <h2>答案 / Answer Key</h2>
    ${numbered.map(answerKey).join('')}
  </section>
</body>
</html>
`

await mkdir(OUT_DIR, { recursive: true })
const base = `${set.title.replace(/[^\w\s.-]/g, '').trim()} ${modules.map((m) => m.name.match(/\d+/)?.[0]).join('+')}`
const htmlPath = path.join(OUT_DIR, `${base}.html`)
const pdfPath = path.join(OUT_DIR, `${base}.pdf`)
await writeFile(htmlPath, html)

await run(CHROME, [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdfPath}`,
  `file://${htmlPath}`,
])

console.log(`HTML: ${htmlPath}`)
console.log(`PDF : ${pdfPath}`)
console.log(`Modules: ${modules.map((m) => m.name).join(', ')} | questions: ${modules.reduce((n, m) => n + m.questions.length, 0)}`)
