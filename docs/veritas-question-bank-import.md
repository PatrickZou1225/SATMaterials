# Veritas Question Bank Import

This workflow imports authorized Veritas/xiaosaas question-bank content into a local JSON/TypeScript staging format for SATPrep.

## What It Does

- Runs inside your already logged-in Veritas browser page.
- Clicks the visible numbered question list on a preview/detail page.
- Captures the visible question text, answer choices, answer marker, explanation text, and image URLs when available.
- Downloads a JSON file to your Mac.
- Converts that JSON into a `MockTestSet`-shaped TypeScript staging file.

It does not store usernames, passwords, cookies, or tokens.

## Browser Collection

1. In Veritas, go to `题库`.
2. Choose `学科 -> SAT机考 -> 读写` or `数学`.
3. Open Chrome DevTools Console.
4. Paste the full contents of `scripts/veritas/collect-question-bank.js`.
5. Optional: list the visible question sets on the current list page:

```js
VeritasQuestionCollector.listSets()
```

6. Open the target set with `预览` or `查看`.
7. Turn on answer/explanation display if the page has such a switch.
8. Run:

```js
await VeritasQuestionCollector.collect()
```

Chrome will download a JSON file. The collector names it after the set and module (for example `sat-cmp-2026-i9-na-01-module-1-routing.json`) and prints a health check when it finishes. Read that output before moving on:

```
体检：27 题 | 缺答案 0 | 选项不足 0 | 题干过短 0 | 抓到表格 1
✅ 体检通过：答案齐全、选项完整、题干正常。
```

If it warns about missing answers or truncated stems, fix the page state and collect again rather than converting a bad capture.

## Identifying Downloads

Chrome names downloads unpredictably, so the JSON files themselves often cannot be told apart by filename. To list what is sitting in `~/Downloads` without converting anything:

```bash
node scripts/veritas/identify-downloads.mjs          # default: ~/Downloads
node scripts/veritas/identify-downloads.mjs <dir>    # or any directory
```

It prints one row per Veritas capture with the set and module (read from the question detail panel), question count, missing answers, tables, unique figures, and a verdict. Use it to decide which files are worth converting.

## Local Conversion

Move the downloaded JSON into `data/veritas-imports/raw/`, then run:

```bash
node scripts/veritas/convert-question-bank.mjs data/veritas-imports/raw/YOUR_FILE.json
```

To combine multiple modules into one SATPrep test set:

```bash
node scripts/veritas/convert-question-bank.mjs \
  data/veritas-imports/raw/module-1.json \
  data/veritas-imports/raw/module-2.json
```

The converter writes a TypeScript staging file under `src/data/veritas-imports/`.

## Review Checklist

Before publishing imported questions in SATPrep, review:

- Question count matches the Veritas set.
- Every question has four options.
- Correct answer is detected correctly.
- Images load from a durable local path, not only a private Veritas URL.
- Math figures and tables are preserved.
- Reading passages are not accidentally merged into the answer choices.

For images, download or recreate the needed figures into `public/images/` and replace private image URLs before deployment.
