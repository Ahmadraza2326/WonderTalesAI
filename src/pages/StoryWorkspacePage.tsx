import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { PageContainer } from '../components/ui/PageContainer'
import { useAuth } from '../context/AuthContext'
import { storyService } from '../services/storyService'
import { testGeminiConnection } from '../services/geminiService'
import { storyOrchestrator } from '../services/StoryOrchestrator'
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

type WorkspaceTab = 'reading' | 'learning' | 'tools'

export function StoryWorkspacePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isLoading: isAuthLoading } = useAuth()

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('reading')
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

  useEffect(() => {
    async function loadStory() {
      if (isAuthLoading) {
        return
      }

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
  }, [id, navigate, user, isAuthLoading])

  const handleGenerateStoryBook = useCallback(async (force = false) => {
    if (!story || !user) return
    setIsGeneratingStoryBook(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      if (!force) {
        const cachedStoryBook = await storyAssetCacheService.getStoryBook(
          story,
          user.id
        )

        if (cachedStoryBook) {
          setStoryBook(cachedStoryBook)
          setSuccessMessage('Loaded saved StoryBook. Ready for reading!')
          return
        }
      }

      const generatedStoryBook = await generateStoryBook(story)
      await storyAssetCacheService.saveStoryBook(
        story,
        user.id,
        generatedStoryBook
      )
      setStoryBook(generatedStoryBook)
      setSuccessMessage(
        `StoryBook ${force ? 'regenerated' : 'generated'} and saved for future visits.`
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to generate StoryBook.'
      )
    } finally {
      setIsGeneratingStoryBook(false)
    }
  }, [story, user])

  const handleGenerateNarration = useCallback(async (force = false) => {
    if (!story || !user) return
    setIsGeneratingNarration(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    const storyLanguage = story.language || 'English'
    try {
      if (!force) {
        const cachedNarration = await storyAssetCacheService.getNarration(
          story,
          user.id,
          storyLanguage
        )

        if (cachedNarration) {
          setNarration(cachedNarration)
          setSuccessMessage('Loaded saved narration audio.')
          return
        }
      }

      const generatedNarration = await generateStoryNarration(story, storyLanguage)
      await storyAssetCacheService.saveNarration(
        story,
        user.id,
        generatedNarration,
        storyLanguage
      )
      setNarration(generatedNarration)
      setSuccessMessage(
        `Narration ${force ? 'regenerated' : 'generated'} and saved for future visits.`
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to generate narration audio.'
      )
    } finally {
      setIsGeneratingNarration(false)
    }
  }, [story, user])

  const handleTestOrbisAIConnection = useCallback(async () => {
    setIsTestingGemini(true)
    setGeminiError(null)
    setGeminiResult(null)
    setSuccessMessage(null)

    try {
      const responseText = await testGeminiConnection()
      setGeminiResult(responseText)
    } catch (error) {
      setGeminiError(
        error instanceof Error ? error.message : 'Unable to reach ORBIS AI server.'
      )
    } finally {
      setIsTestingGemini(false)
    }
  }, [])

  const handleGenerateLearningPackage = useCallback(async () => {
    if (!story || !user || isGeneratingLearningPackage) {
      return
    }

    setIsGeneratingLearningPackage(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const updatedStory = await storyOrchestrator.generateLearningPackage(
        story,
        user.id
      )

      setStory(updatedStory)
      setSuccessMessage(
        'Story and learning package woven successfully! Your tale is now alive.'
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to generate the story package.'
      )
      setStory(prev => (prev ? { ...prev, generation_status: 'failed' } : null))
    } finally {
      setIsGeneratingLearningPackage(false)
    }
  }, [story, user, isGeneratingLearningPackage])


  return (
    <PageContainer
      title={story?.title ?? 'ORBIS Story Studio'}
      intro="Your personalized storytelling studio, digital storybook, and learning adventure."
    >
      {/* Workspace Top Toolbar */}
      <div className="workspace-header-bar">
        <button
          type="button"
          className="button button-secondary workspace-back-btn"
          onClick={() => navigate('/stories')}
          aria-label="Back to all stories"
        >
          ← Back to Stories
        </button>

        {story ? (
          <div className="workspace-header-tags">
            <span className={`card-pill ${story.learning_package || story.generation_status === 'ready' ? 'card-pill--active' : ''}`}>
              {story.learning_package || story.generation_status === 'ready'
                ? '🌟 Story Live'
                : story.generation_status === 'failed'
                  ? '⚠️ Failed'
                  : 'Draft'}
            </span>
            {story.reading_level ? (
              <span className="card-pill card-pill--level">
                {story.reading_level}
              </span>
            ) : null}
            {story.child_name ? (
              <span className="card-pill card-pill--name">
                👤 {story.child_name} {story.child_age ? `(${story.child_age} yrs)` : ''}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Cinematic Story Studio Banner */}
      {story ? (
        <div className="workspace-hero-cover card-panel">
          <div className="hero-cover-details">
            <span className="hero-cover-badge">ORBIS Story Studio • By DINARYX</span>
            <h2 className="hero-cover-title">{story.title}</h2>
            <div className="hero-cover-meta">
              {story.theme ? <span>🏰 {story.theme}</span> : null}
              {story.moral ? <span>❤️ {story.moral}</span> : null}
              {story.language ? <span>🌐 {story.language}</span> : null}
            </div>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="form-status error" role="alert">
          ⚠️ {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="form-status success" role="status">
          ✨ {successMessage}
        </div>
      ) : null}

      {isAuthLoading || isLoading ? (
        <div className="loading-state">
          <LoadingSpinner />
          <p>Opening ORBIS story studio…</p>
        </div>
      ) : null}

      {/* Deterministic Starry Generation Loading State */}
      {isGeneratingLearningPackage ? (
        <div className="card-panel workspace-generating-card" aria-live="polite">
          <div className="generating-header">
            <span className="generating-icon" aria-hidden="true">🪐</span>
            <div>
              <h3>Orbis AI is Weaving Your Tale…</h3>
              <p>Crafting story narrative, character dialogue, quizzes, and learning package.</p>
            </div>
          </div>
          <div className="generating-steps">
            <div className="generating-step active">
              <span className="step-dot" />
              <span>1. Character & Narrative Weaving</span>
            </div>
            <div className="generating-step active">
              <span className="step-dot" />
              <span>2. Life Skills & Educational Reflections</span>
            </div>
            <div className="generating-step active">
              <span className="step-dot" />
              <span>3. Story DNA & Comprehension Quizzes</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Failed Generation State Banner with Retry CTA */}
      {!isLoading && !isGeneratingLearningPackage && story && !story.learning_package && story.generation_status === 'failed' ? (
        <div className="card-panel workspace-failed-banner" role="alert">
          <div className="failed-banner-content">
            <span className="failed-banner-icon" aria-hidden="true">⚠️</span>
            <div>
              <h3>Story Weaving Incomplete</h3>
              <p>
                The previous generation could not be completed (e.g. network timeout or service interruption). You can retry weaving your tale without losing your characters or world settings.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="button button-primary failed-retry-btn"
            onClick={handleGenerateLearningPackage}
            disabled={isGeneratingLearningPackage}
          >
            🔄 Retry Weaving Story
          </button>
        </div>
      ) : null}

      {/* Draft State CTA Banner (when story has not been generated yet and not failed) */}
      {!isLoading && !isGeneratingLearningPackage && story && !story.learning_package && story.generation_status !== 'failed' ? (
        <div className="card-panel workspace-draft-banner">
          <div className="draft-banner-content">
            <span className="draft-banner-icon" aria-hidden="true">✨</span>
            <div>
              <h3>Your Story Draft is Ready to Come Alive</h3>
              <p>
                Generate the complete story narrative, illustrated storybook, quizzes, and narration with Orbis AI.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="button button-primary draft-generate-btn"
            onClick={handleGenerateLearningPackage}
            disabled={isGeneratingLearningPackage}
          >
            ✨ Weave Story & Learning Adventure
          </button>
        </div>
      ) : null}

      {!isAuthLoading && !isLoading && !errorMessage && story ? (
        <div className="story-workspace">
          {/* Workspace Tab Navigation */}
          <nav className="workspace-tabs" aria-label="Workspace views">
            <button
              type="button"
              className={`workspace-tab-btn ${activeTab === 'reading' ? 'active' : ''}`}
              onClick={() => setActiveTab('reading')}
              aria-selected={activeTab === 'reading'}
            >
              📖 Reading & Audio
            </button>
            <button
              type="button"
              className={`workspace-tab-btn ${activeTab === 'learning' ? 'active' : ''}`}
              onClick={() => setActiveTab('learning')}
              aria-selected={activeTab === 'learning'}
            >
              💡 Learning & Quiz
            </button>
            <button
              type="button"
              className={`workspace-tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('tools')}
              aria-selected={activeTab === 'tools'}
            >
              ⚙️ Studio Tools
            </button>
          </nav>

          {/* TAB 1: READING & AUDIO */}
          {activeTab === 'reading' ? (
            <div className="workspace-tab-content">
              {/* Immersive StoryBook Reader */}
              <StoryBookViewer
                storyBook={storyBook}
                story={story}
                narration={narration}
                onExploreLearning={() => setActiveTab('learning')}
              />
            </div>
          ) : null}

          {/* TAB 2: LEARNING & QUIZ */}
          {activeTab === 'learning' ? (
            <div className="workspace-tab-content">
              {!story.learning_package ? (
                <div className="card-panel learning-prompt-card">
                  <span className="learning-prompt-card__icon" aria-hidden="true">
                    🧩
                  </span>
                  <h3>Learning Package Not Generated Yet</h3>
                  <p>
                    Generate comprehension quizzes, critical thinking challenges, life skills reflections, and Story DNA with our single-call pipeline.
                  </p>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={handleGenerateLearningPackage}
                    disabled={isGeneratingLearningPackage}
                  >
                    {isGeneratingLearningPackage
                      ? 'Generating Learning Package…'
                      : '✨ Generate Learning Package'}
                  </button>
                </div>
              ) : (
                <StoryViewer story={story} narration={narration} mode="learning" />
              )}
            </div>
          ) : null}

          {/* TAB 3: STUDIO TOOLS & METADATA */}
          {activeTab === 'tools' ? (
            <div className="workspace-tab-content workspace-tools-view">
              {/* Story Generation Actions */}
              <section className="card-panel tools-action-card" aria-labelledby="tools-heading">
                <h3 id="tools-heading">AI Story Studio Generators</h3>
                <p className="text-muted">
                  Generate or refresh AI assets for this story.
                </p>

                <div className="tools-button-grid">
                  <button
                    type="button"
                    className="button button-secondary tool-btn"
                    onClick={handleGenerateLearningPackage}
                    disabled={isGeneratingLearningPackage}
                  >
                    {isGeneratingLearningPackage ? (
                      <>
                        <span className="button-spinner" aria-hidden="true" />
                        <span>Generating Package…</span>
                      </>
                    ) : (
                      '✨ Generate Learning Package'
                    )}
                  </button>

                  <div className="tool-btn-group">
                    <button
                      type="button"
                      className="button button-secondary tool-btn"
                      onClick={() => handleGenerateStoryBook(false)}
                      disabled={isGeneratingStoryBook}
                    >
                      {isGeneratingStoryBook
                        ? 'Creating StoryBook…'
                        : storyBook
                          ? '📖 Open StoryBook'
                          : '🎨 Create StoryBook'}
                    </button>
                    <button
                      type="button"
                      className="button button-secondary tool-sub-btn"
                      onClick={() => handleGenerateStoryBook(true)}
                      disabled={isGeneratingStoryBook}
                      title="Regenerate StoryBook"
                      aria-label="Regenerate StoryBook"
                    >
                      🔄
                    </button>
                  </div>

                  <div className="tool-btn-group">
                    <button
                      type="button"
                      className="button button-secondary tool-btn"
                      onClick={() => handleGenerateNarration(false)}
                      disabled={isGeneratingNarration}
                    >
                      {isGeneratingNarration
                        ? 'Creating Narration…'
                        : narration
                          ? '🎙️ Listen Narration'
                          : '🎙️ Create Narration'}
                    </button>
                    <button
                      type="button"
                      className="button button-secondary tool-sub-btn"
                      onClick={() => handleGenerateNarration(true)}
                      disabled={isGeneratingNarration}
                      title="Regenerate Narration"
                      aria-label="Regenerate Narration"
                    >
                      🔄
                    </button>
                  </div>

                  <button
                    type="button"
                    className="button button-secondary tool-btn"
                    onClick={handleTestOrbisAIConnection}
                    disabled={isTestingGemini}
                  >
                    {isTestingGemini ? 'Checking ORBIS AI…' : '⚡ Check ORBIS AI'}
                  </button>
                </div>
              </section>

              {/* ORBIS AI Connection Status Output */}
              {geminiResult || geminiError ? (
                <div className="card-panel gemini-test-card" role="status">
                  <h4>ORBIS AI Diagnostic Output</h4>
                  {geminiResult ? <p className="success-text">{geminiResult}</p> : null}
                  {geminiError ? <p className="form-status error">{geminiError}</p> : null}
                </div>
              ) : null}

              {/* Story Metadata Details */}
              <section className="story-metadata card-panel" aria-labelledby="meta-heading">
                <h3 id="meta-heading">Story Configuration</h3>

                <dl className="story-metadata__details">
                  <div>
                    <dt>Child Name</dt>
                    <dd>{story.child_name ?? '—'}</dd>
                  </div>

                  <div>
                    <dt>Child Age</dt>
                    <dd>{story.child_age ? `${story.child_age} yrs` : '—'}</dd>
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
                    <dt>Moral Lesson</dt>
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

                  <div>
                    <dt>Last Generated</dt>
                    <dd>{formatDate(story.generated_at)}</dd>
                  </div>
                </dl>
              </section>
            </div>
          ) : null}
        </div>
      ) : null}
    </PageContainer>
  )
}
