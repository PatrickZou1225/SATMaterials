import { allMockTests, type MockTestModule, type MockTestQuestion, type MockTestSet } from '../data/mockTestQuestions'

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

export interface BankSet {
  id: string
  title: string
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
      modules,
      questionCount: modules.reduce((total, module) => total + module.questions.length, 0),
    })
  }

  return { sets: bank, byKey }
}
