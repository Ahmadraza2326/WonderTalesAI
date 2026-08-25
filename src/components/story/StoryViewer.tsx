import { memo, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { StoryRecord } from '../../types/story'
import type { StoryNarration } from '../../types/narration'
import type { CognitiveDomain } from '../../types/experience'
import { CognitiveSkillBadge } from '../experience/CognitiveSkillBadge'
import { sfxService } from '../../services/audio/sfxService'
import { generateMemoryQuestGame } from '../../services/games/storyMemoryQuest'
import { generateWordTraceGame } from '../../services/games/wordTrace'
import { getStationRecommendationForStory } from '../../services/worldRecommendationService'

// Interactive Quest Components
import { QuizSection } from './QuizSection'
import { StoryMemoryQuest } from '../games/StoryMemoryQuest'
import { WordTraceQuest } from '../games/WordTraceQuest'
import { MysteryDetective } from '../playroom/stations/MysteryDetective'

// Supportive Story and Learning Sections
import { VocabularySection } from './VocabularySection'
import { ReadingSkillsSection } from './ReadingSkillsSection'
import { LifeSkillsSection } from './LifeSkillsSection'
import { StoryDNASection } from './StoryDNASection'
import { CriticalThinkingSection } from './CriticalThinkingSection'
import { ParentGuideSection } from './ParentGuideSection'
import { CreativeActivitySection } from './CreativeActivitySection'
import { FunFactSection } from './FunFactSection'
import { IllustrationGallery } from './IllustrationGallery'
import { NarrationPanel } from './NarrationPanel'

export type QuestTabId = 'story' | 'quiz' | 'memory' | 'word_trace' | 'mystery_detective'

export interface QuestMetadata {
  id: QuestTabId
  title: string
  emoji: string
  tagline: string
  primaryDomain: CognitiveDomain | 'reading'
  isPlayable: boolean
  unavailableReason?: string
}

interface StoryViewerProps {
  story: StoryRecord
  narration: StoryNarration | null
  mode?: 'reading' | 'learning' | 'all'
}

export const StoryViewer = memo(function StoryViewer({
  story,
  narration,
  mode = 'all',
}: StoryViewerProps) {
  const navigate = useNavigate()
  const [activeQuest, setActiveQuest] = useState<QuestTabId>('quiz')
  const [isExtraActivitiesOpen, setIsExtraActivitiesOpen] = useState(false)

  const recommendation = useMemo(() => getStationRecommendationForStory(story), [story])

  const storyText =
    story.learning_package?.story?.trim() ||
    (typeof story.story_content === 'string' ? story.story_content.trim() : '')

  // Compute activity availability from existing Story DNA synchronously
  const questConfigs: QuestMetadata[] = useMemo(() => {
    const quizSeeds = story.learning_package?.quizSeeds
    const isQuizPlayable = Boolean(
      quizSeeds && Array.isArray(quizSeeds) && quizSeeds.length > 0
    )

    const memGame = generateMemoryQuestGame(story, 'easy')
    const wordGame = generateWordTraceGame(story, 'easy')

    return [
      {
        id: 'story',
        title: 'Read Story',
        emoji: '📖',
        tagline: 'Read and listen to the magical story narrative.',
        primaryDomain: 'reading',
        isPlayable: Boolean(storyText),
        unavailableReason: 'Story narrative is not available yet.',
      },
      {
        id: 'quiz',
        title: 'Story Quiz',
        emoji: '💡',
        tagline: 'Test your understanding and comprehension!',
        primaryDomain: 'comprehension',
        isPlayable: isQuizPlayable,
        unavailableReason: 'Quiz questions not generated for this story.',
      },
      {
        id: 'memory',
        title: 'Memory Quest',
        emoji: '🧠',
        tagline: 'Recall story characters, objects, and places.',
        primaryDomain: 'memory',
        isPlayable: memGame.isPlayable,
        unavailableReason: memGame.unavailableReason,
      },
      {
        id: 'word_trace',
        title: 'Word Trace',
        emoji: '🔤',
        tagline: 'Spell story words and unlock vocabulary power.',
        primaryDomain: 'vocabulary',
        isPlayable: wordGame.isPlayable,
        unavailableReason: wordGame.unavailableReason,
      },
      {
        id: 'mystery_detective',
        title: 'Mystery Detective',
        emoji: '🔍',
        tagline: 'Solve magical whodunits, inspect clues, and catch playful culprits!',
        primaryDomain: 'logic',
        isPlayable: true,
      },
    ]
  }, [story, storyText])

  const handleSelectQuest = useCallback(
    (questId: QuestTabId) => {
      if (questId === activeQuest) return
      sfxService.play('card_flip')
      setActiveQuest(questId)
    },
    [activeQuest]
  )

  // Keyboard navigation for tablist
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = questConfigs.findIndex((q) => q.id === activeQuest)
    if (currentIndex === -1) return

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const nextIndex = (currentIndex + 1) % questConfigs.length
      handleSelectQuest(questConfigs[nextIndex].id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prevIndex =
        (currentIndex - 1 + questConfigs.length) % questConfigs.length
      handleSelectQuest(questConfigs[prevIndex].id)
    } else if (e.key === 'Home') {
      e.preventDefault()
      handleSelectQuest(questConfigs[0].id)
    } else if (e.key === 'End') {
      e.preventDefault()
      handleSelectQuest(questConfigs[questConfigs.length - 1].id)
    }
  }

  // Pure reading view mode
  if (mode === 'reading') {
    return (
      <div className="story-supportive-reading-container">
        <IllustrationGallery story={story} />
        {narration ? <NarrationPanel narration={narration} /> : null}
      </div>
    )
  }

  return (
    <div className="story-quest-hub-root" style={{ display: 'grid', gap: '1.5rem' }}>
      {/* 1. ORBis Story Quest Hub Navigational Bar */}
      <section
        className="card-panel story-quest-hub-nav"
        aria-label="Story Quest Hub Navigation"
        style={{
          padding: '1.25rem',
          borderRadius: '1.25rem',
          backgroundColor: 'var(--surface, #ffffff)',
          border: '1px solid var(--border, rgba(108, 92, 231, 0.12))',
          boxShadow: 'var(--shadow-sm, 0 4px 14px rgba(108, 92, 231, 0.05))',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-heading, #1e1b4b)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <span aria-hidden="true">🌟</span> ORBis Quest Hub
            </h3>
            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: '0.88rem',
                color: 'var(--text-muted, #6b6893)',
              }}
            >
              Choose a quest to build your brain power, practice reading, and earn rewards!
            </p>
          </div>
        </div>

        {/* Quest Tabs Grid */}
        <div
          role="tablist"
          aria-label="Story Activities and Quests"
          onKeyDown={handleKeyDown}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {questConfigs.map((quest) => {
            const isSelected = activeQuest === quest.id

            return (
              <button
                key={quest.id}
                role="tab"
                id={`tab-${quest.id}`}
                aria-controls={`panel-${quest.id}`}
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelectQuest(quest.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  padding: '0.85rem 1rem',
                  borderRadius: '1rem',
                  border: isSelected
                    ? '2px solid var(--accent, #6c5ce7)'
                    : '1.5px solid var(--border, rgba(108, 92, 231, 0.12))',
                  backgroundColor: isSelected
                    ? 'var(--surface-alt, #f8f7ff)'
                    : 'var(--surface, #ffffff)',
                  cursor: 'pointer',
                  minHeight: '44px',
                  boxShadow: isSelected
                    ? '0 4px 14px rgba(108, 92, 231, 0.15)'
                    : 'none',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  transition: 'all 160ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  outline: 'none',
                  userSelect: 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: '0.35rem',
                  }}
                >
                  <span style={{ fontSize: '1.35rem' }} aria-hidden="true">
                    {quest.emoji}
                  </span>
                  {quest.primaryDomain !== 'reading' ? (
                    <CognitiveSkillBadge domain={quest.primaryDomain} />
                  ) : null}
                </div>

                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '0.98rem',
                    color: isSelected
                      ? 'var(--accent, #6c5ce7)'
                      : 'var(--text-heading, #1e1b4b)',
                    marginBottom: '0.2rem',
                  }}
                >
                  {quest.title}
                </div>

                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted, #6b6893)',
                    lineHeight: 1.3,
                  }}
                >
                  {quest.tagline}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* 2. Active Quest View Panel */}
      <div
        id={`panel-${activeQuest}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeQuest}`}
        tabIndex={0}
        style={{ outline: 'none' }}
      >
        {activeQuest === 'story' ? (
          <section className="story-main card-panel story-reader-shell">
            <div className="story-reader-shell__hero">
              <div>
                <p className="storybook-reader__eyebrow">Reading Experience</p>
                <h3>{story.title || 'Story Narrative'}</h3>
                <p>Enjoy the story narrative in a calm, focused reading environment.</p>
              </div>
            </div>

            {storyText ? (
              <div className="story-reader-shell__story-card">
                <div className="story-content story-reader-shell__story-content">
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '1.05rem' }}>
                    {storyText}
                  </p>
                </div>
              </div>
            ) : (
              <div className="story-empty card-panel">
                <p>No story text is available yet.</p>
              </div>
            )}

            <IllustrationGallery story={story} />
            {narration ? <NarrationPanel narration={narration} /> : null}
          </section>
        ) : null}

        {activeQuest === 'quiz' ? <QuizSection story={story} /> : null}
        {activeQuest === 'memory' ? <StoryMemoryQuest story={story} /> : null}
        {activeQuest === 'word_trace' ? <WordTraceQuest story={story} /> : null}
        {activeQuest === 'mystery_detective' ? <MysteryDetective story={story} /> : null}
      </div>

      {/* 2.5. Playroom World Flagship Recommendation Card */}
      <section
        style={{
          borderRadius: '1.25rem',
          background: recommendation.bannerGradient,
          padding: '1.5rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
        aria-label="Recommended Playroom Station"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🪐</span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '4px 10px',
                borderRadius: '9999px',
              }}
            >
              Playroom World Quest Match
            </span>
          </div>

          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#fbbf24',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '4px 10px',
              borderRadius: '9999px',
            }}
          >
            {recommendation.stationEmoji} {recommendation.stationTitle}
          </span>
        </div>

        <div>
          <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc' }}>
            {recommendation.headline}
          </h3>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.5 }}>
            {recommendation.reason}
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic' }}>
            ✨ {recommendation.callToAction}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sfxService.play('star_pop')
            navigate(recommendation.route)
          }}
          style={{
            alignSelf: 'flex-start',
            padding: '0.75rem 1.4rem',
            borderRadius: '0.85rem',
            border: 'none',
            background: '#ffffff',
            color: '#1e1b4b',
            fontSize: '0.95rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            minHeight: '44px',
          }}
        >
          <span>Launch {recommendation.stationTitle}</span>
          <span style={{ fontSize: '1.1rem' }}>➔</span>
        </button>
      </section>

      {/* 3. Expandable Educational Reflections & Parent Guide Section */}
      <section
        className="card-panel"
        style={{
          borderRadius: '1.25rem',
          backgroundColor: 'var(--surface, #ffffff)',
          border: '1px solid var(--border, rgba(108, 92, 231, 0.12))',
          padding: '1rem 1.25rem',
        }}
      >
        <button
          type="button"
          onClick={() => {
            sfxService.play('card_flip')
            setIsExtraActivitiesOpen((prev) => !prev)
          }}
          aria-expanded={isExtraActivitiesOpen}
          aria-controls="additional-learning-sections"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            font: 'inherit',
            textAlign: 'left',
            minHeight: '44px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.3rem' }} aria-hidden="true">
              📚
            </span>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: 'var(--text-heading, #1e1b4b)',
                }}
              >
                Story Insights, Vocabulary & Parent Guide
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted, #6b6893)' }}>
                Life skills, critical thinking, creative prompts, and story structure.
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted, #6b6893)',
              transform: isExtraActivitiesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 180ms ease',
            }}
            aria-hidden="true"
          >
            ▼
          </span>
        </button>

        {isExtraActivitiesOpen ? (
          <div
            id="additional-learning-sections"
            style={{
              marginTop: '1.25rem',
              display: 'grid',
              gap: '1.25rem',
              borderTop: '1px solid var(--border, rgba(108, 92, 231, 0.1))',
              paddingTop: '1.25rem',
            }}
          >
            <LifeSkillsSection story={story} />
            <CriticalThinkingSection story={story} />
            <VocabularySection story={story} />
            <ReadingSkillsSection story={story} />
            <StoryDNASection story={story} />
            <ParentGuideSection story={story} />
            <CreativeActivitySection story={story} />
            <FunFactSection story={story} />
          </div>
        ) : null}
      </section>
    </div>
  )
})