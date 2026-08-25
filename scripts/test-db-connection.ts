import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''

console.log('Testing Supabase URL:', supabaseUrl)
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  console.log('\n--- Checking Tables in Connected Supabase ---')

  // 1. Stories
  const { data: stories, error: storiesErr } = await supabase.from('stories').select('id').limit(1)
  console.log('stories table:', storiesErr ? `ERROR: ${storiesErr.message}` : `OK (${stories?.length ?? 0} rows found)`)

  // 2. Profiles
  const { data: profiles, error: profilesErr } = await supabase.from('profiles').select('id').limit(1)
  console.log('profiles table:', profilesErr ? `ERROR: ${profilesErr.message}` : `OK (${profiles?.length ?? 0} rows found)`)

  // 3. Child Profiles
  const { data: children, error: childrenErr } = await supabase.from('child_profiles').select('id').limit(1)
  console.log('child_profiles table:', childrenErr ? `ERROR: ${childrenErr.message}` : `OK (${children?.length ?? 0} rows found)`)

  // 4. Story Reading Progress
  const { data: progress, error: progressErr } = await supabase.from('story_reading_progress').select('id').limit(1)
  console.log('story_reading_progress table:', progressErr ? `ERROR: ${progressErr.message}` : `OK (${progress?.length ?? 0} rows found)`)

  // 5. User Generation Quotas
  const { data: quotas, error: quotasErr } = await supabase.from('user_generation_quotas').select('user_id').limit(1)
  console.log('user_generation_quotas table:', quotasErr ? `ERROR: ${quotasErr.message}` : `OK (${quotas?.length ?? 0} rows found)`)

  // 6. Story Translations (Phase 8H)
  const { data: translations, error: transErr } = await supabase.from('story_translations').select('id').limit(1)
  console.log('story_translations table:', transErr ? `ERROR: ${transErr.message}` : `OK (${translations?.length ?? 0} rows found)`)
}

checkTables()
