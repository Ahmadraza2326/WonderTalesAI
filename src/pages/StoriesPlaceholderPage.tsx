import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { useAuth } from '../context/AuthContext'
import { storyService } from '../services/storyService'
import type { StoryRecord } from '../types/story'

export function StoriesPlaceholderPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stories, setStories] = useState<StoryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadStories() {
      if (!user) {
        setErrorMessage('Please sign in to view your stories.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage(null)
      setFeedbackMessage(null)

      const { data, error } = await storyService.getStoriesForUser(user.id)

      if (error) {
        setErrorMessage('We could not load your stories right now. Please try again.')
        setIsLoading(false)
        return
      }

      setStories((data ?? []) as StoryRecord[])
      setIsLoading(false)
    }

    void loadStories()
  }, [user])

  async function handleDelete(storyId: string) {
    if (!user) return

    const confirmed = window.confirm('Are you sure you want to delete this story?')
    if (!confirmed) {
      return
    }

    setDeletingId(storyId)

    const { error } = await storyService.deleteStory(storyId, user.id)

    if (error) {
      setErrorMessage('We could not delete this story. Please try again.')
      setDeletingId(null)
      return
    }

    setStories((currentStories) => currentStories.filter((story) => story.id !== storyId))
    setDeletingId(null)
    setFeedbackMessage('Story deleted successfully.')
  }

  function formatDate(value: string | null | undefined) {
    if (!value) {
      return 'Recently'
    }

    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) {
      return 'Recently'
    }

    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <PageContainer
      title="My Story Library"
      intro="Review, read, or manage all the personalized story adventures you've created."
    >
      {/* Quick Action Top Bar */}
      <div className="library-top-bar">
        <span className="library-count-badge">
          {stories.length} {stories.length === 1 ? 'Story' : 'Stories'} Saved
        </span>
        <button
          type="button"
          className="button button-primary"
          onClick={() => navigate('/stories/new')}
        >
          ✨ Create New Story
        </button>
      </div>

      {feedbackMessage ? (
        <p className="form-status success" role="status">
          ✨ {feedbackMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="form-status error" role="alert">
          ⚠️ {errorMessage}
        </p>
      ) : null}

      {isLoading ? (
        <div className="loading-state">
          <LoadingSpinner />
          <p>Loading your story library…</p>
        </div>
      ) : null}

      {!isLoading && stories.length === 0 ? (
        <EmptyState
          icon="📖"
          title="No stories in your library yet"
          description="Create your child's first personalized story adventure and it will appear here."
          action={
            <Link to="/stories/new" className="button button-primary">
              ✨ Create Story Adventure
            </Link>
          }
        />
      ) : null}

      {!isLoading && stories.length > 0 ? (
        <div className="story-list" role="list">
          {stories.map((story) => (
            <article className="story-card card-panel" key={story.id} role="listitem">
              <div className="story-card__icon-box" aria-hidden="true">
                📖
              </div>

              <div className="story-card__content">
                <div className="story-card__header">
                  <div>
                    <div className="story-card__pills">
                      <span className="card-pill">{story.status ?? 'draft'}</span>
                      {story.reading_level ? (
                        <span className="card-pill card-pill--level">{story.reading_level}</span>
                      ) : null}
                    </div>
                    <h3 className="story-card__title">{story.title}</h3>
                  </div>
                </div>

                <dl className="story-card__details">
                  <div>
                    <dt>Child</dt>
                    <dd>{story.child_name ? `${story.child_name}${story.child_age ? ` (${story.child_age} yrs)` : ''}` : '—'}</dd>
                  </div>
                  <div>
                    <dt>Language</dt>
                    <dd>{story.language ?? 'English'}</dd>
                  </div>
                  <div>
                    <dt>Created</dt>
                    <dd>{formatDate(story.created_at)}</dd>
                  </div>
                </dl>
              </div>

              <div className="story-card__actions">
                <Link
                  to={`/stories/${story.id}`}
                  className="button button-primary story-card__open-link"
                  aria-label={`Open story: ${story.title}`}
                >
                  Open Story →
                </Link>
                <button
                  type="button"
                  className="button button-secondary story-card__delete-btn"
                  onClick={() => void handleDelete(story.id)}
                  disabled={deletingId === story.id}
                  aria-label={`Delete story: ${story.title}`}
                >
                  {deletingId === story.id ? 'Deleting…' : '🗑️ Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </PageContainer>
  )
}
