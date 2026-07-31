import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { PageContainer } from '../components/ui/PageContainer'
import { authService } from '../services/authService'
import { storyService } from '../services/storyService'
import { testGeminiConnection } from '../services/geminiService'
import { generateLearningPackage } from '../services/learningPackageGenerationService'
import type { StoryRecord } from '../types/story'

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

export function StoryWorkspacePage() {
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()

  const [story, setStory] = useState<StoryRecord | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [isTestingGemini, setIsTestingGemini] = useState(false)

  const [geminiResult, setGeminiResult] = useState<string | null>(null)

  const [geminiError, setGeminiError] = useState<string | null>(null)

  const [isGeneratingStory, setIsGeneratingStory] = useState(false)

  useEffect(() => {
    async function loadStory() {
      if (!id) {
        setErrorMessage('Story not found.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      setErrorMessage(null)

      const { data: authData, error: authError } =
        await authService.getUser()

      if (authError || !authData?.user) {
        setErrorMessage('Please sign in to view this story.')
        setIsLoading(false)
        return
      }

      const { data, error } =
        await storyService.getStoryById(id, authData.user.id)

      if (error || !data) {
        setErrorMessage(
          'Unable to load the requested story. Please try again.'
        )

        setIsLoading(false)

        return
      }

      setStory(data as StoryRecord)

      setIsLoading(false)
    }

    void loadStory()
  }, [id])
  async function handleTestGeminiConnection() {
  setIsTestingGemini(true)
  setGeminiError(null)
  setGeminiResult(null)

  try {
    const responseText = await testGeminiConnection()
    setGeminiResult(responseText)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to reach Gemini.'

    setGeminiError(message)
  } finally {
    setIsTestingGemini(false)
  }
}

  async function handleGenerateStory() {
  if (!story) {
    return
  }

  setIsGeneratingStory(true)

  try {
    const learningPackage = await generateLearningPackage(story)

    console.log('Learning Package:', learningPackage)

    await storyService.updateStory(story.id, {
      learning_package: learningPackage,
      generation_status: 'generated',
      generated_at: new Date().toISOString(),
    })

    setStory({
      ...story,
      learning_package: learningPackage,
      generation_status: 'generated',
      generated_at: new Date().toISOString(),
    })

    alert('Learning Package generated successfully.')
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : 'Failed to generate Learning Package.'
    )
  } finally {
    setIsGeneratingStory(false)
  }
}

  return (
    <PageContainer
      title="Story Workspace"
      intro="View your story metadata and generated story content."
    >
      {errorMessage ? (
        <p className="form-status error">
          {errorMessage}
        </p>
      ) : null}

      {isLoading ? (
        <div className="loading-state">
          <LoadingSpinner />

          <p>Loading story details…</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && story ? (
        <div className="story-workspace">

          <section className="story-metadata card-panel">

            <div className="story-metadata__header">

              <h2>{story.title}</h2>

              <p className="card-pill">
                {story.status ?? 'draft'}
              </p>

            </div>

            <dl className="story-metadata__details">

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
                <dt>Theme</dt>
                <dd>{story.theme ?? '—'}</dd>
              </div>

              <div>
                <dt>Moral</dt>
                <dd>{story.moral ?? '—'}</dd>
              </div>

              <div>
                <dt>Characters</dt>
                <dd>{story.characters ?? '—'}</dd>
              </div>

              <div>
                <dt>Story Length</dt>
                <dd>{story.story_length ?? '—'}</dd>
              </div>

              <div>
                <dt>Reading Level</dt>
                <dd>{story.reading_level ?? '—'}</dd>
              </div>

              <div>
                <dt>Created Date</dt>
                <dd>{formatDate(story.created_at)}</dd>
              </div>

            </dl>

          </section>

          <section className="story-main card-panel">

            <div className="story-main__header">

              <h3>Story</h3>

              <div className="story-main__actions">

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleGenerateStory}
                  disabled={isGeneratingStory}
                >
                  {isGeneratingStory
                    ? 'Generating Learning Package...'
                    : 'Generate Learning Package'}
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  disabled
                >
                  Edit Story
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleTestGeminiConnection}
                  disabled={isTestingGemini}
                >
                  {isTestingGemini
                    ? 'Testing Gemini...'
                    : 'Test Gemini Connection'}
                </button>

                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => navigate('/stories')}
                >
                  Back to My Stories
                </button>

              </div>

            </div>

            {story.story_content ? (
              <div className="story-content">
                <p>{story.story_content}</p>
              </div>
            ) : (
              <div className="story-empty card-panel">
                <p>No AI story has been generated yet.</p>
              </div>
            )}

            <div
              className="card-panel"
              style={{ marginTop: '1rem' }}
            >
              <h4>Gemini Connection Test</h4>

              {isTestingGemini ? (
                <p>Waiting for Gemini response…</p>
              ) : null}

              {geminiResult ? (
                <p>{geminiResult}</p>
              ) : null}

              {geminiError ? (
                <p className="form-status error">
                  {geminiError}
                </p>
              ) : null}
            </div>

          </section>

          <section className="story-placeholders">

            <div className="placeholder-card card-panel">
              <h3>Illustrations</h3>
              <p>Coming Soon</p>
            </div>

            <div className="placeholder-card card-panel">
              <h3>Narration</h3>
              <p>Coming Soon</p>
            </div>

          </section>

        </div>
      ) : null}
    </PageContainer>
  )
}
