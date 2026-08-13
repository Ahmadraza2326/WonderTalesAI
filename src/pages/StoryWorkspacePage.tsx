import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { PageContainer } from '../components/ui/PageContainer'
import { useAuth } from '../context/AuthContext'
import { storyService } from '../services/storyService'
import { testGeminiConnection } from '../services/geminiService'
import { generateStory } from '../services/storyGenerationService'
import { generateLearningPackage } from '../services/learningPackageGenerationService'
import { generateStoryBook } from '../services/storybookGenerator'
import { generateStoryNarration } from '../services/ai/narrationGenerationService'
import { storyAssetCacheService } from '../services/storyAssetCacheService'
import type { StoryRecord } from '../types/story'
import type { StoryNarration } from '../types/narration'
import type { StoryBook } from '../types/storybook'
import { StoryViewer } from '../components/story/StoryViewer'
import { StoryBookViewer } from '../components/story/StoryBookViewer'

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
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [story, setStory] = useState<StoryRecord | null>(null)
  const [storyBook, setStoryBook] = useState<StoryBook | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTestingGemini, setIsTestingGemini] = useState(false)
  const [isGeneratingLearningPackage, setIsGeneratingLearningPackage] =
    useState(false)
  const [isGeneratingStoryBook, setIsGeneratingStoryBook] = useState(false)
  const [isGeneratingNarration, setIsGeneratingNarration] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [geminiResult, setGeminiResult] = useState<string | null>(null)
  const [geminiError, setGeminiError] = useState<string | null>(null)
  const [narration, setNarration] = useState<StoryNarration | null>(null)
  const [, setShowStoryBookMenu] = useState(false)
  const [, setShowNarrationMenu] = useState(false)

  // ... (inside component)
  // Close menus when clicking elsewhere
  useEffect(() => {
    function handleClickOutside() {
      setShowStoryBookMenu(false)
      setShowNarrationMenu(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    async function loadStory() {
      if (!id) {
        setErrorMessage('Story ID is missing from the URL.')
        setIsLoading(false)
        return
      }

      if (!user) {
        setErrorMessage('You must be signed in to view this story.')
        navigate('/auth')
        return
      }

      setIsLoading(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      try {
        const { data, error } = await storyService.getStoryById(id, user.id)

        if (error) {
          throw error
        }

        if (!data) {
          setErrorMessage('Story not found.')
          return
        }

        const storyData = data as StoryRecord
        setStory(storyData)

        try {
          const [cachedStoryBook, cachedNarration] = await Promise.all([
            storyAssetCacheService.getStoryBook(storyData, user.id),
            storyAssetCacheService.getNarration(storyData, user.id),
          ])

          setStoryBook(cachedStoryBook)
          setNarration(cachedNarration)
        } catch (assetError) {
          console.error('Unable to load saved story assets:', assetError)
        }

      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load the story from the workspace.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadStory()
  }, [id, navigate, user])

  async function handleGenerateStoryBook(force = false) {
    if (!story || !user) return
    setIsGeneratingStoryBook(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      if (!force) {
        const cachedStoryBook = await storyAssetCacheService.getStoryBook(story, user.id)

        if (cachedStoryBook) {
          setStoryBook(cachedStoryBook)
          setSuccessMessage('Loaded your saved StoryBook. No images were regenerated.')
          return
        }
      }

      const generatedStoryBook = await generateStoryBook(story)
      await storyAssetCacheService.saveStoryBook(story, user.id, generatedStoryBook)
      setStoryBook(generatedStoryBook)
      setSuccessMessage(`StoryBook ${force ? 'regenerated' : 'generated'} and saved for future visits.`)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to generate StoryBook.'
      )
    } finally {
      setIsGeneratingStoryBook(false)
    }
  }

  async function handleGenerateNarration(force = false) {
    if (!story || !user) return
    setIsGeneratingNarration(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      if (!force) {
        const cachedNarration = await storyAssetCacheService.getNarration(story, user.id)

        if (cachedNarration) {
          setNarration(cachedNarration)
          setSuccessMessage('Loaded your saved narration. No narration was regenerated.')
          return
        }
      }

      const generatedNarration = await generateStoryNarration(story)
      await storyAssetCacheService.saveNarration(story, user.id, generatedNarration)
      setNarration(generatedNarration)
      setSuccessMessage(`Narration ${force ? 'regenerated' : 'generated'} and saved for future visits.`)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to generate narration.'
      )
    } finally {
      setIsGeneratingNarration(false)
    }
  }

  async function handleTestGeminiConnection() {
    setIsTestingGemini(true)
    setGeminiError(null)
    setGeminiResult(null)
    setSuccessMessage(null)

    try {
      const responseText = await testGeminiConnection()
      setGeminiResult(responseText)
    } catch (error) {
      setGeminiError(
        error instanceof Error
          ? error.message
          : 'Unable to reach Gemini.'
      )
    } finally {
      setIsTestingGemini(false)
    }
  }

async function handleGenerateLearningPackage() {
  if (!story || !user) {
    return
  }

  setIsGeneratingLearningPackage(true)
  setErrorMessage(null)
  setSuccessMessage(null)

  try {
    const generatedStory = await generateStory(story)
    const learningPackage = await generateLearningPackage(story)
    const generatedAt = new Date().toISOString()

    const { error } = await storyService.updateStory(story.id, user.id, {
      story_content: generatedStory,
      learning_package: learningPackage as any,
      generation_status: 'generated',
      generated_at: generatedAt,
    })

    if (error) {
      throw error
    }

    const updatedStory: StoryRecord = {
      ...story,
      story_content: generatedStory,
      learning_package: learningPackage,
      generation_status: 'generated',
      generated_at: generatedAt,
    }

    setStory(updatedStory)

    setSuccessMessage('Story and learning package generated successfully.')
  } catch (error) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : 'Failed to generate and save the Learning Package.'
    )
  } finally {
    setIsGeneratingLearningPackage(false)
  }
}


  return (
    <PageContainer
      title="Story Workspace"
      intro="View your story metadata and generated story content."
    >
      {errorMessage ? (
        <p className="form-status error">{errorMessage}</p>
      ) : null}

      {successMessage ? (
        <p className="form-status success">{successMessage}</p>
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
              <p className="card-pill">{story.status ?? 'draft'}</p>
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
                <dt>Generation Status</dt>
                <dd>{story.generation_status ?? 'pending'}</dd>
              </div>

              <div>
                <dt>Generated At</dt>
                <dd>{formatDate(story.generated_at)}</dd>
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
                  onClick={handleGenerateLearningPackage}
                  disabled={isGeneratingLearningPackage}
                >
                  {isGeneratingLearningPackage
                    ? 'Generating Learning Package...'
                    : 'Generate Learning Package'}
                </button>

                <div className="action-group" style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => handleGenerateStoryBook(false)}
                    disabled={isGeneratingStoryBook}
                  >
                    {isGeneratingStoryBook
                      ? 'Processing...'
                      : storyBook
                      ? 'Open StoryBook'
                      : 'Create StoryBook'}
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => handleGenerateStoryBook(true)}
                    disabled={isGeneratingStoryBook}
                    title="Regenerate StoryBook"
                  >
                    …
                  </button>
                </div>

                <div className="action-group" style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => handleGenerateNarration(false)}
                    disabled={isGeneratingNarration}
                  >
                    {isGeneratingNarration
                      ? 'Processing...'
                      : narration
                      ? 'Listen to Story'
                      : 'Create Narration'}
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => handleGenerateNarration(true)}
                    disabled={isGeneratingNarration}
                    title="Regenerate Narration"
                  >
                    …
                  </button>
                </div>

                <button type="button" className="button button-secondary" disabled>
                  Edit Story
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleTestGeminiConnection}
                  disabled={isTestingGemini}
                >
                  {isTestingGemini ? 'Testing Gemini...' : 'Test Gemini Connection'}
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

            <StoryViewer story={story} narration={narration} />
            {story && storyBook ? (
              <StoryBookViewer storyBook={storyBook} />
            ) : null}

            <div className="card-panel" style={{ marginTop: '1rem' }}>
              <h4>Gemini Connection Test</h4>
              {isTestingGemini ? <p>Waiting for Gemini response…</p> : null}
              {geminiResult ? <p>{geminiResult}</p> : null}
              {geminiError ? (
                <p className="form-status error">{geminiError}</p>
              ) : null}
            </div>
          </section>

          <section className="story-placeholders">
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
