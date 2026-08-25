/**
 * Test RPC dev_reset_user_quota on connected Supabase
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function testRpc() {
  console.log('Testing RPC dev_reset_user_quota against:', supabaseUrl)
  const res = await supabase.rpc('dev_reset_user_quota')
  console.log('RPC Response:', JSON.stringify(res, null, 2))
}

testRpc().catch(console.error)
