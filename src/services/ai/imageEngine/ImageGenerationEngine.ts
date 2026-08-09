import type { ImageProvider } from '../imageProvider'
import { ProviderManager } from './ProviderManager'
import type {
  ImageGenerationRequest,
  ImageGenerationResult,
  ProviderName,
} from './types'

export class ImageGenerationEngine {
  private readonly cache = new Map<string, ImageGenerationResult>()

  private readonly providerManager: ProviderManager

  constructor(providerManager: ProviderManager = new ProviderManager()) {
    this.providerManager = providerManager
  }

  async generate(
    request: ImageGenerationRequest
  ): Promise<ImageGenerationResult> {
    const cacheKey = this.buildCacheKey(request)

    const cachedResult = this.cache.get(cacheKey)
    if (cachedResult) {
      return cachedResult
    }

        const provider = this.providerManager.getActiveProvider()
    const illustrations = await provider.generateImages(request.prompts)

    console.log(`[2] ImageGenerationEngine.generate - illustrations:`, JSON.stringify(illustrations, null, 2));

        const result: ImageGenerationResult = {
      provider: this.providerManager.getActiveProviderName() ?? 'unknown',
      illustrations,
    }

    console.log('[DEBUG 2] ImageGenerationEngine.generate RESULT:', JSON.stringify(result, null, 2));

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