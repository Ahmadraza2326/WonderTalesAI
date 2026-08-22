import type { Database } from './database.types'

export type ChildProfileRow = Database['public']['Tables']['child_profiles']['Row']
export type ChildProfileInsert = Database['public']['Tables']['child_profiles']['Insert']
export type ChildProfileUpdate = Database['public']['Tables']['child_profiles']['Update']

export interface ChildProfile {
  id: string
  parent_id: string
  name: string
  age: number
  reading_level: 'beginner' | 'intermediate' | 'advanced' | string
  interests: string[]
  avatar: string
  preferred_language: string
  favorite_theme?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface CreateChildProfileInput {
  name: string
  age: number | string
  reading_level?: string
  interests?: string[] | string
  avatar?: string
  preferred_language?: string
  favorite_theme?: string
}

export interface UpdateChildProfileInput {
  name?: string
  age?: number | string
  reading_level?: string
  interests?: string[] | string
  avatar?: string
  preferred_language?: string
  favorite_theme?: string
}

export type ChildProfileValidationResult =
  | {
      valid: true
      sanitized: {
        name: string
        age: number
        reading_level: string
        interests: string[]
        avatar: string
        preferred_language: string
        favorite_theme: string | null
      }
      error?: never
    }
  | {
      valid: false
      error: string
      sanitized?: never
    }
