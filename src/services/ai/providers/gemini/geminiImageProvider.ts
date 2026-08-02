import type { GeneratedIllustration, ImageProvider } from '../../imageProvider'
import type { IllustrationPrompt } from '../../illustrationPromptGenerator'
import { getGeminiConfig } from '../../../../config/aiConfig'

export class GeminiImageProvider implements ImageProvider {
  private readonly config = getGeminiConfig()

  async generateImages(
    prompts: IllustrationPrompt[]
  ): Promise<GeneratedIllustration[]> {
    return Promise.all(prompts.map(prompt => this.generateImage(prompt)))
  }

  private async generateImage(
    prompt: IllustrationPrompt
  ): Promise<GeneratedIllustration> {
    this.prepareRequest(prompt)

    // TODO: Implement Gemini authentication here using the configured API key.
    // TODO: Send the prepared request to the Gemini image generation endpoint.
    // TODO: Parse the Gemini response into the standard GeneratedIllustration shape.

    return {
      scene: prompt.scene,
      imageUrl: '',
    }
  }

  private prepareRequest(prompt: IllustrationPrompt): { prompt: string; scene: number; config: { apiKey?: string; model?: string; timeoutMs?: number; baseUrl?: string } } {
    return {
      prompt: prompt.prompt,
      scene: prompt.scene,
      config: this.config,
    }
  }
}
