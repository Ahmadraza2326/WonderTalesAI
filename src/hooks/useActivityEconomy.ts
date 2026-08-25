import { useState, useRef, useCallback, useEffect } from 'react'
import { economyService, type ActivityRewardResult } from '../services/economyService'
import type {
  UseActivityEconomyOptions,
  UseActivityEconomyReturn,
  ActivityRewardStatus,
  CompleteActivityParams,
} from '../types/experience'

/**
 * Reusable bridge hook connecting activity game components to the authoritative economy ledger.
 * Manages submission lifecycle, optimistic states, and reward distinction (new vs already claimed).
 */
export function useActivityEconomy(
  options: UseActivityEconomyOptions
): UseActivityEconomyReturn {
  const { childId, activityType, activityId, onRewarded } = options

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [rewardStatus, setRewardStatus] = useState<ActivityRewardStatus | null>(null)

  // Guard against duplicate concurrent or repeated client submissions during a single run
  const hasSubmittedRef = useRef(false)
  const lastResultRef = useRef<ActivityRewardResult | null>(null)

  // Reset internal lock when the activity or child identity changes
  useEffect(() => {
    hasSubmittedRef.current = false
    lastResultRef.current = null
    setIsSubmitting(false)
    setIsCompleted(false)
    setRewardStatus(null)
  }, [childId, activityType, activityId])

  const completeActivity = useCallback(
    async (params: CompleteActivityParams): Promise<ActivityRewardResult> => {
      // If already submitted in this session run, return cached result to prevent redundant calls
      if (hasSubmittedRef.current && lastResultRef.current) {
        return lastResultRef.current
      }

      // If no active child is assigned (e.g., anonymous guest), mark completed without minting rewards
      if (!childId) {
        hasSubmittedRef.current = true
        setIsCompleted(true)
        setIsSubmitting(false)
        const unauthenticatedResult: ActivityRewardResult = {
          success: true,
          alreadyAwarded: false,
          xpAwarded: 0,
          starsAwarded: 0,
        }
        lastResultRef.current = unauthenticatedResult
        onRewarded?.(unauthenticatedResult)
        return unauthenticatedResult
      }

      hasSubmittedRef.current = true
      setIsSubmitting(true)

      try {
        const result = await economyService.completeActivity({
          childId,
          activityType,
          activityId,
          xpAmount: params.xpAmount,
          starsAmount: params.starsAmount,
        })

        lastResultRef.current = result
        setIsSubmitting(false)
        setIsCompleted(true)

        if (result.success) {
          setRewardStatus({
            awarded: !result.alreadyAwarded,
            alreadyClaimed: Boolean(result.alreadyAwarded),
            xpAwarded: result.xpAwarded,
            starsAwarded: result.starsAwarded,
            currentStreak: result.currentStreak,
            streakIncremented: result.streakIncremented,
          })
        }

        onRewarded?.(result)
        return result
      } catch (err) {
        setIsSubmitting(false)
        // Allow retry if a network/unexpected exception occurred
        hasSubmittedRef.current = false
        const fallbackErrorResult: ActivityRewardResult = {
          success: false,
          alreadyAwarded: false,
          xpAwarded: 0,
          starsAwarded: 0,
          error: err instanceof Error ? err : new Error(String(err)),
        }
        return fallbackErrorResult
      }
    },
    [childId, activityType, activityId, onRewarded]
  )

  const resetActivity = useCallback(() => {
    hasSubmittedRef.current = false
    lastResultRef.current = null
    setIsSubmitting(false)
    setIsCompleted(false)
    setRewardStatus(null)
  }, [])

  return {
    isSubmitting,
    isCompleted,
    rewardStatus,
    completeActivity,
    resetActivity,
  }
}
