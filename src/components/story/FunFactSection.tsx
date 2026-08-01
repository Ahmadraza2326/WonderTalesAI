import type { StoryRecord } from '../../types/story'

interface FunFactSectionProps {
  story: StoryRecord
}

export function FunFactSection({
  story,
}: FunFactSectionProps) {
  const funFact = story.learning_package?.funFact

  if (!funFact) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>🎉 Fun Fact</h3>

      <h4>{funFact.title}</h4>

      <p>{funFact.fact}</p>
    </section>
  )
}