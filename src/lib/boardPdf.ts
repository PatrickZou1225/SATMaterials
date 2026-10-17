import { convertToExcalidrawElements } from '@excalidraw/excalidraw'
import type { BinaryFiles, DataURL } from '@excalidraw/excalidraw/types'
import type { ExcalidrawElement, FileId, OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import { newId } from './board'
import { pdfPageOf, pdfPlaceholderDataUrl, pdfPlaceholderId, type BoardPage, type PdfPageLayout } from './boardPages'

// NOTE: imports the Excalidraw runtime, so callers must import() this lazily.

// One image element per PDF page, stacked at the positions the layout computed.
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

// Boards saved while handouts were single sheets store only the page that was
// on screen plus the other pages' parked notes. Rebuild the tall column: every
// page becomes an element again, and each page's notes move down with its
// sheet (they were drawn with the sheet at the origin).
export function expandHandoutPages(pages: BoardPage[], layout: PdfPageLayout[]): BoardPage[] {
  return pages.map((page) => {
    const h = page.handout
    if (!h || layout.length === 0) return page
    const files: BinaryFiles = {}
    for (const [id, file] of Object.entries(page.scene.files)) {
      if (!id.startsWith('pdf-bm-') && !id.startsWith('pdf-ph-')) files[id] = file
    }
    Object.assign(files, buildHandoutFiles(layout))
    const notes: ExcalidrawElement[] = []
    for (const [key, els] of Object.entries(h.notes ?? {})) {
      const pageNo = Number(key)
      const lay = layout[pageNo - 1]
      // The current sheet's ink is in the scene; `notes` may hold a stale copy.
      if (!lay || pageNo === h.page) continue
      for (const el of els) notes.push({ ...el, y: el.y + lay.y })
    }
    const current = layout[h.page - 1]
    if (current) {
      for (const el of page.scene.elements) {
        if (pdfPageOf(el) === null) notes.push({ ...el, y: el.y + current.y })
      }
    }
    return {
      ...page,
      // A new id makes the mounted surface rebuild with the column scene.
      id: newId(),
      scene: {
        elements: [...buildHandoutElements(layout), ...notes],
        files,
        // Empty so the surface docks the first page on the left.
        appState: {},
      },
      handout: undefined,
    }
  })
}
