# ORBis Voice Performance Direction & Audio Architecture

---

## 1. Vision & Acoustic Standard

> **"The ORBis voice is not an unfeeling machine reading text; it is a warm, emotionally intelligent, patient mentor speaking directly to a curious child."**

Narration in ORBis is treated as a staged voice performance. It balances warm acoustic presence, expressive sentence-chunked prosody, dynamic volume ducking, and synchronized visual signaling to maximize auditory comprehension and emotional safety.

---

## 2. The 9 Vocal Performance Modes

```
┌─────────────────────────────────────────────────────────────┐
│                 THE 9 VOCAL PERFORMANCE MODES               │
├───────────────────────┬──────────┬──────────────────────────┤
│ MODE                  │ PITCH    │ USE CASE                 │
├───────────────────────┼──────────┼──────────────────────────┤
│ 1. WARM_TEACHER       │ Baseline │ Core lesson introduction,│
│                       │ (+0%)    │ clear concept overview   │
├───────────────────────┼──────────┼──────────────────────────┤
│ 2. EXCITED_DISCOVERY  │ Elevated │ Breakthrough moments,    │
│                       │ (+15%)   │ unlocking a new realm    │
├───────────────────────┼──────────┼──────────────────────────┤
│ 3. WONDER_SUSPENSE    │ Lowered  │ Mystery clues, curiosity │
│                       │ (-10%)   │ hooks in Scene 1         │
├───────────────────────┼──────────┼──────────────────────────┤
│ 4. ENCOURAGEMENT      │ Warm/Soft│ First mistake, gentle    │
│                       │ (+5%)    │ invitation to re-attempt │
├───────────────────────┼──────────┼──────────────────────────┤
│ 5. GENTLE_CORRECTION  │ Patient  │ Reframing a mistake as a │
│                       │ (0%)     │ scientific clue          │
├───────────────────────┼──────────┼──────────────────────────┤
│ 6. CELEBRATION        │ Joyful   │ Lesson victory, 3-star   │
│                       │ (+25%)   │ mastery fanfare          │
├───────────────────────┼──────────┼──────────────────────────┤
│ 7. REFLECTIVE_GUIDE   │ Calm     │ Summary of what we       │
│                       │ (-5%)    │ learned in Scene 5       │
├───────────────────────┼──────────┼──────────────────────────┤
│ 8. FOCUSED_ATTENTION  │ Clear    │ Tier 2 step-by-step      │
│                       │ (0%)     │ interactive prompt       │
├───────────────────────┼──────────┼──────────────────────────┤
│ 9. PLAYFUL_CHALLENGE  │ Bouncy   │ Launching capstone game  │
│                       │ (+10%)   │ or speed round           │
└───────────────────────┴──────────┴──────────────────────────┘
```

---

## 3. Pacing, Prosody & Sentence Chunking

### 3.1 Speed & Word Density Budgets
- **Pre-K & Kindergarten (Ages 3–5):** Rate = `0.85x` (approx. 100–115 words per minute). Maximum 8 words per spoken breath chunk.
- **Grades 1–3 (Ages 6–8):** Rate = `0.92x` (approx. 120–135 words per minute). Maximum 12 words per breath chunk.
- **Grades 4–6 (Ages 9–12):** Rate = `1.00x` (approx. 140–150 words per minute).

### 3.2 Strategic Pauses
- **Clause Boundary Pause:** 250ms pause after commas and introductory phrases.
- **Concept Reveal Pause:** 500ms dramatic pause before stating a breakthrough result (*"And 3 rows of 4 makes... [500ms pause] ...TWELVE stars!"*).
- **Inactivity Prompt Pause:** Minimum 8.0s silence before offering unprompted advice, allowing the child uninterrupted thinking time.

---

## 4. The 6-Layer Audio Mixer & Dynamic Music Ducking

```
Master Destination (AudioContext.destination)
 │
 ├── Master Volume GainNode (0.0 to 1.0)
 │    │
 │    ├── Voice Dialogue Bus (Gain = 1.0)
 │    │    └── SpeechSynthesis / Audio Buffer Node
 │    │
 │    ├── Sound FX Bus (Gain = 0.8)
 │    │    └── Procedural Web Audio Synthesizers (Pentatonic Chimes, Pops, Clicks)
 │    │
 │    └── Background Music Bus (Normal Gain = 0.18, Ducked Gain = 0.05 [-12dB])
 │         └── Procedural Ambient Chord Loops & Soundscapes
```

### Dynamic Ducking Mechanism
1. Whenever `narrationDirector.speak()` or character dialogue begins:
   - Music GainNode smoothly transitions from `0.18` to `0.05` ($-12\text{dB}$) over `120ms` using `linearRampToValueAtTime`.
2. When character speech finishes:
   - Music GainNode smoothly recovers back to `0.18` over `400ms`.
3. This ensures spoken words are crystalline and 100% intelligible, eliminating sensory mask and auditory fatigue.

---

## 5. Visual-Auditory Synchronization (Read-Along Karaoke)

- Every spoken sentence is tokenized into word spans.
- As the audio playback progresses, the corresponding text word in the bottom subtitle bar illuminates with a golden highlight (`var(--orbis-glow-gold)`).
- Guide character mouth and wings articulate gently in sync with speech syllable triggers.

---

## 6. Accessibility & Silent Fallback

- If the user mutes audio, browser speech synthesis is unavailable, or the device is on silent mode:
  - Subtitle banner automatically pins to the bottom stage with high-contrast text (`#ffffff` on semi-transparent `#020617` glass).
  - Guide character gestures and visual ghost hands carry 100% of the pedagogical direction without loss of clarity.
