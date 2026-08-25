/**
 * Check existing RPC functions in Supabase
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkRpcFunctions() {
  console.log('Checking consume_story_generation_quota...')
  const r1 = await supabase.rpc('consume_story_generation_quota')
  console.log('consume_story_generation_quota:', r1.error ? `${r1.error.code}: ${r1.error.message}` : r1.data)

  console.log('\nChecking get_user_generation_quota...')
  const r2 = await supabase.rpc('get_user_generation_quota')
  console.log('get_user_generation_quota:', r2.error ? `${r2.error.code}: ${r2.error.message}` : r2.data)
}

checkRpcFunctions().catch(console.error)
