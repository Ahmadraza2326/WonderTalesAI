import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import { useChildProfiles } from '../hooks/useChildProfiles'
import { ChildProfileCard } from '../components/profile/ChildProfileCard'
import { AddChildModal } from '../components/profile/AddChildModal'
import { ParentLearningInsights } from '../components/learning/ParentLearningInsights'
import { QuotaStatusCard } from '../components/profile/QuotaStatusCard'
import { SignOutConfirmationModal } from '../components/profile/SignOutConfirmationModal'
import { parentProfileService, type ParentProfile } from '../services/parentProfileService'
import type { ChildProfile } from '../types/childProfile'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, signOut, isLoading: isAuthLoading } = useAuth()
  const { t } = useI18n()

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

  return (
    <PageContainer
      title={t('family_studio')}
      intro={t('family_studio_intro')}
    >
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
            <Link to="/settings" className="btn btn-secondary btn-sm">
              ⚙️ {t('story_settings')}
            </Link>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsSignOutModalOpen(true)}
            >
              {t('sign_out')}
            </button>
          </div>
        </section>

        {/* 2. Family Child Profiles Management Section */}
        <section className="profile-card" aria-labelledby="family-profiles-title">
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

        {/* 3. Parent Learning Insights Section */}
        <ParentLearningInsights />

        {/* 4. Daily Story Generation Quota Section */}
        <section aria-labelledby="quota-section-title">
          <QuotaStatusCard />
        </section>

        {/* 5. Quick Navigation Footer */}
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
