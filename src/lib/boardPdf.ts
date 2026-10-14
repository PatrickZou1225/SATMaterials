import { convertToExcalidrawElements } from '@excalidraw/excalidraw'
import type { BinaryFiles, DataURL } from '@excalidraw/excalidraw/types'
import type { ExcalidrawElement, FileId, OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import { pdfPlaceholderDataUrl, pdfPlaceholderId, type PdfPageLayout } from './boardPages'

// NOTE: imports the Excalidraw runtime, so callers must import() this lazily.

// One image element per PDF page, stacked at the positions the layout computed.
// BoardSurface locks every page on load so the handout reads as one fixed
// document: pages can be neither dragged apart nor selected by accident.
export function buildHandoutElements(layout: PdfPageLayout[]): OrderedExcalidrawElement[] {
  const elements = convertToExcalidrawElements(
    layout.map((p) => ({
      type: 'image' as const,
      id: `pdf-el-${p.page}` as ExcalidrawElement['id'],
      x: 0,
      y: p.y,
      width: p.width,
      height: p.height,
      fileId: pdfPlaceholderId(p.page) as FileId,
    })),
    { regenerateIds: false },
  )
  // Tag each element with the page it shows. Look the page up by id, never by
  // array index: convertToExcalidrawElements may reorder what it returns, which
  // would stamp page numbers onto the wrong images.
  const pageById = new Map(layout.map((p) => [`pdf-el-${p.page}`, p.page]))
  return elements.map((el) => {
    const page = pageById.get(el.id)
    return page === undefined ? el : { ...el, customData: { pdfPage: page } }
  })
}

// The placeholder bitmaps the elements point at until they scroll into view.
export function buildHandoutFiles(layout: PdfPageLayout[]): BinaryFiles {
  const files: BinaryFiles = {}
  for (const p of layout) {
    const id = pdfPlaceholderId(p.page)
    files[id] = {
      id: id as FileId,
      mimeType: 'image/png',
      dataURL: pdfPlaceholderDataUrl(p.page, p.width, p.height) as DataURL,
      created: Date.now(),
    }
  }
  return files
}
