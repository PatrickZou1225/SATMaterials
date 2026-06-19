import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SearchIcon, X, ChevronRight, BookOpen, FileText, Beaker, HelpCircle, GraduationCap } from 'lucide-react'
import { searchIndex, type SearchableItem, type SourceType } from '../data/searchIndex'

// ── helpers ──
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isChineseChar(ch: string): boolean {
  const code = ch.charCodeAt(0)
  return code >= 0x4e00 && code <= 0x9fff
}

function hasChinese(s: string): boolean {
  return [...s].some(isChineseChar)
}

function scoreItem(item: SearchableItem, tokens: string[]): number {
  let score = 0
  const title = item.title.toLowerCase()
  const text = item.text.toLowerCase()
  const tags = item.tags.map(t => t.toLowerCase()).join(' ')

  for (const token of tokens) {
    const lower = token.toLowerCase()
    const isCN = hasChinese(token)

    // title match
    if (title.includes(lower)) score += 15
    // tags match
    if (tags.includes(lower)) score += 8
    // prefix match in any word
    const words = text.split(/\s+/)
    for (const w of words) {
      if (w.startsWith(lower)) { score += 5; break }
    }
    // substring match in text
    if (text.includes(lower)) score += 2
    // Chinese bonus: contiguous match
    if (isCN && text.includes(token)) score += 3
  }
  return score
}

function highlightText(snippet: string, query: string): React.ReactNode {
  if (!query.trim()) return snippet
  const tokens = query.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return snippet

  // Build a regex that matches any token
  const pattern = tokens.map(t => escapeRegex(t)).join('|')
  const regex = new RegExp(`(${pattern})`, 'gi')

  const parts = snippet.split(regex)
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded-sm px-0.5">{part}</mark>
      : part
  )
}

// ── filter config ──
const filterDefs: { key: SourceType | 'all'; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'all', label: '全部', icon: <SearchIcon size={14} />, color: 'bg-slate-600' },
  { key: 'practice', label: '练习', icon: <BookOpen size={14} />, color: 'bg-blue-600' },
  { key: 'reading-detail', label: '阅读专项', icon: <FileText size={14} />, color: 'bg-emerald-600' },
  { key: 'mock-test', label: '模拟测试', icon: <Beaker size={14} />, color: 'bg-purple-600' },
  { key: 'vocab', label: '词汇题', icon: <HelpCircle size={14} />, color: 'bg-amber-600' },
  { key: 'knowledge', label: '知识点', icon: <GraduationCap size={14} />, color: 'bg-rose-600' },
]

const sourceBadge: Record<SourceType, { label: string; className: string }> = {
  'practice': { label: '练习', className: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  'reading-detail': { label: '阅读专项', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  'mock-test': { label: '模拟测试', className: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
  'vocab': { label: '词汇题', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  'knowledge': { label: '知识点', className: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
}

const MAX_RESULTS = 25

// ── component ──
export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [activeFilter, setActiveFilter] = useState<SourceType | 'all'>('all')
  const [showAll, setShowAll] = useState(false)

  // Debounce
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 200)
    return () => clearTimeout(id)
  }, [query])

  // Update URL
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed) {
      setSearchParams({ q: trimmed }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }, [query, setSearchParams])

  const results = useMemo(() => {
    const q = debouncedQuery.trim()
    if (!q) return []

    const tokens = q.split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return []

    const scored = searchIndex
      .filter(item => activeFilter === 'all' || item.sourceType === activeFilter)
      .map(item => ({ item, score: scoreItem(item, tokens) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)

    return scored
  }, [debouncedQuery, activeFilter])

  const displayed = showAll ? results : results.slice(0, MAX_RESULTS)

  const clearSearch = useCallback(() => {
    setQuery('')
    setActiveFilter('all')
    setShowAll(false)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2 text-center">搜索题目</h1>
        <p className="text-gray-500 dark:text-slate-400 mb-8 text-center">
          在所有练习、阅读专项、模拟测试、词汇题和知识点中搜索
        </p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowAll(false) }}
            placeholder="输入关键词搜索... 例如：主旨、paucity、二次方程、逻辑词汇"
            autoFocus
            className="w-full pl-12 pr-12 py-3.5 text-base border-2 border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors shadow-sm"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {filterDefs.map(f => (
            <button
              key={f.key}
              onClick={() => { setActiveFilter(f.key); setShowAll(false) }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === f.key
                  ? `${f.color} text-white shadow-sm`
                  : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {debouncedQuery.trim() ? (
          <>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 text-center">
              找到 <strong className="text-gray-700 dark:text-slate-200">{results.length}</strong> 条结果
              {results.length > MAX_RESULTS && !showAll && (
                <span>（显示前 {MAX_RESULTS} 条）</span>
              )}
            </p>

            {results.length === 0 ? (
              <div className="text-center py-16">
                <SearchIcon size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
                <p className="text-gray-500 dark:text-slate-400 text-lg mb-2">未找到相关结果</p>
                <p className="text-gray-400 dark:text-slate-500 text-sm">试试其他关键词，比如"主旨"、"词汇"、"二次方程"等</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayed.map(({ item }) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="block bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-4 md:p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Title + badge */}
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {highlightText(item.title, debouncedQuery)}
                          </h3>
                          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${sourceBadge[item.sourceType].className}`}>
                            {sourceBadge[item.sourceType].label}
                          </span>
                        </div>

                        {/* Snippet */}
                        <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-2">
                          {highlightText(item.snippet, debouncedQuery)}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <ChevronRight size={18} className="shrink-0 mt-1 text-gray-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Show more */}
            {results.length > MAX_RESULTS && !showAll && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  显示全部 {results.length} 条结果
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty state (no query) */
          <div className="text-center py-16">
            <SearchIcon size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <p className="text-gray-500 dark:text-slate-400 text-lg">输入关键词开始搜索</p>
            <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">支持中英文搜索，可以用空格分隔多个关键词</p>
          </div>
        )}
      </div>
    </div>
  )
}
