import type { StoryRecord } from '../../types/story'
import type { StoryDNA } from '../../services/ai/storyDNA'

interface StoryDNASectionProps {
  story: StoryRecord
}

export function StoryDNASection({
  story,
}: StoryDNASectionProps) {
  const dna: StoryDNA | undefined | null = story.learning_package?.storyDNA

  if (!dna) {
    return null
  }

  const formatList = (items: unknown): string => {
    if (Array.isArray(items)) {
      return items.filter(Boolean).join(', ') || '—'
    }
    if (typeof items === 'string' && items.trim()) {
      return items.trim()
    }
    return '—'
  }

  return (
    <section className="card-panel">
      <h3>🧬 Story DNA</h3>

      <p>
        <strong>Title:</strong> {dna.title || '—'}
      </p>

      <p>
        <strong>Moral:</strong> {dna.moral || '—'}
      </p>

      <p>
        <strong>Theme:</strong> {dna.theme || '—'}
      </p>

      <p>
        <strong>Characters:</strong> {formatList(dna.characters)}
      </p>

      <p>
        <strong>Locations:</strong> {formatList(dna.locations)}
      </p>
    </section>
  )
}