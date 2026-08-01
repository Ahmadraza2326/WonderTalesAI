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
    // TODO: Google AI SDK
    // TODO: Authentication
    // TODO: Image generation request
    // TODO: Response parsing
    // TODO: Error handling

    return {
      scene: prompt.scene,
      imageUrl: '',
    }
  }
}
