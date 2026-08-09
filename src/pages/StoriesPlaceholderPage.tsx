import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { storyService } from '../services/storyService'
import type { StoryRecord } from '../types/story'

export function StoriesPlaceholderPage() {
  const { user } = useAuth()
  const [stories, setStories] = useState<StoryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  useEffect(() => {
    void loadStories()
  }, [user])

  async function handleDelete(storyId: string) {
    if (!user) return

    const confirmed = window.confirm('Delete this story?')
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
  }


  function handlePlaceholderAction(action: string) {
    setFeedbackMessage(`${action} will be available in a future milestone.`)
  }

  function formatDate(value: string | null | undefined) {
    if (!value) {
      return '—'
    }

    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) {
      return '—'
    }

    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <PageContainer title="My Stories" intro="Review, open, edit, or manage your saved story drafts.">
      {feedbackMessage ? <p className="form-status success">{feedbackMessage}</p> : null}
      {errorMessage ? <p className="form-status error">{errorMessage}</p> : null}

      {isLoading ? (
        <div className="loading-state">
          <LoadingSpinner />
          <p>Loading your stories…</p>
        </div>
      ) : null}

      {!isLoading && stories.length === 0 ? (
        <div className="empty-state">
          <h2>You haven't created any stories yet.</h2>
          <p>Start your first story draft and it will appear here.</p>
          <Link to="/stories/new" className="button button-primary">
            Create Story
          </Link>
        </div>
      ) : null}

      {!isLoading && stories.length > 0 ? (
        <div className="story-list" role="list">
          {stories.map((story) => (
            <article className="story-card" key={story.id} role="listitem">
              <div className="story-card__content">
                <div className="story-card__header">
                  <div>
                    <p className="card-pill">{story.status ?? 'draft'}</p>
                    <h2>{story.title}</h2>
                  </div>
                </div>

                <dl className="story-card__details">
                  <div>
                    <dt>Child Name</dt>
                    <dd>{story.child_name ?? '—'}</dd>
                  </div>
                  <div>
                    <dt>Child Age</dt>
                    <dd>{story.child_age ?? '—'}</dd>
                  </div>
                  <div>
                    <dt>Language</dt>
                    <dd>{story.language ?? '—'}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{story.status ?? 'draft'}</dd>
                  </div>
                  <div>
                    <dt>Created Date</dt>
                    <dd>{formatDate(story.created_at)}</dd>
                  </div>
                </dl>
              </div>

              <div className="story-card__actions">
                <Link to={`/stories/${story.id}`} className="button button-secondary">
                  Open
                </Link>
                <button type="button" className="button button-secondary" onClick={() => handlePlaceholderAction('Editing')}>
                  Edit
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => void handleDelete(story.id)}
                  disabled={deletingId === story.id}
                >
                  {deletingId === story.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </PageContainer>
  )
}
