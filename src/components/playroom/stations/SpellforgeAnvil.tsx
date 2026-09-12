import React, { useState, useReducer, useEffect, useCallback, useMemo, useRef } from 'react'
import type { StoryRecord } from '../../../types/story'
import type { DifficultyTier } from '../../../types/experience'
import type { RuneBlock, SparkParticle, SpellforgeChallenge } from '../../../types/games/spellforge'
import {
  generateSpellforgeChallenge,
  getInitialSpellforgeState,
  evaluateSpellforgeAction,
  calculateSpellforgeScore,
} from '../../../services/games/spellforgeEngine'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import { ActivityShell } from '../../experience/ActivityShell'
import { VictoryCelebrationModal } from '../../experience/VictoryCelebrationModal'

export interface SpellforgeAnvilProps {
  story?: StoryRecord | null
  childId?: string | null
  explorerLevel?: number
  onBack?: () => void
  initialDifficulty?: DifficultyTier
}

export const SpellforgeAnvil: React.FC<SpellforgeAnvilProps> = ({
  story,
  childId = null,
  explorerLevel = 1,
  onBack,
  initialDifficulty = 'easy',
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [dragRune, setDragRune] = useState<RuneBlock | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Sparks array for 60fps particle loop
  const sparksRef = useRef<SparkParticle[]>([])
  const hammerProgressRef = useRef<number>(0)
  const isHammerSwingingRef = useRef<boolean>(false)

  // Current challenge
  const currentChallenge: SpellforgeChallenge = useMemo(() => {
    return generateSpellforgeChallenge(challengeIndex, difficulty, explorerLevel)
  }, [challengeIndex, difficulty, explorerLevel])

  // Engine state reducer
  const [state, dispatch] = useReducer(
    evaluateSpellforgeAction,
    currentChallenge,
    (c) => getInitialSpellforgeState(c)
  )

  // Sync state when challenge changes
  useEffect(() => {
    dispatch({ type: 'LOAD_CHALLENGE', challenge: currentChallenge })
    setShowCelebration(false)
    setDragRune(null)
    sparksRef.current = []
    hammerProgressRef.current = 0
    isHammerSwingingRef.current = false
  }, [currentChallenge])

  // Authoritative Reward Economy Hook
  const { completeActivity } = useActivityEconomy({
    childId,
    activityType: 'spellforge',
    activityId: `spell_${currentChallenge.id}`,
  })

  // Timer Tick
  useEffect(() => {
    if (state.status === 'celebrating' || state.status === 'forged') return
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIMER', deltaSeconds: 1 })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.status])

  // Helper to spawn spark burst on anvil
  const triggerSparkBurst = useCallback((cx: number, cy: number, count: number = 40) => {
    const colors = ['#f59e0b', '#fbbf24', '#f97316', '#ef4444', '#fef08a', '#38bdf8']
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 6
      sparksRef.current.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5, // upward bias
        life: 1.0,
        maxLife: 0.6 + Math.random() * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4,
      })
    }
  }, [])

  // Hammer Strike Action Handler
  const handleHammerStrike = useCallback(async () => {
    if (state.status !== 'hammer_ready') return

    HapticsService.medium()
    sfxService.play('forge_hammer')
    isHammerSwingingRef.current = true
    hammerProgressRef.current = 0

    // Trigger sparks at anvil center
    triggerSparkBurst(400, 260, 50)
    dispatch({ type: 'TRIGGER_HAMMER_STRIKE' })

    // Complete activity after strike animation
    setTimeout(async () => {
      HapticsService.success()
      sfxService.play('spell_awaken')
      setShowCelebration(true)

      const calculated = calculateSpellforgeScore(state.telemetry, currentChallenge)
      try {
        await completeActivity({
          starsAmount: calculated.stars,
          xpAmount: calculated.xp,
        })
      } catch {
        // Handled gracefully inside hook
      }
    }, 650)
  }, [state.status, state.telemetry, currentChallenge, completeActivity, triggerSparkBurst])

  // Snap Rune to Socket Handler
  const handleSnapRune = useCallback(
    (socketId: string, rune: RuneBlock) => {
      sfxService.resumeContext().catch(() => {})
      HapticsService.light()
      sfxService.play('rune_snap')
      dispatch({ type: 'SNAP_RUNE_TO_SOCKET', socketId, rune })
      triggerSparkBurst(400, 260, 18)
    },
    [triggerSparkBurst]
  )

  // Remove Rune Handler
  const handleRemoveRune = useCallback((socketId: string) => {
    HapticsService.light()
    sfxService.play('potion_pickup')
    dispatch({ type: 'REMOVE_RUNE_FROM_SOCKET', socketId })
  }, [])

  // Advance to next challenge
  const handleNextChallenge = useCallback(() => {
    HapticsService.medium()
    setChallengeIndex((prev) => prev + 1)
    sfxService.play('card_flip')
  }, [])

  // Canvas 2D / 3D Forge Workshop Loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 800
    const H = 420
    let lastTime = performance.now()

    const renderLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      ctx.clearRect(0, 0, W, H)

      // 1. 3D Forge Workshop Background & Fiery Hearth Glow
      const bgGrad = ctx.createRadialGradient(400, 200, 30, 400, 200, 440)
      bgGrad.addColorStop(0, '#1c1917')
      bgGrad.addColorStop(0.5, '#0f172a')
      bgGrad.addColorStop(1, '#020617')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      // Hearth Ember Glow behind anvil
      const hearthGlow = ctx.createRadialGradient(400, 280, 20, 400, 280, 220)
      hearthGlow.addColorStop(0, 'rgba(234, 88, 12, 0.35)')
      hearthGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)')
      hearthGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = hearthGlow
      ctx.fillRect(0, 0, W, H)

      // 2. Heavy 3D Metallic Anvil
      const anvilCenterX = 400
      const anvilTopY = 240

      // Anvil Base Pedestal
      const baseGrad = ctx.createLinearGradient(anvilCenterX - 140, anvilTopY, anvilCenterX + 140, H - 20)
      baseGrad.addColorStop(0, '#475569')
      baseGrad.addColorStop(0.5, '#1e293b')
      baseGrad.addColorStop(1, '#0f172a')
      ctx.fillStyle = baseGrad
      ctx.beginPath()
      ctx.moveTo(anvilCenterX - 110, anvilTopY + 70)
      ctx.lineTo(anvilCenterX + 110, anvilTopY + 70)
      ctx.lineTo(anvilCenterX + 160, H - 25)
      ctx.lineTo(anvilCenterX - 160, H - 25)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 3
      ctx.stroke()

      // Anvil Upper Body & Horn (3D Cast Iron)
      const bodyGrad = ctx.createLinearGradient(anvilCenterX - 220, anvilTopY - 20, anvilCenterX + 220, anvilTopY + 70)
      bodyGrad.addColorStop(0, '#64748b')
      bodyGrad.addColorStop(0.5, '#334155')
      bodyGrad.addColorStop(1, '#1e293b')
      ctx.fillStyle = bodyGrad
      ctx.beginPath()
      // Left Horn
      ctx.moveTo(anvilCenterX - 220, anvilTopY + 5)
      ctx.quadraticCurveTo(anvilCenterX - 140, anvilTopY + 30, anvilCenterX - 120, anvilTopY + 60)
      ctx.lineTo(anvilCenterX + 120, anvilTopY + 60)
      // Right Heel
      ctx.lineTo(anvilCenterX + 190, anvilTopY + 50)
      ctx.lineTo(anvilCenterX + 190, anvilTopY - 10)
      ctx.lineTo(anvilCenterX - 130, anvilTopY - 10)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 3
      ctx.stroke()

      // Heated Steel Anvil Face Plate (Top Surface)
      const faceGrad = ctx.createLinearGradient(anvilCenterX - 160, anvilTopY - 12, anvilCenterX + 160, anvilTopY + 12)
      faceGrad.addColorStop(0, '#f59e0b')
      faceGrad.addColorStop(0.5, '#ea580c')
      faceGrad.addColorStop(1, '#78350f')
      ctx.fillStyle = faceGrad
      ctx.shadowColor = 'rgba(245, 158, 11, 0.6)'
      ctx.shadowBlur = 18
      ctx.beginPath()
      ctx.roundRect(anvilCenterX - 190, anvilTopY - 16, 380, 32, 6)
      ctx.fill()
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2.5
      ctx.stroke()
      ctx.shadowBlur = 0

      // 3. Render Anvil Sockets & Placed Runes
      currentChallenge.sockets.forEach((socket) => {
        const placed = state.placedRunes[socket.id]
        const sx = socket.x
        const sy = socket.y
        const sw = socket.width
        const sh = socket.height

        // Socket recess box
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
        ctx.beginPath()
        ctx.roundRect(sx - sw / 2, sy - sh / 2, sw, sh, 10)
        ctx.fill()
        ctx.strokeStyle = placed ? placed.color : 'rgba(251, 191, 36, 0.4)'
        ctx.lineWidth = placed ? 3 : 1.5
        ctx.setLineDash(placed ? [] : [6, 4])
        ctx.stroke()
        ctx.setLineDash([])

        if (placed) {
          // Placed 3D Rune Block
          const runeGrad = ctx.createLinearGradient(sx - sw / 2, sy - sh / 2, sx + sw / 2, sy + sh / 2)
          runeGrad.addColorStop(0, placed.color)
          runeGrad.addColorStop(1, '#0f172a')
          ctx.fillStyle = runeGrad
          ctx.shadowColor = placed.glowColor
          ctx.shadowBlur = 14
          ctx.beginPath()
          ctx.roundRect(sx - sw / 2 + 4, sy - sh / 2 + 4, sw - 8, sh - 8, 8)
          ctx.fill()
          ctx.strokeStyle = '#fef08a'
          ctx.lineWidth = 2
          ctx.stroke()
          ctx.shadowBlur = 0

          // Rune Text
          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 22px system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(placed.text, sx, sy)
        } else {
          // Empty Socket Hint Label
          ctx.fillStyle = 'rgba(148, 163, 184, 0.6)'
          ctx.font = 'bold 12px system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(socket.label, sx, sy)
        }
      })

      // 4. Render 3D Hammer (Hovering or Striking)
      if (state.status === 'hammer_ready' || isHammerSwingingRef.current) {
        if (isHammerSwingingRef.current) {
          hammerProgressRef.current += dt * 3.5
          if (hammerProgressRef.current >= 1) {
            hammerProgressRef.current = 1
            isHammerSwingingRef.current = false
          }
        }

        const swingAngle = isHammerSwingingRef.current
          ? Math.sin(hammerProgressRef.current * Math.PI) * 0.8
          : Math.sin(now / 300) * 0.08

        const hammerX = 400 + Math.cos(swingAngle) * 30
        const hammerY = isHammerSwingingRef.current ? 120 + hammerProgressRef.current * 90 : 110

        ctx.save()
        ctx.translate(hammerX, hammerY)
        ctx.rotate(swingAngle)

        // Wooden Handle
        ctx.fillStyle = '#78350f'
        ctx.beginPath()
        ctx.roundRect(-6, -90, 12, 90, 4)
        ctx.fill()
        ctx.strokeStyle = '#d97706'
        ctx.lineWidth = 2
        ctx.stroke()

        // 3D Runed Metallic Hammer Head
        const hHeadGrad = ctx.createLinearGradient(-35, -20, 35, 20)
        hHeadGrad.addColorStop(0, '#fef08a')
        hHeadGrad.addColorStop(0.5, '#d97706')
        hHeadGrad.addColorStop(1, '#78350f')
        ctx.fillStyle = hHeadGrad
        ctx.shadowColor = '#fbbf24'
        ctx.shadowBlur = 18
        ctx.beginPath()
        ctx.roundRect(-40, -18, 80, 36, 6)
        ctx.fill()
        ctx.strokeStyle = '#fef08a'
        ctx.lineWidth = 2.5
        ctx.stroke()

        // Runic Engraving on Hammer
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 14px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('ᚠ ᛏ ᛋ', 0, 0)

        ctx.restore()
      }

      // 5. Update & Draw Spark Particles
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const p = sparksRef.current[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.15 // gravity
        p.life -= dt / p.maxLife

        if (p.life <= 0) {
          sparksRef.current.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // 6. Draw Dragged Rune Ghost Follower
      if (dragRune) {
        ctx.save()
        ctx.translate(dragPos.x, dragPos.y)
        ctx.fillStyle = dragRune.color
        ctx.shadowColor = dragRune.glowColor
        ctx.shadowBlur = 20
        ctx.beginPath()
        ctx.roundRect(-36, -26, 72, 52, 8)
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2.5
        ctx.stroke()

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 20px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(dragRune.text, 0, 0)
        ctx.restore()
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop)
    }

    animationFrameRef.current = requestAnimationFrame(renderLoop)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [state.placedRunes, state.status, currentChallenge.sockets, dragRune, dragPos])

  // PointerCapture Drag & Snap Handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.setPointerCapture(e.pointerId)

      const rect = canvas.getBoundingClientRect()
      const clickX = (e.clientX - rect.left) * (800 / rect.width)
      const clickY = (e.clientY - rect.top) * (420 / rect.height)
      setDragPos({ x: clickX, y: clickY })

      // Check if clicked to remove a placed rune
      for (const socket of currentChallenge.sockets) {
        if (
          Math.abs(clickX - socket.x) <= socket.width / 2 &&
          Math.abs(clickY - socket.y) <= socket.height / 2 &&
          state.placedRunes[socket.id]
        ) {
          handleRemoveRune(socket.id)
          break
        }
      }
    },
    [currentChallenge.sockets, state.placedRunes, handleRemoveRune]
  )

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const curX = (e.clientX - rect.left) * (800 / rect.width)
    const curY = (e.clientY - rect.top) * (420 / rect.height)
    setDragPos({ x: curX, y: curY })
  }, [])

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (dragRune) {
        const canvas = canvasRef.current
        if (canvas) {
          const rect = canvas.getBoundingClientRect()
          const dropX = (e.clientX - rect.left) * (800 / rect.width)
          const dropY = (e.clientY - rect.top) * (420 / rect.height)

          // Find closest socket within snap radius (60px)
          let closestSocket = null
          let minDistance = 60

          for (const socket of currentChallenge.sockets) {
            const dist = Math.hypot(dropX - socket.x, dropY - socket.y)
            if (dist < minDistance && !state.placedRunes[socket.id]) {
              minDistance = dist
              closestSocket = socket
            }
          }

          if (closestSocket) {
            handleSnapRune(closestSocket.id, dragRune)
          }
        }
        setDragRune(null)
      }
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // Safe release
      }
    },
    [dragRune, currentChallenge.sockets, state.placedRunes, handleSnapRune]
  )

  // Direct Tap-to-Place Handler
  const handleRuneClick = useCallback(
    (rune: RuneBlock) => {
      // Find first empty socket
      const emptySocket = currentChallenge.sockets.find((s) => !state.placedRunes[s.id])
      if (emptySocket) {
        handleSnapRune(emptySocket.id, rune)
      }
    },
    [currentChallenge.sockets, state.placedRunes, handleSnapRune]
  )

  return (
    <div
      className="spellforge-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      <ActivityShell
        title="3D Spellforge Runic Anvil"
        tagline={story ? `Story Spell: ${story.title}` : currentChallenge.title}
        emoji="🔥"
        primaryDomain="vocabulary"
        difficulty={difficulty}
        variant="hero"
        onDifficultyChange={(newDiff) => {
          setDifficulty(newDiff)
          setChallengeIndex(0)
        }}
        progressInfo={`Rune Forge #${challengeIndex + 1}`}
        headerRight={
          onBack ? (
            <button
              type="button"
              onClick={onBack}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                color: '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ← Exit Forge
            </button>
          ) : null
        }
        className="spellforge-activity"
      >
        <div
          className="spellforge-workbench"
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflowY: 'auto',
            gap: '1rem',
            padding: '4px',
            color: '#f8fafc',
            userSelect: 'none',
          }}
        >
          {/* 1. Target Spell Incantation Banner */}
          <section
            className="spell-target-banner"
            aria-label="Target Spell Incantation"
            style={{
              background: 'linear-gradient(135deg, rgba(124, 45, 18, 0.9) 0%, rgba(30, 41, 59, 0.95) 100%)',
              borderRadius: '16px',
              border: `1.5px solid ${currentChallenge.targetWord.spellAuraColor}`,
              padding: '0.85rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  fontSize: '2.2rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '50%',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${currentChallenge.targetWord.spellAuraColor}`,
                  boxShadow: `0 0 16px ${currentChallenge.targetWord.spellAuraColor}`,
                }}
              >
                {currentChallenge.targetWord.spellEmoji}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase' }}>
                  Spell Recipe: {currentChallenge.targetWord.spellName}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', marginTop: '2px' }}>
                  &ldquo;{currentChallenge.targetWord.meaning}&rdquo;
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                padding: '0.5rem 0.9rem',
                borderRadius: '12px',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Phonetic Target</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '2px' }}>
                  {currentChallenge.targetWord.targetWord}
                </div>
              </div>
            </div>
          </section>

          {/* First-Turn Animated Hand Tutorial Prompt */}
          {Object.keys(state.placedRunes).length === 0 && (
            <div
              style={{
                alignSelf: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.25) 0%, rgba(251, 191, 36, 0.25) 100%)',
                border: '1.5px solid #fbbf24',
                borderRadius: '9999px',
                padding: '6px 16px',
                color: '#fef08a',
                fontSize: '13px',
                fontWeight: 800,
                animation: 'bounceGentle 2s infinite',
              }}
            >
              <span style={{ fontSize: '18px' }}>👇</span>
              <span>Tap or drag phonetic runes onto the glowing anvil sockets to forge the spell!</span>
            </div>
          )}

          {/* 2. Interactive 3D Anvil Forge Stage */}
          <section
            className="forge-canvas-stage"
            aria-label="3D Anvil Forge Stage"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(245, 158, 11, 0.3)',
              padding: '1rem',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.5), 0 12px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Top Status & Incantation Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: state.status === 'hammer_ready'
                  ? 'rgba(245, 158, 11, 0.25)'
                  : state.status === 'forged'
                  ? 'rgba(16, 185, 129, 0.25)'
                  : 'rgba(15, 23, 42, 0.75)',
                padding: '0.35rem 1.1rem',
                borderRadius: '999px',
                border: `1.5px solid ${
                  state.status === 'hammer_ready'
                    ? '#fbbf24'
                    : state.status === 'forged'
                    ? '#10b981'
                    : 'rgba(148, 163, 184, 0.3)'
                }`,
                transition: 'all 0.3s ease',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>
                {state.status === 'hammer_ready' ? '⚡' : state.status === 'forged' ? '✨' : '🔥'}
              </span>
              <span
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: state.status === 'hammer_ready'
                    ? '#fef08a'
                    : state.status === 'forged'
                    ? '#34d399'
                    : '#cbd5e1',
                }}
              >
                {state.status === 'hammer_ready'
                  ? 'RUNES ALIGNED! STRIKE THE ANVIL TO FORGE!'
                  : state.status === 'forged'
                  ? 'SPELL AWAKENED & FORGED!'
                  : `Socket ${Object.keys(state.placedRunes).length} of ${currentChallenge.sockets.length} Runes Positioned`}
              </span>
            </div>

            {/* 3D Anvil Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={420}
              className="spellforge-canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{
                touchAction: 'none',
                maxWidth: '100%',
                maxHeight: '280px',
                borderRadius: '12px',
              }}
            />

            {/* Forge Control Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => dispatch({ type: 'CLEAR_ANVIL' })}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
              >
                🗑️ Clear Anvil
              </button>
              {state.status === 'hammer_ready' && (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleHammerStrike}
                  style={{
                    fontSize: '0.92rem',
                    padding: '0.4rem 1.2rem',
                    background: 'linear-gradient(135deg, #ea580c 0%, #fbbf24 100%)',
                    boxShadow: '0 0 20px rgba(234, 88, 12, 0.6)',
                    fontWeight: 900,
                  }}
                >
                  🔨 Strike Anvil & Awaken Spell!
                </button>
              )}
            </div>
          </section>

          {/* 3. Phonetic & Morpheme Rune Rack */}
          <section
            className="rune-inventory-rack"
            aria-label="Phonetic Runes Rack"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
              borderRadius: '16px',
              border: '1.5px solid rgba(251, 191, 36, 0.3)',
              padding: '1rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>📜</span>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#fef08a' }}>
                  Phonetic Runes & Morpheme Roots
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Tap or drag rune to place on anvil
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                gap: '0.65rem',
              }}
            >
              {currentChallenge.availableRunes.map((rune) => {
                const isPlaced = Object.values(state.placedRunes).some((r) => r.id === rune.id)
                return (
                  <button
                    key={rune.id}
                    type="button"
                    disabled={isPlaced}
                    onClick={() => handleRuneClick(rune)}
                    onPointerDown={(e) => {
                      if (!isPlaced) {
                        setDragRune(rune)
                        const canvas = canvasRef.current
                        if (canvas) {
                          const rect = canvas.getBoundingClientRect()
                          setDragPos({
                            x: (e.clientX - rect.left) * (800 / rect.width),
                            y: (e.clientY - rect.top) * (420 / rect.height),
                          })
                        }
                      }
                    }}
                    style={{
                      backgroundColor: isPlaced ? 'rgba(30, 41, 59, 0.3)' : 'rgba(30, 41, 59, 0.9)',
                      border: `2px solid ${isPlaced ? 'rgba(148, 163, 184, 0.2)' : rune.color}`,
                      borderRadius: '12px',
                      padding: '0.65rem 0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem',
                      color: isPlaced ? '#64748b' : '#ffffff',
                      cursor: isPlaced ? 'not-allowed' : 'pointer',
                      boxShadow: isPlaced ? 'none' : `0 4px 12px ${rune.glowColor}`,
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      opacity: isPlaced ? 0.4 : 1,
                      minHeight: '52px',
                    }}
                  >
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: isPlaced ? '#64748b' : rune.color }}>
                      {rune.text}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{rune.phonemeSound}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* 4. Literacy & Science of Wonder Dossier */}
          {state.status === 'forged' && (
            <div
              className="science-dossier-card card-panel"
              role="region"
              aria-label="Literacy Science of Wonder Discovery"
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                border: `1.5px solid ${currentChallenge.targetWord.spellAuraColor}`,
                color: '#ffffff',
                boxShadow: `0 8px 24px ${currentChallenge.targetWord.spellAuraColor}40`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📖</span>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24' }}>
                  Language of Wonder: {currentChallenge.targetWord.scientificConcept.conceptTitle}
                </h4>
              </div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {currentChallenge.targetWord.scientificConcept.kidExplanation}
              </p>
              <div
                style={{
                  backgroundColor: 'rgba(251, 191, 36, 0.12)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '0.75rem',
                  padding: '0.6rem 0.9rem',
                  fontSize: '0.85rem',
                  color: '#fef08a',
                }}
              >
                <strong>💡 Fun Literacy Fact:</strong> {currentChallenge.targetWord.scientificConcept.funFact}
              </div>
            </div>
          )}
        </div>

        {/* Victory Celebration Modal */}
        <VictoryCelebrationModal
          isOpen={showCelebration}
          title={`Spell Forged: ${currentChallenge.targetWord.spellName}!`}
          subtitle={`Incantation awakened: "${currentChallenge.targetWord.incantation}"`}
          badgeEmoji={currentChallenge.targetWord.spellEmoji}
          xpEarned={state.telemetry.xp || 35}
          starsEarned={state.telemetry.stars || 8}
          nextLevelLabel="Next Rune Spell ➔"
          onNextLevel={handleNextChallenge}
          onExit={onBack}
        />
      </ActivityShell>
    </div>
  )
}
