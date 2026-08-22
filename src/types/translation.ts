import type { LearningPackage } from '../services/ai/learningPackage'

export interface TranslatedStoryContent {
  title: string
  story_content: string
  moral?: string | null
  theme?: string | null
  learning_package: LearningPackage | null
  target_locale: string
  target_language: string
  translated_at: string
  pages?: any[]
}

export interface StoryTranslationRecord {
  id: string
  story_id: string
  user_id: string
  target_locale: string
  translated_content: TranslatedStoryContent
  created_at: string
  updated_at: string
}
