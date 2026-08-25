import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react'
import type { StoryRecord } from '../../../types/story'
import type { DifficultyTier } from '../../../types/experience'
import type {
  WeightItem,
  ScalePanSide,
  PotionScalesPuzzle,
} from '../../../types/games/potionScales'
import {
  CURATED_POTION_PUZZLES,
  getInitialPotionState,
  evaluatePotionAction,
  calculatePotionScore,
} from '../../../services/games/potionScalesEngine'
import { useActivityEconomy } from '../../../hooks/useActivityEconomy'
import { sfxService } from '../../../services/audio/sfxService'
import { ActivityShell } from '../../experience/ActivityShell'
import { CelebrationParticles } from '../../experience/CelebrationParticles'

export interface PotionScalesProps {
  story?: StoryRecord | null
  childId?: string | null
  onBack?: () => void
  initialDifficulty?: DifficultyTier
}

export const PotionScales: React.FC<PotionScalesProps> = ({
  story,
  childId = null,
  onBack,
  initialDifficulty = 'easy',
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty)
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const activePanForPour: ScalePanSide = 'right'

  // Filter puzzles by difficulty
  const availablePuzzles = useMemo(() => {
    return CURATED_POTION_PUZZLES.filter((p) => p.difficulty === difficulty)
  }, [difficulty])

  const currentPuzzle: PotionScalesPuzzle = useMemo(() => {
    return availablePuzzles[puzzleIndex % availablePuzzles.length] || CURATED_POTION_PUZZLES[0]
  }, [availablePuzzles, puzzleIndex])

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

  // Sound effects when equilibrium updates
  useEffect(() => {
    if (state.equilibrium.isBalanced) {
      sfxService.play('balance_success')
    } else if (state.equilibrium.isNearBalanced) {
      sfxService.play('balance_near')
    } else if (state.movesCount > 0) {
      sfxService.play('scale_tilt')
    }
  }, [state.equilibrium.isBalanced, state.equilibrium.isNearBalanced, state.movesCount])

  // Brew Potion & Reward Trigger
  const handleBrewPotion = useCallback(async () => {
    if (!state.equilibrium.isBalanced) return

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

  // Keyboard Navigation & Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCelebration) return

      // Number keys 1-6 to select inventory weights
      if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1
        const item = currentPuzzle.recipe.availableInventory[idx]
        if (item) {
          sfxService.play('potion_pickup')
          dispatch({ type: 'SELECT_INVENTORY_ITEM', item })
        }
      }

      // 'L' to place on left pan, 'R' to place on right pan
      if ((e.key === 'l' || e.key === 'L') && state.activeSelectedItem) {
        sfxService.play('weight_drop')
        dispatch({ type: 'PLACE_ITEM', item: state.activeSelectedItem, pan: 'left' })
      } else if ((e.key === 'r' || e.key === 'R') && state.activeSelectedItem) {
        sfxService.play('weight_drop')
        dispatch({ type: 'PLACE_ITEM', item: state.activeSelectedItem, pan: 'right' })
      }

      // 'C' to clear right pan
      if (e.key === 'c' || e.key === 'C') {
        sfxService.play('potion_bubble')
        dispatch({ type: 'CLEAR_PAN', pan: 'right' })
      }

      // 'Space' to trigger completion if balanced
      if (e.key === ' ' && state.equilibrium.isBalanced && !showCelebration) {
        e.preventDefault()
        handleBrewPotion()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.activeSelectedItem, state.equilibrium.isBalanced, showCelebration, currentPuzzle, handleBrewPotion])

  // Place Item Handler
  const handlePlaceItem = useCallback(
    (item: WeightItem, pan: ScalePanSide) => {
      sfxService.play('weight_drop')
      dispatch({ type: 'PLACE_ITEM', item, pan })
    },
    []
  )

  // Remove Item Handler
  const handleRemoveItem = useCallback((instanceId: string) => {
    sfxService.play('potion_pickup')
    dispatch({ type: 'REMOVE_ITEM', instanceId })
  }, [])

  // Clear Pan Handler
  const handleClearPan = useCallback((pan: ScalePanSide) => {
    sfxService.play('potion_bubble')
    dispatch({ type: 'CLEAR_PAN', pan })
  }, [])

  // Pour Liquid Handler
  const handlePourLiquid = useCallback(
    (amountMl: number) => {
      sfxService.play('potion_bubble')
      dispatch({ type: 'POUR_LIQUID', pan: activePanForPour, amountMl, weightPerMl: 1 })
    },
    [activePanForPour]
  )

  // Advance to next puzzle
  const handleNextPuzzle = useCallback(() => {
    setPuzzleIndex((prev) => (prev + 1) % availablePuzzles.length)
  }, [availablePuzzles.length])

  const leftItems = useMemo(() => state.placedItems.filter((i) => i.pan === 'left'), [state.placedItems])
  const rightItems = useMemo(() => state.placedItems.filter((i) => i.pan === 'right'), [state.placedItems])

  // Pan vertical offset derived from tilt angle (-25deg to +25deg)
  const leftPanYOffset = Math.sin((state.equilibrium.tiltAngleDeg * Math.PI) / 180) * 45
  const rightPanYOffset = -leftPanYOffset

  return (
    <ActivityShell
      title="Potion Market Scales"
      tagline={story ? `Story Alchemy Order: ${story.title}` : currentPuzzle.title}
      emoji="⚖️"
      primaryDomain="logic"
      difficulty={difficulty}
      onDifficultyChange={(newDiff) => {
        setDifficulty(newDiff)
        setPuzzleIndex(0)
      }}
      headerRight={
        onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="potion-scales-back-btn"
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
          gap: '1.25rem',
          maxWidth: '1080px',
          margin: '0 auto',
          padding: '1rem',
          color: '#f8fafc',
          userSelect: 'none',
        }}
      >
        {/* 1. Customer Order & Recipe Header Banner */}
        <section
          className="customer-order-banner"
          aria-label="Customer Potion Order"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.85) 100%)',
            borderRadius: '16px',
            border: '1.5px solid rgba(148, 163, 184, 0.25)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                fontSize: '2.5rem',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '50%',
                width: '64px',
                height: '64px',
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
              <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                Customer: {currentPuzzle.recipe.customer.name}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0', marginTop: '2px' }}>
                &ldquo;{currentPuzzle.recipe.customer.orderQuote}&rdquo;
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              border: `1px solid ${currentPuzzle.recipe.potionColor}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>{currentPuzzle.recipe.potionEmoji}</span>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Target Recipe</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: currentPuzzle.recipe.potionColor }}>
                {currentPuzzle.recipe.displayTargetFormula}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Physical Balance Scale Canvas */}
        <section
          className="balance-scale-stage"
          aria-label="Apothecary Balance Scale"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
            borderRadius: '20px',
            border: '2px solid rgba(56, 189, 248, 0.25)',
            padding: '1.5rem 1rem',
            position: 'relative',
            minHeight: '380px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
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
              padding: '0.4rem 1.25rem',
              borderRadius: '999px',
              border: `1.5px solid ${
                state.equilibrium.isBalanced
                  ? '#10b981'
                  : state.equilibrium.isNearBalanced
                  ? '#f59e0b'
                  : 'rgba(148, 163, 184, 0.3)'
              }`,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>
              {state.equilibrium.isBalanced ? '✨' : state.equilibrium.isNearBalanced ? '⚡' : '⚖️'}
            </span>
            <span
              style={{
                fontSize: '0.9rem',
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

          {/* Scale Brass Structure (SVG Beam & Dual Pans) */}
          <div
            style={{
              width: '100%',
              maxWidth: '800px',
              height: '240px',
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '1.5rem 0',
            }}
          >
            {/* Center Pedestal Pillar */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '10px',
                transform: 'translateX(-50%)',
                width: '36px',
                height: '180px',
                background: 'linear-gradient(to right, #78350f, #d97706, #92400e)',
                borderRadius: '8px 8px 0 0',
                boxShadow: '0 0 16px rgba(0, 0, 0, 0.6)',
                zIndex: 2,
              }}
            >
              {/* Fulcrum Diamond Pivot Point */}
              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: '32px',
                  height: '32px',
                  backgroundColor: state.equilibrium.isBalanced ? '#10b981' : '#f59e0b',
                  borderRadius: '4px',
                  border: '2px solid #fef08a',
                  boxShadow: state.equilibrium.isBalanced
                    ? '0 0 20px #10b981'
                    : '0 0 12px rgba(245, 158, 11, 0.5)',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>

            {/* Rotating Balance Beam Bar */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '44px',
                width: '560px',
                height: '12px',
                background: 'linear-gradient(to bottom, #fef08a, #d97706, #78350f)',
                borderRadius: '6px',
                transform: `translateX(-50%) rotate(${state.equilibrium.tiltAngleDeg}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                zIndex: 3,
              }}
            >
              {/* Center Vertical Pointer */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '-28px',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '28px',
                  backgroundColor: state.equilibrium.isBalanced ? '#34d399' : '#fbbf24',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px rgba(251, 191, 36, 0.8)',
                }}
              />
            </div>

            {/* LEFT SUSPENDED PAN */}
            <div
              className="scale-pan left-pan"
              style={{
                width: '44%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `translateY(${leftPanYOffset}px)`,
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 4,
              }}
            >
              {/* Chains SVG */}
              <svg width="180" height="70" viewBox="0 0 180 70" fill="none" style={{ opacity: 0.85 }}>
                <line x1="90" y1="0" x2="25" y2="70" stroke="#d97706" strokeWidth="2.5" strokeDasharray="3 3" />
                <line x1="90" y1="0" x2="155" y2="70" stroke="#d97706" strokeWidth="2.5" strokeDasharray="3 3" />
              </svg>

              {/* Brass Pan Bowl */}
              <div
                style={{
                  width: '100%',
                  minHeight: '90px',
                  background: 'linear-gradient(180deg, rgba(217, 119, 6, 0.25) 0%, rgba(120, 53, 15, 0.65) 100%)',
                  border: '2.5px solid #f59e0b',
                  borderRadius: '0 0 90px 90px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 2px 10px rgba(251, 191, 36, 0.3)',
                  position: 'relative',
                }}
              >
                {leftItems.length === 0 ? (
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>Empty Pan</span>
                ) : (
                  leftItems.map((instance) => (
                    <button
                      key={instance.instanceId}
                      type="button"
                      onClick={() => !instance.instanceId.startsWith('left_start_') && handleRemoveItem(instance.instanceId)}
                      disabled={instance.instanceId.startsWith('left_start_')}
                      title={instance.instanceId.startsWith('left_start_') ? 'Locked Recipe Target' : 'Click to Remove'}
                      style={{
                        backgroundColor: instance.item.color,
                        border: `1.5px solid ${instance.item.glowColor}`,
                        borderRadius: '8px',
                        padding: '0.3rem 0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: instance.instanceId.startsWith('left_start_') ? 'default' : 'pointer',
                        boxShadow: `0 0 10px ${instance.item.glowColor}`,
                        color: '#0f172a',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                      }}
                    >
                      <span>{instance.item.emoji}</span>
                      <span>{instance.item.displayWeightLabel}</span>
                      {!instance.instanceId.startsWith('left_start_') && <span style={{ opacity: 0.6 }}>×</span>}
                    </button>
                  ))
                )}

                {/* Left Pan Total Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-12px',
                    backgroundColor: '#1e293b',
                    border: '1.5px solid #f59e0b',
                    borderRadius: '12px',
                    padding: '0.15rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#fbbf24',
                  }}
                >
                  Left Total: {state.equilibrium.leftTotalWeight}g
                </div>
              </div>

              {/* Left Pan Quick Action */}
              {state.activeSelectedItem && (
                <button
                  type="button"
                  onClick={() => state.activeSelectedItem && handlePlaceItem(state.activeSelectedItem, 'left')}
                  style={{
                    marginTop: '1.2rem',
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    border: '1px solid #38bdf8',
                    borderRadius: '8px',
                    padding: '0.3rem 0.8rem',
                    color: '#38bdf8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ➕ Place Here [L]
                </button>
              )}
            </div>

            {/* RIGHT SUSPENDED PAN */}
            <div
              className="scale-pan right-pan"
              style={{
                width: '44%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `translateY(${rightPanYOffset}px)`,
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 4,
              }}
            >
              {/* Chains SVG */}
              <svg width="180" height="70" viewBox="0 0 180 70" fill="none" style={{ opacity: 0.85 }}>
                <line x1="90" y1="0" x2="25" y2="70" stroke="#d97706" strokeWidth="2.5" strokeDasharray="3 3" />
                <line x1="90" y1="0" x2="155" y2="70" stroke="#d97706" strokeWidth="2.5" strokeDasharray="3 3" />
              </svg>

              {/* Brass Pan Bowl */}
              <div
                style={{
                  width: '100%',
                  minHeight: '90px',
                  background: 'linear-gradient(180deg, rgba(217, 119, 6, 0.25) 0%, rgba(120, 53, 15, 0.65) 100%)',
                  border: '2.5px solid #f59e0b',
                  borderRadius: '0 0 90px 90px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 2px 10px rgba(251, 191, 36, 0.3)',
                  position: 'relative',
                }}
              >
                {rightItems.length === 0 ? (
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>Drop Items Here</span>
                ) : (
                  rightItems.map((instance) => (
                    <button
                      key={instance.instanceId}
                      type="button"
                      onClick={() => !instance.instanceId.startsWith('right_start_') && handleRemoveItem(instance.instanceId)}
                      disabled={instance.instanceId.startsWith('right_start_')}
                      title={instance.instanceId.startsWith('right_start_') ? 'Locked Recipe Target' : 'Click to Remove'}
                      style={{
                        backgroundColor: instance.item.color,
                        border: `1.5px solid ${instance.item.glowColor}`,
                        borderRadius: '8px',
                        padding: '0.3rem 0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: instance.instanceId.startsWith('right_start_') ? 'default' : 'pointer',
                        boxShadow: `0 0 10px ${instance.item.glowColor}`,
                        color: '#0f172a',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                      }}
                    >
                      <span>{instance.item.emoji}</span>
                      <span>{instance.item.displayWeightLabel}</span>
                      {!instance.instanceId.startsWith('right_start_') && <span style={{ opacity: 0.6 }}>×</span>}
                    </button>
                  ))
                )}

                {/* Right Pan Total Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-12px',
                    backgroundColor: '#1e293b',
                    border: '1.5px solid #f59e0b',
                    borderRadius: '12px',
                    padding: '0.15rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#fbbf24',
                  }}
                >
                  Right Total: {state.equilibrium.rightTotalWeight}g
                </div>
              </div>

              {/* Right Pan Quick Action */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem' }}>
                {state.activeSelectedItem && (
                  <button
                    type="button"
                    onClick={() => state.activeSelectedItem && handlePlaceItem(state.activeSelectedItem, 'right')}
                    style={{
                      backgroundColor: 'rgba(56, 189, 248, 0.2)',
                      border: '1px solid #38bdf8',
                      borderRadius: '8px',
                      padding: '0.3rem 0.8rem',
                      color: '#38bdf8',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ➕ Place Here [R]
                  </button>
                )}
                {rightItems.some((i) => !i.instanceId.startsWith('right_start_')) && (
                  <button
                    type="button"
                    onClick={() => handleClearPan('right')}
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid #ef4444',
                      borderRadius: '8px',
                      padding: '0.3rem 0.8rem',
                      color: '#f87171',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    🧹 Clear [C]
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Solution Hint & Brew Trigger */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingTop: '0.5rem',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
              💡 Hint: {currentPuzzle.recipe.solutionHint}
            </div>

            <button
              type="button"
              disabled={!state.equilibrium.isBalanced}
              onClick={handleBrewPotion}
              style={{
                backgroundColor: state.equilibrium.isBalanced ? '#10b981' : 'rgba(51, 65, 85, 0.5)',
                color: state.equilibrium.isBalanced ? '#ffffff' : '#64748b',
                border: state.equilibrium.isBalanced ? '2px solid #34d399' : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '0.75rem 1.8rem',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: state.equilibrium.isBalanced ? 'pointer' : 'not-allowed',
                boxShadow: state.equilibrium.isBalanced
                  ? '0 0 24px rgba(16, 185, 129, 0.6), 0 4px 12px rgba(0,0,0,0.3)'
                  : 'none',
                transform: state.equilibrium.isBalanced ? 'scale(1.04)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              🔮 Brew Magical Potion! [Space]
            </button>
          </div>
        </section>

        {/* 3. Ingredient & Weights Tray Shelf */}
        <section
          className="weights-shelf-tray"
          aria-label="Apothecary Weights and Ingredients"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            borderRadius: '16px',
            border: '1.5px solid rgba(148, 163, 184, 0.2)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase' }}>
              🧪 Apothecary Weight Tray (Select an Item to Place)
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Keyboard Hotkeys: [1..{currentPuzzle.recipe.availableInventory.length}]
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {currentPuzzle.recipe.availableInventory.map((item, idx) => {
              const isSelected = state.activeSelectedItem?.id === item.id

              return (
                <button
                  key={`${item.id}_${idx}`}
                  type="button"
                  onClick={() => {
                    sfxService.play('potion_pickup')
                    dispatch({
                      type: 'SELECT_INVENTORY_ITEM',
                      item: isSelected ? null : item,
                    })
                  }}
                  style={{
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.8)',
                    border: isSelected ? '2px solid #38bdf8' : '1.5px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '0.75rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isSelected ? `0 0 16px ${item.glowColor}` : 'none',
                    transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <span style={{ fontSize: '1.8rem' }}>{item.emoji}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>{item.name}</span>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: item.color,
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '6px',
                    }}
                  >
                    {item.displayWeightLabel}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Liquid Pouring Section if enabled on Hard Tier */}
          {currentPuzzle.recipe.allowLiquidPouring && (
            <div
              style={{
                marginTop: '0.75rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🧪</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#06b6d4' }}>
                  Liquid Volume Pouring Station:
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handlePourLiquid(100)}
                  style={{
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    border: '1px solid #06b6d4',
                    borderRadius: '8px',
                    padding: '0.4rem 0.8rem',
                    color: '#06b6d4',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  💧 Pour 100ml (+1u)
                </button>
                <button
                  type="button"
                  onClick={() => handlePourLiquid(250)}
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid #8b5cf6',
                    borderRadius: '8px',
                    padding: '0.4rem 0.8rem',
                    color: '#a78bfa',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  🍶 Pour 250ml (+2.5u)
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 4. Success Reward & Science Celebration Modal */}
        {showCelebration && (
          <>
            <CelebrationParticles particleCount={40} />
            <div
              className="celebration-overlay"
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '24px',
                  border: '2px solid #10b981',
                  maxWidth: '540px',
                  width: '100%',
                  padding: '2rem',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '1.25rem',
                }}
              >
                <div
                  style={{
                    fontSize: '4rem',
                    filter: 'drop-shadow(0 0 16px rgba(16, 185, 129, 0.6))',
                  }}
                >
                  {currentPuzzle.recipe.potionEmoji}
                </div>

                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', margin: 0 }}>
                    Potion Brewed to Perfection!
                  </h2>
                  <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginTop: '0.5rem', lineHeight: 1.5 }}>
                    &ldquo;{currentPuzzle.recipe.customer.celebrationQuote}&rdquo;
                  </p>
                </div>

                {/* Science of Wonder Card */}
                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(56, 189, 248, 0.3)',
                    padding: '1rem',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#38bdf8',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    🔬 Science of Wonder • {currentPuzzle.scientificConcept.scienceTopic}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                    {currentPuzzle.scientificConcept.conceptTitle}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.4rem 0 0 0', lineHeight: 1.4 }}>
                    {currentPuzzle.scientificConcept.kidExplanation}
                  </p>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#fbbf24',
                      marginTop: '0.4rem',
                      fontWeight: 600,
                    }}
                  >
                    ⭐ Fun Fact: {currentPuzzle.scientificConcept.funFact}
                  </div>
                </div>

                {/* Next Potion Button */}
                <button
                  type="button"
                  onClick={handleNextPuzzle}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.85rem 2rem',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    width: '100%',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  ⭐ Next Customer Order ➔
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </ActivityShell>
  )
}
