import { supabase } from '../lib/supabase'
import type { Database } from '../types/database.types'
import type { StoryRecord } from '../types/story'
import { economyService } from './economyService'

type StoryInsert = Database['public']['Tables']['stories']['Insert']
type StoryUpdate = Database['public']['Tables']['stories']['Update']

const LOCAL_STORIES_KEY_PREFIX = 'orbis_local_stories_'

function getStoryStorageKey(userId: string): string {
  return `${LOCAL_STORIES_KEY_PREFIX}${userId || 'guest'}`
}

/**
 * Checks whether an error is caused by a missing database column or schema cache mismatch.
 */
function isSchemaMissingColumnError(error: any, columnName?: string): boolean {
  if (!error) return false
  const msg = typeof error.message === 'string' ? error.message.toLowerCase() : ''
  const code = typeof error.code === 'string' ? error.code : ''

  if (columnName) {
    const col = columnName.toLowerCase()
    if (msg.includes(`'${col}'`) || msg.includes(`"${col}"`) || msg.includes(col)) {
      return (
        msg.includes('schema cache') ||
        msg.includes('column') ||
        msg.includes('does not exist') ||
        code === 'PGRST204' ||
        code === '42703'
      )
    }
  }

  return (
    msg.includes('schema cache') ||
    msg.includes('could not find the') ||
    code === 'PGRST204' ||
    code === '42703'
  )
}

/**
 * Maps raw Supabase row or local storage object to a typed StoryRecord domain model.
 */
export function mapRowToStoryRecord(row: any): StoryRecord {
  return {
    id: row.id,
    user_id: row.user_id,
    child_id:
      row.child_id ??
      (row.learning_package as any)?._meta_child_id ??
      (row.learning_package as any)?.storyDNA?.child_id ??
      null,
    title: row.title,
    child_name: row.child_name,
    child_age: row.child_age,
    language: row.language,
    theme: row.theme ?? null,
    moral: row.moral ?? null,
    characters: row.characters ?? null,
    story_length: row.story_length,
    reading_level: row.reading_level,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    story_content: row.story_content ?? null,
    generation_status: row.generation_status ?? 'pending',
    generated_at: row.generated_at ?? null,
    is_favorite: Boolean(row.is_favorite),
    learning_package: row.learning_package ?? null,
    genre: row.genre ?? undefined,
  }
}

/**
 * Retrieves all locally stored stories for a user or guest.
 */
export function getLocalStories(userId: string): StoryRecord[] {
  if (typeof window === 'undefined' || !window.localStorage) return []
  try {
    const raw = window.localStorage.getItem(getStoryStorageKey(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(mapRowToStoryRecord) : []
  } catch {
    return []
  }
}

/**
 * Saves or updates a story in localStorage.
 */
export function saveLocalStory(userId: string, story: StoryRecord): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const current = getLocalStories(userId)
    const existingIndex = current.findIndex((s) => s.id === story.id)
    let updated: StoryRecord[]
    if (existingIndex >= 0) {
      updated = [...current]
      updated[existingIndex] = story
    } else {
      updated = [story, ...current]
    }
    window.localStorage.setItem(getStoryStorageKey(userId), JSON.stringify(updated))
  } catch (err) {
    console.warn('Failed to save story to localStorage:', err)
  }
}

/**
 * Removes a story from localStorage.
 */
export function removeLocalStory(userId: string, storyId: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const current = getLocalStories(userId)
    const updated = current.filter((s) => s.id !== storyId)
    window.localStorage.setItem(getStoryStorageKey(userId), JSON.stringify(updated))
  } catch (err) {
    console.warn('Failed to remove story from localStorage:', err)
  }
}

/**
 * Creates and persists a story in local storage.
 */
export function createLocalStory(
  userId: string,
  values: {
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
  }
): StoryRecord {
  const localId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `local-story-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  const now = new Date().toISOString()
  const rawAge = typeof values.childAge === 'string' ? values.childAge.trim() : values.childAge
  const age = typeof rawAge === 'number' ? rawAge : Number(rawAge) || 6

  const localStory: StoryRecord = {
    id: localId,
    user_id: userId || 'guest',
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
    created_at: now,
    updated_at: now,
    story_content: null,
    generation_status: 'pending',
    generated_at: null,
    is_favorite: false,
    learning_package: null,
  }

  saveLocalStory(userId, localStory)
  return localStory
}

export const storyService = {
  /**
   * Creates a new story record. Defensively handles schema missing column errors (such as child_id)
   * by stripping unmapped columns and retrying, with seamless fallback to local storage.
   */
  async createStory(
    userId: string,
    values: {
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
    }
  ): Promise<{ data: StoryRecord | null; error: Error | null }> {
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

    const effectiveUserId = userId || 'guest'

    // Helper to award +50 XP and +10 Stars authoritatively and locally
    const triggerReward = (storyId: string) => {
      if (values.childId) {
        economyService
          .completeActivity({
            childId: values.childId,
            activityType: 'story_completion',
            activityId: `create_${storyId}`,
            xpAmount: 50,
            starsAmount: 10,
          })
          .catch((err) => console.warn('Non-blocking story creation XP reward error:', err))
      }
    }

    // If running in guest / local mode, save directly to local storage
    if (effectiveUserId === 'guest' || effectiveUserId === 'local') {
      const localStory = createLocalStory(effectiveUserId, values)
      triggerReward(localStory.id)
      return { data: localStory, error: null }
    }

    const insertData: StoryInsert = {
      user_id: effectiveUserId,
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

    try {
      // 1. Attempt standard insert with child_id
      let res = await supabase.from('stories').insert(insertData).select().single()

      // 2. If schema missing column error occurs (e.g. child_id not present in schema cache), retry without child_id
      if (res.error && isSchemaMissingColumnError(res.error, 'child_id')) {
        console.warn('stories.child_id column not found in schema cache. Retrying insert with metadata fallback...')
        const { child_id: _omitted, ...safeInsertData } = insertData as any
        const payloadWithFallback = {
          ...safeInsertData,
          learning_package: values.childId ? ({ _meta_child_id: values.childId } as any) : null,
        }
        res = await supabase.from('stories').insert(payloadWithFallback).select().single()
      }

      if (!res.error && res.data) {
        const mapped = mapRowToStoryRecord(res.data)
        // Ensure child_id is preserved if provided in inputs
        if (values.childId && !mapped.child_id) {
          mapped.child_id = values.childId
        }
        saveLocalStory(effectiveUserId, mapped)
        triggerReward(mapped.id)
        return { data: mapped, error: null }
      }

      // 3. If remote insert fails (network error, RLS, etc.), fall back to local storage
      console.warn('Remote story insert failed, falling back to local storage:', res.error?.message)
      const fallbackStory = createLocalStory(effectiveUserId, values)
      triggerReward(fallbackStory.id)
      return { data: fallbackStory, error: null }
    } catch (err) {
      console.warn('Network or DB error creating story, falling back to local storage:', err)
      const fallbackStory = createLocalStory(effectiveUserId, values)
      triggerReward(fallbackStory.id)
      return { data: fallbackStory, error: null }
    }
  },

  /**
   * Retrieves all stories for a user, merging remote DB records with local storage.
   */
  async getStoriesForUser(userId: string): Promise<{ data: StoryRecord[] | null; error: Error | null }> {
    const effectiveUserId = userId || 'guest'

    if (effectiveUserId === 'guest' || effectiveUserId === 'local') {
      const localStories = getLocalStories(effectiveUserId)
      return { data: localStories, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', effectiveUserId)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Could not fetch stories from remote DB, falling back to local storage:', error.message)
        const localStories = getLocalStories(effectiveUserId)
        return { data: localStories, error: null }
      }

      const remoteStories: StoryRecord[] = (data || []).map((row) => mapRowToStoryRecord(row))

      // Merge local-only stories
      const localStories = getLocalStories(effectiveUserId)
      const remoteIds = new Set(remoteStories.map((s) => s.id))
      const localOnlyStories = localStories.filter((s) => !remoteIds.has(s.id))

      const merged = [...remoteStories, ...localOnlyStories]
      merged.forEach((s) => saveLocalStory(effectiveUserId, s))

      return { data: merged, error: null }
    } catch (err) {
      console.warn('Network error fetching stories, falling back to local storage:', err)
      const localStories = getLocalStories(effectiveUserId)
      return { data: localStories, error: null }
    }
  },

  /**
   * Retrieves a single story by ID.
   */
  async getStoryById(storyId: string, userId: string): Promise<{ data: StoryRecord | null; error: Error | null }> {
    const effectiveUserId = userId || 'guest'
    if (!storyId) {
      return { data: null, error: new Error('Story ID required.') }
    }

    if (effectiveUserId === 'guest' || effectiveUserId === 'local' || storyId.startsWith('local-')) {
      const local = getLocalStories(effectiveUserId).find((s) => s.id === storyId) || null
      return { data: local, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .eq('user_id', effectiveUserId)
        .maybeSingle()

      if (!error && data) {
        const story = mapRowToStoryRecord(data)
        saveLocalStory(effectiveUserId, story)
        return { data: story, error: null }
      }

      const local = getLocalStories(effectiveUserId).find((s) => s.id === storyId) || null
      return { data: local, error: null }
    } catch {
      const local = getLocalStories(effectiveUserId).find((s) => s.id === storyId) || null
      return { data: local, error: null }
    }
  },

  /**
   * Updates an existing story, gracefully stripping unmapped columns if schema mismatch occurs.
   */
  async updateStory(
    storyId: string,
    userId: string,
    updates: StoryUpdate
  ): Promise<{ data: StoryRecord | null; error: Error | null }> {
    const effectiveUserId = userId || 'guest'
    if (!storyId) {
      return { data: null, error: new Error('Story ID required.') }
    }

    if (effectiveUserId === 'guest' || effectiveUserId === 'local' || storyId.startsWith('local-')) {
      const current = getLocalStories(effectiveUserId)
      const target = current.find((s) => s.id === storyId)
      if (target) {
        const updated: StoryRecord = {
          ...target,
          ...updates,
          title: updates.title ?? target.title,
          child_name: updates.child_name ?? target.child_name,
          child_age: updates.child_age ?? target.child_age,
          child_id: updates.child_id !== undefined ? updates.child_id : target.child_id,
          language: updates.language ?? target.language,
          theme: updates.theme !== undefined ? updates.theme : target.theme,
          moral: updates.moral !== undefined ? updates.moral : target.moral,
          characters: updates.characters !== undefined ? updates.characters : target.characters,
          story_length: updates.story_length ?? target.story_length,
          reading_level: updates.reading_level ?? target.reading_level,
          status: updates.status ?? target.status,
          story_content: updates.story_content !== undefined ? updates.story_content : target.story_content,
          generation_status:
            updates.generation_status !== undefined ? updates.generation_status : target.generation_status,
          generated_at: updates.generated_at !== undefined ? updates.generated_at : target.generated_at,
          is_favorite: updates.is_favorite !== undefined ? Boolean(updates.is_favorite) : target.is_favorite,
          learning_package:
            updates.learning_package !== undefined
              ? (updates.learning_package as any)
              : target.learning_package,
          updated_at: new Date().toISOString(),
        }
        saveLocalStory(effectiveUserId, updated)
        return { data: updated, error: null }
      }
    }

    try {
      let res = await supabase
        .from('stories')
        .update(updates)
        .eq('id', storyId)
        .eq('user_id', effectiveUserId)
        .select()
        .maybeSingle()

      // If schema missing column error (e.g. child_id), strip child_id and retry
      if (res.error && isSchemaMissingColumnError(res.error, 'child_id') && 'child_id' in updates) {
        const { child_id: _omitted, ...safeUpdates } = updates as any
        res = await supabase
          .from('stories')
          .update(safeUpdates)
          .eq('id', storyId)
          .eq('user_id', effectiveUserId)
          .select()
          .maybeSingle()
      }

      if (!res.error && res.data) {
        const mapped = mapRowToStoryRecord(res.data)
        saveLocalStory(effectiveUserId, mapped)
        return { data: mapped, error: null }
      }

      // Fallback: update in local storage
      const current = getLocalStories(effectiveUserId)
      const target = current.find((s) => s.id === storyId)
      if (target) {
        const updated: StoryRecord = {
          ...target,
          ...updates,
          learning_package:
            updates.learning_package !== undefined
              ? (updates.learning_package as any)
              : target.learning_package,
          updated_at: new Date().toISOString(),
        }
        saveLocalStory(effectiveUserId, updated)
        return { data: updated, error: null }
      }

      return { data: null, error: res.error ? new Error(res.error.message) : new Error('Story not found.') }
    } catch (err) {
      console.warn('Error updating story on DB, falling back to local storage:', err)
      const current = getLocalStories(effectiveUserId)
      const target = current.find((s) => s.id === storyId)
      if (target) {
        const updated: StoryRecord = {
          ...target,
          ...updates,
          learning_package:
            updates.learning_package !== undefined
              ? (updates.learning_package as any)
              : target.learning_package,
          updated_at: new Date().toISOString(),
        }
        saveLocalStory(effectiveUserId, updated)
        return { data: updated, error: null }
      }
      return { data: null, error: err instanceof Error ? err : new Error('Failed to update story.') }
    }
  },

  /**
   * Toggles the favorite status of a story.
   */
  async toggleFavorite(
    storyId: string,
    userId: string,
    isFavorite: boolean
  ): Promise<{ data: StoryRecord | null; error: Error | null }> {
    return this.updateStory(storyId, userId, { is_favorite: isFavorite })
  },

  /**
   * Deletes a story from remote DB and local storage.
   */
  async deleteStory(storyId: string, userId: string): Promise<{ error: Error | null }> {
    const effectiveUserId = userId || 'guest'
    if (!storyId) {
      return { error: new Error('Story ID required.') }
    }

    removeLocalStory(effectiveUserId, storyId)

    if (effectiveUserId === 'guest' || effectiveUserId === 'local' || storyId.startsWith('local-')) {
      return { error: null }
    }

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId)
        .eq('user_id', effectiveUserId)

      if (error) {
        console.warn('Could not delete story from remote DB, removed locally:', error.message)
      }

      return { error: null }
    } catch (err) {
      console.warn('Network error deleting story, removed locally:', err)
      return { error: null }
    }
  },
}