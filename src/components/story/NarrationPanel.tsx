import { memo, useEffect, useRef, useState } from 'react'
import { AudioPlayer } from './AudioPlayer'
import { AudioController } from '../../services/audio/audioController'
import type { StoryNarration } from '../../types/narration'

interface NarrationPanelProps {
  narration: StoryNarration | null
}

export const NarrationPanel = memo(function NarrationPanel({
  narration,
}: NarrationPanelProps) {
  const [currentSegment, setCurrentSegment] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  const controllerRef = useRef<AudioController | null>(null)
  if (!controllerRef.current) {
    controllerRef.current = new AudioController()
  }
  const controller = controllerRef.current

  const currentSegmentRef = useRef(currentSegment)
  currentSegmentRef.current = currentSegment

  const narrationRef = useRef(narration)
  narrationRef.current = narration

  const isPlayingRef = useRef(isPlaying)
  isPlayingRef.current = isPlaying

  // Configure controller callbacks
  useEffect(() => {
    controller.setOptions({
      onPlayStateChange: (playing) => {
        setIsPlaying(playing)
      },
      onError: (err) => {
        setIsPlaying(false)
        setAudioError(err.message)
      },
      onEnded: () => {
        const segIndex = currentSegmentRef.current
        const narr = narrationRef.current
        if (narr && segIndex + 1 < narr.segments.length) {
          const nextIndex = segIndex + 1
          setCurrentSegment(nextIndex)
          const nextSegment = narr.segments[nextIndex]
          if (nextSegment) {
            void controller.playSegment(nextSegment, narr.language)
          }
        } else {
          setIsPlaying(false)
        }
      },
    })
  }, [controller])

  // Lifecycle cleanup on unmount
  useEffect(() => {
    return () => {
      controller.destroy()
    }
  }, [controller])

  if (!narration || !Array.isArray(narration.segments) || narration.segments.length === 0) {
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

  const currentSegmentData = narration.segments[currentSegment]
  const hasRealAudio = Boolean(currentSegmentData?.audioUrl?.trim())

  const handlePlay = () => {
    setAudioError(null)
    const segment = narration.segments[currentSegment]
    if (segment) {
      void controller.playSegment(segment, narration.language)
    }
  }

  const handlePause = () => {
    controller.pause()
  }

  const handleStop = () => {
    controller.stop()
  }

  const handlePrevious = () => {
    const prevIndex = Math.max(0, currentSegment - 1)
    if (prevIndex === currentSegment) return

    setCurrentSegment(prevIndex)
    setAudioError(null)
    if (isPlayingRef.current) {
      const segment = narration.segments[prevIndex]
      if (segment) {
        void controller.playSegment(segment, narration.language)
      }
    } else {
      controller.stop()
    }
  }

  const handleNext = () => {
    const nextIndex = Math.min(narration.segments.length - 1, currentSegment + 1)
    if (nextIndex === currentSegment) return

    setCurrentSegment(nextIndex)
    setAudioError(null)
    if (isPlayingRef.current) {
      const segment = narration.segments[nextIndex]
      if (segment) {
        void controller.playSegment(segment, narration.language)
      }
    } else {
      controller.stop()
    }
  }

  const handleSelectSegment = (index: number) => {
    if (index === currentSegment) return

    setCurrentSegment(index)
    setAudioError(null)
    if (isPlayingRef.current) {
      const segment = narration.segments[index]
      if (segment) {
        void controller.playSegment(segment, narration.language)
      }
    } else {
      controller.stop()
    }
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

      {audioError ? (
        <p className="form-status error" style={{ margin: '0.5rem 0' }}>
          {audioError}
        </p>
      ) : null}

      <div className="narration-panel__summary">
        <div>Language: {narration.language}</div>
        <div>{narration.segments.length} segments</div>
        <div>Current segment: {currentSegment + 1}</div>
        <div>{hasRealAudio ? 'Audio: High Quality' : 'Voice: Browser Synthesizer'}</div>
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
            key={segment.id ?? index}
            className={`narration-panel__segment ${index === currentSegment ? 'is-active' : ''}`}
            onClick={() => handleSelectSegment(index)}
            style={{ cursor: 'pointer' }}
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
})