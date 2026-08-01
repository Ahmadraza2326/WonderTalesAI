import type { FC } from 'react'

interface AudioPlayerProps {
  isPlaying: boolean
  currentSegment: number
  totalSegments: number
  onPlay(): void
  onPause(): void
  onStop(): void
  onPrevious(): void
  onNext(): void
}

export const AudioPlayer: FC<AudioPlayerProps> = ({
  isPlaying,
  currentSegment,
  totalSegments,
  onPlay,
  onPause,
  onStop,
  onPrevious,
  onNext,
}) => {
  return (
    <section
      style={{
        borderRadius: '20px',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e5e7eb',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxWidth: '640px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 0.35rem', color: '#0f172a' }}>
          Audio Player
        </h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
          Control the narration playback experience
        </p>
      </div>

      <div
        style={{
          textAlign: 'center',
          padding: '0.9rem 1rem',
          borderRadius: '999px',
          background: '#f8fafc',
          color: '#334155',
          fontWeight: 600,
          border: '1px solid #e2e8f0',
        }}
      >
        Segment {currentSegment} / {totalSegments}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <button type="button" className="button button-secondary" onClick={onPrevious}>
          Previous
        </button>

        <button
          type="button"
          className="button button-primary"
          onClick={isPlaying ? onPause : onPlay}
          style={{ minWidth: '140px' }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button type="button" className="button button-secondary" onClick={onNext}>
          Next
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button type="button" className="button button-secondary" onClick={onStop}>
          Stop
        </button>
      </div>
    </section>
  )
}
