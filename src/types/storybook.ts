export interface StoryPage {
  pageNumber: number

  text: string

  illustrationPrompt?: string

  illustrationUrl?: string

  narrationUrl?: string
}

export interface StoryBook {
  title: string

  pages: StoryPage[]
}