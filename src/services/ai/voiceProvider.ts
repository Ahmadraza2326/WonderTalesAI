import type {
  NarrationSegment,
} from '../../types/narration'

export interface GeneratedNarration {
  id: number

  audioUrl: string

  duration: number
}

export interface VoiceProvider {
  generateNarration(
    segments: NarrationSegment[]
  ): Promise<GeneratedNarration[]>
}