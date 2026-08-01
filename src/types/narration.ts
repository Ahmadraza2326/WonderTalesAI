export interface NarrationSegment {
  id: number

  text: string

  speaker: string

  emotion?: string

  audioUrl?: string

  duration?: number
}

export interface StoryNarration {
  title: string

  language: string

  segments: NarrationSegment[]
}