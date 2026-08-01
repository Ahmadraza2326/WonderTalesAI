import { IllustrationCache } from '../../illustrations/illustrationCache'
import type { GeneratedIllustration, ImageProvider } from '../imageProvider'
import type { IllustrationPrompt } from '../illustrationPromptGenerator'

export class IllustrationGenerationManager {
  private readonly imageProvider: ImageProvider
  private readonly illustrationCache: IllustrationCache

  constructor(imageProvider: ImageProvider, illustrationCache: IllustrationCache) {
    this.imageProvider = imageProvider
    this.illustrationCache = illustrationCache
  }

  public async generateIllustrations(
    prompts: IllustrationPrompt[]
  ): Promise<GeneratedIllustration[]> {
    return Promise.all(
      prompts.map(prompt => this.generateIllustration(prompt))
    )
  }

  private async generateIllustration(
    prompt: IllustrationPrompt
  ): Promise<GeneratedIllustration> {
    const cacheKey = this.buildCacheKey(prompt)
    const cachedImageUrl = await this.illustrationCache.get(cacheKey)

    if (cachedImageUrl) {
      return {
        scene: prompt.scene,
        imageUrl: cachedImageUrl,
      }
    }

    const generatedImages = await this.imageProvider.generateImages([prompt])
    const generatedImage = generatedImages.find(
      image => image.scene === prompt.scene
    )

    if (generatedImage) {
      await this.illustrationCache.save(cacheKey, generatedImage.imageUrl)
      return generatedImage
    }

    return {
      scene: prompt.scene,
      imageUrl: '',
    }
  }

  private buildCacheKey(prompt: IllustrationPrompt): string {
    return `${prompt.scene}:${prompt.prompt}`
  }
}
