import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

export type { PDFDocumentProxy }

export type Board = {
  id: string
  title: string
  teacher_id: string
  status: 'draft' | 'published' | 'archived'
  pdf_path: string | null
  pdf_name: string | null
  page_count: number
  // Raw `boards.pages` JSON; parse with `parsePages()` from ./boardPages.
  pages: unknown
  // Storage blob holding the board's pasted images (see ./boardFiles).
  files_path: string | null
  files_bytes: number | null
  created_at: string
  updated_at: string
}

export function loadPdf(url: string): Promise<PDFDocumentProxy> {
  return pdfjsLib.getDocument({ url }).promise
}

export function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
