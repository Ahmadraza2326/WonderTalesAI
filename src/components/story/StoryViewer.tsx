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
  return (
    <section className="story-main card-panel">
      <div className="story-main__header">
        <h3>Story</h3>
      </div>

      {story.learning_package?.story ? (
  <div className="story-content">
    <p>{story.learning_package.story}</p>
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

      <CriticalThinkingSection story={story} />

      <QuizSection story={story} />

      <ParentGuideSection story={story} />

      <CreativeActivitySection story={story} />
      
      <FunFactSection story={story} />
    

    <IllustrationGallery story={story} />
      
      <NarrationPanel narration={narration} />
    </section>
  )
}