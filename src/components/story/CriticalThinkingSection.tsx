import type { StoryRecord } from '../../types/story'

interface CriticalThinkingSectionProps {
  story: StoryRecord
}

export function CriticalThinkingSection({
  story,
}: CriticalThinkingSectionProps) {
  const questions =
    story.learning_package?.criticalThinking

  if (!questions || questions.length === 0) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>🧠 Critical Thinking</h3>

      {questions.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #ddd',
          }}
        >
          <h4>Question {index + 1}</h4>

          <p>{item.question}</p>
        </div>
      ))}
    </section>
  )
}