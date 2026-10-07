import { allMockTests, type MockTestModule, type MockTestQuestion, type MockTestSet } from '../data/mockTestQuestions'
import { allOfficialTypes, officialKey, OFFICIAL_DIFFICULTIES, type OfficialDifficulty } from '../data/officialSamples'

// Stable key an assignment uses to point at one question. The format is fixed by
// the check constraint on public.assignment_questions.question_key:
// ^[a-z0-9_-]+:[a-z0-9_-]+$ — exactly one colon, two lowercase segments.
export const questionKey = (setId: string, moduleName: string, index: number, questionId: number): string =>
  `set:${setId}-m${moduleNumber(moduleName, index)}-q${questionId}`

// Imported sets name modules "Module 1 (Routing)" / "Module 3 (Harder)" because
// the adaptive Module 2 is skipped, so the number in the name is what the teacher
// sees. Fall back to the array position when a name carries no number.
export function moduleNumber(moduleName: string, index: number): number {
  const match = moduleName.match(/\d+/)
  return match ? Number(match[0]) : index + 1
}

export interface BankQuestion {
  key: string
  setId: string
  setTitle: string
  moduleName: string
  moduleNum: number
  question: MockTestQuestion
}

export interface BankModule {
  name: string
  moduleNum: number
  subject: MockTestModule['subject']
  questions: BankQuestion[]
}

// Imported set ids carry the exam month as a letter+number segment: c3 is March,
// f6 June, l12 December. The letter is redundant with the number, so read the
// digits rather than mapping letters — "sat-cmp-2025-l12-na-01" yields 12.
const MONTH_SEGMENT = /^[a-z](\d{1,2})$/

export function monthOfSet(setId: string): number | null {
  for (const segment of setId.split('-')) {
    const match = MONTH_SEGMENT.exec(segment)
    if (!match) continue
    const month = Number(match[1])
    if (month >= 1 && month <= 12) return month
  }
  return null
}

export const monthLabel = (month: number) => `${month}月`

export interface BankSet {
  id: string
  title: string
  year: number
  modules: BankModule[]
  questionCount: number
}

export interface QuestionBank {
  sets: BankSet[]
  byKey: Map<string, BankQuestion>
}

export function buildQuestionBank(sets: MockTestSet[] = allMockTests): QuestionBank {
  const bank: BankSet[] = []
  const byKey = new Map<string, BankQuestion>()

  for (const set of sets) {
    const modules: BankModule[] = set.modules.map((module, index) => {
      const moduleNum = moduleNumber(module.name, index)
      const questions = module.questions.map((question) => {
        const entry: BankQuestion = {
          key: questionKey(set.id, module.name, index, question.id),
          setId: set.id,
          setTitle: set.title,
          moduleName: module.name,
          moduleNum,
          question,
        }
        byKey.set(entry.key, entry)
        return entry
      })
      return { name: module.name, moduleNum, subject: module.subject, questions }
    })

    bank.push({
      id: set.id,
      title: set.title,
      year: set.year,
      modules,
      questionCount: modules.reduce((total, module) => total + module.questions.length, 0),
    })
  }

  // Official College Board sample questions are not a "set" (no year, one module
  // per difficulty), so they never join `sets` — but they must be resolvable by
  // key so assignments and the practice page can render them.
  for (const type of allOfficialTypes) {
    for (const difficulty of OFFICIAL_DIFFICULTIES) {
      for (const question of type.difficulties[difficulty]) {
        const key = officialKey(type.slug, difficulty, question.qid)
        byKey.set(key, {
          key,
          setId: `official-${type.slug}`,
          setTitle: `官方样题 · ${type.label}`,
          moduleName: difficulty,
          moduleNum: 1,
          question,
        })
      }
    }
  }

  return { sets: bank, byKey }
}

// Official-sample catalog, keyed by type, for the practice UI and assignment mode.
export interface OfficialTypeInfo {
  slug: string
  label: string
  domain: string
  skill: string
  counts: Record<OfficialDifficulty, number>
  total: number
}

export const officialTypes: OfficialTypeInfo[] = allOfficialTypes.map((type) => {
  const counts = Object.fromEntries(
    OFFICIAL_DIFFICULTIES.map((d) => [d, type.difficulties[d].length]),
  ) as Record<OfficialDifficulty, number>
  return {
    slug: type.slug,
    label: type.label,
    domain: type.domain,
    skill: type.skill,
    counts,
    total: OFFICIAL_DIFFICULTIES.reduce((n, d) => n + counts[d], 0),
  }
})

export function officialTypeLabel(slug: string): string {
  return allOfficialTypes.find((type) => type.slug === slug)?.label ?? slug
}

// All keys for one type, optionally narrowed to a single difficulty.
export function officialKeys(slug: string, difficulty: OfficialDifficulty | null = null): string[] {
  const type = allOfficialTypes.find((t) => t.slug === slug)
  if (!type) return []
  const diffs = difficulty ? [difficulty] : OFFICIAL_DIFFICULTIES
  return diffs.flatMap((d) => type.difficulties[d].map((q) => officialKey(slug, d, q.qid)))
}

// Random sample of `count` keys (all of them when the pool is smaller).
export function sampleKeys(keys: string[], count: number): string[] {
  const pool = [...keys]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Math.max(0, Math.min(count, pool.length)))
}
