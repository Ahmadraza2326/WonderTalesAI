import React, { useEffect, useState, useRef } from 'react'
import type { CreatureSpecies } from '../../../types/games/creatureLab'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import { CelebrationParticles } from '../../experience/CelebrationParticles'

interface CreatureHatchModalProps {
  creature: CreatureSpecies
  isNewDiscovery: boolean
  xpAwarded: number
  starsAwarded: number
  onCollectAndContinue: (customNickname?: string) => void
}

type HatchStage = 'egg_wobble' | 'egg_cracking' | 'burst_reveal' | 'revealed'

export const CreatureHatchModal: React.FC<CreatureHatchModalProps> = ({
  creature,
  isNewDiscovery,
  xpAwarded,
  starsAwarded,
  onCollectAndContinue,
}) => {
  const [stage, setStage] = useState<HatchStage>('egg_wobble')
  const [nickname, setNickname] = useState<string>('')
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const eggCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)

  // Multi-Phase 3D Egg Hatching Animation Sequence
  useEffect(() => {
    HapticsService.medium()
    sfxService.play('cauldron_bubble')

    // Phase 1 -> 2: Egg starts cracking after 900ms
    const timer1 = setTimeout(() => {
      setStage('egg_cracking')
      HapticsService.heavy()
      sfxService.play('essence_pickup')
    }, 900)

    // Phase 2 -> 3: Egg bursts open with species reveal after 1800ms
    const timer2 = setTimeout(() => {
      setStage('burst_reveal')
      HapticsService.success()

      if (creature.rarity === 'legendary') {
        sfxService.play('legendary_discovery')
      } else if (creature.rarity === 'epic' || creature.rarity === 'rare') {
        sfxService.play('rare_discovery')
      } else {
        sfxService.play('creature_reveal')
      }

      if (isNewDiscovery) {
        sfxService.play('victory_fanfare')
      }
    }, 1800)

    // Phase 3 -> 4: Full card stabilization after 2400ms
    const timer3 = setTimeout(() => {
      setStage('revealed')
    }, 2400)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [creature.rarity, isNewDiscovery])

  // 3D Egg Hatching Canvas Particle Burst
  useEffect(() => {
    if (stage === 'revealed') return

    const canvas = eggCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 240
    canvas.height = 240

    let start = performance.now()

    const render = (now: number) => {
      const elapsed = (now - start) / 1000
      ctx.clearRect(0, 0, 240, 240)

      const cx = 120
      const cy = 130
      const rx = 55
      const ry = 72

      if (stage === 'egg_wobble' || stage === 'egg_cracking') {
        const wobble = Math.sin(elapsed * (stage === 'egg_cracking' ? 24 : 10)) * (stage === 'egg_cracking' ? 0.12 : 0.05)

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(wobble)

        // 3D Egg Radial Gradient
        const eggGrad = ctx.createRadialGradient(-15, -25, 10, 0, 0, ry)
        eggGrad.addColorStop(0, '#ffffff')
        eggGrad.addColorStop(0.3, creature.primaryColor)
        eggGrad.addColorStop(0.8, creature.secondaryColor)
        eggGrad.addColorStop(1, '#0f172a')

        // Outer glow
        ctx.shadowColor = creature.glowColor
        ctx.shadowBlur = stage === 'egg_cracking' ? 32 : 16

        // Egg Shell Path
        ctx.fillStyle = eggGrad
        ctx.beginPath()
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = 'rgba(255,255,255,0.6)'
        ctx.lineWidth = 3
        ctx.stroke()

        // Egg Shell Fracture Cracks (Phase 2)
        if (stage === 'egg_cracking') {
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 3.5
          ctx.shadowColor = '#ffffff'
          ctx.shadowBlur = 14
          ctx.beginPath()
          ctx.moveTo(-10, -50)
          ctx.lineTo(8, -25)
          ctx.lineTo(-14, 0)
          ctx.lineTo(12, 22)
          ctx.lineTo(-4, 48)
          ctx.stroke()

          // Secondary fracture
          ctx.beginPath()
          ctx.moveTo(8, -25)
          ctx.lineTo(28, -15)
          ctx.lineTo(34, 10)
          ctx.stroke()

          // Radiant light beams piercing from cracks
          const beamGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 100)
          beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
          beamGrad.addColorStop(0.5, creature.glowColor)
          beamGrad.addColorStop(1, 'transparent')
          ctx.fillStyle = beamGrad
          ctx.beginPath()
          ctx.arc(0, 0, 100, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      } else if (stage === 'burst_reveal') {
        // Particle Shell Burst
        ctx.save()
        const burstRadius = Math.min(110, elapsed * 140)
        for (let i = 0; i < 16; i++) {
          const angle = (i * Math.PI * 2) / 16
          const px = cx + Math.cos(angle) * burstRadius
          const py = cy + Math.sin(angle) * burstRadius
          ctx.fillStyle = i % 2 === 0 ? creature.primaryColor : '#ffffff'
          ctx.beginPath()
          ctx.arc(px, py, Math.max(1, 7 - elapsed * 3), 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [stage, creature.primaryColor, creature.secondaryColor, creature.glowColor])

  const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
    common: { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80', border: '#22c55e' },
    rare: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa', border: '#3b82f6' },
    epic: { bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc', border: '#a855f7' },
    legendary: { bg: 'rgba(234, 179, 8, 0.2)', text: '#facc15', border: '#eab308' },
  }

  const currentRarity = rarityColors[creature.rarity] || rarityColors.common
  const mutation = creature.mutation

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.3s ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="creature-name-title"
    >
      {(isNewDiscovery || mutation) && <CelebrationParticles particleCount={60} />}

      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
          border: `2px solid ${mutation?.auraColor || creature.primaryColor}`,
          boxShadow: `0 0 45px ${mutation?.auraColor || creature.glowColor}, 0 20px 40px rgba(0,0,0,0.7)`,
          borderRadius: '28px',
          padding: '24px',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative',
          transform: stage === 'revealed' || stage === 'burst_reveal' ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease',
        }}
      >
        {/* Phase 1 & 2: 3D Egg Hatching Viewport */}
        {stage !== 'revealed' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '16px 0' }}>
            <canvas
              ref={eggCanvasRef}
              style={{
                width: '240px',
                height: '240px',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
              }}
            />
            <p
              style={{
                margin: '12px 0 0',
                fontSize: '17px',
                fontWeight: 800,
                color: '#fbbf24',
                animation: 'pulse 0.8s infinite',
                letterSpacing: '0.02em',
              }}
            >
              {stage === 'egg_wobble' && '✨ An alchemical egg is awakening...'}
              {stage === 'egg_cracking' && '⚡ The starlight shell is cracking!'}
              {stage === 'burst_reveal' && '🌟 SPECIES REVEALED!'}
            </p>
          </div>
        )}

        {/* Phase 3 & 4: Species Reveal Card Content */}
        {(stage === 'burst_reveal' || stage === 'revealed') && (
          <>
            {/* Header Badges */}
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: isNewDiscovery ? 'rgba(245, 158, 11, 0.25)' : 'rgba(148, 163, 184, 0.2)',
                  color: isNewDiscovery ? '#fbbf24' : '#cbd5e1',
                  border: isNewDiscovery ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {isNewDiscovery ? '✨ New Discovery!' : '🐾 Known Friend Re-Hatched'}
              </span>
              {mutation && (
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(234, 179, 8, 0.25)',
                    color: '#fde047',
                    border: '1.5px solid #eab308',
                    boxShadow: '0 0 12px rgba(250, 204, 21, 0.6)',
                  }}
                >
                  {mutation.sparkleEmoji} {mutation.name}
                </span>
              )}
              {creature.isSecret && (
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(236, 72, 153, 0.3)',
                    color: '#f472b6',
                    border: '1px solid #ec4899',
                  }}
                >
                  🌟 Secret Discovery
                </span>
              )}
            </div>

            {/* 3D Animated Creature Hero Avatar */}
            <div
              style={{
                position: 'relative',
                width: '116px',
                height: '116px',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${mutation?.auraColor || creature.glowColor} 0%, rgba(30, 27, 75, 0.7) 80%)`,
                border: `3.5px solid ${mutation?.auraColor ? '#fbbf24' : creature.primaryColor}`,
                boxShadow: `0 0 35px ${mutation?.auraColor || creature.glowColor}`,
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <span style={{ fontSize: '58px', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.6))' }}>
                {creature.emoji}
              </span>
            </div>

            {/* Creature Name & Title */}
            <h2 id="creature-name-title" style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 900, color: '#ffffff' }}>
              {nickname ? nickname : creature.name}
            </h2>
            <p style={{ margin: '0 0 10px', fontSize: '13px', color: creature.primaryColor, fontWeight: 700 }}>
              {creature.speciesTitle}
            </p>

            {/* Personality Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.25)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                color: '#e0e7ff',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '14px',
              }}
            >
              <span>💖</span>
              <span>{creature.personality}</span>
            </div>

            {/* Mutation Description Box if active */}
            {mutation && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  marginBottom: '14px',
                  border: '1px solid rgba(250, 204, 21, 0.4)',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span>{mutation.sparkleEmoji}</span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#fde047' }}>
                    {mutation.name}: {mutation.specialTrait.name}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#fef08a', lineHeight: 1.4 }}>
                  {mutation.mutationDescription}
                </p>
              </div>
            )}

            {/* Lore / Story Snippet */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                borderRadius: '14px',
                padding: '10px 14px',
                marginBottom: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'left',
              }}
            >
              <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, fontStyle: 'italic' }}>
                "{creature.loreSnippet}"
              </p>
            </div>

            {/* 💡 Science of Wonder Concept Box */}
            {creature.scientificConcept && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                  border: '1.5px solid rgba(6, 182, 212, 0.4)',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  marginBottom: '14px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '15px' }}>💡</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>
                    Science of Wonder: {creature.scientificConcept.name}
                  </span>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#e2e8f0', lineHeight: 1.4 }}>
                  {creature.scientificConcept.explanation}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#a78bfa', fontWeight: 600 }}>
                  🔍 <strong>Fun Fact:</strong> {creature.scientificConcept.funFact}
                </p>
              </div>
            )}

            {/* Custom Nickname Input */}
            {isNewDiscovery && (
              <div style={{ marginBottom: '14px' }}>
                {!isEditingNickname && !nickname ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingNickname(true)}
                    style={{
                      background: 'transparent',
                      border: '1px dashed rgba(255,255,255,0.3)',
                      borderRadius: '12px',
                      padding: '6px 14px',
                      color: '#cbd5e1',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    ✏️ Give your new friend a nickname
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', maxWidth: '320px', margin: '0 auto' }}>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder={`Nickname for ${creature.name}...`}
                      maxLength={24}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(168, 85, 247, 0.5)',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditingNickname(false)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: '#8b5cf6',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Traits & Rarity Badges */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: currentRarity.bg,
                  border: `1px solid ${currentRarity.border}`,
                  color: currentRarity.text,
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {creature.rarity}
              </span>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                Family: {creature.family}
              </span>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                Favorite: {creature.favoriteFood}
              </span>
            </div>

            {/* Reward Summary Pill */}
            {isNewDiscovery ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '16px',
                  padding: '8px 16px',
                  marginBottom: '18px',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#fbbf24' }}>
                  +{xpAwarded} XP
                </span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#f59e0b' }}>
                  +{starsAwarded} ⭐ Stars
                </span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#c084fc' }}>
                  +10 ✨ Stardust
                </span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '16px',
                  padding: '8px 16px',
                  marginBottom: '18px',
                  fontSize: '13px',
                  color: '#c084fc',
                  fontWeight: 700,
                }}
              >
                <span>✨ +3 Crafting Stardust added to your lab!</span>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => {
                HapticsService.light()
                onCollectAndContinue(nickname.trim() || undefined)
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '13px',
                fontSize: '16px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0,0,0,0.3)',
                minHeight: '48px',
              }}
              aria-label="Collect creature and return to lab"
            >
              {isNewDiscovery ? '📖 Add to Almanac of Wonder!' : '✨ Keep Exploring!'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
