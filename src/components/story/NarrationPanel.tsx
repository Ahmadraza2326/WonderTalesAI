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
      <section className="narration-panel card-panel">
        <div className="narration-panel__header">
          <p className="storybook-reader__eyebrow">Narration</p>
          <h3>Audio storytelling</h3>
          <p>No narration available.</p>
        </div>
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
    setCurrentSegment(value => Math.min(narration.segments.length - 1, value + 1))
  }

  return (
    <section className="narration-panel card-panel">
      <div className="narration-panel__header">
        <div>
          <p className="storybook-reader__eyebrow">Narration</p>
          <h3>Audio storytelling</h3>
          <p>Let the story come alive with gentle narration and a polished playback experience.</p>
        </div>
      </div>

      <div className="narration-panel__summary">
        <div>Language: {narration.language}</div>
        <div>{narration.segments.length} segments</div>
        <div>Current segment: {currentSegment + 1}</div>
      </div>

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

      <div className="narration-panel__segments">
        {narration.segments.map((segment, index) => (
          <article
            key={segment.id}
            className={`narration-panel__segment ${index === currentSegment ? 'is-active' : ''}`}
          >
            <div className="narration-panel__segment-head">
              <strong>Segment {index + 1}</strong>
              <span className="narration-panel__segment-badge">{segment.speaker}</span>
            </div>

            <p>{segment.text}</p>

            <small>
              {segment.duration}s • {segment.speaker}
            </small>
          </article>
        ))}
      </div>
    </section>
  )
}