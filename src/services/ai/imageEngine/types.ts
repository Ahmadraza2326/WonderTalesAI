import type { IllustrationPrompt } from '../illustrationPromptGenerator'
import type { GeneratedIllustration, ImageProvider } from '../imageProvider'

export type ProviderName = string

export interface ImageGenerationRequest {
  prompts: IllustrationPrompt[]
  cacheKey?: string
  requestId?: string
}

export interface ImageGenerationResult {
  provider: ProviderName
  illustrations: GeneratedIllustration[]
}

export interface ImageProviderRegistration {
  name: ProviderName
  provider: ImageProvider
}
