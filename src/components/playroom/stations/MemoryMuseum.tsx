import React, { useState, useReducer, useEffect, useCallback, useMemo, useRef } from 'react'
import type { StoryRecord } from '../../../types/story'
import type { DifficultyTier } from '../../../types/experience'
import type { MemoryMuseumChallenge } from '../../../types/games/memoryMuseum'
import {
  generateMemoryMuseumChallenge,
  getInitialMemoryMuseumState,
  evaluateMemoryMuseumAction,
  calculateMemoryMuseumScore,
} from '../../../services/games/memoryMuseumEngine'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import { ActivityShell } from '../../experience/ActivityShell'
import { VictoryCelebrationModal } from '../../experience/VictoryCelebrationModal'

export interface MemoryMuseumProps {
  story?: StoryRecord | null
  childId?: string | null
  explorerLevel?: number
  onBack?: () => void
  initialDifficulty?: DifficultyTier
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export const MemoryMuseum: React.FC<MemoryMuseumProps> = ({
  story,
  childId = null,
  explorerLevel = 1,
  onBack,
  initialDifficulty = 'easy',
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  // Visual card animation angles: cardIndex -> currentAngle (0 to 180)
  const cardAnglesRef = useRef<number[]>([])
  const particlesRef = useRef<Particle[]>([])

  // Current challenge
  const currentChallenge: MemoryMuseumChallenge = useMemo(() => {
    return generateMemoryMuseumChallenge(challengeIndex, difficulty, explorerLevel)
  }, [challengeIndex, difficulty, explorerLevel])

  // Engine state reducer
  const [state, dispatch] = useReducer(
    evaluateMemoryMuseumAction,
    currentChallenge,
    (c) => getInitialMemoryMuseumState(c)
  )

  // Sync state when challenge changes
  useEffect(() => {
    dispatch({ type: 'LOAD_CHALLENGE', challenge: currentChallenge })
    setShowCelebration(false)
    cardAnglesRef.current = new Array(currentChallenge.cards.length).fill(0)
    particlesRef.current = []
  }, [currentChallenge])

  // Authoritative Reward Economy Hook
  const { completeActivity } = useActivityEconomy({
    childId,
    activityType: 'memory_museum',
    activityId: `museum_${currentChallenge.id}`,
  })

  // Timer Tick
  useEffect(() => {
    if (state.status === 'celebrating' || state.status === 'restored') return
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIMER', deltaSeconds: 1 })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.status])

  // Spawn celebration particles
  const spawnMatchParticles = useCallback((cx: number, cy: number) => {
    const colors = ['#fbbf24', '#f59e0b', '#38bdf8', '#34d399', '#fef08a', '#c084fc']
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 5
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        life: 1.0,
        maxLife: 0.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4,
      })
    }
  }, [])

  // Check mismatch delay timer
  useEffect(() => {
    if (state.status === 'checking_match') {
      const timer = setTimeout(() => {
        sfxService.play('mistake_soft')
        dispatch({ type: 'RESOLVE_MATCH_CHECK', isMatch: false })
      }, 950)
      return () => clearTimeout(timer)
    }
  }, [state.status])

  // Handle Exhibition Restoration & Rewards
  useEffect(() => {
    if (state.status === 'restored' && !showCelebration) {
      HapticsService.success()
      sfxService.play('victory_fanfare')
      setShowCelebration(true)

      const calculated = calculateMemoryMuseumScore(state.telemetry, currentChallenge)
      completeActivity({
        starsAmount: calculated.stars,
        xpAmount: calculated.xp,
      }).catch(() => {
        // Handled gracefully inside hook
      })
    }
  }, [state.status, showCelebration, state.telemetry, currentChallenge, completeActivity])

  // Card Tap Handler
  const handleCardClick = useCallback(
    (cardIndex: number) => {
      const card = state.cards[cardIndex]
      if (!card || card.isFlipped || card.isMatched || state.status === 'checking_match') return

      HapticsService.light()
      sfxService.play('card_flip')
      dispatch({ type: 'FLIP_CARD', cardIndex })
    },
    [state.cards, state.status]
  )

  // Advance to next exhibition
  const handleNextExhibition = useCallback(() => {
    HapticsService.medium()
    setChallengeIndex((prev) => prev + 1)
    sfxService.play('card_flip')
  }, [])

  // Canvas 2D / 3D Gallery Rendering Loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 800
    const H = 440
    let lastTime = performance.now()

    const renderLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      ctx.clearRect(0, 0, W, H)

      // 1. Atmospheric Museum Gallery Background
      const bgGrad = ctx.createRadialGradient(W / 2, 120, 20, W / 2, H / 2, 460)
      bgGrad.addColorStop(0, '#1e1b4b')
      bgGrad.addColorStop(0.5, '#0f172a')
      bgGrad.addColorStop(1, '#020617')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      // Ceiling Spotlight Beams
      const spotGrad = ctx.createLinearGradient(0, 0, 0, H)
      spotGrad.addColorStop(0, 'rgba(251, 191, 36, 0.12)')
      spotGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.05)')
      spotGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = spotGrad
      ctx.fillRect(0, 0, W, H)

      // Checkered Marble Floor Perspective
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)'
      ctx.lineWidth = 1.5
      for (let i = 0; i <= W; i += 80) {
        ctx.beginPath()
        ctx.moveTo(i, H - 40)
        ctx.lineTo(W / 2 + (i - W / 2) * 0.4, H - 120)
        ctx.stroke()
      }

      // 2. Render Relic Cards with 3D Flip Physics
      const rows = currentChallenge.rows
      const cols = currentChallenge.cols

      const cardW = Math.max(65, Math.min(105, (W - 120) / cols - 16))
      const cardH = Math.max(75, Math.min(115, (H - 120) / rows - 16))

      const totalGridW = cols * (cardW + 16) - 16
      const totalGridH = rows * (cardH + 16) - 16
      const startX = (W - totalGridW) / 2 + cardW / 2
      const startY = (H - totalGridH) / 2 + cardH / 2 + 10

      state.cards.forEach((card, idx) => {
        const r = card.row
        const c = card.col
        const cx = startX + c * (cardW + 16)
        const cy = startY + r * (cardH + 16)

        // Interpolate flip angle towards target (0 or 180)
        const targetAngle = card.isFlipped ? 180 : 0
        if (!cardAnglesRef.current[idx]) cardAnglesRef.current[idx] = 0
        const currentAngle = cardAnglesRef.current[idx]
        const speed = 540 // deg per second
        if (currentAngle < targetAngle) {
          cardAnglesRef.current[idx] = Math.min(targetAngle, currentAngle + speed * dt)
        } else if (currentAngle > targetAngle) {
          cardAnglesRef.current[idx] = Math.max(targetAngle, currentAngle - speed * dt)
        }

        const angle = cardAnglesRef.current[idx]
        const angleRad = (angle * Math.PI) / 180
        const scaleX = Math.abs(Math.cos(angleRad))

        // Card Pedestal Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
        ctx.beginPath()
        ctx.ellipse(cx, cy + cardH / 2 + 8, (cardW / 2) * scaleX, 8, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(scaleX, 1)

        if (angle < 90) {
          // --- CARD BACK (Gilded Museum Crest) ---
          const backGrad = ctx.createLinearGradient(-cardW / 2, -cardH / 2, cardW / 2, cardH / 2)
          backGrad.addColorStop(0, '#312e81')
          backGrad.addColorStop(0.6, '#1e1b4b')
          backGrad.addColorStop(1, '#0f172a')
          ctx.fillStyle = backGrad
          ctx.beginPath()
          ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 10)
          ctx.fill()
          ctx.strokeStyle = '#fbbf24'
          ctx.lineWidth = 2
          ctx.stroke()

          // Inner gold filigree border
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)'
          ctx.lineWidth = 1
          ctx.strokeRect(-cardW / 2 + 5, -cardH / 2 + 5, cardW - 10, cardH - 10)

          // Museum Emblem
          ctx.font = '24px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('🏛️', 0, 0)
        } else {
          // --- CARD FRONT (Revealed Relic) ---
          const relic = card.relic
          const isMatched = card.isMatched

          const frontGrad = ctx.createLinearGradient(-cardW / 2, -cardH / 2, cardW / 2, cardH / 2)
          frontGrad.addColorStop(0, isMatched ? '#064e3b' : '#1e293b')
          frontGrad.addColorStop(1, '#0f172a')
          ctx.fillStyle = frontGrad
          ctx.shadowColor = isMatched ? '#10b981' : relic.color
          ctx.shadowBlur = isMatched ? 20 : 12
          ctx.beginPath()
          ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 10)
          ctx.fill()
          ctx.strokeStyle = isMatched ? '#34d399' : relic.color
          ctx.lineWidth = isMatched ? 3 : 2
          ctx.stroke()
          ctx.shadowBlur = 0

          // Relic Icon
          ctx.font = '28px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(relic.emoji, 0, -10)

          // Relic Name
          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 10px system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(relic.name.slice(0, 14), 0, cardH / 2 - 12)
        }

        ctx.restore()
      })

      // 3. Render Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.1 // gravity
        p.life -= dt / p.maxLife

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1)
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

      animationFrameRef.current = requestAnimationFrame(renderLoop)
    }

    animationFrameRef.current = requestAnimationFrame(renderLoop)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [state.cards, currentChallenge])

  // PointerCapture Click Detection
  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.setPointerCapture(e.pointerId)

      const rect = canvas.getBoundingClientRect()
      const clickX = (e.clientX - rect.left) * (800 / rect.width)
      const clickY = (e.clientY - rect.top) * (440 / rect.height)

      const rows = currentChallenge.rows
      const cols = currentChallenge.cols
      const cardW = Math.max(65, Math.min(105, (800 - 120) / cols - 16))
      const cardH = Math.max(75, Math.min(115, (440 - 120) / rows - 16))

      const totalGridW = cols * (cardW + 16) - 16
      const totalGridH = rows * (cardH + 16) - 16
      const startX = (800 - totalGridW) / 2 + cardW / 2
      const startY = (440 - totalGridH) / 2 + cardH / 2 + 10

      state.cards.forEach((card, idx) => {
        const cx = startX + card.col * (cardW + 16)
        const cy = startY + card.row * (cardH + 16)

        if (
          Math.abs(clickX - cx) <= cardW / 2 &&
          Math.abs(clickY - cy) <= cardH / 2 &&
          !card.isFlipped &&
          !card.isMatched
        ) {
          handleCardClick(idx)
          spawnMatchParticles(cx, cy)
        }
      })
    },
    [currentChallenge, state.cards, handleCardClick, spawnMatchParticles]
  )

  const handleCanvasPointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Safe release
    }
  }, [])

  return (
    <div
      className="memory-museum-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      <ActivityShell
        title="3D Memory Museum"
        tagline={story ? `Story Gallery: ${story.title}` : currentChallenge.title}
        emoji="🏛️"
        primaryDomain="memory"
        difficulty={difficulty}
        onDifficultyChange={(newDiff) => {
          setDifficulty(newDiff)
          setChallengeIndex(0)
        }}
        progressInfo={`Gallery Hall #${challengeIndex + 1} (${state.matchedPairIds.length}/${currentChallenge.totalPairs} Restored)`}
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
              ← Exit Museum
            </button>
          ) : null
        }
        className="memory-museum-activity"
      >
        <div
          className="memory-museum-workbench"
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
          {/* 1. Curator & Exhibition Banner */}
          <section
            className="curator-exhibit-banner"
            aria-label="Curator Exhibition Banner"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              borderRadius: '16px',
              border: `1.5px solid ${currentChallenge.exhibition.themeColor}`,
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
                  border: `2px solid ${currentChallenge.exhibition.themeColor}`,
                  boxShadow: `0 0 16px ${currentChallenge.exhibition.themeColor}`,
                }}
              >
                {currentChallenge.exhibition.curatorAvatar}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: currentChallenge.exhibition.themeColor, fontWeight: 800, textTransform: 'uppercase' }}>
                  Curator: {currentChallenge.exhibition.curatorName}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', marginTop: '2px' }}>
                  &ldquo;{currentChallenge.exhibition.curatorQuote}&rdquo;
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
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Restored Relics</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '1px' }}>
                  {state.matchedPairIds.length} / {currentChallenge.totalPairs} Pairs
                </div>
              </div>
            </div>
          </section>

          {/* First-Turn Animated Hand Tutorial Prompt */}
          {state.movesCount === 0 && (
            <div
              style={{
                alignSelf: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(251, 191, 36, 0.25) 100%)',
                border: '1.5px solid #a855f7',
                borderRadius: '9999px',
                padding: '6px 16px',
                color: '#fef08a',
                fontSize: '13px',
                fontWeight: 800,
                animation: 'bounceGentle 2s infinite',
              }}
            >
              <span style={{ fontSize: '18px' }}>👇</span>
              <span>Tap any two museum cases to reveal matching historical relics!</span>
            </div>
          )}

          {/* 2. Interactive 3D Museum Gallery Stage */}
          <section
            className="museum-canvas-stage"
            aria-label="3D Museum Gallery Canvas"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(124, 58, 237, 0.3)',
              padding: '1rem',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.5), 0 12px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Top Status & Match Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: state.status === 'restored'
                  ? 'rgba(16, 185, 129, 0.25)'
                  : 'rgba(15, 23, 42, 0.75)',
                padding: '0.35rem 1.1rem',
                borderRadius: '999px',
                border: `1.5px solid ${
                  state.status === 'restored'
                    ? '#10b981'
                    : 'rgba(148, 163, 184, 0.3)'
                }`,
                transition: 'all 0.3s ease',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>
                {state.status === 'restored' ? '✨' : '🏛️'}
              </span>
              <span
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: state.status === 'restored'
                    ? '#34d399'
                    : '#cbd5e1',
                }}
              >
                {state.status === 'restored'
                  ? 'EXHIBITION RESTORED TO PERFECTION!'
                  : `Select cases to restore the ${currentChallenge.exhibition.themeTitle}`}
              </span>
            </div>

            {/* 3D Gallery Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={440}
              className="memory-museum-canvas"
              onPointerDown={handleCanvasPointerDown}
              onPointerUp={handleCanvasPointerUp}
              style={{
                touchAction: 'none',
                maxWidth: '100%',
                maxHeight: '320px',
                borderRadius: '12px',
              }}
            />
          </section>

          {/* 3. Science of Wonder Dossier */}
          {state.status === 'restored' && (
            <div
              className="science-dossier-card card-panel"
              role="region"
              aria-label="Cognitive Science of Wonder Discovery"
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                border: `1.5px solid ${currentChallenge.exhibition.themeColor}`,
                color: '#ffffff',
                boxShadow: `0 8px 24px ${currentChallenge.exhibition.themeColor}40`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🧠</span>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24' }}>
                  Mind of Wonder: {currentChallenge.exhibition.scientificConcept.conceptTitle}
                </h4>
              </div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {currentChallenge.exhibition.scientificConcept.kidExplanation}
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
                <strong>💡 Fun Brain Fact:</strong> {currentChallenge.exhibition.scientificConcept.funFact}
              </div>
            </div>
          )}
        </div>

        {/* Victory Celebration Modal */}
        <VictoryCelebrationModal
          isOpen={showCelebration}
          title={`Exhibition Restored: ${currentChallenge.exhibition.themeTitle}!`}
          subtitle={`${currentChallenge.exhibition.curatorName} praises: "${currentChallenge.exhibition.celebrationQuote}"`}
          badgeEmoji={currentChallenge.exhibition.themeEmoji}
          xpEarned={state.telemetry.xp || 35}
          starsEarned={state.telemetry.stars || 8}
          nextLevelLabel="Next Exhibition ➔"
          onNextLevel={handleNextExhibition}
          onExit={onBack}
        />
      </ActivityShell>
    </div>
  )
}
