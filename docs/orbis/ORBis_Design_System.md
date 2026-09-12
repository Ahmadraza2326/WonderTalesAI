# ORBis Design System Specification

> **Standard:** Cosmic Glassmorphism, Tactile Child Affordances, High Contrast & Accessibility  
> **Brand Aesthetic:** Wonder, Depth, Stardust, Luminous Gradients, Tactile Physicality (NOT a SaaS dashboard)

---

## 1. Color Foundations & Realm Palettes

```css
:root {
  /* 🌌 Deep Space Neutrals */
  --orbis-void-dark: #020617;
  --orbis-abyss-900: #0f172a;
  --orbis-cosmic-800: #1e1b4b;
  --orbis-slate-700: #334155;
  --orbis-star-text-100: #f8fafc;
  --orbis-muted-400: #94a3b8;

  /* 🏛️ Academic Realm Auras */
  --realm-math: #38bdf8;          /* Celestial Sky Blue */
  --realm-science: #10b981;       /* Living Emerald */
  --realm-english: #a855f7;       /* Arcane Violet */
  --realm-reading: #f59e0b;       /* Golden Amber */
  --realm-coding: #6366f1;        /* Clockwork Indigo */
  --realm-logic: #ec4899;         /* Enigma Rose */
  --realm-creativity: #f97316;    /* Radiance Orange */
  --realm-knowledge: #14b8a6;     /* Terran Cyan */

  /* ✨ Feedback & Semantic */
  --orbis-success: #10b981;
  --orbis-guidance: #f59e0b;
  --orbis-danger: #ef4444;
  --orbis-focus-ring: #38bdf8;
}
```

---

## 2. Typography & Child Readability Hierarchy

* **Font Families:**
  * **Headings & Badges:** `Outfit, -apple-system, system-ui, sans-serif` (High legibility, friendly rounded apertures).
  * **Child Narration & Body:** `Inter, system-ui, -apple-system, sans-serif` (Optimal x-height, clear differentiation of `I`, `l`, `1`).
  * **Numbers & Equations:** `Outfit, 'Courier New', monospace` (Fixed tabular numbers to align place values).

* **Scale & Accessibility:**
  * Minimum interactive text: `14px` (Weight: 700+).
  * Dialogue / Narration: `18px – 22px` (Line height: `1.5`, Letter spacing: `+0.02em`).
  * Touch target titles: `20px – 26px` (Weight: 800+).

---

## 3. Interactive Component Standards

Every interactive component in ORBis must implement 9 distinct states:

| State | Visual Treatment | Audio / Motion Cue |
|---|---|---|
| **Default** | Elevated glass surface with subtle radial glow and $1.5\text{px}$ translucent border. | None (Idle glow). |
| **Hover** | $+4\text{px}$ elevation, scale $1.03\times$, brightened border aura ($0.8$ opacity). | Subtle `sfxService.play('card_flip')`. |
| **Pressed / Active** | Scale $0.97\times$, inner shadow, saturated background fill. | `HapticsService.medium()`. |
| **Focused** | High-contrast double outline ($3\text{px}$ ring with $2\text{px}$ offset). | Keyboard focus indicator. |
| **Disabled** | Opacity $0.35$, greyscale filter, `cursor: not-allowed`. | No-op, subtle haptic denial. |
| **Success** | Radiant emerald pulse ($#10b981$), particle spark emit. | `sfxService.play('match_success')` + Haptic success. |
| **Guidance / Hint** | Gentle amber breath pulse ($#f59e0b$), spotlight cone. | Guide character gesture towards target. |
| **Loading** | Shimmer sweep gradient across glass surface. | Ambient cosmic hum. |
| **Reduced Motion** | Instant opacity cross-fade (bypasses transform scaling). | Standard audio feedback preserved. |

---

## 4. Glassmorphic Surface Specifications

* **Hero Glass:** `background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(16px); border: 1.5px solid rgba(255, 255, 255, 0.15); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);`
* **Card Glass:** `background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px;`
* **Interactive Slot:** `background: rgba(2, 6, 23, 0.6); border: 2px dashed rgba(56, 189, 248, 0.4); min-height: 64px; min-width: 64px;`
