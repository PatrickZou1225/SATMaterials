#!/usr/bin/env node
// Convert every set listed in a staging manifest, one generated import per set.
// A whole year is imported a month at a time, and this keeps each batch to a
// single command instead of one long converter invocation per set.
//
//   node scripts/veritas/convert-batch.mjs data/veritas-imports/2025-manifest.json c3
//   node scripts/veritas/convert-batch.mjs data/veritas-imports/2025-manifest.json   # everything
import { readFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'

const run = promisify(execFile)
const ROOT = path.resolve(import.meta.dirname, '..', '..')

const [manifestPath, filter] = process.argv.slice(2)
if (!manifestPath) {
  console.error('Usage: node scripts/veritas/convert-batch.mjs <manifest.json> [set-id substring]')
  process.exit(1)
}

const manifest = JSON.parse(await readFile(path.resolve(manifestPath), 'utf8'))
// The raw directory is named after the manifest's year: 2024-manifest.json
// reads from raw-2024, 2025-manifest.json from raw-2025.
const yearMatch = path.basename(manifestPath).match(/^(\d{4})-/)
const rawDir = `raw-${yearMatch ? yearMatch[1] : '2025'}`
let failures = 0

for (const entry of manifest) {
  if (filter && !entry.set.includes(filter)) continue

  const inputs = entry.files.map((name) => path.join(path.dirname(path.resolve(manifestPath)), rawDir, name))
  const out = path.join('src', 'data', 'veritas-imports', `${entry.set}-reading.ts`)

  let stdout
  try {
    ;({ stdout } = await run('node', ['scripts/veritas/convert-question-bank.mjs', ...inputs, '--out', out], { cwd: ROOT }))
  } catch (error) {
    console.log(`${entry.set.padEnd(28)} FAILED: ${error.message.split('\n')[0]}`)
    failures++
    continue
  }

  const warnings = stdout
    .split('\n')
    .filter((line) => /Needs review|Flattened tables|Unused table override/.test(line))
    .map((line) => line.trim())
  console.log(`${entry.set.padEnd(28)} ${String(entry.questions).padStart(4)}q  ${warnings.length ? warnings.join('  |  ') : 'ok'}`)
}

if (failures) process.exit(1)
