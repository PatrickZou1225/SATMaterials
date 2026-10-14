import { convertToExcalidrawElements, exportToCanvas, getCommonBounds, restore } from '@excalidraw/excalidraw'
import type { BinaryFiles, DataURL } from '@excalidraw/excalidraw/types'
import type { ExcalidrawElement, FileId, OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import type { PDFDocumentProxy } from './board'
import { pdfPageOf, renderPdfPageToDataUrl, type BoardPage } from './boardPages'

// NOTE: this module imports the Excalidraw runtime, so it must only ever be
// pulled in from lazily-loaded code (BoardSurface, or a dynamic import()).
// Importing it statically from a page would drag Excalidraw into the main bundle.

export type BackgroundImage = { id: string; dataUrl: string; width: number; height: number }

// Build the locked image element + file entry that bakes a handout page into a
// scene. The element id is fixed so it can be stripped again before saving.
export function buildBackgroundElement(bg: BackgroundImage): { elements: OrderedExcalidrawElement[]; files: BinaryFiles } {
  const elements = convertToExcalidrawElements([{
    type: 'image',
    id: bg.id as ExcalidrawElement['id'],
    x: 0,
    y: 0,
    width: bg.width,
    height: bg.height,
    fileId: bg.id as FileId,
  }], { regenerateIds: false }).map((el) => (el.type === 'image' ? { ...el, locked: true } : el))
  const files: BinaryFiles = {
    [bg.id]: { id: bg.id as FileId, mimeType: 'image/png', dataURL: bg.dataUrl as DataURL, created: Date.now() },
  }
  return { elements, files }
}

const EMPTY_PAGE_WIDTH = 1000
const EMPTY_PAGE_HEIGHT = 700
const EXPORT_PADDING = 20
// Browsers cap canvas dimensions (≤32767px per side, less on some GPUs); stay
// well under it or the 58-page column silently fails to export.
const MAX_EXPORT_PX = 16000

type PageScene = {
  elements: readonly OrderedExcalidrawElement[]
  files: BinaryFiles
  viewBackgroundColor: string
}

// Assemble a page's elements + files. Handout pages carry their PDF as image
// elements pointing at placeholders; swap in the real bitmaps here, keyed by the
// element's own fileId, so the export shows pages rather than grey cards.
async function buildPageScene(page: BoardPage, pdf: PDFDocumentProxy | null): Promise<PageScene> {
  const restored = restore(
    { elements: page.scene.elements, appState: page.scene.appState, files: page.scene.files },
    null,
    null,
  )
  let elements: readonly OrderedExcalidrawElement[] = restored.elements
  let files = restored.files
  const viewBackgroundColor = page.background.type === 'blank' ? page.background.color : '#ffffff'

  if (page.background.type === 'pdf' && pdf) {
    const rendered = await renderPdfPageToDataUrl(pdf, page.background.pdfPage)
    const bg = buildBackgroundElement({ id: `bg-${page.id}`, ...rendered })
    elements = [...bg.elements, ...elements]
    files = { ...bg.files, ...files }
  }

  if (pdf) {
    const done = new Set<number>()
    const withBitmaps: BinaryFiles = { ...files }
    for (const el of elements) {
      const p = pdfPageOf(el)
      if (p === null || el.type !== 'image' || !el.fileId || done.has(p)) continue
      done.add(p)
      const rendered = await renderPdfPageToDataUrl(pdf, p)
      withBitmaps[el.fileId] = { id: el.fileId, mimeType: 'image/png', dataURL: rendered.dataUrl as DataURL, created: Date.now() }
    }
    files = withBitmaps
  }

  return { elements, files, viewBackgroundColor }
}

function sceneToCanvas(scene: PageScene, exportScale: number): HTMLCanvasElement | Promise<HTMLCanvasElement> {
  // An empty scene has no bounds to export, so paint a default-size board.
  if (scene.elements.length === 0) {
    const canvas = document.createElement('canvas')
    canvas.width = EMPTY_PAGE_WIDTH
    canvas.height = EMPTY_PAGE_HEIGHT
    const ctx = canvas.getContext('2d')
    if (ctx) { ctx.fillStyle = scene.viewBackgroundColor; ctx.fillRect(0, 0, canvas.width, canvas.height) }
    return canvas
  }
  return exportToCanvas({
    elements: scene.elements,
    appState: { exportBackground: true, viewBackgroundColor: scene.viewBackgroundColor, exportScale },
    files: scene.files,
    exportPadding: EXPORT_PADDING,
  })
}

// Render every page and stack them into one tall PNG. The scale is chosen so the
// whole column fits the canvas size limit (a 58-page handout would otherwise be
// far too tall to rasterise in one image).
export async function exportBoardLongImage(pages: BoardPage[], pdf: PDFDocumentProxy | null): Promise<Blob> {
  const scenes: PageScene[] = []
  for (const page of pages) scenes.push(await buildPageScene(page, pdf))

  let sceneHeight = 0
  for (const scene of scenes) {
    if (scene.elements.length === 0) { sceneHeight += EMPTY_PAGE_HEIGHT; continue }
    const [, minY, , maxY] = getCommonBounds(scene.elements)
    sceneHeight += (maxY - minY) + EXPORT_PADDING * 2
  }
  const exportScale = Math.max(0.25, Math.min(2, MAX_EXPORT_PX / Math.max(1, sceneHeight)))

  const canvases: HTMLCanvasElement[] = []
  for (const scene of scenes) canvases.push(await sceneToCanvas(scene, exportScale))

  const width = Math.max(...canvases.map((c) => c.width))
  const height = canvases.reduce((sum, c) => sum + c.height, 0)
  const out = document.createElement('canvas')
  out.width = width
  out.height = height
  const ctx = out.getContext('2d')
  if (!ctx) throw new Error('无法创建画布')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  let y = 0
  for (const c of canvases) {
    ctx.drawImage(c, Math.floor((width - c.width) / 2), y)
    y += c.height
  }
  return new Promise<Blob>((resolve, reject) => {
    out.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('导出失败'))), 'image/png')
  })
}
