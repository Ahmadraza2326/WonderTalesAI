import { getGeminiClient } from '../../geminiService'

export class GeminiProvider {
  async generateContent(prompt: string): Promise<string> {
    const client = getGeminiClient()

    const response = await client.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    })

    const text = response.text?.trim()

    if (!text) {
      throw new Error('Gemini returned an empty response.')
    }

    return text
  }
}

export const geminiProvider = new GeminiProvider()