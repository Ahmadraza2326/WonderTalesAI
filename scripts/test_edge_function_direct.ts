/**
 * Test Edge Function and Gemini Generation
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function testEdgeFunction() {
  console.log('Testing Edge Function generate-story-package...')
  try {
    const { data, error } = await supabase.functions.invoke('generate-story-package', {
      body: { prompt: 'Write a short 1-sentence test.' },
    })

    console.log('Edge Function Response data:', data)
    console.log('Edge Function Response error:', error)
  } catch (err: any) {
    console.error('Edge Function Exception:', err)
  }
}

testEdgeFunction().catch(console.error)
