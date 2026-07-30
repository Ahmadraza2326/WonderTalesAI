import { geminiProvider } from './providers/geminiProvider'

export class AIEngine {
  async generateStory(prompt: string): Promise<string> {
    return geminiProvider.generateContent(prompt)
  }
}

export const aiEngine = new AIEngine()