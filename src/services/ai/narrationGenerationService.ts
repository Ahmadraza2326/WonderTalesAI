import type { StoryRecord } from '../../types/story'
import type { StoryNarration } from '../../types/narration'
import type { VoiceProvider } from './voiceProvider'
import { buildNarration } from './narrationService'
import { OrbisVoiceProvider } from './providers/orbisVoiceProvider'
import { PiperVoiceProvider } from './providers/piperVoiceProvider'
import { getNarrationHash } from '../storyAssetCacheService'

export async function generateStoryNarration(
  story: StoryRecord,
  language?: string,
  customStoryContent?: string,
  customTitle?: string,
  provider?: VoiceProvider
): Promise<StoryNarration> {
  const targetLanguage = language || story.language || 'English'
  const narration = buildNarration(story, targetLanguage, customStoryContent, customTitle)
  const hash = await getNarrationHash(story, targetLanguage, customStoryContent, customTitle)

  let voiceProvider = provider
  if (!voiceProvider) {
    if (import.meta.env.VITE_TTS_PROVIDER === 'piper') {
      voiceProvider = new PiperVoiceProvider()
    } else {
      voiceProvider = new OrbisVoiceProvider()
    }
  }

  const generatedAudio = await voiceProvider.generateNarration(narration.segments, {
    storyId: story.id,
    contentHash: hash,
    language: narration.language,
  })

  narration.segments = narration.segments.map((segment) => {
    const audioInfo = generatedAudio.find((audio) => audio.id === segment.id)
    return {
      ...segment,
      audioUrl: audioInfo?.audioUrl ?? '',
      audioPath: audioInfo?.audioPath ?? null,
      duration: audioInfo?.duration ?? 0,
    }
  })

  return narration
}