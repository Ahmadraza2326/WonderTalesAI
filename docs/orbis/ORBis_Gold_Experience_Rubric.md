# ORBis Gold Experience Quality Rubric & Scoring Standard

---

## 1. Quality Philosophy & The Experience Gate

> **"Code correctness is a necessary prerequisite, not a sufficient condition. An experience is only complete when it delights a child and satisfies the Master Experience Rubric."**

Automated regression suites, unit tests, and TypeScript compiler passes verify *engineering integrity*. The **ORBis Gold Experience Rubric** audits *child experience quality*.

No lesson, game, or hub may be graduated to production status or scaled across the curriculum without achieving:
1. **Total Composite Score $\ge 54 / 60$** (90%+)
2. **Zero Individual Category Score $< 4 / 5$** (No critical failure points permitted)

---

## 2. The 12-Dimensional Scoring Matrix

| # | Dimension | 1 - Unacceptable | 3 - Competent Baseline | 5 - World-Class Gold Standard | Weight |
|---|---|---|---|---|---|
| **1** | **Visual Quality & World Immersion** | Cluttered, generic SaaS cards, emoji accents, inconsistent lighting | Coherent theme, basic glassmorphism, readable layouts | Cinematic depth, bespoke SVG assets, living realm auras, cohesive art direction | 5 pts |
| **2** | **Child Clarity (Zero-Text Affordance)** | Child must read paragraphs to proceed; confusing button labels | Basic icons and instructions; child requires occasional adult help | Child understands goal within 3s without reading; clear visual affordances | 5 pts |
| **3** | **Interaction & Physical Manipulatives** | Click-to-select multiple-choice radio buttons; static visuals | Basic drag-and-drop without physics or tactile snap | Spring physics, magnetic snap, realistic object mass, rubber-band returns | 5 pts |
| **4** | **Pedagogical Integrity (Bruner EIS)** | Direct jump to abstract equations ($3 \times 4 = 12$); rote drill | Visual illustration shown beside text equation | Strict Enactive $\rightarrow$ Iconic $\rightarrow$ Symbolic staging; concept emerges from action | 5 pts |
| **5** | **Character Actor Agency** | Static mascot sitting passively in corner or looping single bounce | Mascot changes static mood icon on success/error | Gaze tracking toward touch targets, joint visual attention, 12 actor poses | 5 pts |
| **6** | **Motion Purpose & Choreography** | Erratic motion, unmotivated screen shake, cognitive clutter | Clean transitions between screens | 5-tier motion hierarchy; all motion explains causality, affordance, or feedback | 5 pts |
| **7** | **Audio Quality & Voice Direction** | Robotic mechanical TTS reading raw strings; loud jarring SFX | Clear TTS with generic sounds | Warm teacher voice, prosodic pauses, $-12\text{dB}$ music ducking, harmonic chords | 5 pts |
| **8** | **Emotional Engagement & Delight** | Dry test atmosphere; punitive failure buzzers and red X marks | Generic "+10 XP" popups | Joyful celebration, non-punitive discovery, Sanctuary creature nurturing | 5 pts |
| **9** | **Game Quality & Educational Transfer** | Disjointed mini-game unrelated to target cognitive skill | Gamified quiz where speed matters more than math | The learned concept directly powers gameplay mechanics (e.g. Magic Machine) | 5 pts |
| **10** | **Accessibility & Universal Design** | Mouse-only, low contrast, no captions, jarring motion | Meets basic contrast ratios, standard keyboard tab order | Minimum 48px/64px touch targets, full screen reader ARIA, reduced-motion paths | 5 pts |
| **11** | **Performance & Fluidity** | Dropped frames, high battery drain, unoptimized assets | Stable 30 FPS on desktop | Rock-solid 60 FPS on mobile, GPU transforms, zero audio clicks or memory leaks | 5 pts |
| **12** | **International & Cultural Readiness** | Hard-coded English assumptions, rigid widths, LTR-only | Localizable text keys in basic bundle | Full RTL support, flexible layout expansion, cultural asset safety | 5 pts |

---

## 3. Child Usability Simulation Protocol

Every Gold candidate is subjected to a simulated 9-persona child usability audit:

1. **The Pre-Reader (Age 4):** Navigates entirely via visual symbols, character gestures, and spoken audio cues.
2. **The Reluctant Learner (Age 7):** Disengages if text is dense or feedback feels punitive; demands rapid visual feedback.
3. **The Rapid Explorer (Age 6):** Taps everywhere quickly; system must handle rapid inputs without crashing or overlapping audio.
4. **The Hesitant Child (Age 5):** Pauses for extended periods; system must provide gentle Tier 1/2 hints without making child feel rushed.
5. **The Misconception Tester (Age 8):** Makes systematic errors (e.g. adding rows instead of multiplying); system must trigger targeted pedagogical reframing.
6. **The Motor-Challenged Child:** Uses clumsy finger touches or assistive switches; requires large $\ge 56\text{px}$ touch targets.
7. **The Sensory-Sensitive Child:** Dislikes loud surprises or flashing screens; requires harmonious pentatonic audio and gentle lighting.
8. **The Small Screen Mobile User (360px viewport):** Experiences no clipped text, overlapping buttons, or unscrollable stages.
9. **The Offline Learner:** Operates seamlessly with zero dropped audio or broken images when disconnected from internet.

---

## 4. Benchmark Scoring: `lesson_g2_array_multiplication`

| Dimension | Target Score | Verification Method |
|---|---|---|
| 1. Visual Quality | 5 / 5 | Stitch Direction C fidelity, bespoke SVG stars, cosmic realm stage |
| 2. Child Clarity | 5 / 5 | Visual ghost hand, glowing slot highlights, zero mandatory reading |
| 3. Interaction Quality | 5 / 5 | `StarArrayManipulative.tsx` with spring physics and magnetic snap |
| 4. Pedagogical Quality | 5 / 5 | 5-scene Bruner EIS progression (Enactive grouping $\rightarrow$ Array $\rightarrow$ Equation) |
| 5. Character Presence | 5 / 5 | `GuideCharacterSvg.tsx` with eye gaze tracking and 12 actor poses |
| 6. Motion Quality | 5 / 5 | 5-tier motion tokens, causality ripples, smooth equation emergence |
| 7. Audio Quality | 5 / 5 | Warm teacher prosody, Web Audio pentatonic chime feedback, $-12\text{dB}$ ducking |
| 8. Emotional Engagement | 5 / 5 | Scene 5 constellation ignition, sanctuary star reward deposit |
| 9. Game Quality | 5 / 5 | Direct transfer to `MagicMachineLab.tsx` array power battery engine |
| 10. Accessibility | 5 / 5 | 56px touch bounds, high contrast labels, reduced-motion bypass |
| 11. Performance | 5 / 5 | 60 FPS GPU animations, zero audio latency, clean garbage collection |
| 12. International Readiness | 5 / 5 | Responsive token-driven layout, RTL CSS variables, localized speech |
| **Total Score** | **60 / 60** | **100% Gold Standard Gate Cleared** |
