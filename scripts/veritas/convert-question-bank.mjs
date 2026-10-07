#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { inferSkill } from './skills.mjs';
import { applyTableOverride, tableOverrides } from './tables.mjs';

const [, , ...args] = process.argv;

if (args.length === 0) {
  console.error('Usage: node scripts/veritas/convert-question-bank.mjs <veritas-json...> [--out output-ts]');
  process.exit(1);
}

const outIndex = args.indexOf('--out');
const outputPathArg = outIndex >= 0 ? args[outIndex + 1] : undefined;
// Without this guard a missing --out makes outIndex -1, which dropped args[0]
// and silently converted only the second input module.
const inputPaths =
  outIndex >= 0 ? args.filter((_, index) => index !== outIndex && index !== outIndex + 1) : args;

if (inputPaths.length === 0) {
  console.error('Missing Veritas JSON input file.');
  process.exit(1);
}

const answerLetters = ['A', 'B', 'C', 'D'];

const normalizeSubject = (title) => {
  if (/数学|math/i.test(title)) return '数学';
  return '阅读与文法';
};

const stripOptionPrefix = (value) =>
  String(value || '')
    .replace(/\s*正确选项\s*/g, ' ')
    .replace(/\s*\d+(?:\.\d+)?%\s*选择\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Veritas wraps long stems, and the DOM read only captured the first line, so a
// recorded question can be a fragment ending mid-sentence. When it lacks closing
// punctuation, recover the full stem from the page text: locate the fragment,
// then take everything up to the first option marker (a sentence end followed by
// an option letter).
const recoverTruncatedQuestion = (fragment, record) => {
  const flat = String(record.rawText || '').replace(/\s+/g, ' ');
  const needle = String(fragment).replace(/\s+/g, ' ').trim();
  const start = flat.indexOf(needle);
  if (start < 0) return fragment;
  const after = flat.slice(start + needle.length);
  const boundary = after.match(/[?.!]\s[A-D]\s/);
  if (!boundary) return fragment;
  const recovered = (needle + after.slice(0, boundary.index + 1)).trim();
  return recovered.replace(/([.!?]\s+)([a-z])/g, (_, gap, ch) => gap + ch.toUpperCase());
};

// The DOM read occasionally drops the letter marker from the final option, so
// record.options comes back with three while the fourth option's text still
// sits in rawText between the previous option's "N% 选择" marker and 知识点.
const recoverTrailingOption = (options, record) => {
  if (options.length !== 3) return options;
  const flat = String(record.rawText || '');
  const last = options[options.length - 1];
  const at = flat.lastIndexOf(last);
  if (at < 0) return options;
  const after = flat.slice(at + last.length);
  const marker = after.match(/\s*\d+(?:\.\d+)?%\s*选择\s*/);
  if (!marker) return options;
  const rest = after.slice(marker.index + marker[0].length);
  const stop = rest.indexOf('知识点');
  if (stop < 0) return options;
  const text = rest
    .slice(0, stop)
    .replace(/\s*\d+(?:\.\d+)?%\s*选择\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text ? [...options, text] : options;
};

// The 作业 result page prints the header "Question 1-27 are based on the
// following passage" before the live stem, and the collector's stem regex starts
// matching at that header, so every stem arrives with the header's tail glued to
// its front ("-27 are based on the following passage Question 11 Which ...").
const stripStemHeader = (value) =>
  String(value || '').replace(/^.*?are based on the following passage\s+Question\s*\d+\s*/i, '');

const inferQuestion = (record) => {
  const recorded = stripStemHeader(record.question);
  if (recorded) {
    return /[?.!:"”]\s*$/.test(recorded) ? recorded : recoverTruncatedQuestion(recorded, record);
  }
  const raw = String(record.rawText || '');
  const withoutHeader = raw.replace(/^.*?Question\s*\d+/i, '').trim();
  const optionStart = withoutHeader.search(/\bA[\s).:：]/);
  return (optionStart >= 0 ? withoutHeader.slice(0, optionStart) : withoutHeader).replace(/\s+/g, ' ').trim();
};

const ZERO_WIDTH = /[\u200b\u200c\u200d\ufeff]/g;

// Veritas alternates between "\u2022" and "\u25cf" for note-list bullets depending on the
// capture run; the renderer (src/lib/passage.ts) splits on "\u2022". Normalize so
// note lists render as real lists either way.
const BULLET = /\u25cf/g;

// The preview DOM renders some passages twice, so the captured text ends with a
// near-copy of itself. Drop the trailing copy (only when it runs to the end).
const dedupeRepeatedTail = (text, minBlock = 100) => {
  if (text.length < minBlock * 2) return text;
  const seen = new Map();
  for (let i = 0; i + minBlock <= text.length; i++) {
    const block = text.slice(i, i + minBlock);
    const prev = seen.get(block);
    if (prev === undefined) {
      seen.set(block, i);
      continue;
    }
    let len = minBlock;
    while (i + len < text.length && text[prev + len] === text[i + len]) len++;
    if (i + len >= text.length - 20) return text.slice(0, i).trim();
  }
  return text;
};

const flattenTable = (table) =>
  table && Array.isArray(table.headers)
    ? [table.title, ...table.headers, ...(table.rows || []).flat()].filter(Boolean).join(' ')
    : '';

const inferPassage = (record) => {
  const raw = String(record.rawText || '');
  const match =
    raw.match(/阅读材料\s+(.+?)\s+题目\s+.*?Question\s*\d+/i) ||
    raw.match(/Passage\s+(.+?)\s+Question\s*\d+/i);
  let passage = (match?.[1] || '').replace(ZERO_WIDTH, '').replace(BULLET, '•').replace(/\s+/g, ' ').trim();
  passage = dedupeRepeatedTail(passage);
  // When a structured table was captured, drop its flattened copy from the passage.
  const flat = flattenTable(record.table);
  if (flat) passage = passage.replace(flat, ' ').replace(/\s+/g, ' ').trim();
  return passage;
};

const isChromeImage = (src) =>
  !src || /\/menu-icon\//i.test(src) || /\/head|avatar|logo|icon/i.test(src);

// Candidate figure images for a question: every non-chrome image. The correct
// figure is the one that appears for a single question only, so callers must
// filter these by a global occurrence count rather than taking the first hit.
const candidateImages = (record) =>
  (record.images || [])
    .map((item) => String(item.src || ''))
    .filter((src) => !isChromeImage(src));

const toModuleName = (title) => {
  const match = title.match(/Module\s*\d+(?:\s*\([^)]*\))?/i);
  // Veritas adds CJK notes after the module number ("Module 2 (27道题)",
  // "Module 2 (只有19题)"). Those are count notes, not labels — drop them so
  // the name stays "Module 2"; keep English labels like "(Harder)".
  return match ? match[0].replace(/\([^)]*[一-鿿][^)]*\)/g, '').replace(/\s+/g, ' ').trim() : title;
};

const inferSourceTitle = (raw, fallback) => {
  const rawText = (raw.questions || []).map((record) => record.rawText || '').join(' ');
  const match =
    rawText.match(/系统题库\s+详情\s+SAT机考\s+(SAT CMP.+?Module\s*\d+(?:\s*\([^)]+\))?)/i) ||
    rawText.match(/SAT机考\s+(SAT CMP.+?Module\s*\d+(?:\s*\([^)]+\))?)/i);
  return String(match?.[1] || fallback || '').replace(/\s+New\b.*$/i, '').replace(/\s+/g, ' ').trim();
};

const parseModule = async (inputPath) => {
  const raw = JSON.parse(await readFile(inputPath, 'utf8'));
  const fallbackTitle = raw.title || path.basename(inputPath, path.extname(inputPath));
  const sourceTitle = inferSourceTitle(raw, fallbackTitle);
  const subject = normalizeSubject(sourceTitle);
  const imageCounts = new Map();
  for (const record of raw.questions || []) {
    for (const image of new Set(candidateImages(record))) {
      imageCounts.set(image, (imageCounts.get(image) || 0) + 1);
    }
  }
  const inferUnderlines = (question) => {
    const match = question.match(/what does the word ["“]([^"”]+)["”] most (?:nearly mean|likely indicate)/i);
    return match ? [match[1]] : undefined;
  };

  // The same result-page header makes the collector read every question's number
  // off it, so a module arrives with 27 records that all claim to be number 1.
  // Ids feed question_key, which must be unique per question, so trust the
  // recorded numbers only while they still ascend and fall back to capture order.
  const recordedNumbers = (raw.questions || []).map((record) => Number(record.number));
  const numbersUsable = recordedNumbers.every(
    (number, index) =>
      Number.isInteger(number) && (index === 0 || number > recordedNumbers[index - 1]),
  );

  const questions = (raw.questions || []).map((record, index) => {
    const options = recoverTrailingOption(
      (record.options || []).map(stripOptionPrefix).filter(Boolean),
      record,
    );
    const answer =
      Number.isInteger(record.answer) && record.answer >= 0 && record.answer <= 3
        ? record.answer
        : answerLetters.indexOf(String(record.answerLetter || '').toUpperCase());

    const hasAnswer = answer >= 0;
    // The question's figure is the image it alone uses; page chrome repeats for
    // every question and so is excluded by that test. But one figure can serve two
    // questions (the same data asked two ways), and then neither is unique — fall
    // back to an image used by at most two questions, which is still a figure and
    // never the chrome (that repeats for all ~27).
    const image =
      candidateImages(record).find((src) => imageCounts.get(src) === 1) ||
      candidateImages(record).find((src) => imageCounts.get(src) <= 2);
    const question = inferQuestion(record);
    // Knowledge point, recovered from the 添加知识点 blob. Drives assignment by
    // skill (see scripts/veritas/skills.mjs).
    const skill = inferSkill(record);

    return {
      id: numbersUsable ? recordedNumbers[index] : index + 1,
      passage: inferPassage(record),
      question,
      options,
      answer: hasAnswer ? answer : null,
      domain: skill?.domain,
      skill: skill?.skill,
      // Vocabulary stems name the target word in quotes; the exam underlines that
      // word in the passage but Veritas drops the styling, so recover it here.
      underline: inferUnderlines(question),
      image: image && imageCounts.get(image) <= 2 ? image : undefined,
      table: record.table,
    };
  });

  // Tables Veritas renders as divs arrive flattened into the passage; the
  // hand-built table (scripts/veritas/tables.mjs) replaces that text.
  const overrideKey = path.basename(inputPath, path.extname(inputPath));
  const overrides = tableOverrides[overrideKey] || {};
  const usedOverrideIds = new Set();
  for (const question of questions) {
    const override = overrides[question.id];
    if (override) usedOverrideIds.add(question.id);
    const applied = applyTableOverride(question.passage, override);
    question.passage = applied.passage;
    if (applied.table) question.table = applied.table;
  }
  // A key that matches nothing means a typo'd question id or file name, which
  // would silently ship the flattened table.
  for (const key of Object.keys(overrides)) {
    if (!usedOverrideIds.has(Number(key))) {
      console.warn(`Unused table override: ${overrideKey} q${key}`);
    }
  }

  return {
    sourceTitle,
    subject,
    module: {
      name: toModuleName(sourceTitle),
      subject,
      timeMinutes: subject === '数学' ? 35 : 32,
      questions,
    },
  };
};

const parsedModules = await Promise.all(inputPaths.map(parseModule));
const firstTitle = parsedModules[0]?.sourceTitle || path.basename(inputPaths[0], path.extname(inputPaths[0]));
// A set imported from a single module file still carries that module in its
// title ("... / Module 1 (Routing)"); strip it in every case, or the set id
// keeps the module suffix.
const sourceTitle = firstTitle.replace(/\s*\/\s*Module\s*\d+(?:\s*\([^)]+\))?/i, '');

// Veritas sometimes appends a "/note" after the set name ("J10-NA-03(非整套)/读写M2
// 重复..."). The note is useful for the title but must not leak into the id, where
// it would produce "sat-cmp-...-m2-na-01-02-m2". Truncate at the first "/" that
// sits outside parentheses (a "/" inside "(...)" is part of the annotation).
const stripTrailingNote = (title) => {
  let depth = 0
  for (let i = 0; i < title.length; i++) {
    if (title[i] === '(') depth++
    else if (title[i] === ')') depth--
    else if (title[i] === '/' && depth === 0) return title.slice(0, i).trim()
  }
  return title
}
// Titles can carry CJK annotations, but the id becomes the set
// half of every question_key, which the database constrains to [a-z0-9_-]. Drop
// anything outside that alphabet rather than emitting an unusable key. The
// annotation is also dropped before that, so "2025-J10-INT-01(读写3个Module)"
// yields "sat-cmp-2025-j10-int-01" rather than a "-3-module" suffix.
const testId = stripTrailingNote(sourceTitle)
  .replace(/\([^)]*[一-鿿][^)]*\)/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 80);

// Year drives the per-year paid gate (src/lib/access.ts). Titles look like
// "SAT CMP 2026-I9-INT-01", so the first 4-digit run is the year.
const year = Number(sourceTitle.match(/\b(20\d{2})\b/)?.[1]) || new Date().getFullYear();

const output = `// Generated from ${inputPaths.map((inputPath) => path.basename(inputPath)).join(', ')}
// Review answers and images before publishing.

import type { MockTestSet } from '../mockTestQuestions'

export const importedMockTest = ${JSON.stringify(
  {
    id: testId || 'veritas-import',
    title: sourceTitle,
    year,
    modules: parsedModules.map((item) => item.module),
  },
  null,
  2,
)} satisfies MockTestSet
`;

const outputPath =
  outputPathArg ||
  path.join('src', 'data', 'veritas-imports', `${testId || 'veritas-import'}.ts`);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, output);

const questions = parsedModules.flatMap((item) => item.module.questions);
const weakRecords = questions.filter((q) => q.options.length < 4 || !q.question || q.answer === null);
console.log(`Wrote ${outputPath}`);
console.log(`Modules: ${parsedModules.length}`);
console.log(`Questions: ${questions.length}`);
if (weakRecords.length) {
  console.log(`Needs review: ${weakRecords.map((q) => q.id).join(', ')}`);
}

// Veritas renders some tables as divs, so findTable() misses them and the rows
// arrive flattened into the passage ("No film used 90% 14% ..."). They need a
// hand-built table object, so surface them instead of writing them out silently.
const flatTables = questions.filter(
  (q) => !q.table && !q.image && /\b(table|graph|chart)\b/i.test(`${q.passage} ${q.question}`),
);
if (flatTables.length) {
  console.log(`Flattened tables (need a hand-built table object): ${flatTables.map((q) => q.id).join(', ')}`);
}
