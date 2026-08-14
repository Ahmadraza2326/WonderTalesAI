import { memo } from 'react'
import type { StoryRecord } from '../../types/story'
import type { StoryNarration } from '../../types/narration'
import { VocabularySection } from './VocabularySection'
import { ReadingSkillsSection } from './ReadingSkillsSection'
import { LifeSkillsSection } from './LifeSkillsSection'
import { StoryDNASection } from './StoryDNASection'
import { CriticalThinkingSection } from './CriticalThinkingSection'
import { QuizSection } from './QuizSection'
import { ParentGuideSection } from './ParentGuideSection'
import { CreativeActivitySection } from './CreativeActivitySection'
import { FunFactSection } from './FunFactSection'
import { IllustrationGallery } from './IllustrationGallery'
import { NarrationPanel } from './NarrationPanel'

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
  const storyText = story.learning_package?.story?.trim()

  if (mode === 'reading') {
    return (
      <section className="story-main card-panel story-reader-shell">
        <div className="story-reader-shell__hero">
          <div>
            <p className="storybook-reader__eyebrow">Story Narrative</p>
            <h3>Full Tale Reading</h3>
            <p>
              Enjoy the narrative in a calm layout with warm storybook typography.
            </p>
          </div>
        </div>

        {storyText ? (
          <div className="story-reader-shell__story-card">
            <div className="story-content story-reader-shell__story-content">
              <p>{storyText}</p>
            </div>
          </div>
        ) : (
          <div className="story-empty card-panel">
            <p>No story narrative has been generated yet.</p>
          </div>
        )}

        <NarrationPanel narration={narration} />
        <IllustrationGallery story={story} />
      </section>
    )
  }

  if (mode === 'learning') {
    return (
      <div className="learning-package-shell">
        <QuizSection story={story} />
        <LifeSkillsSection story={story} />
        <CriticalThinkingSection story={story} />
        <StoryDNASection story={story} />
        <VocabularySection story={story} />
        <ReadingSkillsSection story={story} />
        <ParentGuideSection story={story} />
        <CreativeActivitySection story={story} />
        <FunFactSection story={story} />
      </div>
    )
  }

  // mode === 'all'
  return (
    <section className="story-main card-panel story-reader-shell">
      <div className="story-reader-shell__hero">
        <div>
          <p className="storybook-reader__eyebrow">Reading Experience</p>
          <h3>Story Reading</h3>
          <p>Enjoy the narrative in a calm, premium layout designed for children and caregivers.</p>
        </div>
      </div>

      {storyText ? (
        <div className="story-reader-shell__story-card">
          <div className="story-content story-reader-shell__story-content">
            <p>{storyText}</p>
          </div>
        </div>
      ) : (
        <div className="story-empty card-panel">
          <p>No AI story has been generated yet.</p>
        </div>
      )}

      <div className="story-reader-shell__sections">
        <VocabularySection story={story} />
        <ReadingSkillsSection story={story} />
        <LifeSkillsSection story={story} />
        <StoryDNASection story={story} />
        <CriticalThinkingSection story={story} />
        <QuizSection story={story} />
        <ParentGuideSection story={story} />
        <CreativeActivitySection story={story} />
        <FunFactSection story={story} />
        <IllustrationGallery story={story} />
      </div>

      <NarrationPanel narration={narration} />
    </section>
  )
})