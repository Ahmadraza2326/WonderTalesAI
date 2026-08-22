/**
 * Phase 8E i18n / RTL / BCP-47 Voices Test Suite
 * Includes full verification for Arabic (ar-SA) and Urdu (ur-PK) RTL languages.
 */
import { resolveLocaleConfig, isRTLLocale, SUPPORTED_LOCALES } from '../src/services/i18n/locales'
import { t } from '../src/services/i18n/translations'

console.log('🧪 Running Phase 8E i18n / RTL / Voices Suite...')

let passed = 0
let total = 0

function assert(condition: boolean, name: string, details?: string) {
  total++
  if (condition) {
    passed++
    console.log(`  ✅ [PASS] ${name}`)
  } else {
    console.error(`  ❌ [FAIL] ${name}${details ? ` -> ${details}` : ''}`)
  }
}

// 1. RTL Detection (Arabic + Urdu)
assert(isRTLLocale('ar') === true, 'Arabic (ar) is identified as RTL')
assert(isRTLLocale('ar-SA') === true, 'Arabic (ar-SA) is identified as RTL')
assert(isRTLLocale('Urdu') === true, 'Urdu (name) is identified as RTL')
assert(isRTLLocale('ur') === true, 'Urdu (ur) is identified as RTL')
assert(isRTLLocale('ur-PK') === true, 'Urdu (ur-PK) is identified as RTL')
assert(isRTLLocale('en') === false, 'English is identified as LTR')
assert(isRTLLocale('en-US') === false, 'English (en-US) is identified as LTR')
assert(isRTLLocale('es-ES') === false, 'Spanish is identified as LTR')

// 2. Locales resolution
assert(resolveLocaleConfig('Arabic').code === 'ar', 'Resolves "Arabic" to "ar"')
assert(resolveLocaleConfig('Spanish').code === 'es', 'Resolves "Spanish" to "es"')
assert(resolveLocaleConfig('zh-CN').code === 'zh', 'Resolves "zh-CN" to "zh"')
assert(resolveLocaleConfig('Urdu').code === 'ur', 'Resolves "Urdu" to "ur"')
assert(resolveLocaleConfig('ur-PK').bcp47 === 'ur-PK', 'Resolves "ur-PK" to bcp47 "ur-PK"')
assert(SUPPORTED_LOCALES.ur.nativeName === 'اردو', 'Urdu native name is "اردو"')

// 3. Translation
assert(t('read_along', 'ar') === 'القراءة المتزامنة', 'Arabic read_along translation matches')
assert(t('bedtime_mode', 'es') === 'Modo Noche', 'Spanish bedtime_mode translation matches')
assert(t('create_story', 'ur') === 'کہانی بنائیں', 'Urdu create_story translation matches')
assert(t('my_stories', 'ur') === 'میری کہانیاں', 'Urdu my_stories translation matches')
assert(t('settings', 'ur') === 'ترتیبات', 'Urdu settings translation matches')

console.log(`\nPhase 8E Tests: ${passed}/${total} PASS`)
if (passed !== total) process.exit(1)
