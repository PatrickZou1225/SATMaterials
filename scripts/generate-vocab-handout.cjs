#!/usr/bin/env node
// Generate a print-ready HTML handout from vocabQuestions.ts
// Usage: node scripts/generate-vocab-handout.js
// Output: AI文件夹/SAT-Words-in-Logic-47题讲义.html

const fs = require('fs')
const path = require('path')

// ── Read and parse vocabQuestions.ts ──
const tsPath = path.join(__dirname, '..', 'src', 'data', 'vocabQuestions.ts')
let tsContent = fs.readFileSync(tsPath, 'utf8')

// Extract the array portion
const match = tsContent.match(/const vocabQuestions: VocabQuestion\[\] = (\[[\s\S]*\])\n\nexport default vocabQuestions/)
if (!match) {
  console.error('Could not parse vocabQuestions.ts')
  process.exit(1)
}

// Convert TS array to JS array with eval (safe because we control the source)
const jsCode = match[1]
  .replace(/id:\s*(\d+)/g, 'id: $1')
  .replace(/'/g, "\\'")
  .replace(/\\'/g, "'") // fix double escape

// Simpler approach: use Function constructor
const questions = new Function('return ' + match[1])()

// ── HTML Generation ──
function escape(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function blankPassage(passage) {
  return escape(passage).replace(/______/g, '<span class="blank">________</span>')
}

const qHTML = questions.map((q, i) => `
  <div class="question">
    <div class="q-header">
      <span class="q-num">Q${i + 1}</span>
      <span class="q-title">${escape(q.title)}</span>
    </div>
    <div class="passage">${blankPassage(q.passage)}</div>
    <div class="q-prompt">Which choice completes the text with the most logical and precise word or phrase?</div>
    <div class="options">
      ${q.options.map((o, j) => `<div class="opt"><span class="opt-letter">${'ABCD'[j]}.</span> ${escape(o)}</div>`).join('\n      ')}
    </div>
  </div>
`).join('\n')

const answerKeyHTML = questions.map((q, i) => `
  <tr>
    <td class="td-c">${i + 1}</td>
    <td>${escape(q.title)}</td>
    <td class="td-c"><strong>${'ABCD'[q.answer]}</strong></td>
    <td>${escape(q.options[q.answer])}</td>
  </tr>
`).join('\n')

const explanationsHTML = questions.map((q, i) => `
  <div class="explanation">
    <div class="exp-header">
      <span class="q-num">Q${i + 1}</span>
      <span class="q-title">${escape(q.title)}</span>
      <span class="exp-answer">答案：${'ABCD'[q.answer]}. ${escape(q.options[q.answer])}</span>
    </div>
    <p>${escape(q.explanation)}</p>
  </div>
`).join('\n')

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>SAT Words in Logic — 47道逻辑词汇填空题</title>
<style>
  @page { margin: 1.8cm; size: A4; }

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: "Times New Roman", Georgia, "Songti SC", serif;
    font-size: 11pt;
    line-height: 1.72;
    color: #1a1a1a;
    background: #fff;
    max-width: 780px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .page-break { page-break-before: always; }

  /* ── COVER ── */
  .cover {
    text-align: center; padding: 3.5rem 0 2.5rem;
    border-bottom: 3px double #1a1a1a; margin-bottom: 2rem;
  }
  .cover .badge {
    display: inline-block; padding: 0.3em 1.4em; border: 2px solid #1a1a1a;
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.12em; margin-bottom: 1.5rem;
  }
  .cover h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.3em; letter-spacing: 0.02em; }
  .cover .subtitle { font-size: 1.1rem; color: #555; margin-bottom: 2rem; }
  .cover .features { text-align: left; max-width: 400px; margin: 2rem auto 0; line-height: 2.2; }
  .cover .features li { list-style: none; }
  .cover .features li::before { content: "✓ "; color: #16a34a; font-weight: 700; }

  /* ── SECTION HEADINGS ── */
  h2 {
    font-size: 1.25rem; font-weight: 700; margin: 1.5em 0 0.6em;
    padding-bottom: 0.2em; border-bottom: 1.5px solid #1a1a1a;
    text-align: center;
  }

  /* ── QUESTION ── */
  .question {
    margin: 1.2em 0; padding: 1em 1.2em;
    border: 1px solid #ddd; background: #fafafa;
  }
  .q-header { margin-bottom: 0.5em; display: flex; align-items: center; gap: 0.5em; }
  .q-num {
    display: inline-flex; align-items: center; justify-content: center;
    width: 1.8rem; height: 1.8rem; border-radius: 50%;
    background: #1a1a1a; color: #fff; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
  }
  .q-title { font-weight: 700; font-size: 1rem; }
  .passage { font-size: 10.5pt; line-height: 1.75; margin: 0.5em 0; }
  .passage .blank {
    display: inline-block; min-width: 5em;
    border-bottom: 2px solid #1a1a1a; text-align: center;
    margin: 0 0.15em; font-weight: 600;
  }
  .q-prompt { font-style: italic; font-size: 0.9rem; margin: 0.4em 0 0.5em; color: #555; }
  .options { margin: 0.4em 0; }
  .opt { padding: 0.25em 0; font-size: 10.5pt; }
  .opt-letter { font-weight: 700; margin-right: 0.3em; }

  /* ── ANSWER KEY ── */
  table { width: 100%; border-collapse: collapse; margin: 0.6em 0; font-size: 10pt; }
  th, td { border: 1px solid #ccc; padding: 0.35em 0.5em; text-align: left; }
  th { background: #f0f0f0; font-weight: 700; }
  .td-c { text-align: center; width: 3em; }

  /* ── EXPLANATIONS ── */
  .explanation {
    margin: 0.8em 0; padding: 0.8em 1em;
    border: 1px solid #e5e5e5; background: #fafafa;
  }
  .exp-header { margin-bottom: 0.4em; display: flex; align-items: center; gap: 0.5em; flex-wrap: wrap; }
  .exp-answer { font-weight: 700; color: #16a34a; font-size: 0.95rem; margin-left: auto; }

  .footer { text-align: center; margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid #ccc; font-size: 0.78rem; color: #888; }

  @media print {
    body { padding: 0; max-width: none; }
    .page-break { page-break-before: always; }
    .question { break-inside: avoid; }
    .explanation { break-inside: avoid; }
  }
</style>
</head>
<body>

<!-- ════════════════ COVER ════════════════ -->
<div class="cover">
  <div class="badge">SAT READING &amp; WRITING</div>
  <h1>Words in Logic</h1>
  <p class="subtitle">47 道 SAT 逻辑词汇填空题 · 完整详解</p>

  <ul class="features">
    <li>47 道 SAT 真题风格逻辑词汇填空题</li>
    <li>逐题中文详细解析 + 逻辑信号分析</li>
    <li>同向/反向逻辑 + 搭配 + 精准度完整方法论</li>
    <li>PDF 电子版，即买即用</li>
  </ul>

  <p style="margin-top:2.5rem;color:#888;font-size:0.9rem;">Patrick Zou</p>
</div>

<!-- ════════════════ PART 1: QUESTIONS ════════════════ -->
<div class="page-break"></div>
<h2>Part 1 — Questions</h2>
<p style="text-align:center;color:#888;margin-bottom:1.5em;">Read each passage and choose the most logical and precise word or phrase.</p>

${qHTML}

<!-- ════════════════ PART 2: ANSWER KEY ════════════════ -->
<div class="page-break"></div>
<h2>Part 2 — Answer Key</h2>

<table>
  <tr><th>#</th><th>Title</th><th>Answer</th><th>Correct Word</th></tr>
  ${answerKeyHTML}
</table>

<!-- ════════════════ PART 3: EXPLANATIONS ════════════════ -->
<div class="page-break"></div>
<h2>Part 3 — Detailed Explanations</h2>

${explanationsHTML}

<div class="footer">
  <p>SAT Words in Logic · 47题详解 &copy; Patrick Zou</p>
</div>

</body>
</html>`

// ── Write output ──
const outPath = path.join(
  process.env.HOME,
  'Library/Mobile Documents/com~apple~CloudDocs/AI文件夹',
  'SAT-Words-in-Logic-47题讲义.html'
)
fs.writeFileSync(outPath, html, 'utf8')
console.log(`Generated: ${outPath}`)
console.log(`Total questions: ${questions.length}`)
