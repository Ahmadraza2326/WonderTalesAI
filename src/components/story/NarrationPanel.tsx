import { useMemo, useState } from 'react'
import { AudioPlayer } from './AudioPlayer'
import { AudioController } from '../../services/audio/audioController'
import type { StoryNarration } from '../../types/narration'

interface NarrationPanelProps {
  narration: StoryNarration | null
}

export function NarrationPanel({
  narration,
}: NarrationPanelProps) {
  const [currentSegment, setCurrentSegment] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const controller = useMemo(() => new AudioController(), [])

  if (!narration) {
    return (
      <section className="card-panel">
        <h3>🎙️ Narration</h3>
        <p>No narration available.</p>
      </section>
    )
  }

  const handlePlay = () => {
    const audioUrl = narration.segments[currentSegment]?.audioUrl

    if (audioUrl) {
      controller.play(audioUrl)
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    controller.pause()
    setIsPlaying(false)
  }

  const handleStop = () => {
    controller.stop()
    setIsPlaying(false)
  }

  const handlePrevious = () => {
    setCurrentSegment(value => Math.max(0, value - 1))
  }

  const handleNext = () => {
    setCurrentSegment(value =>
      Math.min(narration.segments.length - 1, value + 1)
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

      <div style={{ marginBottom: '1.5rem' }}>
        <AudioPlayer
          isPlaying={isPlaying}
          currentSegment={currentSegment + 1}
          totalSegments={narration.segments.length}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>

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