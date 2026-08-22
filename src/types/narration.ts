export interface NarrationSegment {
  id: number

  text: string

  speaker: string

  emotion?: string

  audioUrl?: string

  audioPath?: string | null

  duration?: number
}

export interface StoryNarration {
  title: string

  language: string

  segments: NarrationSegment[]
}