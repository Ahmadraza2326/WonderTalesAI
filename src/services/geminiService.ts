import { GoogleGenAI } from '@google/genai'
import { withTimeout } from '../utils/asyncUtils'

// In production browser, Gemini API key is never bundled. Generation routes via Supabase Edge Function.
const geminiApiKey = (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : undefined) as string | undefined

export const geminiClient = geminiApiKey?.trim()
  ? new GoogleGenAI({ apiKey: geminiApiKey.trim() })
  : undefined

export function getGeminiClient() {
  if (!geminiClient) {
    throw new Error('Local Gemini client is not configured for direct fallback. In production, generation routes securely through the server boundary.')
  }

  return geminiClient
}

let lastDiagnosticTestTime = 0
const DIAGNOSTIC_COOLDOWN_MS = 10000 // 10 seconds debounce for developer diagnostic test

export async function testGeminiConnection(): Promise<string> {
  const now = Date.now()
  if (now - lastDiagnosticTestTime < DIAGNOSTIC_COOLDOWN_MS) {
    const waitSeconds = Math.ceil((DIAGNOSTIC_COOLDOWN_MS - (now - lastDiagnosticTestTime)) / 1000)
    throw new Error(`Diagnostic test is on cooldown. Please wait ${waitSeconds}s before testing again.`)
  }
  lastDiagnosticTestTime = now

  const client = getGeminiClient()
  const prompt = 'Reply with exactly:\nORBIS connection verified.'

  const requestPromise = client.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
  })

  const response = await withTimeout(requestPromise, 15000, 'Diagnostic test timed out after 15s.')

  const responseText = response.text?.trim() || ''
  if (!responseText) {
    throw new Error('Gemini returned an empty response.')
  }

  return responseText
}
