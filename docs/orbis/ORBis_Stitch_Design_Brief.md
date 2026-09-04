# ORBis — Stitch Master Design Brief
**Document Version:** 1.1.0 (Design Specification for Google Stitch Project)  
**Visual Foundation:** Cinematic 2.5D Cosmic Diorama  
**Master Visual Reference:** `public/assets/overworld/orbis_overworld_master.jpg`  
**Purpose:** Directs Google Stitch to generate the complete, unified visual universe for ORBis without generic SaaS, EdTech dashboard, or card-heavy cliches.

---

## 1. Product Vision & Essence

ORBis is a premium international children’s creative learning universe that unites interactive storytelling, structured 10-realm academic curriculum, brain-development simulation games, an elemental companion sanctuary, and child-led creative expression into a single cohesive cosmos.

### What ORBis Is:
- **A Living Magical Universe:** A rich, tactile, volumetric cosmos where learning realms float as illuminated celestial islands and celestial observatories.
- **A Premium Children’s Game:** High production value, dynamic lighting, subtle particle physics, stardust dust motes, and rewarding interactions.
- **An Interactive Storybook & Diorama:** Immersive depth, cinematic 2.5D perspective, rich visual textures, and organic micro-animations.
- **A Tactile Digital Toy:** Interfaces invite exploration through glowing energy currents, physical dials, tactile switches, and magical light blooms.

### What ORBis Is NOT:
- ❌ **Generic SaaS / Productivity Dashboard:** No rectangular grey panels, mundane KPI tables, sterile data grids, or sidebar navigation trees.
- ❌ **Generic EdTech Portal:** No boring flat cards with generic stock icons, rigid progress bars, or sterile quiz layouts.
- ❌ **Generic "Glassmorphism Cliché":** Translucent glass is a subtle material accent for readability—NOT the sole visual identity.
- ❌ **Box-Inside-A-Box Webpage:** No triple-nested containers, portrait phone mockups placed on desktop screens, or white background margins.

---

## 2. The Master Overworld (Home Screen)

- **Canonical Route:** `/` (with `/overworld` as backward-compatible alias).
- **Core Concept:** The Overworld map **is** the navigation. The user explores the world directly rather than clicking a menu.
- **Master Reference Composition:**
  ```
                     [NORTH STAR]
                  (Daily Guidance & Quests)
                             ↘
                    [ORBIS CITADEL]
                      (Cosmic Home Base)
                      /              \
            [ACADEMY]                  [STORIES]
        (10 Academic Realms)       (Storybook Library & AI Studio)
                      \              /
            [PLAYROOM]                 [EXPLORE]
       (11 Brain Simulation Labs)  (Observatory Hub & Sanctuary)
  ```

### Key Architectural Rules for Home:
1. **Edge-to-Edge Cosmic Diaroma:** Occupies 100vw × 100vh with seamless celestial gradients, deep space dust, and drifting constellations.
2. **Zero Secondary Navigation on Home:**
   - No top section navigation links (`Overworld`, `Academy`, `Stories`, `Playroom`, `Explore`).
   - No bottom navigation dock on Home.
   - No left/right sidebars.
3. **Minimal Floating Global HUD Only:**
   - Top-Left: Glowing ORBis brand mark & explorer title badge.
   - Top-Center: Explorer Level & XP progress pill, Star currency count (`★`), Day streak counter (`🔥`).
   - Top-Right: Sound toggle, Music toggle, Theme/Accessibility trigger, Active Child Profile avatar.

---

## 3. Organic Interaction Language (Critical Requirement)

Landmark interaction must **NEVER** use geometric shapes:
- ❌ No rectangles, squares, or rounded border outlines.
- ❌ No geometric circles or ellipses.
- ❌ No visible button-shaped overlay cards or hover boxes.
- ❌ No hard purple/pink focus rings.

### The Organic Nebula Primitive:
When a child hovers, touches, or points to any landmark or interactive world:
1. **Gaseous Nebula Bloom:** Multi-cloud, irregular gaseous wisps fade in behind the world using soft Gaussian blur (30px–45px) and screen blend modes.
2. **Drifting Stardust:** 5–8 tiny glowing dust motes gently float outward from the island center.
3. **Volumetric Light:** The landmark itself brightens subtly (10%–15% exposure bloom), as if waking up from within.
4. **Active Activation Burst:** On click/tap, a brief radial burst of 20–30 sparkling stardust particles erupts outward, accompanied by a crystalline chime SFX, before smoothly transitioning into the destination.

#### Domain Color Palette for Landmark Blooms:
- **North Star & Citadel:** Celestial Solar Gold (`#fbbf24` / `#fde047`)
- **Academy:** Arcane Cyan & Astral Blue (`#38bdf8` / `#60a5fa`)
- **Stories:** Warm Amber, Sunfire Orange & Rose (`#f59e0b` / `#fb923c`)
- **Playroom:** Playful Cosmic Magenta & Neon Pink (`#ec4899` / `#d946ef`)
- **Explore Observatory:** Deep Starlight Violet & Amethyst (`#a855f7` / `#c084fc`)

---

## 4. Explore Hub Architecture

Explore is a dedicated **Celestial Observatory Hub** at `/explore`—**it is NOT a direct jump to Sanctuary**.

### 6 Canonical Portals within Explore Hub:
1. **Universal Library (`/academy/library`):** Full catalog of realm readers, story collections, and audiobooks.
2. **Creative Studio (`/academy/create`):** Starlight drawing canvas, musical melody sequencer, and invention workbench.
3. **Starlight Sanctuary (`/sanctuary`):** Mythical creature nursery where explorers hatch, feed, pet, and level up companions.
4. **Explorer Passport (`/passport`):** Travel log of unlocked realm stamps, achievement badges, and cosmic milestones.
5. **Parent Zone (`/parent-zone`):** Screen-time curfew controls, cognitive radar analytics, and subject insights (PIN-gated).
6. **Profile & Settings (`/profile`):** Multi-child explorer switcher, avatar customizations, audio levels, and language preferences.

---

## 5. Visual Quality Bar & Prohibitions

In Stitch, all screen designs must adhere to this quality bar:
- **Unified Atmospheric Cohesion:** All sub-pages (Academy, Stories, Games, Parent Zone) exist within the same cosmic universe.
- **Layering & Depth:** Use 3 distinct visual depth planes:
  1. *Background:* Distant nebula clouds, slow starfield parallax, ambient dust.
  2. *Midground:* Interactive world elements, floating stone pedestals, illuminated stages.
  3. *Foreground:* Tactile HUD, glass controls, floating action cues.
- **Prohibited Clichés:**
  - No generic white bootstrap/tailwind dashboard cards.
  - No 3-layer nested card layouts.
  - No sharp geometric hover highlights.
  - No detached, unstyled mobile phone frames on desktop viewports.
