import type {
  GeneratedIllustration,
  ImageProvider,
} from './imageProvider'

import type { IllustrationPrompt } from './illustrationPromptGenerator'

export class MockImageProvider
  implements ImageProvider
{
  async generateImages(
    prompts: IllustrationPrompt[]
  ): Promise<GeneratedIllustration[]> {
    return prompts.map(prompt => ({
      scene: prompt.scene,

      imageUrl: `https://placehold.co/1024x1024?text=Scene+${prompt.scene}`,
    }))
  }
}