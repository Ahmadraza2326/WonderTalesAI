/**
 * Phase 8G / 8G.1 V1 Readiness & Integration Verification Suite
 * Tests Global i18n Context, 10 Supported Locales including Urdu (ur-PK) + Arabic RTL, Email & Google Authentication, Multi-language Dictionaries, and Security.
 */

import { resolveLocaleConfig, isRTLLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from '../src/services/i18n/locales'
import { TRANSLATIONS, t, type TranslationDictionary } from '../src/services/i18n/translations'
import { authService } from '../src/services/authService'
import * as fs from 'fs'
import * as path from 'path'

const rootDir = process.cwd()

let totalTests = 0
let passedTests = 0
let failedTests = 0

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++
  if (condition) {
    passedTests++
    console.log(`  ✅ [PASS] ${testName}`)
  } else {
    failedTests++
    console.error(`  ❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`)
  }
}

console.log('==================================================================')
console.log('🧪 ORBIS / WonderTalesAI — PHASE 8G/8G.1 V1 READINESS TEST SUITE')
console.log('==================================================================\n')

// -----------------------------------------------------------------------------
// 1. GLOBAL I18N & CONTEXT ARCHITECTURE (10 LOCALES)
// -----------------------------------------------------------------------------
console.log('📦 1. Global i18n & Context Architecture (10 Locales)')

assert(typeof resolveLocaleConfig === 'function', 'resolveLocaleConfig is defined and callable')
assert(typeof isRTLLocale === 'function', 'isRTLLocale is defined and callable')
assert(DEFAULT_LOCALE === 'en', 'DEFAULT_LOCALE is "en" (English remains default)')

const supportedKeys = Object.keys(SUPPORTED_LOCALES)
assert(supportedKeys.length === 10, 'Exactly 10 locales are supported in SUPPORTED_LOCALES', `Found ${supportedKeys.length}`)
assert(supportedKeys.includes('en'), 'English (en) is supported (Default: en-US)')
assert(supportedKeys.includes('ar'), 'Arabic (ar) is supported (RTL: ar-SA)')
assert(supportedKeys.includes('es'), 'Spanish (es) is supported (es-ES)')
assert(supportedKeys.includes('fr'), 'French (fr) is supported (fr-FR)')
assert(supportedKeys.includes('de'), 'German (de) is supported (de-DE)')
assert(supportedKeys.includes('zh'), 'Mandarin (zh) is supported (zh-CN)')
assert(supportedKeys.includes('ja'), 'Japanese (ja) is supported (ja-JP)')
assert(supportedKeys.includes('hi'), 'Hindi (hi) is supported (hi-IN)')
assert(supportedKeys.includes('pt'), 'Portuguese (pt) is supported (pt-BR)')
assert(supportedKeys.includes('ur'), 'Urdu (ur) is supported (RTL: ur-PK)')

// RTL Verifications
assert(isRTLLocale('ar') === true, 'Arabic (ar) reports isRTL === true')
assert(isRTLLocale('ar-SA') === true, 'Arabic (ar-SA) reports isRTL === true')
assert(isRTLLocale('ur') === true, 'Urdu (ur) reports isRTL === true')
assert(isRTLLocale('ur-PK') === true, 'Urdu (ur-PK) reports isRTL === true')
assert(isRTLLocale('en') === false, 'English reports isRTL === false')
assert(isRTLLocale('en-US') === false, 'English (en-US) reports isRTL === false')
assert(isRTLLocale('es') === false, 'Spanish reports isRTL === false')
assert(isRTLLocale('fr') === false, 'French reports isRTL === false')
assert(isRTLLocale('de') === false, 'German reports isRTL === false')
assert(isRTLLocale('zh') === false, 'Mandarin reports isRTL === false')
assert(isRTLLocale('ja') === false, 'Japanese reports isRTL === false')
assert(isRTLLocale('hi') === false, 'Hindi reports isRTL === false')
assert(isRTLLocale('pt') === false, 'Portuguese reports isRTL === false')

// Verify main.tsx wraps I18nProvider
const mainTsxPath = path.resolve(rootDir, 'src/main.tsx')
const mainTsxContent = fs.readFileSync(mainTsxPath, 'utf-8')
assert(mainTsxContent.includes('<I18nProvider>'), 'main.tsx mounts <I18nProvider>')
assert(mainTsxContent.includes('</I18nProvider>'), 'main.tsx closes </I18nProvider>')
assert(mainTsxContent.includes('<AuthProvider>'), 'main.tsx mounts <AuthProvider>')

// -----------------------------------------------------------------------------
// 2. TRANSLATION DICTIONARY COMPLETENESS (10 LOCALES)
// -----------------------------------------------------------------------------
console.log('\n📖 2. Translation Dictionaries Completeness (10 Locales)')

const requiredKeys: (keyof TranslationDictionary)[] = [
  'app_name', 'reading', 'audio', 'learning', 'settings', 'library', 'create_story', 'back', 'close',
  'home', 'workspace', 'profile', 'my_stories', 'sign_in', 'sign_up', 'sign_out', 'create', 'loading',
  'page', 'of', 'read_along', 'listen', 'pause', 'resume', 'two_page_spread', 'single_page_focus',
  'font_size', 'bedtime_mode', 'fullscreen', 'exit_fullscreen', 'next_page', 'previous_page', 'minutes_read',
  'reading_aloud', 'reading_finished', 'empty_story_title', 'empty_story_message',
  'story_details', 'author_notes', 'generate_storybook',
  'story_complete', 'story_completed_desc', 'read_again', 'print_storybook', 'parent_insights',
  'stories_completed', 'pages_explored', 'calm_reading_time', 'listening_sessions', 'themes_values_explored',
  'recent_reading_activity', 'no_reading_yet', 'print_disclaimer', 'print_discussion_title', 'moral_reflection',
  'auth_title', 'auth_intro', 'welcome_back', 'auth_card_desc', 'continue_with_google', 'or',
  'email', 'password', 'confirm_password', 'create_account', 'signing_in', 'creating_account',
  'already_have_account', 'dont_have_account', 'account_created_confirm', 'password_mismatch',
  'password_too_short', 'invalid_email', 'generic_auth_error',
  'workspace_title', 'workspace_intro', 'storyteller_studio', 'ready_magical_journey', 'hero_card_desc',
  'create_new_story', 'view_all_stories', 'recent_stories', 'continue_reading_sub', 'see_all_stories',
  'open_story', 'no_stories_yet', 'no_stories_desc', 'create_first_story',
  'family_studio', 'family_studio_intro', 'young_heroes', 'add_child', 'no_children_yet',
  'no_children_desc', 'add_first_child', 'story_settings', 'stay_signed_in', 'confirm_sign_out',
  'sign_out_title', 'sign_out_desc'
]

for (const loc of supportedKeys as SupportedLocale[]) {
  const dict = TRANSLATIONS[loc]
  assert(!!dict, `Translations object exists for locale: ${loc}`)
  let missingKey: string | null = null
  for (const k of requiredKeys) {
    if (!dict[k] || typeof dict[k] !== 'string') {
      missingKey = k
      break
    }
  }
  assert(!missingKey, `All ${requiredKeys.length} translation keys present for locale: ${loc}`, `Missing: ${missingKey}`)
}

// Test t() translation lookup across languages
assert(t('sign_in', 'en') === 'Sign In', 't("sign_in", "en") returns "Sign In"')
assert(t('sign_in', 'ar') === 'تسجيل الدخول', 't("sign_in", "ar") returns Arabic translation')
assert(t('sign_in', 'ur') === 'سائن ان', 't("sign_in", "ur") returns Urdu translation')
assert(t('create_story', 'ur') === 'کہانی بنائیں', 't("create_story", "ur") returns "کہانی بنائیں"')
assert(t('my_stories', 'ur') === 'میری کہانیاں', 't("my_stories", "ur") returns "میری کہانیاں"')
assert(t('settings', 'ur') === 'ترتیبات', 't("settings", "ur") returns "ترتیبات"')
assert(t('sign_in', 'es') === 'Iniciar Sesión', 't("sign_in", "es") returns Spanish translation')
assert(t('sign_in', 'fr') === 'Se Connecter', 't("sign_in", "fr") returns French translation')
assert(t('sign_in', 'de') === 'Anmelden', 't("sign_in", "de") returns German translation')
assert(t('sign_in', 'zh') === '登录', 't("sign_in", "zh") returns Mandarin translation')
assert(t('sign_in', 'ja') === 'ログイン', 't("sign_in", "ja") returns Japanese translation')
assert(t('sign_in', 'hi') === 'साइन इन करें', 't("sign_in", "hi") returns Hindi translation')
assert(t('sign_in', 'pt') === 'Entrar', 't("sign_in", "pt") returns Portuguese translation')

// Fallback test
assert(t('welcome_back', 'non-existent-locale') === 'Welcome to ORBIS', 't() falls back to English on invalid locale')

// -----------------------------------------------------------------------------
// 3. AUTHENTICATION SERVICE INTEGRATION
// -----------------------------------------------------------------------------
console.log('\n🔐 3. Authentication Service Methods')

assert(typeof authService.signInWithGoogle === 'function', 'authService.signInWithGoogle exists')
assert(typeof authService.signInWithEmail === 'function', 'authService.signInWithEmail exists')
assert(typeof authService.signUpWithEmail === 'function', 'authService.signUpWithEmail exists')
assert(typeof authService.signOut === 'function', 'authService.signOut exists')
assert(typeof authService.getSession === 'function', 'authService.getSession exists')
assert(typeof authService.getUser === 'function', 'authService.getUser exists')
assert(typeof authService.subscribeToAuthStateChange === 'function', 'authService.subscribeToAuthStateChange exists')

// Check AuthPage.tsx content
const authPagePath = path.resolve(rootDir, 'src/pages/AuthPage.tsx')
const authPageContent = fs.readFileSync(authPagePath, 'utf-8')
assert(authPageContent.includes('signInWithGoogle'), 'AuthPage calls signInWithGoogle')
assert(authPageContent.includes('signInWithEmail'), 'AuthPage calls signInWithEmail')
assert(authPageContent.includes('signUpWithEmail'), 'AuthPage calls signUpWithEmail')
assert(authPageContent.includes('useI18n'), 'AuthPage integrates useI18n')
assert(authPageContent.includes('confirmPassword'), 'AuthPage includes password confirmation for sign-up')
assert(authPageContent.includes("'current-password'") || authPageContent.includes('"current-password"'), 'AuthPage sets autocomplete="current-password" for signin')
assert(authPageContent.includes("'new-password'") || authPageContent.includes('"new-password"'), 'AuthPage sets autocomplete="new-password" for signup')
assert(authPageContent.includes('autoComplete="email"'), 'AuthPage sets autocomplete="email"')

// -----------------------------------------------------------------------------
// 4. UI LOCALIZATION INTEGRATION
// -----------------------------------------------------------------------------
console.log('\n🌐 4. UI Localization Integration Across Pages')

const headerPath = path.resolve(rootDir, 'src/components/layout/Header.tsx')
const headerContent = fs.readFileSync(headerPath, 'utf-8')
assert(headerContent.includes('useI18n'), 'Header uses useI18n')

const bottomNavPath = path.resolve(rootDir, 'src/components/layout/MobileBottomNav.tsx')
const bottomNavContent = fs.readFileSync(bottomNavPath, 'utf-8')
assert(bottomNavContent.includes('useI18n'), 'MobileBottomNav uses useI18n')

const dashboardPath = path.resolve(rootDir, 'src/pages/DashboardPage.tsx')
const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8')
assert(dashboardContent.includes('useI18n'), 'DashboardPage uses useI18n')

const profilePath = path.resolve(rootDir, 'src/pages/ProfilePage.tsx')
const profileContent = fs.readFileSync(profilePath, 'utf-8')
assert(profileContent.includes('useI18n'), 'ProfilePage uses useI18n')

const settingsPath = path.resolve(rootDir, 'src/pages/SettingsPage.tsx')
const settingsContent = fs.readFileSync(settingsPath, 'utf-8')
assert(settingsContent.includes('useI18n'), 'SettingsPage uses useI18n')
assert(settingsContent.includes('setLocale'), 'SettingsPage calls setLocale on language change')

const appShellPath = path.resolve(rootDir, 'src/components/layout/AppShell.tsx')
const appShellContent = fs.readFileSync(appShellPath, 'utf-8')
assert(appShellContent.includes('dir={isRTL ? \'rtl\' : \'ltr\'}'), 'AppShell sets dir="rtl" / "ltr"')
assert(appShellContent.includes('data-locale='), 'AppShell sets data-locale')

// -----------------------------------------------------------------------------
// 5. SECURITY & CLIENT-SIDE SECRETS SCAN
// -----------------------------------------------------------------------------
console.log('\n🛡️ 5. Security & Secret Leak Prevention')

const srcDir = path.resolve(rootDir, 'src')
function scanDirectoryForSecrets(dir: string): string[] {
  const leaks: string[] = []
  const dirFiles = fs.readdirSync(dir)
  for (const f of dirFiles) {
    const fullPath = path.join(dir, f)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      leaks.push(...scanDirectoryForSecrets(fullPath))
    } else if (/\.(tsx?|jsx?|json|html|css)$/.test(f)) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      if (/AIzaSy[A-Za-z0-9_-]{33}/.test(content)) {
        leaks.push(`Hardcoded Google API key found in ${fullPath}`)
      }
      if (/VITE_GEMINI_API_KEY\s*=\s*['"][^'"]+['"]/.test(content)) {
        leaks.push(`Hardcoded VITE_GEMINI_API_KEY found in ${fullPath}`)
      }
    }
  }
  return leaks
}

const secretLeaks = scanDirectoryForSecrets(srcDir)
assert(secretLeaks.length === 0, 'Zero client-side Gemini secrets found in src/', secretLeaks.join(', '))

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n==================================================================')
console.log(`📊 PHASE 8G/8G.1 TEST RESULTS: ${passedTests}/${totalTests} PASS (${failedTests} FAILED)`)
console.log('==================================================================\n')

if (failedTests > 0) {
  process.exit(1)
}
