import { createClient } from '@supabase/supabase-js'

// @ts-ignore
const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : process.env.VITE_SUPABASE_URL) as string | undefined
// @ts-ignore
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : process.env.VITE_SUPABASE_ANON_KEY) as string | undefined

// ============================================================================
// 🛡️ IMPROVED: Environment Validation with Clear Logging
// ============================================================================

const isProduction = typeof process !== 'undefined' && process.env.NODE_ENV === 'production'
const hasValidConfig = Boolean(supabaseUrl && supabaseAnonKey)

if (!hasValidConfig) {
  const errorMessage = '❌ CRITICAL: Supabase environment variables missing!'
  const instructions = [
    'Set the following environment variables in .env or .env.local:',
    '  VITE_SUPABASE_URL=https://your-project.supabase.co',
    'VITE_SUPABASE_ANON_KEY=your-anon-key-here',
  ].join('\n')

  console.error(errorMessage)
  console.error(instructions)

  if (isProduction) {
    console.error('⚠️  Production mode detected. Auth will be unavailable.')
    throw new Error('Supabase is not configured. Authentication unavailable in production.')
  } else {
    console.warn('⚠️  Development mode: Using placeholder credentials. Authentication features will not work.')
  }
}

export const supabase = createClient(
  supabaseUrl?.trim() || 'https://placeholder.supabase.co',
  supabaseAnonKey?.trim() || 'placeholder-anon-key'
)
