import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { PageContainer } from '../components/ui/PageContainer'
import { authService } from '../services/authService'
import { storyService } from '../services/storyService'
import { testGeminiConnection } from '../services/geminiService'
import { generateLearningPackage } from '../services/learningPackageGenerationService'
import type { StoryRecord } from '../types/story'
import { VocabularySection } from '../components/story/VocabularySection'
import { ReadingSkillsSection } from '../components/story/ReadingSkillsSection'
import { LifeSkillsSection } from '../components/story/LifeSkillsSection'
import { StoryDNASection } from '../components/story/StoryDNASection'

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

            <VocabularySection story={story} />

<ReadingSkillsSection story={story} />

<LifeSkillsSection story={story} />

<StoryDNASection story={story} />
            
            {story.learning_package?.vocabulary?.length ? (
  <div className="card-panel" style={{ marginTop: '1.5rem' }}>
    <h3>📖 Vocabulary</h3>

    {story.learning_package.vocabulary.map(
      (item: any, index: number) => (
        <div
          key={index}
          style={{
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #ddd',
          }}
        >
          <h4>{item.word}</h4>

          <p>
            <strong>Meaning:</strong> {item.meaning}
          </p>

          <p>
            <strong>Difficulty:</strong> {item.difficulty}
          </p>

          <p>
            <strong>Example:</strong> {item.example}
          </p>

          <p>
            <strong>Synonym:</strong> {item.synonym}
          </p>
        </div>
      )
    )}
  </div>
) : null}

{story.learning_package?.readingSkills?.length ? (
  <div className="card-panel" style={{ marginTop: '1.5rem' }}>
    <h3>📚 Reading Skills</h3>

    {story.learning_package.readingSkills.map(
      (skill: any, index: number) => (
        <div
          key={index}
          style={{
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #ddd',
          }}
        >
          <h4>{skill.skill}</h4>

          <p>{skill.explanation}</p>
        </div>
      )
    )}
  </div>
) : null}

{story.learning_package?.lifeSkills?.length ? (
  <div className="card-panel" style={{ marginTop: '1.5rem' }}>
    <h3>❤️ Life Skills</h3>

    {story.learning_package.lifeSkills.map(
      (skill: any, index: number) => (
        <div
          key={index}
          style={{
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #ddd',
          }}
        >
          <h4>{skill.skill}</h4>

          <p>{skill.explanation}</p>
        </div>
      )
    )}
  </div>
) : null}


{story.learning_package?.criticalThinking?.length ? (
  <div className="card-panel" style={{ marginTop: '1.5rem' }}>
    <h3>🧠 Critical Thinking</h3>

    {story.learning_package.criticalThinking.map(
      (item: any, index: number) => (
        <div
          key={index}
          style={{
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #ddd',
          }}
        >
          <p>
            <strong>Question {index + 1}:</strong> {item.question}
          </p>
        </div>
      )
    )}
  </div>
) : null}


{story.learning_package?.quizSeeds?.length ? (
  <div className="card-panel" style={{ marginTop: '1.5rem' }}>
    <h3>❓ Quiz</h3>

    {story.learning_package.quizSeeds.map(
      (quiz: any, index: number) => (
        <div
          key={index}
          style={{
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #ddd',
          }}
        >
          <h4>Question {index + 1}</h4>

          <p>{quiz.question}</p>

          <ul>
            {quiz.options?.map((option: string, optionIndex: number) => (
              <li key={optionIndex}>{option}</li>
            ))}
          </ul>

          <p>
            <strong>Answer:</strong> {quiz.answer}
          </p>

          <p>
            <strong>Explanation:</strong> {quiz.explanation}
          </p>
        </div>
      )
    )}
  </div>
) : null}



{story.learning_package?.creativeActivity ? (
  <div className="card-panel" style={{ marginTop: '1.5rem' }}>
    <h3>🎨 Creative Activity</h3>

    <h4>{story.learning_package.creativeActivity.title}</h4>

    <p>{story.learning_package.creativeActivity.instructions}</p>
  </div>
) : null}


{story.learning_package?.funFact ? (
  <div className="card-panel" style={{ marginTop: '1.5rem' }}>
    <h3>💡 Fun Fact</h3>

    <h4>{story.learning_package.funFact.title}</h4>

    <p>{story.learning_package.funFact.fact}</p>
  </div>
) : null}


{story.learning_package?.parentGuide ? (
  <div className="card-panel" style={{ marginTop: '1.5rem' }}>
    <h3>👨‍👩‍👧 Parent Guide</h3>

    <h4>Discussion Questions</h4>

    <ul>
      {story.learning_package.parentGuide.discussionQuestions?.map(
        (question: string, index: number) => (
          <li key={index}>{question}</li>
        )
      )}
    </ul>

    <h4>Real Life Activity</h4>

    <p>{story.learning_package.parentGuide.realLifeActivity}</p>
  </div>
) : null}


{story.learning_package?.storyDNA ? (
  <div className="card-panel" style={{ marginTop: '1.5rem' }}>
    <h3>🧬 Story DNA</h3>

    <p>
      <strong>Title:</strong>{' '}
      {story.learning_package.storyDNA.title}
    </p>

    <p>
      <strong>Theme:</strong>{' '}
      {story.learning_package.storyDNA.theme}
    </p>

    <p>
      <strong>Moral:</strong>{' '}
      {story.learning_package.storyDNA.moral}
    </p>

    <h4>Characters</h4>

    <ul>
      {story.learning_package.storyDNA.characters?.map(
        (character: string, index: number) => (
          <li key={index}>{character}</li>
        )
      )}
    </ul>

    <h4>Locations</h4>

    <ul>
      {story.learning_package.storyDNA.locations?.map(
        (location: string, index: number) => (
          <li key={index}>{location}</li>
        )
      )}
    </ul>

    
   

  </div>
) : null}


{story.learning_package?.illustrations?.length ? (
  <div className="card-panel" style={{ marginTop: '1.5rem' }}>
    <h3>🎨 Illustration Gallery</h3>

    {story.learning_package.illustrations.map(
      (illustration: any, index: number) => (
        <div
          key={index}
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '10px',
          }}
        >
          <h4>Scene {illustration.scene}</h4>

          <p>{illustration.prompt}</p>

          <button
            type="button"
            className="button button-secondary"
            disabled
          >
            Generate Image (Coming Soon)
          </button>
        </div>
      )
    )}
  </div>
) : null}



{story.learning_package?.narration ? (
  <div className="card-panel" style={{ marginTop: '1.5rem' }}>
    <h3>🎙 Narration</h3>

    <p>
      <strong>Style:</strong>{" "}
      {story.learning_package.narration.style}
    </p>

    <h4>Voices</h4>

    <ul>
      {story.learning_package.narration.voices?.map(
        (voice: string, index: number) => (
          <li key={index}>{voice}</li>
        )
      )}
    </ul>

    <h4>Sound Effects</h4>

    <ul>
      {story.learning_package.narration.soundEffects?.map(
        (effect: string, index: number) => (
          <li key={index}>{effect}</li>
        )
      )}
    </ul>

    <button
      type="button"
      className="button button-secondary"
      disabled
    >
      Generate Narration (Coming Soon)
    </button>
  </div>
) : null}





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
