import React, { useEffect, useRef, useState } from 'react'
import type { Essence, CauldronState } from '../../../types/games/creatureLab'
import { getHarmonicFluidColor } from '../../../services/games/creatureLabEngine'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

interface CauldronStageProps {
  selectedEssences: Essence[]
  cauldronState: CauldronState
  onStir: () => void
  onDropEssence: (essenceId: string) => void
  onRemoveEssence: (index: number) => void
  onReset: () => void
}

interface FluidParticle {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  color: string
  alpha: number
  lifetime: number
  maxLifetime: number
  type: 'bubble' | 'steam' | 'sparkle'
}

export const CauldronStage: React.FC<CauldronStageProps> = ({
  selectedEssences,
  cauldronState,
  onStir,
  onDropEssence,
  onRemoveEssence,
  onReset,
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const cauldronContainerRef = useRef<HTMLDivElement | null>(null)

  const essenceIds = selectedEssences.map((e) => e.id)
  const fluidColors = getHarmonicFluidColor(essenceIds)
  const isReadyToBrew = selectedEssences.length >= 2 && cauldronState === 'ready_to_brew'
  const isStirring = cauldronState === 'stirring'

  // Mutable particle physics pool for 60 FPS zero-garbage animation
  const particlesRef = useRef<FluidParticle[]>([])
  const waveTimeRef = useRef<number>(0)
  const swirlAngleRef = useRef<number>(0)

  // Initialize and update fluid particle loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 360
    const H = 320
    canvas.width = W
    canvas.height = H

    // Spawn initial bubbles
    particlesRef.current = []

    let lastTime = performance.now()

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time
      waveTimeRef.current += dt * 3
      if (isStirring) {
        swirlAngleRef.current += dt * 6
      }

      ctx.clearRect(0, 0, W, H)

      const centerX = W / 2
      const centerY = 135
      const rx = 105
      const ry = 38

      // 1. Draw 3D Depth Iron Cauldron Body Back Layer
      ctx.save()
      const bodyGrad = ctx.createLinearGradient(centerX - rx, centerY, centerX + rx, H - 20)
      bodyGrad.addColorStop(0, '#334155')
      bodyGrad.addColorStop(0.3, '#1e293b')
      bodyGrad.addColorStop(0.7, '#0f172a')
      bodyGrad.addColorStop(1, '#020617')

      // Cauldron Outer Base & Legs
      ctx.fillStyle = '#0f172a'
      // Left leg
      ctx.beginPath()
      ctx.moveTo(centerX - 90, centerY + 100)
      ctx.quadraticCurveTo(centerX - 120, H - 20, centerX - 130, H - 10)
      ctx.lineTo(centerX - 95, H - 10)
      ctx.quadraticCurveTo(centerX - 80, centerY + 110, centerX - 65, centerY + 90)
      ctx.fill()

      // Right leg
      ctx.beginPath()
      ctx.moveTo(centerX + 90, centerY + 100)
      ctx.quadraticCurveTo(centerX + 120, H - 20, centerX + 130, H - 10)
      ctx.lineTo(centerX + 95, H - 10)
      ctx.quadraticCurveTo(centerX + 80, centerY + 110, centerX + 65, centerY + 90)
      ctx.fill()

      // Center Pot Bulge
      ctx.fillStyle = bodyGrad
      ctx.beginPath()
      ctx.moveTo(centerX - rx - 10, centerY)
      ctx.bezierCurveTo(centerX - rx - 35, centerY + 90, centerX - rx + 15, H - 35, centerX, H - 30)
      ctx.bezierCurveTo(centerX + rx - 15, H - 35, centerX + rx + 35, centerY + 90, centerX + rx + 10, centerY)
      ctx.closePath()
      ctx.fill()

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)'
      ctx.lineWidth = 2.5
      ctx.stroke()

      // 2. Ornate Golden Rivets and 3D Engraved Rune
      ctx.save()
      ctx.shadowColor = fluidColors.primary
      ctx.shadowBlur = selectedEssences.length > 0 ? 18 : 6
      ctx.fillStyle = fluidColors.primary
      // Star rune center
      ctx.beginPath()
      const runeY = centerY + 85
      for (let i = 0; i < 5; i++) {
        const a1 = (i * Math.PI * 2) / 5 - Math.PI / 2
        const a2 = a1 + Math.PI / 5
        const rOuter = 16
        const rInner = 7
        const x1 = centerX + Math.cos(a1) * rOuter
        const y1 = runeY + Math.sin(a1) * rOuter
        const x2 = centerX + Math.cos(a2) * rInner
        const y2 = runeY + Math.sin(a2) * rInner
        if (i === 0) ctx.moveTo(x1, y1)
        else ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y2)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // 3. 3D Elliptical Liquid Surface with Wave Synthesizer
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, rx, ry, 0, 0, Math.PI * 2)
      ctx.clip()

      // Radial Fluid Glow with Thermal Shift
      const liquidGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, rx)
      liquidGrad.addColorStop(0, fluidColors.secondary)
      liquidGrad.addColorStop(0.65, fluidColors.primary)
      liquidGrad.addColorStop(1, '#1e1b4b')
      ctx.fillStyle = liquidGrad
      ctx.fillRect(centerX - rx, centerY - ry, rx * 2, ry * 2)

      // Dynamic Surface Waves
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.beginPath()
      for (let x = -rx; x <= rx; x += 4) {
        const waveY = Math.sin(waveTimeRef.current + (x / rx) * 4) * (isStirring ? 6 : 2.5)
        const ellipseY = Math.sqrt(Math.max(0, 1 - (x * x) / (rx * rx))) * ry
        const py = centerY + (x > 0 ? -ellipseY : ellipseY) * 0.4 + waveY
        if (x === -rx) ctx.moveTo(centerX + x, py)
        else ctx.lineTo(centerX + x, py)
      }
      ctx.closePath()
      ctx.fill()

      // Swirling Vortex Ring during Stirring
      if (isStirring) {
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(swirlAngleRef.current)
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 3
        ctx.setLineDash([12, 8, 4, 8])
        ctx.beginPath()
        ctx.ellipse(0, 0, rx * 0.65, ry * 0.65, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }

      // 4. Update and Render Fluid Bubbles inside Liquid
      const particles = particlesRef.current

      // Spawn bubbles
      if (Math.random() < (isStirring ? 0.6 : 0.35)) {
        const angle = Math.random() * Math.PI * 2
        const dist = Math.random() * (rx * 0.75)
        particles.push({
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * (ry * 0.75) + 10,
          radius: Math.random() * 5 + 2,
          vx: (Math.random() - 0.5) * 12,
          vy: -(Math.random() * 25 + 15),
          color: Math.random() > 0.4 ? '#ffffff' : fluidColors.primary,
          alpha: 0.85,
          lifetime: 0,
          maxLifetime: Math.random() * 1.5 + 0.8,
          type: 'bubble',
        })
      }

      // Render & integrate bubbles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.lifetime += dt
        p.x += p.vx * dt
        p.y += p.vy * dt

        if (p.type === 'bubble') {
          p.alpha = Math.max(0, 1 - p.lifetime / p.maxLifetime)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = p.alpha * 0.75
          ctx.fill()
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1
          ctx.stroke()

          // When bubble reaches top, spawn rising steam particle
          if (p.y <= centerY - ry * 0.5 && Math.random() < 0.4) {
            particles.push({
              x: p.x,
              y: p.y - 4,
              radius: Math.random() * 8 + 4,
              vx: (Math.random() - 0.5) * 20,
              vy: -(Math.random() * 40 + 20),
              color: fluidColors.primary,
              alpha: 0.6,
              lifetime: 0,
              maxLifetime: Math.random() * 1.2 + 0.6,
              type: 'steam',
            })
          }
        }

        if (p.lifetime >= p.maxLifetime) {
          particles.splice(i, 1)
        }
      }

      ctx.restore() // End liquid surface clipping

      // 5. Render 3D Gold Rim with Metallic Sheen
      ctx.save()
      const goldRim = ctx.createLinearGradient(centerX - rx, centerY - ry, centerX + rx, centerY + ry)
      goldRim.addColorStop(0, '#92400e')
      goldRim.addColorStop(0.3, '#fbbf24')
      goldRim.addColorStop(0.7, '#f59e0b')
      goldRim.addColorStop(1, '#78350f')

      ctx.beginPath()
      ctx.ellipse(centerX, centerY, rx + 4, ry + 3, 0, 0, Math.PI * 2)
      ctx.strokeStyle = goldRim
      ctx.lineWidth = 7
      ctx.stroke()

      // Inner rim highlight
      ctx.beginPath()
      ctx.ellipse(centerX, centerY - 2, rx, ry, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()

      // 6. Render Rising Steam & Sparkle Particles (Above Cauldron)
      ctx.save()
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        if (p.type === 'steam') {
          const progress = p.lifetime / p.maxLifetime
          const curAlpha = Math.max(0, (1 - progress) * 0.45)
          const curRadius = p.radius * (1 + progress * 1.5)

          ctx.beginPath()
          ctx.arc(p.x, p.y, curRadius, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = curAlpha
          ctx.filter = 'blur(4px)'
          ctx.fill()
          ctx.filter = 'none'
        }
      }
      ctx.restore()

      animationFrameRef.current = requestAnimationFrame(render)
    }

    animationFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [fluidColors, isStirring, selectedEssences.length])

  // Native & PointerCapture Drag-and-Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    if (!isDragOver) setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const essenceId = e.dataTransfer.getData('text/plain')
    if (essenceId) {
      HapticsService.light()
      sfxService.play('essence_drop')
      onDropEssence(essenceId)
    }
  }

  const handleStirClick = () => {
    if (isReadyToBrew) {
      HapticsService.medium()
      sfxService.play('liquid_mix')
      sfxService.play('cauldron_bubble')
      onStir()
    }
  }

  const maxSlots = 3

  return (
    <div
      ref={cauldronContainerRef}
      className="cauldron-stage-3d-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
        padding: '8px 12px',
        userSelect: 'none',
        touchAction: 'none',
      }}
      aria-label="3D Depth Magical Alchemical Cauldron"
    >
      {/* Active Essence Slots Badge Bar */}
      <div
        className="essence-slots-badge-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '10px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1.5px solid rgba(168, 85, 247, 0.35)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 16px rgba(168, 85, 247, 0.2)',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#e0e7ff', letterSpacing: '0.02em' }}>
          Cauldron ({selectedEssences.length}/{maxSlots}):
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[0, 1, 2].map((idx) => {
            const essence = selectedEssences[idx]
            return essence ? (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  HapticsService.light()
                  onRemoveEssence(idx)
                }}
                title={`Remove ${essence.name}`}
                aria-label={`Remove ${essence.name} from cauldron`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  background: essence.glowColor,
                  border: `1.5px solid ${essence.primaryColor}`,
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  minHeight: '36px',
                  transition: 'transform 0.15s ease',
                  boxShadow: `0 0 10px ${essence.primaryColor}60`,
                }}
              >
                <span>{essence.glyph}</span>
                <span>{essence.name}</span>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>✕</span>
              </button>
            ) : (
              <div
                key={idx}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '2px dashed rgba(168, 85, 247, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(224, 231, 255, 0.4)',
                  fontSize: '13px',
                }}
              >
                +
              </div>
            )
          })}
        </div>
        {selectedEssences.length > 0 && (
          <button
            type="button"
            onClick={() => {
              HapticsService.light()
              onReset()
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '4px 6px',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* 3D Depth Interactive Canvas Cauldron Stage */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleStirClick}
        tabIndex={isReadyToBrew ? 0 : undefined}
        role={isReadyToBrew ? 'button' : undefined}
        aria-label={isReadyToBrew ? 'Stir the cauldron to synthesize creature' : 'Cauldron stage'}
        onKeyDown={(e) => {
          if (isReadyToBrew && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleStirClick()
          }
        }}
        style={{
          position: 'relative',
          width: '360px',
          height: '320px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isReadyToBrew ? 'pointer' : 'default',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isDragOver ? 'scale(1.06)' : isStirring ? 'scale(1.04)' : 'scale(1)',
          filter: isDragOver ? 'drop-shadow(0 0 24px rgba(236, 72, 153, 0.8))' : 'none',
        }}
      >
        {/* Dynamic Canvas 3D Depth Layer */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
            filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.6))',
          }}
        />

        {/* Ambient Backlight Aura */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            width: '260px',
            height: '180px',
            borderRadius: '50%',
            background: fluidColors.glow,
            filter: 'blur(36px)',
            opacity: selectedEssences.length > 0 ? 0.95 : 0.4,
            transition: 'background 0.4s ease, opacity 0.4s ease',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Action / Guidance Prompts */}
      <div style={{ marginTop: '8px', textAlign: 'center', minHeight: '48px' }}>
        {selectedEssences.length === 0 && (
          <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', fontWeight: 500 }}>
            ✨ Drag or tap <strong>2 or 3 magical essences</strong> below into the 3D Cauldron!
          </p>
        )}

        {selectedEssences.length === 1 && (
          <p style={{ margin: 0, fontSize: '13px', color: '#fbbf24', fontWeight: 600 }}>
            🪄 Added {selectedEssences[0].name}! Choose <strong>1 more essence</strong> to synthesize a creature.
          </p>
        )}

        {isReadyToBrew && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={handleStirClick}
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '10px 26px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(236, 72, 153, 0.7), 0 4px 14px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minHeight: '44px',
                transform: 'scale(1.02)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              aria-label="Stir the cauldron now"
            >
              <span style={{ fontSize: '16px' }}>🌀</span>
              <span>STIR & SYNTHESIZE!</span>
              <span style={{ fontSize: '16px' }}>✨</span>
            </button>
            {selectedEssences.length === 2 && (
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                💡 (Optional: Add 1 more essence for rare 3-part catalyst combinations!)
              </span>
            )}
          </div>
        )}

        {isStirring && (
          <p style={{ margin: 0, fontSize: '14px', color: '#f472b6', fontWeight: 700, animation: 'pulse 0.8s infinite' }}>
            🌟 The starlight essences are fusing into a magical lifeform...
          </p>
        )}
      </div>
    </div>
  )
}
