import type { StoryBook } from '../../types/storybook'

import { ImageGenerationEngine } from './imageEngine/ImageGenerationEngine'
import { ProviderManager } from './imageEngine/ProviderManager'
import { MockImageProvider } from './mockImageProvider'
import { generateIllustrationPrompts } from './illustrationPromptGenerator'
import type { StoryDNA } from './storyDNA'

export async function generateIllustrations(
  storyBook: StoryBook,
  storyDNA: StoryDNA
): Promise<StoryBook> {
  const providerManager = new ProviderManager([
    {
      name: 'mock',
      provider: new MockImageProvider(),
    },
  ])
  const imageEngine = new ImageGenerationEngine(providerManager)

  const prompts =
    generateIllustrationPrompts(storyDNA)

  const result =
    await imageEngine.generate({ prompts })

  storyBook.pages = storyBook.pages.map(
    page => ({
      ...page,
      illustrationUrl:
        result.illustrations.find(
          image =>
            image.scene === page.pageNumber
        )?.imageUrl ?? '',
    })
  )

  return storyBook
}