import type { StoryRecord } from '../../types/story'

interface NarrationPanelProps {
  story: StoryRecord
}

export function NarrationPanel({
  story,
}: NarrationPanelProps) {
  const narration =
    story.learning_package?.narration

  if (!narration) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>🎙️ Narration Guide</h3>

      <p>
        <strong>Style:</strong>{' '}
        {narration.style}
      </p>

      <p>
        <strong>Voices:</strong>{' '}
        {narration.voices?.join(', ')}
      </p>

      <p>
        <strong>Sound Effects:</strong>{' '}
        {narration.soundEffects?.join(', ')}
      </p>
    </section>
  )
}