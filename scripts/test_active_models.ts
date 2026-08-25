/**
 * Test specific model with timeout
 */

import * as dotenv from 'dotenv'

dotenv.config()

const geminiApiKey = process.env.GEMINI_API_KEY || ''

async function testModel(modelName: string) {
  console.log(`Testing ${modelName}...`)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Write: "Hello WonderTales"' }] }],
      }),
      signal: controller.signal,
    })
    clearTimeout(timer)
    console.log(`Status: ${resp.status}`)
    if (resp.ok) {
      const data = await resp.json()
      console.log('Result:', data?.candidates?.[0]?.content?.parts?.[0]?.text)
    } else {
      console.log('Error:', (await resp.text()).substring(0, 200))
    }
  } catch (e: any) {
    clearTimeout(timer)
    console.log('Exception:', e.message)
  }
}

async function run() {
  await testModel('gemini-3.6-flash')
  await testModel('gemini-3.5-flash')
  await testModel('gemini-3-flash-preview')
  await testModel('gemini-3.1-flash-lite')
}

run().catch(console.error)
