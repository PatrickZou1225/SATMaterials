import { supabase } from './supabase'
import { newId } from './board'
import { R2_PREFIX, r2Delete, r2Enabled, r2Upload, r2Url } from './r2'

// The owner's private PDF "cloud drive". The metadata row lives in
// `library_files`; the file itself lives on Cloudflare R2 when configured, and
// on Supabase Storage otherwise. `storage_path` records which: an `r2:` prefix
// means R2, anything else is a Supabase object key.

export type LibraryFile = {
  id: string
  name: string
  size_bytes: number | null
  storage_path: string
  created_at: string
}

export const LIBRARY_BUCKET = 'boards'

export async function listLibraryFiles(): Promise<LibraryFile[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('library_files')
    .select('id, name, size_bytes, storage_path, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as LibraryFile[]
}

export async function uploadLibraryFile(file: File, ownerId: string): Promise<LibraryFile> {
  if (!supabase) throw new Error('未连接服务器')
  const key = `library/${ownerId}/${newId()}.pdf`

  let storagePath: string
  let size = file.size
  if (r2Enabled) {
    const up = await r2Upload(file, key)
    storagePath = `${R2_PREFIX}${key}`
    size = up.bytes
  } else {
    const upload = await supabase.storage.from(LIBRARY_BUCKET).upload(key, file, { contentType: 'application/pdf', upsert: false })
    if (upload.error) throw upload.error
    storagePath = key
  }

  const { data, error } = await supabase
    .from('library_files')
    .insert({ owner_id: ownerId, name: file.name.replace(/\.pdf$/i, ''), size_bytes: size, storage_path: storagePath })
    .select('id, name, size_bytes, storage_path, created_at')
    .single()
  if (error || !data) {
    if (r2Enabled) await r2Delete(key)
    else await supabase.storage.from(LIBRARY_BUCKET).remove([key])
    throw error ?? new Error('保存文件信息失败')
  }
  return data as LibraryFile
}

export async function deleteLibraryFile(row: LibraryFile): Promise<void> {
  if (!supabase) return
  if (row.storage_path.startsWith(R2_PREFIX)) await r2Delete(row.storage_path.slice(R2_PREFIX.length))
  else await supabase.storage.from(LIBRARY_BUCKET).remove([row.storage_path])
  await supabase.from('library_files').delete().eq('id', row.id)
}

// Resolve a stored path (Supabase object key or `r2:` key) to a fetchable URL.
export function storageFileUrl(path: string): string {
  if (path.startsWith(R2_PREFIX)) return r2Url(path.slice(R2_PREFIX.length))
  if (!supabase) return ''
  return supabase.storage.from(LIBRARY_BUCKET).getPublicUrl(path).data.publicUrl
}

export function libraryFileUrl(row: LibraryFile): string {
  return storageFileUrl(row.storage_path)
}

// 1 GB on the Supabase free tier; 10 GB once R2 is wired up.
export const STORAGE_QUOTA_BYTES = r2Enabled ? 10 * 1024 * 1024 * 1024 : 1024 * 1024 * 1024

// Approximate used storage: uploaded handout PDFs + images pasted onto boards.
// The client can't read the true bucket total, so we sum what we track.
export async function driveUsage(teacherId?: string): Promise<number> {
  if (!supabase) return 0
  let total = 0
  const libs = await supabase.from('library_files').select('size_bytes')
  if (!libs.error) total += (libs.data ?? []).reduce((s, r) => s + ((r as { size_bytes: number | null }).size_bytes ?? 0), 0)
  if (teacherId) {
    const boards = await supabase.from('boards').select('files_bytes').eq('teacher_id', teacherId)
    if (!boards.error) total += (boards.data ?? []).reduce((s, r) => s + ((r as { files_bytes: number | null }).files_bytes ?? 0), 0)
  }
  return total
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(1)} MB`
  return `${(mb / 1024).toFixed(1)} GB`
}
