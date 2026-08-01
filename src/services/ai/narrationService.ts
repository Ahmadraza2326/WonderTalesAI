import type {
  StoryNarration,
  NarrationSegment,
} from '../../types/narration'

import type { StoryRecord } from '../../types/story'

export function buildNarration(
  story: StoryRecord
): StoryNarration {
  const storyText =
    story.learning_package?.story ??
    story.story_content ??
    ''

  const sentences = storyText
    .split(/(?<=[.!?])\s+/)
    .filter(sentence => sentence.trim().length > 0)

  const segments: NarrationSegment[] =
    sentences.map((sentence, index) => ({
      id: index + 1,

      text: sentence.trim(),

      speaker: 'Narrator',

      emotion: 'neutral',
    }))

  return {
    title: story.title,

    language:
      story.language ?? 'English',

    segments,
  }
}