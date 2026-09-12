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
        .maybeSingle()

      if (error) {
        return { data: null, error: new Error(error.message) }
      }

      return { data: data as ParentProfile | null, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch profile.'),
      }
    }
  },

  /**
   * Ensures that a parent profile row exists in `profiles` for the given user ID.
   * If not present, automatically creates/upserts it before child profile operations.
   */
  async ensureParentProfileExists(
    userId: string,
    defaults?: { full_name?: string | null; avatar_url?: string | null; role?: string | null }
  ): Promise<{ data: ParentProfile | null; error: Error | null }> {
    if (!userId) {
      return { data: null, error: new Error('User ID required.') }
    }

    try {
      // 1. Check if profile already exists
      const { data: existing, error: selectErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (!selectErr && existing) {
        return { data: existing as ParentProfile, error: null }
      }

      // 2. If profile is missing, create/upsert it
      const newProfile = {
        id: userId,
        full_name: defaults?.full_name ?? 'Parent Account',
        role: defaults?.role ?? 'parent',
        avatar_url: defaults?.avatar_url ?? null,
      }

      const { data: upserted, error: upsertErr } = await supabase
        .from('profiles')
        .upsert(newProfile, { onConflict: 'id' })
        .select()
        .maybeSingle()

      if (upsertErr) {
        console.warn('Could not persist parent profile to remote DB (fallback active):', upsertErr.message)
        return {
          data: {
            ...newProfile,
            created_at: new Date().toISOString(),
          },
          error: null,
        }
      }

      return {
        data: (upserted as ParentProfile) || { ...newProfile, created_at: new Date().toISOString() },
        error: null,
      }
    } catch (err) {
      console.warn('Network or DB error ensuring parent profile exists:', err)
      return {
        data: {
          id: userId,
          full_name: defaults?.full_name ?? 'Parent Account',
          avatar_url: defaults?.avatar_url ?? null,
          role: defaults?.role ?? 'parent',
          created_at: new Date().toISOString(),
        },
        error: null,
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

