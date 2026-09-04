# ORBis — Design-to-Code Implementation Contract
**Document Version:** 1.1.0 (Engineering & Stitch Integration Boundary Contract)  
**Purpose:** Defines strict non-negotiable boundaries between Stitch visual design and existing React/TypeScript application logic.

---

## 1. The Core Implementation Rule

> **CRITICAL RULE:**  
> Google Stitch is strictly a **VISUAL DESIGN SOURCE**, not an application generator.  
> When Antigravity implements Stitch designs in the ORBis codebase, it must **ADAPT THE EXISTING APPLICATION CODE TO THE NEW VISUAL DESIGN** rather than replacing working engines, services, or data contracts with raw AI-generated boilerplate.

---

## 2. Boundary Matrix: What Stitch May Influence vs. What Must NOT Change

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        STITCH DESIGN FREEDOM (VISUAL SOURCE ONLY)                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ✅ Visual Hierarchy & Page Compositions                                               │
│  ✅ Layouts, Section Spacing & Responsive Flex Containers                              │
│  ✅ Typography Scales, Font Weight Distributions (within Outfit, Inter & Lora)         │
│  ✅ Component Framing, Glassmorphism Opacities, Shadows & Ambient Depth                │
│  ✅ Decorative Elements, Floating Crystal Badges & Realm Iconography                   │
│  ✅ Animation Timings, Parallax Speeds & Particle Densities                             │
│  ✅ Organic Nebula Silhouette Styling & Volumetric Lighting Blooms                     │
│  ✅ Visual Progress Indicators, Radar Charts & Floating HUD Styling                    │
│  ✅ Responsive Mobile & Desktop Layout Presentations                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        FROZEN ENGINEERING CONTRACT (NEVER TOUCH)                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ❌ All 62 Application Route Declarations & Mappings in AppRouter.tsx (incl. aliases)   │
│  ❌ 10 Academic Realm IDs & 348 Micro-Skill Mastery Data Contracts                     │
│  ❌ Cinematic Lesson Timeline Step State Machine (`cinematicLessonsData.ts`)           │
│  ❌ All 11 Simulation Game Physics, Solvers, PRNGs & State Machines (`services/games/`)│
│  ❌ AI Story DNA Schemas & Gemini Provider Integrations (`src/services/ai/`)           │
│  ❌ Web Audio SFX Synthesizer Frequencies & Narration Queues (`services/audio/`)       │
│  ❌ XP Formulas, Star Balances, Streak Trackers, Tier Math & Quota Limits              │
│  ❌ Supabase Auth Handlers, Session Persistence & PostgreSQL Table Schemas             │
│  ❌ Parent PIN Gate Verification Logic, Crypto Hashes & Screen-Time Curfew Math        │
│  ❌ Capacitor Haptics Hardware Bridge Calls (`HapticsService.ts`)                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Known Regression Guardrails

During implementation of Stitch designs, Antigravity must actively guard against these specific architectural guardrails:

1. **Stale Vite Dev Server Memory Regressions:**  
   *Problem:* Long-running background Vite processes can cache stale module graph transforms, returning empty sourcemap stubs (171 bytes) resulting in a blank white browser screen.  
   *Guardrail:* Kill legacy Node processes and verify HTTP 200 + valid module size (`> 5 KB`) on all route bundles.
2. **Explore Landmark Routing Confusion:**  
   *Problem:* Directing `/explore` to `/sanctuary` instead of the central Explore Observatory Hub.  
   *Guardrail:* Ensure the Explore landmark routes strictly to [`ExplorePage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/ExplorePage.tsx) at `/explore`, which contains portals to all 6 sub-experiences.
3. **Rectangular Landmark Outlines / Focus Boxes:**  
   *Problem:* Browser default focus rings or CSS rectangular card wrappers appearing around overworld landmarks.  
   *Guardrail:* Use transparent borderless `<button>` elements with CSS resets (`outline: none; background: transparent;`) and multi-cloud organic SVG/CSS Gaussian blur auras (`blur(28px - 32px)`).
4. **Duplicate Navigation Systems on Home:**  
   *Problem:* Rendering top navbar links (`Overworld`, `Academy`, `Stories`, `Playroom`, `Explore`) or mobile bottom docks on `/`.  
   *Guardrail:* Ensure `AppShell.tsx` and `Header.tsx` conditionally suppress section navigation on `/` and `/overworld`.
5. **Citadel Landmark Wiring Discrepancy (Implementation Issue):**  
   *Problem:* In the current codebase (`MasterCelestialOverworld.tsx` lines 306–310), clicking the Citadel landmark opens the North Star `DailyQuestModal`.  
   *Guardrail:* The intended canonical behavior is that the Citadel landmark opens the `CentralOrbisCitadel` command center modal. In this documentation phase, we record this wiring discrepancy as a known implementation issue to be resolved in code implementation without breaking existing logic.
6. **Legacy HomePage Deprecation:**  
   *Problem:* `src/pages/HomePage.tsx` contains an old card-grid hero layout that violates the frozen 2.5D Overworld direction.  
   *Guardrail:* `HomePage.tsx` is strictly deprecated/orphaned legacy code. The canonical `/` and `/overworld` route remains `OverworldPage.tsx`. Do not re-introduce or style `HomePage.tsx`.

---

## 4. Google Stitch Step-by-Step Project Setup & Generation Sequence

### Step 1: Stitch Project Initialization
- **Project Name:** `ORBis Cosmic Learning Universe`
- **Design System Name:** `ORBis Cosmic 2.5D Diorama`
- **Initial Viewport Preset:** Desktop Landscape (`1440 × 900`) + Responsive Mobile Variant (`390 × 844`).

### Step 2: The First Stitch Prompt (Design System + Master Overworld)
```text
Create the Master Design System and Canonical Home Overworld for ORBis, a premium children's cosmic learning universe.

VISUAL THEME: Cinematic 2.5D Cosmic Diorama.
BACKGROUND: Deep celestial space (#04071b to #0e1545) with vibrant stardust nebula clouds, glowing constellation lines, and floating stardust particles.

CENTRAL COMPOSITION (No rectangular cards, no sidebars, no bottom dock):
A 100vw x 100vh landscape cosmic diorama with 6 illuminated interactive celestial landmarks:
1. North Star (top apex): Brilliant solar star radiating gentle light beams.
2. ORBIS Citadel (central cosmic island): Floating crystalline castle island with golden aura.
3. Academy (upper-left floating island): Floating arcane library island with cyan/blue starlight glow.
4. Stories (upper-right floating island): Floating storybook treehouse island with warm amber sunfire glow.
5. Playroom (lower-left floating island): Floating gaming lab island with vibrant neon rose/pink glow.
6. Explore (lower-right floating island): Celestial starlight observatory dome with arcane violet glow.

INTERACTION PRIMITIVE:
When hovering or touching any landmark, it emits an organic, multi-cloud gaseous nebula bloom (Gaussian blurred 36px, screen blend mode) and floating stardust motes. Absolutely NO rectangular borders, hard boxes, or circular buttons.

TOP FLOATING HUD:
- Left: Glowing "ORBIS AI" brand mark with Explorer rank pill.
- Center: Level 3 Explorer pill, 1,420 XP progress bar, 85 Starlight Stars (★), 7-day streak (🔥).
- Right: Subtle glass pill controls for Audio, Music, Theme, and active Child Explorer Avatar.

Include responsive mobile variant showing compact HUD and centered cosmic diorama with touch-scaled landmark nodes.
```

### Step 3: Exact Screen-by-Screen Stitch Generation Order
After approving the Master Overworld screen, generate subsequent screens in this exact dependency order:

1. **Screen 1:** `ORBis Design System Tokens & Component Library` (Glass cards, magical buttons, crystal progress chips, HUD bar).
2. **Screen 2:** `Master Celestial Overworld (Home /)` (Desktop & Mobile, 6 landmarks, organic nebula glow).
3. **Screen 3:** `Daily Guidance & Quests Modal` (North Star modal with starlight scroll & streak counter).
4. **Screen 4:** `Cosmic Citadel Command Modal` (Central Citadel overview, realm mastery radar & milestones).
5. **Screen 5:** `Academy Main Hub (/academy)` (10 Floating Realm subject portals & "Ask Orbis" AI button).
6. **Screen 6:** `Academy Realm Course & Skill Track (/academy/subject/:id)` (Course roadmap with glowing nodes).
7. **Screen 7:** `Cinematic Storybook Lesson Stage (/academy/lesson/:id)` (Character stage, dialogue bubble, interactive quiz).
8. **Screen 8:** `Adaptive Skill Practice Workbench (/academy/practice/:id)` (Interactive question card & streak celebration).
9. **Screen 9:** `Academy Specialized Labs` (`/academy/library`, `/academy/think`, `/academy/science`, `/academy/projects`).
10. **Screen 10:** `Storybook Reader Collection (/stories)` (Illustrated book cards with audio preview pills).
11. **Screen 11:** `Story Flipbook Reader Studio (/stories/:id)` (Paginated book, read-along word highlight, audio player).
12. **Screen 12:** `AI Story Generation Studio (/stories/new)` (Tactile genre/character selectors & prompt builder).
13. **Screen 13:** `Playroom Games Universe Hub (/playroom)` (Arcade stations for 11 brain simulation games).
14. **Screen 14:** `Creature Lab Station (/games/creature-lab)` (Elemental alchemy cauldron & essence vials).
15. **Screen 15:** `Magic Machine Station (/games/magic-machine)` (Physics playground with springs, gears & ramps).
16. **Screen 16:** `Cosmic Constellation Station (/games/constellations)` (Star-connecting geometric puzzle & celestial lore).
17. **Screen 17:** `Explore Observatory Hub (/explore)` (6 Celestial portal glass cards to Library, Studio, Sanctuary, Passport, Parent Zone, Profile).
18. **Screen 18:** `Starlight Sanctuary Nursery (/sanctuary)` (Elemental creature habitat, feeding & petting stage).
19. **Screen 19:** `Explorer Adventure Passport (/passport)` (Cosmic passport book with realm milestone stamps).
20. **Screen 20:** `Parent Insights & Curfew Center (/parent-zone)` (PIN keypad, screen-time dials, cognitive radar).
21. **Screen 21:** `Protected Explorer & Parent Dashboard (/dashboard)` (Family story archive & adventure manager).
22. **Screen 22:** `Child Profile Switcher & Settings (/profile)` (Avatar selector, audio sliders, language toggle).
23. **Screen 23:** `Authentication & Account Recovery` (`/auth`, `/reset-password`).
24. **Screen 24:** `Victory Celebration & Reward Modals` (Stardust confetti, star payout counter, leveling banner).
