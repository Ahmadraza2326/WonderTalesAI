import type { StoryRecord } from '../types/story'
import type { StoryBook } from '../types/storybook'

import { generateIllustrations } from './ai/illustrationService'
import { generateIllustrationPrompts } from './ai/illustrationPromptGenerator'
import { paginateStory } from './storybookPagination'

export async function generateStoryBook(
  story: StoryRecord
): Promise<StoryBook> {
  const storyText =
    story.learning_package?.story ??
    story.story_content ??
    ''

  const storyBook = paginateStory(
    story.title,
    storyText
  )

  const storyDNA = story.learning_package?.storyDNA

  if (!storyDNA) {
    return storyBook
  }

  const prompts = generateIllustrationPrompts(storyDNA)

  storyBook.pages = storyBook.pages.map((page, index) => ({
    ...page,
    illustrationPrompt: prompts[index]?.prompt ?? '',
  }))

      const storyBookWithImages = await generateIllustrations(storyBook, storyDNA)

  console.log(`[DEBUG 4] storybookGenerator.generateStoryBook - FINAL pages:`, JSON.stringify(storyBookWithImages.pages, null, 2));

  return storyBookWithImages
}