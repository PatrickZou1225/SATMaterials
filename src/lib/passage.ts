const PAIRED_PASSAGE_PATTERN = /^\s*Text 1\s+([\s\S]*?)\s+Text 2\s+([\s\S]*?)\s*$/i

// Literature questions open with an editorial line about the source ("The following
// text is adapted from Mark Twain's 1876 novel The Adventures of Tom Sawyer.") that
// the exam sets apart from the excerpt itself. The capture merges the two into one
// paragraph, so split it back out and style it as an introduction.
const INTRODUCTION_START =
  /^The following (?:text|passage|poem|excerpt) is (?:adapted from|excerpted from|translated from|taken from|from)\b/i

function splitIntroduction(text: string): { introduction: string; body: string } | null {
  if (!INTRODUCTION_START.test(text)) return null

  // The line ends at the first sentence-ending period, which can sit inside a
  // quoted title ("...above Tintern Abbey."), so allow a closing quote after it.
  const sentence = text.match(/^[\s\S]*?\.(?=["”]?\s+[A-Z“"'])/)
  if (!sentence) return null

  let introduction = sentence[0].trim()
  let body = text.slice(sentence[0].length).trim()

  if (/^["”]/.test(body)) {
    introduction += body[0]
    body = body.slice(1).trim()
  }

  return body ? { introduction, body } : null
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// SAT marks the target of some questions in the passage itself: the word a
// vocabulary question asks about, or the sentence a function question calls
// "the underlined portion". Veritas strips that styling, so each set carries the
// phrases in an `underline` list and we re-apply it here. Matching runs on the
// raw text (first occurrence only) so escaping stays inside each fragment.
function applyUnderlines(text: string, underlines: string[]): string {
  let segments: Array<{ text: string; marked: boolean }> = [{ text, marked: false }]

  for (const phrase of underlines) {
    if (!phrase) continue

    const next: typeof segments = []

    for (const segment of segments) {
      if (segment.marked) {
        next.push(segment)
        continue
      }

      const at = segment.text.indexOf(phrase)

      if (at === -1) {
        next.push(segment)
        continue
      }

      next.push(
        { text: segment.text.slice(0, at), marked: false },
        { text: phrase, marked: true },
        { text: segment.text.slice(at + phrase.length), marked: false },
      )
    }

    segments = next
  }

  return segments
    .filter(segment => segment.text)
    .map(segment =>
      segment.marked
        ? `<u class="underline decoration-2 underline-offset-2 decoration-purple-500 dark:decoration-purple-400">${escapeHtml(segment.text)}</u>`
        : escapeHtml(segment.text),
    )
    .join('')
}

// "While researching a topic, a student has taken the following notes: • a • b"
// — the source renders these as a bulleted list, but the captured text flattens
// the bullets inline. Split the intro off and render the items as real list rows.
function formatParagraph(paragraph: string, underlines: string[]): string {
  const trimmed = paragraph.trim()

  if (!trimmed.includes('•')) {
    return `<p class="mb-4 last:mb-0">${applyUnderlines(trimmed, underlines)}</p>`
  }

  const [intro, ...items] = trimmed.split(/\s*•\s*/)
  const html: string[] = []

  if (intro.trim()) {
    html.push(`<p class="mb-3">${applyUnderlines(intro.trim(), underlines)}</p>`)
  }

  html.push(
    `<ul class="mb-4 list-disc space-y-2 pl-6 last:mb-0">${items
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => `<li>${applyUnderlines(item, underlines)}</li>`)
      .join('')}</ul>`,
  )

  return html.join('')
}

function formatParagraphs(text: string, underlines: string[]): string {
  return text
    .trim()
    .split(/\n{2,}/)
    .map(paragraph => formatParagraph(paragraph, underlines))
    .join('')
}

// One passage body: an optional provenance line, then the text itself.
function formatBody(text: string, underlines: string[]): string {
  const split = splitIntroduction(text.trim())

  if (!split) {
    return formatParagraphs(text, underlines)
  }

  return [
    `<p class="mb-4 border-l-2 border-gray-300 pl-3 text-sm italic leading-relaxed text-gray-500 dark:border-slate-600 dark:text-slate-400">${escapeHtml(split.introduction)}</p>`,
    formatParagraphs(split.body, underlines),
  ].join('')
}

export function formatPassageHtml(passage: string, underlines: string[] = []): string {
  const pairedTexts = passage.match(PAIRED_PASSAGE_PATTERN)

  if (!pairedTexts) {
    return formatBody(passage, underlines)
  }

  const [, text1, text2] = pairedTexts

  return [
    '<section class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">',
    '<div class="mb-3 font-sans text-xs font-bold uppercase tracking-wide text-purple-700 dark:text-purple-300">Text 1</div>',
    `<div>${formatBody(text1, underlines)}</div>`,
    '</section>',
    '<section class="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">',
    '<div class="mb-3 font-sans text-xs font-bold uppercase tracking-wide text-purple-700 dark:text-purple-300">Text 2</div>',
    `<div>${formatBody(text2, underlines)}</div>`,
    '</section>',
  ].join('')
}
