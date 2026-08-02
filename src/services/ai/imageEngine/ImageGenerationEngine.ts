import type { ImageProvider } from '../imageProvider'
import { ProviderManager } from './ProviderManager'
import type { ImageGenerationRequest, ImageGenerationResult, ProviderName } from './types'

export class ImageGenerationEngine {
  private readonly cache = new Map<string, ImageGenerationResult>()

  constructor(private readonly providerManager: ProviderManager = new ProviderManager()) {}

  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const cacheKey = this.buildCacheKey(request)

    const cachedResult = this.cache.get(cacheKey)
    if (cachedResult) {
      return cachedResult
    }

    const provider = this.providerManager.getActiveProvider()
    const illustrations = await provider.generateImages(request.prompts)

    const result: ImageGenerationResult = {
      provider: this.providerManager.getActiveProviderName() ?? 'unknown',
      illustrations,
    }

    this.cache.set(cacheKey, result)
    return result
  }

  setProvider(name: ProviderName): void {
    this.providerManager.setActiveProvider(name)
  }

  getProvider(): ImageProvider {
    return this.providerManager.getActiveProvider()
  }

  private buildCacheKey(request: ImageGenerationRequest): string {
    if (request.cacheKey) {
      return request.cacheKey
    }

    const promptSignature = request.prompts
      .map(prompt => `${prompt.scene}:${prompt.prompt}`)
      .join('|')

    return request.requestId ?? promptSignature
  }
}
