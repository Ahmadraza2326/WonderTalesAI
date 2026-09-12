import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { PageContainer } from '../components/ui/PageContainer'
import { StickyBackButton } from '../components/layout/StickyBackButton'
import { useAuth } from '../context/AuthContext'
import { storyService } from '../services/storyService'
import { storyOrchestrator } from '../services/StoryOrchestrator'
import { generateStoryBook } from '../services/storybookGenerator'
import { generateStoryNarration } from '../services/ai/narrationGenerationService'
import { storyAssetCacheService } from '../services/storyAssetCacheService'
import { economyService } from '../services/economyService'
import type { StoryRecord } from '../types/story'
import type { StoryNarration } from '../types/narration'
import type { StoryBook } from '../types/storybook'
import { StoryViewer } from '../components/story/StoryViewer'
import { StoryBookViewer } from '../components/story/StoryBookViewer'

type WorkspaceTab = 'reading' | 'learning'

export function StoryWorkspacePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isLoading: isAuthLoading } = useAuth()

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('reading')
  const [story, setStory] = useState<StoryRecord | null>(null)
  const [storyBook, setStoryBook] = useState<StoryBook | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingLearningPackage, setIsGeneratingLearningPackage] =
    useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
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

        // Award +50 XP and +10 Stars for story reading completion
        if (storyData.child_id) {
          economyService
            .completeActivity({
              childId: storyData.child_id,
              activityType: 'story_completion',
              activityId: `read_${storyData.id}`,
              xpAmount: 50,
              starsAmount: 10,
            })
            .catch((err) => console.warn('Non-blocking story reading XP reward error:', err))
        }

        try {
          let [cachedStoryBook, cachedNarration] = await Promise.all([
            storyAssetCacheService.getStoryBook(storyData, user.id),
            storyAssetCacheService.getNarration(storyData, user.id),
          ])

          if (!cachedStoryBook) {
            cachedStoryBook = await generateStoryBook(storyData)
            await storyAssetCacheService.saveStoryBook(storyData, user.id, cachedStoryBook)
          }

          if (!cachedNarration) {
            cachedNarration = await generateStoryNarration(storyData, storyData.language || 'English')
            await storyAssetCacheService.saveNarration(
              storyData,
              user.id,
              cachedNarration,
              storyData.language || 'English'
            )
          }

          setStoryBook(cachedStoryBook)
          setNarration(cachedNarration)
        } catch {
          // Fallback if background assets are unavailable
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load story.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadStory()
  }, [id, user, isAuthLoading, navigate])

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
      setStory((prev) => (prev ? { ...prev, generation_status: 'failed' } : null))
    } finally {
      setIsGeneratingLearningPackage(false)
    }
  }, [story, user, isGeneratingLearningPackage])

  return (
    <PageContainer
      title={story?.title ?? 'ORBIS Story Studio'}
      intro="Your personalized storytelling studio, digital storybook, and learning adventure."
    >
      <StickyBackButton fallbackTo="/stories" label="Stories Library" />
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
            <span
              className={`card-pill ${story.learning_package || story.generation_status === 'ready' ? 'card-pill--active' : ''}`}
            >
              {story.learning_package || story.generation_status === 'ready'
                ? 'Story Live'
                : story.generation_status === 'failed'
                  ? 'Failed'
                  : 'Draft'}
            </span>
            {story.reading_level ? (
              <span className="card-pill card-pill--level">
                {story.reading_level}
              </span>
            ) : null}
            {story.child_name ? (
              <span className="card-pill card-pill--name">
                {story.child_name} {story.child_age ? `(${story.child_age} yrs)` : ''}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Cinematic Story Studio Banner */}
      {story ? (
        <div className="workspace-hero-cover card-panel">
          <div className="hero-cover-details">
            <span className="hero-cover-badge">ORBIS Story Studio</span>
            <h2 className="hero-cover-title">{story.title}</h2>
            <div className="hero-cover-meta">
              {story.theme ? <span>{story.theme}</span> : null}
              {story.moral ? <span>• {story.moral}</span> : null}
              {story.language ? <span>• {story.language}</span> : null}
            </div>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="form-status error" role="alert">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="form-status success" role="status">
          {successMessage}
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
            <div>
              <h3>Story Weaving Incomplete</h3>
              <p>
                The previous generation could not be completed. You can retry weaving your tale without losing your characters or world settings.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="button button-primary failed-retry-btn"
            onClick={handleGenerateLearningPackage}
            disabled={isGeneratingLearningPackage}
          >
            Retry Weaving Story
          </button>
        </div>
      ) : null}

      {/* Draft State CTA Banner */}
      {!isLoading && !isGeneratingLearningPackage && story && !story.learning_package && story.generation_status !== 'failed' ? (
        <div className="card-panel workspace-draft-banner">
          <div className="draft-banner-content">
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
            Weave Story & Learning Adventure
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
              Reading & Audio
            </button>
            <button
              type="button"
              className={`workspace-tab-btn ${activeTab === 'learning' ? 'active' : ''}`}
              onClick={() => setActiveTab('learning')}
              aria-selected={activeTab === 'learning'}
            >
              Learning & Quiz
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
                onBackToLibrary={() => navigate('/library')}
              />
            </div>
          ) : null}

          {/* TAB 2: LEARNING & QUIZ */}
          {activeTab === 'learning' ? (
            <div className="workspace-tab-content">
              {!story.learning_package ? (
                <div className="card-panel learning-prompt-card">
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
                      : 'Generate Learning Package'}
                  </button>
                </div>
              ) : (
                <StoryViewer story={story} narration={narration} mode="learning" />
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </PageContainer>
  )
}
