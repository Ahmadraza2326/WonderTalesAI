/**
 * ORBIS Internationalization (i18n) Context
 * Provides reactive locale management, translated strings, and RTL direction awareness.
 */

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import {
  type SupportedLocale,
  type LocaleConfig,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  resolveLocaleConfig,
  isRTLLocale,
} from '../services/i18n/locales'
import { t, type TranslationDictionary } from '../services/i18n/translations'

interface I18nContextValue {
  locale: SupportedLocale
  localeConfig: LocaleConfig
  isRTL: boolean
  setLocale: (locale: SupportedLocale | string) => void
  t: (key: keyof TranslationDictionary, overrideLocale?: string) => string
  supportedLocales: LocaleConfig[]
  resolveLocale: (lang?: string | null) => LocaleConfig
}

const I18nContext = createContext<I18nContextValue | null>(null)

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLocale?: string }> = ({
  children,
  initialLocale,
}) => {
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>(() => {
    if (initialLocale) {
      return resolveLocaleConfig(initialLocale).code
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('orbis_preferred_locale')
      if (saved) {
        return resolveLocaleConfig(saved).code
      }
    }
    return DEFAULT_LOCALE
  })

  const setLocale = useCallback((newLocale: SupportedLocale | string) => {
    const resolved = resolveLocaleConfig(newLocale)
    setCurrentLocale(resolved.code)
    if (typeof window !== 'undefined') {
      localStorage.setItem('orbis_preferred_locale', resolved.code)
    }
  }, [])

  const localeConfig = useMemo(() => SUPPORTED_LOCALES[currentLocale] || SUPPORTED_LOCALES[DEFAULT_LOCALE], [currentLocale])
  const isRTL = useMemo(() => isRTLLocale(currentLocale), [currentLocale])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = localeConfig.code
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    }
  }, [localeConfig.code, isRTL])

  const translateFn = useCallback(
    (key: keyof TranslationDictionary, overrideLocale?: string) => {
      return t(key, overrideLocale || currentLocale)
    },
    [currentLocale]
  )

  const supportedLocales = useMemo(() => Object.values(SUPPORTED_LOCALES), [])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale: currentLocale,
      localeConfig,
      isRTL,
      setLocale,
      t: translateFn,
      supportedLocales,
      resolveLocale: resolveLocaleConfig,
    }),
    [currentLocale, localeConfig, isRTL, setLocale, translateFn, supportedLocales]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    // Graceful fallback for non-context usages / unit tests
    const config = SUPPORTED_LOCALES[DEFAULT_LOCALE]
    return {
      locale: DEFAULT_LOCALE,
      localeConfig: config,
      isRTL: false,
      setLocale: () => {},
      t: (key: keyof TranslationDictionary, overrideLocale?: string) => t(key, overrideLocale || DEFAULT_LOCALE),
      supportedLocales: Object.values(SUPPORTED_LOCALES),
      resolveLocale: resolveLocaleConfig,
    }
  }
  return context
}
