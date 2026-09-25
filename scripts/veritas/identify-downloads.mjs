#!/usr/bin/env node
/*
 * Identify Veritas question-bank JSON files without converting them.
 *
 * Freshly collected files land in ~/Downloads with whatever name Chrome picks,
 * so this prints what each one actually is: which set and module, how many
 * questions, whether the answers came through, and which capture problems are
 * present. Run it after a collection to decide whether the file is worth
 * converting.
 *
 * Usage: node scripts/veritas/identify-downloads.mjs [dir...]
 */
import { readFile, readdir, stat } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const dirs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [path.join(os.homedir(), 'Downloads')]

const MAX_REPORTED = 15

const CHROME_IMAGE = /\/menu-icon\/|\/head|avatar|logo|icon/i
const ZERO_WIDTH = /[​‌‍﻿]/g
const MIN_STEM_LENGTH = 25

const clean = (value) => String(value || '').replace(ZERO_WIDTH, '').replace(/\s+/g, ' ').trim()

const inferSetLabel = (rawText, fallback) => {
  const match =
    rawText.match(/系统题库\s+详情\s+SAT机考\s+(SAT CMP.+?Module\s*\d+(?:\s*\([^)]+\))?)/i) ||
    rawText.match(/(SAT CMP.+?Module\s*\d+(?:\s*\([^)]+\))?)/i)
  return clean(match?.[1] || fallback || '')
}

const analyze = (raw) => {
  const questions = raw.questions || []
  const rawText = questions.map((q) => q.rawText || '').join(' ')

  const missingAnswers = questions.filter(
    (q) => !q.answerLetter && !Number.isInteger(q.answer),
  ).length
  const missingOptions = questions.filter((q) => (q.options || []).length < 4).length
  const shortStems = questions.filter((q) => clean(q.question).length < MIN_STEM_LENGTH).length
  const tables = questions.filter((q) => q.table).length

  // Figures are the non-chrome images that appear exactly once in the set.
  const imageCounts = new Map()
  for (const q of questions) {
    for (const image of new Set((q.images || []).map((i) => String(i.src || '')))) {
      if (!image || CHROME_IMAGE.test(image)) continue
      imageCounts.set(image, (imageCounts.get(image) || 0) + 1)
    }
  }
  const figures = [...imageCounts.values()].filter((count) => count === 1).length

  const problems = []
  if (missingAnswers) problems.push(`缺 ${missingAnswers} 个答案`)
  if (missingOptions) problems.push(`${missingOptions} 题选项不足`)
  if (shortStems) problems.push(`${shortStems} 题题干疑似截断`)
  if (!problems.length) problems.push('看起来正常')

  return {
    set: inferSetLabel(rawText, clean(raw.title)) || '(未识别)',
    count: questions.length,
    missingAnswers,
    missingOptions,
    tables,
    figures,
    problems: problems.join('；'),
  }
}

const candidates = []
for (const dir of dirs) {
  let entries
  try {
    entries = await readdir(dir)
  } catch {
    console.error(`跳过（读不到目录）：${dir}`)
    continue
  }
  for (const entry of entries) {
    if (!entry.toLowerCase().endsWith('.json')) continue
    const filePath = path.join(dir, entry)
    try {
      const info = await stat(filePath)
      if (!info.isFile()) continue
      candidates.push({ filePath, name: entry, mtime: info.mtime })
    } catch {
      /* unreadable entry, skip */
    }
  }
}

candidates.sort((a, b) => b.mtime - a.mtime)

const rows = []
const errors = []
for (const candidate of candidates.slice(0, MAX_REPORTED)) {
  let raw
  try {
    raw = JSON.parse(await readFile(candidate.filePath, 'utf8'))
  } catch {
    continue
  }
  if (raw?.schema !== 'veritas-question-bank.v1') continue

  const report = analyze(raw)
  rows.push({
    文件: candidate.name,
    采集时间: candidate.mtime.toISOString().slice(5, 16).replace('T', ' '),
    套题: report.set,
    题数: report.count,
    缺答案: report.missingAnswers,
    表格: report.tables,
    配图: report.figures,
    结论: report.problems,
  })
}

if (!rows.length) {
  console.log(`在 ${dirs.join(', ')} 里没有找到 veritas-question-bank.v1 的 JSON。`)
  process.exit(0)
}

console.table(rows)

const usable = rows.filter((row) => row.结论 === '看起来正常')
console.log(`共 ${rows.length} 个文件，其中 ${usable.length} 个看起来可用。`)
const broken = rows.filter((row) => row.结论 !== '看起来正常')
if (broken.length) {
  console.log('需要重新采集的：')
  for (const row of broken) console.log(`  - ${row.文件} → ${row.结论}`)
}
