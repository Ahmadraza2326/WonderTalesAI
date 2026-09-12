/**
 * ORBis Offline-First Synchronization Service
 * Caches core curriculum, user progress, and creative documents locally,
 * and maintains an optimistic sync queue that syncs when network connectivity returns.
 */

export interface QueuedSyncEvent {
  id: string
  childId: string
  eventType: 'skill_completed' | 'practice_finished' | 'creation_saved' | 'mission_claimed' | 'project_updated'
  payload: any
  timestamp: string
  synced: boolean
}

const OFFLINE_QUEUE_KEY = 'orbis_offline_sync_queue'

class OfflineSyncService {
  private queue: QueuedSyncEvent[] = []

  constructor() {
    this.loadQueue()
  }

  private loadQueue() {
    if (typeof window === 'undefined' || !window.localStorage) return
    try {
      const raw = window.localStorage.getItem(OFFLINE_QUEUE_KEY)
      this.queue = raw ? JSON.parse(raw) : []
    } catch {
      this.queue = []
    }
  }

  private saveQueue() {
    if (typeof window === 'undefined' || !window.localStorage) return
    try {
      window.localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.queue))
    } catch {
      // Ignore storage errors
    }
  }

  public enqueueEvent(
    childId: string,
    eventType: QueuedSyncEvent['eventType'],
    payload: any
  ): QueuedSyncEvent {
    const event: QueuedSyncEvent = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      childId,
      eventType,
      payload,
      timestamp: new Date().toISOString(),
      synced: false,
    }
    this.queue.push(event)
    this.saveQueue()
    return event
  }

  public getPendingEvents(): QueuedSyncEvent[] {
    return this.queue.filter((e) => !e.synced)
  }

  public markEventsSynced(eventIds: string[]) {
    const idSet = new Set(eventIds)
    this.queue = this.queue.filter((e) => !idSet.has(e.id))
    this.saveQueue()
  }

  public isOnline(): boolean {
    if (typeof navigator === 'undefined') return true
    return navigator.onLine !== false
  }
}

export const offlineSyncService = new OfflineSyncService()
