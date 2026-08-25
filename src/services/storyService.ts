import { supabase } from '../lib/supabase'
import type { Database } from '../types/database.types'

type StoryInsert = Database['public']['Tables']['stories']['Insert']
type StoryUpdate = Database['public']['Tables']['stories']['Update']

export const storyService = {
  async createStory(userId: string, values: {
    childId?: string | null
    title: string
    childName: string
    childAge: number | string
    language: string
    theme?: string
    moral?: string
    characters?: string
    storyLength: string
    readingLevel: string
  }) {
        const rawAge = typeof values.childAge === 'string' ? values.childAge.trim() : values.childAge
    const age = typeof rawAge === 'number' ? rawAge : Number(rawAge)

    if (
      !Number.isInteger(age) ||
      !Number.isFinite(age) ||
      age < 0 ||
      age > 18 ||
      (typeof rawAge === 'string' && !/^\d+$/.test(rawAge))
    ) {
      return { data: null, error: new Error('Invalid child age: must be a whole number between 0 and 18') }
    }

    const insertData: StoryInsert = {
      user_id: userId,
      child_id: values.childId ?? null,
      title: values.title,
      child_name: values.childName,
      child_age: age,
      language: values.language,
      theme: values.theme ?? null,
      moral: values.moral ?? null,
      characters: values.characters ?? null,
      story_length: values.storyLength,
      reading_level: values.readingLevel,
      status: 'draft',
    }
    return supabase.from('stories').insert(insertData).select().single()
  },

  async getStoriesForUser(userId: string) {
    return supabase
      .from('stories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  async getStoryById(storyId: string, userId: string) {
    return supabase
      .from('stories')
      .select('*')
      .eq('id', storyId)
      .eq('user_id', userId)
      .single()
  },

  async updateStory(storyId: string, userId: string, updates: StoryUpdate) {
    return supabase
      .from('stories')
      .update(updates)
      .eq('id', storyId)
      .eq('user_id', userId)
      .select()
      .single()
  },

  async toggleFavorite(storyId: string, userId: string, isFavorite: boolean) {
    return supabase
      .from('stories')
      .update({ is_favorite: isFavorite })
      .eq('id', storyId)
      .eq('user_id', userId)
      .select()
      .single()
  },

  async deleteStory(storyId: string, userId: string) {
    return supabase
      .from('stories')
      .delete()
      .eq('id', storyId)
      .eq('user_id', userId)
  },
}