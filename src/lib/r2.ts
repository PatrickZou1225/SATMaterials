import { supabase } from './supabase'

// Big files (handout PDFs) live on Cloudflare R2 — 10 GB free instead of Supabase's
// 1 GB — served by a small Cloudflare Worker (see cloudflare-worker/). If the
// Worker URL isn't configured the site quietly falls back to Supabase storage.

const WORKER_URL = (import.meta.env.VITE_R2_WORKER_URL as string | undefined)?.replace(/\/+$/, '') ?? ''

export const r2Enabled = WORKER_URL.length > 0

// Marker stored in library_files.storage_path so we can tell where a file lives.
export const R2_PREFIX = 'r2:'

async function authHeaders(): Promise<Record<string, string>> {
  if (!supabase) return {}
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function r2Url(key: string): string {
  return `${WORKER_URL}/file?key=${encodeURIComponent(key)}`
}

export async function r2Upload(file: File, key: string): Promise<{ bytes: number }> {
  const res = await fetch(`${WORKER_URL}/upload?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': file.type || 'application/octet-stream', ...(await authHeaders()) },
    body: file,
  })
  if (!res.ok) throw new Error(`上传到 R2 失败 (${res.status})`)
  const data = (await res.json()) as { size?: number }
  return { bytes: data.size ?? file.size }
}

export async function r2Delete(key: string): Promise<void> {
  await fetch(`${WORKER_URL}/upload?key=${encodeURIComponent(key)}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  })
}
