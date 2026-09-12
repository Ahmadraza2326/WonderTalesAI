# ORBis Voice, Audio & Soundscape Bible

> **Standard:** Cinematic 6-Layer Audio Architecture  
> **Rule:** No flat, robotic TTS. Audio must provide warmth, child-directed pacing, emotional resonance, and dynamic ducking.

---

## 1. The 6-Layer Audio Architecture

```
Layer 1: Voice Narration (Warm, expressive character actor dialogue)
Layer 2: Character Vocal SFX (Giggles, chirps, bleeps, thinking hums)
Layer 3: Environmental Ambient Soundscape (Celestial wind, forest rustle, workshop steam)
Layer 4: Direct Interaction SFX (Tile click, drag whoosh, spring snap, liquid pour)
Layer 5: Pedagogical Feedback SFX (Chime progression, soft harmonic cue, victory fanfare)
Layer 6: Dynamic Background Music (Adaptive score with automatic -12dB dialogue ducking)
```

---

## 2. Dynamic Audio Ducking Protocol

To satisfy Mayer's Modality Principle and prevent sensory competition:
1. When character speech begins: Background music smoothly ducks by $-12\text{dB}$ over $150\text{ms}$.
2. Environmental ambient loops duck by $-6\text{dB}$.
3. When speech finishes: Music smoothly swells back to base volume over $400\text{ms}$.
4. Interactive sound effects (snaps, taps) remain crisp and un-ducked at full fidelity.

---

## 3. Speech & Narration Metadata Specification

Every key narration utterance in ORBis supports declarative metadata tags:

```typescript
export interface NarrationLine {
  text: string
  audioUrl?: string
  emotion: 'curious' | 'guiding' | 'thinking' | 'celebrating' | 'gentle'
  pace: 0.85 | 0.95 | 1.0 | 1.15
  emphasisWords: string[]
  pauseAfterMs?: number
  gestureCue?: 'point_target' | 'head_tilt' | 'celebrate'
  visualTargetId?: string
}
```

### Voice Persona Rules:
* **Pre-K & Kindergarten:** Slower pacing ($0.85\times$), exaggerated melodious pitch variation, clear enunciation of phonemes.
* **Grades 1–3:** Conversational, enthusiastic, clear pauses before key numerical or scientific terms.
* **Grades 4–5:** Intellectually engaging, inquisitive, slightly faster rhythm ($1.05\times$).
