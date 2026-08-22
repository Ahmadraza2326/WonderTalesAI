/**
 * Service to manage and persist user preferences (Theme, Audio, Reading Defaults, Bedtime Mode).
 * Persisted in browser localStorage with zero external network overhead.
 */

export interface UserPreferences {
  theme: 'system' | 'light' | 'dark'
  defaultLanguage: string
  defaultReadingLevel: 'beginner' | 'intermediate' | 'advanced'
  defaultStoryLength: 'short' | 'medium' | 'long'
  narrationSpeed: number
  autoplayNarration: boolean
  bedtimeMode: boolean
  reducedMotion: boolean
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  defaultLanguage: 'English',
  defaultReadingLevel: 'intermediate',
  defaultStoryLength: 'short',
  narrationSpeed: 1.0,
  autoplayNarration: true,
  bedtimeMode: false,
  reducedMotion: false,
}

const STORAGE_KEY = 'orbis_user_preferences_v1'

export const userPreferencesService = {
  /**
   * Loads user preferences from localStorage with fallback to defaults.
   */
  getPreferences(): UserPreferences {
    if (typeof window === 'undefined') return { ...DEFAULT_PREFERENCES }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return { ...DEFAULT_PREFERENCES }
      const parsed = JSON.parse(stored)
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
      }
    } catch {
      return { ...DEFAULT_PREFERENCES }
    }
  },

  /**
   * Persists updated preferences to localStorage and applies immediate DOM updates (theme, bedtime mode).
   */
  savePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences()
    const next: UserPreferences = { ...current, ...updates }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        this.applyTheme(next.theme, next.bedtimeMode)
      } catch (err) {
        console.warn('Failed to persist user preferences:', err)
      }
    }

    return next
  },

  /**
   * Applies the theme attribute to document.documentElement.
   */
  applyTheme(theme: 'system' | 'light' | 'dark', bedtimeMode = false): void {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    let effectiveTheme = theme

    if (theme === 'system') {
      const prefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      effectiveTheme = prefersDark ? 'dark' : 'light'
    }

    root.setAttribute('data-theme', effectiveTheme)

    if (bedtimeMode) {
      root.setAttribute('data-bedtime', 'true')
    } else {
      root.removeAttribute('data-bedtime')
    }
  },

  /**
   * Initializes theme on application startup.
   */
  init(): void {
    const prefs = this.getPreferences()
    this.applyTheme(prefs.theme, prefs.bedtimeMode)

    if (typeof window !== 'undefined' && window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
          const currentPrefs = this.getPreferences()
          if (currentPrefs.theme === 'system') {
            this.applyTheme('system', currentPrefs.bedtimeMode)
          }
        })
    }
  },
}
