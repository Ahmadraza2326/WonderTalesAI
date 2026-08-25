/**
 * List Gemini Models available with current key
 */

import * as dotenv from 'dotenv'

dotenv.config()

const geminiApiKey = process.env.GEMINI_API_KEY || ''

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`
  console.log('Fetching models from:', url)
  const resp = await fetch(url)
  console.log(`Status: ${resp.status}`)
  if (resp.ok) {
    const data = await resp.json()
    console.log('Available models:')
    for (const m of data.models || []) {
      if (m.supportedGenerationMethods?.includes('generateContent')) {
        console.log(`- ${m.name} (${m.displayName})`)
      }
    }
  } else {
    console.log('Error:', await resp.text())
  }
}

listModels().catch(console.error)
