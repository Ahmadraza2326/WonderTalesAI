import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

export class HapticsService {
  private static isAvailable(): boolean {
    return typeof window !== 'undefined'
  }

  /**
   * Light impact vibration (button clicks, navigation pills, tile taps).
   */
  static async light(): Promise<void> {
    if (!this.isAvailable()) return
    try {
      await Haptics.impact({ style: ImpactStyle.Light })
    } catch {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(10)
      }
    }
  }

  /**
   * Medium impact vibration (drag drop snap, creature pet, card flip).
   */
  static async medium(): Promise<void> {
    if (!this.isAvailable()) return
    try {
      await Haptics.impact({ style: ImpactStyle.Medium })
    } catch {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(25)
      }
    }
  }

  /**
   * Heavy impact vibration (cauldron ignition, machine launch, milestone solve).
   */
  static async heavy(): Promise<void> {
    if (!this.isAvailable()) return
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy })
    } catch {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(45)
      }
    }
  }

  /**
   * Success notification vibration (quest complete, diploma claimed, level up).
   */
  static async success(): Promise<void> {
    if (!this.isAvailable()) return
    try {
      await Haptics.notification({ type: NotificationType.Success })
    } catch {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([30, 40, 60])
      }
    }
  }

  /**
   * Warning notification vibration (gentle hint, non-matching recipe, balance tip).
   */
  static async warning(): Promise<void> {
    if (!this.isAvailable()) return
    try {
      await Haptics.notification({ type: NotificationType.Warning })
    } catch {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([20, 30, 20])
      }
    }
  }

  /**
   * Error notification vibration (invalid input, wrong answer).
   */
  static async error(): Promise<void> {
    if (!this.isAvailable()) return
    try {
      await Haptics.notification({ type: NotificationType.Error })
    } catch {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([40, 40, 40])
      }
    }
  }

  /**
   * Selection tick (slider adjust, dial rotate).
   */
  static async selection(): Promise<void> {
    if (!this.isAvailable()) return
    try {
      await Haptics.selectionStart()
      await Haptics.selectionChanged()
      await Haptics.selectionEnd()
    } catch {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(8)
      }
    }
  }
}
