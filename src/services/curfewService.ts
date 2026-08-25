/**
 * ORBIS Cognitive Screen-Time & Playtime Curfew Service
 * Manages daily time budgets, cognitive domain breakdowns, and dispatches bedtime wind-down events.
 */

export interface CurfewSettings {
  dailyLimitMinutes: number // 0 = unlimited, or 15, 30, 45, 60, 90
  bedtimeHour: number // 0 - 23 (e.g. 20 for 8 PM)
  bedtimeMinute: number // 0 - 59 (e.g. 30 for 8:30 PM)
  isCurfewEnabled: boolean
  isBedtimeCurfewEnabled: boolean
}

export interface CognitiveDomainTime {
  readingMinutes: number
  logicPhysicsMinutes: number
  creativityMinutes: number
  scienceMinutes: number
  totalMinutes: number
}

export interface CurfewStatus {
  isTimeExpired: boolean
  isBedtime: boolean
  isWindDownActive: boolean
  remainingMinutes: number
  usedMinutesToday: number
  limitMinutes: number
}

const CURFEW_SETTINGS_KEY = 'orbis_curfew_settings'
const SCREEN_TIME_PREFIX = 'orbis_screentime_'
const BEDTIME_OVERRIDE_KEY = 'orbis_bedtime_override_until'

const DEFAULT_SETTINGS: CurfewSettings = {
  dailyLimitMinutes: 45,
  bedtimeHour: 20, // 8:30 PM default
  bedtimeMinute: 30,
  isCurfewEnabled: true,
  isBedtimeCurfewEnabled: true,
}

function getTodayDateKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function getOverrideUntil(): number | null {
  if (typeof window === 'undefined' || !window.localStorage) return null
  const str = localStorage.getItem(BEDTIME_OVERRIDE_KEY)
  if (!str) return null
  const until = parseInt(str, 10)
  if (Date.now() > until) {
    localStorage.removeItem(BEDTIME_OVERRIDE_KEY)
    return null
  }
  return until
}

export const curfewService = {
  /**
   * Retrieves parent-configured curfew and bedtime settings.
   */
  getSettings(): CurfewSettings {
    if (typeof window === 'undefined' || !window.localStorage) {
      return DEFAULT_SETTINGS
    }
    try {
      const saved = localStorage.getItem(CURFEW_SETTINGS_KEY)
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS
  },

  /**
   * Updates parent curfew and bedtime settings.
   */
  updateSettings(updates: Partial<CurfewSettings>): CurfewSettings {
    const current = this.getSettings()
    const updated = { ...current, ...updates }
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(CURFEW_SETTINGS_KEY, JSON.stringify(updated))
    }
    this.checkAndBroadcastCurfewStatus()
    return updated
  },

  /**
   * Records active screen-time minutes for a child profile and cognitive domain.
   */
  recordScreenTime(
    childId: string,
    domain: 'reading' | 'logic' | 'creativity' | 'science',
    secondsToAdd: number
  ): void {
    if (typeof window === 'undefined' || !window.localStorage || secondsToAdd <= 0) {
      return
    }

    const key = `${SCREEN_TIME_PREFIX}${childId || 'guest'}_${getTodayDateKey()}`
    try {
      const currentRaw = localStorage.getItem(key)
      const data = currentRaw
        ? JSON.parse(currentRaw)
        : { reading: 0, logic: 0, creativity: 0, science: 0, total: 0 }

      const minutesToAdd = secondsToAdd / 60
      if (domain === 'reading') data.reading = (data.reading || 0) + minutesToAdd
      else if (domain === 'logic') data.logic = (data.logic || 0) + minutesToAdd
      else if (domain === 'creativity') data.creativity = (data.creativity || 0) + minutesToAdd
      else if (domain === 'science') data.science = (data.science || 0) + minutesToAdd

      data.total = (data.total || 0) + minutesToAdd

      localStorage.setItem(key, JSON.stringify(data))
    } catch {
      // Ignore storage errors
    }

    this.checkAndBroadcastCurfewStatus()
  },

  /**
   * Computes cognitive domain screen-time breakdown for today.
   */
  getCognitiveScreenTime(childId: string): CognitiveDomainTime {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {
        readingMinutes: 15,
        logicPhysicsMinutes: 12,
        creativityMinutes: 10,
        scienceMinutes: 8,
        totalMinutes: 45,
      }
    }

    const key = `${SCREEN_TIME_PREFIX}${childId || 'guest'}_${getTodayDateKey()}`
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const data = JSON.parse(raw)
        return {
          readingMinutes: Math.round(data.reading || 0),
          logicPhysicsMinutes: Math.round(data.logic || 0),
          creativityMinutes: Math.round(data.creativity || 0),
          scienceMinutes: Math.round(data.science || 0),
          totalMinutes: Math.round(data.total || 0),
        }
      }
    } catch {
      // Fallback
    }

    // Default gentle starter distribution if no data logged yet today
    return {
      readingMinutes: 0,
      logicPhysicsMinutes: 0,
      creativityMinutes: 0,
      scienceMinutes: 0,
      totalMinutes: 0,
    }
  },

  /**
   * Checks current curfew status and whether bedtime wind-down is active.
   */
  getCurfewStatus(childId?: string): CurfewStatus {
    const settings = this.getSettings()
    const usage = this.getCognitiveScreenTime(childId || 'guest')
    const usedMinutesToday = usage.totalMinutes

    // Check bedtime hour
    const now = new Date()
    const currentMinutesOfDay = now.getHours() * 60 + now.getMinutes()
    const bedtimeMinutesOfDay = settings.bedtimeHour * 60 + settings.bedtimeMinute

    const isBedtime =
      settings.isBedtimeCurfewEnabled &&
      (currentMinutesOfDay >= bedtimeMinutesOfDay || now.getHours() < 5)

    // Check time limit
    const isLimitExceeded =
      settings.isCurfewEnabled &&
      settings.dailyLimitMinutes > 0 &&
      usedMinutesToday >= settings.dailyLimitMinutes

    // Check parent override
    const overrideUntil = getOverrideUntil()
    const isOverridden = overrideUntil ? Date.now() < overrideUntil : false

    const isWindDownActive = (isBedtime || isLimitExceeded) && !isOverridden

    const remainingMinutes =
      settings.dailyLimitMinutes > 0
        ? Math.max(0, settings.dailyLimitMinutes - usedMinutesToday)
        : 999

    return {
      isTimeExpired: isLimitExceeded && !isOverridden,
      isBedtime: isBedtime && !isOverridden,
      isWindDownActive,
      remainingMinutes,
      usedMinutesToday,
      limitMinutes: settings.dailyLimitMinutes,
    }
  },

  /**
   * Dispatches a global event when curfew / bedtime state changes.
   */
  checkAndBroadcastCurfewStatus(): void {
    if (typeof window === 'undefined') return

    const status = this.getCurfewStatus()
    const event = new CustomEvent('orbis:curfew_update', { detail: status })
    window.dispatchEvent(event)

    if (status.isWindDownActive) {
      const bedtimeEvent = new CustomEvent('orbis:bedtime_wind_down', { detail: status })
      window.dispatchEvent(bedtimeEvent)
    }
  },

  /**
   * Grants extra playtime (e.g. +15 minutes) or temporary bedtime override.
   */
  grantExtraTime(minutes: number = 15): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const until = Date.now() + minutes * 60 * 1000
      localStorage.setItem(BEDTIME_OVERRIDE_KEY, until.toString())
    }
    this.checkAndBroadcastCurfewStatus()
  },

  /**
   * Forces instant bedtime wind-down test state.
   */
  triggerBedtimeWindDown(): void {
    if (typeof window === 'undefined') return
    const event = new CustomEvent('orbis:bedtime_wind_down', {
      detail: {
        isTimeExpired: true,
        isBedtime: true,
        isWindDownActive: true,
        remainingMinutes: 0,
        usedMinutesToday: 45,
        limitMinutes: 45,
      },
    })
    window.dispatchEvent(event)
  },
}
