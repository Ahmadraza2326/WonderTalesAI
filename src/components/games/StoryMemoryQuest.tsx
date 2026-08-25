import { memo, useState, useEffect, useRef, useMemo } from 'react'
import type { StoryRecord } from '../../types/story'
import type {
  MemoryDifficulty,
  MemoryQuestGame,
  MemoryQuestCompletionResult,
} from '../../types/games/storyMemoryQuest'
import {
  generateMemoryQuestGame,
  calculateMemoryQuestScore,
} from '../../services/games/storyMemoryQuest'
import { useActivityEconomy } from '../../hooks/useActivityEconomy'
import { sfxService } from '../../services/audio/sfxService'
import { ActivityShell } from '../experience/ActivityShell'
import { RewardCelebration } from '../experience/RewardCelebration'

interface StoryMemoryQuestProps {
  story: StoryRecord
}

export const StoryMemoryQuest = memo(function StoryMemoryQuest({
  story,
}: StoryMemoryQuestProps) {
  const activeChildId = story.child_id || null
  const [difficulty, setDifficulty] = useState<MemoryDifficulty>('easy')
  const [game, setGame] = useState<MemoryQuestGame>(() =>
    generateMemoryQuestGame(story, 'easy')
  )

  const { isCompleted, rewardStatus, completeActivity, resetActivity } =
    useActivityEconomy({
      childId: activeChildId,
      activityType: 'memory_match',
      activityId: story.id,
    })

  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([])
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set())
  const [moves, setMoves] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [completionResult, setCompletionResult] =
    useState<MemoryQuestCompletionResult | null>(null)

  const lockBoardRef = useRef(false)

  // Re-generate game if difficulty or story changes
  useEffect(() => {
    const newGame = generateMemoryQuestGame(story, difficulty)
    setGame(newGame)
    setFlippedCardIds([])
    setMatchedPairIds(new Set())
    setMoves(0)
    setMistakes(0)
    setStartTime(Date.now())
    setCompletionResult(null)
    lockBoardRef.current = false
    resetActivity()
  }, [story, difficulty, resetActivity])

  const handleCardClick = (cardId: string, pairId: string) => {
    if (lockBoardRef.current || isCompleted) return
    if (flippedCardIds.includes(cardId) || matchedPairIds.has(pairId)) return

    sfxService.play('card_flip')
    const newFlipped = [...flippedCardIds, cardId]
    setFlippedCardIds(newFlipped)

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1)
      const firstCard = game.cards.find((c) => c.id === newFlipped[0])
      const secondCard = game.cards.find((c) => c.id === newFlipped[1])

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found!
        sfxService.play('match_success')
        const newMatched = new Set(matchedPairIds)
        newMatched.add(firstCard.pairId)
        setMatchedPairIds(newMatched)
        setFlippedCardIds([])

        // Check if game complete
        if (newMatched.size === game.totalPairs) {
          const durationSeconds = Math.max(
            1,
            Math.round((Date.now() - startTime) / 1000)
          )
          const finalMoves = moves + 1
          const scoreData = calculateMemoryQuestScore({
            difficulty,
            pairsCount: game.totalPairs,
            moves: finalMoves,
            mistakes,
            durationSeconds,
          })

          const finalResult: MemoryQuestCompletionResult = {
            storyId: story.id,
            childId: activeChildId,
            difficulty,
            pairsCompleted: game.totalPairs,
            totalPairs: game.totalPairs,
            moves: finalMoves,
            mistakes,
            accuracy: scoreData.accuracy,
            durationSeconds,
            score: scoreData.score,
            xpEarned: scoreData.xpEarned,
            starsEarned: scoreData.starsEarned,
          }

          setCompletionResult(finalResult)

          // Trigger authoritative activity reward via unified Experience Layer hook
          completeActivity({
            xpAmount: scoreData.xpEarned,
            starsAmount: scoreData.starsEarned,
          })
        }
      } else {
        // No match
        sfxService.play('mistake_soft')
        setMistakes((prev) => prev + 1)
        lockBoardRef.current = true
        setTimeout(() => {
          setFlippedCardIds([])
          lockBoardRef.current = false
        }, 1100)
      }
    }
  }

  const handleRestart = () => {
    const newGame = generateMemoryQuestGame(story, difficulty)
    setGame(newGame)
    setFlippedCardIds([])
    setMatchedPairIds(new Set())
    setMoves(0)
    setMistakes(0)
    setStartTime(Date.now())
    setCompletionResult(null)
    lockBoardRef.current = false
    resetActivity()
  }

  const cardGridColumns = useMemo(() => {
    if (game.cards.length <= 6) return 'repeat(auto-fit, minmax(130px, 1fr))'
    if (game.cards.length <= 10) return 'repeat(auto-fit, minmax(120px, 1fr))'
    return 'repeat(auto-fit, minmax(110px, 1fr))'
  }, [game.cards.length])

  return (
    <ActivityShell
      title="Story Memory Quest"
      emoji="🧠"
      tagline="Match the story details, words, and characters from memory!"
      primaryDomain="memory"
      difficulty={difficulty}
      onDifficultyChange={(d) => setDifficulty(d as MemoryDifficulty)}
      supportsDifficulty={true}
      difficultyDisabled={isCompleted || flippedCardIds.length > 0}
      progressInfo={
        isCompleted
          ? 'Quest Completed'
          : `${matchedPairIds.size} of ${game.totalPairs} Pairs`
      }
      isPlayable={game.isPlayable}
      unavailableReason={game.unavailableReason}
    >
      {isCompleted && completionResult ? (
        <RewardCelebration
          title="🌟 Quest Completed!"
          message={`You matched all ${completionResult.totalPairs} pairs in ${completionResult.moves} moves!`}
          accuracy={completionResult.accuracy}
          rewardStatus={rewardStatus}
          statsSummary={[
            { label: 'Moves', value: completionResult.moves },
            { label: 'Mistakes', value: completionResult.mistakes },
            { label: 'Time', value: `${completionResult.durationSeconds}s` },
          ]}
          onPrimaryAction={handleRestart}
          primaryActionLabel="Play Again 🔄"
        />
      ) : (
        <div>
          {/* Active Board Status Info */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              fontSize: '0.92rem',
              color: 'var(--text-muted, #64748b)',
            }}
          >
            <span>
              Pairs: <strong>{matchedPairIds.size}</strong> / {game.totalPairs}
            </span>
            <span>
              Moves: <strong>{moves}</strong>
            </span>
          </div>

          {/* Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: cardGridColumns,
              gap: '0.75rem',
              marginBottom: '1.25rem',
            }}
            role="grid"
            aria-label="Memory cards grid"
          >
            {game.cards.map((card, index) => {
              const isFlipped =
                flippedCardIds.includes(card.id) ||
                matchedPairIds.has(card.pairId)
              const isMatched = matchedPairIds.has(card.pairId)

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleCardClick(card.id, card.pairId)}
                  disabled={isMatched || isFlipped || lockBoardRef.current}
                  aria-label={
                    isFlipped
                      ? `Card ${index + 1}: ${card.text}${isMatched ? ' (Matched)' : ''}`
                      : `Card ${index + 1}: Hidden`
                  }
                  aria-pressed={isFlipped}
                  style={{
                    minHeight: '110px',
                    padding: '0.75rem 0.5rem',
                    borderRadius: '0.75rem',
                    border: isMatched
                      ? '2px solid rgba(34, 197, 94, 0.6)'
                      : isFlipped
                        ? '2px solid var(--accent, #684aff)'
                        : '1.5px solid var(--border, #e2e8f0)',
                    backgroundColor: isMatched
                      ? 'rgba(34, 197, 94, 0.08)'
                      : isFlipped
                        ? 'rgba(104, 74, 255, 0.06)'
                        : 'var(--surface-alt, #f8fafc)',
                    cursor: isMatched ? 'default' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: '0.4rem',
                    font: 'inherit',
                    position: 'relative',
                    transition: 'transform 180ms ease, box-shadow 180ms ease',
                    boxShadow: isFlipped
                      ? '0 4px 12px rgba(104, 74, 255, 0.12)'
                      : 'none',
                    userSelect: 'none',
                  }}
                >
                  {isFlipped ? (
                    <>
                      <span style={{ fontSize: '1.4rem' }}>{card.emoji}</span>
                      <span
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: isMatched
                            ? '#15803d'
                            : 'var(--text-heading, #1e293b)',
                          lineHeight: 1.25,
                        }}
                      >
                        {card.text}
                      </span>
                      {card.secondaryText ? (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            color: 'var(--text-muted, #64748b)',
                          }}
                        >
                          {card.secondaryText}
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <span
                      style={{
                        fontSize: '1.75rem',
                        color: 'var(--accent, #684aff)',
                        opacity: 0.65,
                      }}
                    >
                      ✨
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </ActivityShell>
  )
})
