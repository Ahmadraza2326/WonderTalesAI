# ORBis Interaction & UX Pattern Library

---

## 1. Overview & Pattern Framework

This library codifies high-conviction interaction and UX patterns extracted from world-class digital learning, gaming, and child development benchmarks. Every pattern is filtered through the **Child-First Interaction Law** to ensure maximum clarity, tactile delight, emotional safety, and cognitive efficiency.

---

## 2. Master Pattern Catalog

### 2.1 Navigation: "Living Spatial Realm Map"
- **Benchmark Source:** Super Mario World / Duolingo World Map / Khan Academy Kids Journey.
- **Why It Works:** Children understand spatial relationships and physical geography much faster than abstract hierarchical menus. A pathway with winding terrain and floating islands visually communicates progress, milestones, and future horizons.
- **ORBis Adaptation:** The 8 Academic Realms are rendered as glowing celestial constellations/islands in deep space. Nodes on the `AdventurePath` indicate completed, current, and mysterious locked waypoints.
- **Child Safety:** Completely closed environment; no external links or unmoderated multiplayer nodes.
- **Accessibility:** Fully navigable via keyboard arrow keys (`Tab` / `Enter`), with ARIA landmark semantics and high-contrast milestone badges.
- **Motion:** Parallax starfield movement with floating island physics (1,200ms ease-out camera pans).
- **Priority:** **P0 — CRITICAL**

---

### 2.2 Learning: "Enactive-First Direct Manipulation"
- **Benchmark Source:** Montessori golden bead frames / Endless Numbers / Toca Life.
- **Why It Works:** Tangible, responsive objects invite exploration. When an object behaves with believable mass, springiness, and magnetic snap, the brain builds an intuitive physical model of the underlying math or science concept.
- **ORBis Adaptation:** `StarArrayManipulative.tsx` and `PotionScales.tsx` allow children to drag, group, and snap physical items. Grouping 4 stars into a pod plays a pentatonic chord and binds them visually into a single manageable unit.
- **Child Safety:** Zero penalty for dropping items outside the zone; items gently float back with a soft rubber-band physics trajectory.
- **Accessibility:** Direct tap alternatives for drag interactions, minimum 48px touch targets, and full keyboard slot selection.
- **Motion:** Spring physics ($\zeta = 0.75$, $\omega_n = 20$), elastic drag tether, and magnetic snap bloom (240ms).
- **Priority:** **P0 — CRITICAL**

---

### 2.3 Character Agency: "Joint Visual Attention & Gaze Tracking"
- **Benchmark Source:** Khan Academy Kids (Kodi pointing) / Astro Bot (character eye contact).
- **Why It Works:** Developmental psychology confirms that children instinctively follow the gaze of social partners (Joint Visual Attention). When an animated companion looks at an object, the child's focus is directed immediately without verbal overload.
- **ORBis Adaptation:** `GuideCharacterSvg.tsx` tracks active drag targets or cursor positions. During instruction, the character looks at the formula or manipulative; during celebration, the character makes direct eye contact with the learner.
- **Child Safety:** Guide character is always patient, supportive, and emotionally warm.
- **Accessibility:** Companion actions are accompanied by clear auditory spatial narration and subtitles.
- **Motion:** Smooth eye pupil interpolation (120ms lerp) and subtle head tilt (3°–6°).
- **Priority:** **P0 — CRITICAL**

---

### 2.4 Feedback: "Musical Harmonics & Multi-Sensory Reinforcement"
- **Benchmark Source:** Zelda puzzle-solve jingle / Lingokids phonics games / Lumosity audio feedback.
- **Why It Works:** A single visual change can be missed, but simultaneous visual bloom, tactile vibration, and a harmonic chord create an unmistakable, satisfying confirmation of success.
- **ORBis Adaptation:** In `sfxService.ts`, every correct interaction triggers a ascending pentatonic chime sequence (`C5 -> E5 -> G5 -> C6`) paired with haptic vibration (`medium`) and a stardust particle burst.
- **Child Safety:** Soft, warm acoustic tones (marimba, celesta, harp) prevent auditory fatigue and sensory overload.
- **Accessibility:** Audio toggle available at all times; visual feedback is 100% self-sufficient for deaf/hard-of-hearing learners.
- **Motion:** 400ms outward radial wave and crystal shimmer.
- **Priority:** **P1 — HIGH**

---

### 2.5 Progress & Mastery: "Living Sanctuary Ecosystem"
- **Benchmark Source:** Animal Crossing / Pokémon / Khan Kids Kodi's Room.
- **Why It Works:** Children care deeply about caring for living creatures and personalizing spaces. Abstract numbers (XP points) are converted into tangible care actions (feeding star-fruits, unlocking habitat biomes).
- **ORBis Adaptation:** Mastery stars earned across the 8 Realms directly nurture mythical creatures in the `SanctuaryPage` and unlock creative tools in the `CreativeStudioPage`.
- **Child Safety:** No microtransactions, loot boxes, or predatory pay-to-accelerate mechanics.
- **Accessibility:** Text alternatives for all creature states and tactile habitat controls.
- **Motion:** Creature breathing cycles, joyful bounce animations, and sparkling habitat waterfalls.
- **Priority:** **P1 — HIGH**

---

### 2.6 Onboarding: "The Zero-Text Invitation"
- **Benchmark Source:** Toca Kitchen / Monument Valley / Tynker Junior.
- **Why It Works:** Children do not read splash screens or multi-step walkthroughs. The interface must present an irresistible, single interactive element (e.g., a glowing cosmic egg or a pulsating realm portal) that invites a first tap.
- **ORBis Adaptation:** On first launch, Poly the Star Owl peeks out from a glowing nebula, waves, and says: *"Tap the shining star to awaken our universe!"*
- **Child Safety:** Immediate entry with zero mandatory sign-up screens or data entry required for children.
- **Accessibility:** Large 64px central touch target, automated voice narration, and closed captions.
- **Motion:** Pulsating aura (800ms sine wave) and gentle character wave (600ms).
- **Priority:** **P1 — HIGH**

---

### 2.7 Scaffolding: "The 4-Tier Non-Intrusive Safety Net"
- **Benchmark Source:** DragonBox Numbers / Thinkrolls / Montessori classroom guidance.
- **Why It Works:** Jumping in with the answer robs the child of the "Aha!" moment. Providing no help causes frustration and abandonment. A graded assistance curve keeps the learner in the Zone of Proximal Development.
- **ORBis Adaptation:**
  - *Tier 0:* Silence and attentive character posture for 8 seconds.
  - *Tier 1:* Target drop zone pulses gently; companion asks a guiding question (*"How many stars can fit in this row?"*).
  - *Tier 2:* Ghost trail animates one item into position and snaps back (*"Watch how this row fills up!"*).
  - *Tier 3:* Distractor elements fade, isolating the core decision.
- **Child Safety:** Zero negative reinforcement, no red "X" marks, no harsh failure buzzers.
- **Accessibility:** Dynamic hint trigger button always accessible via keyboard and screen reader.
- **Motion:** Ghost path animation (600ms bezier) and soft focus vignette.
- **Priority:** **P0 — CRITICAL**

---

### 2.8 Creative Play: "Autonomous Discovery Canvas"
- **Benchmark Source:** Kid Pix / Toca Band / Crayola Create and Play.
- **Why It Works:** Open-ended creation solidifies structured learning by giving the child ownership over the tools and concepts.
- **ORBis Adaptation:** `CreativeStudioPage` and `InventionLab.tsx` allow children to combine discovered elements (gears, phoneme runes, star colors) into playable interactive contraptions.
- **Child Safety:** Sandboxed local storage; creations are saved to the child's private gallery without external web exposure.
- **Accessibility:** High contrast tools, undo/redo buttons with minimum 48px touch bounding boxes.
- **Motion:** Fluid brush strokes, particle paint splashes, and physics-driven contraption motions.
- **Priority:** **P2 — MEDIUM**
