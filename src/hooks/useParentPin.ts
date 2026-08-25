/**
 * React Hook for Parent PIN Gate & Security Operations
 */

import { useState, useEffect, useCallback } from 'react'
import { parentPinService } from '../services/parentPinService'
import type { MathChallenge } from '../services/parentPinService'

export interface UseParentPinResult {
  isPinSet: boolean
  isUnlocked: boolean
  isLockedOut: boolean
  lockoutSeconds: number
  activeChallenge: MathChallenge | null
  verifyPin: (pin: string) => { success: boolean; error: string | null }
  setPin: (pin: string) => { success: boolean; error: string | null }
  lockSession: () => void
  requestMathChallenge: () => MathChallenge
  verifyMathChallenge: (answer: number | string) => boolean
  resetPin: () => void
  checkSession: () => void
}

export function useParentPin(): UseParentPinResult {
  const [isPinSet, setIsPinSet] = useState<boolean>(() => parentPinService.isPinSet())
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => parentPinService.isSessionActive())
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(() =>
    parentPinService.getLockoutRemainingSeconds()
  )
  const [activeChallenge, setActiveChallenge] = useState<MathChallenge | null>(null)

  const checkSession = useCallback(() => {
    setIsPinSet(parentPinService.isPinSet())
    setIsUnlocked(parentPinService.isSessionActive())
    setLockoutSeconds(parentPinService.getLockoutRemainingSeconds())
  }, [])

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return

    const timer = setInterval(() => {
      const remaining = parentPinService.getLockoutRemainingSeconds()
      setLockoutSeconds(remaining)
      if (remaining <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [lockoutSeconds])

  const verifyPin = useCallback((pin: string) => {
    const result = parentPinService.verifyPin(pin)
    if (result.success) {
      setIsUnlocked(true)
      setIsPinSet(true)
      setLockoutSeconds(0)
    } else if (result.lockoutRemainingSeconds) {
      setLockoutSeconds(result.lockoutRemainingSeconds)
    }
    return result
  }, [])

  const setPin = useCallback((pin: string) => {
    const result = parentPinService.setPin(pin)
    if (result.success) {
      setIsPinSet(true)
      setIsUnlocked(true)
      setLockoutSeconds(0)
    }
    return result
  }, [])

  const lockSession = useCallback(() => {
    parentPinService.lockSession()
    setIsUnlocked(false)
  }, [])

  const requestMathChallenge = useCallback(() => {
    const challenge = parentPinService.generateMathChallenge()
    setActiveChallenge(challenge)
    return challenge
  }, [])

  const verifyMathChallenge = useCallback(
    (answer: number | string): boolean => {
      if (!activeChallenge) return false
      const success = parentPinService.verifyMathChallenge(answer, activeChallenge.answer)
      if (success) {
        setIsUnlocked(true)
        setLockoutSeconds(0)
        setActiveChallenge(null)
      }
      return success
    },
    [activeChallenge]
  )

  const resetPin = useCallback(() => {
    parentPinService.resetPin()
    setIsPinSet(false)
    setIsUnlocked(false)
    setLockoutSeconds(0)
    setActiveChallenge(null)
  }, [])

  return {
    isPinSet,
    isUnlocked,
    isLockedOut: lockoutSeconds > 0,
    lockoutSeconds,
    activeChallenge,
    verifyPin,
    setPin,
    lockSession,
    requestMathChallenge,
    verifyMathChallenge,
    resetPin,
    checkSession,
  }
}
