const PAIRED_PASSAGE_PATTERN = /^\s*Text 1\s+([\s\S]*?)\s+Text 2\s+([\s\S]*?)\s*$/i

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// "While researching a topic, a student has taken the following notes: • a • b"
// — the source renders these as a bulleted list, but the captured text flattens
// the bullets inline. Split the intro off and render the items as real list rows.
function formatParagraph(paragraph: string): string {
  const trimmed = paragraph.trim()

  if (!trimmed.includes('•')) {
    return `<p class="mb-4 last:mb-0">${escapeHtml(trimmed)}</p>`
  }

  const [intro, ...items] = trimmed.split(/\s*•\s*/)
  const html: string[] = []

  if (intro.trim()) {
    html.push(`<p class="mb-3">${escapeHtml(intro.trim())}</p>`)
  }

  html.push(
    `<ul class="mb-4 list-disc space-y-2 pl-6 last:mb-0">${items
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => `<li>${escapeHtml(item)}</li>`)
      .join('')}</ul>`,
  )

  return html.join('')
}

function formatParagraphs(text: string): string {
  return text
    .trim()
    .split(/\n{2,}/)
    .map(formatParagraph)
    .join('')
}

export function formatPassageHtml(passage: string): string {
  const pairedTexts = passage.match(PAIRED_PASSAGE_PATTERN)

  if (!pairedTexts) {
    return formatParagraphs(passage)
  }

  const [, text1, text2] = pairedTexts

  return [
    '<section class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">',
    '<div class="mb-3 font-sans text-xs font-bold uppercase tracking-wide text-purple-700 dark:text-purple-300">Text 1</div>',
    `<div>${formatParagraphs(text1)}</div>`,
    '</section>',
    '<section class="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">',
    '<div class="mb-3 font-sans text-xs font-bold uppercase tracking-wide text-purple-700 dark:text-purple-300">Text 2</div>',
    `<div>${formatParagraphs(text2)}</div>`,
    '</section>',
  ].join('')
}
