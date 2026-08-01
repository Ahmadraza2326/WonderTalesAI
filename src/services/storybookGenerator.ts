import type { StoryRecord } from '../types/story'
import type { StoryBook } from '../types/storybook'

import { paginateStory } from './storybookPagination'
import { generateIllustrationPrompts } from './ai/illustrationPromptGenerator'

export function generateStoryBook(
  story: StoryRecord
): StoryBook {
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

  const prompts =
    generateIllustrationPrompts(storyDNA)

  storyBook.pages = storyBook.pages.map(
    (page, index) => ({
      ...page,
      illustrationPrompt:
        prompts[index]?.prompt ??
        '',
    })
  )

  return storyBook
}