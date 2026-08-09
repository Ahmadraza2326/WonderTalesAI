import type { IllustrationPrompt } from './illustrationPromptGenerator'

export interface GeneratedIllustration {
  scene: number
  imageUrl: string
  provider?: string
}

export interface ImageProvider {
  generateImages(
    prompts: IllustrationPrompt[]
  ): Promise<GeneratedIllustration[]>
}