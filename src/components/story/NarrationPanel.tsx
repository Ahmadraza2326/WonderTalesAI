import type { StoryNarration } from '../../types/narration'

interface NarrationPanelProps {
  narration: StoryNarration | null
}

export function NarrationPanel({
  narration,
}: NarrationPanelProps) {
  if (!narration) {
    return (
      <section className="card-panel">
        <h3>🎙️ Narration</h3>
        <p>No narration available.</p>
      </section>
    )
  }

  return (
    <section className="card-panel">
      <h3>🎙️ Narration</h3>

      <p>
        <strong>Language:</strong>{' '}
        {narration.language}
      </p>

      <p>
        <strong>Total Segments:</strong>{' '}
        {narration.segments.length}
      </p>

      <button
        className="button button-primary"
        disabled
        style={{ marginBottom: '1.5rem' }}
      >
        ▶ Play (Coming Soon)
      </button>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {narration.segments.map(segment => (
          <div
            key={segment.id}
            style={{
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
            }}
          >
            <strong>
              Segment {segment.id}
            </strong>

            <p
              style={{
                marginTop: '.5rem',
                marginBottom: '.5rem',
              }}
            >
              {segment.text}
            </p>

            <small>
              Speaker: {segment.speaker}
              {' • '}
              {segment.duration}s
            </small>
          </div>
        ))}
      </div>
    </section>
  )
}