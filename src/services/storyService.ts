import { supabase } from '../lib/supabase'

export type StoryRecord = {
  id: string
  title: string
  child_name: string | null
  child_age: string | number | null
  language: string | null
  status: string | null
  created_at: string | null
  story_content?: string | null
  theme?: string | null
  moral?: string | null
  characters?: string | null
  story_length?: string | null
  reading_level?: string | null
  user_id?: string
}

export const storyService = {
  async createStory(userId: string, values: {
    title: string
    childName: string
    childAge: string
    language: string
    theme: string
    moral: string
    characters: string
    storyLength: string
    readingLevel: string
  }) {
    return supabase.from('stories').insert({
      user_id: userId,
      title: values.title,
      child_name: values.childName,
      child_age: values.childAge,
      language: values.language,
      theme: values.theme,
      moral: values.moral,
      characters: values.characters,
      story_length: values.storyLength,
      reading_level: values.readingLevel,
      status: 'draft',
    })
  },

  async getStoriesForUser(userId: string) {
    return supabase
      .from('stories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  async deleteStory(storyId: string) {
    return supabase.from('stories').delete().eq('id', storyId)
  },
}
