import type { StoryBook } from '../../types/storybook'
import { ImageGenerationEngine } from './imageEngine/ImageGenerationEngine'
import { ProviderManager } from './imageEngine/ProviderManager'
import type { StoryDNA } from './storyDNA'
import type { IllustrationPrompt } from './illustrationPromptGenerator'
import { storyAssetCacheService } from '../storyAssetCacheService'

export async function generateIllustrations(
  storyBook: StoryBook,
  _storyDNA: StoryDNA
): Promise<StoryBook> {
  const providerManager = new ProviderManager()
  const imageEngine = new ImageGenerationEngine(providerManager)

  // 1. Check prompt-level cache first
  const missingPrompts: IllustrationPrompt[] = []

  for (const page of storyBook.pages) {
    if (page.illustrationPrompt) {
      const cachedUrl = await storyAssetCacheService.getCachedIllustration(page.illustrationPrompt)
      if (cachedUrl) {
        page.illustrationUrl = cachedUrl
      } else {
        missingPrompts.push({
          scene: page.pageNumber,
          title: 'Page ' + page.pageNumber,
          prompt: page.illustrationPrompt,
        })
      }
    }
  }

  // 2. If all illustrations were cached, return immediately
  if (missingPrompts.length === 0) {
    return storyBook
  }

  // 3. Generate only uncached prompts
  const result = await imageEngine.generate({ prompts: missingPrompts })

  storyBook.pages = storyBook.pages.map(page => {
    const illustration = result.illustrations.find(
      image => image.scene === page.pageNumber
    )
    return {
      ...page,
      illustrationUrl:
        illustration?.imageUrl ??
        page.illustrationUrl ??
        '',
    }
  })

  return storyBook
}