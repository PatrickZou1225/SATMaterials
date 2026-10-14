import type { BinaryFiles } from '@excalidraw/excalidraw/types'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'
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

export type BoardPage = {
  id: string
  name: string
  background: PageBackground
  scene: BoardScene
}

// Excalidraw scene coordinates are unitless. We render every handout page at a
// fixed width so a board looks identical on any screen.
export const BACKGROUND_WIDTH = 1000

// Blank pages are a blackboard: dark background, light ink (see defaultInkColor).
const BLANK_COLOR = '#000000'

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

// Render one page of a PDF to a PNG data URL at BACKGROUND_WIDTH. Used to bake
// a handout page into the Excalidraw scene as a locked background image.
export async function renderPdfPageToDataUrl(
  pdf: PDFDocumentProxy,
  pageNumber: number,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const page = await pdf.getPage(pageNumber)
  const base = page.getViewport({ scale: 1 })
  const scale = BACKGROUND_WIDTH / base.width
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法创建画布')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  await page.render({ canvas, canvasContext: ctx, viewport }).promise
  return { dataUrl: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height }
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
    for (const el of p.scene.elements) {
      if (el.type !== 'image') continue
      const fileId = el.fileId
      if (fileId && files[fileId]) needed[fileId] = files[fileId]
    }
    return Object.keys(needed).length ? { ...p, scene: { ...p.scene, files: needed } } : p
  })
}
