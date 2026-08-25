import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

try {
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf-8')
    for (const line of envContent.split('\n')) {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/)
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim().replace(/^['"](.*)['"]$/, '$1')
      }
    }
  }
} catch (e) {}

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://kgbmngkedovmtzcbqghk.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const edgeFunctionUrl = `${supabaseUrl}/functions/v1/generate-narration-audio`

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const testLocales: Record<string, string> = {
  'en-US': 'Once upon a time, a small blue star shone brightly.',
  'ur-PK': 'ایک دفعہ کا ذکر ہے کہ کہکشاں میں ایک چھوٹا نیلا ستارہ چمک رہا تھا۔',
  'ar-SA': 'كان يا ما كان، نجم أزرق صغير يلمع في السماء.',
  'es-ES': 'Había una vez una pequeña estrella azul que brillaba.',
  'fr-FR': 'Il était une fois une petite étoile bleue qui brillait.',
  'de-DE': 'Es war einmal ein kleiner blauer Stern am Himmel.',
  'zh-CN': '从前有一颗小蓝星在夜空中闪闪发光。',
  'ja-JP': '昔々、小さな青い星が夜空に輝いていました。',
  'hi-IN': 'एक समय की बात है, एक छोटा नीला तारा चमक रहा था।',
  'pt-BR': 'Era uma vez uma pequena estrela azul que brilhava.',
}

async function runLiveTest() {
  console.log('Authenticating as test@example.com...')
  const testEmail = 'narrtest_' + Date.now() + '@example.com'
  let { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'password123',
  })

  if (authError || !authData.session) {
    console.log('Signup error:', authError)
    console.log('Signup failed or rate limited, attempting to sign in as testuser1@example.com...')
    const loginRes = await supabase.auth.signInWithPassword({
      email: 'user123@example.com',
      password: 'password123',
    })
    authData = loginRes.data
    authError = loginRes.error as any
    if (authError || !authData.session) {
      console.log('Login failed as user123, trying test@example.com...')
      const loginRes2 = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })
      authData = loginRes2.data
      authError = loginRes2.error as any
    }
  }

  if (authError || !authData.session || !authData.user) {
    throw new Error('Failed to sign in/up: ' + (authError?.message || 'No session'))
  }
  const token = authData.session.access_token
  const userId = authData.user.id


  console.log('Inserting a temporary story to pass RLS...')
  const dummyStoryId = `story-${Date.now()}`
  const { error: insertError } = await supabase
    .from('stories')
    .insert([
      {
        id: dummyStoryId,
        user_id: userId,
        title: 'Live Narration Test Story',
        story_content: 'This is a test.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        story_length: 'short',
        topic: 'test',
        age_group: '3-5',
        theme: 'adventure',
      }
    ])

  if (insertError) {
    throw new Error('Failed to insert temporary story: ' + insertError.message)
  }

  const storyId = dummyStoryId

  console.log(`Using Story ID: ${storyId}`)

  console.log('\n==================================================================')
  console.log('🎙️ TESTING LIVE PRODUCTION EDGE FUNCTION NARRATION FOR 10 LOCALES')
  console.log('==================================================================\n')

  let passed = 0
  const hashes = []

  for (const [locale, text] of Object.entries(testLocales)) {
    try {
      const hash = `live_test_${locale.replace('-', '_')}_${Date.now()}`
      hashes.push(hash)

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          storyId,
          language: locale,
          contentHash: hash,
          forceRegenerate: true,
          segments: [
            {
              id: `test-seg-1`,
              text: text,
              speaker: 'Narrator',
              emotion: 'neutral'
            }
          ]
        })
      })

      const status = response.status
      const json = await response.json().catch(() => ({}))

      if (response.ok && json.success) {
        const seg = json.segments[0]
        if (seg.audioUrl && seg.audioUrl.startsWith('http')) {
          console.log(`✅ [${locale}] Success! Audio URL: ${seg.audioUrl.substring(0, 75)}...`)
          passed++
        } else {
          console.log(`❌ [${locale}] Failed: Missing or invalid audioUrl in response`, json)
        }
      } else {
        console.log(`❌ [${locale}] Failed with status ${status}:`, json.error || json)
      }

    } catch (err: any) {
      console.log(`❌ [${locale}] Exception:`, err.message)
    }
  }

  console.log(`\nResults: ${passed}/10 locales succeeded through the live Edge Function.`)
  if (passed !== 10) process.exit(1)
}

runLiveTest().catch(console.error)
