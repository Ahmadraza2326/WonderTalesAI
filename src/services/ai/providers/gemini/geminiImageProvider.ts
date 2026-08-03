import type { GeneratedIllustration, ImageProvider } from '../../imageProvider'
import type { IllustrationPrompt } from '../../illustrationPromptGenerator'

import { getGeminiClient } from '../../../geminiService'

export class GeminiImageProvider implements ImageProvider {
  

  async generateImages(
    prompts: IllustrationPrompt[]
  ): Promise<GeneratedIllustration[]> {
    return Promise.all(prompts.map(prompt => this.generateImage(prompt)))
  }

  private async generateImage(
  prompt: IllustrationPrompt
): Promise<GeneratedIllustration> {

  const client = getGeminiClient()

  const response = await client.models.generateImages({
    model: 'imagen-4.0-generate-001',

    prompt: prompt.prompt,

    config: {
      numberOfImages: 1,
    },
  })

  const image =
    response.generatedImages?.[0]?.image?.imageBytes

  if (!image) {
    throw new Error('Gemini did not return an image.')
  }

  return {
    scene: prompt.scene,

    imageUrl: `data:image/png;base64,${image}`,
  }
}
}