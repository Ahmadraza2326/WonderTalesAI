import React, { useMemo } from 'react'
import type { GuideId, GuideEmotion, ActorPose, GazeDirection, GazeTarget } from '../../../types/learningUniverse'
import { getGuideProfile } from '../../../services/academy/guideDirector'

export type CharacterPose = ActorPose
export type { GazeDirection, GazeTarget }

export interface GuideCharacterSvgProps {
  guideId: GuideId
  emotion?: GuideEmotion
  pose?: CharacterPose
  gaze?: GazeDirection
  gazeTarget?: GazeTarget
  isSpeaking?: boolean
  size?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * ORBis Living Character Actor System
 * Direction: Living Learning Universe
 * Renders bespoke vector mascots for all 10 guides with gaze tracking,
 * 12 canonical emotional actor poses, procedural breathing, and zero emojis.
 */
export const GuideCharacterSvg: React.FC<GuideCharacterSvgProps> = ({
  guideId,
  emotion = 'neutral',
  pose = 'idle',
  gaze = 'center',
  gazeTarget,
  isSpeaking = false,
  size = 96,
  className = '',
  style,
}) => {
  const guide = getGuideProfile(guideId)

  // Normalize active pose from explicit pose or emotional state
  const activePose: ActorPose = useMemo(() => {
    if (pose && pose !== 'idle' && pose !== 'idle_breathe') {
      return pose
    }
    switch (emotion) {
      case 'celebrating':
        return 'celebrating'
      case 'encouraging':
        return 'encouraging'
      case 'thinking':
        return 'thinking'
      case 'curious':
        return 'curious'
      case 'excited':
        return 'excited'
      case 'confused':
        return 'confused'
      case 'concerned':
        return 'concerned'
      case 'listening':
        return 'listening'
      case 'waiting':
        return 'waiting'
      case 'happy':
        return 'happy'
      case 'guiding':
        return 'teaching'
      default:
        return 'idle'
    }
  }, [pose, emotion])

  // Compute smooth eye gaze pupil offsets (dx, dy)
  const gazeOffset = useMemo(() => {
    if (gazeTarget) {
      // Clamped normalized delta (-4px to +4px range)
      const clampedX = Math.max(-4, Math.min(4, gazeTarget.x * 0.04))
      const clampedY = Math.max(-4, Math.min(4, gazeTarget.y * 0.04))
      return { x: clampedX, y: clampedY }
    }
    switch (gaze as string) {
      case 'left':
      case 'pointing_left':
        return { x: -3.5, y: 0 }
      case 'right':
      case 'pointing_right':
        return { x: 3.5, y: 0 }
      case 'down':
        return { x: 0, y: 3.5 }
      case 'up':
        return { x: 0, y: -3.5 }
      case 'center':
      default:
        return { x: 0, y: 0 }
    }
  }, [gaze, gazeTarget])

  // Map 12 canonical poses to physical body transform orientations
  const getPoseTransform = () => {
    switch (activePose as string) {
      case 'celebrating':
      case 'celebrating_bounce':
        return 'translateY(-10px) scale(1.08) rotate(3deg)'
      case 'excited':
      case 'excited_wave':
        return 'translateY(-6px) scale(1.06) rotate(-2deg)'
      case 'encouraging':
      case 'encouraging_nod':
        return 'translateY(2px) scale(1.03) rotate(1deg)'
      case 'thinking':
        return 'rotate(-6deg) translateY(-2px)'
      case 'curious':
      case 'curious_tilt':
        return 'rotate(8deg) translateY(-3px)'
      case 'teaching':
      case 'pointing_right':
        return 'translateX(5px) scale(1.04)'
      case 'pointing_left':
        return 'translateX(-5px) scale(1.04)'
      case 'confused':
        return 'rotate(-10deg) translateY(2px) scale(0.98)'
      case 'concerned':
        return 'translateY(3px) scale(0.97) rotate(2deg)'
      case 'listening':
        return 'translateY(-2px) scale(1.02) rotate(-3deg)'
      case 'waiting':
        return 'translateY(1px) scale(0.99)'
      case 'happy':
        return 'translateY(-4px) scale(1.04)'
      case 'idle':
      case 'idle_breathe':
      default:
        return 'translateY(0px)'
    }
  }

  return (
    <div
      className={`orbis-character-actor orbis-guide-${guideId} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        transform: getPoseTransform(),
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...style,
      }}
      aria-label={`${guide.name} character in ${activePose} pose`}
    >
      {/* 1. Procedural Ambient Realm Aura */}
      <div
        style={{
          position: 'absolute',
          inset: '-6%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${guide.accentColor}40 0%, ${guide.accentColor}10 60%, transparent 80%)`,
          boxShadow: isSpeaking
            ? `0 0 32px ${guide.accentColor}80`
            : activePose === 'celebrating'
            ? `0 0 40px ${guide.accentColor}90`
            : `0 0 18px ${guide.accentColor}30`,
          transition: 'box-shadow 0.3s ease, background 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* 2. SVG Multi-Layer Vector Character Anatomy */}
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Realm-tinted ambient body gradient */}
          <radialGradient id={`glow_${guide.id}`} cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor={guide.accentColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
          </radialGradient>

          {/* Golden stardust particle gradient */}
          <linearGradient id="goldStardust" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Soft drop shadow filter */}
          <filter id={`shadow_${guide.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* --- MAIN CHARACTER BASE SILHOUETTE --- */}
        <circle
          cx="50"
          cy="52"
          r="38"
          fill={`url(#glow_${guide.id})`}
          stroke={guide.accentColor}
          strokeWidth="3"
          filter={`url(#shadow_${guide.id})`}
        />

        {/* --- BESPOKE VECTOR MASCOT ANATOMY BY GUIDE ID --- */}

        {/* 1. POLY (The Geometric Owl) */}
        {guideId === 'poly' && (
          <g>
            {/* Crown Feather Tufts */}
            <polygon points="24,12 38,26 20,28" fill="#6366f1" stroke={guide.accentColor} strokeWidth="1.5" />
            <polygon points="76,12 62,26 80,28" fill="#6366f1" stroke={guide.accentColor} strokeWidth="1.5" />
            {/* Celestial Brow Arc */}
            <path d="M 28 38 Q 50 32 72 38" fill="none" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
            {/* Geometric Feathered Belly Rune */}
            <path d="M 36 72 Q 50 82 64 72" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="3 3" />
          </g>
        )}

        {/* 2. NEWTON (The Curious Science Otter) */}
        {guideId === 'newton' && (
          <g>
            {/* Round Aquatic Ears */}
            <circle cx="18" cy="32" r="9" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="18" cy="32" r="5" fill="#a7f3d0" />
            <circle cx="82" cy="32" r="9" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="82" cy="32" r="5" fill="#a7f3d0" />
            {/* Playful Whiskers */}
            <line x1="28" y1="62" x2="12" y2="58" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
            <line x1="28" y1="66" x2="14" y2="68" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
            <line x1="72" y1="62" x2="88" y2="58" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
            <line x1="72" y1="66" x2="86" y2="68" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
          </g>
        )}

        {/* 3. LEXI (The Lorekeeper Fox) */}
        {guideId === 'lexi' && (
          <g>
            {/* Pointed Fox Ears */}
            <polygon points="18,10 36,28 12,32" fill="#ea580c" stroke="#f97316" strokeWidth="1.5" />
            <polygon points="20,14 32,26 16,28" fill="#fed7aa" />
            <polygon points="82,10 64,28 88,32" fill="#ea580c" stroke="#f97316" strokeWidth="1.5" />
            <polygon points="80,14 68,26 84,28" fill="#fed7aa" />
            {/* White Muzzle Cheek Ruffs */}
            <path d="M 28 56 Q 50 74 72 56 Q 50 82 28 56" fill="#ffffff" opacity="0.95" />
          </g>
        )}

        {/* 4. BEEP-0 (The Explorer Bot) */}
        {guideId === 'beep_0' && (
          <g>
            {/* Antenna Mast with Glowing Beacon */}
            <line x1="50" y1="14" x2="50" y2="2" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="2" r="5" fill="#38bdf8" filter={`url(#shadow_${guide.id})`} />
            <circle cx="50" cy="2" r="2.5" fill="#ffffff" />
            {/* Cyber Visor Screen */}
            <rect x="24" y="44" width="52" height="26" rx="8" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
          </g>
        )}

        {/* 5. SHERLOCK (The Detective Hound) */}
        {guideId === 'sherlock' && (
          <g>
            {/* Droopy Soft Ears */}
            <ellipse cx="18" cy="54" rx="7" ry="16" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
            <ellipse cx="82" cy="54" rx="7" ry="16" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
            {/* Monocle Magnifying Frame */}
            <circle cx="64" cy="54" r="11" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <line x1="72" y1="62" x2="78" y2="68" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* 6. NOVA (The Star Sprite) */}
        {guideId === 'nova' && (
          <g>
            {/* Orbiting Stardust Rings */}
            <ellipse cx="50" cy="52" rx="46" ry="14" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.8" />
            <circle cx="94" cy="50" r="3" fill="#f43f5e" />
            <circle cx="6" cy="54" r="2.5" fill="#a855f7" />
          </g>
        )}

        {/* 7. DAVINCI (The Invention Falcon) */}
        {guideId === 'davinci' && (
          <g>
            {/* Brass Goggles */}
            <rect x="26" y="44" width="22" height="18" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
            <rect x="52" y="44" width="22" height="18" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
            <line x1="48" y1="53" x2="52" y2="53" stroke="#f59e0b" strokeWidth="3" />
          </g>
        )}

        {/* 8. ATLAS (The Geological Bear) */}
        {guideId === 'atlas' && (
          <g>
            {/* Mountain Stone Crest Ears */}
            <polygon points="20,18 36,30 16,36" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <polygon points="80,18 64,30 84,36" fill="#334155" stroke="#64748b" strokeWidth="2" />
          </g>
        )}

        {/* 9. ARIA (The Harmonic Songbird) */}
        {guideId === 'aria' && (
          <g>
            {/* Musical Treble Plume Crest */}
            <path d="M 50 14 Q 58 4 66 12 Q 72 20 60 26" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="66" cy="12" r="3" fill="#f43f5e" />
          </g>
        )}

        {/* 10. HARMONY (The Quantum Dolphin) */}
        {guideId === 'harmony' && (
          <g>
            {/* Fluid Dorsal Wave Fin */}
            <path d="M 44 14 Q 50 4 60 8 Q 56 20 48 24" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          </g>
        )}

        {/* --- DYNAMIC EYE GAZE & EXPRESSION LAYER --- */}
        <g transform={`translate(${gazeOffset.x}, ${gazeOffset.y})`}>
          {guideId === 'beep_0' ? (
            /* Digital LED Visor Eyes */
            <g>
              {activePose === 'celebrating' || activePose === 'happy' ? (
                /* Joyful Crescent LEDs (^^) */
                <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round">
                  <path d="M 32 58 Q 37 50 42 58" />
                  <path d="M 58 58 Q 63 50 68 58" />
                </g>
              ) : activePose === 'confused' ? (
                /* Puzzled LEDs (O_o) */
                <g fill="#38bdf8">
                  <circle cx="37" cy="54" r="5" />
                  <rect x="59" y="52" width="7" height="4" rx="1" />
                </g>
              ) : (
                /* Standard Digital Square LEDs */
                <g fill="#38bdf8">
                  <rect x="33" y="50" width="9" height="9" rx="2" />
                  <rect x="35" y="52" width="3" height="3" fill="#ffffff" />
                  <rect x="58" y="50" width="9" height="9" rx="2" />
                  <rect x="60" y="52" width="3" height="3" fill="#ffffff" />
                </g>
              )}
            </g>
          ) : (
            /* Organic Multi-Layer Expressive Eyes */
            <g>
              {activePose === 'celebrating' || activePose === 'happy' ? (
                /* Joyful Closed Crescent Eyelids */
                <g stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round">
                  <path d="M 28 58 Q 36 48 44 58" />
                  <path d="M 56 58 Q 64 48 72 58" />
                </g>
              ) : activePose === 'confused' ? (
                /* Asymmetrical Inquisitive Eyes */
                <g>
                  {/* Left Wide Eye */}
                  <ellipse cx="36" cy="54" rx="8" ry="9" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="34" cy="52" r="3.5" fill="#ffffff" />
                  <circle cx="38" cy="56" r="2" fill={guide.accentColor} />

                  {/* Right Narrow Squint Eye */}
                  <ellipse cx="64" cy="55" rx="6" ry="4" fill="#0f172a" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="63" cy="54" r="1.5" fill="#ffffff" />
                </g>
              ) : (
                /* Canonical Open Eyes with Specular Sparkle */
                <g>
                  {/* Left Eye */}
                  <ellipse cx="36" cy="54" rx="7.5" ry="8.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="34" cy="51" r="3" fill="#ffffff" />
                  <circle cx="38" cy="56" r="1.8" fill={guide.accentColor} />

                  {/* Right Eye */}
                  <ellipse cx="64" cy="54" rx="7.5" ry="8.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="62" cy="51" r="3" fill="#ffffff" />
                  <circle cx="66" cy="56" r="1.8" fill={guide.accentColor} />
                </g>
              )}
            </g>
          )}
        </g>

        {/* --- NOSE / BEAK / MOUTH ANATOMY --- */}
        {guideId === 'poly' ? (
          /* Poly's Golden Geometric Beak */
          <polygon points="50,68 43,59 57,59" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        ) : guideId === 'lexi' ? (
          /* Lexi's Cute Fox Nose */
          <polygon points="50,67 46,62 54,62" fill="#0f172a" />
        ) : guideId === 'newton' ? (
          /* Newton's Otter Snout */
          <g>
            <ellipse cx="50" cy="65" rx="5" ry="3.5" fill="#0f172a" />
            <path d="M 50 68.5 L 50 72 M 46 72 Q 50 74 54 72" stroke="#0f172a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>
        ) : guideId === 'beep_0' ? (
          /* BEEP-0 LED Audio Grille */
          <line x1="42" y1="67" x2="58" y2="67" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
        ) : isSpeaking ? (
          /* Open Animated Speaking Mouth */
          <ellipse cx="50" cy="73" rx="6" ry="4" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
        ) : activePose === 'celebrating' || activePose === 'happy' || activePose === 'encouraging' ? (
          /* Warm Happy Smile Arc */
          <path d="M 42 71 Q 50 79 58 71" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        ) : activePose === 'concerned' ? (
          /* Gentle Empathetic Dip */
          <path d="M 44 75 Q 50 72 56 75" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        ) : (
          /* Calm Content Mouth Line */
          <path d="M 44 72 Q 50 75 56 72" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* --- BESPOKE VECTOR AUXILIARY ACTOR CUES (ZERO EMOJIS) --- */}

        {/* 1. Teaching Gesture (Pointing Arm/Wing toward target) */}
        {(activePose === 'teaching' || activePose === 'pointing_right') && (
          <g>
            <path d="M 85 54 Q 100 46 112 50" fill="none" stroke={guide.accentColor} strokeWidth="4.5" strokeLinecap="round" />
            <polygon points="112,50 104,44 106,56" fill={guide.accentColor} />
            <circle cx="116" cy="50" r="3.5" fill="#ffffff" filter={`url(#shadow_${guide.id})`} />
          </g>
        )}

        {activePose === 'pointing_left' && (
          <g>
            <path d="M 15 54 Q 0 46 -12 50" fill="none" stroke={guide.accentColor} strokeWidth="4.5" strokeLinecap="round" />
            <polygon points="-12,50 -4,44 -6,56" fill={guide.accentColor} />
            <circle cx="-16" cy="50" r="3.5" fill="#ffffff" filter={`url(#shadow_${guide.id})`} />
          </g>
        )}

        {/* 2. Thinking Spark (Bespoke Vector Lightbulb / Idea Ray) */}
        {activePose === 'thinking' && (
          <g transform="translate(76, 12)">
            {/* Bulb Body */}
            <path d="M 6 0 C 2 0 0 3 0 6 C 0 8 2 10 3 12 L 3 14 L 9 14 L 9 12 C 10 10 12 8 12 6 C 12 3 10 0 6 0 Z" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />
            {/* Screw base */}
            <line x1="4" y1="15" x2="8" y2="15" stroke="#b45309" strokeWidth="1.5" />
            {/* Idea Radiance Rays */}
            <line x1="6" y1="-4" x2="6" y2="-2" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="-2" x2="10" y2="0" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="-2" x2="2" y2="0" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* 3. Confused Inquisitive Mark (Bespoke Vector Swirling '?') */}
        {activePose === 'confused' && (
          <g transform="translate(76, 10)">
            <path d="M 3 4 Q 3 0 7 0 Q 11 0 11 4 Q 11 7 7 9 L 7 12" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="7" cy="16" r="1.5" fill="#f59e0b" />
          </g>
        )}

        {/* 4. Celebrating Stardust Bursts (Bespoke Vector 4-Point Stars) */}
        {(activePose === 'celebrating' || activePose === 'celebrating_bounce') && (
          <g>
            {/* Left Stardust Star */}
            <g transform="translate(6, 16)">
              <polygon points="6,0 7.5,4.5 12,6 7.5,7.5 6,12 4.5,7.5 0,6 4.5,4.5" fill="url(#goldStardust)" />
            </g>
            {/* Right Stardust Star */}
            <g transform="translate(82, 14)">
              <polygon points="7,0 9,5.5 14,7 9,8.5 7,14 5,8.5 0,7 5,5.5" fill="url(#goldStardust)" />
            </g>
            {/* Center Crown Sparkle */}
            <g transform="translate(46, -4)">
              <polygon points="4,0 5,3 8,4 5,5 4,8 3,5 0,4 3,3" fill="#ffffff" />
            </g>
          </g>
        )}
      </svg>

      {/* 3. Live Speech Syllable Wave Indicator (Zero Emojis) */}
      {isSpeaking && (
        <div
          style={{
            position: 'absolute',
            bottom: '-6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(2, 6, 23, 0.94)',
            padding: '2px 8px',
            borderRadius: '9999px',
            border: `1px solid ${guide.accentColor}`,
            boxShadow: `0 0 12px ${guide.accentColor}60`,
          }}
        >
          {/* Bespoke SVG Microphone Glyph */}
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
            <rect x="3" y="1" width="4" height="6" rx="2" fill={guide.accentColor} />
            <path d="M 1 5 C 1 8 9 8 9 5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="5" y1="8" x2="5" y2="11" stroke="#ffffff" strokeWidth="1.2" />
          </svg>
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '10px' }}>
            <span style={{ width: '2px', height: '6px', background: guide.accentColor, borderRadius: '2px' }} />
            <span style={{ width: '2px', height: '10px', background: '#38bdf8', borderRadius: '2px' }} />
            <span style={{ width: '2px', height: '5px', background: guide.accentColor, borderRadius: '2px' }} />
          </div>
        </div>
      )}
    </div>
  )
}
