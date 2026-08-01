import type { StoryRecord } from '../../types/story'
import type { StoryNarration } from '../../types/narration'

import { buildNarration } from './narrationService'
import { MockVoiceProvider } from './mockVoiceProvider'

export async function generateStoryNarration(
  story: StoryRecord
): Promise<StoryNarration> {
  const narration = buildNarration(story)

  const provider = new MockVoiceProvider()

  const generatedAudio =
    await provider.generateNarration(
      narration.segments
    )

  narration.segments = narration.segments.map(
    segment => ({
      ...segment,
      audioUrl:
        generatedAudio.find(
          audio => audio.id === segment.id
        )?.audioUrl ?? '',
      duration:
        generatedAudio.find(
          audio => audio.id === segment.id
        )?.duration ?? 0,
    })
  )

  return narration
}