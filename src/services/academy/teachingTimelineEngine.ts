import type { GuideId, GuideEmotion } from '../../types/learningUniverse'
import type { CharacterPose, GazeDirection } from '../../components/academy/guide/GuideCharacterSvg'

export type TimelineEventType =
  | 'guide_enter'
  | 'guide_speak'
  | 'guide_pose'
  | 'guide_gaze'
  | 'object_highlight'
  | 'object_animate'
  | 'sound_effect'
  | 'unlock_interaction'

export interface TimelineEvent {
  timeMs: number
  type: TimelineEventType
  payload: {
    guideId?: GuideId
    emotion?: GuideEmotion
    pose?: CharacterPose
    gaze?: GazeDirection
    text?: string
    targetId?: string
    animationName?: string
    soundName?: string
  }
}

export interface TimelineState {
  currentTimeMs: number
  isPlaying: boolean
  activeEvents: TimelineEvent[]
  isInteractionUnlocked: boolean
  activeHighlightId: string | null
  currentPose: CharacterPose
  currentGaze: GazeDirection
}

export type TimelineListener = (state: TimelineState) => void

export class TeachingTimelineEngine {
  private events: TimelineEvent[] = []
  private listeners: Set<TimelineListener> = new Set()
  private state: TimelineState = {
    currentTimeMs: 0,
    isPlaying: false,
    activeEvents: [],
    isInteractionUnlocked: true,
    activeHighlightId: null,
    currentPose: 'idle_breathe',
    currentGaze: 'down',
  }
  private timer: number | null = null

  constructor(initialEvents: TimelineEvent[] = []) {
    this.events = [...initialEvents].sort((a, b) => a.timeMs - b.timeMs)
  }

  public setEvents(events: TimelineEvent[]) {
    this.events = [...events].sort((a, b) => a.timeMs - b.timeMs)
    this.reset()
  }

  public subscribe(listener: TimelineListener): () => void {
    this.listeners.add(listener)
    listener(this.state)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ ...this.state })
    }
  }

  public play() {
    if (this.state.isPlaying) return
    this.state.isPlaying = true
    this.notify()

    const interval = 100
    this.timer = window.setInterval(() => {
      const nextTime = this.state.currentTimeMs + interval
      this.state.currentTimeMs = nextTime

      // Trigger events that fall into this time window
      for (const event of this.events) {
        if (event.timeMs <= nextTime && !this.state.activeEvents.includes(event)) {
          this.executeEvent(event)
        }
      }

      this.notify()
    }, interval)
  }

  public pause() {
    this.state.isPlaying = false
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.notify()
  }

  public reset() {
    this.pause()
    this.state = {
      currentTimeMs: 0,
      isPlaying: false,
      activeEvents: [],
      isInteractionUnlocked: true,
      activeHighlightId: null,
      currentPose: 'idle_breathe',
      currentGaze: 'down',
    }
    this.notify()
  }

  private executeEvent(event: TimelineEvent) {
    this.state.activeEvents.push(event)

    switch (event.type) {
      case 'guide_pose':
        if (event.payload.pose) {
          this.state.currentPose = event.payload.pose
        }
        break
      case 'guide_gaze':
        if (event.payload.gaze) {
          this.state.currentGaze = event.payload.gaze
        }
        break
      case 'object_highlight':
        this.state.activeHighlightId = event.payload.targetId || null
        break
      case 'unlock_interaction':
        this.state.isInteractionUnlocked = true
        break
    }
  }
}
