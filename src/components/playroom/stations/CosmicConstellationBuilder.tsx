import React, { useState, useEffect, useRef, useMemo } from 'react'
import type { DifficultyTier } from '../../../types/experience'
import type {
  ConstellationChallenge,
  StarNode,
} from '../../../types/games/cosmicConstellation'
import {
  generateProceduralConstellationChallenge,
  validateConstellationConnections,
  SPECTRAL_COLORS,
  normalizeEdge,
} from '../../../services/games/cosmicConstellationEngine'
import { sfxService } from '../../../services/audio/sfxService'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { ActivityShell } from '../../experience/ActivityShell'
import { VictoryCelebrationModal } from '../../experience/VictoryCelebrationModal'

interface CosmicConstellationBuilderProps {
  initialDifficulty?: DifficultyTier
  childId?: string
  onComplete?: (stars: number, xp: number) => void
  onBack?: () => void
}

export const CosmicConstellationBuilder: React.FC<CosmicConstellationBuilderProps> = ({
  initialDifficulty = 'easy',
  childId = 'guest',
  onComplete,
  onBack,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty)
  const [challenge, setChallenge] = useState<ConstellationChallenge>(() =>
    generateProceduralConstellationChallenge(`constellation_${Date.now()}`, initialDifficulty)
  )

  const [activeConnections, setActiveConnections] = useState<[string, string][]>([])
  const [selectedStarId, setSelectedStarId] = useState<string | null>(null)
  const [hoveredStar, setHoveredStar] = useState<StarNode | null>(null)
  const [cameraAngle, setCameraAngle] = useState<{ rotX: number; rotY: number }>({ rotX: 0, rotY: 0 })
  const [isDraggingCamera, setIsDraggingCamera] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [showGhostLines, setShowGhostLines] = useState<boolean>(false)
  const [showScienceDossier, setShowScienceDossier] = useState<boolean>(false)
  const [showCelebration, setShowCelebration] = useState<boolean>(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Combine target constellation stars and distractor stars
  const allStars: StarNode[] = useMemo(() => {
    return [...challenge.targetConstellation.stars, ...challenge.distractorStars]
  }, [challenge])

  const starMap = useMemo(() => {
    const map = new Map<string, StarNode>()
    for (const s of allStars) map.set(s.id, s)
    return map
  }, [allStars])

  // Connection evaluation
  const evaluation = useMemo(() => {
    return validateConstellationConnections(challenge.targetConstellation, activeConnections)
  }, [challenge.targetConstellation, activeConnections])

  // Universal Activity Economy integration
  const { completeActivity } = useActivityEconomy({
    activityType: 'cosmic_constellation',
    activityId: `constellation_${challenge.id}`,
    childId,
  })

  // Handle Difficulty Change
  const handleDifficultyChange = (newDiff: DifficultyTier) => {
    setDifficulty(newDiff)
    const newChallenge = generateProceduralConstellationChallenge(`constellation_${Date.now()}`, newDiff)
    setChallenge(newChallenge)
    setActiveConnections([])
    setSelectedStarId(null)
    setHoveredStar(null)
    setCameraAngle({ rotX: 0, rotY: 0 })
    setShowCelebration(false)
    setShowScienceDossier(false)
  }

  // Handle Constellation Completion
  useEffect(() => {
    if (evaluation.isComplete && !showCelebration) {
      sfxService.play('victory_fanfare')
      setShowCelebration(true)
      setShowScienceDossier(true)
      completeActivity({ starsAmount: challenge.rewardStars, xpAmount: challenge.rewardXP })
      if (onComplete) onComplete(challenge.rewardStars, challenge.rewardXP)
    }
  }, [evaluation.isComplete, showCelebration, challenge, completeActivity, onComplete])

  // Star Click (Select or Connect)
  const handleStarClick = (star: StarNode) => {
    sfxService.resumeContext().catch(() => {})

    if (!selectedStarId) {
      // First star selected
      setSelectedStarId(star.id)
      sfxService.play('card_flip')
    } else if (selectedStarId === star.id) {
      // Deselect if tapping same star
      setSelectedStarId(null)
      sfxService.play('card_flip')
    } else {
      // Connect selectedStarId to this star
      const edgeKey = normalizeEdge(selectedStarId, star.id)
      const exists = activeConnections.some(([a, b]) => normalizeEdge(a, b) === edgeKey)

      if (exists) {
        // Toggle/remove existing connection
        setActiveConnections((prev) => prev.filter(([a, b]) => normalizeEdge(a, b) !== edgeKey))
        sfxService.play('mistake_soft')
      } else {
        // Add new starlight connection
        setActiveConnections((prev) => [...prev, [selectedStarId, star.id]])
        sfxService.play('match_success')
      }
      setSelectedStarId(null)
    }
  }

  const handleResetLines = () => {
    sfxService.resumeContext().catch(() => {})
    sfxService.play('card_flip')
    setActiveConnections([])
    setSelectedStarId(null)
  }

  // 60 FPS 3D Celestial Sphere Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let tickCount = 0

    // Generate static deep space micro starfield
    const bgStars: { x: number; y: number; size: number; alpha: number; speed: number }[] = []
    for (let i = 0; i < 120; i++) {
      bgStars.push({
        x: Math.random() * 640,
        y: Math.random() * 460,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.05 + 0.02,
      })
    }

    const renderLoop = () => {
      tickCount++
      const width = canvas.width
      const height = canvas.height

      // Deep Cosmic Space Background
      ctx.fillStyle = '#050814'
      ctx.fillRect(0, 0, width, height)

      // Ambient Nebula Clouds
      const nebula1 = ctx.createRadialGradient(width * 0.3, height * 0.3, 10, width * 0.3, height * 0.3, width * 0.6)
      nebula1.addColorStop(0, 'rgba(99, 102, 241, 0.15)')
      nebula1.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)')
      nebula1.addColorStop(1, 'rgba(5, 8, 20, 0)')
      ctx.fillStyle = nebula1
      ctx.fillRect(0, 0, width, height)

      const nebula2 = ctx.createRadialGradient(width * 0.7, height * 0.7, 10, width * 0.7, height * 0.7, width * 0.5)
      nebula2.addColorStop(0, 'rgba(14, 165, 233, 0.12)')
      nebula2.addColorStop(1, 'rgba(5, 8, 20, 0)')
      ctx.fillStyle = nebula2
      ctx.fillRect(0, 0, width, height)

      // Twinkling Background Micro Stars
      for (const bs of bgStars) {
        const twinkle = Math.sin(tickCount * bs.speed + bs.x) * 0.3 + 0.7
        ctx.fillStyle = `rgba(255, 255, 255, ${bs.alpha * twinkle})`
        ctx.fillRect(bs.x, bs.y, bs.size, bs.size)
      }

      const centerX = width / 2
      const centerY = height / 2
      const scale = 2.2

      // 3D Perspective Projection Function
      const project3D = (x: number, y: number, z: number) => {
        const cosY = Math.cos(cameraAngle.rotY)
        const sinY = Math.sin(cameraAngle.rotY)
        const cosX = Math.cos(cameraAngle.rotX)
        const sinX = Math.sin(cameraAngle.rotX)

        // Rotate Y (horizontal orbit)
        const x1 = x * cosY - z * sinY
        const z1 = z * cosY + x * sinY

        // Rotate X (vertical pitch)
        const y2 = y * cosX - z1 * sinX
        const z2 = z1 * cosX + y * sinX

        const fov = 320
        const distance = fov / (fov + z2)
        const projX = centerX + x1 * scale * distance
        const projY = centerY + y2 * scale * distance

        return { px: projX, py: projY, depth: z2 }
      }

      // Draw Ghost Lines (Hints or Target Overlay)
      if (showGhostLines || evaluation.isComplete) {
        ctx.save()
        ctx.setLineDash([4, 4])
        ctx.strokeStyle = evaluation.isComplete ? 'rgba(251, 191, 36, 0.5)' : 'rgba(148, 163, 184, 0.25)'
        ctx.lineWidth = 1.5

        for (const [idA, idB] of challenge.targetConstellation.requiredEdges) {
          const starA = starMap.get(idA)
          const starB = starMap.get(idB)
          if (starA && starB) {
            const pA = project3D(starA.x, starA.y, starA.z)
            const pB = project3D(starB.x, starB.y, starB.z)
            ctx.beginPath()
            ctx.moveTo(pA.px, pA.py)
            ctx.lineTo(pB.px, pB.py)
            ctx.stroke()
          }
        }
        ctx.restore()
      }

      // Draw Active Starlight Beams
      for (const [idA, idB] of activeConnections) {
        const starA = starMap.get(idA)
        const starB = starMap.get(idB)
        if (starA && starB) {
          const pA = project3D(starA.x, starA.y, starA.z)
          const pB = project3D(starB.x, starB.y, starB.z)

          const isTargetEdge = challenge.targetConstellation.requiredEdges.some(
            ([ta, tb]) => normalizeEdge(ta, tb) === normalizeEdge(idA, idB)
          )

          ctx.save()
          ctx.shadowColor = isTargetEdge ? '#38bdf8' : '#f43f5e'
          ctx.shadowBlur = 12
          ctx.strokeStyle = isTargetEdge ? '#7dd3fc' : '#fda4af'
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.moveTo(pA.px, pA.py)
          ctx.lineTo(pB.px, pB.py)
          ctx.stroke()
          ctx.restore()
        }
      }

      // Draw Line from Selected Star to Cursor (Dynamic Rubberband Beam)
      if (selectedStarId && hoveredStar && selectedStarId !== hoveredStar.id) {
        const selStar = starMap.get(selectedStarId)
        if (selStar) {
          const pA = project3D(selStar.x, selStar.y, selStar.z)
          const pB = project3D(hoveredStar.x, hoveredStar.y, hoveredStar.z)

          ctx.save()
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)'
          ctx.lineWidth = 2
          ctx.setLineDash([6, 6])
          ctx.beginPath()
          ctx.moveTo(pA.px, pA.py)
          ctx.lineTo(pB.px, pB.py)
          ctx.stroke()
          ctx.restore()
        }
      }

      // Render Star Nodes
      for (const star of allStars) {
        const { px, py } = project3D(star.x, star.y, star.z)
        const isSelected = selectedStarId === star.id
        const isHovered = hoveredStar?.id === star.id
        const spectral = SPECTRAL_COLORS[star.spectralClass]

        ctx.save()

        // Outer Aura Glow
        const pulse = Math.sin(tickCount * 0.08 + star.size) * 3
        ctx.shadowColor = spectral.color
        ctx.shadowBlur = isSelected ? 22 : isHovered ? 16 : 10
        ctx.fillStyle = isSelected ? '#fbbf24' : spectral.color

        // Star Core Disc
        ctx.beginPath()
        ctx.arc(px, py, star.size + (isSelected ? 3 : isHovered ? 1.5 : 0) + pulse * 0.15, 0, Math.PI * 2)
        ctx.fill()

        // Inner White Flare
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(px, py, star.size * 0.45, 0, Math.PI * 2)
        ctx.fill()

        // Pulsar Wave Rings
        if (star.spectralClass === 'PULSAR') {
          const ringRad = (tickCount * 0.8 + star.size * 2) % 24
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(px, py, ringRad, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Selection Target Reticle
        if (isSelected) {
          ctx.strokeStyle = '#facc15'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(px, py, star.size + 8, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Star Name Tag
        if (isHovered || isSelected || evaluation.isComplete) {
          ctx.font = 'bold 11px system-ui'
          ctx.fillStyle = '#f8fafc'
          ctx.textAlign = 'center'
          ctx.shadowColor = '#000000'
          ctx.shadowBlur = 4
          ctx.fillText(star.name, px, py + star.size + 14)
        }

        ctx.restore()
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop)
    }

    renderLoop()

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [allStars, starMap, activeConnections, selectedStarId, hoveredStar, cameraAngle, showGhostLines, evaluation.isComplete, challenge])

  // Mouse Interaction: 3D Camera Orbit Drag & Star Hover/Click Detection
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDraggingCamera(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height

    if (isDraggingCamera) {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      setCameraAngle((prev) => ({
        rotY: prev.rotY + deltaX * 0.008,
        rotX: Math.max(-0.6, Math.min(0.6, prev.rotX + deltaY * 0.008)),
      }))
      setDragStart({ x: e.clientX, y: e.clientY })
      return
    }

    // Hit-test stars for hover
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const scale = 2.2

    let nearestStar: StarNode | null = null
    let minDistance = 20

    for (const star of allStars) {
      const cosY = Math.cos(cameraAngle.rotY)
      const sinY = Math.sin(cameraAngle.rotY)
      const cosX = Math.cos(cameraAngle.rotX)
      const sinX = Math.sin(cameraAngle.rotX)

      const x1 = star.x * cosY - star.z * sinY
      const z1 = star.z * cosY + star.x * sinY
      const y2 = star.y * cosX - z1 * sinX
      const z2 = z1 * cosX + star.y * sinX

      const fov = 320
      const distance = fov / (fov + z2)
      const px = centerX + x1 * scale * distance
      const py = centerY + y2 * scale * distance

      const dist = Math.hypot(clickX - px, clickY - py)
      if (dist < minDistance) {
        minDistance = dist
        nearestStar = star
      }
    }

    setHoveredStar(nearestStar)
  }

  const handleMouseUp = () => {
    setIsDraggingCamera(false)
  }

  const handleCanvasClick = () => {
    if (hoveredStar) {
      handleStarClick(hoveredStar)
    }
  }

  return (
    <ActivityShell
      title="Cosmic Constellation Builder"
      emoji="✨"
      tagline="Geometry, Stellar Coordinates & Celestial Navigation"
      primaryDomain="logic"
      difficulty={difficulty}
      variant="hero"
      onDifficultyChange={(newDiff) => handleDifficultyChange(newDiff as DifficultyTier)}
    >
      <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto p-4 select-none">
        {/* Left Column: 3D Celestial Viewport */}
        <div className="flex-1 flex flex-col items-center bg-slate-900/80 backdrop-blur-md rounded-2xl border border-indigo-500/30 p-4 shadow-2xl relative overflow-hidden">
          {/* Header Stats Bar */}
          <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700/60 mb-3 text-sm font-medium">
            <div className="flex items-center gap-3">
              <span className="text-indigo-400 font-bold tracking-wide">
                ✨ Target: {challenge.targetConstellation.name}
              </span>
              <span className="text-amber-400 font-bold">
                ⭐ Beams: {evaluation.correctCount} / {evaluation.totalRequired}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Accuracy:</span>
              <span
                className={`font-bold font-mono ${
                  evaluation.accuracyPercentage >= 100 ? 'text-emerald-400' : 'text-sky-300'
                }`}
              >
                {evaluation.accuracyPercentage}%
              </span>
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="relative w-full aspect-[4/3] max-h-[460px] flex items-center justify-center bg-slate-950 rounded-xl overflow-hidden border border-slate-800 cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={640}
              height={460}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onClick={handleCanvasClick}
              className="w-full h-full object-contain"
            />

            {/* Orbit Drag Tip Overlay */}
            <div className="absolute top-3 left-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>🖱️ Drag to rotate 3D camera</span>
            </div>

            {/* Status Overlay Pill */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔭</span>
                <span className="font-semibold text-indigo-300">
                  {selectedStarId
                    ? `Click second star to connect beam from ${starMap.get(selectedStarId)?.name}`
                    : hoveredStar
                    ? `Hovering: ${hoveredStar.name} (${hoveredStar.spectralClass})`
                    : 'Click stars to connect starlight beams!'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span>Latin:</span>
                <span className="font-bold text-amber-300">{challenge.targetConstellation.latinName}</span>
              </div>
            </div>
          </div>

          {/* Execution Controls */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowGhostLines(!showGhostLines)}
                className={`px-4 py-2.5 font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-1.5 text-xs text-white ${
                  showGhostLines
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                }`}
              >
                <span>{showGhostLines ? '👁️ Hide Ghost Lines' : '💡 Ghost Outline Hint'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCameraAngle({ rotX: 0, rotY: 0 })}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 active:scale-95 transition-all flex items-center gap-1.5 text-xs"
              >
                <span>🧭 Reset Camera</span>
              </button>

              <button
                type="button"
                onClick={handleResetLines}
                disabled={activeConnections.length === 0}
                className="px-4 py-2.5 bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 font-semibold rounded-xl border border-slate-700 active:scale-95 transition-all text-xs disabled:opacity-40"
              >
                🔄 Reset Lines
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span>Lines:</span>
              <span className="text-amber-300 font-mono font-bold">
                {activeConnections.length} / {challenge.maxLinesAllowed}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Star Inspector & Mythology Codex */}
        <div className="w-full xl:w-[440px] flex flex-col gap-4">
          {/* Star Node Inspector HUD */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
              <span>⭐</span> Star Spectral Inspector
            </span>

            {hoveredStar ? (
              <div className="flex flex-col gap-2.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-white">{hoveredStar.name}</span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: `${hoveredStar.color}20`, color: hoveredStar.color }}
                  >
                    {SPECTRAL_COLORS[hoveredStar.spectralClass].name}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500">Apparent Mag: </span>
                    <span className="font-bold text-amber-300">{hoveredStar.magnitude}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Distance: </span>
                    <span className="font-bold text-sky-300">{hoveredStar.distanceLightYears} ly</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Coordinates: </span>
                    <span className="font-mono text-slate-400">
                      ({hoveredStar.x}, {hoveredStar.y})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Spectral Class: </span>
                    <span className="font-bold text-slate-200">{hoveredStar.spectralClass}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center text-xs text-slate-500">
                Hover or click any star to inspect its celestial spectroscopy!
              </div>
            )}
          </div>

          {/* Mythology & Star Lore Card */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
              <span>📜</span> Constellation Lore & Star Map
            </span>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex flex-col gap-2">
              <span className="font-bold text-amber-300">{challenge.targetConstellation.name}</span>
              <p>{challenge.targetConstellation.mythologyStory}</p>
            </div>

            <div className="flex flex-col gap-1.5 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Target Stars to Connect:</span>
              <div className="flex flex-wrap gap-1.5">
                {challenge.targetConstellation.stars.map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-1 bg-slate-800 rounded-lg text-[11px] font-medium text-slate-200 border border-slate-700"
                  >
                    ⭐ {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Science of Wonder Codex Overlay */}
      {showScienceDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border-2 border-indigo-400/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
                🔬 Science of Wonder Dossier
              </span>
              <button
                type="button"
                onClick={() => setShowScienceDossier(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-2xl">
                ✨
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  {challenge.targetConstellation.scientificConcept.conceptTitle}
                </h3>
                <p className="text-xs text-indigo-300 font-medium">
                  {challenge.targetConstellation.scientificConcept.scienceTopic}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              {challenge.targetConstellation.scientificConcept.kidExplanation}
            </p>

            <div className="bg-indigo-950/30 border border-indigo-500/40 p-3 rounded-2xl flex items-start gap-2.5">
              <span className="text-lg">💡</span>
              <div className="text-xs text-indigo-200 leading-relaxed">
                <span className="font-bold">Fun Fact: </span>
                {challenge.targetConstellation.scientificConcept.funFact}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowScienceDossier(false)}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all text-sm"
            >
              Continue Stargazing 🚀
            </button>
          </div>
        </div>
      )}

      {/* Universal Activity Reward Celebration */}
      <VictoryCelebrationModal
        isOpen={showCelebration}
        title={`Constellation Mapped: ${challenge.targetConstellation.name}!`}
        subtitle="You charted the celestial coordinates with laser precision, illuminating ancient star patterns!"
        badgeEmoji="✨"
        xpEarned={challenge.rewardXP}
        starsEarned={challenge.rewardStars}
        nextLevelLabel="Next Star Chart ➔"
        onNextLevel={() => handleDifficultyChange(difficulty)}
        onExit={onBack}
      />
    </ActivityShell>
  )
}
