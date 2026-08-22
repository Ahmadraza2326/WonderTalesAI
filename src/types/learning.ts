/**
 * ORBIS Gentle Learning & Reading Progress Domain Types
 */

import type { Database } from './database.types'

export type ReadingProgressRow = Database['public']['Tables']['story_reading_progress']['Row']
export type ReadingProgressInsert = Database['public']['Tables']['story_reading_progress']['Insert']
export type ReadingProgressUpdate = Database['public']['Tables']['story_reading_progress']['Update']

export interface StoryReadingProgress {
  id: string
  userId: string
  storyId: string
  childId?: string | null
  pagesRead: number
  totalPages: number
  readingTimeSeconds: number
  completed: boolean
  completedAt?: string | null
  listenedAudio: boolean
  createdAt: string
  updatedAt: string
}

export interface RecordReadingProgressInput {
  userId: string
  storyId: string
  childId?: string | null
  pagesRead: number
  totalPages: number
  readingTimeSeconds?: number
  isCompleted?: boolean
  listenedAudio?: boolean
}

export interface CompletedStorySummary {
  storyId: string
  title: string
  childName?: string
  theme?: string | null
  readingLevel?: string
  completedAt: string
  readingMinutes: number
  language: string
}

export interface LearningProgressSummary {
  totalStoriesCompleted: number
  totalPagesRead: number
  totalReadingMinutes: number
  listeningSessionsCount: number
  themesExplored: { theme: string; count: number }[]
  recentCompletedStories: CompletedStorySummary[]
}
