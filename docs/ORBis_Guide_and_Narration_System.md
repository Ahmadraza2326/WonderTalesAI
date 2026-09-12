# ORBis Pedagogical Guides & Narration System Specification
**Date:** August 29, 2026  
**Version:** 1.0.0  

---

## 1. The 10 Pedagogical Guides

Guides are active teaching companions with distinct pedagogical approaches:

| Guide Name | Realm | Archetype / Persona | Teaching Style | Hint Approach | Celebration Trigger |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Poly** | Mathematics | *The Geometric Owl* | Visual, step-by-step, pattern-focused | Breaks numbers into physical objects | Flaps wings with glowing starry aura |
| **Newton** | Science | *The Curious Otter* | Empirical, hypothesis-driven, playful | Suggests changing one physical variable | Splashes water ripples and bubbles |
| **Lexi** | Language | *The Lorekeeper Fox* | Story-driven, phonemic, poetic | Emphasizes root morphemes & rhymes | Waves glowing magical quill |
| **BEEP-0** | Coding / CS | *The Explorer Bot* | Algorithmic, sequential, debugging-focused | Highlights the first faulty step | Rotates antenna with neon pulses |
| **Sherlock** | Critical Thinking | *The Sleuth Hound* | Deductive, evidence-based, inquisitive | Points out overlooked clues | Magnifies scene with lens shimmer |
| **Nova** | Astronomy | *The Star Voyager* | Wonder-inspired, cosmic, spatial | Connects stars into familiar shapes | Illuminates planetary ring aurora |
| **DaVinci** | Creativity | *The Builder Dragon* | Inventive, boundless, encouraging | Offers unexpected color / part combinations | Breathes playful sparklers |
| **Atlas** | World Knowledge | *The Explorer Bear* | Adventurous, cultural, geographical | Shows where artifacts fit in history | Unfurls glowing world map |
| **Aria** | Music | *The Songbird* | Melodic, rhythmic, harmonic | Claps and hums the tempo | Sings musical notes with rainbow trails |
| **Harmony** | SEL / Life Skills | *The Gentle Fawn* | Empathetic, calming, mindful | Suggests taking a deep breath | Blooms glowing flowers |

---

## 2. Guide Emotional States & Transitions

Guides transition through 6 standard emotional states:
- `neutral`: Idle resting with breathing micro-animation.
- `curious`: Tilts head with inquisitive eye sparkle during concept introduction.
- `thinking`: Taps chin when a question is presented.
- `guiding`: Points toward interactive manipulative when a hint is active.
- `encouraging`: Offers warm smile and gentle nodding after a mistake.
- `celebrating`: Joyous motion with particle bursts on correct answers or mastery.

---

## 3. Conversational Narration Director (`narrationDirector.ts`)

### Capabilities:
1. **Synchronized Caption Broadcasting:** Emits word-by-word timestamps for visual karaoke highlighting.
2. **Audio Controls:** Play, pause, resume, replay, mute, rate modifier ($0.8\text{x}-1.2\text{x}$), and volume sliders.
3. **Persona Pitch & Timbre Modulation:** Dynamically adjusts speech synthesis pitch/rate to match guide personas (e.g. BEEP-0 robotic cadence vs Harmony soothing tone).
4. **Child-Friendly Conversational Language:** Never reads verbatim raw code or technical XML. Translates concepts into short, warm sentences.
