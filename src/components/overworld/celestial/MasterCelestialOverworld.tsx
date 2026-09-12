import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import { ParticleField } from '../../ui/design/ParticleField'
import { DailyQuestModal } from './DailyQuestModal'
import { CentralOrbisCitadel } from './CentralOrbisCitadel'
import type { ChildAdventureProgress } from '../../../services/progressionService'

export interface MasterCelestialOverworldProps {
  adventureProgress?: ChildAdventureProgress
  className?: string
}

interface SparklePosition {
  top: string
  left: string
  delay: string
  size: number
}

interface LandmarkConfig {
  id: string
  name: string
  pillLabel: string
  icon: string
  description: string
  route?: string
  isModal?: boolean
  top: string
  left: string
  width: string
  height: string
  // Color tokens for organic multi-cloud nebula
  primaryGlow: string
  secondaryGlow: string
  ambientGlow: string
  accentColor: string
  sparkles: SparklePosition[]
  sfx: 'star_pop' | 'spell_awaken' | 'card_flip'
}

const LANDMARKS: LandmarkConfig[] = [
  {
    id: 'northstar',
    name: 'North Star',
    pillLabel: '✦ NORTH STAR',
    icon: '⭐',
    description: 'Daily Guidance, Cosmic Quests & Streaks',
    isModal: true,
    top: '5%',
    left: '66%',
    width: '15%',
    height: '15%',
    primaryGlow: 'rgba(254, 240, 138, 0.75)',
    secondaryGlow: 'rgba(253, 224, 71, 0.45)',
    ambientGlow: 'rgba(245, 158, 11, 0.25)',
    accentColor: '#fde047',
    sparkles: [
      { top: '20%', left: '30%', delay: '0s', size: 4 },
      { top: '35%', left: '70%', delay: '0.4s', size: 3 },
      { top: '65%', left: '45%', delay: '0.8s', size: 5 },
      { top: '15%', left: '60%', delay: '0.2s', size: 3 },
    ],
    sfx: 'spell_awaken',
  },
  {
    id: 'citadel',
    name: 'ORBis Central Citadel',
    pillLabel: 'ORBIS',
    icon: '🏰',
    description: 'Home Base & Celestial Headquarters',
    isModal: true,
    top: '12%',
    left: '39%',
    width: '22%',
    height: '24%',
    primaryGlow: 'rgba(253, 224, 71, 0.65)',
    secondaryGlow: 'rgba(251, 191, 36, 0.40)',
    ambientGlow: 'rgba(245, 158, 11, 0.20)',
    accentColor: '#fbbf24',
    sparkles: [
      { top: '15%', left: '50%', delay: '0s', size: 4 },
      { top: '40%', left: '25%', delay: '0.5s', size: 3 },
      { top: '55%', left: '75%', delay: '0.9s', size: 4 },
      { top: '75%', left: '48%', delay: '0.3s', size: 5 },
    ],
    sfx: 'spell_awaken',
  },
  {
    id: 'academy',
    name: 'Academy of Wonder',
    pillLabel: '✦ ACADEMY',
    icon: '🏛️',
    description: '10 Core Academic Realms & 348 Learning Skills',
    route: '/academy',
    top: '34%',
    left: '17%',
    width: '20%',
    height: '27%',
    primaryGlow: 'rgba(56, 189, 248, 0.70)',
    secondaryGlow: 'rgba(14, 165, 233, 0.40)',
    ambientGlow: 'rgba(99, 102, 241, 0.25)',
    accentColor: '#38bdf8',
    sparkles: [
      { top: '10%', left: '48%', delay: '0s', size: 5 },
      { top: '35%', left: '20%', delay: '0.4s', size: 3 },
      { top: '40%', left: '80%', delay: '0.7s', size: 4 },
      { top: '70%', left: '50%', delay: '0.2s', size: 4 },
      { top: '80%', left: '30%', delay: '0.6s', size: 3 },
    ],
    sfx: 'card_flip',
  },
  {
    id: 'stories',
    name: 'Stories Campfire & Studio',
    pillLabel: '✦ STORIES',
    icon: '📖',
    description: 'AI-Illustrated Storybooks & Creative Studio',
    route: '/stories',
    top: '34%',
    left: '60%',
    width: '20%',
    height: '27%',
    primaryGlow: 'rgba(245, 158, 11, 0.70)',
    secondaryGlow: 'rgba(234, 88, 12, 0.40)',
    ambientGlow: 'rgba(244, 63, 94, 0.20)',
    accentColor: '#f59e0b',
    sparkles: [
      { top: '15%', left: '45%', delay: '0.1s', size: 4 },
      { top: '35%', left: '75%', delay: '0.5s', size: 3 },
      { top: '60%', left: '50%', delay: '0.8s', size: 5 },
      { top: '75%', left: '25%', delay: '0.3s', size: 4 },
      { top: '50%', left: '20%', delay: '0.6s', size: 3 },
    ],
    sfx: 'card_flip',
  },
  {
    id: 'playroom',
    name: 'Playroom Playground',
    pillLabel: '✦ PLAYROOM',
    icon: '🪐',
    description: '10 Canonical Brain Simulation Games & Labs',
    route: '/playroom',
    top: '57%',
    left: '28%',
    width: '22%',
    height: '27%',
    primaryGlow: 'rgba(236, 72, 153, 0.70)',
    secondaryGlow: 'rgba(217, 70, 239, 0.40)',
    ambientGlow: 'rgba(168, 85, 247, 0.25)',
    accentColor: '#ec4899',
    sparkles: [
      { top: '12%', left: '35%', delay: '0.2s', size: 4 },
      { top: '25%', left: '65%', delay: '0.6s', size: 5 },
      { top: '65%', left: '30%', delay: '0.9s', size: 3 },
      { top: '70%', left: '70%', delay: '0.3s', size: 4 },
      { top: '45%', left: '50%', delay: '0.7s', size: 3 },
    ],
    sfx: 'star_pop',
  },
  {
    id: 'explore',
    name: 'Explore Observatory',
    pillLabel: '✦ EXPLORE',
    icon: '🔭',
    description: 'Celestial Observatory & Starlight Discovery Hub',
    route: '/explore',
    top: '59%',
    left: '52%',
    width: '22%',
    height: '27%',
    primaryGlow: 'rgba(168, 85, 247, 0.70)',
    secondaryGlow: 'rgba(139, 92, 246, 0.40)',
    ambientGlow: 'rgba(56, 189, 248, 0.25)',
    accentColor: '#a855f7',
    sparkles: [
      { top: '15%', left: '48%', delay: '0.1s', size: 5 },
      { top: '45%', left: '25%', delay: '0.5s', size: 3 },
      { top: '50%', left: '75%', delay: '0.8s', size: 4 },
      { top: '75%', left: '50%', delay: '0.3s', size: 4 },
      { top: '35%', left: '60%', delay: '0.7s', size: 3 },
    ],
    sfx: 'star_pop',
  },
]

interface BurstParticle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  alpha: number
  spin: number
}

export const MasterCelestialOverworld: React.FC<MasterCelestialOverworldProps> = ({
  adventureProgress,
  className = '',
}) => {
  const navigate = useNavigate()
  const [isDailyQuestOpen, setIsDailyQuestOpen] = useState(false)
  const [isCitadelOpen, setIsCitadelOpen] = useState(false)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [activeBurst, setActiveBurst] = useState<{ x: number; y: number; color: string } | null>(null)
  const burstCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // Trigger organic stardust explosion on click
  const triggerBurst = useCallback((e: React.MouseEvent<HTMLButtonElement>, color: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    setActiveBurst({ x, y, color })
  }, [])

  // Canvas particle renderer for organic click bursts
  useEffect(() => {
    if (!activeBurst) return
    const canvas = burstCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: BurstParticle[] = Array.from({ length: 28 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.5
      const speed = Math.random() * 5 + 1.8
      return {
        id: i,
        x: activeBurst.x + (Math.random() - 0.5) * 16,
        y: activeBurst.y + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: i % 3 === 0 ? activeBurst.color : i % 3 === 1 ? '#fef08a' : '#ffffff',
        size: Math.random() * 3.5 + 1.5,
        alpha: 1,
        spin: Math.random() * Math.PI * 2,
      }
    })

    let animId: number
    const startTime = performance.now()

    const render = (time: number) => {
      const elapsed = time - startTime
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let alive = false
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.alpha = Math.max(0, 1 - elapsed / 500)
        p.size *= 0.985

        if (p.alpha > 0.01) {
          alive = true
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.fillStyle = p.color
          ctx.globalAlpha = p.alpha
          ctx.shadowBlur = 14
          ctx.shadowColor = p.color

          // Draw small 4-pointed star or soft particle
          if (p.id % 2 === 0) {
            ctx.beginPath()
            ctx.arc(0, 0, p.size, 0, Math.PI * 2)
            ctx.fill()
          } else {
            const s = p.size * 1.6
            ctx.beginPath()
            ctx.moveTo(0, -s)
            ctx.lineTo(s * 0.3, 0)
            ctx.lineTo(0, s)
            ctx.lineTo(-s * 0.3, 0)
            ctx.closePath()
            ctx.fill()
          }
          ctx.restore()
        }
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      if (alive) {
        animId = requestAnimationFrame(render)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setActiveBurst(null)
      }
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [activeBurst])

  const handleLandmarkClick = (landmark: LandmarkConfig, e: React.MouseEvent<HTMLButtonElement>) => {
    HapticsService.medium()
    sfxService.play(landmark.sfx)
    triggerBurst(e, landmark.accentColor)

    if (landmark.id === 'citadel') {
      setTimeout(() => {
        setIsCitadelOpen(true)
      }, 140)
    } else if (landmark.id === 'northstar') {
      setTimeout(() => {
        setIsDailyQuestOpen(true)
      }, 140)
    } else if (landmark.route) {
      setTimeout(() => {
        navigate(landmark.route!)
      }, 160)
    }
  }

  return (
    <div
      className={`orbis-master-overworld-universe ${className}`}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        overflow: 'hidden',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#04071b',
      }}
      aria-label="ORBis Living Cosmic Universe Overworld"
    >
      {/* 1. Global High-Performance Ambient Drifting Stardust */}
      <ParticleField count={45} particleType="stardust" speed={0.2} color="#fde047" />

      {/* 2. Burst Particles Canvas Layer */}
      <canvas
        ref={burstCanvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 40,
        }}
      />

      {/* 3. Master Celestial Artwork Stage (Full Viewport Landscape Canvas) */}
      <div
        className="orbis-celestial-artwork-stage"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Master High-Res 6-Landmark Reference Artwork */}
        <img
          src="/assets/overworld/orbis_overworld_master.jpg"
          alt="ORBis Living Cosmic Universe: North Star, Citadel, Academy, Stories, Playroom, and Explore"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
            pointerEvents: 'none',
          }}
        />

        {/* 4. Magical Animated Travelling Stardust Sparks on Constellation Energy Paths */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
          }}
          viewBox="0 0 1000 667"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <filter id="stardustGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Path 1: Citadel -> North Star */}
          <circle r="2.5" fill="#fef08a" filter="url(#stardustGlow)">
            <animateMotion path="M 490 200 Q 590 150, 720 90" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" dur="3.2s" repeatCount="indefinite" />
          </circle>

          {/* Path 2: Citadel -> Academy */}
          <circle r="3" fill="#38bdf8" filter="url(#stardustGlow)">
            <animateMotion path="M 470 230 Q 360 260, 270 330" dur="3.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" dur="3.8s" repeatCount="indefinite" />
          </circle>

          {/* Path 3: Citadel -> Stories */}
          <circle r="3" fill="#fbbf24" filter="url(#stardustGlow)">
            <animateMotion path="M 520 230 Q 600 270, 690 330" dur="3.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" dur="3.6s" repeatCount="indefinite" />
          </circle>

          {/* Path 4: Citadel -> Playroom */}
          <circle r="3" fill="#ec4899" filter="url(#stardustGlow)">
            <animateMotion path="M 480 250 Q 420 370, 390 490" dur="4.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" dur="4.2s" repeatCount="indefinite" />
          </circle>

          {/* Path 5: Citadel -> Explore */}
          <circle r="3" fill="#c084fc" filter="url(#stardustGlow)">
            <animateMotion path="M 510 250 Q 560 380, 620 500" dur="4.0s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" dur="4.0s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* 5. Organic Multi-Cloud Magic Interaction Layer (NO GEOMETRIC BOUNDARIES) */}
        <div
          className="orbis-hotspots-coordinate-layer"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
          }}
        >
          {LANDMARKS.map((landmark) => {
            const isHovered = hoveredZone === landmark.id

            return (
              <button
                key={landmark.id}
                type="button"
                onClick={(e) => handleLandmarkClick(landmark, e)}
                onMouseEnter={() => setHoveredZone(landmark.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onFocus={() => setHoveredZone(landmark.id)}
                onBlur={() => setHoveredZone(null)}
                aria-label={`${landmark.name}: ${landmark.description}`}
                style={{
                  position: 'absolute',
                  top: landmark.top,
                  left: landmark.left,
                  width: landmark.width,
                  height: landmark.height,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  zIndex: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {/* ==================================================================== */}
                {/* ORGANIC MULTI-CLOUD NEBULA AURA (IRREGULAR, DIFFUSE, ZERO HARD EDGES) */}
                {/* ==================================================================== */}

                {/* Cloud Wisp 1: Core Asymmetric Organic Glow */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-15%',
                    left: '-10%',
                    width: '120%',
                    height: '115%',
                    borderRadius: '45% 65% 55% 45% / 60% 40% 70% 50%',
                    background: `radial-gradient(circle at 45% 45%, ${landmark.primaryGlow} 0%, ${landmark.secondaryGlow} 45%, transparent 72%)`,
                    filter: 'blur(32px)',
                    mixBlendMode: 'screen',
                    opacity: isHovered ? 0.95 : 0,
                    transform: isHovered ? 'scale(1.12) rotate(4deg)' : 'scale(0.85) rotate(0deg)',
                    transition: 'opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s ease',
                    pointerEvents: 'none',
                  }}
                />

                {/* Cloud Wisp 2: Secondary Counter-Rotating Ambient Vapor */}
                <div
                  style={{
                    position: 'absolute',
                    top: '5%',
                    left: '0%',
                    width: '110%',
                    height: '110%',
                    borderRadius: '60% 40% 65% 35% / 45% 65% 35% 55%',
                    background: `radial-gradient(circle at 55% 55%, ${landmark.secondaryGlow} 0%, ${landmark.ambientGlow} 50%, transparent 75%)`,
                    filter: 'blur(28px)',
                    mixBlendMode: 'screen',
                    opacity: isHovered ? 0.8 : 0,
                    transform: isHovered ? 'scale(1.08) rotate(-6deg)' : 'scale(0.9) rotate(0deg)',
                    transition: 'opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s ease',
                    pointerEvents: 'none',
                  }}
                />

                {/* Cloud Wisp 3: Concentrated Luminous Core on Landmark Center */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10%',
                    left: '15%',
                    width: '70%',
                    height: '70%',
                    borderRadius: '50% 60% 40% 50%',
                    background: `radial-gradient(circle, ${landmark.primaryGlow} 0%, transparent 60%)`,
                    filter: 'blur(16px)',
                    mixBlendMode: 'color-dodge',
                    opacity: isHovered ? 0.85 : 0,
                    transform: isHovered ? 'scale(1.15)' : 'scale(0.9)',
                    transition: 'opacity 0.25s ease, transform 0.3s ease',
                    pointerEvents: 'none',
                  }}
                />

                {/* Sparkling Stardust Motes Emanating from Landmark */}
                {isHovered &&
                  landmark.sparkles.map((sp, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        top: sp.top,
                        left: sp.left,
                        width: `${sp.size}px`,
                        height: `${sp.size}px`,
                        borderRadius: '50%',
                        background: '#ffffff',
                        boxShadow: `0 0 10px 2px ${landmark.accentColor}, 0 0 4px #ffffff`,
                        animation: `stardustTwinkle 1.4s ease-in-out ${sp.delay} infinite alternate`,
                        pointerEvents: 'none',
                      }}
                    />
                  ))}
              </button>
            )
          })}
        </div>
      </div>

      {/* 6. Daily Guidance & Quests Modal */}
      <DailyQuestModal
        isOpen={isDailyQuestOpen}
        onClose={() => setIsDailyQuestOpen(false)}
        adventureProgress={adventureProgress}
      />

      {/* 7. Central ORBis Citadel Command Modal */}
      <CentralOrbisCitadel
        isOpen={isCitadelOpen}
        onClose={() => setIsCitadelOpen(false)}
        adventureProgress={adventureProgress}
      />

      {/* Embedded Micro-Keyframes for Organic Stardust Twinkle */}
      <style>{`
        @keyframes stardustTwinkle {
          0% {
            opacity: 0.2;
            transform: scale(0.6) translateY(0px);
          }
          50% {
            opacity: 1;
            transform: scale(1.3) translateY(-3px);
          }
          100% {
            opacity: 0.4;
            transform: scale(0.8) translateY(-6px);
          }
        }
      `}</style>
    </div>
  )
}
