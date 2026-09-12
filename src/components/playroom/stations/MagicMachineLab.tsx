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
  predictTrajectory,
  COMPONENT_METADATA,
  MAGIC_MACHINE_PUZZLES,
} from '../../../services/games/magicMachineEngine'
import { ActivityShell } from '../../experience/ActivityShell'
import { VictoryCelebrationModal } from '../../experience/VictoryCelebrationModal'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { useAuth } from '../../../context/AuthContext'
import { childProfileService } from '../../../services/childProfileService'

interface MagicMachineLabProps {
  initialDifficulty?: DifficultyTier
  puzzleId?: string
  explorerLevel?: number
  onComplete?: () => void
  onExit?: () => void
}

export const MagicMachineLab: React.FC<MagicMachineLabProps> = ({
  initialDifficulty = 'easy',
  puzzleId,
  explorerLevel = 1,
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
  const [ariaAnnouncement, setAriaAnnouncement] = useState<string>('Welcome to Clockwork Physics Lab!')

  // Level configuration with procedural generator
  const currentConfig: MachineConfig = useMemo(() => {
    if (puzzleId) {
      const found = MAGIC_MACHINE_PUZZLES.find((p) => p.id === puzzleId)
      if (found) return found
    }
    return generateLevel(puzzleIndex, difficulty, explorerLevel)
  }, [puzzleId, puzzleIndex, difficulty, explorerLevel])

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
    completeActivity,
    resetActivity: resetEconomy,
  } = useActivityEconomy({
    childId: selectedChildId,
    activityType: activityIdentity.activityType,
    activityId: activityIdentity.activityId,
  })

  // Sound & Haptic triggering on collisions
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
          HapticsService.heavy()
          sfxService.play('spring_bounce')
        } else if (comp.type === 'magnet_attract') {
          HapticsService.medium()
          sfxService.play('magnet_pull')
        } else if (comp.type.startsWith('fan')) {
          HapticsService.light()
          sfxService.play('fan_whoosh')
        } else if (comp.type === 'bumper_circle') {
          HapticsService.heavy()
          sfxService.play('star_pop')
        } else {
          HapticsService.light()
          sfxService.play('component_place')
        }
      }
    }
    prevCollisionsRef.current = gameState.activeCollisions
  }, [gameState.activeCollisions, gameState.config.fixedComponents, gameState.placedComponents])

  // Handle Simulation Outcome
  useEffect(() => {
    if (gameState.simulationStatus === 'success') {
      HapticsService.success()
      sfxService.play('machine_success')
      setAriaAnnouncement('Hooray! The Sproutling safely reached the Star Cradle!')
      setShowScienceDossier(true)

      // Award authoritative rewards
      completeActivity({
        xpAmount: gameState.telemetry.xp || 35,
        starsAmount: gameState.telemetry.stars || 8,
      })

      if (onComplete) onComplete()
    } else if (gameState.simulationStatus === 'failed') {
      HapticsService.warning()
      sfxService.play('machine_fail')
      setAriaAnnouncement('Wobbly landing! Tap Reset to adjust your machine components and try again.')
    }
  }, [gameState.simulationStatus, gameState.telemetry, completeActivity, onComplete])

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

  // Trajectory Prediction Points
  const predictedTrajectoryPoints = useMemo(() => {
    if (gameState.simulationStatus === 'design' || gameState.simulationStatus === 'paused') {
      return predictTrajectory(gameState, 45, 0.035)
    }
    return []
  }, [gameState])

  // 3D Depth Blueprint Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 800
    const H = 500

    ctx.clearRect(0, 0, W, H)

    // 1. 3D Blueprint Workshop Background & Radial Glow
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 500)
    bgGrad.addColorStop(0, '#1e293b')
    bgGrad.addColorStop(0.6, '#0f172a')
    bgGrad.addColorStop(1, '#020617')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, W, H)

    // 3D Isometric / Blueprint Grid Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.09)'
    ctx.lineWidth = 1.2
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

    // 2. Metallic Rotating Clockwork Gears in Canvas Corners
    const timeSec = Date.now() / 1000
    const drawGear = (gx: number, gy: number, radius: number, teeth: number, angle: number, color: string) => {
      ctx.save()
      ctx.translate(gx, gy)
      ctx.rotate(angle)
      ctx.fillStyle = color
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2

      ctx.beginPath()
      for (let i = 0; i < teeth; i++) {
        const a1 = (i * Math.PI * 2) / teeth
        const a2 = a1 + Math.PI / teeth / 2
        const a3 = a1 + Math.PI / teeth
        const rOut = radius + 6
        const rIn = radius

        const x1 = Math.cos(a1) * rIn
        const y1 = Math.sin(a1) * rIn
        const x2 = Math.cos(a2) * rOut
        const y2 = Math.sin(a2) * rOut
        const x3 = Math.cos(a3) * rIn
        const y3 = Math.sin(a3) * rIn

        if (i === 0) ctx.moveTo(x1, y1)
        else ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.lineTo(x3, y3)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Center cutout & brass axle rivet
      ctx.fillStyle = '#0f172a'
      ctx.beginPath()
      ctx.arc(0, 0, radius * 0.45, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#d97706'
      ctx.stroke()

      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(0, 0, radius * 0.18, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    // Draw aesthetic gears
    ctx.globalAlpha = 0.25
    drawGear(50, 50, 36, 10, timeSec * 0.4, '#334155')
    drawGear(95, 45, 24, 8, -timeSec * 0.6, '#475569')
    drawGear(W - 60, H - 60, 44, 12, timeSec * 0.35, '#334155')
    drawGear(W - 110, H - 40, 28, 8, -timeSec * 0.55, '#475569')
    ctx.globalAlpha = 1.0

    // 3. Projected Real-Time Trajectory Dot-Arc
    if (predictedTrajectoryPoints.length > 1) {
      ctx.save()
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'
      ctx.lineWidth = 2.5
      ctx.setLineDash([6, 8])
      ctx.beginPath()
      for (let i = 0; i < predictedTrajectoryPoints.length; i++) {
        const pt = predictedTrajectoryPoints[i]
        if (i === 0) ctx.moveTo(pt.x, pt.y)
        else ctx.lineTo(pt.x, pt.y)
      }
      ctx.stroke()
      ctx.setLineDash([])

      // Trajectory glow particles
      for (let i = 4; i < predictedTrajectoryPoints.length; i += 6) {
        const pt = predictedTrajectoryPoints[i]
        ctx.fillStyle = '#38bdf8'
        ctx.shadowColor = '#38bdf8'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    // 4. Start Platform & Sproutling Spawn Point
    const startX = currentConfig.startPos.x
    const startY = currentConfig.startPos.y
    ctx.save()
    ctx.fillStyle = 'rgba(59, 130, 246, 0.22)'
    ctx.beginPath()
    ctx.arc(startX, startY, 26, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 2.5
    ctx.stroke()

    ctx.fillStyle = '#93c5fd'
    ctx.font = 'bold 11px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('START', startX, startY - 30)
    ctx.restore()

    // 5. Goal Beacon (Star Cradle)
    const goal = currentConfig.goal
    ctx.save()
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 24
    ctx.fillStyle = 'rgba(251, 191, 36, 0.28)'
    ctx.beginPath()
    ctx.arc(goal.x, goal.y, goal.radius + 10, 0, Math.PI * 2)
    ctx.fill()

    // Rotating celestial ring
    const ringAngle = timeSec % (Math.PI * 2)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 3.5
    ctx.setLineDash([10, 6])
    ctx.beginPath()
    ctx.arc(goal.x, goal.y, goal.radius + 2, ringAngle, ringAngle + Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#fef08a'
    ctx.font = '24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('⭐', goal.x, goal.y)
    ctx.restore()

    ctx.fillStyle = '#fef08a'
    ctx.font = 'bold 12px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(goal.label || 'GOAL', goal.x, goal.y + goal.radius + 20)

    // 6. Draw 3D-Depth Components
    const allComponents = [...currentConfig.fixedComponents, ...gameState.placedComponents]

    for (const comp of allComponents) {
      const isSelected = gameState.selectedComponentId === comp.id
      ctx.save()

      // Ambient Drop Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)'
      ctx.shadowBlur = 14
      ctx.shadowOffsetY = 6

      if (isSelected) {
        ctx.shadowColor = '#38bdf8'
        ctx.shadowBlur = 16
        ctx.strokeStyle = '#38bdf8'
        ctx.lineWidth = 2.5
        ctx.strokeRect(comp.x - 4, comp.y - 4, comp.width + 8, comp.height + 8)
      }

      switch (comp.type) {
        case 'platform_wood': {
          // 3D Wooden/Brass Platform
          const platGrad = ctx.createLinearGradient(comp.x, comp.y, comp.x, comp.y + comp.height)
          platGrad.addColorStop(0, comp.isFixed ? '#475569' : '#92400e')
          platGrad.addColorStop(1, comp.isFixed ? '#1e293b' : '#451a03')
          ctx.fillStyle = platGrad
          ctx.beginPath()
          ctx.roundRect(comp.x, comp.y, comp.width, comp.height, 6)
          ctx.fill()
          ctx.strokeStyle = comp.isFixed ? '#94a3b8' : '#d97706'
          ctx.lineWidth = 2.5
          ctx.stroke()

          // Metallic Rivets
          ctx.fillStyle = '#fbbf24'
          ctx.beginPath()
          ctx.arc(comp.x + 8, comp.y + comp.height / 2, 2.5, 0, Math.PI * 2)
          ctx.arc(comp.x + comp.width - 8, comp.y + comp.height / 2, 2.5, 0, Math.PI * 2)
          ctx.fill()
          break
        }

        case 'ramp_right': {
          const rampGrad = ctx.createLinearGradient(comp.x, comp.y, comp.x + comp.width, comp.y + comp.height)
          rampGrad.addColorStop(0, '#f59e0b')
          rampGrad.addColorStop(1, '#78350f')
          ctx.fillStyle = rampGrad
          ctx.beginPath()
          ctx.moveTo(comp.x, comp.y)
          ctx.lineTo(comp.x + comp.width, comp.y + comp.height)
          ctx.lineTo(comp.x, comp.y + comp.height)
          ctx.closePath()
          ctx.fill()
          ctx.strokeStyle = '#fbbf24'
          ctx.lineWidth = 3
          ctx.stroke()
          break
        }

        case 'ramp_left': {
          const rampGrad = ctx.createLinearGradient(comp.x, comp.y, comp.x + comp.width, comp.y + comp.height)
          rampGrad.addColorStop(0, '#f59e0b')
          rampGrad.addColorStop(1, '#78350f')
          ctx.fillStyle = rampGrad
          ctx.beginPath()
          ctx.moveTo(comp.x + comp.width, comp.y)
          ctx.lineTo(comp.x, comp.y + comp.height)
          ctx.lineTo(comp.x + comp.width, comp.y + comp.height)
          ctx.closePath()
          ctx.fill()
          ctx.strokeStyle = '#fbbf24'
          ctx.lineWidth = 3
          ctx.stroke()
          break
        }

        case 'ramp_steep': {
          const rampGrad = ctx.createLinearGradient(comp.x, comp.y, comp.x + comp.width, comp.y + comp.height)
          rampGrad.addColorStop(0, '#ea580c')
          rampGrad.addColorStop(1, '#7c2d12')
          ctx.fillStyle = rampGrad
          ctx.beginPath()
          ctx.moveTo(comp.x, comp.y)
          ctx.lineTo(comp.x + comp.width, comp.y + comp.height)
          ctx.lineTo(comp.x, comp.y + comp.height)
          ctx.closePath()
          ctx.fill()
          ctx.strokeStyle = '#f97316'
          ctx.lineWidth = 4
          ctx.stroke()
          break
        }

        case 'spring_up':
        case 'spring_angled': {
          // 3D Bouncy Spring with displacement
          const isTriggered = gameState.activeCollisions.includes(comp.id)
          const squishY = isTriggered ? 8 : 0

          // Base plate
          ctx.fillStyle = '#334155'
          ctx.fillRect(comp.x, comp.y + comp.height - 8, comp.width, 8)

          // Metallic Coils
          ctx.strokeStyle = '#fbbf24'
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.moveTo(comp.x + 10, comp.y + comp.height - 8)
          ctx.lineTo(comp.x + comp.width / 2, comp.y + 10 + squishY)
          ctx.lineTo(comp.x + comp.width - 10, comp.y + comp.height - 8)
          ctx.stroke()

          // Launch Pad
          ctx.fillStyle = isTriggered ? '#fbbf24' : '#ea580c'
          ctx.beginPath()
          ctx.roundRect(comp.x + 4, comp.y + squishY, comp.width - 8, 8, 4)
          ctx.fill()
          break
        }

        case 'magnet_attract': {
          const cx = comp.x + comp.width / 2
          const cy = comp.y + comp.height / 2

          // Radiating Magnetic Force Field Rings
          const pulse = (Math.sin(timeSec * 4) + 1) * 0.5
          ctx.strokeStyle = `rgba(236, 72, 153, ${0.3 + pulse * 0.4})`
          ctx.lineWidth = 2
          ctx.setLineDash([4, 4])
          ctx.beginPath()
          ctx.arc(cx, cy, 45 + pulse * 10, 0, Math.PI * 2)
          ctx.stroke()
          ctx.setLineDash([])

          // Horseshoe Vector Core
          ctx.strokeStyle = '#ef4444'
          ctx.lineWidth = 10
          ctx.beginPath()
          ctx.arc(cx, cy - 2, 14, Math.PI, 0, false)
          ctx.stroke()

          // Silver Magnetic Tips
          ctx.fillStyle = '#e2e8f0'
          ctx.fillRect(cx - 19, cy - 2, 10, 10)
          ctx.fillRect(cx + 9, cy - 2, 10, 10)
          break
        }

        case 'fan_right': {
          // 3D Aerodynamic Fan Housing
          ctx.fillStyle = '#0284c7'
          ctx.beginPath()
          ctx.roundRect(comp.x, comp.y, comp.width, comp.height, 6)
          ctx.fill()

          // Vector Turbine Blades
          const fcx = comp.x + comp.width / 2
          const fcy = comp.y + comp.height / 2
          const fanAngle = timeSec * 8
          ctx.save()
          ctx.translate(fcx, fcy)
          ctx.rotate(fanAngle)
          ctx.fillStyle = '#38bdf8'
          for (let b = 0; b < 3; b++) {
            ctx.rotate((Math.PI * 2) / 3)
            ctx.fillRect(-3, -12, 6, 12)
          }
          ctx.restore()

          // Animated Wind Stream Particles
          if (gameState.simulationStatus === 'running') {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.35)'
            for (let i = 0; i < 6; i++) {
              const wx = comp.x + comp.width + ((timeSec * 160 + i * 35) % 180)
              const wy = comp.y + 12 + (i % 3) * 14
              ctx.fillRect(wx, wy, 16, 2.5)
            }
          }
          break
        }

        case 'fan_up': {
          ctx.fillStyle = '#0284c7'
          ctx.beginPath()
          ctx.roundRect(comp.x, comp.y, comp.width, comp.height, 6)
          ctx.fill()

          const fcx = comp.x + comp.width / 2
          const fcy = comp.y + comp.height / 2
          const fanAngle = timeSec * 8
          ctx.save()
          ctx.translate(fcx, fcy)
          ctx.rotate(fanAngle)
          ctx.fillStyle = '#38bdf8'
          for (let b = 0; b < 3; b++) {
            ctx.rotate((Math.PI * 2) / 3)
            ctx.fillRect(-3, -12, 6, 12)
          }
          ctx.restore()

          if (gameState.simulationStatus === 'running') {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.35)'
            for (let i = 0; i < 6; i++) {
              const wy = comp.y - ((timeSec * 160 + i * 35) % 180)
              const wx = comp.x + 12 + (i % 3) * 16
              ctx.fillRect(wx, wy, 2.5, 16)
            }
          }
          break
        }

        case 'bumper_circle': {
          const bcx = comp.x + comp.width / 2
          const bcy = comp.y + comp.height / 2
          const br = comp.width / 2

          const isHit = gameState.activeCollisions.includes(comp.id)

          ctx.fillStyle = isHit ? '#f472b6' : '#db2777'
          ctx.beginPath()
          ctx.arc(bcx, bcy, br, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = '#f472b6'
          ctx.lineWidth = 3.5
          ctx.stroke()

          // Bespoke 5-Point Star Vector Center
          ctx.fillStyle = '#fde047'
          ctx.beginPath()
          const spikes = 5
          const outerR = 9
          const innerR = 4.5
          for (let s = 0; s < spikes * 2; s++) {
            const r = s % 2 === 0 ? outerR : innerR
            const angle = (s * Math.PI) / spikes - Math.PI / 2
            const sx = bcx + Math.cos(angle) * r
            const sy = bcy + Math.sin(angle) * r
            if (s === 0) ctx.moveTo(sx, sy)
            else ctx.lineTo(sx, sy)
          }
          ctx.closePath()
          ctx.fill()
          break
        }

        default:
          break
      }
      ctx.restore()
    }

    // 7. Draw Velocity-Based Actor Trail
    const actor = gameState.actor
    for (let i = 0; i < actor.trail.length; i++) {
      const t = actor.trail[i]
      ctx.fillStyle = `rgba(74, 222, 128, ${t.opacity * 0.45})`
      ctx.beginPath()
      ctx.arc(t.x, t.y, actor.radius * (1 - i * 0.08), 0, Math.PI * 2)
      ctx.fill()
    }

    // 8. Draw Actor Sproutling with 3D Depth Squash-and-Stretch
    ctx.save()
    ctx.translate(actor.x, actor.y)
    ctx.scale(actor.squish.x, actor.squish.y)

    // Body Shadow & Radiant Starlight Core
    ctx.shadowColor = '#22c55e'
    ctx.shadowBlur = 14
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(0, 0, actor.radius, 0, Math.PI * 2)
    ctx.fill()

    // Expressive Eyes
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

    // Cute Leaf Antenna
    ctx.fillStyle = '#86efac'
    ctx.beginPath()
    ctx.ellipse(0, -actor.radius - 4, 3, 6, Math.PI / 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }, [gameState, currentConfig, predictedTrajectoryPoints])

  // Drag and Snap Controls with PointerCapture
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (gameState.simulationStatus !== 'design') return
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.setPointerCapture(e.pointerId)

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
        HapticsService.light()
        sfxService.play('component_pickup')
        return
      }

      // If toolbox part is selected, snap-place it
      if (selectedToolboxType) {
        const meta = COMPONENT_METADATA[selectedToolboxType]
        const snapX = Math.round((clickX - meta.defaultWidth / 2) / 10) * 10
        const snapY = Math.round((clickY - meta.defaultHeight / 2) / 10) * 10

        HapticsService.medium()
        sfxService.play('component_place')
        setGameState((prev) =>
          evaluateAction(prev, {
            type: 'ADD_COMPONENT',
            componentType: selectedToolboxType,
            x: snapX,
            y: snapY,
          })
        )
        setAriaAnnouncement(`Placed ${meta.name} on workbench.`)
      } else {
        setGameState((prev) => evaluateAction(prev, { type: 'SELECT_COMPONENT', id: null }))
      }
    },
    [gameState.simulationStatus, gameState.placedComponents, selectedToolboxType]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDragging || !gameState.selectedComponentId) return
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const curX = (e.clientX - rect.left) * (800 / rect.width)
      const curY = (e.clientY - rect.top) * (500 / rect.height)

      const rawX = curX - dragOffsetRef.current.x
      const rawY = curY - dragOffsetRef.current.y
      const snapX = Math.round(rawX / 10) * 10
      const snapY = Math.round(rawY / 10) * 10

      setGameState((prev) =>
        evaluateAction(prev, {
          type: 'MOVE_COMPONENT',
          id: prev.selectedComponentId!,
          x: snapX,
          y: snapY,
        })
      )
    },
    [isDragging, gameState.selectedComponentId]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isDragging) {
        setIsDragging(false)
        HapticsService.light()
        sfxService.play('component_place')
      }
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // Safe pointer release
      }
    },
    [isDragging]
  )

  // Simulation Controls
  const handleStart = useCallback(() => {
    HapticsService.selection()
    sfxService.play('machine_start')
    setGameState((prev) => evaluateAction(prev, { type: 'START_SIMULATION' }))
    setAriaAnnouncement('Simulation started! Watching contraption physics.')
  }, [])

  const handlePause = useCallback(() => {
    HapticsService.light()
    setGameState((prev) => evaluateAction(prev, { type: 'PAUSE_SIMULATION' }))
    setAriaAnnouncement('Simulation paused.')
  }, [])

  const handleReset = useCallback(() => {
    HapticsService.light()
    sfxService.play('card_flip')
    setGameState((prev) => evaluateAction(prev, { type: 'RESET_SIMULATION' }))
    resetEconomy()
    setShowScienceDossier(false)
    setAriaAnnouncement('Machine reset to start platform.')
  }, [resetEconomy])

  const handleDeleteSelected = useCallback(() => {
    if (!gameState.selectedComponentId) return
    HapticsService.medium()
    sfxService.play('mistake_soft')
    setGameState((prev) => evaluateAction(prev, { type: 'REMOVE_COMPONENT', id: prev.selectedComponentId! }))
    setAriaAnnouncement('Component removed from workbench.')
  }, [gameState.selectedComponentId])

  return (
    <div
      className="magic-machine-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      <div className="sr-only" aria-live="polite">
        {ariaAnnouncement}
      </div>

      <ActivityShell
        title="Magic Machine Lab"
        emoji="⚙️"
        primaryDomain="logic"
        secondaryDomains={['creativity']}
        difficulty={difficulty}
        variant="hero"
        onDifficultyChange={(d) => {
          setDifficulty(d)
          setPuzzleIndex(0)
        }}
        progressInfo={`Sector #${puzzleIndex + 1}`}
        tagline={currentConfig.subtitle}
      >
        <div className="workshop-layout" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Header Bar */}
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
                    HapticsService.light()
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
                HapticsService.light()
                sfxService.play('card_flip')
                setShowHint((h) => !h)
              }}
              aria-label="Toggle puzzle hint"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <path d="M9 18h6 M10 22h4 M12 2v1 M12 14a5 5 0 0 0 4-4 4 4 0 0 0-8 0 5 5 0 0 0 4 4z" />
              </svg>
              <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
            </button>
          </div>

          {showHint && (
            <div className="workshop-hint-banner" role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <path d="M9 18h6 M10 22h4 M12 2v1 M12 14a5 5 0 0 0 4-4 4 4 0 0 0-8 0 5 5 0 0 0 4 4z" />
              </svg>
              <p style={{ margin: 0 }}>{currentConfig.hint}</p>
            </div>
          )}

          {/* Interactive Physics Canvas */}
          <div className="canvas-wrapper" style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="physics-canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              tabIndex={0}
              aria-label="Magic Machine Workbench simulation area. Click to place components or drag to reposition."
              style={{
                touchAction: 'none',
                maxWidth: '100%',
                maxHeight: '360px',
                borderRadius: '16px',
                border: '2px solid rgba(56, 189, 248, 0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }}
            />

            {/* First-Turn Animated Hand Hint */}
            {gameState.placedComponents.length === 0 && gameState.simulationStatus === 'design' && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(15, 23, 42, 0.92)',
                  border: '1.5px solid #fbbf24',
                  borderRadius: '9999px',
                  padding: '6px 16px',
                  color: '#fef08a',
                  fontSize: '13px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                  zIndex: 10,
                  pointerEvents: 'none',
                  animation: 'bounceGentle 2s infinite',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
                <span>Select a part from the Magic Toolbox below and click to place it!</span>
              </div>
            )}
          </div>

          {/* Machine Control Deck */}
          <div className="workshop-control-deck" style={{ padding: '8px 12px' }}>
            <div className="primary-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {gameState.simulationStatus === 'running' ? (
                <button
                  type="button"
                  className="button button-secondary machine-btn pause"
                  onClick={handlePause}
                  aria-label="Pause Machine Simulation (Spacebar)"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span>PAUSE</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="button button-primary machine-btn play"
                  onClick={handleStart}
                  aria-label="Test Machine Simulation (Spacebar)"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>TEST CONTRAPTION!</span>
                </button>
              )}

              <button
                type="button"
                className="button button-secondary machine-btn reset"
                onClick={handleReset}
                aria-label="Reset Machine to Starting Position (R key)"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                <span>RESET</span>
              </button>

              {gameState.selectedComponentId && (
                <button
                  type="button"
                  className="button button-secondary machine-btn delete"
                  onClick={handleDeleteSelected}
                  aria-label="Delete Selected Component"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span>REMOVE PART</span>
                </button>
              )}
            </div>

            <div className="keyboard-shortcuts-pill" aria-hidden="true" style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', gap: '8px' }}>
              <span>Space = Play/Pause</span>
              <span>R = Reset</span>
            </div>
          </div>

          {/* Toolbox Drawer */}
          <div className="wooden-toolbox-tray" aria-label="Toolbox Components">
            <div className="toolbox-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <h4>Magic Toolbox</h4>
              <span className="toolbox-subtitle">Select a part and tap canvas to place</span>
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
                      HapticsService.light()
                      sfxService.play('component_pickup')
                      setSelectedToolboxType(isSelected ? null : tool.type)
                      setAriaAnnouncement(`Selected ${meta.name}. Click on workbench to place.`)
                    }}
                    aria-label={`${meta.name}, ${remaining} remaining. ${meta.description}`}
                  >
                    <span className="toolbox-card-name">{meta.name}</span>
                    <span className="toolbox-card-count">
                      {placedCount}/{tool.maxCount}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {showScienceDossier && (
            <div className="science-dossier-card" role="region" aria-label="Science of Wonder Discovery">
              <div className="dossier-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                  <path d="M6 18h12 M12 2v4 M8 22h8 M9 6h6a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z" />
                </svg>
                <h4>Science of Wonder: {currentConfig.scientificConcept.title}</h4>
              </div>
              <p className="dossier-desc">{currentConfig.scientificConcept.description}</p>
              <div className="dossier-fun-fact" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong>Fun Science Fact:</strong> {currentConfig.scientificConcept.funFact}
              </div>
            </div>
          )}
        </div>

        {/* Victory Celebration Modal */}
        <VictoryCelebrationModal
          isOpen={gameState.simulationStatus === 'success'}
          title="Contraption Calibrated! Level Solved!"
          subtitle={`The Sproutling reached the Star Cradle using ${gameState.placedComponents.length} kinetic components!`}
          badgeEmoji=""
          xpEarned={gameState.telemetry.xp || 35}
          starsEarned={gameState.telemetry.stars || 8}
          nextLevelLabel="Next Sector Level ➔"
          onNextLevel={() => {
            HapticsService.medium()
            setPuzzleIndex((prev) => prev + 1)
            handleReset()
          }}
          onExit={onExit}
        />
      </ActivityShell>
    </div>
  )
}
