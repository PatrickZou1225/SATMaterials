import questions from './questions'
import { topicData, topicNames, levelNames } from './readingQuestions'
import { allMockTests } from './mockTestQuestions'
import vocabQuestions from './vocabQuestions'
import knowledgeBaseSearch from './knowledgeBaseSearch'

export type SourceType = 'practice' | 'reading-detail' | 'mock-test' | 'vocab' | 'knowledge'

export interface SearchableItem {
  id: string
  title: string
  text: string
  sourceType: SourceType
  link: string
  tags: string[]
  snippet: string
}

function snippet(text: string, maxLen = 100): string {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) + '...' : cleaned
}

export function buildSearchIndex(): SearchableItem[] {
  const items: SearchableItem[] = []

  // ── Source 1: questions.ts (Practice) ──
  for (const q of questions) {
    const text = [q.question, ...q.options, q.explanation, q.topic, q.subject, q.difficulty].join(' ')
    items.push({
      id: `practice-${q.id}`,
      title: q.topic,
      text,
      sourceType: 'practice',
      link: `/practice?subject=${q.subject}`,
      tags: [q.subject === 'math' ? '数学' : '阅读', q.topic, q.difficulty === 'easy' ? '简单' : q.difficulty === 'medium' ? '中等' : '困难', q.subject],
      snippet: snippet(q.question),
    })
  }

  // ── Source 2: readingQuestions.ts (Reading Detail) ──
  for (const [topicKey, levels] of Object.entries(topicData)) {
    const topicName = topicNames[topicKey] || topicKey
    for (const [levelKey, qs] of Object.entries(levels)) {
      const levelName = levelNames[levelKey]?.label || levelKey
      for (const q of qs) {
        const text = [q.passage, q.question, ...q.options, q.explanation, topicName, levelName].join(' ')
        items.push({
          id: `reading-${topicKey}-${levelKey}-${q.id}`,
          title: `${topicName} · ${levelName} · Q${q.id}`,
          text,
          sourceType: 'reading-detail',
          link: `/knowledge/reading/${topicKey}/${levelKey}`,
          tags: ['阅读', '阅读专项', topicName, levelName],
          snippet: snippet(q.question),
        })
      }
    }
  }

  // ── Source 3: mockTestQuestions.ts (Mock Test) ──
  for (const testSet of allMockTests) {
    for (let mi = 0; mi < testSet.modules.length; mi++) {
      const mod = testSet.modules[mi]
      for (const q of mod.questions) {
        const text = [q.passage, q.question, ...q.options, mod.name, mod.subject, testSet.title].join(' ')
        items.push({
          id: `mocktest-${testSet.id}-m${mi}-${q.id}`,
          title: `${testSet.title} · ${mod.name} · Q${q.id}`,
          text,
          sourceType: 'mock-test',
          link: `/mock-test/${testSet.id}/${mi}`,
          tags: ['模拟测试', '阅读与文法', testSet.title, mod.subject],
          snippet: snippet(q.question),
        })
      }
    }
  }

  // ── Source 4: vocabQuestions.ts (Logical Vocabulary) ──
  for (const q of vocabQuestions) {
    const text = [q.title, q.passage, q.question, ...q.options, q.explanation].join(' ')
    items.push({
      id: `vocab-${q.id}`,
      title: `词汇题 · ${q.title}`,
      text,
      sourceType: 'vocab',
      link: `/practice?subject=reading`,
      tags: ['词汇题', '逻辑词汇', 'Words in Logic', '词汇', '阅读'],
      snippet: snippet(q.passage),
    })
  }

  // ── Source 5: knowledgeBaseSearch.ts (Knowledge Base) ──
  for (const kb of knowledgeBaseSearch) {
    const text = [kb.title, kb.description, kb.content, ...kb.tags].join(' ')
    items.push({
      id: kb.id,
      title: kb.title,
      text,
      sourceType: 'knowledge',
      link: '/knowledge',
      tags: kb.tags,
      snippet: snippet(kb.description),
    })
  }

  return items
}

// Singleton — built once at module load
export const searchIndex: SearchableItem[] = buildSearchIndex()
