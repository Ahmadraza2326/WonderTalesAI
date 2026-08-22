/**
 * ORBIS Gentle Learning & Reading Progress Service
 * Manages story completion milestones, calm reading time, and parent learning insights.
 */

import { supabase } from '../lib/supabase'
import type {
  StoryReadingProgress,
  ReadingProgressRow,
  RecordReadingProgressInput,
  LearningProgressSummary,
  CompletedStorySummary,
} from '../types/learning'

export function mapRowToReadingProgress(row: ReadingProgressRow): StoryReadingProgress {
  return {
    id: row.id,
    userId: row.user_id,
    storyId: row.story_id,
    childId: row.child_id,
    pagesRead: row.pages_read,
    totalPages: row.total_pages,
    readingTimeSeconds: row.reading_time_seconds,
    completed: row.completed,
    completedAt: row.completed_at,
    listenedAudio: row.listened_audio,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const learningProgressService = {
  /**
   * Records or updates reading progress for a story, with safe milestone completion.
   */
  async recordReadingProgress(
    input: RecordReadingProgressInput
  ): Promise<{ data: StoryReadingProgress | null; error: Error | null }> {
    const { userId, storyId, childId, pagesRead, totalPages, readingTimeSeconds = 0, isCompleted = false, listenedAudio = false } = input

    if (!userId || !storyId) {
      return { data: null, error: new Error('User authentication and story ID required.') }
    }

    try {
      // 1. Check existing record to avoid reverting completed status or overwriting completed_at
      const { data: existing } = await supabase
        .from('story_reading_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('story_id', storyId)
        .maybeSingle()

      const alreadyCompleted = existing?.completed || false
      const shouldMarkCompleted = isCompleted || alreadyCompleted
      const completedAt = alreadyCompleted
        ? existing?.completed_at
        : isCompleted
        ? new Date().toISOString()
        : null

      const accumulatedTime = (existing?.reading_time_seconds || 0) + readingTimeSeconds
      const maxPagesRead = Math.max(existing?.pages_read || 0, pagesRead)
      const hasListenedAudio = (existing?.listened_audio || false) || listenedAudio

      const payload = {
        user_id: userId,
        story_id: storyId,
        child_id: childId || existing?.child_id || null,
        pages_read: maxPagesRead,
        total_pages: totalPages,
        reading_time_seconds: accumulatedTime,
        completed: shouldMarkCompleted,
        completed_at: completedAt,
        listened_audio: hasListenedAudio,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('story_reading_progress')
        .upsert(payload, { onConflict: 'user_id,story_id' })
        .select()
        .single()

      if (error) {
        return { data: null, error: new Error(error.message) }
      }

      return { data: data ? mapRowToReadingProgress(data) : null, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to record reading progress.'),
      }
    }
  },

  /**
   * Retrieves reading progress for a specific story.
   */
  async getStoryProgress(
    userId: string,
    storyId: string
  ): Promise<{ data: StoryReadingProgress | null; error: Error | null }> {
    if (!userId || !storyId) {
      return { data: null, error: new Error('User ID and story ID required.') }
    }

    try {
      const { data, error } = await supabase
        .from('story_reading_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('story_id', storyId)
        .maybeSingle()

      if (error) {
        return { data: null, error: new Error(error.message) }
      }

      return { data: data ? mapRowToReadingProgress(data) : null, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch story progress.'),
      }
    }
  },

  /**
   * Aggregates calm learning insights across all completed stories for the parent.
   */
  async getLearningProgressSummary(
    userId: string
  ): Promise<{ data: LearningProgressSummary | null; error: Error | null }> {
    if (!userId) {
      return { data: null, error: new Error('User authentication required.') }
    }

    try {
      // 1. Fetch reading progress records
      const { data: progressRows, error: progressError } = await supabase
        .from('story_reading_progress')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (progressError) {
        return { data: null, error: new Error(progressError.message) }
      }

      const records = (progressRows || []).map(mapRowToReadingProgress)

      // 2. Fetch associated stories for metadata & themes
      const storyIds = records.map((r) => r.storyId)
      let storiesMap = new Map<string, { title: string; theme: string | null; child_name: string; reading_level: string; language: string }>()

      if (storyIds.length > 0) {
        const { data: storiesData } = await supabase
          .from('stories')
          .select('id, title, theme, child_name, reading_level, language')
          .in('id', storyIds)

        if (storiesData) {
          storiesData.forEach((s) => {
            storiesMap.set(s.id, s)
          })
        }
      }

      // 3. Compute Metrics
      let totalStoriesCompleted = 0
      let totalPagesRead = 0
      let totalSeconds = 0
      let listeningSessionsCount = 0
      const themeCountMap: Record<string, number> = {}
      const recentCompletedStories: CompletedStorySummary[] = []

      for (const record of records) {
        totalPagesRead += record.pagesRead
        totalSeconds += record.readingTimeSeconds
        if (record.listenedAudio) {
          listeningSessionsCount++
        }

        const storyMeta = storiesMap.get(record.storyId)

        if (record.completed && record.completedAt) {
          totalStoriesCompleted++

          if (storyMeta?.theme) {
            themeCountMap[storyMeta.theme] = (themeCountMap[storyMeta.theme] || 0) + 1
          }

          if (storyMeta && recentCompletedStories.length < 5) {
            recentCompletedStories.push({
              storyId: record.storyId,
              title: storyMeta.title,
              childName: storyMeta.child_name,
              theme: storyMeta.theme,
              readingLevel: storyMeta.reading_level,
              completedAt: record.completedAt,
              readingMinutes: Math.max(1, Math.round(record.readingTimeSeconds / 60)),
              language: storyMeta.language || 'English',
            })
          }
        }
      }

      const themesExplored = Object.entries(themeCountMap)
        .map(([theme, count]) => ({ theme, count }))
        .sort((a, b) => b.count - a.count)

      const summary: LearningProgressSummary = {
        totalStoriesCompleted,
        totalPagesRead,
        totalReadingMinutes: Math.max(totalStoriesCompleted > 0 ? 1 : 0, Math.round(totalSeconds / 60)),
        listeningSessionsCount,
        themesExplored,
        recentCompletedStories,
      }

      return { data: summary, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to compute learning progress summary.'),
      }
    }
  },
}
