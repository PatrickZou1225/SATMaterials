// Cloudflare Worker — the site's file store, backed by an R2 bucket.
//
//   GET    /file?key=...    stream a stored file (public; keys are unguessable)
//   POST   /upload?key=...  store a file (needs a signed-in Supabase user)
//   DELETE /upload?key=...  remove a file (needs a signed-in Supabase user)
//   GET    /                health check
//
// Secrets (set with `npx wrangler secret put <NAME>`):
//   SUPABASE_URL, SUPABASE_ANON_KEY   — used to verify the caller is signed in
// Optional var:
//   ALLOWED_ORIGIN  — your website origin, or "*" (default)

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env)
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })

    const url = new URL(request.url)
    const key = url.searchParams.get('key') || ''

    if (url.pathname === '/' && request.method === 'GET') {
      return json({ ok: true, service: 'sat-prep-drive' }, 200, cors)
    }

    if (url.pathname === '/file' && request.method === 'GET') {
      if (!key) return json({ error: 'missing key' }, 400, cors)
      const obj = await env.BUCKET.get(key)
      if (!obj) return json({ error: 'not found' }, 404, cors)
      const headers = new Headers(cors)
      headers.set('Content-Type', obj.httpMetadata?.contentType || 'application/octet-stream')
      headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      headers.set('ETag', obj.httpEtag)
      headers.set('Accept-Ranges', 'bytes')
      return new Response(obj.body, { headers })
    }

    if (url.pathname === '/upload') {
      const user = await verifyUser(request, env)
      if (!user) return json({ error: 'unauthorized' }, 401, cors)
      if (!key) return json({ error: 'missing key' }, 400, cors)

      if (request.method === 'POST') {
        if (!request.body) return json({ error: 'missing body' }, 400, cors)
        const contentType = request.headers.get('Content-Type') || 'application/octet-stream'
        const stored = await env.BUCKET.put(key, request.body, { httpMetadata: { contentType } })
        return json({ url: fileUrl(request, env, key), size: stored.size }, 200, cors)
      }

      if (request.method === 'DELETE') {
        await env.BUCKET.delete(key)
        return json({ ok: true }, 200, cors)
      }

      return json({ error: 'method not allowed' }, 405, cors)
    }

    return json({ error: 'not found' }, 404, cors)
  },
}

function fileUrl(request, env, key) {
  const base = env.PUBLIC_BASE || new URL(request.url).origin
  return `${base}/file?key=${encodeURIComponent(key)}`
}

function corsHeaders(request, env) {
  const allowed = env.ALLOWED_ORIGIN || '*'
  const origin = request.headers.get('Origin')
  return {
    'Access-Control-Allow-Origin': allowed === '*' ? '*' : origin === allowed ? origin : allowed,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

// Ask Supabase whether the request's bearer token belongs to a real user.
async function verifyUser(request, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null
  const auth = request.headers.get('Authorization') || ''
  if (!auth.startsWith('Bearer ')) return null
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: auth },
  })
  if (!res.ok) return null
  try {
    return await res.json()
  } catch {
    return null
  }
}
