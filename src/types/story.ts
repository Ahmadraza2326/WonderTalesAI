import type { LearningPackage } from '../services/ai/learningPackage'
import type { Database } from './database.types'

type StoryRow = Database['public']['Tables']['stories']['Row']

export interface StoryRecord {
  id: StoryRow['id']
  user_id: StoryRow['user_id']
  title: StoryRow['title']
  child_name: StoryRow['child_name']
  child_age: StoryRow['child_age']
  language: StoryRow['language']
  theme: StoryRow['theme']
  moral: StoryRow['moral']
  characters: StoryRow['characters']
  story_length: StoryRow['story_length']
  reading_level: StoryRow['reading_level']
  status: StoryRow['status']
  created_at: StoryRow['created_at']
  updated_at: StoryRow['updated_at']
  story_content: StoryRow['story_content']
  generation_status: StoryRow['generation_status']
    generated_at: StoryRow['generated_at']
  learning_package: LearningPackage | null
  genre?: string
}

export interface StorySummary {
  id: string
  title: string
}