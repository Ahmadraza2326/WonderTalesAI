/**
 * ORBIS Internationalization (i18n) Locale Engine & Metadata
 * Supports multi-language storytelling, BCP-47 voice targeting, and directional RTL configuration.
 */

export type SupportedLocale =
  | 'en'
  | 'ar'
  | 'es'
  | 'fr'
  | 'de'
  | 'zh'
  | 'ja'
  | 'hi'
  | 'pt'
  | 'ur'

export type Direction = 'ltr' | 'rtl'

export interface LocaleConfig {
  code: SupportedLocale
  name: string
  nativeName: string
  bcp47: string
  direction: Direction
  dir?: Direction
  fontFamily?: string
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    bcp47: 'en-US',
    direction: 'ltr',
    dir: 'ltr',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    bcp47: 'ar-SA',
    direction: 'rtl',
    dir: 'rtl',
    fontFamily: "'Amiri', 'Scheherazade New', 'Segoe UI', Tahoma, serif",
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    bcp47: 'es-ES',
    direction: 'ltr',
    dir: 'ltr',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    bcp47: 'fr-FR',
    direction: 'ltr',
    dir: 'ltr',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    bcp47: 'de-DE',
    direction: 'ltr',
    dir: 'ltr',
  },
  zh: {
    code: 'zh',
    name: 'Mandarin',
    nativeName: '中文',
    bcp47: 'zh-CN',
    direction: 'ltr',
    dir: 'ltr',
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    bcp47: 'ja-JP',
    direction: 'ltr',
    dir: 'ltr',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    bcp47: 'hi-IN',
    direction: 'ltr',
    dir: 'ltr',
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    bcp47: 'pt-BR',
    direction: 'ltr',
    dir: 'ltr',
  },
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    bcp47: 'ur-PK',
    direction: 'rtl',
    dir: 'rtl',
    fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Urdu Typesetting', 'Segoe UI', Tahoma, serif",
  },
}

export const DEFAULT_LOCALE: SupportedLocale = 'en'


/**
 * Resolves any language string (name, BCP-47 tag, or code) into a standard LocaleConfig.
 */
export function resolveLocaleConfig(languageString?: string | null): LocaleConfig {
  if (!languageString || !languageString.trim()) {
    return SUPPORTED_LOCALES[DEFAULT_LOCALE]
  }

  const normalized = languageString.trim().toLowerCase()

  // Match by code
  if (normalized in SUPPORTED_LOCALES) {
    return SUPPORTED_LOCALES[normalized as SupportedLocale]
  }

  // Match by English name or native name or prefix
  for (const config of Object.values(SUPPORTED_LOCALES)) {
    if (
      config.name.toLowerCase() === normalized ||
      config.nativeName.toLowerCase() === normalized ||
      config.bcp47.toLowerCase() === normalized ||
      normalized.startsWith(config.code + '-') ||
      normalized.startsWith(config.code)
    ) {
      return config
    }
  }

  // Fallback to English
  return SUPPORTED_LOCALES[DEFAULT_LOCALE]
}

/**
 * Returns whether a given language string represents an RTL direction (e.g. Arabic).
 */
export function isRTLLocale(languageString?: string | null): boolean {
  return resolveLocaleConfig(languageString).direction === 'rtl'
}
