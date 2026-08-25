
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

async function testRuntimeAudio() {
  console.log('--- 1. Authenticate with Service Role Key ---')
  if (!serviceRoleKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY missing from .env')
    return
  }

  const urduText = `ایک دفعہ کا ذکر ہے۔ وہاں ایک پرندہ تھا۔`
  const story = {
    id: `story-audio-test-${Date.now()}`,
    user_id: 'd9b2d63d-a233-4123-8534-123456789abc',
    title: 'Test Story',
    story_content: urduText,
    language: 'Urdu',
    reading_level: 'Grade 2'
  }

  console.log('\n--- 2. Call generate-narration-audio Edge Function directly ---')
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/generate-narration-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        storyId: story.id,
        language: 'ur-PK',
        contentHash: 'test-hash-1',
        forceRegenerate: true,
        segments: [{
          id: 'seg1',
          text: urduText,
          speaker: 'Narrator',
          emotion: 'neutral'
        }],
      }),
    })

    console.log(`\nHTTP Status: ${response.status} ${response.statusText}`)
    
    const text = await response.text()
    console.log(`Response Body: ${text}`)

    if (!response.ok) {
      console.log('--- ERROR TRACE ---')
      console.log(`Failed with status ${response.status}. Body: ${text}`)
    }
  } catch (err: any) {
    console.log(`\nFetch threw an error: ${err.message}`)
  }
}

testRuntimeAudio()
