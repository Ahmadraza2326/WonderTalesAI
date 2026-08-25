import { supabase } from '../lib/supabase'

export type ActivityType =
  | 'quiz'
  | 'memory_match'
  | 'word_trace'
  | 'vocabulary'
  | 'logic'
  | 'story_completion'
  | (string & {})

export interface CompleteActivityInput {
  childId: string
  activityType: ActivityType
  activityId: string
  xpAmount?: number
  starsAmount?: number
}

export interface ActivityRewardResult {
  success: boolean
  alreadyAwarded: boolean
  xpAwarded: number
  starsAwarded: number
  currentXp?: number
  currentStars?: number
  currentStreak?: number
  streakIncremented?: boolean
  error?: Error
}

interface RawRpcRewardResponse {
  success?: boolean
  already_awarded?: boolean
  xp_awarded?: number
  stars_awarded?: number
  current_xp?: number
  current_stars?: number
  current_streak?: number
  streak_incremented?: boolean
}

export const economyService = {
  /**
   * Authoritatively and idempotently records activity completion and awards XP/Stars.
   * Server-side database constraints prevent double-awarding for the same (childId, activityType, activityId).
   */
  async completeActivity(
    input: CompleteActivityInput
  ): Promise<ActivityRewardResult> {
    const {
      childId,
      activityType,
      activityId,
      xpAmount = 0,
      starsAmount = 0,
    } = input

    if (!childId || typeof childId !== 'string') {
      return {
        success: false,
        alreadyAwarded: false,
        xpAwarded: 0,
        starsAwarded: 0,
        error: new Error('Child ID is required to award activity rewards.'),
      }
    }

    if (!activityType || typeof activityType !== 'string') {
      return {
        success: false,
        alreadyAwarded: false,
        xpAwarded: 0,
        starsAwarded: 0,
        error: new Error('Activity type is required to award activity rewards.'),
      }
    }

    if (!activityId || typeof activityId !== 'string') {
      return {
        success: false,
        alreadyAwarded: false,
        xpAwarded: 0,
        starsAwarded: 0,
        error: new Error('Activity ID is required to award activity rewards.'),
      }
    }

    const safeXp = Math.max(0, Math.min(Math.floor(xpAmount), 500))
    const safeStars = Math.max(0, Math.min(Math.floor(starsAmount), 100))

    try {
      const { data, error } = await supabase.rpc('award_child_rewards', {
        p_child_id: childId,
        p_activity_type: activityType,
        p_activity_id: activityId,
        p_xp_amount: safeXp,
        p_stars_amount: safeStars,
      })

      if (error) {
        throw error
      }

      const response = (data as RawRpcRewardResponse | null) || {}

      return {
        success: response.success ?? true,
        alreadyAwarded: response.already_awarded ?? false,
        xpAwarded: response.xp_awarded ?? (response.already_awarded ? 0 : safeXp),
        starsAwarded: response.stars_awarded ?? (response.already_awarded ? 0 : safeStars),
        currentXp: response.current_xp,
        currentStars: response.current_stars,
        currentStreak: response.current_streak,
        streakIncremented: response.streak_incremented ?? false,
      }
    } catch (error) {
      console.error('[economyService] Error completing activity and awarding rewards:', error)
      return {
        success: false,
        alreadyAwarded: false,
        xpAwarded: 0,
        starsAwarded: 0,
        error: error instanceof Error ? error : new Error(String(error)),
      }
    }
  },

  /**
   * Convenience alias for completeActivity.
   */
  async awardRewards(
    childId: string,
    activityType: ActivityType,
    activityId: string,
    xpAmount: number,
    starsAmount: number
  ): Promise<ActivityRewardResult> {
    return this.completeActivity({
      childId,
      activityType,
      activityId,
      xpAmount,
      starsAmount,
    })
  },
}

