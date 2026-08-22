import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { useUserPreferences } from '../hooks/useUserPreferences'
import { useI18n } from '../context/I18nContext'

const LANGUAGE_OPTIONS = [
  { value: 'English', label: '🇬🇧 English' },
  { value: 'Urdu', label: '🇵🇰 Urdu (اردو)' },
  { value: 'Arabic', label: '🇦🇪 Arabic (العربية)' },
  { value: 'Spanish', label: '🇪🇸 Spanish (Español)' },
  { value: 'French', label: '🇫🇷 French (Français)' },
  { value: 'German', label: '🇩🇪 German (Deutsch)' },
  { value: 'Mandarin', label: '🇨🇳 Mandarin (中文)' },
  { value: 'Japanese', label: '🇯🇵 Japanese (日本語)' },
  { value: 'Hindi', label: '🇮🇳 Hindi (हिन्दी)' },
  { value: 'Portuguese', label: '🇧🇷 Portuguese (Português)' },
]

export function SettingsPage() {
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences()
  const { t, setLocale } = useI18n()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 2500)
  }

  const handleThemeChange = (theme: 'system' | 'light' | 'dark') => {
    updatePreferences({ theme })
    showToast(`Theme changed to ${theme}`)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value
    updatePreferences({ defaultLanguage: newLang })
    setLocale(newLang)
    showToast(`Default language set to ${newLang}`)
  }

  const handleReadingLevelChange = (level: 'beginner' | 'intermediate' | 'advanced') => {
    updatePreferences({ defaultReadingLevel: level })
    showToast(`Default reading level updated`)
  }

  const handleStoryLengthChange = (length: 'short' | 'medium' | 'long') => {
    updatePreferences({ defaultStoryLength: length })
    showToast(`Default length updated`)
  }

  const handleNarrationSpeedChange = (speed: number) => {
    updatePreferences({ narrationSpeed: speed })
    showToast(`Narration speed set to ${speed}x`)
  }

  const handleToggleAutoplay = () => {
    const next = !preferences.autoplayNarration
    updatePreferences({ autoplayNarration: next })
    showToast(next ? 'Autoplay narration enabled' : 'Autoplay narration disabled')
  }

  const handleToggleBedtime = () => {
    const next = !preferences.bedtimeMode
    updatePreferences({ bedtimeMode: next })
    showToast(next ? 'Bedtime reading mode enabled' : 'Bedtime mode disabled')
  }

  const handleToggleReducedMotion = () => {
    const next = !preferences.reducedMotion
    updatePreferences({ reducedMotion: next })
    showToast(next ? 'Reduced motion active' : 'Standard motion active')
  }

  const handleReset = () => {
    if (window.confirm(t('settings_reset_confirm'))) {
      resetPreferences()
      showToast('Settings reset to defaults')
    }
  }

  return (
    <PageContainer
      title={t('story_settings')}
      intro={t('visual_appearance_desc')}
    >
      <div className="settings-studio-layout">
        {toastMessage && (
          <div className="settings-toast-banner" role="status" aria-live="polite">
            ✨ {toastMessage}
          </div>
        )}

        {/* 1. Appearance & Theme Settings */}
        <section className="settings-card" aria-labelledby="appearance-settings-title">
          <div className="settings-card-header">
            <span className="settings-card-icon" aria-hidden="true">
              🎨
            </span>
            <div>
              <h3 id="appearance-settings-title" className="settings-card-title">
                {t('visual_appearance_theme')}
              </h3>
              <p className="settings-card-subtitle">
                {t('visual_appearance_desc')}
              </p>
            </div>
          </div>

          <div className="theme-toggle-group" role="radiogroup" aria-label={t('visual_appearance_theme')}>
            {[
              { id: 'light', label: `☀️ ${t('theme_light')}`, desc: t('theme_light_desc') },
              { id: 'dark', label: `🌙 ${t('theme_dark')}`, desc: t('theme_dark_desc') },
              { id: 'system', label: `⚙️ ${t('theme_system')}`, desc: t('theme_system_desc') },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={preferences.theme === item.id}
                className={`theme-option-card ${preferences.theme === item.id ? 'active' : ''}`}
                onClick={() => handleThemeChange(item.id as 'system' | 'light' | 'dark')}
              >
                <span className="theme-option-title">{item.label}</span>
                <span className="theme-option-desc">{item.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 2. Story Defaults & Pacing */}
        <section className="settings-card" aria-labelledby="story-defaults-title">
          <div className="settings-card-header">
            <span className="settings-card-icon" aria-hidden="true">
              📖
            </span>
            <div>
              <h3 id="story-defaults-title" className="settings-card-title">
                {t('default_story_preferences')}
              </h3>
              <p className="settings-card-subtitle">
                {t('default_story_preferences_desc')}
              </p>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="form-group">
              <label htmlFor="default-lang-select" className="form-label">
                {t('default_story_language')}
              </label>
              <select
                id="default-lang-select"
                className="form-select"
                value={preferences.defaultLanguage}
                onChange={handleLanguageChange}
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" id="reading-level-label">
                {t('default_reading_difficulty')}
              </label>
              <div className="settings-pill-group" role="radiogroup" aria-labelledby="reading-level-label">
                {[
                  { value: 'beginner', label: `🌱 ${t('reading_level_beginner')}` },
                  { value: 'intermediate', label: `🌿 ${t('reading_level_intermediate')}` },
                  { value: 'advanced', label: `🌳 ${t('reading_level_advanced')}` },
                ].map((lvl) => (
                  <button
                    key={lvl.value}
                    type="button"
                    role="radio"
                    aria-checked={preferences.defaultReadingLevel === lvl.value}
                    className={`settings-pill-btn ${
                      preferences.defaultReadingLevel === lvl.value ? 'active' : ''
                    }`}
                    onClick={() =>
                      handleReadingLevelChange(lvl.value as 'beginner' | 'intermediate' | 'advanced')
                    }
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" id="story-length-label">
                {t('default_tale_length')}
              </label>
              <div className="settings-pill-group" role="radiogroup" aria-labelledby="story-length-label">
                {[
                  { value: 'short', label: `⚡ ${t('length_short')}` },
                  { value: 'medium', label: `📖 ${t('length_medium')}` },
                  { value: 'long', label: `🌟 ${t('length_long')}` },
                ].map((len) => (
                  <button
                    key={len.value}
                    type="button"
                    role="radio"
                    aria-checked={preferences.defaultStoryLength === len.value}
                    className={`settings-pill-btn ${
                      preferences.defaultStoryLength === len.value ? 'active' : ''
                    }`}
                    onClick={() =>
                      handleStoryLengthChange(len.value as 'short' | 'medium' | 'long')
                    }
                  >
                    {len.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Audio & Narration Pace */}
        <section className="settings-card" aria-labelledby="narration-settings-title">
          <div className="settings-card-header">
            <span className="settings-card-icon" aria-hidden="true">
              🎙️
            </span>
            <div>
              <h3 id="narration-settings-title" className="settings-card-title">
                {t('narration_speech_pace')}
              </h3>
              <p className="settings-card-subtitle">
                {t('narration_speech_pace_desc')}
              </p>
            </div>
          </div>

          <div className="settings-speed-grid" role="radiogroup" aria-label={t('narration_speech_pace')}>
            {[
              { speed: 0.85, label: t('speed_gentle'), desc: t('speed_gentle_desc') },
              { speed: 1.0, label: t('speed_normal'), desc: t('speed_normal_desc') },
              { speed: 1.15, label: t('speed_brisk'), desc: t('speed_brisk_desc') },
            ].map((item) => (
              <button
                key={item.speed}
                type="button"
                role="radio"
                aria-checked={preferences.narrationSpeed === item.speed}
                className={`speed-option-card ${
                  preferences.narrationSpeed === item.speed ? 'active' : ''
                }`}
                onClick={() => handleNarrationSpeedChange(item.speed)}
              >
                <span className="speed-title">{item.label}</span>
                <span className="speed-desc">{item.desc}</span>
              </button>
            ))}
          </div>

          <div className="settings-toggle-row">
            <div>
              <h4 id="autoplay-narration-label" className="toggle-title">{t('autoplay_narration')}</h4>
              <p className="toggle-subtitle">
                {t('autoplay_narration_desc')}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              id="autoplay-narration-switch"
              aria-label={t('autoplay_narration')}
              aria-labelledby="autoplay-narration-label"
              aria-checked={preferences.autoplayNarration}
              className={`toggle-switch-btn ${preferences.autoplayNarration ? 'active' : ''}`}
              onClick={handleToggleAutoplay}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </section>

        {/* 4. Bedtime Comfort & Accessibility */}
        <section className="settings-card" aria-labelledby="bedtime-comfort-title">
          <div className="settings-card-header">
            <span className="settings-card-icon" aria-hidden="true">
              🌙
            </span>
            <div>
              <h3 id="bedtime-comfort-title" className="settings-card-title">
                {t('bedtime_comfort_title')}
              </h3>
              <p className="settings-card-subtitle">
                {t('bedtime_comfort_desc')}
              </p>
            </div>
          </div>

          <div className="settings-toggle-row">
            <div>
              <h4 id="bedtime-mode-label" className="toggle-title">{t('bedtime_mode_title')}</h4>
              <p className="toggle-subtitle">
                {t('bedtime_mode_desc')}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              id="bedtime-mode-switch"
              aria-label={t('bedtime_mode_title')}
              aria-labelledby="bedtime-mode-label"
              aria-checked={preferences.bedtimeMode}
              className={`toggle-switch-btn ${preferences.bedtimeMode ? 'active' : ''}`}
              onClick={handleToggleBedtime}
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          <div className="settings-toggle-row">
            <div>
              <h4 id="reduced-motion-label" className="toggle-title">{t('reduced_motion_title')}</h4>
              <p className="toggle-subtitle">
                {t('reduced_motion_desc')}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              id="reduced-motion-switch"
              aria-label={t('reduced_motion_title')}
              aria-labelledby="reduced-motion-label"
              aria-checked={preferences.reducedMotion}
              className={`toggle-switch-btn ${preferences.reducedMotion ? 'active' : ''}`}
              onClick={handleToggleReducedMotion}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </section>

        {/* 5. Actions Footer */}
        <div className="settings-footer-actions">
          <Link to="/profile" className="btn btn-secondary">
            ← {t('back_to_profile')}
          </Link>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
            {t('reset_to_defaults')}
          </button>
        </div>
      </div>
    </PageContainer>
  )
}
