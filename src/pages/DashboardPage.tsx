import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { storyService } from '../services/storyService'
import { useAuth } from '../context/AuthContext'
import type { StoryRecord } from '../types/story'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
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
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <PageContainer
      title="Parent & Teacher Workspace"
      intro="Manage your personalized stories, continue reading, or create a brand new adventure."
    >
      {/* Hero Welcome Card */}
      <section className="dashboard-hero card-panel" aria-label="Quick Actions">
        <div className="dashboard-hero__content">
          <span className="dashboard-hero__badge">✨ Storyteller Studio</span>
          <h2>Ready for another magical journey?</h2>
          <p>
            Create personalized tales that teach morals, build reading confidence, and spark lifelong imagination.
          </p>
        </div>

        <div className="dashboard-hero__actions">
          <button
            type="button"
            className="button button-primary dashboard-hero__cta"
            onClick={() => navigate('/stories/new')}
          >
            ✨ Create New Story
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate('/stories')}
          >
            📚 View All Stories ({stories.length})
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={handleSignOut}
          >
            🚪 Sign Out
          </button>
        </div>
      </section>

      {/* Recent Stories Grid */}
      <section className="dashboard-recent" aria-label="Recent Stories">
        <div className="dashboard-section-header">
          <div className="dashboard-section-header__title">
            <h3>Recent Stories</h3>
            <span className="dashboard-section-header__sub">
              Continue reading where you left off
            </span>
          </div>
          {stories.length > 0 ? (
            <button
              type="button"
              className="button button-secondary dashboard-view-all-btn"
              onClick={() => navigate('/stories')}
            >
              See All Stories →
            </button>
          ) : null}
        </div>

        {isLoadingStories ? (
          <div className="loading-state">
            <LoadingSpinner />
            <p>Loading your recent stories…</p>
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
                    Open Story →
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🌟"
            title="No stories yet"
            description="Your storytelling journey begins here. Create your first personalized children's story in seconds."
            action={
              <button
                type="button"
                className="button button-primary"
                onClick={() => navigate('/stories/new')}
              >
                ✨ Create First Story
              </button>
            }
          />
        )}
      </section>
    </PageContainer>
  )
}
