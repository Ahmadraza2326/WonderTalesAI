import { IllustrationCache } from '../../illustrations/illustrationCache'
import type { GeneratedIllustration, ImageProvider } from '../imageProvider'
import { composeIllustrationPrompt } from '../promptComposer'
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
    const composedPrompt = this.composePrompt(prompt)
    const cacheKey = this.buildCacheKey(composedPrompt)
    const cachedImageUrl = await this.illustrationCache.get(cacheKey)

    if (cachedImageUrl) {
      return {
        scene: prompt.scene,
        imageUrl: cachedImageUrl,
      }
    }

    const generatedImages = await this.imageProvider.generateImages([composedPrompt])
    const generatedImage = generatedImages.find(
      image => image.scene === composedPrompt.scene
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

  private composePrompt(prompt: IllustrationPrompt): IllustrationPrompt {
    return {
      ...prompt,
      prompt: composeIllustrationPrompt({
        illustrationPrompt: prompt.prompt,
        characterProfiles: prompt.characterProfiles ?? [],
        locationProfiles: prompt.locationProfiles ?? [],
      }),
    }
  }

  private buildCacheKey(prompt: IllustrationPrompt): string {
    return `${prompt.scene}:${prompt.prompt}`
  }
}
