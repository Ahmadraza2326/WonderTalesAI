import type { ActivityType, ActivityRewardResult } from '../services/economyService'

export type ActivityDifficulty = 'easy' | 'medium' | 'hard'
export type DifficultyTier = ActivityDifficulty

export type CognitiveDomain =
  | 'memory'
  | 'vocabulary'
  | 'comprehension'
  | 'logic'
  | 'creativity'
  | 'phonics'

export interface ActivityMetadata {
  activityType: ActivityType
  title: string
  emoji: string
  tagline: string
  primaryDomain: CognitiveDomain
  secondaryDomains?: CognitiveDomain[]
  recommendedAgeMin: number
  recommendedAgeMax: number
  supportsDifficulty: boolean
}

export interface ActivityRewardStatus {
  awarded: boolean
  alreadyClaimed: boolean
  xpAwarded: number
  starsAwarded: number
  currentStreak?: number
  streakIncremented?: boolean
}

export interface ActivityEconomyState {
  isSubmitting: boolean
  isCompleted: boolean
  rewardStatus: ActivityRewardStatus | null
}

export interface CompleteActivityParams {
  xpAmount: number
  starsAmount: number
}

export interface UseActivityEconomyOptions {
  childId: string | null | undefined
  activityType: ActivityType
  activityId: string
  onRewarded?: (result: ActivityRewardResult) => void
}

export interface UseActivityEconomyReturn extends ActivityEconomyState {
  completeActivity: (params: CompleteActivityParams) => Promise<ActivityRewardResult>
  resetActivity: () => void
}
