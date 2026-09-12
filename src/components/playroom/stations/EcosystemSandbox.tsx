import React, { useState, useEffect, useRef } from 'react'
import type { DifficultyTier } from '../../../types/experience'
import type {
  EcosystemChallenge,
  EcosystemSimulationState,
  Organism,
} from '../../../types/games/ecosystemSandbox'
import {
  generateProceduralEcosystemChallenge,
  simulateEcosystemTick,
  ECO_TOOLS,
} from '../../../services/games/ecosystemSandboxEngine'
import { sfxService } from '../../../services/audio/sfxService'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { ActivityShell } from '../../experience/ActivityShell'
import { VictoryCelebrationModal } from '../../experience/VictoryCelebrationModal'

interface EcosystemSandboxProps {
  initialDifficulty?: DifficultyTier
  childId?: string
  onComplete?: (stars: number, xp: number) => void
  onBack?: () => void
}

export const EcosystemSandbox: React.FC<EcosystemSandboxProps> = ({
  initialDifficulty = 'easy',
  childId = 'guest',
  onComplete,
  onBack,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty)
  const [challenge, setChallenge] = useState<EcosystemChallenge>(() =>
    generateProceduralEcosystemChallenge(`eco_${Date.now()}`, initialDifficulty)
  )

  const [simState, setSimState] = useState<EcosystemSimulationState>(() => ({
    grid: challenge.startingTiles,
    cycle: 0,
    weather: challenge.initialWeather,
    biodiversityScore: 20,
    producerCount: 2,
    herbivoreCount: 0,
    carnivoreCount: 0,
    decomposerCount: 0,
    isGoalAchieved: false,
    statusMessage: 'Tap tools to place water, trees, and friendly wildlife!',
  }))

  const [selectedTool, setSelectedTool] = useState<string>('forest')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [simSpeed, setSimSpeed] = useState<number>(1000) // ms per cycle
  const [showScienceDossier, setShowScienceDossier] = useState<boolean>(false)
  const [showCelebration, setShowCelebration] = useState<boolean>(false)
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Universal Activity Economy integration
  const { completeActivity } = useActivityEconomy({
    activityType: 'ecosystem_sandbox',
    activityId: `eco_${challenge.id}`,
    childId,
  })

  // Handle Difficulty Change
  const handleDifficultyChange = (newDiff: DifficultyTier) => {
    setDifficulty(newDiff)
    const newChallenge = generateProceduralEcosystemChallenge(`eco_${Date.now()}`, newDiff)
    setChallenge(newChallenge)
    setSimState({
      grid: newChallenge.startingTiles,
      cycle: 0,
      weather: newChallenge.initialWeather,
      biodiversityScore: 20,
      producerCount: 2,
      herbivoreCount: 0,
      carnivoreCount: 0,
      decomposerCount: 0,
      isGoalAchieved: false,
      statusMessage: 'Tap tools to place water, trees, and friendly wildlife!',
    })
    setIsPlaying(false)
    setShowCelebration(false)
    setShowScienceDossier(false)
  }

  // Simulation Tick Timer
  useEffect(() => {
    if (!isPlaying || simState.isGoalAchieved) return

    const interval = setInterval(() => {
      setSimState((prev) => {
        const next = simulateEcosystemTick(prev)
        if (next.isGoalAchieved && !prev.isGoalAchieved) {
          sfxService.play('victory_fanfare')
          setShowCelebration(true)
          setShowScienceDossier(true)
          completeActivity({ starsAmount: challenge.rewardStars, xpAmount: challenge.rewardXP })
          if (onComplete) onComplete(challenge.rewardStars, challenge.rewardXP)
        }
        return next
      })
    }, simSpeed)

    return () => clearInterval(interval)
  }, [isPlaying, simSpeed, simState.isGoalAchieved, challenge, completeActivity, onComplete])

  // Single Step Trigger
  const handleStepTick = () => {
    sfxService.resumeContext().catch(() => {})
    sfxService.play('card_flip')
    setSimState((prev) => {
      const next = simulateEcosystemTick(prev)
      if (next.isGoalAchieved && !prev.isGoalAchieved) {
        sfxService.play('victory_fanfare')
        setShowCelebration(true)
        setShowScienceDossier(true)
        completeActivity({ starsAmount: challenge.rewardStars, xpAmount: challenge.rewardXP })
        if (onComplete) onComplete(challenge.rewardStars, challenge.rewardXP)
      }
      return next
    })
  }

  // Apply Tool to Tile
  const handleTileClick = (x: number, y: number) => {
    sfxService.resumeContext().catch(() => {})

    setSimState((prev) => {
      const newGrid = prev.grid.map((row) => row.map((tile) => ({ ...tile, organisms: [...tile.organisms] })))
      const tile = newGrid[y][x]

      if (selectedTool === 'water') {
        tile.biome = 'shallow_water'
        tile.moisture = 100
        tile.vegetationLevel = 0
        tile.organisms = []
        sfxService.play('liquid_mix')
      } else if (selectedTool === 'grassland') {
        tile.biome = 'grassland'
        tile.vegetationLevel = 40
        sfxService.play('card_flip')
      } else if (selectedTool === 'forest') {
        tile.biome = 'forest'
        tile.vegetationLevel = Math.min(100, tile.vegetationLevel + 50)
        sfxService.play('spell_awaken')
      } else if (selectedTool === 'herbivore') {
        if (tile.biome !== 'deep_water' && tile.biome !== 'shallow_water') {
          const newHerbivore: Organism = {
            id: `herb_${Date.now()}_${Math.random()}`,
            species: 'Sun-Deer',
            name: 'Sun-Deer',
            emoji: '🦌',
            trophicLevel: 'herbivore',
            x,
            y,
            energy: 80,
            maxEnergy: 100,
            age: 0,
            isAlive: true,
          }
          tile.organisms.push(newHerbivore)
          sfxService.play('creature_feed')
        }
      } else if (selectedTool === 'carnivore') {
        if (tile.biome !== 'deep_water' && tile.biome !== 'shallow_water') {
          const newCarnivore: Organism = {
            id: `carn_${Date.now()}_${Math.random()}`,
            species: 'Amber-Fox',
            name: 'Amber-Fox',
            emoji: '🦊',
            trophicLevel: 'carnivore',
            x,
            y,
            energy: 90,
            maxEnergy: 100,
            age: 0,
            isAlive: true,
          }
          tile.organisms.push(newCarnivore)
          sfxService.play('creature_purr')
        }
      } else if (selectedTool === 'sun') {
        sfxService.play('star_pop')
        return { ...prev, weather: 'sunny', statusMessage: '☀️ Radiant sunshine boosts photosynthesis!' }
      } else if (selectedTool === 'rain') {
        sfxService.play('liquid_mix')
        return { ...prev, weather: 'rainy', statusMessage: '🌧️ Gentle rain revitalizes dry soil!' }
      }

      return simulateEcosystemTick({ ...prev, grid: newGrid })
    })
  }

  // 60 FPS 3D-Depth Isometric Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let tickCount = 0

    const renderLoop = () => {
      tickCount++
      const width = canvas.width
      const height = canvas.height

      // Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height)
      if (simState.weather === 'sunny') {
        skyGrad.addColorStop(0, '#0c4a6e')
        skyGrad.addColorStop(1, '#064e3b')
      } else if (simState.weather === 'rainy') {
        skyGrad.addColorStop(0, '#1e293b')
        skyGrad.addColorStop(1, '#0f172a')
      } else {
        skyGrad.addColorStop(0, '#1e1b4b')
        skyGrad.addColorStop(1, '#0f172a')
      }
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, width, height)

      const tileWidth = 64
      const tileHeight = 36
      const originX = width / 2
      const originY = 80 + (7 - challenge.gridHeight) * 12

      // Draw Isometric Island Base & Cliff Shadow
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(originX, originY + (challenge.gridWidth + challenge.gridHeight) * 16, 220, 45, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
      ctx.fill()
      ctx.restore()

      // Render Grid Tiles (Back to Front for isometric sorting)
      for (let y = 0; y < challenge.gridHeight; y++) {
        for (let x = 0; x < challenge.gridWidth; x++) {
          const tile = simState.grid[y]?.[x]
          if (!tile) continue

          const isoX = originX + (x - y) * (tileWidth / 2)
          const isoY = originY + (x + y) * (tileHeight / 2)

          const isHovered = hoveredTile?.x === x && hoveredTile?.y === y

          // Draw Tile Base
          ctx.beginPath()
          ctx.moveTo(isoX, isoY)
          ctx.lineTo(isoX + tileWidth / 2, isoY + tileHeight / 2)
          ctx.lineTo(isoX, isoY + tileHeight)
          ctx.lineTo(isoX - tileWidth / 2, isoY + tileHeight / 2)
          ctx.closePath()

          if (tile.biome === 'deep_water') {
            ctx.fillStyle = '#0284c7'
            ctx.strokeStyle = '#38bdf8'
          } else if (tile.biome === 'shallow_water') {
            const waveGlow = Math.sin(tickCount * 0.08 + x + y) * 0.15 + 0.85
            ctx.fillStyle = `rgba(6, 182, 212, ${waveGlow})`
            ctx.strokeStyle = '#22d3ee'
          } else if (tile.biome === 'forest') {
            ctx.fillStyle = '#065f46'
            ctx.strokeStyle = '#10b981'
          } else if (tile.biome === 'mountain') {
            ctx.fillStyle = '#475569'
            ctx.strokeStyle = '#94a3b8'
          } else {
            // Grassland scaled by moisture
            ctx.fillStyle = tile.moisture > 50 ? '#15803d' : '#854d0e'
            ctx.strokeStyle = '#4ade80'
          }

          ctx.lineWidth = isHovered ? 3 : 1.5
          if (isHovered) ctx.strokeStyle = '#fbbf24'
          ctx.fill()
          ctx.stroke()

          // Draw 3D Depth Cliff Edge for front border
          if (y === challenge.gridHeight - 1 || x === challenge.gridWidth - 1) {
            const cliffH = 18
            ctx.fillStyle = '#1e293b'
            ctx.beginPath()
            ctx.moveTo(isoX - tileWidth / 2, isoY + tileHeight / 2)
            ctx.lineTo(isoX, isoY + tileHeight)
            ctx.lineTo(isoX, isoY + tileHeight + cliffH)
            ctx.lineTo(isoX - tileWidth / 2, isoY + tileHeight / 2 + cliffH)
            ctx.closePath()
            ctx.fill()

            ctx.fillStyle = '#0f172a'
            ctx.beginPath()
            ctx.moveTo(isoX, isoY + tileHeight)
            ctx.lineTo(isoX + tileWidth / 2, isoY + tileHeight / 2)
            ctx.lineTo(isoX + tileWidth / 2, isoY + tileHeight / 2 + cliffH)
            ctx.lineTo(isoX, isoY + tileHeight + cliffH)
            ctx.closePath()
            ctx.fill()
          }

          // Draw Tree Flora (if forest or high vegetation)
          if (tile.biome === 'forest' || tile.vegetationLevel > 50) {
            const treeX = isoX
            const treeY = isoY + tileHeight / 2 - 8
            const windSway = Math.sin(tickCount * 0.05 + x) * 2

            // Tree Trunk
            ctx.fillStyle = '#78350f'
            ctx.fillRect(treeX - 2, treeY, 4, 10)

            // Foliage Canopy
            ctx.save()
            ctx.shadowColor = '#10b981'
            ctx.shadowBlur = 8
            ctx.fillStyle = '#10b981'
            ctx.beginPath()
            ctx.arc(treeX + windSway, treeY - 8, 10, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          }

          // Draw Organisms (Fauna)
          for (let i = 0; i < tile.organisms.length; i++) {
            const org = tile.organisms[i]
            const orgHop = Math.abs(Math.sin(tickCount * 0.1 + i)) * 6
            const orgX = isoX + (i * 12 - 6)
            const orgY = isoY + tileHeight / 2 - 12 - orgHop

            ctx.font = '16px system-ui'
            ctx.textAlign = 'center'
            ctx.fillText(org.emoji, orgX, orgY)
          }
        }
      }

      // Draw Dynamic Weather Particles
      if (simState.weather === 'rainy') {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'
        ctx.lineWidth = 1.5
        for (let i = 0; i < 25; i++) {
          const rx = (tickCount * 12 + i * 35) % width
          const ry = (tickCount * 18 + i * 45) % height
          ctx.beginPath()
          ctx.moveTo(rx, ry)
          ctx.lineTo(rx - 4, ry + 12)
          ctx.stroke()
        }
      } else if (simState.weather === 'sunny') {
        ctx.save()
        ctx.shadowColor = '#facc15'
        ctx.shadowBlur = 20
        ctx.fillStyle = 'rgba(253, 224, 71, 0.15)'
        ctx.beginPath()
        ctx.arc(width - 60, 60, 45, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop)
    }

    renderLoop()

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [challenge, simState, hoveredTile])

  // Mouse interaction for tile hover & click
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height

    const tileWidth = 64
    const tileHeight = 36
    const originX = canvas.width / 2
    const originY = 80 + (7 - challenge.gridHeight) * 12

    // Reverse Isometric Coordinate Math
    const relX = clickX - originX
    const relY = clickY - originY

    const gridX = Math.floor((relY / (tileHeight / 2) + relX / (tileWidth / 2)) / 2)
    const gridY = Math.floor((relY / (tileHeight / 2) - relX / (tileWidth / 2)) / 2)

    if (gridX >= 0 && gridX < challenge.gridWidth && gridY >= 0 && gridY < challenge.gridHeight) {
      setHoveredTile({ x: gridX, y: gridY })
    } else {
      setHoveredTile(null)
    }
  }

  const handleCanvasClick = () => {
    if (hoveredTile) {
      handleTileClick(hoveredTile.x, hoveredTile.y)
    }
  }

  return (
    <ActivityShell
      title="3D Ecosystem Sandbox"
      emoji="🏝️"
      tagline="Living Ecological Sandbox Sanctuary"
      primaryDomain="creativity"
      difficulty={difficulty}
      variant="hero"
      onDifficultyChange={(newDiff) => handleDifficultyChange(newDiff as DifficultyTier)}
    >
      <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto p-4 select-none">
        {/* Left Column: 3D Isometric Viewport */}
        <div className="flex-1 flex flex-col items-center bg-slate-900/80 backdrop-blur-md rounded-2xl border border-emerald-500/30 p-4 shadow-2xl relative overflow-hidden">
          {/* Header Stats Bar */}
          <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700/60 mb-3 text-sm font-medium">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold tracking-wide">
                🌿 Biodiversity: {simState.biodiversityScore}/100
              </span>
              <span className="text-sky-400 font-bold">🌲 Flora: {simState.producerCount}</span>
              <span className="text-amber-400 font-bold">🦌 Grazers: {simState.herbivoreCount}</span>
              <span className="text-rose-400 font-bold">🦊 Predators: {simState.carnivoreCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Cycle:</span>
              <span className="font-bold text-amber-300 font-mono">#{simState.cycle}</span>
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="relative w-full aspect-[4/3] max-h-[460px] flex items-center justify-center bg-slate-950 rounded-xl overflow-hidden border border-slate-800 cursor-pointer">
            <canvas
              ref={canvasRef}
              width={640}
              height={460}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={() => setHoveredTile(null)}
              onClick={handleCanvasClick}
              className="w-full h-full object-contain"
            />

            {/* Status Overlay Pill */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌿</span>
                <span className="font-semibold text-emerald-300">{simState.statusMessage}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span>Weather:</span>
                <span className="font-bold text-amber-300 capitalize">{simState.weather}</span>
              </div>
            </div>
          </div>

          {/* Execution Controls */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-5 py-2.5 font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2 text-white ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                }`}
              >
                <span>{isPlaying ? '⏸️ Pause Flow' : '▶️ Start Eco-Flow'}</span>
              </button>

              <button
                type="button"
                onClick={handleStepTick}
                disabled={isPlaying}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>⏯️ Step Cycle</span>
              </button>

              <button
                type="button"
                onClick={() => handleDifficultyChange(difficulty)}
                className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 active:scale-95 transition-all"
              >
                🔄 Reset Island
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span>Speed:</span>
              <button
                type="button"
                onClick={() => setSimSpeed(1000)}
                className={`px-2 py-0.5 rounded ${simSpeed === 1000 ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}
              >
                1x
              </button>
              <button
                type="button"
                onClick={() => setSimSpeed(400)}
                className={`px-2 py-0.5 rounded ${simSpeed === 400 ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}
              >
                2x
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Biome Tools & Trophic Health Dashboard */}
        <div className="w-full xl:w-[440px] flex flex-col gap-4">
          {/* Tool Palette Dock */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
              <span>🧰</span> Ecological Sandbox Tools
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {Object.values(ECO_TOOLS).map((tool) => {
                const isSelected = selectedTool === tool.id
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      sfxService.play('card_flip')
                      setSelectedTool(tool.id)
                    }}
                    className={`p-3 rounded-xl border flex flex-col gap-1 text-left transition-all shadow-lg active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-600/30 border-emerald-400 ring-2 ring-emerald-400/50 text-white'
                        : 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700/80 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-2xl">{tool.emoji}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                        {tool.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-100">{tool.name}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{tool.description}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Trophic Food Web Health Card */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
              <span>📊</span> Trophic Food Web Balance
            </span>

            <div className="flex flex-col gap-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>🌲 Producers (Plants/Trees)</span>
                  <span className="font-bold text-emerald-400">{simState.producerCount} / 4 Target</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (simState.producerCount / 4) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>🦌 Primary Consumers (Sun-Deer)</span>
                  <span className="font-bold text-amber-400">{simState.herbivoreCount} / 2 Target</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (simState.herbivoreCount / 2) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>🦊 Apex Predators (Amber-Fox)</span>
                  <span className="font-bold text-rose-400">{simState.carnivoreCount} / 1 Target</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (simState.carnivoreCount / 1) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Science of Wonder Codex Overlay */}
      {showScienceDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-400/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
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
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-2xl">
                🏝️
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{challenge.scientificConcept.conceptTitle}</h3>
                <p className="text-xs text-emerald-300 font-medium">{challenge.scientificConcept.scienceTopic}</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              {challenge.scientificConcept.kidExplanation}
            </p>

            <div className="bg-emerald-950/30 border border-emerald-500/40 p-3 rounded-2xl flex items-start gap-2.5">
              <span className="text-lg">💡</span>
              <div className="text-xs text-emerald-200 leading-relaxed">
                <span className="font-bold">Fun Fact: </span>
                {challenge.scientificConcept.funFact}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowScienceDossier(false)}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl shadow-lg active:scale-95 transition-all text-sm"
            >
              Continue Sanctuary Exploration 🚀
            </button>
          </div>
        </div>
      )}

      {/* Universal Activity Reward Celebration */}
      <VictoryCelebrationModal
        isOpen={showCelebration}
        title={`Ecosystem Equilibrium: ${challenge.title}!`}
        subtitle="You nurtured a balanced, vibrant biome where flora, grazers, and predators thrive in harmony!"
        badgeEmoji="🏝️"
        xpEarned={challenge.rewardXP}
        starsEarned={challenge.rewardStars}
        nextLevelLabel="Next Biome ➔"
        onNextLevel={() => handleDifficultyChange(difficulty)}
        onExit={onBack}
      />
    </ActivityShell>
  )
}
