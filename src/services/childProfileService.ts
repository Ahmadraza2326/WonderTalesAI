import { supabase } from '../lib/supabase'
import type { Database } from '../types/database.types'
import type {
  ChildProfile,
  ChildProfileRow,
  ChildProfileValidationResult,
  CreateChildProfileInput,
  UpdateChildProfileInput,
} from '../types/childProfile'

export type { ChildProfileValidationResult }

type ChildProfileInsert = Database['public']['Tables']['child_profiles']['Insert']
type ChildProfileUpdate = Database['public']['Tables']['child_profiles']['Update']

export const DEFAULT_AVATARS = ['🦁', '🚀', '🦄', '🦊', '🦉', '🐬', '🦖', '🎨', '🌟', '👑', '🧚', '🤖']

export const INTEREST_SUGGESTIONS = [
  'Space & Planets',
  'Dinosaurs',
  'Enchanted Forests',
  'Ocean Animals',
  'Robots & Inventions',
  'Fairy Tales',
  'Superheroes',
  'Magic & Wizards',
  'Cozy Animals',
  'Detective Mysteries',
]

/**
 * Validates and normalizes child profile inputs before database mutations.
 */
export function validateChildProfileInput(
  input: Partial<CreateChildProfileInput>
): ChildProfileValidationResult {
  // 1. Name validation
  if (!input.name || typeof input.name !== 'string' || !input.name.trim()) {
    return { valid: false, error: 'Child name is required.' }
  }
  const name = input.name.trim()
  if (name.length > 50) {
    return { valid: false, error: 'Child name must be 50 characters or fewer.' }
  }

  // 2. Age validation (2 to 16 years)
  const rawAge = typeof input.age === 'string' ? input.age.trim() : input.age
  const ageNum = typeof rawAge === 'number' ? rawAge : Number(rawAge)
  if (
    rawAge === undefined ||
    rawAge === null ||
    rawAge === '' ||
    !Number.isInteger(ageNum) ||
    !Number.isFinite(ageNum) ||
    ageNum < 2 ||
    ageNum > 16
  ) {
    return { valid: false, error: 'Child age must be a whole number between 2 and 16.' }
  }

  // 3. Reading level
  let reading_level = input.reading_level?.trim().toLowerCase() || ''
  if (!reading_level || !['beginner', 'intermediate', 'advanced'].includes(reading_level)) {
    // Auto-derive from age if omitted
    if (ageNum <= 5) reading_level = 'beginner'
    else if (ageNum <= 8) reading_level = 'intermediate'
    else reading_level = 'advanced'
  }

  // 4. Interests normalization
  let interests: string[] = []
  if (Array.isArray(input.interests)) {
    interests = input.interests
      .map((i) => (typeof i === 'string' ? i.trim() : ''))
      .filter((i) => i.length > 0 && i.length <= 40)
  } else if (typeof input.interests === 'string' && input.interests.trim()) {
    interests = input.interests
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0 && i.length <= 40)
  }
  // Cap at 10 interests
  interests = interests.slice(0, 10)

  // 5. Avatar
  const avatar = input.avatar?.trim() || '🌟'

  // 6. Preferred Language
  const preferred_language = input.preferred_language?.trim() || 'English'

  // 7. Favorite Theme
  const favorite_theme = input.favorite_theme?.trim() || null

  return {
    valid: true,
    sanitized: {
      name,
      age: ageNum,
      reading_level,
      interests,
      avatar,
      preferred_language,
      favorite_theme,
    },
  }
}

/**
 * Maps raw Supabase row to typed ChildProfile domain model with defaults.
 */
export function mapRowToChildProfile(row: ChildProfileRow): ChildProfile {
  return {
    id: row.id,
    parent_id: row.parent_id || '',
    name: row.name,
    age: row.age ?? 6,
    reading_level: row.reading_level || 'beginner',
    interests: Array.isArray(row.interests) ? row.interests : [],
    avatar: row.avatar || '🌟',
    preferred_language: row.preferred_language || 'English',
    favorite_theme: row.favorite_theme ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export const childProfileService = {
  /**
   * Retrieves all child profiles belonging to the authenticated parent.
   */
  async getChildProfiles(parentId: string): Promise<{ data: ChildProfile[] | null; error: Error | null }> {
    if (!parentId || typeof parentId !== 'string') {
      return { data: null, error: new Error('User authentication required to fetch child profiles.') }
    }

    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('parent_id', parentId)
        .order('created_at', { ascending: true })

      if (error) {
        return { data: null, error: new Error(error.message) }
      }

      const profiles = (data || []).map(mapRowToChildProfile)
      return { data: profiles, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to load child profiles.'),
      }
    }
  },

  /**
   * Retrieves a single child profile by ID.
   */
  async getChildProfileById(
    profileId: string,
    parentId: string
  ): Promise<{ data: ChildProfile | null; error: Error | null }> {
    if (!parentId || !profileId) {
      return { data: null, error: new Error('Profile ID and parent authorization required.') }
    }

    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('id', profileId)
        .eq('parent_id', parentId)
        .single()

      if (error) {
        return { data: null, error: new Error(error.message) }
      }

      return { data: data ? mapRowToChildProfile(data) : null, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch child profile.'),
      }
    }
  },

  /**
   * Creates a new child profile for the parent.
   */
  async createChildProfile(
    parentId: string,
    input: CreateChildProfileInput
  ): Promise<{ data: ChildProfile | null; error: Error | null }> {
    if (!parentId || typeof parentId !== 'string') {
      return { data: null, error: new Error('User authentication required to create a child profile.') }
    }

    const validation = validateChildProfileInput(input)
    if (!validation.valid) {
      return { data: null, error: new Error(validation.error) }
    }

    const { sanitized } = validation

    const insertPayload: ChildProfileInsert = {
      parent_id: parentId,
      name: sanitized.name,
      age: sanitized.age,
      reading_level: sanitized.reading_level,
      interests: sanitized.interests,
      avatar: sanitized.avatar,
      preferred_language: sanitized.preferred_language,
      favorite_theme: sanitized.favorite_theme,
    }

    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .insert(insertPayload)
        .select()
        .single()

      if (error) {
        return { data: null, error: new Error(error.message) }
      }

      return { data: data ? mapRowToChildProfile(data) : null, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to create child profile.'),
      }
    }
  },

  /**
   * Updates an existing child profile.
   */
  async updateChildProfile(
    profileId: string,
    parentId: string,
    updates: UpdateChildProfileInput
  ): Promise<{ data: ChildProfile | null; error: Error | null }> {
    if (!parentId || !profileId) {
      return { data: null, error: new Error('Profile ID and parent authorization required.') }
    }

    const validation = validateChildProfileInput(updates)
    if (!validation.valid) {
      return { data: null, error: new Error(validation.error) }
    }

    const { sanitized } = validation

    const updatePayload: ChildProfileUpdate = {
      name: sanitized.name,
      age: sanitized.age,
      reading_level: sanitized.reading_level,
      interests: sanitized.interests,
      avatar: sanitized.avatar,
      preferred_language: sanitized.preferred_language,
      favorite_theme: sanitized.favorite_theme,
      updated_at: new Date().toISOString(),
    }

    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .update(updatePayload)
        .eq('id', profileId)
        .eq('parent_id', parentId)
        .select()
        .single()

      if (error) {
        return { data: null, error: new Error(error.message) }
      }

      return { data: data ? mapRowToChildProfile(data) : null, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update child profile.'),
      }
    }
  },

  /**
   * Deletes a child profile.
   */
  async deleteChildProfile(
    profileId: string,
    parentId: string
  ): Promise<{ error: Error | null }> {
    if (!parentId || !profileId) {
      return { error: new Error('Profile ID and parent authorization required.') }
    }

    try {
      const { error } = await supabase
        .from('child_profiles')
        .delete()
        .eq('id', profileId)
        .eq('parent_id', parentId)

      if (error) {
        return { error: new Error(error.message) }
      }

      return { error: null }
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete child profile.'),
      }
    }
  },
}
