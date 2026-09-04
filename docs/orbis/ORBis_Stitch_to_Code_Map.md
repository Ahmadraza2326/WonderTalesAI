# ORBis Stitch-to-Code Implementation Blueprint

---

## 1. Architectural Pipeline & Overview

This document defines the strict translation pipeline from high-fidelity Stitch visual designs (Project `4449806016687673397` — Direction C: *Living Learning Universe*) to production-ready, accessible, modular React TypeScript components in the WonderTales/ORBis codebase.

Every design asset and layout is mapped down to:
1. **Stitch Screen Instance ID**
2. **UX Purpose & Child Cognitive Intent**
3. **Target React Component & File Path**
4. **CSS Master Tokens & Theme Variables**
5. **Motion & Interaction Timings**
6. **Data & State Bindings**
7. **Responsive & A11y Rules**

---

## 2. Master Screen-to-Code Mapping Matrix

### 2.1 Screen: "The Celestial Academy Hub" (Discovery & Realm Selection)
- **Stitch Instance:** `assets_419f1ffbf1be4d88b11c92a4e7a9a99a` / `0de0878e25b043ebb5d00f15b61e9bad`
- **UX Purpose:** The primary universe entrance for the child learner. Allows spontaneous exploration of 10 academic realms through glowing celestial portals, presenting "Today's Quest" with living character guidance.
- **Component File:** [`src/pages/academy/AcademyHomePage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/AcademyHomePage.tsx)
- **Sub-Components Used:**
  - `WorldPortal.tsx` (10 Realm Portals with ambient glow & parallax)
  - `GuideCompanionAvatar.tsx` (Living guide in top-right communication ring)
  - `RewardChip.tsx` (Stardust Star & XP counter in glass header)
  - `MagicalButton.tsx` (Primary "Resume Journey" CTA)
  - `ParticleField.tsx` (Background celestial stardust simulation)
- **Master Tokens Bound:**
  - Background: `var(--orbis-void-dark)` (`#020617`)
  - Realm Auras: `var(--orbis-realm-math-glow)`, `var(--orbis-realm-science-glow)`, etc.
  - Surface Elevation: `var(--glass-surface-hero)`
  - Typography: `var(--font-headline)` (Outfit 32px), `var(--font-body)` (Inter 16px)
- **Motion Spec:**
  - Portal floating animation: `4.5s ease-in-out infinite alternate`
  - Portal hover scale: `1.03x` with `var(--motion-duration-short)` (240ms)
- **A11y & Responsive Bounds:**
  - Mobile (<640px): 1-column vertically scrollable realm track.
  - Tablet/Desktop (>=768px): 2-to-4 column celestial constellation grid.
  - ARIA: `aria-label="Enter Mathematics Realm"`, keyboard navigable with `Tab` and `Space/Enter`.

---

### 2.2 Screen: "The Cinematic Lesson Stage" (Gold Benchmark Experience)
- **Stitch Instance:** `ab24b16c3279428b81ebed0b82ae58b3` / `060b3f8aa9764b57af9199b8e2dbaa90`
- **UX Purpose:** The 5-scene staged teaching arena for `lesson_g2_array_multiplication` ("Array Alchemy & Multiplication"). Houses living guide acting, direct star-array manipulation, dynamic equation emergence, and celebratory reflection.
- **Component Files:**
  - [`src/components/academy/lesson/cinematic/CinematicLessonPlayer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/CinematicLessonPlayer.tsx)
  - [`src/components/academy/lesson/cinematic/LessonSceneRenderer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/LessonSceneRenderer.tsx)
  - [`src/components/academy/lesson/manipulatives/StarArrayManipulative.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/manipulatives/StarArrayManipulative.tsx)
  - [`src/components/academy/guide/GuideCharacterSvg.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/guide/GuideCharacterSvg.tsx)
  - [`src/components/ui/design/LessonProgressRail.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/LessonProgressRail.tsx)
  - [`src/components/ui/design/InteractionSurface.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/InteractionSurface.tsx)
- **Master Tokens Bound:**
  - Canvas Backdrop: `var(--glass-surface-slot)` with `border: 1px dashed rgba(56, 189, 248, 0.4)`
  - Active Drag Item: `var(--orbis-realm-math-base)` (`#38bdf8`) with `filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.8))`
  - Scaffolding Halo: `var(--orbis-glow-gold)` (`#f59e0b`)
- **Motion Spec:**
  - Drag spring release: `300ms cubic-bezier(0.34, 1.56, 0.64, 1)`
  - Equation reveal: `650ms var(--motion-ease-out)`
  - Confetti burst on Scene 5: `1,200ms` physics particle expansion
- **A11y & Responsive Bounds:**
  - Touch targets for stars: $\ge 56\text{px} \times 56\text{px}$.
  - Live audio narration with subtitle banner pinned to bottom stage.
  - High-contrast toggle for stage grid lines.

---

### 2.3 Screen: "The Magic Machine Engine Room" (Gold Game Experience)
- **Stitch Instance:** `9b2a4ea288934014b831a894dd9401d9`
- **UX Purpose:** The capstone gameplay station where multiplication array concepts power the spaceship's energy generator and warp coils.
- **Component File:** [`src/components/playroom/stations/MagicMachineLab.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/MagicMachineLab.tsx)
- **Sub-Components Used:**
  - `InteractionSurface.tsx` (Interactive machine assembly grid)
  - `SkillCrystal.tsx` (Energy power cell charged by correct arrays)
  - `MagicalButton.tsx` (Tactile "Activate Machine" lever)
  - `AnimatedIcon.tsx` (Gear, Lightning, Star, Sparkle status icons)
- **Master Tokens Bound:**
  - Machine Housing: `var(--orbis-abyss-900)` (`#0f172a`) with bronze/gold trims
  - Energy Arc: `var(--orbis-realm-science-base)` (`#10b981`)
- **Motion Spec:**
  - Gear rotation speed: `0.8s linear infinite` when active
  - Battery charge pulse: `400ms ease-out` per completed row
- **A11y & Responsive Bounds:**
  - Full keyboard control (`Arrow` keys to select slot, `Space` to place crystal).
  - Reduced-motion mode replaces spinning gears with glowing status badges.

---

### 2.4 Screen: "The Mythical Creature Sanctuary" (Living Reward Ecosystem)
- **Stitch Instance:** `a9084ac7238d4c6b95c5187fbe794b7b`
- **UX Purpose:** Emotional reward hub where learners feed, care for, and awaken mystical learning companions using stars earned in lessons.
- **Component File:** [`src/pages/SanctuaryPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/SanctuaryPage.tsx)
- **Sub-Components Used:**
  - `GlassPanel.tsx` (Habitat biomes: Cosmic Nest, Crystal Cave, Star Grove)
  - `RewardChip.tsx` (Essence and Star resource counters)
  - `MagicalButton.tsx` (Tactile Feed, Pet, Play action buttons)
- **Master Tokens Bound:**
  - Habitat Glow: `var(--orbis-realm-creativity-glow)` (`rgba(236, 72, 153, 0.4)`)
  - Creature Card: `var(--glass-surface-card)`
- **Motion Spec:**
  - Creature breathing: `3.0s ease-in-out infinite alternate`
  - Feeding arc: `500ms parabolic path` from inventory tray to creature mouth
- **A11y & Responsive Bounds:**
  - Voice cues for creature mood changes (*"Starlight Dragon looks curious!"*).
  - Minimum 48px action buttons with high-contrast text.

---

## 3. Implementation Verification Checklist

- [x] Master tokens defined in `src/styles/tokens.css` and imported globally in `src/index.css`.
- [x] 11 bespoke UI primitives exported in `src/components/ui/design/index.ts`.
- [x] Zero external icon or emoji dependencies in UI primitives.
- [x] Touch target constraints ($\ge 48\text{px}$) enforced across all interactive boundaries.
- [x] Reduced-motion media queries implemented across all CSS animations and components.
