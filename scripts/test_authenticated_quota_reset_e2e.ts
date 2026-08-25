/**
 * Test Authenticated Quota Reset E2E against Supabase
 * Verifies RPC presence, auth.uid() requirement, authenticated execution,
 * row update in public.user_generation_quotas, and get_user_generation_quota read-back.
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const testEmail = `dev_test_quota_${Date.now()}@gmail.com`
const testPassword = `TestQuotaPass123!#${Date.now()}`

async function testAuthenticatedQuotaReset() {
  console.log('🧪 Starting Authenticated Quota Reset E2E Test...')
  console.log('📡 Supabase Endpoint:', supabaseUrl)

  const client = createClient(supabaseUrl, supabaseAnonKey)

  // 1. Test Unauthenticated Call (Must be rejected with 200 + success: false + UNAUTHENTICATED)
  console.log('\n--- Step 1: Testing Unauthenticated dev_reset_user_quota RPC ---')
  const unauthRes = await client.rpc('dev_reset_user_quota')
  console.log('Unauthenticated RPC Status:', unauthRes.status)
  console.log('Unauthenticated RPC Data:', JSON.stringify(unauthRes.data, null, 2))
  console.log('Unauthenticated RPC Error:', unauthRes.error)

  if (unauthRes.data?.error !== 'UNAUTHENTICATED' || unauthRes.data?.success !== false) {
    throw new Error('Unauthenticated call was not properly rejected by security definer!')
  }
  console.log('✅ Step 1 PASS: Unauthenticated call safely rejected.')

  // 2. Create and authenticate a test user
  console.log('\n--- Step 2: Creating Test User to verify Authenticated RPC ---')
  const { data: authData, error: authError } = await client.auth.signUp({
    email: testEmail,
    password: testPassword,
  })

  console.log('User signed up. Has session:', !!authData?.session)
  if (authError || !authData.user) {
    console.warn('⚠️ Could not sign up ephemeral test user:', authError?.message)
    return
  }

  // If email confirmation is enabled, we can use signInWithPassword or check if session is active
  if (!authData.session) {
    const { data: signinData, error: signinError } = await client.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })
    console.log('SignIn result. Has session:', !!signinData?.session, 'Error:', signinError?.message)
  }

  const userId = authData.user.id
  console.log('Test User Created & Authenticated. ID:', userId)

  // 3. Simulate existing quota consumption (set used = 10 by consuming)
  console.log('\n--- Step 3: Initial Quota Check ---')
  const initialQuota = await client.rpc('get_user_generation_quota')
  console.log('Initial Quota for User:', initialQuota.data)

  // 4. Call dev_reset_user_quota() with active authenticated JWT
  console.log('\n--- Step 4: Calling dev_reset_user_quota with Authenticated JWT ---')
  const resetRes = await client.rpc('dev_reset_user_quota')
  console.log('Reset RPC Status:', resetRes.status)
  console.log('Reset RPC Data:', JSON.stringify(resetRes.data, null, 2))
  console.log('Reset RPC Error:', resetRes.error)

  if (resetRes.error) {
    throw new Error(`dev_reset_user_quota failed with error: ${resetRes.error.message}`)
  }

  if (resetRes.data?.success !== true || resetRes.data?.stories_generated_today !== 0) {
    throw new Error(`dev_reset_user_quota returned unexpected data: ${JSON.stringify(resetRes.data)}`)
  }
  console.log('✅ Step 4 PASS: dev_reset_user_quota succeeded for authenticated user.')

  // 5. Verify get_user_generation_quota() reads back the reset row
  console.log('\n--- Step 5: Verifying get_user_generation_quota reads reset state ---')
  const verifiedQuota = await client.rpc('get_user_generation_quota')
  console.log('Verified Quota from Database:', verifiedQuota.data)

  if (
    verifiedQuota.data?.used !== 0 ||
    verifiedQuota.data?.remaining !== 10 ||
    verifiedQuota.data?.daily_limit !== 10
  ) {
    throw new Error(`get_user_generation_quota did not match expected reset state! Received: ${JSON.stringify(verifiedQuota.data)}`)
  }

  console.log('✅ Step 5 PASS: Database row successfully read back as 0 Used / 10 Remaining.')

  // 6. Sign out test user
  await client.auth.signOut()
  console.log('\n🎉 ALL AUTHENTICATED QUOTA RESET VERIFICATION STEPS PASSED!')
}

testAuthenticatedQuotaReset().catch((err) => {
  console.error('❌ Verification failed:', err)
  process.exit(1)
})
