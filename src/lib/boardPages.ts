import type { BinaryFiles } from '@excalidraw/excalidraw/types'
import type { ExcalidrawElement, FileId } from '@excalidraw/excalidraw/element/types'
import { newId } from './board'
import type { PDFDocumentProxy } from './board'

// A board is a list of pages. Each page has its own background (a rendered
// handout page or a blank/colored board) plus the Excalidraw scene drawn on top
// of it. Everything is stored as one JSON blob in `boards.pages`.

export type PdfBackground = { type: 'pdf'; pdfPage: number }
export type BlankBackground = { type: 'blank'; color: string; grid: boolean }
export type PageBackground = PdfBackground | BlankBackground

// The subset of Excalidraw state we persist. Elements/files are the drawing;
// appState is trimmed to the bits worth restoring (background color, viewport).
export type BoardScene = {
  elements: ExcalidrawElement[]
  files: BinaryFiles
  appState: Record<string, unknown>
}

// A handout board shows one PDF page at a time. `notes` keeps the teacher's
// elements for every page they have visited, keyed by page number, so flipping
// swaps the annotations together with the sheet instead of leaving them behind
// on a 150-page-long canvas.
export type HandoutState = {
  page: number
  pageCount: number
  notes: Record<number, ExcalidrawElement[]>
}

export type BoardPage = {
  id: string
  name: string
  background: PageBackground
  scene: BoardScene
  handout?: HandoutState
  // A board is drawn on two independent layers: the blackboard (notes) and the
  // handout (PDF pages + the ink on them). Both pages live in `pages`; `pair`
  // ties the two layers of one board together.
  kind?: 'board' | 'handout'
  pair?: string
}

export type BoardPair = { key: string; board: BoardPage; handout?: BoardPage }

// Group pages into display boards: a blackboard page plus its optional handout
// page. Legacy pages without a `pair` stand alone (their id is the key).
export function groupBoardPages(pages: BoardPage[]): BoardPair[] {
  const map = new Map<string, BoardPair>()
  for (const page of pages) {
    const key = page.pair ?? page.id
    let pair = map.get(key)
    if (!pair) {
      pair = { key, board: page }
      map.set(key, pair)
    }
    if (page.kind === 'handout') pair.handout = page
    else pair.board = page
  }
  return [...map.values()]
}

// Boards saved before the layer split mixed the PDF column and the teacher's
// notes in one scene. Pull them apart: elements sitting on a PDF sheet stay on
// the handout layer (they are annotations), everything else becomes blackboard
// notes shifted left so they start at the board's origin.
//
// Idempotent: pages that already carry a `kind` are returned untouched, so this
// is safe to run on every load until the board is saved in the new shape.
export function splitBoardPages(pages: BoardPage[]): BoardPage[] {
  return pages.flatMap((page) => {
    if (page.kind) return [page]
    const live = page.scene.elements.filter((el) => !el.isDeleted)
    const pdfEls = live.filter((el) => pdfPageOf(el) !== null)
    if (pdfEls.length === 0) {
      // Very old boards baked the PDF page into `background`; all their ink
      // sits on that sheet, so it belongs to the handout layer.
      if (page.background.type === 'pdf') {
        const pair = newId()
        return [
          { ...page, id: newId(), kind: 'handout' as const, pair },
          {
            id: newId(),
            name: `${page.name} · 黑板`,
            background: { type: 'blank', color: BLANK_COLOR, grid: false },
            scene: emptyScene(),
            kind: 'board' as const,
            pair,
          },
        ]
      }
      return [{ ...page, kind: 'board' as const }]
    }

    const left = Math.min(...pdfEls.map((el) => el.x))
    const right = Math.max(...pdfEls.map((el) => el.x + el.width))
    const onSheet = (el: ExcalidrawElement) => {
      const cx = el.x + el.width / 2
      const cy = el.y + el.height / 2
      if (cx < left || cx > right) return false
      return pdfEls.some((p) => cy >= p.y && cy <= p.y + p.height)
    }
    const sheetEls = live.filter(onSheet)
    const boardEls = live.filter((el) => !onSheet(el)).map((el) => ({
      ...el,
      // Notes beside the column move to the board's left edge; notes above or
      // below it (but within the column's width) keep their horizontal offset.
      x: el.x - (el.x + el.width / 2 >= right ? right : left),
    }))
    const filesFor = (els: ExcalidrawElement[]): BinaryFiles => {
      const ids = new Set<string>()
      for (const el of els) {
        const fileId = (el as { fileId?: string }).fileId
        if (fileId) ids.add(fileId)
      }
      const files: BinaryFiles = {}
      for (const [id, file] of Object.entries(page.scene.files)) if (ids.has(id)) files[id] = file
      return files
    }
    const pair = newId()
    const boardBackground: BlankBackground = page.background.type === 'blank'
      ? { ...page.background, grid: false }
      : { type: 'blank', color: BLANK_COLOR, grid: false }
    return [
      {
        id: newId(),
        name: page.name,
        background: { type: 'blank', color: HANDOUT_BG, grid: false },
        scene: { elements: sheetEls, files: filesFor(sheetEls), appState: {} },
        kind: 'handout' as const,
        pair,
      },
      {
        id: newId(),
        name: `${page.name} · 黑板`,
        background: boardBackground,
        scene: { elements: boardEls, files: filesFor(boardEls), appState: {} },
        kind: 'board' as const,
        pair,
      },
    ]
  })
}

// Excalidraw scene coordinates are unitless. We render every handout page at a
// fixed width so a board looks identical on any screen.
export const BACKGROUND_WIDTH = 1000

// Blank pages are a blackboard: dark background, light ink (see defaultInkColor).
const BLANK_COLOR = '#000000'

// Handout pages used to sit on a white canvas, which glares around the PDF.
// Deep blue is easier on the eyes and still reads as a neutral backdrop.
export const HANDOUT_BG = '#0f172a'

export function emptyScene(): BoardScene {
  return { elements: [], files: {}, appState: {} }
}

export function blankPage(name: string, color = BLANK_COLOR, grid = false): BoardPage {
  return { id: newId(), name, background: { type: 'blank', color, grid }, scene: emptyScene(), kind: 'board' }
}

// Pick an ink color that stays visible on the page: white on a dark board, dark
// on a light board or a white PDF page.
export function defaultInkColor(background: PageBackground): string {
  const hex = (background.type === 'pdf' ? '#ffffff' : background.color).replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance < 128 ? '#ffffff' : '#1e1e1e'
}

export function pdfPage(name: string, pdfPageNumber: number): BoardPage {
  return { id: newId(), name, background: { type: 'pdf', pdfPage: pdfPageNumber }, scene: emptyScene() }
}

export function pageBackgroundColor(background: PageBackground): string {
  return background.type === 'blank' ? background.color : '#ffffff'
}

// Render one page of a PDF to a PNG data URL. Used to bake a handout page into
// the Excalidraw scene as a locked background image.
//
// The scene places the image at BACKGROUND_WIDTH units, but we rasterise at
// several times that: a 1000px bitmap blown up on a 2.5K display reads as mush.
// RENDER_SCALE keeps text sharp when the board is zoomed or projected. The long
// side is capped so the bitmap stays under typical WebGL texture limits.
const RENDER_SCALE = 3
const MAX_BITMAP_SIDE = 4000

export async function renderPdfPageToDataUrl(
  pdf: PDFDocumentProxy,
  pageNumber: number,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const page = await pdf.getPage(pageNumber)
  const base = page.getViewport({ scale: 1 })
  const longSide = Math.max(base.width, base.height)
  const scale = Math.min(
    (BACKGROUND_WIDTH * RENDER_SCALE) / base.width,
    MAX_BITMAP_SIDE / longSide,
  )
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法创建画布')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  await page.render({ canvas, canvasContext: ctx, viewport }).promise
  // Width/height describe where the page sits on the board (scene units), not
  // the bitmap: the caller places a BACKGROUND_WIDTH-wide element and Excalidraw
  // downsamples the oversized PNG into it.
  const height = Math.round((canvas.height / canvas.width) * BACKGROUND_WIDTH)
  return { dataUrl: canvas.toDataURL('image/png'), width: BACKGROUND_WIDTH, height }
}

// ---- Handouts: one board, every PDF page stacked on it ----------------------
//
// A handout is NOT one board per page. The whole PDF is laid out as a vertical
// column of image elements inside a single scene; the surface locks them so the
// column reads as one fixed document (zoom and scroll are the only navigation).
//
// Page bitmaps are hi-res and would blow up memory (and storage) across a 60-page
// document, so they are rasterised on demand for whatever is on screen and are
// never saved: every page element points at a tiny grey placeholder whose file id
// is derived from the page number, and the bitmap is swapped in while it's in
// view. `customData.pdfPage` is how an element remembers which page it shows.

// Pages sit almost flush: a wide gap reads as a thick black bar between sheets.
export const PDF_PAGE_GAP = 8

export type PdfPageLayout = { page: number; y: number; width: number; height: number }

export const pdfPlaceholderId = (page: number) => `pdf-ph-${page}`
export const pdfBitmapId = (page: number) => `pdf-bm-${page}`

// Which handout page an element shows, if any.
export function pdfPageOf(el: { customData?: unknown }): number | null {
  const value = (el.customData as { pdfPage?: unknown } | undefined)?.pdfPage
  return typeof value === 'number' ? value : null
}

// Measure every page (cheap) and stack them top to bottom.
export async function layoutPdfPages(pdf: PDFDocumentProxy): Promise<PdfPageLayout[]> {
  const out: PdfPageLayout[] = []
  let y = 0
  for (let page = 1; page <= pdf.numPages; page++) {
    const viewport = (await pdf.getPage(page)).getViewport({ scale: 1 })
    const height = Math.round((viewport.height / viewport.width) * BACKGROUND_WIDTH)
    out.push({ page, y, width: BACKGROUND_WIDTH, height })
    y += height + PDF_PAGE_GAP
  }
  return out
}

// The grey card standing in for a page until its bitmap is rendered — and in
// everything we save, so neither the database nor Storage carries page bitmaps.
export function pdfPlaceholderDataUrl(page: number, width: number, height: number): string {
  const w = 240
  const h = Math.max(1, Math.round((height / width) * w))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#f1f5f9'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, w - 2, h - 2)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '600 26px -apple-system, "PingFang SC", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`第 ${page} 页`, w / 2, h / 2)
  }
  return canvas.toDataURL('image/png')
}

// Before persisting: point every page back at its placeholder and drop the
// rasterised bitmaps; positions and sizes are otherwise left untouched.
export function stripPdfBitmaps(pages: BoardPage[]): BoardPage[] {
  return pages.map((p) => {
    let touched = false
    const elements = p.scene.elements.map((el) => {
      const page = pdfPageOf(el)
      if (page === null || el.type !== 'image') return el
      touched = true
      return { ...el, fileId: pdfPlaceholderId(page) as FileId }
    })
    const files: BinaryFiles = {}
    for (const [id, file] of Object.entries(p.scene.files)) {
      if (id.startsWith('pdf-bm-')) { touched = true; continue }
      files[id] = file
    }
    return touched ? { ...p, scene: { ...p.scene, elements, files } } : p
  })
}

// Parse `boards.pages` from the database, tolerating null/legacy values.
export function parsePages(raw: unknown): BoardPage[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((p): p is BoardPage => !!p && typeof p === 'object' && 'id' in p && 'scene' in p)
}

// Board-inserted images are kept out of the database: gather them into one map to
// upload as a Storage blob, and strip them from the pages before saving.
export function collectPageFiles(pages: BoardPage[]): BinaryFiles {
  const out: BinaryFiles = {}
  for (const page of pages) Object.assign(out, page.scene.files)
  return out
}

export function stripPageFiles(pages: BoardPage[]): BoardPage[] {
  return pages.map((p) => (Object.keys(p.scene.files).length ? { ...p, scene: { ...p.scene, files: {} } } : p))
}

// Give each page back only the image files its own elements reference.
export function attachPageFiles(pages: BoardPage[], files: BinaryFiles): BoardPage[] {
  if (Object.keys(files).length === 0) return pages
  return pages.map((p) => {
    const needed: BinaryFiles = {}
    // Screenshots pasted on other handout pages live outside `scene.elements`
    // (their notes are parked in `handout.notes`), so scan those too.
    const allElements = [
      ...p.scene.elements,
      ...Object.values(p.handout?.notes ?? {}).flat(),
    ]
    for (const el of allElements) {
      if (el.type !== 'image') continue
      const fileId = el.fileId
      if (fileId && files[fileId]) needed[fileId] = files[fileId]
    }
    return Object.keys(needed).length ? { ...p, scene: { ...p.scene, files: needed } } : p
  })
}
