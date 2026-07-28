import { GoogleGenAI } from '@google/genai'

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

if (!geminiApiKey?.trim()) {
  console.warn('VITE_GEMINI_API_KEY is not configured. Gemini integration will be unavailable until it is provided.')
}

export const geminiClient = geminiApiKey?.trim()
  ? new GoogleGenAI({ apiKey: geminiApiKey.trim() })
  : undefined

export function getGeminiClient() {
  if (!geminiClient) {
    throw new Error('Gemini client is not available because VITE_GEMINI_API_KEY is not configured.')
  }

  return geminiClient
}

export async function testGeminiConnection(): Promise<string> {
  const client = getGeminiClient()
  const prompt = 'Reply with exactly:\nWonderTales connection successful.'

  const response = await client.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
  })

  const responseText = response.text?.trim() || ''
  if (!responseText) {
    throw new Error('Gemini returned an empty response.')
  }

  return responseText
}
