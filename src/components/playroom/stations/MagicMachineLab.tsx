import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { DifficultyTier } from '../../../types/experience'
import type {
  MachineComponentType,
  MachineConfig,
  MachineState,
} from '../../../types/games/magicMachine'
import {
  generateLevel,
  getInitialState,
  evaluateAction,
  stepSimulation,
  COMPONENT_METADATA,
  MAGIC_MACHINE_PUZZLES,
} from '../../../services/games/magicMachineEngine'
import { ActivityShell } from '../../experience/ActivityShell'
import { RewardCelebration } from '../../experience/RewardCelebration'
import { sfxService } from '../../../services/audio/sfxService'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { useAuth } from '../../../context/AuthContext'
import { childProfileService } from '../../../services/childProfileService'

interface MagicMachineLabProps {
  initialDifficulty?: DifficultyTier
  puzzleId?: string
  onComplete?: () => void
  onExit?: () => void
}

export const MagicMachineLab: React.FC<MagicMachineLabProps> = ({
  initialDifficulty = 'easy',
  puzzleId,
  onComplete,
  onExit,
}) => {
  const { user } = useAuth()
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)

  // Fetch active child profile
  useEffect(() => {
    async function loadChild() {
      if (!user) return
      try {
        const { data } = await childProfileService.getChildProfiles(user.id)
        if (data && data.length > 0) {
          setSelectedChildId(data[0].id)
        }
      } catch {
        // Fallback to guest
      }
    }
    loadChild()
  }, [user])

  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty)
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0)
  const [selectedToolboxType, setSelectedToolboxType] = useState<MachineComponentType | null>(null)
  const [showScienceDossier, setShowScienceDossier] = useState<boolean>(false)
  const [showHint, setShowHint] = useState<boolean>(false)
  const [ariaAnnouncement, setAriaAnnouncement] = useState<string>('Welcome to Magic Machine Lab!')

  // Level configuration
  const currentConfig: MachineConfig = useMemo(() => {
    if (puzzleId) {
      const found = MAGIC_MACHINE_PUZZLES.find((p) => p.id === puzzleId)
      if (found) return found
    }
    return generateLevel(puzzleIndex, difficulty)
  }, [puzzleId, puzzleIndex, difficulty])

  // Core Engine State
  const [gameState, setGameState] = useState<MachineState>(() => getInitialState(currentConfig))

  // Re-initialize state when config changes
  useEffect(() => {
    setGameState(getInitialState(currentConfig))
    setShowScienceDossier(false)
    setShowHint(false)
    setAriaAnnouncement(`Puzzle loaded: ${currentConfig.title}. ${currentConfig.subtitle}`)
  }, [currentConfig])

  // Canvas Ref & Animation Frame
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(performance.now())

  // Authoritative Reward Bridge
  const activityIdentity = useMemo(() => {
    return {
      activityType: 'magic_machine',
      activityId: `puzzle_${currentConfig.id}`,
    }
  }, [currentConfig.id])

  const {
    rewardStatus,
    isSubmitting: _isEconomySubmitting,
    completeActivity,
    resetActivity: resetEconomy,
  } = useActivityEconomy({
    childId: selectedChildId,
    activityType: activityIdentity.activityType,
    activityId: activityIdentity.activityId,
  })

  // Sound triggering on collisions
  const prevCollisionsRef = useRef<string[]>([])
  useEffect(() => {
    const newCollisions = gameState.activeCollisions.filter(
      (id) => !prevCollisionsRef.current.includes(id)
    )

    if (newCollisions.length > 0) {
      const comp = [
        ...gameState.config.fixedComponents,
        ...gameState.placedComponents,
      ].find((c) => c.id === newCollisions[0])

      if (comp) {
        if (comp.type.startsWith('spring')) {
          sfxService.play('spring_bounce')
        } else if (comp.type === 'magnet_attract') {
          sfxService.play('magnet_pull')
        } else if (comp.type.startsWith('fan')) {
          sfxService.play('fan_whoosh')
        } else if (comp.type === 'bumper_circle') {
          sfxService.play('star_pop')
        } else {
          sfxService.play('component_place')
        }
      }
    }
    prevCollisionsRef.current = gameState.activeCollisions
  }, [gameState.activeCollisions, gameState.config.fixedComponents, gameState.placedComponents])

  // Handle Simulation Outcome
  useEffect(() => {
    if (gameState.simulationStatus === 'success') {
      sfxService.play('machine_success')
      setAriaAnnouncement('Hooray! The Sproutling safely reached the Star Cradle!')
      setShowScienceDossier(true)

      // Award authoritative rewards
      completeActivity({
        xpAmount: gameState.telemetry.xp,
        starsAmount: gameState.telemetry.stars,
      })

      if (onComplete) onComplete()
    } else if (gameState.simulationStatus === 'failed') {
      sfxService.play('machine_fail')
      setAriaAnnouncement('Wobbly landing! Tap Reset to adjust your machine components and try again.')
    }
  }, [gameState.simulationStatus, gameState.telemetry, gameState.placedComponents.length, completeActivity, onComplete])

  // Physics Animation Loop
  useEffect(() => {
    if (gameState.simulationStatus !== 'running') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    lastTimeRef.current = performance.now()

    const loop = (currentTime: number) => {
      const deltaSec = Math.min((currentTime - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = currentTime

      setGameState((prev) => {
        if (prev.simulationStatus !== 'running') return prev
        return stepSimulation(prev, deltaSec)
      })

      animationFrameRef.current = requestAnimationFrame(loop)
    }

    animationFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState.simulationStatus])

  // Canvas Drawing Pass
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 800
    const H = 500

    // Clear background
    ctx.clearRect(0, 0, W, H)

    // 1. Draw Blueprint Background Grid
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)'
    ctx.lineWidth = 1
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, H)
      ctx.stroke()
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(W, y)
      ctx.stroke()
    }

    // 2. Draw Start Platform & Sproutling Spawn Point
    const startX = currentConfig.startPos.x
    const startY = currentConfig.startPos.y
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'
    ctx.beginPath()
    ctx.arc(startX, startY, 24, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#93c5fd'
    ctx.font = 'bold 11px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('START', startX, startY - 28)

    // 3. Draw Goal Beacon (Star Cradle)
    const goal = currentConfig.goal
    ctx.save()
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 18
    ctx.fillStyle = 'rgba(251, 191, 36, 0.25)'
    ctx.beginPath()
    ctx.arc(goal.x, goal.y, goal.radius + 8, 0, Math.PI * 2)
    ctx.fill()

    // Rotating celestial ring
    const ringAngle = (Date.now() / 1000) % (Math.PI * 2)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 3
    ctx.setLineDash([8, 6])
    ctx.beginPath()
    ctx.arc(goal.x, goal.y, goal.radius, ringAngle, ringAngle + Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#fef08a'
    ctx.font = '22px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('⭐', goal.x, goal.y)
    ctx.restore()

    ctx.fillStyle = '#fef08a'
    ctx.font = 'bold 12px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(goal.label || 'GOAL', goal.x, goal.y + goal.radius + 18)

    // 4. Draw Components
    const allComponents = [...currentConfig.fixedComponents, ...gameState.placedComponents]

    for (const comp of allComponents) {
      const isSelected = gameState.selectedComponentId === comp.id
      ctx.save()

      if (isSelected) {
        ctx.shadowColor = '#38bdf8'
        ctx.shadowBlur = 12
        ctx.strokeStyle = '#38bdf8'
        ctx.lineWidth = 2
        ctx.strokeRect(comp.x - 4, comp.y - 4, comp.width + 8, comp.height + 8)
      }

      switch (comp.type) {
        case 'platform_wood': {
          ctx.fillStyle = comp.isFixed ? '#334155' : '#78350f'
          ctx.beginPath()
          ctx.roundRect(comp.x, comp.y, comp.width, comp.height, 6)
          ctx.fill()
          ctx.strokeStyle = comp.isFixed ? '#64748b' : '#b45309'
          ctx.lineWidth = 2
          ctx.stroke()
          // Rivets / grain
          ctx.fillStyle = '#d97706'
          ctx.beginPath()
          ctx.arc(comp.x + 8, comp.y + comp.height / 2, 2.5, 0, Math.PI * 2)
          ctx.arc(comp.x + comp.width - 8, comp.y + comp.height / 2, 2.5, 0, Math.PI * 2)
          ctx.fill()
          break
        }

        case 'ramp_right': {
          ctx.fillStyle = '#b45309'
          ctx.beginPath()
          ctx.moveTo(comp.x, comp.y)
          ctx.lineTo(comp.x + comp.width, comp.y + comp.height)
          ctx.lineTo(comp.x, comp.y + comp.height)
          ctx.closePath()
          ctx.fill()
          ctx.strokeStyle = '#f59e0b'
          ctx.lineWidth = 3
          ctx.stroke()
          break
        }

        case 'ramp_left': {
          ctx.fillStyle = '#b45309'
          ctx.beginPath()
          ctx.moveTo(comp.x + comp.width, comp.y)
          ctx.lineTo(comp.x, comp.y + comp.height)
          ctx.lineTo(comp.x + comp.width, comp.y + comp.height)
          ctx.closePath()
          ctx.fill()
          ctx.strokeStyle = '#f59e0b'
          ctx.lineWidth = 3
          ctx.stroke()
          break
        }

        case 'ramp_steep': {
          ctx.fillStyle = '#9a3412'
          ctx.beginPath()
          ctx.moveTo(comp.x, comp.y)
          ctx.lineTo(comp.x + comp.width, comp.y + comp.height)
          ctx.lineTo(comp.x, comp.y + comp.height)
          ctx.closePath()
          ctx.fill()
          ctx.strokeStyle = '#ea580c'
          ctx.lineWidth = 4
          ctx.stroke()
          break
        }

        case 'spring_up':
        case 'spring_angled': {
          // Base
          ctx.fillStyle = '#475569'
          ctx.fillRect(comp.x, comp.y + comp.height - 8, comp.width, 8)
          // Coiled spring
          ctx.strokeStyle = '#fbbf24'
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.moveTo(comp.x + 10, comp.y + comp.height - 8)
          ctx.lineTo(comp.x + comp.width / 2, comp.y + 8)
          ctx.lineTo(comp.x + comp.width - 10, comp.y + comp.height - 8)
          ctx.stroke()
          // Top pad
          ctx.fillStyle = '#ea580c'
          ctx.beginPath()
          ctx.roundRect(comp.x + 4, comp.y, comp.width - 8, 8, 4)
          ctx.fill()
          break
        }

        case 'magnet_attract': {
          const cx = comp.x + comp.width / 2
          const cy = comp.y + comp.height / 2
          // Pulse aura
          const pulse = (Math.sin(Date.now() / 250) + 1) * 0.5
          ctx.fillStyle = `rgba(236, 72, 153, ${0.1 + pulse * 0.15})`
          ctx.beginPath()
          ctx.arc(cx, cy, 50, 0, Math.PI * 2)
          ctx.fill()
          // Horseshoe
          ctx.font = '36px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('🧲', cx, cy)
          break
        }

        case 'fan_right': {
          // Housing
          ctx.fillStyle = '#0284c7'
          ctx.beginPath()
          ctx.roundRect(comp.x, comp.y, comp.width, comp.height, 6)
          ctx.fill()
          // Blades
          ctx.font = '28px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('💨', comp.x + comp.width / 2, comp.y + comp.height / 2)
          // Wind stream
          if (gameState.simulationStatus === 'running') {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.25)'
            ctx.fillRect(comp.x + comp.width, comp.y + 10, 180, comp.height - 20)
          }
          break
        }

        case 'fan_up': {
          ctx.fillStyle = '#0284c7'
          ctx.beginPath()
          ctx.roundRect(comp.x, comp.y, comp.width, comp.height, 6)
          ctx.fill()
          ctx.font = '28px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('💨', comp.x + comp.width / 2, comp.y + comp.height / 2)
          if (gameState.simulationStatus === 'running') {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.25)'
            ctx.fillRect(comp.x + 10, comp.y - 200, comp.width - 20, 200)
          }
          break
        }

        case 'bumper_circle': {
          const bcx = comp.x + comp.width / 2
          const bcy = comp.y + comp.height / 2
          const br = comp.width / 2
          ctx.fillStyle = '#db2777'
          ctx.beginPath()
          ctx.arc(bcx, bcy, br, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = '#f472b6'
          ctx.lineWidth = 3
          ctx.stroke()
          ctx.fillStyle = '#ffffff'
          ctx.font = '16px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('⭐', bcx, bcy)
          break
        }

        default:
          break
      }
      ctx.restore()
    }

    // 5. Draw Actor Trail
    const actor = gameState.actor
    for (let i = 0; i < actor.trail.length; i++) {
      const t = actor.trail[i]
      ctx.fillStyle = `rgba(74, 222, 128, ${t.opacity * 0.4})`
      ctx.beginPath()
      ctx.arc(t.x, t.y, actor.radius * (1 - i * 0.08), 0, Math.PI * 2)
      ctx.fill()
    }

    // 6. Draw Actor (The Sproutling Orbling)
    ctx.save()
    ctx.translate(actor.x, actor.y)

    // Bouncing squash-and-stretch
    ctx.scale(actor.squish.x, actor.squish.y)

    // Body shadow / glow
    ctx.shadowColor = '#22c55e'
    ctx.shadowBlur = 10
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(0, 0, actor.radius, 0, Math.PI * 2)
    ctx.fill()

    // Cute face
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(-5, -3, 3.5, 0, Math.PI * 2)
    ctx.arc(5, -3, 3.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.arc(-4.5, -3, 1.8, 0, Math.PI * 2)
    ctx.arc(5.5, -3, 1.8, 0, Math.PI * 2)
    ctx.fill()

    // Little leaf antenna
    ctx.fillStyle = '#86efac'
    ctx.beginPath()
    ctx.ellipse(0, -actor.radius - 4, 3, 6, Math.PI / 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }, [gameState, currentConfig])

  // Canvas Click / Tap to Place or Select Component
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const scaleX = 800 / rect.width
      const scaleY = 500 / rect.height
      const clickX = (e.clientX - rect.left) * scaleX
      const clickY = (e.clientY - rect.top) * scaleY

      // Check if clicking existing component to select
      const hit = [...gameState.placedComponents].reverse().find((c) => {
        return (
          clickX >= c.x &&
          clickX <= c.x + c.width &&
          clickY >= c.y &&
          clickY <= c.y + c.height
        )
      })

      if (hit) {
        sfxService.play('component_pickup')
        setGameState((prev) => evaluateAction(prev, { type: 'SELECT_COMPONENT', id: hit.id }))
        return
      }

      // If toolbox item is selected, place it
      if (selectedToolboxType) {
        sfxService.play('component_place')
        setGameState((prev) =>
          evaluateAction(prev, {
            type: 'ADD_COMPONENT',
            componentType: selectedToolboxType,
            x: clickX - 40,
            y: clickY - 20,
          })
        )
        setAriaAnnouncement(`Placed ${COMPONENT_METADATA[selectedToolboxType].name} at coordinates.`)
      } else {
        // Deselect
        setGameState((prev) => evaluateAction(prev, { type: 'SELECT_COMPONENT', id: null }))
      }
    },
    [selectedToolboxType, gameState.placedComponents]
  )

  // Drag-and-Drop / Move Component Logic
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (gameState.simulationStatus !== 'design') return
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const clickX = (e.clientX - rect.left) * (800 / rect.width)
      const clickY = (e.clientY - rect.top) * (500 / rect.height)

      const hit = [...gameState.placedComponents].reverse().find((c) => {
        return (
          clickX >= c.x &&
          clickX <= c.x + c.width &&
          clickY >= c.y &&
          clickY <= c.y + c.height
        )
      })

      if (hit) {
        setIsDragging(true)
        dragOffsetRef.current = { x: clickX - hit.x, y: clickY - hit.y }
        setGameState((prev) => evaluateAction(prev, { type: 'SELECT_COMPONENT', id: hit.id }))
        sfxService.play('component_pickup')
      }
    },
    [gameState.simulationStatus, gameState.placedComponents]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging || !gameState.selectedComponentId) return
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const curX = (e.clientX - rect.left) * (800 / rect.width)
      const curY = (e.clientY - rect.top) * (500 / rect.height)

      setGameState((prev) =>
        evaluateAction(prev, {
          type: 'MOVE_COMPONENT',
          id: prev.selectedComponentId!,
          x: curX - dragOffsetRef.current.x,
          y: curY - dragOffsetRef.current.y,
        })
      )
    },
    [isDragging, gameState.selectedComponentId]
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      sfxService.play('component_place')
    }
  }, [isDragging])

  // Controls Handlers
  const handleStart = useCallback(() => {
    sfxService.play('machine_start')
    setGameState((prev) => evaluateAction(prev, { type: 'START_SIMULATION' }))
    setAriaAnnouncement('Simulation started! Watching machine contraption in action.')
  }, [])

  const handlePause = useCallback(() => {
    setGameState((prev) => evaluateAction(prev, { type: 'PAUSE_SIMULATION' }))
    setAriaAnnouncement('Simulation paused.')
  }, [])

  const handleReset = useCallback(() => {
    sfxService.play('card_flip')
    setGameState((prev) => evaluateAction(prev, { type: 'RESET_SIMULATION' }))
    resetEconomy()
    setShowScienceDossier(false)
    setAriaAnnouncement('Machine reset to start platform. Ready for adjustments.')
  }, [resetEconomy])

  const handleDeleteSelected = useCallback(() => {
    if (!gameState.selectedComponentId) return
    sfxService.play('mistake_soft')
    setGameState((prev) => evaluateAction(prev, { type: 'REMOVE_COMPONENT', id: prev.selectedComponentId! }))
    setAriaAnnouncement('Component removed from workbench.')
  }, [gameState.selectedComponentId])

  // Keyboard Navigation Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        if (gameState.simulationStatus === 'running') handlePause()
        else handleStart()
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset()
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelected()
      } else if (gameState.selectedComponentId && (e.key.startsWith('Arrow') || e.code.startsWith('Arrow'))) {
        e.preventDefault()
        const selected = gameState.placedComponents.find((c) => c.id === gameState.selectedComponentId)
        if (selected) {
          let dx = 0
          let dy = 0
          if (e.key === 'ArrowUp') dy = -10
          if (e.key === 'ArrowDown') dy = 10
          if (e.key === 'ArrowLeft') dx = -10
          if (e.key === 'ArrowRight') dx = 10

          setGameState((prev) =>
            evaluateAction(prev, {
              type: 'MOVE_COMPONENT',
              id: selected.id,
              x: selected.x + dx,
              y: selected.y + dy,
            })
          )
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState.simulationStatus, gameState.selectedComponentId, gameState.placedComponents, handleStart, handlePause, handleReset, handleDeleteSelected])

  return (
    <div className="magic-machine-container">
      {/* Invisible Screen Reader Polite Announcer */}
      <div className="sr-only" aria-live="polite">
        {ariaAnnouncement}
      </div>

      <ActivityShell
        title="Magic Machine Lab"
        emoji="⚙️"
        primaryDomain="logic"
        secondaryDomains={['creativity']}
        difficulty={difficulty}
        onDifficultyChange={(d) => {
          setDifficulty(d)
          setPuzzleIndex(0)
        }}
        progressInfo={`Puzzle ${puzzleIndex + 1} / 4`}
        tagline={currentConfig.subtitle}
      >
        {/* Main Workshop Layout */}
        <div className="workshop-layout">
          {/* Level Header Bar */}
          <div className="workshop-header-bar">
            <div className="puzzle-title-badge">
              <h3>{currentConfig.title}</h3>
              <span className="par-badge">
                Par: {gameState.placedComponents.length}/{currentConfig.parComponents} Parts
              </span>
            </div>

            <div className="puzzle-selector-tabs" role="tablist" aria-label="Puzzle selection">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={puzzleIndex === idx}
                  className={`puzzle-tab-btn ${puzzleIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    sfxService.play('card_flip')
                    setPuzzleIndex(idx)
                  }}
                >
                  Puzzle {idx + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="button button-secondary hint-toggle-btn"
              onClick={() => {
                sfxService.play('card_flip')
                setShowHint((h) => !h)
              }}
              aria-label="Toggle puzzle hint"
            >
              💡 {showHint ? 'Hide Hint' : 'Hint'}
            </button>
          </div>

          {/* Hint Banner */}
          {showHint && (
            <div className="workshop-hint-banner" role="alert">
              <span className="hint-icon">💡</span>
              <p>{currentConfig.hint}</p>
            </div>
          )}

          {/* Interactive Physics Stage Canvas */}
          <div className="canvas-wrapper">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="physics-canvas"
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              tabIndex={0}
              aria-label="Magic Machine Workbench simulation area. Click to place components or drag to reposition."
            />

            {/* In-Canvas Floating Mascot Reaction Tip */}
            {gameState.simulationStatus === 'failed' && (
              <div className="mascot-feedback-bubble failed" role="alert">
                <span className="mascot-avatar">🌱</span>
                <div>
                  <strong>Wobbly Launch!</strong>
                  <p>Almost there! Tap 🔄 Reset, reposition your ramp or spring, and give it another spin!</p>
                </div>
              </div>
            )}
          </div>

          {/* Chunky Machine Control Deck */}
          <div className="workshop-control-deck">
            <div className="primary-actions">
              {gameState.simulationStatus === 'running' ? (
                <button
                  type="button"
                  className="button button-secondary machine-btn pause"
                  onClick={handlePause}
                  aria-label="Pause Machine Simulation (Spacebar)"
                >
                  ⏸️ PAUSE
                </button>
              ) : (
                <button
                  type="button"
                  className="button button-primary machine-btn play"
                  onClick={handleStart}
                  aria-label="Test Machine Simulation (Spacebar)"
                >
                  ▶️ TEST MACHINE!
                </button>
              )}

              <button
                type="button"
                className="button button-secondary machine-btn reset"
                onClick={handleReset}
                aria-label="Reset Machine to Starting Position (R key)"
              >
                🔄 RESET
              </button>

              {gameState.selectedComponentId && (
                <button
                  type="button"
                  className="button button-secondary machine-btn delete"
                  onClick={handleDeleteSelected}
                  aria-label="Delete Selected Component (Delete key)"
                >
                  🗑️ REMOVE PART
                </button>
              )}
            </div>

            <div className="keyboard-shortcuts-pill" aria-hidden="true">
              <span>⌨️ Space = Play/Pause</span>
              <span>R = Reset</span>
              <span>Arrows = Move Part</span>
            </div>
          </div>

          {/* Tactile Wooden Toolbox Drawer */}
          <div className="wooden-toolbox-tray" aria-label="Toolbox Components">
            <div className="toolbox-header">
              <span className="toolbox-icon">🧰</span>
              <h4>Magic Toolbox</h4>
              <span className="toolbox-subtitle">Select a part and click the workbench to place it</span>
            </div>

            <div className="toolbox-grid">
              {currentConfig.availableToolbox.map((tool) => {
                const meta = COMPONENT_METADATA[tool.type]
                const placedCount = gameState.placedComponents.filter((c) => c.type === tool.type).length
                const remaining = tool.maxCount - placedCount
                const isSelected = selectedToolboxType === tool.type
                const isExhausted = remaining <= 0

                return (
                  <button
                    key={tool.type}
                    type="button"
                    className={`toolbox-card ${isSelected ? 'selected' : ''} ${isExhausted ? 'exhausted' : ''}`}
                    disabled={isExhausted}
                    onClick={() => {
                      sfxService.play('component_pickup')
                      setSelectedToolboxType(isSelected ? null : tool.type)
                      setAriaAnnouncement(`Selected ${meta.name}. Click on workbench to place.`)
                    }}
                    aria-label={`${meta.name}, ${remaining} remaining. ${meta.description}`}
                  >
                    <span className="toolbox-card-icon">{meta.icon}</span>
                    <span className="toolbox-card-name">{meta.name}</span>
                    <span className="toolbox-card-count">
                      {placedCount}/{tool.maxCount}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Science of Wonder Dossier Card */}
          {showScienceDossier && (
            <div className="science-dossier-card" role="region" aria-label="Science of Wonder Discovery">
              <div className="dossier-header">
                <span className="dossier-emoji">🔬</span>
                <h4>Science of Wonder: {currentConfig.scientificConcept.title}</h4>
              </div>
              <p className="dossier-desc">{currentConfig.scientificConcept.description}</p>
              <div className="dossier-fun-fact">
                <strong>💡 Fun Science Fact:</strong> {currentConfig.scientificConcept.funFact}
              </div>
            </div>
          )}
        </div>

        {/* Universal Reward Celebration Modal */}
        {rewardStatus && (
          <RewardCelebration
            rewardStatus={rewardStatus}
            onPrimaryAction={() => {
              if (puzzleIndex < 3) {
                setPuzzleIndex((prev) => prev + 1)
              } else {
                handleReset()
              }
            }}
            primaryActionLabel={puzzleIndex < 3 ? 'Next Puzzle 🚀' : 'Play Again 🔄'}
            secondaryAction={
              onExit
                ? {
                    label: 'Exit to Playroom 🚪',
                    onClick: onExit,
                  }
                : undefined
            }
          />
        )}
      </ActivityShell>
    </div>
  )
}
