export type SfxCue =
  | 'card_flip'
  | 'match_success'
  | 'mistake_soft'
  | 'star_pop'
  | 'victory_fanfare'
  | 'essence_pickup'
  | 'essence_drop'
  | 'liquid_mix'
  | 'cauldron_bubble'
  | 'creature_reveal'
  | 'rare_discovery'
  | 'legendary_discovery'
  | 'happy_accident'
  | 'almanac_unlock'
  | 'component_pickup'
  | 'component_place'
  | 'machine_start'
  | 'machine_success'
  | 'machine_fail'
  | 'spring_bounce'
  | 'magnet_pull'
  | 'fan_whoosh'
  | 'detective_lens_scan'
  | 'clue_found'
  | 'suspect_eliminate'
  | 'suspect_gasp'
  | 'case_solved'
  | 'potion_pickup'
  | 'scale_tilt'
  | 'weight_drop'
  | 'potion_bubble'
  | 'balance_near'
  | 'balance_success'
  | 'potion_complete'

class SfxService {
  private audioCtx: AudioContext | null = null
  private isAudioMuted: boolean = false
  private masterVolume: number = 0.4
  private storageKey = 'wondertales_sfx_muted'

  constructor() {
    // Read persisted mute state if in browser
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(this.storageKey)
        if (saved !== null) {
          this.isAudioMuted = saved === 'true'
        }
      } catch {
        // Ignore localStorage access errors
      }
    }
  }

  /**
   * Lazily initializes and unlocks the browser AudioContext.
   * Safe to call anywhere; will never throw.
   */
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null

    try {
      if (!this.audioCtx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass()
        }
      }

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {})
      }

      return this.audioCtx
    } catch {
      return null
    }
  }

  /**
   * Global mute accessor.
   */
  public isMuted(): boolean {
    return this.isAudioMuted
  }

  /**
   * Set global mute state.
   */
  public setMuted(muted: boolean): void {
    this.isAudioMuted = Boolean(muted)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(this.storageKey, String(this.isAudioMuted))
      } catch {
        // Ignore storage errors
      }
    }
  }

  /**
   * Toggle global mute state and return the new state.
   */
  public toggleMuted(): boolean {
    this.setMuted(!this.isAudioMuted)
    return this.isAudioMuted
  }

  /**
   * Adjust master sound effects volume (clamped between 0.0 and 1.0).
   */
  public setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, Number(volume) || 0.4))
  }

  /**
   * Get current master volume.
   */
  public getVolume(): number {
    return this.masterVolume
  }

  /**
   * Plays a synthesized, zero-dependency child-safe sound cue.
   * Never throws if audio is blocked, uninitialized, or muted.
   */
  public play(cue: SfxCue): void {
    if (this.isAudioMuted) return

    const ctx = this.getAudioContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime

      switch (cue) {
        case 'card_flip':
          this.synthesizeCardFlip(ctx, now)
          break
        case 'match_success':
          this.synthesizeMatchSuccess(ctx, now)
          break
        case 'mistake_soft':
          this.synthesizeMistakeSoft(ctx, now)
          break
        case 'star_pop':
          this.synthesizeStarPop(ctx, now)
          break
        case 'victory_fanfare':
          this.synthesizeVictoryFanfare(ctx, now)
          break
        case 'essence_pickup':
          this.synthesizeEssencePickup(ctx, now)
          break
        case 'essence_drop':
          this.synthesizeEssenceDrop(ctx, now)
          break
        case 'liquid_mix':
          this.synthesizeLiquidMix(ctx, now)
          break
        case 'cauldron_bubble':
          this.synthesizeCauldronBubble(ctx, now)
          break
        case 'creature_reveal':
          this.synthesizeCreatureReveal(ctx, now)
          break
        case 'rare_discovery':
          this.synthesizeRareDiscovery(ctx, now)
          break
        case 'legendary_discovery':
          this.synthesizeLegendaryDiscovery(ctx, now)
          break
        case 'happy_accident':
          this.synthesizeHappyAccident(ctx, now)
          break
        case 'almanac_unlock':
          this.synthesizeAlmanacUnlock(ctx, now)
          break
        case 'component_pickup':
          this.synthesizeComponentPickup(ctx, now)
          break
        case 'component_place':
          this.synthesizeComponentPlace(ctx, now)
          break
        case 'machine_start':
          this.synthesizeMachineStart(ctx, now)
          break
        case 'machine_success':
          this.synthesizeMachineSuccess(ctx, now)
          break
        case 'machine_fail':
          this.synthesizeMachineFail(ctx, now)
          break
        case 'spring_bounce':
          this.synthesizeSpringBounce(ctx, now)
          break
        case 'magnet_pull':
          this.synthesizeMagnetPull(ctx, now)
          break
        case 'fan_whoosh':
          this.synthesizeFanWhoosh(ctx, now)
          break
        case 'detective_lens_scan':
          this.synthesizeDetectiveLensScan(ctx, now)
          break
        case 'clue_found':
          this.synthesizeClueFound(ctx, now)
          break
        case 'suspect_eliminate':
          this.synthesizeSuspectEliminate(ctx, now)
          break
        case 'suspect_gasp':
          this.synthesizeSuspectGasp(ctx, now)
          break
        case 'case_solved':
          this.synthesizeCaseSolved(ctx, now)
          break
        case 'potion_pickup':
          this.synthesizePotionPickup(ctx, now)
          break
        case 'scale_tilt':
          this.synthesizeScaleTilt(ctx, now)
          break
        case 'weight_drop':
          this.synthesizeWeightDrop(ctx, now)
          break
        case 'potion_bubble':
          this.synthesizePotionBubble(ctx, now)
          break
        case 'balance_near':
          this.synthesizeBalanceNear(ctx, now)
          break
        case 'balance_success':
          this.synthesizeBalanceSuccess(ctx, now)
          break
        case 'potion_complete':
          this.synthesizePotionComplete(ctx, now)
          break
        default:
          break
      }
    } catch {
      // Audio synthesis failures must never crash application gameplay
    }
  }

  // ---------------------------------------------------------------------------
  // Audio Synthesis Primitives (Oscillators + Gain Envelopes)
  // ---------------------------------------------------------------------------

  private createGain(ctx: AudioContext, initialGain: number): GainNode {
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(initialGain * this.masterVolume, ctx.currentTime)
    gain.connect(ctx.destination)
    return gain
  }

  /**
   * Soft organic card flip click (gentle wood/paper pop).
   */
  private synthesizeCardFlip(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.2)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.05)

    gain.gain.setValueAtTime(0.2 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.06)
  }

  /**
   * Joyful ascending chime for correct pairs/words (C5 -> E5 -> G5).
   */
  private synthesizeMatchSuccess(ctx: AudioContext, now: number): void {
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.18)
      const noteTime = now + idx * 0.08

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.18 * this.masterVolume, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22)

      osc.connect(gain)
      osc.start(noteTime)
      osc.stop(noteTime + 0.23)
    })
  }

  /**
   * Gentle, non-punishing soft marimba thud for mistakes (240Hz -> 180Hz).
   */
  private synthesizeMistakeSoft(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.15)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(240, now)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.1)

    gain.gain.setValueAtTime(0.15 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.13)
  }

  /**
   * High sparkling bell pop for star collection (880Hz -> 1760Hz).
   */
  private synthesizeStarPop(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.22)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12)

    gain.gain.setValueAtTime(0.22 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.19)
  }

  /**
   * Uplifting pentatonic victory fanfare (C5 -> E5 -> G5 -> C6).
   */
  private synthesizeVictoryFanfare(ctx: AudioContext, now: number): void {
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.2)
      const noteTime = now + idx * 0.11
      const duration = idx === notes.length - 1 ? 0.45 : 0.2

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.2 * this.masterVolume, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration)

      osc.connect(gain)
      osc.start(noteTime)
      osc.stop(noteTime + duration + 0.02)
    })
  }

  /**
   * Sparkling glass/crystal chime when picking up or tapping an essence jar (G5 -> C6).
   */
  private synthesizeEssencePickup(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.16)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(783.99, now)
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.08)

    gain.gain.setValueAtTime(0.16 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.13)
  }

  /**
   * Resonant water drop / splash pop as ingredient enters the cauldron (C5 down to G4).
   */
  private synthesizeEssenceDrop(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.22)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(523.25, now)
    osc.frequency.exponentialRampToValueAtTime(392.0, now + 0.09)

    gain.gain.setValueAtTime(0.22 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.15)
  }

  /**
   * Warbling liquid bubbling sound for active cauldron stirring.
   */
  private synthesizeCauldronBubble(ctx: AudioContext, now: number): void {
    const bubbles = [330, 440, 392, 523]
    bubbles.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.12)
      const bTime = now + idx * 0.06

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, bTime)
      osc.frequency.linearRampToValueAtTime(freq + 60, bTime + 0.04)

      gain.gain.setValueAtTime(0.12 * this.masterVolume, bTime)
      gain.gain.exponentialRampToValueAtTime(0.001, bTime + 0.08)

      osc.connect(gain)
      osc.start(bTime)
      osc.stop(bTime + 0.09)
    })
  }

  /**
   * Suspenseful magical starlight reveal shimmer (C5 -> E5 -> G5 -> B5 -> C6).
   */
  private synthesizeCreatureReveal(ctx: AudioContext, now: number): void {
    const arpeggio = [523.25, 659.25, 783.99, 987.77, 1046.5]
    arpeggio.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.18)
      const noteTime = now + idx * 0.09
      const dur = idx === arpeggio.length - 1 ? 0.5 : 0.22

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.18 * this.masterVolume, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + dur)

      osc.connect(gain)
      osc.start(noteTime)
      osc.stop(noteTime + dur + 0.02)
    })
  }

  /**
   * Playful wobbly boing for Happy Accident non-creature discoveries.
   */
  private synthesizeHappyAccident(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.2)

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.linearRampToValueAtTime(440, now + 0.08)
    osc.frequency.linearRampToValueAtTime(330, now + 0.16)

    gain.gain.setValueAtTime(0.2 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.26)
  }

  /**
   * Fluid sloshing whoosh for mixing in the cauldron.
   */
  private synthesizeLiquidMix(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.15)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(240, now)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.12)
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.24)

    gain.gain.setValueAtTime(0.15 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.3)
  }

  /**
   * Triumphant brass-style ascending chord for Rare discoveries.
   */
  private synthesizeRareDiscovery(ctx: AudioContext, now: number): void {
    const chord = [392.0, 493.88, 587.33, 783.99] // G4, B4, D5, G5
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.2)
      const noteTime = now + idx * 0.07

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.2 * this.masterVolume, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4)

      osc.connect(gain)
      osc.start(noteTime)
      osc.stop(noteTime + 0.42)
    })
  }

  /**
   * Grand celestial orchestral chime with deep root and sparkling high harmonics for Legendary discoveries.
   */
  private synthesizeLegendaryDiscovery(ctx: AudioContext, now: number): void {
    // Deep fundamental root
    const rootOsc = ctx.createOscillator()
    const rootGain = this.createGain(ctx, 0.25)
    rootOsc.type = 'sine'
    rootOsc.frequency.setValueAtTime(130.81, now) // C3
    rootGain.gain.setValueAtTime(0.25 * this.masterVolume, now)
    rootGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
    rootOsc.connect(rootGain)
    rootOsc.start(now)
    rootOsc.stop(now + 0.82)

    // Celestial arpeggio sweep (C5 -> E5 -> G5 -> B5 -> D6 -> G6)
    const arpeggio = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98]
    arpeggio.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.16)
      const noteTime = now + idx * 0.08

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.16 * this.masterVolume, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6)

      osc.connect(gain)
      osc.start(noteTime)
      osc.stop(noteTime + 0.62)
    })
  }

  /**
   * Pure bell chime when unlocking a new Almanac entry.
   */
  private synthesizeAlmanacUnlock(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.2)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(659.25, now)
    osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.2)

    gain.gain.setValueAtTime(0.2 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.36)
  }

  /**
   * Component pickup: subtle wooden click with gentle pitch elevation.
   */
  private synthesizeComponentPickup(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.18)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.08)

    gain.gain.setValueAtTime(0.18 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.11)
  }

  /**
   * Component place: satisfying mechanical snap / clamp sound.
   */
  private synthesizeComponentPlace(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.22)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(480, now)
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.09)

    gain.gain.setValueAtTime(0.22 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.13)
  }

  /**
   * Machine simulation start: uplifting activation chord.
   */
  private synthesizeMachineStart(ctx: AudioContext, now: number): void {
    const chord = [392.0, 523.25, 659.25] // G4, C5, E5
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.14)
      const noteTime = now + idx * 0.04

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.14 * this.masterVolume, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28)

      osc.connect(gain)
      osc.start(noteTime)
      osc.stop(noteTime + 0.3)
    })
  }

  /**
   * Machine success: triumphant multi-tone celestial harmony.
   */
  private synthesizeMachineSuccess(ctx: AudioContext, now: number): void {
    const fanfare = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    fanfare.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.2)
      const noteTime = now + idx * 0.09

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.2 * this.masterVolume, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.5)

      osc.connect(gain)
      osc.start(noteTime)
      osc.stop(noteTime + 0.52)
    })
  }

  /**
   * Machine fail: gentle cartoon boing / wobble without harsh buzzer.
   */
  private synthesizeMachineFail(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.2)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.linearRampToValueAtTime(180, now + 0.15)
    osc.frequency.linearRampToValueAtTime(240, now + 0.25)
    osc.frequency.linearRampToValueAtTime(140, now + 0.4)

    gain.gain.setValueAtTime(0.2 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.44)
  }

  /**
   * Spring bounce: classic elastic spring boing.
   */
  private synthesizeSpringBounce(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.24)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(240, now)
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.12)
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.22)

    gain.gain.setValueAtTime(0.24 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  /**
   * Magnet pull: resonant magnetic humming tone.
   */
  private synthesizeMagnetPull(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.16)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.linearRampToValueAtTime(587.33, now + 0.18)

    gain.gain.setValueAtTime(0.16 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.23)
  }

  /**
   * Fan whoosh: soft white/filtered noise surge.
   */
  private synthesizeFanWhoosh(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.15)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(160, now)
    osc.frequency.linearRampToValueAtTime(280, now + 0.1)
    osc.frequency.linearRampToValueAtTime(140, now + 0.25)

    gain.gain.setValueAtTime(0.15 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.3)
  }

  /**
   * Detective lens scan: soft optical frequency sweep.
   */
  private synthesizeDetectiveLensScan(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.12)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.15)

    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.12 * this.masterVolume, now + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.2)
  }

  /**
   * Clue found: crisp double-chime with shimmer.
   */
  private synthesizeClueFound(ctx: AudioContext, now: number): void {
    const freqs = [523.25, 783.99, 1046.5] // C5, G5, C6
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.15 / (i + 1))
      const startTime = now + i * 0.07

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.15 * this.masterVolume, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28)

      osc.connect(gain)
      osc.start(startTime)
      osc.stop(startTime + 0.3)
    })
  }

  /**
   * Suspect eliminate: wooden pencil check / cross strike.
   */
  private synthesizeSuspectEliminate(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.16)

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.08)

    gain.gain.setValueAtTime(0.16 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.12)
  }

  /**
   * Suspect gasp: surprised playful gentle pop.
   */
  private synthesizeSuspectGasp(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.14)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.linearRampToValueAtTime(450, now + 0.12)

    gain.gain.setValueAtTime(0.14 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.2)
  }

  /**
   * Case solved: victorious detective fanfare.
   */
  private synthesizeCaseSolved(ctx: AudioContext, now: number): void {
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.2)
      const t = now + idx * 0.1

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0.2 * this.masterVolume, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)

      osc.connect(gain)
      osc.start(t)
      osc.stop(t + 0.45)
    })
  }

  /**
   * Potion pickup: soft chirpy sine upward glide with fast decay.
   */
  private synthesizePotionPickup(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.16)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08)

    gain.gain.setValueAtTime(0.16 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.14)
  }

  /**
   * Scale tilt: metallic brass friction glide with resonant filter.
   */
  private synthesizeScaleTilt(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator()
    const gain = this.createGain(ctx, 0.12)
    const filter = ctx.createBiquadFilter()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.linearRampToValueAtTime(240, now + 0.15)

    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(400, now)
    filter.Q.setValueAtTime(3, now)

    gain.gain.setValueAtTime(0.12 * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

    osc.connect(filter)
    filter.connect(gain)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  /**
   * Weight drop: resonant wooden/brass thud with slight sparkle ping.
   */
  private synthesizeWeightDrop(ctx: AudioContext, now: number): void {
    // Body thud
    const osc1 = ctx.createOscillator()
    const gain1 = this.createGain(ctx, 0.25)
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(220, now)
    osc1.frequency.exponentialRampToValueAtTime(60, now + 0.12)
    gain1.gain.setValueAtTime(0.25 * this.masterVolume, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16)
    osc1.connect(gain1)
    osc1.start(now)
    osc1.stop(now + 0.18)

    // Crystal ping
    const osc2 = ctx.createOscillator()
    const gain2 = this.createGain(ctx, 0.12)
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(1200, now)
    gain2.gain.setValueAtTime(0.12 * this.masterVolume, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    osc2.connect(gain2)
    osc2.start(now)
    osc2.stop(now + 0.1)
  }

  /**
   * Potion bubble: cluster of randomized bubble pops.
   */
  private synthesizePotionBubble(ctx: AudioContext, now: number): void {
    const freqs = [350, 520, 680]
    freqs.forEach((freq, idx) => {
      const t = now + idx * 0.04
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.1)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.05)

      gain.gain.setValueAtTime(0.1 * this.masterVolume, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06)

      osc.connect(gain)
      osc.start(t)
      osc.stop(t + 0.07)
    })
  }

  /**
   * Balance near: gentle harmonic 4th interval warm chime.
   */
  private synthesizeBalanceNear(ctx: AudioContext, now: number): void {
    const notes = [587.33, 783.99] // D5, G5
    notes.forEach((freq) => {
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.12)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.12 * this.masterVolume, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

      osc.connect(gain)
      osc.start(now)
      osc.stop(now + 0.35)
    })
  }

  /**
   * Balance success: resonant major triad chime (C5-E5-G5-C6) with bell shimmer.
   */
  private synthesizeBalanceSuccess(ctx: AudioContext, now: number): void {
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.08
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.18)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0.18 * this.masterVolume, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)

      osc.connect(gain)
      osc.start(t)
      osc.stop(t + 0.55)
    })
  }

  /**
   * Potion complete: triumphant ascending arpeggio fanfare with sparkle harmonics.
   */
  private synthesizePotionComplete(ctx: AudioContext, now: number): void {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.09
      const osc = ctx.createOscillator()
      const gain = this.createGain(ctx, 0.22)

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0.22 * this.masterVolume, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6)

      osc.connect(gain)
      osc.start(t)
      osc.stop(t + 0.65)
    })
  }
}

export const sfxService = new SfxService()


