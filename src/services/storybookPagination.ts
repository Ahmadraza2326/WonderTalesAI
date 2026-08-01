import type { StoryBook } from '../types/storybook'

export function paginateStory(
  title: string,
  story: string,
  maxCharacters = 900
): StoryBook {
  const paragraphs = story
    .split('\n')
    .map(text => text.trim())
    .filter(Boolean)

  const pages: StoryBook['pages'] = []

  let currentText = ''

  for (const paragraph of paragraphs) {
    if (
      currentText.length + paragraph.length >
      maxCharacters
    ) {
      pages.push({
        pageNumber: pages.length + 1,
        text: currentText.trim(),
      })

      currentText = ''
    }

    currentText += paragraph + '\n\n'
  }

  if (currentText.trim()) {
    pages.push({
      pageNumber: pages.length + 1,
      text: currentText.trim(),
    })
  }

  return {
    title,
    pages,
  }
}