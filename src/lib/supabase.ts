import { createClient } from '@supabase/supabase-js'

// @ts-ignore
const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : process.env.VITE_SUPABASE_URL) as string | undefined
// @ts-ignore
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : process.env.VITE_SUPABASE_ANON_KEY) as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not configured. Authentication will be unavailable until they are provided.')
}

export const supabase = createClient(
  supabaseUrl?.trim() || 'https://placeholder.supabase.co',
  supabaseAnonKey?.trim() || 'placeholder-anon-key'
)
