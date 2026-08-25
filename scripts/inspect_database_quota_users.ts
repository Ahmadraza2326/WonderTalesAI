/**
 * Inspect Database Quota and Users
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectDb() {
  console.log('=== 1. PROFILES TABLE ===')
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*')
  console.log('Profiles:', pErr ? pErr.message : profiles)

  console.log('\n=== 2. USER GENERATION QUOTAS TABLE ===')
  const { data: quotas, error: qErr } = await supabase.from('user_generation_quotas').select('*')
  console.log('Quotas:', qErr ? qErr.message : quotas)

  console.log('\n=== 3. STORIES TABLE ===')
  const { data: stories, error: sErr } = await supabase.from('stories').select('id, user_id, title, status, generation_status, created_at, generated_at')
  console.log('Stories:', sErr ? sErr.message : stories)

  console.log('\n=== 4. RPC get_user_generation_quota (anon call) ===')
  const { data: rpcData, error: rpcErr } = await supabase.rpc('get_user_generation_quota', {
    p_daily_limit: 10,
    p_cooldown_seconds: 20
  })
  console.log('RPC get_user_generation_quota result:', rpcErr ? rpcErr.message : rpcData)
}

inspectDb().catch(console.error)
