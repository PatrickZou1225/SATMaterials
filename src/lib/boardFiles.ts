import type { BinaryFiles } from '@excalidraw/excalidraw/types'
import { supabase } from './supabase'

// Board-inserted images (pasted screenshots, photos) are collected into one JSON
// blob stored in the `boards` bucket. Keeps the big data URLs out of the database
// row so the 500 MB database limit is never the thing that fills up first.
//
// The path is keyed by the board id and overwritten on every save, so repeated
// saves never pile up orphaned blobs.

const BUCKET = 'boards'

export async function saveBoardFiles(files: BinaryFiles, ownerId: string, boardId: string): Promise<{ path: string; bytes: number }> {
  if (!supabase) throw new Error('未连接服务器')
  const json = JSON.stringify(files)
  const path = `boardfiles/${ownerId}/${boardId}.json`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, new Blob([json], { type: 'application/json' }), { contentType: 'application/json', upsert: true })
  if (error) throw error
  return { path, bytes: new Blob([json]).size }
}

export async function downloadBoardFiles(path: string): Promise<BinaryFiles> {
  if (!supabase) return {}
  const { data, error } = await supabase.storage.from(BUCKET).download(path)
  if (error || !data) throw error ?? new Error('读取板书插图失败')
  try {
    return JSON.parse(await data.text()) as BinaryFiles
  } catch {
    return {}
  }
}

export async function removeBoardFiles(path: string): Promise<void> {
  if (!supabase) return
  await supabase.storage.from(BUCKET).remove([path])
}
