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
  const isPreviousDisabled = currentSegment <= 1
  const isNextDisabled = currentSegment >= totalSegments

  return (
    <section className="audio-player">
      <div className="audio-player__headline">
        <h3>Audio Player</h3>
        <p>Control the narration playback experience with a gentle, focused layout.</p>
      </div>

      <div className="audio-player__status" aria-live="polite">
        <span className={`audio-player__status-dot ${isPlaying ? 'is-playing' : ''}`} />
        <span>{isPlaying ? 'Playing now' : 'Ready to play'}</span>
      </div>

      <div className="audio-player__counter">
        Segment {currentSegment} / {totalSegments}
      </div>

      <div className="audio-player__controls">
        <button
          type="button"
          className="button button-secondary"
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          aria-label="Play previous segment"
        >
          Previous
        </button>

        <button
          type="button"
          className="button button-primary"
          onClick={isPlaying ? onPause : onPlay}
          aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          type="button"
          className="button button-secondary"
          onClick={onNext}
          disabled={isNextDisabled}
          aria-label="Play next segment"
        >
          Next
        </button>
      </div>

      <div className="audio-player__footer">
        <button type="button" className="button button-secondary" onClick={onStop}>
          Stop
        </button>
      </div>
    </section>
  )
}
