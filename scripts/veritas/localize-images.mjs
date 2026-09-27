#!/usr/bin/env node
// Imported questions carry the figure as a Veritas OSS URL, which is a private
// host the deployed site should not depend on. Download each figure into public/
// and rewrite the import to a site-relative path. Names follow the convention
// "<set-id>-m<module number>-q<question id>.<ext>" so the file is identifiable
// from its name alone.
//
// Idempotent: questions already pointing at a local path are skipped, so this can
// be re-run over a whole month's imports.
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..', '..')
const IMPORTS_DIR = path.join(ROOT, 'src', 'data', 'veritas-imports')
const PUBLIC_DIR = path.join(ROOT, 'public')

// Mirrors moduleNumber() in src/lib/questionBank.ts: the number in the module
// NAME ("Module 3 (Harder)" -> 3), since the adaptive Module 2 is skipped.
const moduleNumber = (name, index) => {
  const match = String(name).match(/\d+/)
  return match ? Number(match[0]) : index + 1
}

const extensionOf = (url) => (url.split('?')[0].match(/\.([a-z0-9]+)$/i)?.[1] || 'png').toLowerCase()

const targets = process.argv.slice(2)
const names = targets.length
  ? targets.map((name) => path.resolve(name))
  : (await readdir(IMPORTS_DIR)).filter((name) => name.endsWith('.ts')).map((name) => path.join(IMPORTS_DIR, name))

await mkdir(PUBLIC_DIR, { recursive: true })

let downloaded = 0
let failed = 0

for (const file of names) {
  const source = await readFile(file, 'utf8')
  const start = source.indexOf('= ', source.indexOf('export const importedMockTest')) + 2
  const end = source.lastIndexOf(' satisfies MockTestSet')
  if (start < 2 || end < 0) {
    console.error(`✗ ${path.basename(file)}: not a converter-generated import`)
    failed++
    continue
  }

  const set = JSON.parse(source.slice(start, end))
  const pending = []

  set.modules.forEach((module, moduleIndex) => {
    module.questions.forEach((question) => {
      if (!/^https?:\/\//.test(question.image || '')) return
      pending.push({ question, module, moduleIndex })
    })
  })

  for (const { question, module, moduleIndex } of pending) {
    const fileName = `${set.id}-m${moduleNumber(module.name, moduleIndex)}-q${question.id}.${extensionOf(question.image)}`
    const destination = path.join(PUBLIC_DIR, fileName)

    // A re-conversion restores the remote URL, so rewrite the import either way;
    // only fetch when the file is not already on disk.
    const cached = await stat(destination).then(() => true, () => false)
    if (!cached) {
      try {
        const response = await fetch(question.image)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        await writeFile(destination, Buffer.from(await response.arrayBuffer()))
      } catch (error) {
        console.error(`✗ ${fileName}: ${error.message}`)
        failed++
        continue
      }
      downloaded++
      console.log(`✓ ${fileName} downloaded`)
    } else {
      console.log(`· ${fileName} (already present)`)
    }

    question.image = `/${fileName}`
  }

  if (pending.length) {
    await writeFile(file, `${source.slice(0, start)}${JSON.stringify(set, null, 2)}${source.slice(end)}`)
  }
}

console.log(`\ndownloaded ${downloaded} | failed ${failed}`)
if (failed) process.exit(1)
