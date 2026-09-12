import React, { useState, useReducer, useEffect, useCallback, useMemo, useRef } from 'react'
import type { StoryRecord } from '../../../types/story'
import type { DifficultyTier } from '../../../types/experience'
import type {
  WeightItem,
  ScalePanSide,
  PotionScalesPuzzle,
} from '../../../types/games/potionScales'
import {
  generatePotionPuzzle,
  getInitialPotionState,
  evaluatePotionAction,
  calculatePotionScore,
} from '../../../services/games/potionScalesEngine'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import { ActivityShell } from '../../experience/ActivityShell'
import { VictoryCelebrationModal } from '../../experience/VictoryCelebrationModal'

export interface PotionScalesProps {
  story?: StoryRecord | null
  childId?: string | null
  explorerLevel?: number
  onBack?: () => void
  initialDifficulty?: DifficultyTier
}

export const PotionScales: React.FC<PotionScalesProps> = ({
  story,
  childId = null,
  explorerLevel = 1,
  onBack,
  initialDifficulty = 'easy',
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty)
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [draggedItem, setDraggedItem] = useState<WeightItem | null>(null)
  const [, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Damped scale angle state ref for 60fps canvas physics
  const tiltAngleRef = useRef<number>(0)
  const angularVelRef = useRef<number>(0)

  // Current puzzle configuration (Curated -> Infinite Procedural)
  const currentPuzzle: PotionScalesPuzzle = useMemo(() => {
    return generatePotionPuzzle(puzzleIndex, difficulty, explorerLevel)
  }, [puzzleIndex, difficulty, explorerLevel])

  // Engine State Reducer
  const [state, dispatch] = useReducer(
    evaluatePotionAction,
    currentPuzzle,
    (p) => getInitialPotionState(p)
  )

  // Sync state when puzzle changes
  useEffect(() => {
    dispatch({ type: 'LOAD_PUZZLE', puzzle: currentPuzzle })
    setShowCelebration(false)
    tiltAngleRef.current = 0
    angularVelRef.current = 0
  }, [currentPuzzle])

  // Authoritative Reward Economy Hook
  const { completeActivity } = useActivityEconomy({
    childId,
    activityType: 'potion_scales',
    activityId: `potion_${currentPuzzle.id}`,
  })

  // Timer Tick
  useEffect(() => {
    if (state.status === 'celebrating') return
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIMER', deltaSeconds: 1 })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.status])

  // Sound & Haptic effects when equilibrium updates
  useEffect(() => {
    if (state.equilibrium.isBalanced) {
      HapticsService.medium()
      sfxService.play('balance_success')
    } else if (state.equilibrium.isNearBalanced) {
      HapticsService.light()
      sfxService.play('balance_near')
    } else if (state.movesCount > 0) {
      sfxService.play('scale_tilt')
    }
  }, [state.equilibrium.isBalanced, state.equilibrium.isNearBalanced, state.movesCount])

  // Brew Potion & Reward Trigger
  const handleBrewPotion = useCallback(async () => {
    if (!state.equilibrium.isBalanced) return

    HapticsService.success()
    sfxService.play('potion_complete')
    setShowCelebration(true)

    const calculated = calculatePotionScore(state.telemetry, currentPuzzle)

    try {
      await completeActivity({
        starsAmount: calculated.stars,
        xpAmount: calculated.xp,
      })
    } catch {
      // Handled gracefully inside hook
    }
  }, [state.equilibrium.isBalanced, state.telemetry, currentPuzzle, completeActivity])

  // Place Item Handler
  const handlePlaceItem = useCallback(
    (item: WeightItem, pan: ScalePanSide) => {
      sfxService.resumeContext().catch(() => {})
      HapticsService.light()
      sfxService.play('weight_drop')
      sfxService.play('scale_tilt')
      dispatch({ type: 'PLACE_ITEM', item, pan })
    },
    []
  )

  // Remove Item Handler
  const handleRemoveItem = useCallback((instanceId: string) => {
    sfxService.resumeContext().catch(() => {})
    HapticsService.light()
    sfxService.play('potion_pickup')
    dispatch({ type: 'REMOVE_ITEM', instanceId })
  }, [])

  // Clear Pan Handler
  const handleClearPan = useCallback((pan: ScalePanSide) => {
    HapticsService.medium()
    sfxService.play('potion_bubble')
    dispatch({ type: 'CLEAR_PAN', pan })
  }, [])

  // Advance to next puzzle
  const handleNextPuzzle = useCallback(() => {
    HapticsService.medium()
    setPuzzleIndex((prev) => prev + 1)
    sfxService.play('card_flip')
  }, [])

  const leftItems = useMemo(() => state.placedItems.filter((i) => i.pan === 'left'), [state.placedItems])
  const rightItems = useMemo(() => state.placedItems.filter((i) => i.pan === 'right'), [state.placedItems])

  // Canvas 2D / 3D Damped Scale Physics Loop
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

      // 1. Damped Harmonic Oscillator Tilt Physics:
      // I * d2theta/dt2 + c * dtheta/dt + k * (theta - theta_target) = 0
      const rawTarget = state.equilibrium.weightDifference * 4.0
      const targetAngle = Math.max(-20, Math.min(20, rawTarget)) // strictly clamp [-20deg, +20deg]

      const springK = 28.0
      const dampingC = 6.5
      const displacement = tiltAngleRef.current - targetAngle
      const springForce = -springK * displacement
      const dampingForce = -dampingC * angularVelRef.current
      const accel = springForce + dampingForce

      angularVelRef.current += accel * dt
      tiltAngleRef.current += angularVelRef.current * dt
      tiltAngleRef.current = Math.max(-20, Math.min(20, tiltAngleRef.current))

      const currentAngle = tiltAngleRef.current
      const angleRad = (currentAngle * Math.PI) / 180

      ctx.clearRect(0, 0, W, H)

      // 2. 3D Workshop Background & Radial Lighting
      const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 420)
      bgGrad.addColorStop(0, '#1e293b')
      bgGrad.addColorStop(0.6, '#0f172a')
      bgGrad.addColorStop(1, '#020617')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      // Wooden Shelf Wainscoting in Background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)'
      ctx.fillRect(40, H - 45, W - 80, 24)
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 2
      ctx.strokeRect(40, H - 45, W - 80, 24)

      // 3. Center Pedestal Pillar & Fulcrum Pivot
      const centerX = W / 2
      const centerY = 140

      // Solid Brass Pedestal
      const pedGrad = ctx.createLinearGradient(centerX - 20, centerY, centerX + 20, H - 40)
      pedGrad.addColorStop(0, '#d97706')
      pedGrad.addColorStop(0.5, '#78350f')
      pedGrad.addColorStop(1, '#451a03')
      ctx.fillStyle = pedGrad
      ctx.beginPath()
      ctx.moveTo(centerX - 16, centerY + 10)
      ctx.lineTo(centerX + 16, centerY + 10)
      ctx.lineTo(centerX + 32, H - 45)
      ctx.lineTo(centerX - 32, H - 45)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 3
      ctx.stroke()

      // Fulcrum Diamond Pivot Point
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.fillStyle = state.equilibrium.isBalanced ? '#10b981' : '#f59e0b'
      ctx.shadowColor = state.equilibrium.isBalanced ? '#10b981' : '#f59e0b'
      ctx.shadowBlur = state.equilibrium.isBalanced ? 20 : 10
      ctx.beginPath()
      ctx.arc(0, 0, 16, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#fef08a'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.restore()

      // 4. Rotating 3D Brass Balance Beam (Heavier side tilts DOWN, lighter side tilts UP)
      const beamHalfLen = 220
      const leftTipX = centerX - Math.cos(angleRad) * beamHalfLen
      const leftTipY = centerY + Math.sin(angleRad) * beamHalfLen
      const rightTipX = centerX + Math.cos(angleRad) * beamHalfLen
      const rightTipY = centerY - Math.sin(angleRad) * beamHalfLen

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(-angleRad) // Counter-clockwise tilts left end down (+Y) and right end up (-Y)

      // Brass Beam Bar
      const beamGrad = ctx.createLinearGradient(0, -8, 0, 8)
      beamGrad.addColorStop(0, '#fef08a')
      beamGrad.addColorStop(0.5, '#d97706')
      beamGrad.addColorStop(1, '#78350f')
      ctx.fillStyle = beamGrad
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.roundRect(-beamHalfLen, -8, beamHalfLen * 2, 16, 8)
      ctx.fill()
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2.5
      ctx.stroke()

      // Center Vertical Indicator Needle
      ctx.fillStyle = state.equilibrium.isBalanced ? '#34d399' : '#fbbf24'
      ctx.beginPath()
      ctx.moveTo(-3, 0)
      ctx.lineTo(3, 0)
      ctx.lineTo(0, -45)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // 5. Draw Left & Right Suspended Pans and Chains
      const drawPan = (tipX: number, tipY: number, items: typeof leftItems, side: ScalePanSide) => {
        const panW = 150
        const panH = 20
        const chainLen = 100
        const panCenterY = tipY + chainLen

        // Metallic Suspension Chains
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(tipX, tipY)
        ctx.lineTo(tipX - panW / 2 + 10, panCenterY)
        ctx.moveTo(tipX, tipY)
        ctx.lineTo(tipX + panW / 2 - 10, panCenterY)
        ctx.stroke()

        // Brass Pan Saucer
        const saucerGrad = ctx.createLinearGradient(tipX - panW / 2, panCenterY, tipX + panW / 2, panCenterY + panH)
        saucerGrad.addColorStop(0, '#fef08a')
        saucerGrad.addColorStop(0.5, '#b45309')
        saucerGrad.addColorStop(1, '#78350f')
        ctx.fillStyle = saucerGrad
        ctx.shadowColor = 'rgba(0,0,0,0.6)'
        ctx.shadowBlur = 16
        ctx.beginPath()
        ctx.ellipse(tipX, panCenterY + 10, panW / 2, 12, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = 3
        ctx.stroke()

        // Render Weights / Beakers on Pan
        const timeSec = now / 1000
        const itemSpacing = 36
        const startItemX = tipX - ((items.length - 1) * itemSpacing) / 2

        items.forEach((instance, idx) => {
          const ix = startItemX + idx * itemSpacing
          const iy = panCenterY - 14
          const it = instance.item

          ctx.save()
          if (it.type === 'liquid_beaker') {
            // Glass Beaker with Dynamic Sloshing Liquid
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
            ctx.strokeStyle = '#38bdf8'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.roundRect(ix - 18, iy - 32, 36, 40, 4)
            ctx.fill()
            ctx.stroke()

            // Sloshing Liquid
            ctx.fillStyle = it.color || '#38bdf8'
            ctx.beginPath()
            ctx.moveTo(ix - 16, iy + 6)
            ctx.lineTo(ix + 16, iy + 6)
            const waveH = Math.sin(timeSec * 4 + idx) * 3
            ctx.lineTo(ix + 16, iy - 14 + waveH)
            ctx.lineTo(ix - 16, iy - 14 - waveH)
            ctx.closePath()
            ctx.fill()

            ctx.font = '16px sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(it.emoji, ix, iy - 10)
          } else if (it.type === 'ingot') {
            // 3D Metallic Gold/Amber Ingot
            ctx.fillStyle = it.color
            ctx.shadowColor = it.glowColor
            ctx.shadowBlur = 12
            ctx.beginPath()
            ctx.roundRect(ix - 16, iy - 22, 32, 26, 4)
            ctx.fill()
            ctx.strokeStyle = '#fef08a'
            ctx.lineWidth = 2
            ctx.stroke()

            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 11px system-ui, sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(it.displayWeightLabel, ix, iy - 8)
          } else {
            // Gem / Crystal / Fraction Shard
            ctx.fillStyle = it.color
            ctx.shadowColor = it.glowColor
            ctx.shadowBlur = 14
            ctx.font = '22px sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(it.emoji, ix, iy - 10)

            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 10px system-ui, sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(it.displayWeightLabel, ix, iy + 8)
          }
          ctx.restore()
        })

        // Pan Weight Label Pill
        const totalPanW = side === 'left' ? state.equilibrium.leftTotalWeight : state.equilibrium.rightTotalWeight
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
        ctx.beginPath()
        ctx.roundRect(tipX - 32, panCenterY + 26, 64, 22, 11)
        ctx.fill()
        ctx.strokeStyle = side === 'left' ? '#38bdf8' : '#fbbf24'
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 12px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`${totalPanW}g`, tipX, panCenterY + 41)
      }

      drawPan(leftTipX, leftTipY, leftItems, 'left')
      drawPan(rightTipX, rightTipY, rightItems, 'right')

      animationFrameRef.current = requestAnimationFrame(renderLoop)
    }

    animationFrameRef.current = requestAnimationFrame(renderLoop)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [state.equilibrium, leftItems, rightItems])

  // PointerCapture Drag & Snap Handler
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.setPointerCapture(e.pointerId)

      const rect = canvas.getBoundingClientRect()
      const clickX = (e.clientX - rect.left) * (800 / rect.width)
      const clickY = (e.clientY - rect.top) * (420 / rect.height)
      setDragPos({ x: clickX, y: clickY })

      // Check if clicked to remove an item from pan
      if (clickX < 400 && leftItems.length > 0) {
        // Tap left pan to inspect
      } else if (clickX >= 400 && rightItems.length > 0) {
        // Tap right pan removes last item
        const last = rightItems[rightItems.length - 1]
        if (last) {
          handleRemoveItem(last.instanceId)
        }
      }
    },
    [leftItems, rightItems, handleRemoveItem]
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
      if (draggedItem) {
        const canvas = canvasRef.current
        if (canvas) {
          const rect = canvas.getBoundingClientRect()
          const dropX = (e.clientX - rect.left) * (800 / rect.width)
          // If dropped on right half, place on right pan
          if (dropX >= 350) {
            handlePlaceItem(draggedItem, 'right')
          } else {
            handlePlaceItem(draggedItem, 'left')
          }
        }
        setDraggedItem(null)
      }
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // Safe release
      }
    },
    [draggedItem, handlePlaceItem]
  )

  return (
    <div
      className="potion-scales-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      <ActivityShell
        title="3D Apothecary Balance Scales"
        tagline={story ? `Story Alchemy Order: ${story.title}` : currentPuzzle.title}
        emoji="⚖️"
        primaryDomain="logic"
        difficulty={difficulty}
        variant="hero"
        onDifficultyChange={(newDiff) => {
          setDifficulty(newDiff)
          setPuzzleIndex(0)
        }}
        progressInfo={`Potion Order #${puzzleIndex + 1}`}
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
              ← Exit Lab
            </button>
          ) : null
        }
        className="potion-scales-activity"
      >
        <div
          className="potion-scales-workbench"
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
          {/* 1. Customer Order & Recipe Header Banner */}
          <section
            className="customer-order-banner"
            aria-label="Customer Potion Order"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)',
              borderRadius: '16px',
              border: '1.5px solid rgba(56, 189, 248, 0.3)',
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
                  border: '2px solid #38bdf8',
                  boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)',
                }}
              >
                {currentPuzzle.recipe.customer.avatar}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Customer: {currentPuzzle.recipe.customer.name}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', marginTop: '2px' }}>
                  &ldquo;{currentPuzzle.recipe.customer.orderQuote}&rdquo;
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                padding: '0.5rem 0.9rem',
                borderRadius: '12px',
                border: `1.5px solid ${currentPuzzle.recipe.potionColor}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <span style={{ fontSize: '1.6rem' }}>{currentPuzzle.recipe.potionEmoji}</span>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Algebraic Equation</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: currentPuzzle.recipe.potionColor }}>
                  {currentPuzzle.recipe.displayTargetFormula}
                </div>
              </div>
            </div>
          </section>

          {/* First-Turn Animated Hand Tutorial Prompt */}
          {state.placedItems.length <= 1 && (
            <div
              style={{
                alignSelf: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)',
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
              <span>Tap weights from the shelf below to balance the customer order!</span>
            </div>
          )}

          {/* 2. Interactive Physical Balance Scale Canvas */}
          <section
            className="balance-scale-stage"
            aria-label="Apothecary Balance Scale"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(56, 189, 248, 0.25)',
              padding: '1rem',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.5), 0 12px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Top Status Needle & Equilibrium Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: state.equilibrium.isBalanced
                  ? 'rgba(16, 185, 129, 0.25)'
                  : state.equilibrium.isNearBalanced
                  ? 'rgba(245, 158, 11, 0.25)'
                  : 'rgba(15, 23, 42, 0.75)',
                padding: '0.35rem 1.1rem',
                borderRadius: '999px',
                border: `1.5px solid ${
                  state.equilibrium.isBalanced
                    ? '#10b981'
                    : state.equilibrium.isNearBalanced
                    ? '#f59e0b'
                    : 'rgba(148, 163, 184, 0.3)'
                }`,
                transition: 'all 0.3s ease',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>
                {state.equilibrium.isBalanced ? '✨' : state.equilibrium.isNearBalanced ? '⚡' : '⚖️'}
              </span>
              <span
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: state.equilibrium.isBalanced
                    ? '#34d399'
                    : state.equilibrium.isNearBalanced
                    ? '#fbbf24'
                    : '#cbd5e1',
                }}
              >
                {state.equilibrium.isBalanced
                  ? 'PERFECT EQUILIBRIUM (BALANCED!)'
                  : state.equilibrium.isNearBalanced
                  ? `NEAR BALANCE! (Difference: ${Math.abs(state.equilibrium.weightDifference)}g)`
                  : state.equilibrium.weightDifference > 0
                  ? `Left side is heavier by ${state.equilibrium.weightDifference}g`
                  : state.equilibrium.weightDifference < 0
                  ? `Right side is heavier by ${Math.abs(state.equilibrium.weightDifference)}g`
                  : 'Empty Balance'}
              </span>
            </div>

            {/* 3D Scale Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={420}
              className="balance-scale-canvas"
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

            {/* Pan Action Controls */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => handleClearPan('right')}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
              >
                🗑️ Clear Right Pan
              </button>
              {state.equilibrium.isBalanced && (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleBrewPotion}
                  style={{
                    fontSize: '0.88rem',
                    padding: '0.35rem 1rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                    boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  ✨ Brew Magical Potion!
                </button>
              )}
            </div>
          </section>

          {/* 3. Gram Weights & Fraction Shards Inventory Shelf */}
          <section
            className="weights-inventory-shelf"
            aria-label="Weights and Fraction Shards Inventory"
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
                <span style={{ fontSize: '1.3rem' }}>🧰</span>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#fef08a' }}>
                  Apothecary Weights & Fraction Shards
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Tap weight to place on right pan
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.65rem',
              }}
            >
              {currentPuzzle.recipe.availableInventory.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handlePlaceItem(item, 'right')}
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.85)',
                    border: `1.5px solid ${item.color || '#38bdf8'}`,
                    borderRadius: '12px',
                    padding: '0.65rem 0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    minHeight: '44px',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: item.color }}>
                    {item.displayWeightLabel}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>{item.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 4. Science of Wonder Dossier */}
          {state.status === 'celebrating' && (
            <div
              className="science-dossier-card card-panel"
              role="region"
              aria-label="Science of Wonder Discovery"
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                border: '1.5px solid #38bdf8',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(56, 189, 248, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🔬</span>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                  Science of Wonder: {currentPuzzle.scientificConcept.conceptTitle}
                </h4>
              </div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {currentPuzzle.scientificConcept.kidExplanation}
              </p>
              <div
                style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '0.75rem',
                  padding: '0.6rem 0.9rem',
                  fontSize: '0.85rem',
                  color: '#bae6fd',
                }}
              >
                <strong>💡 Fun Science Fact:</strong> {currentPuzzle.scientificConcept.funFact}
              </div>
            </div>
          )}
        </div>

        {/* Victory Celebration Modal */}
        <VictoryCelebrationModal
          isOpen={showCelebration}
          title="Potion Order Calibrated & Brewed!"
          subtitle={`${currentPuzzle.recipe.customer.name} rejoices: "${currentPuzzle.recipe.customer.celebrationQuote}"`}
          badgeEmoji="⚖️"
          xpEarned={state.telemetry.xp || 35}
          starsEarned={state.telemetry.stars || 8}
          nextLevelLabel="Next Potion Order ➔"
          onNextLevel={handleNextPuzzle}
          onExit={onBack}
        />
      </ActivityShell>
    </div>
  )
}
