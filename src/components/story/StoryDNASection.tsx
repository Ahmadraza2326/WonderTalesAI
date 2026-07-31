import type { StoryRecord } from '../../types/story'

interface StoryDNASectionProps {
  story: StoryRecord
}

export function StoryDNASection({
  story,
}: StoryDNASectionProps) {
  const dna = story.learning_package?.storyDNA

  if (!dna) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>🧬 Story DNA</h3>

      <p>
        <strong>Title:</strong> {dna.title}
      </p>

      <p>
        <strong>Moral:</strong> {dna.moral}
      </p>

      <p>
        <strong>Theme:</strong> {dna.theme}
      </p>

      <p>
        <strong>Characters:</strong>{' '}
        {dna.characters.join(', ')}
      </p>

      <p>
        <strong>Locations:</strong>{' '}
        {dna.locations.join(', ')}
      </p>
    </section>
  )
}