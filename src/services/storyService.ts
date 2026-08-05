import { supabase } from '../lib/supabase'

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

  async getStoryById(storyId: string, userId: string) {
    return supabase
      .from('stories')
      .select('*')
      .eq('id', storyId)
      .eq('user_id', userId)
      .single()
  },

 async updateStory(
  storyId: string,
  updates: {
    story_content?: string | null
    learning_package?: unknown
    generation_status?: string | null
    generated_at?: string | null
    status?: string | null
  }
) {
  return supabase
    .from('stories')
    .update(updates)
    .eq('id', storyId)
},

async deleteStory(storyId: string) {
  return supabase
    .from('stories')
    .delete()
    .eq('id', storyId)
},
}