export interface StoryRecord {
  id: string

  title: string

  child_name: string | null

  child_age: string | number | null

  language: string | null

  theme?: string | null

  moral?: string | null

  characters?: string | null

  story_length?: string | null

  reading_level?: string | null

  story_content?: string | null

  learning_package?: unknown | null

  generation_status?: string | null

  generated_at?: string | null

  status?: string | null

  created_at?: string | null

  user_id?: string | null
}

export interface StorySummary {
  id: string

  title: string
}