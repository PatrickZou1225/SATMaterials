#!/usr/bin/env node
// Render the table/graph figure for the official-sample questions that have one.
//
// A whole-page screenshot would leak the "Correct Answer" line printed lower on
// the page, so each figure is cropped to the region between the question's
// "Question" heading and the first line of the passage prose. The passage prose
// is located by matching the words we already parsed, which is exact and does
// not depend on guessing where a table ends.
//
// Usage: node scripts/render-figure-images.mjs "/path/to/SAT 官方样题"
// Writes public/official-samples/<slug>-<difficulty>-<qid>.png and a manifest
// (data/official-samples/figures.json) mapping qid -> image path.

import { execFileSync } from 'node:child_process'
import { readdirSync, writeFileSync, mkdirSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const SRC = process.argv[2]
if (!SRC) throw new Error('usage: node scripts/render-figure-images.mjs "<pdf dir>"')

const DATA = new URL('../data/official-samples/', import.meta.url).pathname
const OUT = new URL('../public/official-samples/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })

const DPI = 150
const PT_PER_PX = 72 / DPI

// Filename key -> slug (matches parse-official-samples.mjs SKILLS).
const slugify = (key) => key.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function parseFilename(f) {
  const m = f.match(/^(.+?)\s*\(?\s*(EASY|MEDIUM|HARD)\s*\)?\.pdf$/i)
  if (!m) return null
  return { key: m[1].trim().toUpperCase(), difficulty: m[2][0].toUpperCase() + m[2].slice(1).toLowerCase() }
}

const bboxWords = (pdf, page) => {
  const xml = execFileSync('pdftotext', ['-bbox', '-f', String(page), '-l', String(page), pdf, '-'], { encoding: 'utf8' })
  const words = []
  const re = /<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([\s\S]*?)<\/word>/g
  for (const m of xml.matchAll(re)) {
    words.push({
      xMin: +m[1], yMin: +m[2], xMax: +m[3], yMax: +m[4],
      text: m[5].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
    })
  }
  const width = +(xml.match(/<page width="([\d.]+)"/)?.[1] ?? 612)
  const height = +(xml.match(/<page height="([\d.]+)"/)?.[1] ?? 792)
  return { words, width, height }
}

// Which page of the PDF holds this question id.
const pageOfQuestion = (pdf, qid) => {
  const raw = execFileSync('pdftotext', ['-raw', pdf, '-'], { encoding: 'utf8' }).split('\f')
  for (let i = 0; i < raw.length; i++) if (raw[i].includes(`Question ID: ${qid}`)) return i + 1
  return -1
}

// First word of the passage prose, found by walking the page words and matching
// the opening tokens of the parsed passage in order.
// Group the page's words into visual lines (a shared y), each with the horizontal
// span it covers and the largest gap between adjacent words.
function textLines(words) {
  const byY = new Map()
  for (const w of words) {
    const key = Math.round(w.yMin / 1.5)
    const line = byY.get(key) ?? []
    line.push(w)
    byY.set(key, line)
  }
  return [...byY.keys()].sort((a, b) => a - b).map((key) => {
    const line = byY.get(key).sort((a, b) => a.xMin - b.xMin)
    const gaps = line.slice(1).map((w, i) => w.xMin - line[i].xMax)
    return {
      yMin: Math.min(...line.map((w) => w.yMin)),
      xMin: line[0].xMin,
      xMax: line[line.length - 1].xMax,
      maxGap: gaps.length ? Math.max(...gaps) : 0,
      text: line.map((w) => w.text).join(' '),
    }
  })
}

// A prose line fills nearly the whole measure with tightly packed words. Table
// rows have column gaps, and figure labels are short, so both are excluded. A
// long table title can look like prose on its own, but the header row beneath it
// is gappy — so require the following line to be packed too.
function findProseTop(words, pageWidth, above) {
  const packed = (line) => line && line.maxGap < 12
  const wide = (line) => line.xMax - line.xMin > 0.8 * pageWidth
  const lines = textLines(words)
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].yMin <= above) continue
    if (wide(lines[i]) && packed(lines[i]) && packed(lines[i + 1])) return lines[i]
  }
  return null
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

// The parsed passage of a figure question starts with the figure's own text
// (a table renders as a run-on of its cells, a graph as its axis labels). Drop
// everything up to the passage's first prose line so only the prose renders.
function cutAtProse(passage, proseLine) {
  const key = proseLine.text.split(/\s+/).map(norm).filter(Boolean).slice(0, 6)
  if (key.length < 3) return passage
  const tokens = []
  for (const m of passage.matchAll(/\S+/g)) {
    const n = norm(m[0])
    if (n) tokens.push({ n, start: m.index })
  }
  for (let i = 0; i + key.length <= tokens.length; i++) {
    let hit = true
    for (let j = 0; j < key.length; j++) if (tokens[i + j].n !== key[j]) { hit = false; break }
    if (hit) return passage.slice(tokens[i].start).trim()
  }
  return passage
}

const px = (pt) => Math.round(pt / PT_PER_PX)

const manifest = {}
let rendered = 0, failed = 0

for (const f of readdirSync(SRC)) {
  if (!f.toLowerCase().endsWith('.pdf')) continue
  const meta = parseFilename(f)
  if (!meta) continue
  const slug = slugify(meta.key)
  const jsonPath = join(DATA, `${slug}.json`)
  if (!existsSync(jsonPath)) continue
  const data = JSON.parse(readFileSync(jsonPath, 'utf8'))
  const bucket = data.difficulties[meta.difficulty] ?? []
  const figures = bucket.filter((q) => q.hasTable || q.hasGraph)
  if (figures.length === 0) continue

  const pdf = join(SRC, f)
  // Cache the per-page word boxes; several questions can share a page.
  const pageCache = new Map()
  const wordsOn = (page) => {
    if (!pageCache.has(page)) pageCache.set(page, bboxWords(pdf, page))
    return pageCache.get(page)
  }

  for (const q of figures) {
    const page = pageOfQuestion(pdf, q.qid)
    if (page === -1) { console.warn(`!! ${f} ${q.qid}: page not found`); failed++; continue }
    const { words, width } = wordsOn(page)

    // The heading is the last "Question" label at the left margin (the first is
    // inside "Question ID:").
    const headings = words.filter((w) => w.text === 'Question' && w.xMin < 40)
    if (headings.length === 0) { console.warn(`!! ${f} ${q.qid}: no Question heading`); failed++; continue }
    const heading = headings.reduce((a, b) => (b.yMin > a.yMin ? b : a))

    // The figure sits between the heading and the passage's first prose line.
    // If no prose line is found the passage starts on the next page, so stop at
    // the "Answer" heading — never past it, which would reveal the answer.
    const proseLine = findProseTop(words, width, heading.yMax + 2)
    const proseTop = proseLine
      ? proseLine.yMin
      : Math.min(...words.filter((w) => w.text === 'Answer' && w.xMin < 40 && w.yMin > heading.yMin).map((w) => w.yMin), Infinity)
    if (!Number.isFinite(proseTop)) { console.warn(`!! ${f} ${q.qid}: no boundary found`); failed++; continue }
    if (proseTop - heading.yMax < 12) { console.warn(`!! ${f} ${q.qid}: no figure band`); failed++; continue }

    // Full text measure on both sides so a figure wider than its labels isn't clipped.
    const pad = 6
    const x0 = 18 - pad
    const y0 = Math.max(0, heading.yMin - pad)
    const x1 = width - 18 + pad
    const y1 = proseTop - pad

    const name = `${slug}-${meta.difficulty.toLowerCase()}-${q.qid}.png`
    const dest = join(OUT, name)
    try {
      execFileSync('pdftoppm', [
        '-png', '-r', String(DPI),
        '-x', String(px(x0)), '-y', String(px(y0)),
        '-W', String(px(x1 - x0)), '-H', String(px(y1 - y0)),
        '-f', String(page), '-l', String(page),
        '-singlefile', pdf, dest.replace(/\.png$/, ''),
      ])
    } catch (err) {
      console.warn(`!! ${f} ${q.qid}: render failed ${err.message}`)
      if (existsSync(dest)) rmSync(dest)
      failed++
      continue
    }
    manifest[q.qid] = {
      image: `/official-samples/${name}`,
      passage: proseLine ? cutAtProse(q.passage, proseLine) : q.passage,
    }
    rendered++
  }
}

writeFileSync(join(DATA, 'figures.json'), JSON.stringify(manifest, null, 2))
console.log(`\nRendered ${rendered} figures, ${failed} failed.`)
