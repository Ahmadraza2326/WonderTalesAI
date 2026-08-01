import type {
  GeneratedNarration,
  VoiceProvider,
} from './voiceProvider'

import type {
  NarrationSegment,
} from '../../types/narration'

export class MockVoiceProvider
  implements VoiceProvider
{
  async generateNarration(
    segments: NarrationSegment[]
  ): Promise<GeneratedNarration[]> {
    return segments.map(segment => ({
      id: segment.id,

      audioUrl: '',

      duration: Math.max(
        2,
        Math.ceil(segment.text.length / 18)
      ),
    }))
  }
}