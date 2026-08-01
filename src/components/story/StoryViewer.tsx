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
}

export function StoryViewer({
  story,
  narration,
}: StoryViewerProps) {
  const storyText = story.learning_package?.story?.trim()

  return (
    <section className="story-main card-panel story-reader-shell">
      <div className="story-reader-shell__hero">
        <div>
          <p className="storybook-reader__eyebrow">Reading Experience</p>
          <h3>Story Reading</h3>
          <p>Enjoy the narrative in a calm, premium layout designed for children and caregivers, with illustrations shown page by page.</p>
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
}