import { useState, useEffect, useCallback } from 'react'
import {
  userPreferencesService,
  type UserPreferences,
  DEFAULT_PREFERENCES,
} from '../services/userPreferencesService'

export interface UseUserPreferencesResult {
  preferences: UserPreferences
  updatePreferences: (updates: Partial<UserPreferences>) => void
  resetPreferences: () => void
}

export function useUserPreferences(): UseUserPreferencesResult {
  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    userPreferencesService.getPreferences()
  )

  useEffect(() => {
    userPreferencesService.init()
  }, [])

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    const saved = userPreferencesService.savePreferences(updates)
    setPreferences(saved)
  }, [])

  const resetPreferences = useCallback(() => {
    const reset = userPreferencesService.savePreferences(DEFAULT_PREFERENCES)
    setPreferences(reset)
  }, [])

  return {
    preferences,
    updatePreferences,
    resetPreferences,
  }
}
