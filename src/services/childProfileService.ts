import { supabase } from '../lib/supabase'
import { parentProfileService } from './parentProfileService'
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

const LOCAL_CHILD_PROFILES_KEY_PREFIX = 'orbis_child_profiles_'

/**
 * Returns the localStorage key for a given parent / guest ID.
 */
function getStorageKey(parentId: string): string {
  return `${LOCAL_CHILD_PROFILES_KEY_PREFIX}${parentId || 'guest'}`
}

/**
 * Retrieves all locally persisted child profiles for a parent or guest.
 */
export function getLocalChildProfiles(parentId: string): ChildProfile[] {
  if (typeof window === 'undefined' || !window.localStorage) return []
  try {
    const raw = window.localStorage.getItem(getStorageKey(parentId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Saves or updates a single child profile in localStorage.
 */
export function saveLocalChildProfile(parentId: string, profile: ChildProfile): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const current = getLocalChildProfiles(parentId)
    const existingIndex = current.findIndex((p) => p.id === profile.id)
    let updated: ChildProfile[]
    if (existingIndex >= 0) {
      updated = [...current]
      updated[existingIndex] = profile
    } else {
      updated = [...current, profile]
    }
    window.localStorage.setItem(getStorageKey(parentId), JSON.stringify(updated))
  } catch (err) {
    console.warn('Failed to save child profile to localStorage:', err)
  }
}

/**
 * Removes a child profile from localStorage.
 */
export function removeLocalChildProfile(parentId: string, profileId: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const current = getLocalChildProfiles(parentId)
    const updated = current.filter((p) => p.id !== profileId)
    window.localStorage.setItem(getStorageKey(parentId), JSON.stringify(updated))
  } catch (err) {
    console.warn('Failed to remove child profile from localStorage:', err)
  }
}

/**
 * Creates and stores a local child profile domain object.
 */
export function createLocalChildProfile(
  parentId: string,
  sanitized: NonNullable<ChildProfileValidationResult['sanitized']>
): ChildProfile {
  const localId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `local-child-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  const now = new Date().toISOString()
  const localProfile: ChildProfile = {
    id: localId,
    parent_id: parentId || 'guest',
    name: sanitized.name,
    age: sanitized.age,
    reading_level: sanitized.reading_level,
    interests: sanitized.interests,
    avatar: sanitized.avatar,
    preferred_language: sanitized.preferred_language,
    favorite_theme: sanitized.favorite_theme,
    xp: 0,
    stars: 0,
    current_streak: 0,
    last_activity_date: null,
    created_at: now,
    updated_at: now,
  }

  saveLocalChildProfile(parentId, localProfile)
  return localProfile
}

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
    xp: row.xp ?? 0,
    stars: row.stars ?? 0,
    current_streak: row.current_streak ?? 0,
    last_activity_date: row.last_activity_date ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export const childProfileService = {
  /**
   * Retrieves all child profiles belonging to the parent or guest session.
   */
  async getChildProfiles(parentId: string): Promise<{ data: ChildProfile[] | null; error: Error | null }> {
    const effectiveParentId = parentId || 'guest'

    // If running in guest mode, retrieve local storage profiles immediately
    if (effectiveParentId === 'guest' || effectiveParentId === 'local') {
      const localProfiles = getLocalChildProfiles(effectiveParentId)
      return { data: localProfiles, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('parent_id', effectiveParentId)
        .order('created_at', { ascending: true })

      if (error) {
        console.warn('Could not fetch child profiles from remote DB, falling back to local storage:', error.message)
        const localProfiles = getLocalChildProfiles(effectiveParentId)
        return { data: localProfiles, error: null }
      }

      const remoteProfiles = (data || []).map(mapRowToChildProfile)

      // Merge any local-only profiles that haven't been synchronized
      const localProfiles = getLocalChildProfiles(effectiveParentId)
      const remoteIds = new Set(remoteProfiles.map((p) => p.id))
      const localOnlyProfiles = localProfiles.filter((p) => !remoteIds.has(p.id))

      const merged = [...remoteProfiles, ...localOnlyProfiles]
      // Cache profiles locally
      merged.forEach((p) => saveLocalChildProfile(effectiveParentId, p))

      return { data: merged, error: null }
    } catch (err) {
      console.warn('Network error fetching child profiles, falling back to local storage:', err)
      const localProfiles = getLocalChildProfiles(effectiveParentId)
      return { data: localProfiles, error: null }
    }
  },

  /**
   * Retrieves a single child profile by ID.
   */
  async getChildProfileById(
    profileId: string,
    parentId: string
  ): Promise<{ data: ChildProfile | null; error: Error | null }> {
    const effectiveParentId = parentId || 'guest'
    if (!profileId) {
      return { data: null, error: new Error('Profile ID required.') }
    }

    if (effectiveParentId === 'guest' || effectiveParentId === 'local') {
      const local = getLocalChildProfiles(effectiveParentId).find((p) => p.id === profileId) || null
      return { data: local, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('id', profileId)
        .eq('parent_id', effectiveParentId)
        .maybeSingle()

      if (!error && data) {
        const profile = mapRowToChildProfile(data)
        saveLocalChildProfile(effectiveParentId, profile)
        return { data: profile, error: null }
      }

      const local = getLocalChildProfiles(effectiveParentId).find((p) => p.id === profileId) || null
      return { data: local, error: null }
    } catch {
      const local = getLocalChildProfiles(effectiveParentId).find((p) => p.id === profileId) || null
      return { data: local, error: null }
    }
  },

  /**
   * Creates a new child profile for the parent, ensuring parent profile existence first
   * and providing graceful local storage fallback if remote DB foreign key or network fails.
   */
  async createChildProfile(
    parentId: string,
    input: CreateChildProfileInput
  ): Promise<{ data: ChildProfile | null; error: Error | null }> {
    const effectiveParentId = parentId || 'guest'

    const validation = validateChildProfileInput(input)
    if (!validation.valid) {
      return { data: null, error: new Error(validation.error) }
    }

    const { sanitized } = validation

    // If in guest / local mode, save directly to local storage
    if (effectiveParentId === 'guest' || effectiveParentId === 'local') {
      const localProfile = createLocalChildProfile(effectiveParentId, sanitized)
      return { data: localProfile, error: null }
    }

    // 1. Ensure the parent profile row exists in `profiles` to prevent foreign key violation
    await parentProfileService.ensureParentProfileExists(effectiveParentId)

    // 2. Prepare payload for DB insertion
    const insertPayload: ChildProfileInsert = {
      parent_id: effectiveParentId,
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

      if (!error && data) {
        const profile = mapRowToChildProfile(data)
        saveLocalChildProfile(effectiveParentId, profile)
        return { data: profile, error: null }
      }

      // If foreign key constraint or other DB error occurs, gracefully fall back to local storage
      console.warn(
        'Child profile DB insert failed (foreign key or schema error), falling back to local storage:',
        error?.message
      )
      const fallbackProfile = createLocalChildProfile(effectiveParentId, sanitized)
      return { data: fallbackProfile, error: null }
    } catch (err) {
      console.warn('Network or DB error creating child profile, falling back to local storage:', err)
      const fallbackProfile = createLocalChildProfile(effectiveParentId, sanitized)
      return { data: fallbackProfile, error: null }
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
    const effectiveParentId = parentId || 'guest'
    if (!profileId) {
      return { data: null, error: new Error('Profile ID required.') }
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

    // Handle guest or local profile updates
    if (effectiveParentId === 'guest' || effectiveParentId === 'local' || profileId.startsWith('local-')) {
      const current = getLocalChildProfiles(effectiveParentId)
      const target = current.find((p) => p.id === profileId)
      if (target) {
        const updated: ChildProfile = {
          ...target,
          ...updatePayload,
          parent_id: updatePayload.parent_id ?? target.parent_id ?? effectiveParentId,
          age: updatePayload.age ?? target.age,
          interests: updatePayload.interests ?? target.interests,
          avatar: updatePayload.avatar ?? target.avatar,
          reading_level: updatePayload.reading_level ?? target.reading_level,
          preferred_language: updatePayload.preferred_language ?? target.preferred_language,
          favorite_theme:
            updatePayload.favorite_theme !== undefined ? updatePayload.favorite_theme : target.favorite_theme,
          name: updatePayload.name ?? target.name,
          updated_at: updatePayload.updated_at || new Date().toISOString(),
        }
        saveLocalChildProfile(effectiveParentId, updated)
        return { data: updated, error: null }
      }
    }

    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .update(updatePayload)
        .eq('id', profileId)
        .eq('parent_id', effectiveParentId)
        .select()
        .maybeSingle()

      if (!error && data) {
        const mapped = mapRowToChildProfile(data)
        saveLocalChildProfile(effectiveParentId, mapped)
        return { data: mapped, error: null }
      }

      // Fallback to updating in local storage
      const current = getLocalChildProfiles(effectiveParentId)
      const target = current.find((p) => p.id === profileId)
      if (target) {
        const updated: ChildProfile = {
          ...target,
          ...updatePayload,
          parent_id: updatePayload.parent_id ?? target.parent_id ?? effectiveParentId,
          age: updatePayload.age ?? target.age,
          interests: updatePayload.interests ?? target.interests,
          avatar: updatePayload.avatar ?? target.avatar,
          reading_level: updatePayload.reading_level ?? target.reading_level,
          preferred_language: updatePayload.preferred_language ?? target.preferred_language,
          favorite_theme:
            updatePayload.favorite_theme !== undefined ? updatePayload.favorite_theme : target.favorite_theme,
          name: updatePayload.name ?? target.name,
          updated_at: updatePayload.updated_at || new Date().toISOString(),
        }
        saveLocalChildProfile(effectiveParentId, updated)
        return { data: updated, error: null }
      }

      return { data: null, error: error ? new Error(error.message) : new Error('Child profile not found.') }
    } catch (err) {
      console.warn('Error updating child profile on DB, falling back to local storage:', err)
      const current = getLocalChildProfiles(effectiveParentId)
      const target = current.find((p) => p.id === profileId)
      if (target) {
        const updated: ChildProfile = {
          ...target,
          ...updatePayload,
          parent_id: updatePayload.parent_id ?? target.parent_id ?? effectiveParentId,
          age: updatePayload.age ?? target.age,
          interests: updatePayload.interests ?? target.interests,
          avatar: updatePayload.avatar ?? target.avatar,
          reading_level: updatePayload.reading_level ?? target.reading_level,
          preferred_language: updatePayload.preferred_language ?? target.preferred_language,
          favorite_theme:
            updatePayload.favorite_theme !== undefined ? updatePayload.favorite_theme : target.favorite_theme,
          name: updatePayload.name ?? target.name,
          updated_at: updatePayload.updated_at || new Date().toISOString(),
        }
        saveLocalChildProfile(effectiveParentId, updated)
        return { data: updated, error: null }
      }
      return { data: null, error: err instanceof Error ? err : new Error('Failed to update child profile.') }
    }
  },

  /**
   * Deletes a child profile.
   */
  async deleteChildProfile(
    profileId: string,
    parentId: string
  ): Promise<{ error: Error | null }> {
    const effectiveParentId = parentId || 'guest'
    if (!profileId) {
      return { error: new Error('Profile ID required.') }
    }

    // Always remove from local storage
    removeLocalChildProfile(effectiveParentId, profileId)

    if (effectiveParentId === 'guest' || effectiveParentId === 'local' || profileId.startsWith('local-')) {
      return { error: null }
    }

    try {
      const { error } = await supabase
        .from('child_profiles')
        .delete()
        .eq('id', profileId)
        .eq('parent_id', effectiveParentId)

      if (error) {
        console.warn('Could not delete from remote DB, removed locally:', error.message)
      }

      return { error: null }
    } catch (err) {
      console.warn('Network error deleting child profile, removed locally:', err)
      return { error: null }
    }
  },
}
