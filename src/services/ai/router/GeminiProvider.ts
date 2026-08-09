import type { AIProvider, TextResponse, ImageResponse } from './AIProvider'
import { getGeminiClient } from '../../geminiService'

export class GeminiProvider implements AIProvider {
  name = 'gemini'

  async generateText(prompt: string, model: string): Promise<TextResponse> {
    const client = getGeminiClient()
    const response = await client.models.generateContent({ model, contents: prompt })
    return { text: response.text || '', model, provider: this.name }
  }

  async generateImage(prompt: string, model: string): Promise<ImageResponse> {
    const client = getGeminiClient()
    const response = await client.models.generateImages({
      model,
      prompt,
      config: { numberOfImages: 1 },
    })

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes
    if (!imageBytes) throw new Error('No image generated')

    return {
      imageUrl: `data:image/png;base64,${imageBytes}`,
      model,
      provider: this.name
    }
  }
}
