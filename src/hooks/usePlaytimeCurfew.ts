/**
 * React Hook for Screen-Time Curfew & Bedtime Wind-Down
 */

import { useState, useEffect, useCallback } from 'react'
import { curfewService } from '../services/curfewService'
import type {
  CurfewSettings,
  CurfewStatus,
  CognitiveDomainTime,
} from '../services/curfewService'

export interface UsePlaytimeCurfewResult {
  settings: CurfewSettings
  status: CurfewStatus
  cognitiveTime: CognitiveDomainTime
  updateSettings: (updates: Partial<CurfewSettings>) => CurfewSettings
  grantExtraTime: (minutes?: number) => void
  triggerBedtimeWindDown: () => void
  refreshStatus: () => void
}

export function usePlaytimeCurfew(childId?: string): UsePlaytimeCurfewResult {
  const [settings, setSettings] = useState<CurfewSettings>(() => curfewService.getSettings())
  const [status, setStatus] = useState<CurfewStatus>(() => curfewService.getCurfewStatus(childId))
  const [cognitiveTime, setCognitiveTime] = useState<CognitiveDomainTime>(() =>
    curfewService.getCognitiveScreenTime(childId || 'guest')
  )

  const refreshStatus = useCallback(() => {
    setSettings(curfewService.getSettings())
    setStatus(curfewService.getCurfewStatus(childId))
    setCognitiveTime(curfewService.getCognitiveScreenTime(childId || 'guest'))
  }, [childId])

  useEffect(() => {
    refreshStatus()

    const handleCurfewUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CurfewStatus>
      if (customEvent.detail) {
        setStatus(customEvent.detail)
      }
      setCognitiveTime(curfewService.getCognitiveScreenTime(childId || 'guest'))
    }

    window.addEventListener('orbis:curfew_update', handleCurfewUpdate)
    return () => {
      window.removeEventListener('orbis:curfew_update', handleCurfewUpdate)
    }
  }, [childId, refreshStatus])

  const updateSettings = useCallback((updates: Partial<CurfewSettings>) => {
    const updated = curfewService.updateSettings(updates)
    setSettings(updated)
    setStatus(curfewService.getCurfewStatus(childId))
    return updated
  }, [childId])

  const grantExtraTime = useCallback((minutes = 15) => {
    curfewService.grantExtraTime(minutes)
    setStatus(curfewService.getCurfewStatus(childId))
  }, [childId])

  const triggerBedtimeWindDown = useCallback(() => {
    curfewService.triggerBedtimeWindDown()
  }, [])

  return {
    settings,
    status,
    cognitiveTime,
    updateSettings,
    grantExtraTime,
    triggerBedtimeWindDown,
    refreshStatus,
  }
}
