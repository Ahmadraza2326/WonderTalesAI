import type { StoryRecord } from '../../types/story'

interface ParentGuideSectionProps {
  story: StoryRecord
}

export function ParentGuideSection({
  story,
}: ParentGuideSectionProps) {
  const guide = story.learning_package?.parentGuide

  if (!guide) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>👨‍👩‍👧 Parent Guide</h3>

      <h4>Discussion Questions</h4>

      <ul>
        {guide.discussionQuestions?.map(
          (question: string, index: number) => (
            <li key={index}>{question}</li>
          )
        )}
      </ul>

      <h4>Real Life Activity</h4>

      <p>{guide.realLifeActivity}</p>
    </section>
  )
}