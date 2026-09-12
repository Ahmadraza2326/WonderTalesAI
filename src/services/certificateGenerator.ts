/**
 * ORBIS Diploma & Certificate Generation Service
 * Generates studio-grade, scalable vector SVG diplomas and printable completion certificates for children.
 */

import type { ChildAdventureProgress } from './progressionService'

export type CertificateTheme = 'cosmic_master' | 'alchemist' | 'scientist' | 'story_weaver'

export interface CertificateOptions {
  childName: string
  explorerTitle: string
  level: number
  xp: number
  stars: number
  unlockedDossiersCount: number
  theme: CertificateTheme
  customMessage?: string
  dateString?: string
  masteredStations?: string[]
}

const THEME_PALETTES: Record<
  CertificateTheme,
  {
    bgStart: string
    bgEnd: string
    borderColor: string
    accentColor: string
    textColor: string
    subtitleColor: string
    sealColor: string
    sealBorder: string
    ornamentColor: string
  }
> = {
  cosmic_master: {
    bgStart: '#0f172a',
    bgEnd: '#1e1b4b',
    borderColor: '#fbbf24',
    accentColor: '#f59e0b',
    textColor: '#ffffff',
    subtitleColor: '#cbd5e1',
    sealColor: '#fbbf24',
    sealBorder: '#f59e0b',
    ornamentColor: '#818cf8',
  },
  alchemist: {
    bgStart: '#14271d',
    bgEnd: '#064e3b',
    borderColor: '#34d399',
    accentColor: '#10b981',
    textColor: '#f0fdf4',
    subtitleColor: '#a7f3d0',
    sealColor: '#34d399',
    sealBorder: '#059669',
    ornamentColor: '#6ee7b7',
  },
  scientist: {
    bgStart: '#082f49',
    bgEnd: '#0c4a6e',
    borderColor: '#38bdf8',
    accentColor: '#0ea5e9',
    textColor: '#f0f9ff',
    subtitleColor: '#bae6fd',
    sealColor: '#38bdf8',
    sealBorder: '#0284c7',
    ornamentColor: '#7dd3fc',
  },
  story_weaver: {
    bgStart: '#2d1537',
    bgEnd: '#4a154b',
    borderColor: '#f472b6',
    accentColor: '#ec4899',
    textColor: '#fdf2f8',
    subtitleColor: '#fbcfe8',
    sealColor: '#f472b6',
    sealBorder: '#db2777',
    ornamentColor: '#f9a8d4',
  },
}

function escapeXml(unsafe: string): string {
  return String(unsafe ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const certificateGenerator = {
  /**
   * Generates a complete, self-contained SVG string of the child's achievement diploma.
   */
  generateCertificateSvg(options: CertificateOptions): string {
    const theme = THEME_PALETTES[options.theme] || THEME_PALETTES.cosmic_master
    const rawDate =
      options.dateString ||
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    const dateStr = escapeXml(rawDate)

    const rawCustomNote =
      options.customMessage ||
      'For outstanding courage, creative imagination, and scientific inquiry across the ORBis Universe.'
    const customNote = escapeXml(rawCustomNote)

    const rawStationsList =
      options.masteredStations && options.masteredStations.length > 0
        ? options.masteredStations.join('  •  ')
        : 'Creature Lab  •  Magic Machine  •  Mystery Detective  •  Potion Scales'
    const stationsList = escapeXml(rawStationsList)
    const childName = escapeXml(options.childName || 'Explorer')
    const explorerTitle = escapeXml(options.explorerTitle || 'Grand Master of the Cosmos')

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850" width="100%" height="100%" style="font-family: 'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bgStart}"/>
      <stop offset="100%" stop-color="${theme.bgEnd}"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="850" rx="32" fill="url(#bgGrad)" />

  <!-- Outer Double Border -->
  <rect x="36" y="36" width="1128" height="778" rx="24" fill="none" stroke="${theme.borderColor}" stroke-width="4" opacity="0.85" />
  <rect x="48" y="48" width="1104" height="754" rx="20" fill="none" stroke="${theme.ornamentColor}" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.6" />

  <!-- Corner Ornaments -->
  <g fill="${theme.borderColor}" opacity="0.9">
    <!-- Top Left -->
    <path d="M 48 100 L 48 48 L 100 48" fill="none" stroke="${theme.borderColor}" stroke-width="5" />
    <circle cx="48" cy="48" r="7" />
    <polygon points="100,48 90,42 90,54" />
    <polygon points="48,100 42,90 54,90" />

    <!-- Top Right -->
    <path d="M 1104 48 L 1152 48 L 1152 100" fill="none" stroke="${theme.borderColor}" stroke-width="5" />
    <circle cx="1152" cy="48" r="7" />
    <polygon points="1104,48 1114,42 1114,54" />
    <polygon points="1152,100 1146,90 1158,90" />

    <!-- Bottom Left -->
    <path d="M 48 750 L 48 802 L 100 802" fill="none" stroke="${theme.borderColor}" stroke-width="5" />
    <circle cx="48" cy="802" r="7" />
    <polygon points="100,802 90,796 90,808" />
    <polygon points="48,750 42,760 54,760" />

    <!-- Bottom Right -->
    <path d="M 1152 750 L 1152 802 L 1100 802" fill="none" stroke="${theme.borderColor}" stroke-width="5" />
    <circle cx="1152" cy="802" r="7" />
    <polygon points="1100,802 1110,796 1110,808" />
    <polygon points="1152,750 1146,760 1158,760" />
  </g>

  <!-- Constellation Stardust Icons -->
  <g fill="${theme.ornamentColor}" opacity="0.35">
    <circle cx="140" cy="180" r="3" />
    <circle cx="220" cy="130" r="2" />
    <circle cx="1060" cy="180" r="3" />
    <circle cx="980" cy="140" r="2" />
    <circle cx="160" cy="680" r="2.5" />
    <circle cx="1040" cy="670" r="3" />
    <line x1="140" y1="180" x2="220" y2="130" stroke="${theme.ornamentColor}" stroke-width="1" />
    <line x1="1060" y1="180" x2="980" y2="140" stroke="${theme.ornamentColor}" stroke-width="1" />
  </g>

  <!-- Header Brand & Title -->
  <g text-anchor="middle">
    <text x="600" y="125" font-size="20" font-weight="800" letter-spacing="6" fill="${theme.accentColor}">
      ORBIS ACADEMY OF WONDER &amp; DISCOVERY
    </text>
    <text x="600" y="185" font-size="44" font-weight="900" letter-spacing="2" fill="url(#goldGrad)" filter="url(#glow)">
      CERTIFICATE OF MASTERY
    </text>
    <line x1="420" y1="210" x2="780" y2="210" stroke="${theme.borderColor}" stroke-width="2" opacity="0.7" />
    <circle cx="600" cy="210" r="5" fill="${theme.borderColor}" />

    <!-- Presentation Lead -->
    <text x="600" y="260" font-size="20" font-weight="500" fill="${theme.subtitleColor}">
      This is proudly conferred upon Cosmic Explorer
    </text>

    <!-- Child Name -->
    <text x="600" y="340" font-size="52" font-weight="900" fill="${theme.textColor}" letter-spacing="1">
      ${childName}
    </text>
    <line x1="320" y1="365" x2="880" y2="365" stroke="url(#goldGrad)" stroke-width="3" />

    <!-- Explorer Title Badge -->
    <rect x="400" y="390" width="400" height="42" rx="21" fill="${theme.borderColor}" opacity="0.18" />
    <rect x="400" y="390" width="400" height="42" rx="21" fill="none" stroke="${theme.borderColor}" stroke-width="1.5" />
    <text x="600" y="418" font-size="20" font-weight="800" fill="${theme.accentColor}">
      ⭐ ${explorerTitle} ⭐
    </text>

    <!-- Custom Citation Text -->
    <text x="600" y="480" font-size="18" font-weight="500" fill="${theme.subtitleColor}" style="font-style: italic;">
      ${customNote}
    </text>

    <!-- Stations & Dossiers Summary -->
    <text x="600" y="525" font-size="15" font-weight="700" fill="${theme.ornamentColor}" letter-spacing="1">
      MASTERED DISCIPLINES &amp; DISCOVERY STATIONS
    </text>
    <text x="600" y="555" font-size="16" font-weight="600" fill="${theme.textColor}">
      ${stationsList}
    </text>

    <!-- Achievement Stats Grid -->
    <g transform="translate(330, 590)">
      <rect x="0" y="0" width="160" height="54" rx="12" fill="${theme.borderColor}" opacity="0.1" stroke="${theme.borderColor}" stroke-width="1"/>
      <text x="80" y="24" font-size="12" font-weight="700" fill="${theme.subtitleColor}">LEVEL</text>
      <text x="80" y="46" font-size="20" font-weight="900" fill="url(#goldGrad)">${options.level}</text>

      <rect x="190" y="0" width="160" height="54" rx="12" fill="${theme.borderColor}" opacity="0.1" stroke="${theme.borderColor}" stroke-width="1"/>
      <text x="270" y="24" font-size="12" font-weight="700" fill="${theme.subtitleColor}">TOTAL XP</text>
      <text x="270" y="46" font-size="20" font-weight="900" fill="url(#goldGrad)">${options.xp} XP</text>

      <rect x="380" y="0" width="160" height="54" rx="12" fill="${theme.borderColor}" opacity="0.1" stroke="${theme.borderColor}" stroke-width="1"/>
      <text x="460" y="24" font-size="12" font-weight="700" fill="${theme.subtitleColor}">SCIENCE CODEX</text>
      <text x="460" y="46" font-size="20" font-weight="900" fill="url(#goldGrad)">${options.unlockedDossiersCount} Dossiers</text>
    </g>
  </g>

  <!-- Bottom Footer Signatures and Gold Seal -->
  <!-- Left: Date of Issue -->
  <g transform="translate(180, 715)">
    <line x1="0" y1="0" x2="220" y2="0" stroke="${theme.subtitleColor}" stroke-width="1.5" opacity="0.6" />
    <text x="110" y="25" text-anchor="middle" font-size="15" font-weight="700" fill="${theme.textColor}">
      ${dateStr}
    </text>
    <text x="110" y="45" text-anchor="middle" font-size="12" font-weight="600" fill="${theme.subtitleColor}">
      DATE OF CONFERRAL
    </text>
  </g>

  <!-- Center: Golden Seal of Achievement -->
  <g transform="translate(600, 720)">
    <circle cx="0" cy="0" r="48" fill="${theme.sealColor}" opacity="0.2" />
    <circle cx="0" cy="0" r="42" fill="url(#goldGrad)" stroke="${theme.sealBorder}" stroke-width="3" />
    <circle cx="0" cy="0" r="36" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 3" />
    <text x="0" y="-8" text-anchor="middle" font-size="22" font-weight="900" fill="#1e1b4b">🪐</text>
    <text x="0" y="14" text-anchor="middle" font-size="10" font-weight="900" fill="#1e1b4b" letter-spacing="1">
      ORBIS
    </text>
    <text x="0" y="26" text-anchor="middle" font-size="8" font-weight="800" fill="#431407">
      VERIFIED
    </text>
  </g>

  <!-- Right: Mascot Signature -->
  <g transform="translate(800, 715)">
    <line x1="0" y1="0" x2="220" y2="0" stroke="${theme.subtitleColor}" stroke-width="1.5" opacity="0.6" />
    <text x="110" y="25" text-anchor="middle" font-size="18" font-weight="900" fill="url(#goldGrad)" style="font-family: cursive;">
      ✨ Orby the Star Sprite
    </text>
    <text x="110" y="45" text-anchor="middle" font-size="12" font-weight="600" fill="${theme.subtitleColor}">
      OFFICIAL MASCOT &amp; GUIDE
    </text>
  </g>
</svg>`
  },

  /**
   * Converts child adventure progress into certificate generation options.
   */
  fromProgress(progress: ChildAdventureProgress, theme: CertificateTheme = 'cosmic_master'): CertificateOptions {
    const stations = [
      progress.stations.creatureLab.completedCount > 0 ? '🧪 Creature Lab' : '',
      progress.stations.magicMachine.completedCount > 0 ? '⚙️ Magic Machine' : '',
      progress.stations.mysteryDetective.completedCount > 0 ? '🔍 Mystery Detective' : '',
      progress.stations.potionScales.completedCount > 0 ? '⚖️ Potion Market' : '',
    ].filter(Boolean)

    return {
      childName: progress.childName || 'Cosmic Explorer',
      explorerTitle: progress.explorerTitle || 'Master of the Cosmos',
      level: progress.level || 1,
      xp: progress.xp || 0,
      stars: progress.stars || 0,
      unlockedDossiersCount: progress.unlockedScienceDossiersCount || 0,
      theme,
      masteredStations: stations.length > 0 ? stations : ['🪐 All Wonder Stations'],
    }
  },

  /**
   * Triggers download of the certificate as a scalable SVG file.
   */
  downloadCertificateSvg(options: CertificateOptions, customFilename?: string): void {
    if (typeof window === 'undefined') return

    const svgContent = this.generateCertificateSvg(options)
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    const safeName = (options.childName || 'Explorer').replace(/[^a-zA-Z0-9_-]/g, '_')
    link.download = customFilename || `${safeName}_ORBis_Diploma.svg`
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },

  /**
   * Triggers a clean print dialog for the diploma.
   */
  printCertificate(options: CertificateOptions): void {
    if (typeof window === 'undefined') return

    const svgContent = this.generateCertificateSvg(options)
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to print the certificate.')
      return
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    <title>${options.childName || 'Explorer'} - ORBis Certificate of Mastery</title>
    <style>
      @page {
        size: landscape;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #0f172a;
      }
      .cert-container {
        width: 96vw;
        max-width: 1200px;
        height: auto;
      }
      svg {
        width: 100%;
        height: auto;
        display: block;
      }
      @media print {
        body {
          background: none;
        }
        .cert-container {
          width: 100vw;
          max-width: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="cert-container">
      ${svgContent}
    </div>
    <script>
      window.onload = function() {
        window.print();
        setTimeout(function() { window.close(); }, 1500);
      };
    </script>
  </body>
</html>`)
    printWindow.document.close()
  },
}
