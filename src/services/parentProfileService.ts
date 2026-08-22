import { supabase } from '../lib/supabase'

export interface ParentProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string | null
  created_at: string | null
}

export const parentProfileService = {
  /**
   * Fetches parent profile by user ID.
   */
  async getProfile(userId: string): Promise<{ data: ParentProfile | null; error: Error | null }> {
    if (!userId) {
      return { data: null, error: new Error('User ID required.') }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return { data: null, error: new Error(error.message) }
      }

      return { data: data as ParentProfile, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch profile.'),
      }
    }
  },

  /**
   * Updates parent profile details (full name or avatar).
   */
  async updateProfile(
    userId: string,
    updates: { full_name?: string; avatar_url?: string }
  ): Promise<{ data: ParentProfile | null; error: Error | null }> {
    if (!userId) {
      return { data: null, error: new Error('User ID required.') }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return { data: null, error: new Error(error.message) }
      }

      return { data: data as ParentProfile, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update profile.'),
      }
    }
  },
}
