export interface AudioPlayerState {
  isPlaying: boolean

  currentSegment: number

  currentTime: number

  duration: number

  playbackRate: number

  volume: number
}

export interface AudioControls {
  play(): void

  pause(): void

  stop(): void

  next(): void

  previous(): void

  seek(time: number): void

  setVolume(volume: number): void

  setPlaybackRate(rate: number): void
}