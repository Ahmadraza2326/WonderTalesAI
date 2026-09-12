import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import { useChildProfiles } from '../hooks/useChildProfiles'
import { useUserPreferences } from '../hooks/useUserPreferences'
import { ChildProfileCard } from '../components/profile/ChildProfileCard'
import { AddChildModal } from '../components/profile/AddChildModal'
import { ParentLearningInsights } from '../components/learning/ParentLearningInsights'
import { QuotaStatusCard } from '../components/profile/QuotaStatusCard'
import { SignOutConfirmationModal } from '../components/profile/SignOutConfirmationModal'
import { parentProfileService, type ParentProfile } from '../services/parentProfileService'
import { HapticsService } from '../services/hapticsService'
import type { ChildProfile } from '../types/childProfile'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

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

export function ProfilePage({ initialTab = 'profiles' }: { initialTab?: 'profiles' | 'settings' }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryTab = searchParams.get('tab') === 'settings' ? 'settings' : initialTab

  const { user, signOut, isLoading: isAuthLoading } = useAuth()
  const { t, setLocale } = useI18n()
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences()

  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null)
  const [isEditingName, setIsEditingName] = useState<boolean>(false)
  const [editedName, setEditedName] = useState<string>('')
  const [isSavingName, setIsSavingName] = useState<boolean>(false)

  // Child profiles hook
  const {
    profiles,
    isLoading: isProfilesLoading,
    createProfile,
    updateProfile,
    deleteProfile,
  } = useChildProfiles()

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null)
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState<boolean>(false)
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/auth', { replace: true })
      return
    }

    if (user?.id) {
      parentProfileService.getProfile(user.id).then(({ data }) => {
        if (data) {
          setParentProfile(data)
          setEditedName(data.full_name || '')
        }
      })
    }
  }, [user, isAuthLoading, navigate])

  useEffect(() => {
    if (queryTab === 'settings') {
      const el = document.getElementById('app-settings-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [queryTab])

  const handleSaveParentName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !editedName.trim()) return

    setIsSavingName(true)
    const { data, error } = await parentProfileService.updateProfile(user.id, {
      full_name: editedName.trim(),
    })
    setIsSavingName(false)

    if (!error && data) {
      setParentProfile(data)
      setIsEditingName(false)
      setFeedbackMessage(t('save_profile'))
      setTimeout(() => setFeedbackMessage(null), 3000)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
    setIsSignOutModalOpen(false)
    navigate('/', { replace: true })
  }

  const handleOpenEditChild = (child: ChildProfile) => {
    setEditingChild(child)
    setIsAddModalOpen(true)
  }

  const handleCloseChildModal = () => {
    setIsAddModalOpen(false)
    setEditingChild(null)
  }

  const handleDeleteChild = async (child: ChildProfile) => {
    if (window.confirm(`${t('delete_child_profile')}: ${child.name}?`)) {
      await deleteProfile(child.id)
      setFeedbackMessage(`${child.name} ${t('delete')}`)
      setTimeout(() => setFeedbackMessage(null), 3000)
    }
  }

  if (isAuthLoading) {
    return (
      <PageContainer title={t('family_studio')} intro={t('loading')}>
        <div className="route-loading-fallback">
          <LoadingSpinner />
        </div>
      </PageContainer>
    )
  }

  const displayName = parentProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || t('parent_account')
  const userEmail = user?.email || 'Authenticated User'
  const memberDate = user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '2026'

  const handleThemeChange = (theme: 'system' | 'light' | 'dark') => {
    updatePreferences({ theme })
    setFeedbackMessage(`Theme changed to ${theme}`)
    setTimeout(() => setFeedbackMessage(null), 2500)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value
    updatePreferences({ defaultLanguage: newLang })
    setLocale(newLang)
    setFeedbackMessage(`Default language set to ${newLang}`)
    setTimeout(() => setFeedbackMessage(null), 2500)
  }

  const scrollToSection = (sectionId: string) => {
    HapticsService.light()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <PageContainer
      title={t('family_studio')}
      intro={t('family_studio_intro')}
    >
      {/* Quick Jump Navigation Pill Bar */}
      <div
        className="profile-subtabs-nav"
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          borderBottom: '1.5px solid rgba(255, 255, 255, 0.12)',
          paddingBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => scrollToSection('young-heroes-section')}
          className="button button-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span>👶 {t('young_heroes')}</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px' }}>
            {profiles.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('app-settings-section')}
          className="button button-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span>⚙️ {t('story_settings')}</span>
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('learning-insights-section')}
          className="button button-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span>📊 Learning Insights</span>
        </button>
      </div>

      <div className="profile-studio-layout">
        {feedbackMessage && (
          <div className="form-status success" role="status" style={{ marginBottom: '1.5rem' }}>
            ✨ {feedbackMessage}
          </div>
        )}

        {/* 1. Parent Account Identity Header Card */}
        <section className="profile-card parent-identity-card" aria-labelledby="parent-identity-title">
          <div className="parent-identity-content">
            <div className="parent-avatar" aria-hidden="true">
              👑
            </div>
            <div className="parent-info">
              {isEditingName ? (
                <form onSubmit={handleSaveParentName} className="parent-name-edit-form">
                  <input
                    type="text"
                    className="form-input form-input-sm"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    maxLength={50}
                    placeholder={t('child_name')}
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary btn-sm" disabled={isSavingName}>
                    {t('save')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsEditingName(false)}
                  >
                    {t('cancel')}
                  </button>
                </form>
              ) : (
                <div className="parent-name-row">
                  <h2 id="parent-identity-title" className="parent-name">
                    {displayName}
                  </h2>
                  <button
                    type="button"
                    className="btn-text-edit"
                    onClick={() => setIsEditingName(true)}
                    aria-label={t('edit')}
                  >
                    ✏️ {t('edit')}
                  </button>
                </div>
              )}

              <p className="parent-email">{userEmail}</p>
              <span className="parent-member-badge">🌟 {t('app_name')} • {t('stay_signed_in')} ({memberDate})</span>
            </div>
          </div>

          <div className="parent-header-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => scrollToSection('app-settings-section')}
            >
              ⚙️ {t('story_settings')}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsSignOutModalOpen(true)}
            >
              {t('sign_out')}
            </button>
          </div>
        </section>

        {/* 2. Family Child Profiles Management Section (Young Heroes) */}
        <section id="young-heroes-section" className="profile-card" aria-labelledby="family-profiles-title">
          <div className="section-title-row">
            <div>
              <h3 id="family-profiles-title" className="section-heading">
                👶 {t('young_heroes')} ({profiles.length})
              </h3>
              <p className="section-subheading">
                {t('no_children_profiles_desc')}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingChild(null)
                setIsAddModalOpen(true)
              }}
            >
              + {t('add_child')}
            </button>
          </div>

          {isProfilesLoading ? (
            <div className="profiles-loading-state" aria-busy="true">
              <LoadingSpinner />
              <span>{t('loading')}</span>
            </div>
          ) : profiles.length > 0 ? (
            <div className="child-profiles-grid">
              {profiles.map((child) => (
                <ChildProfileCard
                  key={child.id}
                  profile={child}
                  onEdit={handleOpenEditChild}
                  onDelete={handleDeleteChild}
                />
              ))}
            </div>
          ) : (
            <div className="empty-children-card">
              <span className="empty-children-icon">🌟</span>
              <h4>{t('no_children_yet')}</h4>
              <p>{t('no_children_desc')}</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setEditingChild(null)
                  setIsAddModalOpen(true)
                }}
              >
                {t('add_first_child')}
              </button>
            </div>
          )}
        </section>

        {/* 3. Unified App & Story Settings Section (Theme, Language, Narration Speed, Toggles) */}
        <div id="app-settings-section" className="settings-studio-layout">
          {/* Appearance & Theme */}
          <section className="settings-card" aria-labelledby="appearance-settings-title">
            <div className="settings-card-header">
              <span className="settings-card-icon" aria-hidden="true">🎨</span>
              <div>
                <h3 id="appearance-settings-title" className="settings-card-title">
                  {t('visual_appearance_theme')}
                </h3>
                <p className="settings-card-subtitle">{t('visual_appearance_desc')}</p>
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

          {/* Language & Story Defaults */}
          <section className="settings-card" aria-labelledby="story-defaults-title">
            <div className="settings-card-header">
              <span className="settings-card-icon" aria-hidden="true">📖</span>
              <div>
                <h3 id="story-defaults-title" className="settings-card-title">
                  {t('default_story_preferences')}
                </h3>
                <p className="settings-card-subtitle">{t('default_story_preferences_desc')}</p>
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
            </div>
          </section>

          {/* Audio, Narration Speed & Sound Toggles */}
          <section className="settings-card" aria-labelledby="audio-experience-title">
            <div className="settings-card-header">
              <span className="settings-card-icon" aria-hidden="true">🔊</span>
              <div>
                <h3 id="audio-experience-title" className="settings-card-title">
                  {t('narration_speech_pace')}
                </h3>
                <p className="settings-card-subtitle">{t('narration_speech_pace_desc')}</p>
              </div>
            </div>

            {/* Narration Speed Slider */}
            <div className="settings-form-grid" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <div className="form-label-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label htmlFor="narration-speed-range" className="form-label">
                    {t('narration_speech_pace')}
                  </label>
                  <span className="range-value-pill" style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {preferences.narrationSpeed.toFixed(1)}x
                  </span>
                </div>
                <input
                  id="narration-speed-range"
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={preferences.narrationSpeed}
                  onChange={(e) => updatePreferences({ narrationSpeed: parseFloat(e.target.value) })}
                  className="form-range"
                  style={{ width: '100%' }}
                />
                <div className="range-markers" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                  <span>0.75x</span>
                  <span>1.0x</span>
                  <span>1.5x</span>
                </div>
              </div>
            </div>

            <div className="settings-toggle-list">
              <div className="settings-toggle-item">
                <div>
                  <span className="toggle-label">{t('autoplay_narration')}</span>
                  <span className="toggle-sublabel">{t('autoplay_narration_desc')}</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.autoplayNarration}
                  onChange={() => updatePreferences({ autoplayNarration: !preferences.autoplayNarration })}
                />
              </div>
              <div className="settings-toggle-item">
                <div>
                  <span className="toggle-label">{t('bedtime_mode_title')}</span>
                  <span className="toggle-sublabel">{t('bedtime_mode_desc')}</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.bedtimeMode}
                  onChange={() => updatePreferences({ bedtimeMode: !preferences.bedtimeMode })}
                />
              </div>
              <div className="settings-toggle-item">
                <div>
                  <span className="toggle-label">{t('reduced_motion_title')}</span>
                  <span className="toggle-sublabel">{t('reduced_motion_desc')}</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.reducedMotion}
                  onChange={() => updatePreferences({ reducedMotion: !preferences.reducedMotion })}
                />
              </div>
            </div>
          </section>

          {/* Reset Preferences */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (window.confirm(t('settings_reset_confirm'))) {
                  resetPreferences()
                  setFeedbackMessage('Settings reset to defaults')
                  setTimeout(() => setFeedbackMessage(null), 2500)
                }
              }}
            >
              🔄 {t('reset_to_defaults')}
            </button>
          </div>
        </div>

        {/* 4. Parent Learning Insights Section */}
        <div id="learning-insights-section">
          <ParentLearningInsights />
        </div>

        {/* 5. Daily Story Generation Quota Section */}
        <section aria-labelledby="quota-section-title">
          <QuotaStatusCard />
        </section>

        {/* 6. Quick Navigation Footer */}
        <div className="profile-footer-links">
          <Link to="/stories/new" className="btn btn-primary">
            ✨ {t('create_new_story')}
          </Link>
          <Link to="/stories" className="btn btn-secondary">
            📚 {t('view_all_stories')}
          </Link>
        </div>
      </div>

      {/* Add / Edit Child Modal */}
      <AddChildModal
        isOpen={isAddModalOpen}
        onClose={handleCloseChildModal}
        initialData={editingChild}
        mode={editingChild ? 'edit' : 'create'}
        onSubmitProfile={async (input) => {
          if (editingChild) {
            return updateProfile(editingChild.id, input)
          }
          return createProfile(input)
        }}
        onSuccess={(profile) => {
          setFeedbackMessage(
            editingChild
              ? `${t('save_profile')}: ${profile.name}`
              : `${t('add_child_profile')}: ${profile.name}`
          )
          setTimeout(() => setFeedbackMessage(null), 3000)
        }}
      />

      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmationModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleSignOut}
        isSubmitting={isSigningOut}
      />
    </PageContainer>
  )
}
