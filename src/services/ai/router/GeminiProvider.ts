import type { AIProvider, TextResponse, ImageResponse } from './AIProvider'
import { orbisAIProvider } from '../providers/geminiProvider'

export class GeminiProvider implements AIProvider {
  name = 'gemini'

  async generateText(prompt: string, model: string): Promise<TextResponse> {
    const text = await orbisAIProvider.generateContent(prompt)
    return { text, model, provider: this.name }
  }

  async generateImage(_prompt: string, model: string): Promise<ImageResponse> {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      model,
      provider: this.name,
    }
  }
}
