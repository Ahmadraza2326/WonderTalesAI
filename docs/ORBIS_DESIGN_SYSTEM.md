# ORBis Design System — Permanent Master Specification
**Visual Source of Truth for the Entire Product**

> [!IMPORTANT]
> **Source-of-Truth Rule:**
> "The ORBis Design System is the permanent visual source of truth for the product. Future screens may introduce new layouts and functionality, but they must not introduce a competing visual language."

---

## 1. Brand & Visual Philosophy

### 1.1 Personality & Identity
ORBis is a **living creative-learning universe for children**, combining immersive storytelling, structured multi-sensory curricula, cognitive simulation labs, quests, and rewards. It is **NOT** a SaaS dashboard, **NOT** an administrative portal, and **NOT** a flat collection of flashcards.

### 1.2 Emotional & Visual Tone
- **Atmospheric & Cosmic:** Expansive, magical, and deep. The screen is a celestial window into a wondrous universe.
- **Warm & Encouraging:** Never cold, sterile, or clinical. Rich ambient light, friendly tactile shapes, and soft glowing hearths invite exploration.
- **Child-First Premium Quality:** International production value matching premier animated media and interactive children's products (e.g., Duolingo ABC, Toca Boca, Monument Valley, Khan Academy Kids).
- **Subordinate UI Shell:** The UI navigation and controls never overpower the living world; they sit as elegant, frosted-glass instruments guiding the child's journey.

```
                          ┌─────────────────────────────┐
                          │   ORBis COSMIC OVERWORLD    │
                          │   (Universal Central Hub)   │
                          └──────────────┬──────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
        ▼                                ▼                                ▼
┌───────────────┐                ┌───────────────┐                ┌───────────────┐
│    ACADEMY    │                │    STORIES    │                │   PLAYROOM    │
│  Cyan Arcane  │                │  Amber Warm   │                │  Pastel Magic │
│  Curricula    │                │  Story Studio │                │  Physics Labs │
└───────────────┘                └───────────────┘                └───────────────┘
```

---

## 2. Color System

All colors are extracted from the approved master implementation and codified in [`src/styles/tokens.css`](file:///c:/Users/muhammad/WonderTalesAI/src/styles/tokens.css).

### 2.1 Cosmic Neutrals & Canvas
| Token | Hex / Value | Description |
| :--- | :--- | :--- |
| `--orbis-cosmic-bg-base` | `#04071b` | Master deep cosmic void base |
| `--orbis-cosmic-nebula-core` | `#0e1545` | Center radial nebula core glow |
| `--orbis-cosmic-nebula-mid` | `#080c2e` | Mid-space atmospheric ring |
| `--orbis-cosmic-nebula-edge` | `#030514` | Outer cosmic corner shadow |
| `--orbis-surface-glass-dark` | `rgba(10, 14, 40, 0.80)` | Floating HUD and dock surface |
| `--orbis-surface-glass-light` | `rgba(255, 255, 255, 0.08)` | Subordinate badge / button fill |

### 2.2 Celestial & Realm Core Accents
| Token | Hex / Value | Glow Value | Domain / Usage |
| :--- | :--- | :--- | :--- |
| `--orbis-celestial-gold` | `#fde047` | `rgba(253, 224, 71, 0.65)` | North Star, Citadel Beacon, XP, Stars |
| `--orbis-celestial-amber` | `#f59e0b` | `rgba(245, 158, 11, 0.45)` | Quest guidance, milestone badges |
| `--orbis-sector-academy-base`| `#38bdf8` | `rgba(56, 189, 248, 0.45)` | Academy, crystals, science, logic |
| `--orbis-sector-stories-base`| `#ffb84d` | `rgba(255, 184, 77, 0.45)` | Stories, campfire, creative writing |
| `--orbis-sector-playroom-base`| `#f472b6`| `rgba(244, 114, 182, 0.45)`| Playroom, simulation games, toys |
| `--orbis-state-success` | `#10b981` | `rgba(16, 185, 129, 0.45)` | Correct answers, completed quests |
| `--orbis-state-danger` | `#ef4444` | `rgba(239, 68, 68, 0.45)` | Warnings, destructive modal triggers |

### 2.3 Typography Colors
| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--orbis-text-primary` | `#f8fafc` | Main headings, primary values, active labels |
| `--orbis-text-gold` | `#fef08a` | Celestial highlights, child name, badges |
| `--orbis-text-muted` | `#94a3b8` | Subtitles, meta counters, bullet dividers |
| `--orbis-text-dark` | `#1e1b4b` | High-contrast light badge labels (if needed) |

---

## 3. Typography System

### 3.1 Font Families
- **Display Font (`--font-family-display`):** `'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Used for: Brand marks, world titles, level indicators, scores, major headings, and modal titles.
- **Body & Interface Font (`--font-family-body`):** `'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif`
  - Used for: Lesson text, UI controls, navigation labels, HUD tooltips, dialogue.
- **Story Font (`--font-family-story`):** `'Lora', Georgia, 'Times New Roman', serif`
  - Used for: Generative story reading books, narrated story chapters, lore passages.

### 3.2 Type Hierarchy
| Scale | Font Size | Weight | Line Height | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Title** | `clamp(2rem, 4vw, 3rem)` | 900 | 1.1 | `0.04em` | "ORBis" title halo, world headers |
| **Section Header** | `clamp(1.35rem, 2.5vw, 1.85rem)` | 800 | 1.2 | `0.02em` | Modal titles, realm headers |
| **Card Title** | `1.15rem` (18px) | 800 | 1.3 | `0.01em` | Activity titles, lesson cards |
| **Child Readable** | `1.05rem` (17px) | 600 | 1.55 | `0.01em` | Core instructions, dialogue |
| **Badge / Pill** | `0.75rem – 0.875rem` (12–14px) | 800–900 | 1.0 | `0.1em` | Realm pills (`"• ACADEMY"`), HUD |
| **Caption / Meta** | `0.75rem` (12px) | 700 | 1.4 | `0.02em` | XP counters, subtitle details |

---

## 4. Spacing System

ORBis uses an 8pt-based cosmic spacing scale with fluid clamps for responsive balance:

| Token | Size | Primary Usage |
| :--- | :--- | :--- |
| `--spacing-micro` | `4px` | Inner pill padding, badge dot gaps |
| `--spacing-xs` | `8px` | Icon-to-text spacing, dock item gaps |
| `--spacing-sm` | `12px` | Mini card padding, HUD element gaps |
| `--spacing-md` | `16px` | Standard button padding, modal margins |
| `--spacing-lg` | `24px` | Island-to-label spacing, section gaps |
| `--spacing-xl` | `32px` | Major world separation on desktop |
| `--spacing-section` | `48px` | Vertical spacing between master regions |
| `--spacing-cinematic` | `64px` | Hero scene margins on wide monitors |

---

## 5. Shape Language

### 5.1 Radius Tokens
- **Stadium Pill (`--radius-pill: 9999px`):** The signature ORBis container shape for badges, navigation items, XP progress bars, and floating controls.
- **Portal Radius (`--radius-portal: 32px`):** Large interactive hotspots, modal containers, and diorama areas.
- **Panel Radius (`--radius-panel: 24px`):** Quest modals, profile dialogues, and major activity cards.
- **Card Radius (`--radius-card: 16px`):** Lesson cards, minigame items, and HUD chips.
- **Soft Radius (`--radius-soft: 8px`):** Subordinate UI controls and tooltips.

### 5.2 Geometric Rules
- **Pills for Navigation & Badges:** Every realm label, status pill, and dock tab must use `border-radius: 9999px`.
- **Soft Curvature:** Never use sharp 90° rectangular cards or harsh square borders.
- **Organic World Integration:** Artwork must NEVER be confined inside a visible square or rectangular picture frame.

---

## 6. Glass & Surface Language

ORBis surfaces represent magical crystalline plates floating in deep space.

### 6.1 Surface Tokens
```css
/* Master Dock & HUD Surface */
background: rgba(10, 14, 40, 0.80);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1.5px solid rgba(255, 255, 255, 0.15);
box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(99, 102, 241, 0.25);

/* Gold Stadium Pill */
background: linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
border: 2px solid rgba(253, 224, 71, 0.75);
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6), 0 0 20px rgba(253, 224, 71, 0.45);
```

### 6.2 Layering Architecture
1. **Layer 0 (Infinite Cosmos):** Background gradient + WebGL/Canvas ambient particle field (`z-index: 0`).
2. **Layer 1 (Luminous Streams):** Vector bezier stardust paths linking celestial worlds (`z-index: 2`).
3. **Layer 2 (Living Worlds / Artwork):** Master artwork / floating islands (`z-index: 10`).
4. **Layer 3 (Interactive Hotspots):** Invisible touch targets with hover radial glows (`z-index: 20`).
5. **Layer 4 (Navigation Shell):** Floating top header and bottom dock (`z-index: 50`).
6. **Layer 5 (Modals & Overlays):** Daily Quest modal, Explorer Codex (`z-index: 100`).

---

## 7. Glow & Lighting System

Glows in ORBis are **volumetric energy fields**, not generic CSS box-shadows.

### 7.1 Multi-Layer Radial Glows
Every interactive landmark features a dual-layer radial aura on hover:
- **Inner Aura:** High-opacity, sharp blur (e.g., `rgba(56, 189, 248, 0.45)`, `filter: blur(16px)`, `inset: -8%`).
- **Outer Bloom:** Low-opacity, wide-dispersion bloom (e.g., `rgba(56, 189, 248, 0.18)`, `filter: blur(32px)`, `inset: -20%`).

### 7.2 Realm Lighting Signatures
- **North Star:** Warm golden lens flare bloom (`#fef08a` / `#fde047`).
- **Citadel Beacon:** Upward volumetric beacon cone with golden radial hearth (`#fde047` / `#fbbf24`).
- **Academy:** Arcane cyan crystal luminescence (`#38bdf8` / `#2dd4bf`).
- **Stories:** Warm flickering twilight campfire amber (`#ffb84d` / `#f43f5e`).
- **Playroom:** Iridescent pastel pink & lavender soft bloom (`#f472b6` / `#c084fc`).

---

## 8. Artwork Integration System

### 8.1 Zero-Box Rule
> [!IMPORTANT]
> **Zero-Box Rule:**
> Illustrated artwork must NEVER look like a rectangular JPEG placed inside a webpage container.

### 8.2 Seamless Masking & Feathering
When integrating artwork into the cosmic canvas:
```css
/* 1. Radial Edge Feathering */
-webkit-mask-image: radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0) 100%);
mask-image: radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0) 100%);

/* 2. Isolated Island Screen Blending */
mix-blend-mode: screen;

/* 3. Drop Shadow Separation */
filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 16px var(--realm-glow));
```

### 8.3 Viewport Proportions
- On desktop, scale the central diorama to `height: min(calc(100vh - 110px), 880px)` with `aspect-ratio: 768 / 1376` and `object-fit: contain` so all 5 landmarks (North Star, Citadel, Academy, Stories, Playroom) fit comfortably in the viewport without vertical scrolling.

---

## 9. Component Language

### 9.1 Stadium Pill Badges
Used for realm tags and status indicators:
- Height: `28px – 34px`.
- Rounded: `border-radius: 9999px`.
- Dot: `6px – 8px` glowing colored orb on the left.
- Typography: Uppercase display font, `font-weight: 900`, `letter-spacing: 0.1em`.

### 9.2 Floating Quick Navigation Dock
- Centered at `bottom: 16px`, `z-index: 50`.
- Frosted glass container with pill navigation tabs.
- Active Tab: Golden gradient highlight (`linear-gradient(135deg, rgba(253, 224, 71, 0.3), rgba(245, 158, 11, 0.35))`) with glowing gold border.

### 9.3 Stardust XP Tube
- Height: `4px – 6px`.
- Background: `rgba(255, 255, 255, 0.12)`.
- Fill: `linear-gradient(90deg, #38bdf8 0%, #fde047 100%)`.
- Glowing head cap with `box-shadow: 0 0 8px #fde047`.

### 9.4 Daily Quest / Codex Modal
- Centered overlay with backdrop blur (`backdrop-filter: blur(20px)`).
- Surface: `#0a0e28` with golden border (`1.5px solid rgba(253, 224, 71, 0.5)`).
- Close Button: Circular frosted pill at top right.

---

## 10. Realm Identities (Sub-Systems)

All 3 realms are **sub-identities** that inherit the global ORBis cosmic rules:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ORBis MASTER DESIGN SYSTEM                      │
│        (Cosmic Depth • Glassmorphism • Stadium Pills • 60fps Motion)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
         ▼                          ▼                          ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│     ACADEMY     │        │     STORIES     │        │    PLAYROOM     │
│ • Cyan (#38bdf8)│        │ • Amber (#ffb84d│        │ • Pink (#f472b6)│
│ • Teal Crystals │        │ • Rose Lanterns │        │ • Lavender Mist │
│ • Arcane Portal │        │ • Cozy Campfire │        │ • Cloud Lawns   │
│ • Grand Library │        │ • Story Studio  │        │ • Physics Labs  │
└─────────────────┘        └─────────────────┘        └─────────────────┘
```

---

## 11. Navigation System

### 11.1 Top Header
- Fixed or sticky at top of viewport.
- Left: Animated planet logo mark + `"ORBIS AI"` brand title.
- Center: Quick navigation links to Overworld, Academy, Stories, Playroom, Explore.
- Right: Level badge, XP counter, Stars counter, Streaks, Audio mute toggle, Music toggle, Theme toggle.

### 11.2 Bottom Navigation Dock
- Fixed at `bottom: 16px`, centered horizontally.
- Touch-friendly minimum target height of `48px`.
- Subordinate glassmorphism appearance so the living artwork dominates the screen.

---

## 12. Motion & Animation System

- **Spring Dynamics:** `cubic-bezier(0.34, 1.56, 0.64, 1)` for snappy, playful hover lifts.
- **Island Floating Keyframe:** 5s smooth vertical oscillation (`translateY(-8px)` to `translateY(0px)`).
- **Stardust Dash Keyframe:** Continuous vector path dash animation (`stroke-dashoffset` animation).
- **GPU Acceleration:** All transforms use `transform: translate3d(...)` or `scale(...)` with `will-change: transform`.
- **Accessibility:** `@media (prefers-reduced-motion: reduce)` automatically sets animation durations to `0.01ms`.

---

## 13. Responsive Viewport Strategy

ORBis scales across all major device tiers without losing composition integrity:

| Device Tier | Viewport Width | Layout & Scaling Strategy |
| :--- | :--- | :--- |
| **Large Desktop (16:9 / 4K)** | $\ge 1440\text{px}$ | Edge-to-edge cosmos; artwork centered at `max-height: 880px`; floating dock centered. |
| **Laptop / Standard Screen** | $1024\text{px} – 1439\text{px}$ | Artwork scaled to `height: min(calc(100vh - 110px), 800px)`; zero clipping. |
| **Tablet (Portrait & Landscape)**| $768\text{px} – 1023\text{px}$ | Responsive container width (`max-width: 92vw`); hotspots scale proportionally. |
| **Phone Portrait** | $360\text{px} – 767\text{px}$ | Artwork fills available width; bottom dock converts to compact thumb bar; touch targets $\ge 48\text{px}$. |
| **Phone Landscape** | Height $< 500\text{px}$ | Compact header; artwork scales by height to prevent vertical scrolling. |

---

## 14. Accessibility (A11y) Standards

- **Touch Target Minimums:** All interactive hotspots and buttons must have a minimum clickable area of `48px × 48px` (exceeding WCAG 2.1 AA).
- **High Contrast Ratios:** Text on glass surfaces maintains at least $4.5:1$ contrast against the dark background.
- **Keyboard Navigation:** All landmarks have standard focus rings (`outline: 2px solid #38bdf8`) when focused via `Tab`.
- **Screen Reader Semantics:** Hotspots use explicit `aria-label` attributes describing the world, level, and action.
- **Reduced Motion:** System honors `prefers-reduced-motion: reduce`.

---

## 15. Explicit Design Rules (NEVER DO)

> [!CAUTION]
> **Strict Prohibitions for all ORBis Development:**
> 1. **NEVER** build generic SaaS dashboards with white rectangular cards and grey sidebars.
> 2. **NEVER** wrap illustrations or realm art in visible rectangular picture boxes.
> 3. **NEVER** use random, unapproved gradient palettes outside the documented cosmic and realm color tokens.
> 4. **NEVER** use harsh 90° square corners for interactive components (always use pill or soft curved geometry).
> 5. **NEVER** add heavy text paragraphs or explanatory UI clutter to the Overworld.
> 6. **NEVER** create competing visual systems for new features—always extend the ORBis token tree.
> 7. **NEVER** hardcode ad-hoc CSS colors when an existing token exists in [`tokens.css`](file:///c:/Users/muhammad/WonderTalesAI/src/styles/tokens.css).

---

## 16. Future Screen Implementation Hierarchy

Every new screen built for ORBis must adhere to this exact priority order:

1. **ORBis Master Design System:** Follow background cosmos, glassmorphism, typography, and shape rules.
2. **Existing Reusable Components:** Use [`GlassPanel`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/GlassPanel.tsx), [`Button`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/Button.tsx), [`AnimatedIcon`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/AnimatedIcon.tsx), [`ParticleField`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/ParticleField.tsx).
3. **Realm-Specific Sub-Identity:** Apply the respective accent color and theme (Academy cyan, Stories amber, Playroom pink).
4. **Screen-Specific Requirements:** Layout lessons, games, or workspace interactions within the established container rules.
5. **New Visual Invention:** Permitted **ONLY** when an interaction has no precedent in the design system, and must strictly follow the shape and glass language.

---

## 17. Unresolved Design Decisions (For Future Collaborative Review)

The following items cannot be fully derived from the existing implementation and are explicitly recorded for future design alignment:

- `UNRESOLVED — REQUIRES DESIGN DECISION`: **Parent Zone Visual Language** — Whether the Parent Zone should use a lighter, clean editorial aesthetic (to signify adult administrative authority) or maintain the dark cosmic glassmorphism of the child universe.
- `UNRESOLVED — REQUIRES DESIGN DECISION`: **Landscape Native App Orientation Lock** — Whether tablet and mobile native apps should lock to landscape mode by default or support dynamic rotation.
