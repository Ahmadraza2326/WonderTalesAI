/**
 * Find working Gemini model
 */

import * as dotenv from 'dotenv'

dotenv.config()

const geminiApiKey = process.env.GEMINI_API_KEY || ''

const candidateModels = [
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-3.1-pro-preview',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-pro-latest',
  'gemini-3.1-flash-lite',
]

async function findWorkingModel() {
  for (const model of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply: READY' }] }],
        }),
      })

      if (resp.ok) {
        const data = await resp.json()
        console.log(`✅ SUCCESS with ${model}:`, data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim())
        return model
      } else {
        console.log(`❌ ${model} failed (${resp.status}):`, (await resp.json())?.error?.message?.substring(0, 100))
      }
    } catch (e: any) {
      console.log(`❌ ${model} error:`, e.message)
    }
  }
}

findWorkingModel().catch(console.error)
