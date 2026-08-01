export interface StoryPage {
  pageNumber: number

  text: string

  illustrationPrompt?: string | null

  illustrationUrl?: string | null

  narrationUrl?: string | null
}

export interface StoryBook {
  title: string

  pages: StoryPage[]
}