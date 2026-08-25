/**
 * Test Gemini 2.5 Flash Model
 */

import * as dotenv from 'dotenv'

dotenv.config()

const geminiApiKey = process.env.GEMINI_API_KEY || ''

async function testGemini25Flash() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`
  console.log('Testing gemini-2.5-flash endpoint...')
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Write a 1-sentence tale about a celestial voyager.' }] }],
    }),
  })

  console.log(`Status: ${resp.status} ${resp.statusText}`)
  if (resp.ok) {
    const data = await resp.json()
    console.log('Generated content:\n', data?.candidates?.[0]?.content?.parts?.[0]?.text)
  } else {
    console.log('Error:', await resp.text())
  }
}

testGemini25Flash().catch(console.error)
