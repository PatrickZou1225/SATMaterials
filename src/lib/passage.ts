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

type Segment = { text: string; marked: boolean }

const HIGHLIGHT_CLASS =
  'rounded-sm bg-amber-200 px-0.5 text-inherit underline decoration-amber-600/70 decoration-2 underline-offset-2 dark:bg-amber-300/40 dark:text-inherit dark:decoration-amber-300/70'

// SAT marks the target of some questions in the passage itself: the word a
// vocabulary question asks about, or the sentence a function question calls
// "the underlined portion". We re-apply that marking as a highlight — easier to
// spot than a rule, which the surrounding prose hides. Two sources feed it: the
// imported sets list the phrases in `underline`, while the hand-written sets
// carry the marking inline as "<u>…</u>" or "<mark>…</mark>". Normalize both to
// marked segments so everything downstream is escaped exactly once.
function markedSegments(text: string, underlines: string[]): Segment[] {
  const segments: Segment[] = []
  const inline = /<(u|mark)>([\s\S]*?)<\/\1>/g
  let cursor = 0

  for (const match of text.matchAll(inline)) {
    if (match.index > cursor) segments.push({ text: text.slice(cursor, match.index), marked: false })
    segments.push({ text: match[2], marked: true })
    cursor = match.index + match[0].length
  }

  segments.push({ text: text.slice(cursor), marked: false })

  for (const phrase of underlines) {
    if (!phrase) continue

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]

      if (segment.marked) continue

      const at = segment.text.indexOf(phrase)

      if (at === -1) continue

      segments.splice(
        i,
        1,
        { text: segment.text.slice(0, at), marked: false },
        { text: phrase, marked: true },
        { text: segment.text.slice(at + phrase.length), marked: false },
      )
      i += 2
    }
  }

  return segments
}

function applyUnderlines(text: string, underlines: string[]): string {
  return markedSegments(text, underlines)
    .filter(segment => segment.text)
    .map(segment =>
      segment.marked
        ? `<mark class="${HIGHLIGHT_CLASS}">${escapeHtml(segment.text)}</mark>`
        : escapeHtml(segment.text),
    )
    .join('')
}

// "While researching a topic, a student has taken the following notes: • a • b"
// — the source renders these as a bulleted list, but the captured text flattens
// the bullets inline. Split the intro off and render the items as real list rows.
// The marker glyph is not stable across captures (Veritas emits either U+2022 or
// U+00B7 depending on the page), so accept both.
const LIST_MARKER = /[•·]/

function formatParagraph(paragraph: string, underlines: string[]): string {
  const trimmed = paragraph.trim()

  if (!LIST_MARKER.test(trimmed)) {
    return `<p class="mb-4 last:mb-0">${applyUnderlines(trimmed, underlines)}</p>`
  }

  const [intro, ...items] = trimmed.split(/\s*[•·]\s*/)
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

// Veritas sets a passage's opening letter as a drop cap in its own element, and
// the capture serializes that element as "[P]" — so the first word arrives as
// "[P]eople". Unhandled it leaks into the text and hides the paragraph boundary,
// which makes splitIntroduction keep scanning past the provenance sentence and
// swallow the excerpt's first sentence, taking any vocabulary highlight with it.
// Restore the initial and the break. A bracket followed directly by a lowercase
// letter is always this marker: real bracketed content ("the [gun] fired") is
// spaced and never runs straight into a word.
const DROP_CAP = /\s*\[([A-Z])\](?=[a-z])/g

// One passage body: an optional provenance line, then the text itself.
function formatBody(rawText: string, underlines: string[]): string {
  const text = rawText.replace(DROP_CAP, '\n\n$1').trim()
  const split = splitIntroduction(text)

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
