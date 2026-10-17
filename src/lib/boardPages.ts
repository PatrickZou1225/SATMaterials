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
  return { id: newId(), name, background: { type: 'blank', color, grid }, scene: emptyScene() }
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
