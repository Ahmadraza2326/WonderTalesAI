import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { storyService } from '../services/storyService'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import type { StoryRecord } from '../types/story'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { t } = useI18n()
  const [stories, setStories] = useState<StoryRecord[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState(true)

  useEffect(() => {
    async function loadStories() {
      if (!user) return

      setIsLoadingStories(true)

      const { data, error } = await storyService.getStoriesForUser(user.id)

      if (!error && data) {
        setStories((data as StoryRecord[]).slice(0, 4))
      } else {
        setStories([])
      }

      setIsLoadingStories(false)
    }

    void loadStories()
  }, [user])

  async function handleSignOut() {
    await signOut()
    navigate('/auth', { replace: true })
  }

  if (!user) {
    return null
  }

  function formatDate(value: string | null | undefined) {
    if (!value) return 'Recently'
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return 'Recently'
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  return (
    <PageContainer
      title={t('workspace_title')}
      intro={t('workspace_intro')}
    >
      {/* Hero Welcome Card */}
      <section className="dashboard-hero card-panel" aria-label="Quick Actions">
        <div className="dashboard-hero__content">
          <span className="dashboard-hero__badge">✨ {t('storyteller_studio')}</span>
          <h2>{t('ready_magical_journey')}</h2>
          <p>{t('hero_card_desc')}</p>
        </div>

        <div className="dashboard-hero__actions">
          <button
            type="button"
            className="button button-primary dashboard-hero__cta"
            onClick={() => navigate('/stories/new')}
          >
            ✨ {t('create_new_story')}
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate('/stories')}
          >
            📚 {t('view_all_stories')} ({stories.length})
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={handleSignOut}
          >
            🚪 {t('sign_out')}
          </button>
        </div>
      </section>

      {/* Recent Stories Grid */}
      <section className="dashboard-recent" aria-label="Recent Stories">
        <div className="dashboard-section-header">
          <div className="dashboard-section-header__title">
            <h3>{t('recent_stories')}</h3>
            <span className="dashboard-section-header__sub">
              {t('continue_reading_sub')}
            </span>
          </div>
          {stories.length > 0 ? (
            <button
              type="button"
              className="button button-secondary dashboard-view-all-btn"
              onClick={() => navigate('/stories')}
            >
              {t('see_all_stories')}
            </button>
          ) : null}
        </div>

        {isLoadingStories ? (
          <div className="loading-state">
            <LoadingSpinner />
            <p>{t('loading')}</p>
          </div>
        ) : stories.length > 0 ? (
          <div className="dashboard-story-grid" role="list">
            {stories.map((story) => (
              <article key={story.id} className="dashboard-story-card card-panel" role="listitem">
                <div className="dashboard-story-card__icon" aria-hidden="true">
                  📖
                </div>

                <div className="dashboard-story-card__body">
                  <div className="dashboard-story-card__tags">
                    <span className="card-pill">{story.status ?? 'draft'}</span>
                    {story.reading_level ? (
                      <span className="card-pill card-pill--level">{story.reading_level}</span>
                    ) : null}
                  </div>

                  <h4 className="dashboard-story-card__title">{story.title}</h4>

                  <div className="dashboard-story-card__meta">
                    {story.child_name ? (
                      <span>👤 {story.child_name}{story.child_age ? ` (${story.child_age} yrs)` : ''}</span>
                    ) : null}
                    <span>📅 {formatDate(story.created_at)}</span>
                  </div>
                </div>

                <div className="dashboard-story-card__actions">
                  <button
                    type="button"
                    className="button button-primary dashboard-story-card__open-btn"
                    onClick={() => navigate(`/stories/${story.id}`)}
                    aria-label={`Open story: ${story.title}`}
                  >
                    {t('open_story')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🌟"
            title={t('no_stories_yet')}
            description={t('no_stories_desc')}
            action={
              <button
                type="button"
                className="button button-primary"
                onClick={() => navigate('/stories/new')}
              >
                ✨ {t('create_first_story')}
              </button>
            }
          />
        )}
      </section>
    </PageContainer>
  )
}
