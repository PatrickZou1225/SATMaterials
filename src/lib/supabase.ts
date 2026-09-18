import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// The existing site remains usable until a Supabase project is configured.
export const supabase = url && publishableKey
  ? createClient(url, publishableKey)
  : null
