/**
 * Test Gemini API directly with the key in .env
 */

import * as dotenv from 'dotenv'

dotenv.config()

const geminiApiKey = process.env.GEMINI_API_KEY || ''
console.log('Testing Gemini API key:', geminiApiKey ? `${geminiApiKey.substring(0, 8)}...` : 'MISSING')

async function testGeminiDirect() {
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash', 'gemini-pro']

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`
    console.log(`\nTesting model ${model}...`)
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Write 1 short sentence about a brave star.' }] }],
        }),
      })

      console.log(`Status: ${resp.status} ${resp.statusText}`)
      if (resp.ok) {
        const data = await resp.json()
        console.log('Response:', data?.candidates?.[0]?.content?.parts?.[0]?.text)
      } else {
        const errText = await resp.text()
        console.log('Error payload:', errText)
      }
    } catch (err: any) {
      console.error('Fetch error:', err.message)
    }
  }
}

testGeminiDirect().catch(console.error)
