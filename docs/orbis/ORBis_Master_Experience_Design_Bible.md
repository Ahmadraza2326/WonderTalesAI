# ORBis Master Experience & Design Bible

**The Authoritative Experience, Visual, Motion, Voice, and Architectural Standard for ORBis**

> **Version:** 1.0 (Master Reset)  
> **Status:** APPROVED MASTER CANON  
> **Design Authorities:**  
> - Stitch Direction C: *Living Learning Universe* (Project ID `4449806016687673397`)  
> - Mobbin Child-First Interaction Benchmark Library  
> - Bruner Enactive-Iconic-Symbolic (EIS) Pedagogical Framework  
> - Bloom’s Revised Cognitive Taxonomy  
> **Audience:** Core Engineering, UI/UX Design, Curriculum Designers, AI Prompt Engineers  

---

# Table of Contents

1. [Product Experience Philosophy](#1-product-experience-philosophy)
2. [ORBis Emotional Design Principles](#2-orbis-emotional-design-principles)
3. [Child Experience Principles](#3-child-experience-principles)
4. [Parent Experience Principles](#4-parent-experience-principles)
5. [Visual Design Language](#5-visual-design-language)
6. [Color System](#6-color-system)
7. [Typography System](#7-typography-system)
8. [Shape / Radius System](#8-shape--radius-system)
9. [Surface / Depth System](#9-surface--depth-system)
10. [Illustration Language](#10-illustration-language)
11. [Character Design System](#11-character-design-system)
12. [Character Animation System](#12-character-animation-system)
13. [Voice & Narration System](#13-voice--narration-system)
14. [Sound Design System](#14-sound-design-system)
15. [Cinematic Direction System](#15-cinematic-direction-system)
16. [Motion Design System](#16-motion-design-system)
17. [Interaction Design System](#17-interaction-design-system)
18. [Learning Interaction Principles](#18-learning-interaction-principles)
19. [Reward / Celebration Language](#19-reward--celebration-language)
20. [Navigation Philosophy](#20-navigation-philosophy)
21. [Responsive Design Rules](#21-responsive-design-rules)
22. [Accessibility Rules](#22-accessibility-rules)
23. [Performance Rules](#23-performance-rules)
24. [Screen Architecture](#24-screen-architecture)
25. [A-to-Z Screen Inventory](#25-a-to-z-screen-inventory)
26. [Lesson Experience Architecture](#26-lesson-experience-architecture)
27. [Story Experience Architecture](#27-story-experience-architecture)
28. [Playroom / Game Experience Architecture](#28-playroom--game-experience-architecture)
29. [Parent Experience Architecture](#29-parent-experience-architecture)
30. [Loading / Empty / Error State Language](#30-loading--empty--error-state-language)
31. [Design Tokens](#31-design-tokens)
32. [Reusable Component Strategy](#32-reusable-component-strategy)
33. [Stitch Workflow](#33-stitch-workflow)
34. [Mobbin Reference Workflow](#34-mobbin-reference-workflow)
35. [Antigravity Implementation Workflow](#35-antigravity-implementation-workflow)
36. [Design-to-Code Handoff Rules](#36-design-to-code-handoff-rules)
37. [QA / Visual Verification Rules](#37-qa--visual-verification-rules)
38. [Protected Engineering Invariants](#38-protected-engineering-invariants)
39. [Redesign Roadmap](#39-redesign-roadmap)
40. [Definition of "Premium ORBis"](#40-definition-of-premium-orbis)

---

## 1. Product Experience Philosophy

ORBis is not a digital textbook, a glorified quiz machine, or an AI wrapper. It is a **living, interactive universe where learning and storytelling are inseparable**.

In traditional educational web applications, the child is treated as a passive data-entry operator: reading dry paragraphs, clicking radio buttons, and watching progress bars fill. In ORBis, the child is the **active explorer and protagonist** of an unfolding intellectual journey.

### The Core Triad
The product exists as three intertwined expressions of childhood exploration:
1. **The Academy (The Citadels of Mastery):** Rigorous, structured cognitive quests across 8 academic realms where concepts are discovered through hands-on manipulation.
2. **The Story Studio (The Crucible of Imagination):** Personalized, generative illustrated storybooks where academic concepts appear organically in living fiction.
3. **The Playroom (The Labs of Discovery):** 10 deep, procedural sandbox simulation games where children test theories, balance ecosystems, forge spells, and construct machines.

### The Ultimate Metric of Success
The child’s spontaneous reaction upon finishing any interaction in ORBis must never be:
> *"Phew, I finished my lesson."*

It must always be:
> **"Wow, I want to see what happens next!"**

---

## 2. ORBis Emotional Design Principles

1. **Wonder and Mystery over Clinical Instruction:**  
   Every subject is framed as an ancient secret, a celestial mystery, or an uncharted territory waiting to be unraveled. Geometry is the language of crystalline stars; biology is the living pulse of cosmic gardens.
2. **Unconditional Emotional Safety:**  
   There are no red fail marks, jarring error buzzers, or shaming countdown timers. A misconception is never an error; it is an intriguing scientific clue that leads to deeper investigation.
3. **Agency and Mastery Pride:**  
   Children manipulate the world directly. When an array multiplies, the stars physically snap into columns under the child's touch. Progress feels earned, tactile, and momentous.
4. **Delight in Micro-Interactions:**  
   Surfaces respond with stardust trails, buttons exhibit subtle spring-loaded bounce, character companions perk up their ears when tapped, and crystal cards refract celestial light.
5. **Calm Focus (Anti-Sensory Overload):**  
   High wonder does not mean chaotic visual noise. ORBis rejects flashing banner ads, chaotic pop-ups, and hyper-kinetic flashing graphics. It uses deep cosmic negative space to draw the child's gaze naturally to the learning heart.

---

## 3. Child Experience Principles

- **Zero-Reading Barrier (Pre-K through Grade 1):**  
  No young child should be blocked because they cannot yet read instructional text. Every prompt, dialogue, and interaction has synchronized warm audio narration, visual signposts, and iconic cues.
- **Immediate Tactile Affordances:**  
  Interactive elements must look physically touchable—pill-shaped capsules, glowing bevels, glass reflections, and springy resistance. Touch targets must be generous: **minimum 48px on mobile, expanding to 64px for Pre-K**.
- **Single-Focus Cognitive Staging:**  
  At any given second, there is only **one** primary interactive challenge on screen. Competing sidebars, complex menus, and extraneous counters fade into soft translucent backdrops.
- **Multisensory Synchronization:**  
  When an owl character speaks, the spoken word, the character’s mouth/wings, the highlight on the lesson text, and the target object on the canvas synchronize within 50 milliseconds.
- **Zero Presentation Unicode Emojis in Child-Facing UI:**  
  System emojis (e.g. 🚀, ⭐, 🤖, 📚) look like disjointed text characters on different OS devices and degrade an app into feeling like a cheap chat app. ORBis uses **exclusively custom vector SVGs, procedural canvas particles, and bespoke animated character illustrations**.

---

## 4. Parent Experience Principles

- **Radical Pedagogical Transparency:**  
  Parents and educators should never wonder "what is my child actually learning?" Every lesson and story displays clear standards mapping (Common Core, NGSS, UK National Curriculum), Bloom's Taxonomy level, and targeted cognitive domains.
- **Effortless Oversight without Intrusiveness:**  
  Parents receive insightful summaries: active vocabulary mastered, concepts explored, persistent strengths, and areas needing gentle encouragement.
- **Co-Learning Conversation Bridges:**  
  ORBis provides offline prompts: *"Ask your child tonight: 'If we put 3 apples in 4 baskets, why does that equal 12?'"*
- **COPPA / GDPR-K Absolute Sanctuary:**  
  Zero behavioral tracking, zero third-party ads, zero dark patterns, zero peer chat vulnerabilities. The application is a safe digital haven.
- **Calm Adult Aesthetic:**  
  The Parent Zone uses a sophisticated, serene dark-navy interface with clear data visualizations, distinctly separated from the playful, immersive child interface.

---

## 5. Visual Design Language: "The Living Learning Universe"

The canonical aesthetic is **Direction C: The Living Learning Universe**, a hybrid of deep celestial wonder and rich, tangible biomes:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      THE LIVING LEARNING UNIVERSE                       │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. THE VOID CANVAS        Deep cosmic abyss (#020617 / #030712)         │
│                           with breathing stardust canvas particles.     │
│ 2. REALM BIOMES           Living planetary islands, each with distinct  │
│                           atmospheric lighting and vector flora/citadel.│
│ 3. GLASS INTERACTION      Ultra-translucent floating capsules with      │
│    VESSELS                1px starlight inner border glows.             │
│ 4. LIVING GUIDE ACTORS    Expressive vector companions positioned on    │
│                           the learning stage, actively tracking gaze.   │
│ 5. TACTILE CONTROLS       Spring-loaded buttons that press into depth   │
│                           with haptic feedback and acoustic cues.       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Color System

### 6.1 Universal Dark Void Foundation
- **Void Space (Deepest Canvas):** `#020617` (Deepest Navy-Black)
- **Abyssal Slate (Stage Background):** `#0f172a`
- **Surface Elevation 1 (Card/Container):** `rgba(30, 41, 59, 0.70)`
- **Surface Elevation 2 (Elevated Vessel):** `rgba(51, 65, 85, 0.50)`
- **Glass Border Rim Light:** `rgba(255, 255, 255, 0.12)`
- **Glass Inner Glow:** `inset 0 1px 1px rgba(255, 255, 255, 0.20)`

### 6.2 The 8 Realm Palettes
Each realm features a primary radiant accent, an ambient aura tint, and a high-contrast text pair:

| Realm ID | Academic Domain | Primary Accent | Secondary Glow | Aura / Particle Color | Contrast on Void |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `math` | Math & Logic | `#38bdf8` (Cyan Starlight) | `#818cf8` | `rgba(56, 189, 248, 0.20)` | **12.4:1 (AAA)** |
| `science` | Science & Physics | `#10b981` (Emerald Core) | `#34d399` | `rgba(16, 185, 129, 0.20)` | **10.8:1 (AAA)** |
| `reading` | Reading & Literacy | `#f59e0b` (Amber Parchment)| `#fbbf24` | `rgba(245, 158, 11, 0.20)` | **11.6:1 (AAA)** |
| `computer_science` | Computing & Logic | `#06b6d4` (Neon Indigo) | `#67e8f9` | `rgba(6, 182, 212, 0.20)` | **11.9:1 (AAA)** |
| `creativity` | Creative Arts & Music | `#ec4899` (Cosmic Rose) | `#f472b6` | `rgba(236, 72, 153, 0.20)` | **9.8:1 (AAA)** |
| `english` | Grammar & Vocabulary | `#a855f7` (Nebula Violet) | `#c084fc` | `rgba(168, 85, 247, 0.20)` | **10.2:1 (AAA)** |
| `general_knowledge` | World & Earth Sciences| `#14b8a6` (Teal Aurora) | `#2dd4bf` | `rgba(20, 184, 166, 0.20)` | **10.9:1 (AAA)** |
| `history` | History & Curiosity | `#eab308` (Solar Gold) | `#facc15` | `rgba(234, 179, 8, 0.20)` | **12.1:1 (AAA)** |

### 6.3 Semantic Feedback Palettes
- **Success / Affirmation:** `#10b981` (Vibrant Emerald)
- **Attention / Step Clue:** `#f59e0b` (Warm Amber)
- **Soft Misconception / Remedy:** `#f43f5e` (Soft Rose Coral - Never harsh pure red)
- **Cosmic Celebration:** `linear-gradient(135deg, #38bdf8 0%, #a855f7 50%, #f59e0b 100%)`

---

## 7. Typography System

Typography must bridge high educational legibility with child-like geometric charm:

### 7.1 Typeface Pairings
1. **Display & Headings:** `Outfit`, sans-serif.  
   - Curved geometric letterforms, open counters, rounded terminals.  
   - Weights: `700` (Bold), `800` (ExtraBold), `900` (Black).
2. **Body, Instructions, & Dialogue:** `Inter`, sans-serif.  
   - Clean neo-grotesque, tall x-height, wide apertures, optical kerning for high readability on small screens.  
   - Weights: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold).

### 7.2 Typographic Hierarchy Scale (CSS Tokens)
- `var(--text-display-2xl)`: `clamp(2.25rem, 5vw, 3.5rem)` (Line-height: 1.15, Weight: 900)
- `var(--text-display-xl)`: `clamp(1.75rem, 4vw, 2.5rem)` (Line-height: 1.20, Weight: 800)
- `var(--text-heading-lg)`: `clamp(1.35rem, 3vw, 1.85rem)` (Line-height: 1.25, Weight: 700)
- `var(--text-body-lg)`: `1.125rem` (18px) (Line-height: 1.60, Weight: 500)
- `var(--text-body-md)`: `1.000rem` (16px) (Line-height: 1.50, Weight: 400)
- `var(--text-caption)`: `0.875rem` (14px) (Line-height: 1.40, Weight: 600, Letter-spacing: +0.02em)
- `var(--text-badge)`: `0.6875rem` (11px) (Line-height: 1.20, Weight: 900, Letter-spacing: +0.08em, Uppercase)

---

## 8. Shape / Radius System

Sharp square corners create unconscious tension and cognitive fatigue. ORBis uses continuous curved geometry:

- **Touch Pills & Buttons:** `var(--radius-pill)` = `9999px`
- **Interactive Capsules & Badges:** `var(--radius-capsule)` = `16px` to `20px`
- **Stage Vessels & Cards:** `var(--radius-card)` = `24px` to `28px`
- **Dialogs & Overlay Portals:** `var(--radius-modal)` = `32px` to `40px`

---

## 9. Surface / Depth System

The stage is structured into **4 explicit spatial elevation tiers**:

```
[ TIER 4: HUD & FLOATING CONTROLS ] (Z-Index: 50)
  Sticky LessonProgressRail, Orby Assistant Trigger, Volume Toggle, Modals
             ↑ (16px backdrop blur, border-bottom starlight glow)
[ TIER 3: LEARNING STAGE & MANIPULATIVES ] (Z-Index: 20)
  GlassPanel vessels, interactive cards, drag-and-drop targets, answer chips
             ↑ (Box-shadow: 0 12px 36px rgba(0,0,0,0.45), 1px border glow)
[ TIER 2: COMPANION ACTOR & STAGE REALM ] (Z-Index: 10)
  GuideCharacterSvg standing on pedestal, environmental reactive elements
             ↑ (Ambient colored radial aura: 80px blur, opacity: 0.20)
[ TIER 1: THE COSMIC CANVAS VOID ] (Z-Index: 0)
  Deepest navy gradient, canvas ParticleField (stardust, bubbles, runes)
```

---

## 10. Illustration Language

- **Pure Vector & SVG Construction:** Sharp on retina screens, 120Hz iPads, and 4K displays.
- **Lyrical Geometric-Organic Shapes:** Harmonious curves blended with crisp geometric precision.
- **Vibrant Duotone Lighting:** Objects receive soft directional highlights from realm celestial lighting.
- **Zero Cluttered Clip-Art:** Flat stock graphics and corporate vector styles are strictly banned.

---

## 11. Character Design System

The 10 Guide Characters are the living heart of ORBis. They are **not decorative icons**; they are pedagogical actors who listen, react, encourage, and celebrate with the child.

### 11.1 The 10 Canonical Guides
1. **Poly (The Geometric Owl):** Mathematics & Logic. Analytic, calm, socratic, warm owl with crystal spectacles.
2. **Newton (The River Otter):** Physics & Inquiry. Bubbly, curious, experimental otter in brass explorer goggles.
3. **Lexi (The Story Fox):** Reading & Vocabulary. Eloquent, lyrical, warm fox holding an illuminated scroll.
4. **Beep-0 (The Clockwork Automaton):** Computer Science & Algorithms. Quirky, precise, supportive brass robot with glowing optic sensor.
5. **Aria (The Songbird):** Music, Phonetics & Rhythm. Joyful, rhythmic humming bird with feathered music staff accents.
6. **Nova (The Star Sprite):** Astronomy & Space Sciences. Ethereal, gentle glowing sprite with stardust trails.
7. **Sherlock (The Hound Detective):** Puzzles, Deductive Logic & Mystery. Observant, patient basset hound in tweed deerstalker.
8. **Atlas (The Mountain Bear):** Geography & Earth Systems. Grounded, sturdy, encouraging brown bear in mountaineer scarf.
9. **Jade (The Forest Lynx):** Ecology & Botany. Serene, perceptive lynx with flora crown and emerald tail tuft.
10. **Terra (The Mineral Golem):** Geology & Material Science. Gentle giant stone golem with amethyst core and tactile stone hands.

---

## 12. Character Animation System

Guide characters exhibit dynamic real-time states driven by the child’s interactions:

### 12.1 The 12 Actor States
```
idle_breathe       → Gentle 3s vertical breathing loop with blinking (every 4s)
listening          → Eyes track active touch/drag point; ears perk up (+4px)
thinking           → Head tilts 6°, wing/paw to chin, gaze drifts upward
curious_tilt       → Head tilts 8° on unexpected input ("Hmm, interesting clue!")
guiding            → Open-wing posture gesturing toward target manipulative
pointing_target    → Direct arm/wing extension highlighting exact challenge area
encouraging_nod    → Affirmative downward nod upon effort or retry
excited_wave       → Friendly double hand/wing wave to invite engagement
surprised_sparkle  → Eyes widen with burst of mini stardust particles
celebrating_bounce → Vertical jump (1.08x scale burst) with golden celestial aura
confused_gentle    → Sympathetic head shake transitioning to assisted remediation
demonstrating      → Active manipulative movement during visual demonstrations
```

### 12.2 Physics & Timing
- Character transitions use spring damping (`damping: 18`, `stiffness: 140`).
- Mascot gaze coordinates interpolate smoothly (`lerp` factor: `0.12`).

---

## 13. Voice & Narration System

Robotic text-to-speech reading raw educational paragraphs is strictly forbidden. Voice in ORBis is treated as a **theatrical performance**.

### 13.1 The Voice Architecture Pipeline
```
[ Lesson Script ] 
        ↓ (pedagogical intent)
[ Dialogue Director ] 
        ↓ (breaks into breath chunks, inserts emotional markers)
[ Emotion & Intent Metadata ] 
        ↓ (maps to pitch, rate, pauses)
[ Voice Engine / Neural TTS ] 
        ↓ (audio buffer generation)
[ Acoustic Timing Coordinator ]
   ├── Speech Synthesizer (audio stream)
   ├── Dynamic Music Ducking (-12dB duck)
   ├── Character SVG Lip/Pose Morph
   └── Text Sentence / Word Karaoke Highlight
```

### 13.2 The 9 Vocal Performance Modes
1. `WARM_TEACHER`: Baseline pitch, steady, reassuring, conversational clarity.
2. `EXCITED_DISCOVERY`: +15% pitch, faster attack, celebratory emphasis.
3. `WONDER_SUSPENSE`: -10% pitch, whispered breathiness, deliberate dramatic pauses.
4. `ENCOURAGEMENT`: +5% pitch, soft rounded timbre, gentle upward inflection.
5. `GENTLE_CORRECTION`: Patient, neutral tempo, reframing mistakes as clues.
6. `CELEBRATION`: +25% pitch, triumphant, joyful resonance.
7. `REFLECTIVE_GUIDE`: -5% pitch, calm, meditative, rhythmic phrasing.
8. `FOCUSED_ATTENTION`: Direct, crisp, measured cadence for multi-step instructions.
9. `PLAYFUL_CHALLENGE`: Bouncy tempo, conspiratorial warmth (*"Ready to test your theory?"*).

---

## 14. Sound Design System

Audio in ORBis is non-fatiguing, acoustically warm, and built on the **Pentatonic & Lydian Musical Modes** (avoiding harsh dissonances):

### 14.1 The 6-Layer Audio Mixer
1. **Master Bus:** Volume cap, global mute, safe dynamic limiter.
2. **Dialogue Bus:** Priority 1, gain = 1.0 (never ducked).
3. **Sound FX Bus:** Tactile feedback, pops, chimes, gain = 0.75.
4. **Manipulative Physics Bus:** Drag hums, snap clicks, balance creaks, gain = 0.60.
5. **Ambient Soundscape Bus:** Realm atmospheric drone (wind, water, space hum), gain = 0.15.
6. **Music Bus:** Ambient score loops; ducks automatically to `0.05` (-12dB) whenever speech is active.

### 14.2 Tactile Sound Cues
- `card_flip`: 40ms organic paper-glass brush.
- `star_pop`: High-Q resonant bell chime (frequency: 1046Hz, C6).
- `match_success`: Ascending major triad chime (C5 - E5 - G5 - C6).
- `mistake_soft`: Low-frequency wooden marimba tap (no harsh buzzers).
- `victory_fanfare`: Full 8-note orchestral brass-bell flourish.

---

## 15. Cinematic Direction System

Lessons are directed as **interactive animated shorts** rather than static form pages.

### 15.1 Camera Staging Vocabulary
- **Establishing Shot:** Wide panoramic view of the realm island floating in the cosmic void.
- **Wide Stage Shot:** Full view of the floating glass vessel, guide actor on the pedestal, and progress rail.
- **Medium Focus Shot:** Camera smoothly zooms 1.15x into the active manipulative surface during direct practice.
- **Close-Up Dramatic Shot:** Deep focus on a single equation or puzzle element during breakthrough moments.
- **Celebration Swell:** Camera pulls back smoothly as fireworks and stardust fill the screen.

### 15.2 Depth & Parallax
- The canvas particle field drifts at `0.2x` parallax speed.
- The background realm nebulae drift at `0.4x` parallax speed.
- The interactive learning stage stays pinned at `1.0x` focus.

---

## 16. Motion Design System

Motion in ORBis is purposeful, physical, and respects cognitive processing:

- **Micro-Interactions (100ms–150ms):** Button presses, hover glows, icon morphs.
- **Component Transitions (200ms–300ms):** Card reveals, drawer slides, badge unlocks.
- **Stage & Camera Swells (400ms–600ms):** Scene progressions, manipulative morphs.
- **Grand Celebrations (1000ms–1800ms):** Victory modals, constellation alignments.
- **Physics Easing Curves:**
  - `var(--ease-spring-bounce)`: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Affirming bounce).
  - `var(--ease-cosmic-glide)`: `cubic-bezier(0.16, 1, 0.3, 1)` (Smooth luxury deceleration).
- **Accessibility:** If `prefers-reduced-motion: reduce` is active, all translation and scale loops snap instantly, and particles remain static.

---

## 17. Interaction Design System

- **Physics-Driven Direct Manipulation:**  
  When dragging an item, it exhibits realistic inertia, soft spring resistance at canvas boundaries, and magnetic snapping to target dropzones.
- **Haptic Feedback Language:**
  - *Light (10ms):* Grid snap, item select, button tap.
  - *Medium (25ms):* Correct slot match, tool activation.
  - *Heavy (40ms):* Stage breakthrough, level milestone.
  - *Success Pattern:* Two quick pulses followed by a lingering hum (15ms - 40ms - 30ms).
- **Thumb-Zone Optimization:**  
  On mobile devices (320px–430px), all primary action buttons ("Begin", "Continue", "Check") are placed in the bottom 25% thumb zone.

---

## 18. Learning Interaction Principles: The Bruner EIS Scaffold

Every lesson conforms strictly to Jerome Bruner’s proven developmental progression:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      BRUNER EIS PROGRESSION PIPELINE                    │
├─────────────────────────────────────────────────────────────────────────┤
│ SCENE 1: WELCOME & CURIOSITY HOOK (Emotional Context)                   │
│          Guide presents a real-world puzzle or mystery in the realm.    │
│                                                                         │
│ SCENE 2: ENACTIVE MANIPULATION (Hands-On Physicality)                   │
│          Child directly touches and manipulates concrete objects        │
│          (moving owls into arrays, balancing potion vials).             │
│                                                                         │
│ SCENE 3: ICONIC REPRESENTATION (Visual Schematization)                  │
│          Concrete objects transform into visual diagrams, dots,         │
│          bar models, or number lines.                                   │
│                                                                         │
│ SCENE 4: SYMBOLIC MASTERY (Formal Notation & Micro-Question)           │
│          Child connects visual insight to mathematical/verbal notation  │
│          (e.g., 3 × 4 = 12), backed by 4-Tier Progressive Scaffolding.  │
│                                                                         │
│ SCENE 5: REFLECTION & CAPSTONE BINDING (Metacognitive Anchor)          │
│          Guide summarizes the breakthrough, awards mastery crystals,    │
│          and bridges the skill into a playable flagship game.           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 19. Reward / Celebration Language

- **Effort & Insight over Casino Loops:** ORBis rejects addictive gambling mechanics, fake countdown chests, and stress-inducing timers.
- **Meaningful Economy:**
  - **Stardust XP:** Measures curiosity, exploration, and sustained effort.
  - **Mastery Stars (1 to 3):** Awarded for concept comprehension and independent problem solving.
  - **Skill Crystals:** Permanent collectible artifacts representing unlocked cognitive domains.
- **Cosmetic Sanctuary Utility:** Rewards unlock celestial accessories, room decorations, and custom essence colors in the child's personal sanctuary.

---

## 20. Navigation Philosophy

- **Spatial Continuity over Web URLs:**  
  The child navigates through a **Living Universe Map**. Moving from the Academy to the Story Studio feels like zooming from a learning citadel into an illuminated library planet.
- **Persistent Floating HUD Header:**  
  Sticky at the top, housing the Exit/Back button, current Realm insignia, Audio Mute toggle, and Guide Companion summon button.
- **Minimalist Mobile Dock:**  
  Bottom dock on mobile screens gives instant 1-tap access to the 4 core worlds: **Overworld (Map), Academy (Learning), Stories (Studio), and Playroom (Games)**.

---

## 21. Responsive Design Rules

| Breakpoint | Target Device | Layout Strategy | Stage Max Width | Touch Target Minimum |
| :--- | :--- | :--- | :--- | :--- |
| **320px** | iPhone SE / Small Phones | Single column, stacked controls, hidden non-essential text | 100% (12px gutters) | **48px** |
| **375px–430px**| Standard/Large iPhones, Pixel | Single column, thumb-zone action bar, full width glass cards | 100% (16px gutters) | **48px** |
| **768px** | iPad Mini / Tablets Portrait | Centered floating vessel, 2-column manipulative grids | 680px | **52px** |
| **1024px** | iPad Pro / Tablets Landscape | Split view: Guide Actor on left pedestal, Stage on right | 860px | **52px** |
| **1280px–1440px**| Desktop / Laptops | Cinematic theater layout, full cosmic parallax, keyboard shortcuts| 880px | **48px** |

---

## 22. Accessibility Rules (WCAG 2.1 AAA Standard)

- **Color Contrast:** All text content achieves a minimum contrast ratio of `7:1` against its immediate background container.
- **Dynamic Accessible Text Size:** Interface responds gracefully up to `200%` browser text zoom without breaking card boundaries.
- **Dyslexia-Friendly Modes:** Optional font toggle allowing users to switch narrative reading text to high-legibility weighted typefaces.
- **Aria Live Regions:** Guide voice narrations and dynamic feedback messages broadcast cleanly to screen readers (`aria-live="polite"`).
- **Keyboard Traversal:** Every interactive element has an explicit, high-visibility focus ring (`0 0 0 3px #38bdf8`).

---

## 23. Performance Rules (The 60 FPS Guarantee)

- **GPU Acceleration:** Animations are restricted exclusively to `transform` and `opacity`. Never animate `width`, `height`, `margin`, or `top`.
- **Canvas Particle Pooling:** Stardust particle engines allocate their coordinate arrays once at initialization; zero garbage collection during active rendering.
- **Asset Pre-Caching:** When a lesson begins, audio buffers and SVG frames for all 5 scenes preload silently in the background.
- **Bundle Footprint:** Code-split route boundaries ensure initial app hydration stays under `150KB` gzipped.

---

## 24. Screen Architecture: The Universal Page Shell

Every screen in ORBis follows a unified 4-layer composition:

```tsx
<UniversalPageShell realm={subjectId}>
  {/* Layer 1: Cosmic Atmosphere & Dynamic Canvas Particle Field */}
  <CosmicAtmosphereBackdrop realm={subjectId} />

  {/* Layer 2: Floating Sticky Navigation & Progress HUD */}
  <UniversalHeaderHUD 
    title={pageTitle} 
    onBack={handleBack} 
    guideId={currentGuideId} 
    audioControl={true} 
  />

  {/* Layer 3: The Primary Living Stage Vessel */}
  <main className="orbis-primary-stage-vessel">
    <GlassStageContainer variant="hero">
      {/* Screen-Specific Content */}
    </GlassStageContainer>
  </main>

  {/* Layer 4: Floating Bottom Thumb-Zone Action Dock */}
  <ThumbActionZone>
    <MagicalCTAButton />
  </ThumbActionZone>
</UniversalPageShell>
```

---

## 25. A-to-Z Screen Inventory

Every screen in the ORBis ecosystem mapped for cohesive redesign:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ BRAND & ONBOARDING                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│ 01. Cosmic Splash & Portal Intro                                       │
│ 02. Interactive Onboarding & Age/Grade Band Selector                    │
│ 03. Child Profile Creation & Avatar Constellation Forge                 │
│ 04. Profile Switcher & Child Selector Station                           │
├─────────────────────────────────────────────────────────────────────────┤
│ ACADEMY CITADELS (LEARNING)                                             │
├─────────────────────────────────────────────────────────────────────────┤
│ 05. Academy Command Center (AcademyHomePage)                            │
│ 06. Academic Realm Biome Explorer (SubjectDetailPage)                   │
│ 07. Learning Expedition Path (CourseDetailPage)                         │
│ 08. Skill Crystal Hub (SkillHubPage)                                    │
│ 09. Cinematic Lesson Player (LessonPage - Bruner EIS Stages)            │
│ 10. Interactive Practice Arena (PracticePage - 13 Evaluators)            │
│ 11. Academy Missions & Daily Bounties (AcademyMissionsPage)              │
│ 12. Academy Knowledge Vault (AcademyLibraryPage)                         │
├─────────────────────────────────────────────────────────────────────────┤
│ STORY STUDIO (IMAGINATION)                                              │
├─────────────────────────────────────────────────────────────────────────┤
│ 13. Story Studio Creator Hub (CreateStoryPage)                          │
│ 14. Interactive Story Reader & Viewer (StoryViewerPage)                  │
│ 15. Storybook Illustrated Library (StoryLibraryPage)                    │
│ 16. Story-Academy Continuity Bridge Arena                               │
├─────────────────────────────────────────────────────────────────────────┤
│ PLAYROOM LABS (EXPERIMENTATION - 10 CANONICAL FLAGSHIP GAMES)           │
├─────────────────────────────────────────────────────────────────────────┤
│ 17. Game Universe Hub (GameUniversePage)                                │
│ 18. Creature Lab Station (CreatureLabPage)                              │
│ 19. Magic Machine Gears Lab (MagicMachinePage)                          │
│ 20. Mystery Detective Agency (MysteryDetectivePage)                     │
│ 21. Potion Scales Alchemy Lab (PotionScalesPage)                        │
│ 22. Invention Engineering Studio (InventionLabPage)                     │
│ 23. Spellforge Phonemic Anvil (SpellforgePage)                          │
│ 24. RoboPath Algorithm Academy (RoboPathPage)                           │
│ 25. Ecosystem Sandbox Biome (EcosystemSandboxPage)                      │
│ 26. Cosmic Constellation Stargazer (CosmicConstellationPage)            │
│ 27. Rhythm Spells Harmonic Conductor (RhythmSpellsPage)                 │
│ 28. Memory Museum Curiosity Archives (MemoryMuseumPage)                 │
├─────────────────────────────────────────────────────────────────────────┤
│ SANCTUARY, REWARDS & PARENT SUITE                                       │
├─────────────────────────────────────────────────────────────────────────┤
│ 29. Personal Stardust Sanctuary (SanctuaryPage)                         │
│ 30. Explorer Passport & Crystal Case (PassportPage)                     │
│ 31. Parent Insights & Cognitive Dashboard (ParentZonePage)              │
│ 32. Universal Settings, Audio & Accessibility Station (SettingsPage)    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 26. Lesson Experience Architecture

Lessons are orchestrated across the **5 EIS Scenes**:

1. **Scene 1 (Hook):** The Guide introduces the lesson scenario with emotional voice performance and character gestures.
2. **Scene 2 (Visual Demonstration):** The Guide steps to the manipulative pedestal, demonstrating the concept visually.
3. **Scene 3 (Guided Interaction):** The child directly interacts with the digital manipulative with active magnetic snapping.
4. **Scene 4 (Knowledge Check):** 4-tier progressive scaffolding micro-question. Instant affirmative or remedial dialogue.
5. **Scene 5 (Celebration & Reflection):** Metacognitive summary, XP/Star reward cascade, and capstone flagship game unlock.

---

## 27. Story Experience Architecture

- **Narrative-Driven Learning:** Stories generated in ORBis weave the child's academic milestones into heroic storylines.
- **Word-Level Audio Karaoke:** As the neural TTS voice reads, each spoken word illuminates with a soft cyan/gold starlight highlight.
- **Interactive Illustration Spotlights:** Children can tap characters and objects in story illustrations to hear pronunciations and secret lore.

---

## 28. Playroom / Game Experience Architecture

- **10 Autonomous Procedural Simulation Engines:** Games in ORBis are full physics-driven puzzle sandboxes (not simple reskinned trivia).
- **Mastery Bridge:** Completing specific skill milestones in the Academy unlocks secret levels and rare reagents in the Playroom.

---

## 29. Parent Experience Architecture

- **Serene Dark-Navy Analytics:** High-contrast data charts showing Bloom's Taxonomy distribution.
- **Offline Conversation Cards:** One-tap exportable prompts for dinner-table and bedtime co-learning.
- **Curriculum Controls:** Granular ability to toggle specific domains, adjust challenge pacing, or set healthy daily exploration limits.

---

## 30. Loading, Empty, & Error State Language

- **Never a Blank Screen or Spinners:**  
  Loading states show a rotating planetary ring or floating stardust constellation accompanied by an intriguing science or history trivia fact.
- **Playful, Non-Punitive Empty States:**  
  Empty story libraries show an open book floating in a starlit forest with Lexi the Fox saying: *"Your shelf is waiting for your very first adventure!"*
- **Compassionate Error Recovery:**  
  Network drops display Sherlock the Hound with a magnifying glass: *"Oops, the celestial signal drifted! Let's try connecting again."*

---

## 31. Design Tokens Specification

### 31.1 tokens.css
```css
:root {
  /* Cosmic Backgrounds */
  --orbis-void-space: #020617;
  --orbis-abyssal-slate: #0f172a;
  --orbis-surface-elevated: rgba(30, 41, 59, 0.70);
  --orbis-surface-vessel: rgba(51, 65, 85, 0.45);
  
  /* Glassmorphic Boundaries */
  --orbis-glass-border: rgba(255, 255, 255, 0.14);
  --orbis-glass-glow: inset 0 1px 1px rgba(255, 255, 255, 0.22);
  --orbis-glass-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.55);

  /* Realm Accent Colors */
  --realm-math-accent: #38bdf8;
  --realm-science-accent: #10b981;
  --realm-reading-accent: #f59e0b;
  --realm-cs-accent: #06b6d4;
  --realm-creativity-accent: #ec4899;
  --realm-english-accent: #a855f7;
  --realm-general-accent: #14b8a6;
  --realm-history-accent: #eab308;

  /* Typography */
  --font-family-display: 'Outfit', sans-serif;
  --font-family-body: 'Inter', sans-serif;

  /* Radii */
  --radius-pill: 9999px;
  --radius-capsule: 20px;
  --radius-card: 26px;
  --radius-vessel: 32px;

  /* Touch Target */
  --touch-target-min: 48px;
  --touch-target-prek: 64px;

  /* Motion */
  --motion-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --motion-glide: cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 32. Reusable Component Strategy

The atomic component system powering all ORBis screens:
1. `UniversalPageShell`: Outer viewport container, background canvas, layout grid.
2. `CosmicAtmosphereBackdrop`: Canvas particle field, realm aura nebulae.
3. `LessonProgressRail`: Sticky HUD with scene indicators, audio controls, exit navigation.
4. `GlassPanel`: Glassmorphic container with 4 variants (`hero`, `vessel`, `card`, `compact`).
5. `MagicalButton`: Tactile spring-loaded button with sound cue trigger and haptic feedback.
6. `AnimatedIcon`: 24 custom SVG icons (arrows, sound, stars, crystals, books, compass).
7. `GuideCharacterSvg`: 10 canonical guides with 12 reactive emotional poses.
8. `RewardChip`: High-contrast stardust XP and Star achievement counters.
9. `SkillCrystal`: 3D faceted SVG gemstone reflecting subject mastery state.
10. `WorldPortal`: Living realm entry capsule with atmospheric thumbnail and progress ring.

---

## 33. Stitch Workflow

1. **Prompt Definition:** Describe screens using Direction C design tokens, deep space canvas, glassmorphism, and explicit child touch constraints.
2. **Project Anchor:** Explore and benchmark high-fidelity screens inside Stitch Project `4449806016687673397`.
3. **Design Extraction:** Extract precise layout hierarchy, color harmonies, padding, and typography scales.

---

## 34. Mobbin Reference Workflow

1. **UX Pattern Inspiration Only:** Use Mobbin exclusively to observe world-class interaction ergonomics (e.g. Duolingo ABC, Headspace Kids, Toca Boca, Apple Arcade).
2. **Strict Non-Copying Rule:** Never copy visuals or proprietary iconography. Translate interaction flow wisdom directly into ORBis's Living Universe aesthetic.

---

## 35. Antigravity Implementation Workflow

1. **Bible Alignment:** Verify requirements against this Master Design Bible before writing code.
2. **Component Isolation:** Implement atoms and vessels in `src/components/ui/design/`.
3. **Page Assembly:** Compose the target screen using `UniversalPageShell`.
4. **Pedagogical Wiring:** Link real backend services, curriculum registries, and sound engines.
5. **Multi-Breakpoint Verification:** Validate at 320px, 375px, 430px, 768px, and 1280px.

---

## 36. Design-to-Code Handoff Rules

- Never use ad-hoc hex colors in component code; always reference semantic tokens.
- Every interactive button or clickable surface must explicitly declare `minWidth: 48px`, `minHeight: 48px`, `aria-label`, and sound/haptic triggers.
- Zero presentation Unicode emojis in JSX strings.

---

## 37. QA & Visual Verification Rules

Technical correctness (passing tests, 0 build errors) and visual excellence are **two distinct gates**. A milestone is only passed when:
1. **Automated Verification:** 100% test suites pass, TypeScript reports 0 errors, Vite production build succeeds.
2. **Visual Verification:** The rendered UI is visually inspected on real browser viewports (320px, 375px, 430px, 768px, 1280px) and judged against the **Definition of Premium ORBis**.

---

## 38. Protected Engineering Invariants

The following systems are **absolutely sacred** and must never be refactored or deleted during visual redesigns:
- `curriculumRegistry.ts` (All 348 international academic standards).
- `cinematicLessonsData.ts` (All structured lesson IDs, skills, and scene definitions).
- Canonical 10 Flagship Game Engines (`creatureLabEngine.ts`, `magicMachineEngine.ts`, `potionScalesEngine.ts`, etc.).
- Mastery tracking and activity economy contracts (`masteryService.ts`, `useActivityEconomy.ts`).
- Supabase schema migrations, authentication, and child profile stores.
- Audio synthesis and narration directors (`narrationDirector.ts`, `sfxService.ts`).

---

## 39. Redesign Roadmap

The disciplined phase-by-phase execution plan:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE A: CORE DESIGN TOKENS & ATOMIC FOUNDATION                         │
│          • Implement unified tokens.css & academyTokens.ts              │
│          • Build UniversalPageShell & GlassPanel core components        │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE B: CINEMATIC LESSON THEATER (The Flagship Experience)             │
│          • Redesign LessonPage across all 5 EIS scenes                  │
│          • Full GuideCharacterSvg 12-pose dynamic staging               │
│          • 13 Interactive Manipulative surfaces upgrade                 │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE C: ACADEMY CITADEL & REALM NAVIGATION                             │
│          • Redesign AcademyHomePage (Living learning universe map)       │
│          • Redesign SubjectDetailPage & CourseDetailPage                │
│          • Redesign SkillHubPage with 3D SkillCrystals                  │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE D: STORY STUDIO & COMPREHENSION THEATER                           │
│          • Redesign StoryViewerPage with Word Karaoke Audio             │
│          • Redesign CreateStoryPage wizard and Illustrated Gallery      │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE E: PLAYROOM & SANCTUARY EXPEDITION                                │
│          • Redesign GameUniversePage & Sanctuary personal space         │
│          • Polish 10 Flagship Game entry stages                         │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE F: PARENT ZONE, ONBOARDING & WORLDWIDE LAUNCH                      │
│          • Redesign ParentZone analytics & co-learning cards            │
│          • Redesign Splash, Profile Switcher, and Onboarding            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 40. Definition of "Premium ORBis"

An ORBis screen is defined as **World-Class Premium** when it satisfies the following 7-point rubric:

1. **Aesthetic Transcendence:**  
   It feels like a beautifully produced animated interactive movie from an international studio (e.g. Studio Ghibli, Pixar, Apple Design Award winner), completely devoid of generic web-app tropes.
2. **Tactile Physics:**  
   Every button and draggable card moves with tangible spring physics, soft sound cues, and haptic affirmation.
3. **Living Character Companionship:**  
   The guide character feels sentient, present, gaze-aligned, emotionally responsive, and pedagogically supportive.
4. **Total Cognitive Clarity:**  
   The child instantly understands what to do without reading long instructions.
5. **Acoustic Warmth:**  
   Narration is delivered with natural conversational cadence, theatrical pacing, and dynamic music ducking.
6. **Mobile Ergonomic Perfection:**  
   Flawlessly responsive down to 320px screen width with zero horizontal overflow, zero overlapping text, and large thumb-friendly touch targets ($\ge 48\text{px}$).
7. **Pedagogical Depth:**  
   Underneath the dazzling wonder lies authentic, uncompromised academic rigor that builds lasting intellectual mastery.
