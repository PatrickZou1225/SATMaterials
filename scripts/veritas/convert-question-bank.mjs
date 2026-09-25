#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const [, , ...args] = process.argv;

if (args.length === 0) {
  console.error('Usage: node scripts/veritas/convert-question-bank.mjs <veritas-json...> [--out output-ts]');
  process.exit(1);
}

const outIndex = args.indexOf('--out');
const outputPathArg = outIndex >= 0 ? args[outIndex + 1] : undefined;
const inputPaths = args.filter((arg, index) => index !== outIndex && index !== outIndex + 1);

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

const inferQuestion = (record) => {
  if (record.question) return record.question;
  const raw = String(record.rawText || '');
  const withoutHeader = raw.replace(/^.*?Question\s*\d+/i, '').trim();
  const optionStart = withoutHeader.search(/\bA[\s).:：]/);
  return (optionStart >= 0 ? withoutHeader.slice(0, optionStart) : withoutHeader).replace(/\s+/g, ' ').trim();
};

const ZERO_WIDTH = /[\u200b\u200c\u200d\ufeff]/g;

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
  let passage = (match?.[1] || '').replace(ZERO_WIDTH, '').replace(/\s+/g, ' ').trim();
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
  const match = title.match(/Module\s*\d+(?:\s*\([^)]+\))?/i);
  return match ? match[0] : title;
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
  const questions = (raw.questions || []).map((record, index) => {
    const options = (record.options || []).map(stripOptionPrefix).filter(Boolean);
    const answer =
      Number.isInteger(record.answer) && record.answer >= 0 && record.answer <= 3
        ? record.answer
        : answerLetters.indexOf(String(record.answerLetter || '').toUpperCase());

    const hasAnswer = answer >= 0;
    const image = candidateImages(record).find((src) => imageCounts.get(src) === 1);

    return {
      id: Number(record.number) || index + 1,
      passage: inferPassage(record),
      question: inferQuestion(record),
      options,
      answer: hasAnswer ? answer : null,
      image: image && imageCounts.get(image) === 1 ? image : undefined,
      table: record.table,
    };
  });

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
const sourceTitle =
  parsedModules.length > 1
    ? firstTitle.replace(/\s*\/\s*Module\s*\d+(?:\s*\([^)]+\))?/i, '')
    : firstTitle;
const testId = sourceTitle
  .toLowerCase()
  .replace(/[^\w\u4e00-\u9fff]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 80);

const output = `// Generated from ${inputPaths.map((inputPath) => path.basename(inputPath)).join(', ')}
// Review answers and images before publishing.

import type { MockTestSet } from '../mockTestQuestions'

export const importedMockTest = ${JSON.stringify(
  {
    id: testId || 'veritas-import',
    title: sourceTitle,
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
