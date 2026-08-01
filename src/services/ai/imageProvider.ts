import type { IllustrationPrompt } from './illustrationPromptGenerator'

export interface GeneratedIllustration {
  scene: number
  imageUrl: string
}

export interface ImageProvider {
  generateImages(
    prompts: IllustrationPrompt[]
  ): Promise<GeneratedIllustration[]>
}