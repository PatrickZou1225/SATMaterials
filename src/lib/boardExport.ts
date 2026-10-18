import { convertToExcalidrawElements, exportToCanvas, getCommonBounds, restore } from '@excalidraw/excalidraw'
import type { BinaryFiles, DataURL } from '@excalidraw/excalidraw/types'
import type { ExcalidrawElement, FileId, OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import { pdfPageOf, type BoardPage } from './boardPages'

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

const EXPORT_PADDING = 20
// Browsers cap canvas dimensions (≤32767px per side, less on some GPUs); stay
// well under it or a very long column silently fails to export.
const MAX_EXPORT_PX = 16000

type PageScene = {
  elements: readonly OrderedExcalidrawElement[]
  files: BinaryFiles
  viewBackgroundColor: string
}

// The canvas colour of a page: blank boards carry it on the background, PDF
// boards on the saved scene (matching the blackboard default in BoardSurface).
// Handout annotations are exported without the sheet, so they go on white —
// the ink on a handout is dark and would vanish on the deep-blue backdrop.
function canvasColorOf(page: BoardPage): string {
  if (page.kind === 'handout') return '#ffffff'
  if (page.background.type === 'blank') return page.background.color
  const stored = page.scene.appState.viewBackgroundColor
  return typeof stored === 'string' ? stored : '#000000'
}

// Only the teacher's own ink goes into the export — handout page images are
// dropped, together with the placeholder files pointing at them. (Baking the
// full pages in was what turned long exports into a low-res mosaic.) Pages with
// nothing drawn are skipped by the caller.
function buildInkScene(page: BoardPage): PageScene {
  const restored = restore(
    { elements: page.scene.elements, appState: page.scene.appState, files: page.scene.files },
    null,
    null,
  )
  return {
    elements: restored.elements.filter((el) => !el.isDeleted && pdfPageOf(el) === null),
    files: restored.files,
    viewBackgroundColor: canvasColorOf(page),
  }
}

function sceneToCanvas(scene: PageScene, exportScale: number): HTMLCanvasElement | Promise<HTMLCanvasElement> {
  return exportToCanvas({
    elements: scene.elements,
    appState: { exportBackground: true, viewBackgroundColor: scene.viewBackgroundColor, exportScale },
    files: scene.files,
    exportPadding: EXPORT_PADDING,
  })
}

// Stack every annotated page into one tall PNG, each on its own canvas colour.
// The scale is chosen so the whole column fits the canvas size limit (a 58-page
// handout would otherwise be far too tall to rasterise in one image).
export async function exportBoardLongImage(pages: BoardPage[]): Promise<Blob> {
  // Annotations on the handout first, then the blackboard notes.
  const ordered = [...pages].sort((a, b) => (a.kind === 'handout' ? 0 : 1) - (b.kind === 'handout' ? 0 : 1))
  const scenes = ordered.map(buildInkScene).filter((scene) => scene.elements.length > 0)
  if (scenes.length === 0) throw new Error('还没有任何板书内容可以导出。')

  let sceneHeight = 0
  for (const scene of scenes) {
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
