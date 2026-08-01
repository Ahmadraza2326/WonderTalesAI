import type { StoryBook } from '../../types/storybook'

import { MockImageProvider } from './mockImageProvider'
import { generateIllustrationPrompts } from './illustrationPromptGenerator'
import type { StoryDNA } from './storyDNA'

export async function generateIllustrations(
  storyBook: StoryBook,
  storyDNA: StoryDNA
): Promise<StoryBook> {
  const provider = new MockImageProvider()

  const prompts =
    generateIllustrationPrompts(storyDNA)

  const images =
    await provider.generateImages(prompts)

  storyBook.pages = storyBook.pages.map(
    page => ({
      ...page,
      illustrationUrl:
        images.find(
          image =>
            image.scene === page.pageNumber
        )?.imageUrl ?? '',
    })
  )

  return storyBook
}