import type { GeneratedIllustration, ImageProvider } from '../../imageProvider'
import type { IllustrationPrompt } from '../../illustrationPromptGenerator'

export class GeminiImageProvider implements ImageProvider {
  async generateImages(
    prompts: IllustrationPrompt[]
  ): Promise<GeneratedIllustration[]> {
    return Promise.all(prompts.map(prompt => this.generateImage(prompt)))
  }

  private async generateImage(
    prompt: IllustrationPrompt
  ): Promise<GeneratedIllustration> {
    this.prepareRequest(prompt)

    // TODO: Implement Gemini authentication here.
    // TODO: Send the prepared request to the Gemini image generation endpoint.
    // TODO: Parse the Gemini response into the standard GeneratedIllustration shape.

    return {
      scene: prompt.scene,
      imageUrl: '',
    }
  }

  private prepareRequest(prompt: IllustrationPrompt): { prompt: string; scene: number } {
    return {
      prompt: prompt.prompt,
      scene: prompt.scene,
    }
  }
}
