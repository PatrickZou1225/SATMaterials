import { convertToExcalidrawElements, exportToCanvas, restore } from '@excalidraw/excalidraw'
import type { BinaryFiles, DataURL } from '@excalidraw/excalidraw/types'
import type { ExcalidrawElement, FileId, OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import type { PDFDocumentProxy } from './board'
import { renderPdfPageToDataUrl, type BoardPage } from './boardPages'

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

async function renderPageToCanvas(page: BoardPage, pdf: PDFDocumentProxy | null): Promise<HTMLCanvasElement> {
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

  // An empty scene has no bounds to export, so paint a default-size board.
  if (elements.length === 0) {
    const canvas = document.createElement('canvas')
    canvas.width = EMPTY_PAGE_WIDTH
    canvas.height = EMPTY_PAGE_HEIGHT
    const ctx = canvas.getContext('2d')
    if (ctx) { ctx.fillStyle = viewBackgroundColor; ctx.fillRect(0, 0, canvas.width, canvas.height) }
    return canvas
  }

  return exportToCanvas({
    elements,
    appState: { exportBackground: true, viewBackgroundColor },
    files,
    exportPadding: 20,
  })
}

// Render every page and stack them into one tall PNG.
export async function exportBoardLongImage(pages: BoardPage[], pdf: PDFDocumentProxy | null): Promise<Blob> {
  const canvases: HTMLCanvasElement[] = []
  for (const page of pages) canvases.push(await renderPageToCanvas(page, pdf))

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
