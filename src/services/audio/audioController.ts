import type {
  AudioPlayerState,
} from '../../types/audioPlayer'

export class AudioController {
  private audio = new Audio()

  private state: AudioPlayerState = {
    isPlaying: false,
    currentSegment: 0,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
    volume: 1,
  }

  getState() {
    return this.state
  }

  play(url: string) {
    this.audio.src = url
    this.audio.play()

    this.state.isPlaying = true
  }

  pause() {
    this.audio.pause()

    this.state.isPlaying = false
  }

  stop() {
    this.audio.pause()

    this.audio.currentTime = 0

    this.state.isPlaying = false
  }

  setVolume(volume: number) {
    this.audio.volume = volume

    this.state.volume = volume
  }

  setPlaybackRate(rate: number) {
    this.audio.playbackRate = rate

    this.state.playbackRate = rate
  }
}