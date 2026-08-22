import type {
  StoryNarration,
  NarrationSegment,
} from '../../types/narration'
import type { StoryRecord } from '../../types/story'
import { resolveLocaleConfig } from '../i18n/locales'

export function buildNarration(
  story: StoryRecord,
  language?: string,
  customStoryContent?: string,
  customTitle?: string
): StoryNarration {
  const targetLanguage = language || story.language || 'English'
  const locale = resolveLocaleConfig(targetLanguage)

  const storyText =
    customStoryContent ??
    story.learning_package?.story ??
    story.story_content ??
    ''

  const sentences = storyText
    .split(/(?<=[.!?؟۔。！？।])\s+|(?<=[。！？।])\s*/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0)

  const rawSegments = sentences.length > 0 ? sentences : (storyText.trim() ? [storyText.trim()] : [])

  const segments: NarrationSegment[] = rawSegments.map((sentence, index) => ({
    id: index + 1,
    text: sentence,
    speaker: 'Narrator',
    emotion: 'neutral',
  }))

  return {
    title: customTitle || story.title,
    language: locale.bcp47,
    segments,
  }
}