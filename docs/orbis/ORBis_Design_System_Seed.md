# ORBis — Design System Seed Specification
**Document Version:** 1.1.0 (Design Token & Component Seed for Google Stitch)  
**Visual Foundation:** Cinematic 2.5D Cosmic Diorama  
**Authoritative Note:** Google Stitch is strictly a **VISUAL DESIGN SOURCE**. Its design outputs must map directly to and consume existing CSS tokens from `src/styles/tokens.css`. Stitch may refine visual aesthetics, composition, and presentation, but must NOT redefine tokens, alter functional logic, or inject incompatible styling variables.

---

## 1. Color Palette

```
[DEEP COSMOS FOUNDATION]
Base Void:        #04071b  (The infinite canvas --orbis-cosmic-bg-base)
Nebula Core:      #0e1545  (Deep space atmospheric bloom --orbis-cosmic-nebula-core)
Nebula Mid:       #080c2e  (Vibrant star-mist layer --orbis-cosmic-nebula-mid)
Surface Slate:    #0f172a  (Opaque substrate layer --orbis-abyss-900)

[10 CANONICAL REALM ACCENT GLOWS]
Solar Gold:       #fbbf24  (North Star, Citadel, XP, Masteries)
Solar Spark:      #fde047  (Highlights, star particles, focus motes)
Arcane Cyan:      #38bdf8  (Mathematics, Science, Logic, Tech)
Living Emerald:   #10b981  (Science Biome, Nature, Growth, Correct Answers)
Arcane Violet:    #a855f7  (English & Phonics, Explore Hub, Sanctuary)
Golden Amber:     #f59e0b  (Reading, Stories, Creative Writing, Warmth)
Clockwork Indigo: #6366f1  (Computer Science & Coding, Algorithms)
Enigma Rose:      #ec4899  (Logic & Brain Games, Sproutling creatures)
Flame Orange:     #f97316  (Creativity & Arts, Radiance)
Terran Cyan:      #14b8a6  (General Knowledge & World Discovery)

[SEMANTIC UI]
Text Bright:      #f8fafc  (Primary headings, main story text)
Text Muted:       #94a3b8  (Subtitles, metadata, secondary instructions)
Glass Surface:    rgba(15, 23, 42, 0.72)  (Standard floating HUD panels)
Glass Border:     rgba(255, 255, 255, 0.14) (Subtle rim-light border)
Danger Crimson:   #ef4444  (Curfew alert, delete action, PIN error)
```

---

## 2. Typography

- **Display & Headings:** `'Outfit'`, sans-serif (Loaded in `index.html`, defined in `tokens.css`)  
  *Characteristics:* Geometric, friendly, spacious, rounded circular terminals. Perfect for young explorers and energetic gaming titles.  
  *Weights:* 600 (Semi-Bold), 700 (Bold), 800 (Extra Bold), 900 (Black).
- **Body & Interactive UI:** `'Inter'`, sans-serif (Canonical locked font loaded in `index.html` & declared in `tokens.css`)  
  *Characteristics:* Clean, neutral, exceptionally legible at small sizes, open counters, ergonomic on mobile touchscreens.  
  *Weights:* 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold).
- **Story Reader & Classical Lore:** `'Lora'`, serif (Loaded in `index.html`)  
  *Characteristics:* Elegant, high-legibility literary serif designed for smooth long-form reading and read-along highlighting.  
  *Weights:* 400 (Regular), 500 (Medium), 600 (Semi-Bold).

---

## 3. Spacing, Radii & Surface Materials

### Spacing Scale
- `2xs`: `4px` | `xs`: `8px` | `sm`: `12px` | `md`: `16px` | `lg`: `24px` | `xl`: `32px` | `2xl`: `48px` | `3xl`: `64px`

### Corner Radii
- `sm`: `8px` (Tags, chips, small icons)
- `md`: `16px` (Standard glass cards, quest items)
- `lg`: `24px` (Modals, large realm portals, story workspace panels)
- `full`: `9999px` (HUD status pills, circular action buttons)

### Surfaces & Glassmorphism
- **Standard Card:** `background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);`
- **Elevated Interactive Card:** `background: rgba(30, 41, 59, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.22); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(56, 189, 248, 0.2);`
- **Floating HUD Bar:** `background: rgba(10, 14, 40, 0.80); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);`

---

## 4. Organic Lighting & Particle Primitives

### 1. Organic Multi-Cloud Nebula Aura
```css
.nebula-glow {
  filter: blur(36px);
  mix-blend-mode: screen;
  pointer-events: none;
  opacity: 0.85;
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 2. Twinkling Stardust Motes
- Subtle 2–5px glowing circular SVG/CSS stars drifting gently in multi-plane orbits.
- Keyframe animation oscillating scale (`0.6 ➔ 1.3`) and opacity (`0.2 ➔ 1.0`) over 2.5s–4s durations.

### 3. Energy Path Currents
- Flowing constellation lines with SVG `<animateMotion>` transmitting golden/cyan stardust energy packets between landmarks.

---

## 5. Components & Interactive Controls

### Magical Buttons
- **Primary Action (Starlight Glow):** Gradient fill (`#38bdf8` to `#818cf8`), white bold text, subtle outer glow (`0 0 20px rgba(56, 189, 248, 0.4)`), scale `1.03` on hover, `0.97` on active press.
- **Secondary Action (Cosmic Glass):** Translucent glass fill, border `1px solid rgba(255, 255, 255, 0.2)`, gold or cyan text highlight.
- **Icon / HUD Button:** Circular glass pill (`min-size: 44px × 44px`), centered emoji or SVG icon, glowing ring on hover.

### Realm & Portal Cards
- Large 2.5D visual container featuring realm artwork, progress crystal badge (`0/4 stars`), and interactive hover tilt.
- Zero rectangular borders or sharp edges; smooth 24px rounded glass silhouettes.

---

## 6. Accessibility & Sensory Feedback

- **Minimum Touch Target:** `44px × 44px` on all touchable interactive elements.
- **Contrast Ratio:** Text on glass meets WCAG AA standard (`≥ 4.5:1` for body text, `≥ 3:1` for large display headings).
- **Reduced Motion Support:** When `prefers-reduced-motion: reduce` is enabled, all floating animations and canvas particle counts gracefully scale down to static ambient glows.
- **Audio Feedback Integration:** Every interactive click triggers a paired micro-SFX (`star_pop`, `bell_chime`, `portal_whoosh`).
- **Haptic Support:** Taps on mobile trigger light vibration feedback via `@capacitor/haptics`.
