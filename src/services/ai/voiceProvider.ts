import type {
  NarrationSegment,
} from '../../types/narration'

export interface GeneratedNarration {
  id: number
  audioUrl: string
  audioPath?: string | null
  duration: number
}

export interface GenerateNarrationOptions {
  storyId?: string
  contentHash?: string
  language?: string
  voiceName?: string
  rate?: number
  pitch?: number
  forceRegenerate?: boolean
}

export interface VoiceProvider {
  generateNarration(
    segments: NarrationSegment[],
    options?: GenerateNarrationOptions
  ): Promise<GeneratedNarration[]>
}