import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChildAdventureProgress } from '../../services/progressionService'
import { sfxService } from '../../services/audio/sfxService'

export interface OverworldNode {
  id: string
  title: string
  subtitle: string
  icon: string
  route: string
  biome: 'canopy' | 'valley' | 'woods' | 'hills' | 'citadel'
  requiredLevel: number
  requiredXp: number
  starsReward: number
  description: string
}

export const OVERWORLD_NODES: OverworldNode[] = [
  {
    id: 'node_1_story_grove',
    title: 'The Grove of Beginnings',
    subtitle: 'Where every legend starts',
    icon: '✨',
    route: '/stories/new',
    biome: 'canopy',
    requiredLevel: 1,
    requiredXp: 0,
    starsReward: 5,
    description: 'Craft your very first personalized fairy tale with AI illustrations & sound!',
  },
  {
    id: 'node_2_creature_lab',
    title: 'Alchemist Cauldron Gate',
    subtitle: 'Creature Lab Station',
    icon: '🧪',
    route: '/games/creature-lab',
    biome: 'canopy',
    requiredLevel: 1,
    requiredXp: 20,
    starsReward: 10,
    description: 'Combine elemental essences to hatch mythical starlight dragons & sprites!',
  },
  {
    id: 'node_sanctuary',
    title: 'The Living Sanctuary',
    subtitle: 'Creature Habitat & Nursery',
    icon: '🐾',
    route: '/sanctuary',
    biome: 'canopy',
    requiredLevel: 1,
    requiredXp: 30,
    starsReward: 15,
    description: 'Pet, feed elemental treats, and bond with all your hatched starlight companions!',
  },
  {
    id: 'node_3_clockwork_valley',
    title: 'Gears of Momentum',
    subtitle: 'Magic Machine Lab',
    icon: '⚙️',
    route: '/playroom/magic-machine',
    biome: 'valley',
    requiredLevel: 2,
    requiredXp: 50,
    starsReward: 15,
    description: 'Position bouncy springs, ramps, and magnetic pullers to guide the Sproutlings home!',
  },
  {
    id: 'node_4_contraption_peak',
    title: 'Springboard Pass',
    subtitle: 'Advanced Physics Rigs',
    icon: '🚀',
    route: '/playroom/magic-machine',
    biome: 'valley',
    requiredLevel: 2,
    requiredXp: 100,
    starsReward: 20,
    description: 'Master elastic potential energy and low gravity launchers!',
  },
  {
    id: 'node_5_detective_woods',
    title: 'Misty Lantern Crossing',
    subtitle: 'Mystery Detective Station',
    icon: '🔍',
    route: '/playroom/mystery-detective',
    biome: 'woods',
    requiredLevel: 3,
    requiredXp: 150,
    starsReward: 25,
    description: 'Inspect paw prints and cross-examine witnesses with your detective lens!',
  },
  {
    id: 'node_6_hidden_archive',
    title: 'The Whispering Archives',
    subtitle: 'Forensic Logic Puzzles',
    icon: '📜',
    route: '/playroom/mystery-detective',
    biome: 'woods',
    requiredLevel: 3,
    requiredXp: 220,
    starsReward: 30,
    description: 'Solve forensic toolmark puzzles and decode hidden ultraviolet clues!',
  },
  {
    id: 'node_7_apothecary_hills',
    title: 'Bazaar Scales Market',
    subtitle: 'Potion Market Scales',
    icon: '⚖️',
    route: '/playroom/potion-scales',
    biome: 'hills',
    requiredLevel: 4,
    requiredXp: 300,
    starsReward: 35,
    description: 'Balance dragon fire tonics and ocean salves using precision brass gram weights!',
  },
  {
    id: 'node_8_golden_crucible',
    title: 'The Golden Crucible',
    subtitle: 'Master Apothecary Rushes',
    icon: '🏺',
    route: '/playroom/potion-scales',
    biome: 'hills',
    requiredLevel: 4,
    requiredXp: 400,
    starsReward: 40,
    description: 'Solve multi-scale algebraic weight riddles in record time!',
  },
  {
    id: 'node_9_celestial_summit',
    title: 'Observatory Summit',
    subtitle: 'Playroom World Observatory',
    icon: '🪐',
    route: '/games',
    biome: 'citadel',
    requiredLevel: 5,
    requiredXp: 500,
    starsReward: 50,
    description: 'Explore the infinite daily procedural challenge horizons across all galaxies!',
  },
  {
    id: 'node_10_cosmic_horizon',
    title: 'The Cosmic Horizon',
    subtitle: 'Adventure Passport Codex',
    icon: '👑',
    route: '/passport',
    biome: 'citadel',
    requiredLevel: 6,
    requiredXp: 750,
    starsReward: 100,
    description: 'Review your 66 Science of Wonder Dossiers & Grand Master Brain Radar!',
  },
]

const BIOME_DETAILS: Record<OverworldNode['biome'], { title: string; subtitle: string; color: string; gradient: string }> = {
  canopy: {
    title: 'Starlight Canopy',
    subtitle: 'Level 1 Realm • Biology & Alchemy Grove',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #831843 0%, #be185d 50%, #ec4899 100%)',
  },
  valley: {
    title: 'Clockwork Valley',
    subtitle: 'Level 2 Realm • Physics & Contraption Springs',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #164e63 0%, #0891b2 50%, #06b6d4 100%)',
  },
  woods: {
    title: 'Detective Woods',
    subtitle: 'Level 3 Realm • Deduction & Lantern Mysteries',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #3b0764 0%, #7e22ce 50%, #a855f7 100%)',
  },
  hills: {
    title: 'Apothecary Hills',
    subtitle: 'Level 4 Realm • Precision Scales & Balances',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)',
  },
  citadel: {
    title: 'Celestial Citadel',
    subtitle: 'Level 5+ Realm • Grandmaster Starlight Summit',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)',
  },
}

interface OverworldJourneyMapProps {
  adventureProgress?: ChildAdventureProgress
}

export const OverworldJourneyMap: React.FC<OverworldJourneyMapProps> = ({ adventureProgress }) => {
  const navigate = useNavigate()
  const [selectedNode, setSelectedNode] = useState<OverworldNode | null>(null)

  const childName = adventureProgress?.childName || 'Explorer'
  const childAvatar = adventureProgress?.avatar || '🦉'
  const xp = adventureProgress?.xp || 0
  const stars = adventureProgress?.stars || 10
  const level = adventureProgress?.level || 1
  const title = adventureProgress?.explorerTitle || 'Novice Star-Seeker'

  // Determine which node is currently active (first unlocked but not passed)
  const activeNodeIndex = OVERWORLD_NODES.findIndex((n) => xp < n.requiredXp)
  const currentNodeIndex = activeNodeIndex === -1 ? OVERWORLD_NODES.length - 1 : Math.max(0, activeNodeIndex - 1)

  const handleNodeClick = (node: OverworldNode, isUnlocked: boolean) => {
    if (isUnlocked) {
      sfxService.play('star_pop')
      setSelectedNode(node)
    } else {
      sfxService.play('card_flip')
      setSelectedNode(node)
    }
  }

  const handleLaunchActivity = (route: string) => {
    sfxService.play('star_pop')
    navigate(route)
  }

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '24px 16px 60px',
        color: '#ffffff',
      }}
    >
      {/* Overworld Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)',
          borderRadius: '24px',
          padding: '28px',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(168, 85, 247, 0.2)',
          marginBottom: '36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            className="animate-float"
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '38px',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.45)',
              border: '3px solid rgba(255, 255, 255, 0.4)',
            }}
          >
            {childAvatar}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span
                style={{
                  background: '#fbbf24',
                  color: '#1e1b4b',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                }}
              >
                ★ LEVEL {level}
              </span>
              <span style={{ fontSize: '13px', color: '#c084fc', fontWeight: 800 }}>
                {title}
              </span>
            </div>
            <h1 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 900, color: '#f8fafc' }}>
              {childName}&apos;s Overworld Adventure Map
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
              Follow the celestial trail across all 5 magical realms!
            </p>
          </div>
        </div>

        {/* Metrics Capsules */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              padding: '10px 16px',
              borderRadius: '16px',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '20px' }}>⭐</span>
            <div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800 }}>STARS</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#fbbf24' }}>{stars}</div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              padding: '10px 16px',
              borderRadius: '16px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '20px' }}>⚡</span>
            <div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800 }}>EXPLORER XP</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#c084fc' }}>{xp} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sinuous Adventure Trail Nodes */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {OVERWORLD_NODES.map((node, index) => {
          const isUnlocked = xp >= node.requiredXp
          const isCurrent = index === currentNodeIndex
          const biomeInfo = BIOME_DETAILS[node.biome]
          const isEven = index % 2 === 0

          return (
            <div
              key={node.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isEven ? 'flex-start' : 'flex-end',
                position: 'relative',
              }}
            >
              {/* Stepping Card */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleNodeClick(node, isUnlocked)}
                style={{
                  background: isUnlocked
                    ? 'rgba(15, 23, 42, 0.85)'
                    : 'rgba(15, 23, 42, 0.45)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '20px',
                  padding: '18px 22px',
                  maxWidth: '460px',
                  width: '100%',
                  border: isCurrent
                    ? '2px solid #fbbf24'
                    : isUnlocked
                    ? `1px solid ${biomeInfo.color}`
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isCurrent
                    ? '0 0 24px rgba(251, 191, 36, 0.4)'
                    : isUnlocked
                    ? `0 8px 24px rgba(0, 0, 0, 0.3)`
                    : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  opacity: isUnlocked ? 1 : 0.65,
                }}
              >
                {/* Node Icon Circle */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '18px',
                    background: isUnlocked ? biomeInfo.gradient : 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    boxShadow: isUnlocked ? '0 4px 14px rgba(0,0,0,0.3)' : 'none',
                    position: 'relative',
                  }}
                >
                  {isUnlocked ? node.icon : '🔒'}
                  {isCurrent && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#fbbf24',
                        color: '#0f172a',
                        fontSize: '10px',
                        fontWeight: 900,
                        padding: '2px 6px',
                        borderRadius: '9999px',
                      }}
                    >
                      YOU
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: biomeInfo.color,
                      }}
                    >
                      {biomeInfo.title}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>• Milestone #{index + 1}</span>
                  </div>

                  <h3 style={{ margin: '0 0 2px', fontSize: '17px', fontWeight: 900, color: '#f8fafc' }}>
                    {node.title}
                  </h3>

                  <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1' }}>
                    {isUnlocked ? node.subtitle : `Unlocks at ${node.requiredXp} XP (Level ${node.requiredLevel})`}
                  </p>
                </div>

                {/* Status Indicator */}
                <div>
                  {isUnlocked ? (
                    <span
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                        fontSize: '12px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                      }}
                    >
                      +{node.starsReward}⭐
                    </span>
                  ) : (
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#94a3b8',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '9999px',
                      }}
                    >
                      Lvl {node.requiredLevel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Node Detail Launch Modal */}
      {selectedNode && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setSelectedNode(null)}
        >
          <div
            style={{
              background: '#0f172a',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '460px',
              width: '100%',
              border: `2px solid ${BIOME_DETAILS[selectedNode.biome].color}`,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
              color: '#ffffff',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span
                style={{
                  fontSize: '11px',
                  color: BIOME_DETAILS[selectedNode.biome].color,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}
              >
                {BIOME_DETAILS[selectedNode.biome].title}
              </span>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: BIOME_DETAILS[selectedNode.biome].gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                }}
              >
                {selectedNode.icon}
              </div>

              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: '20px', fontWeight: 900, color: '#f8fafc' }}>
                  {selectedNode.title}
                </h3>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{selectedNode.subtitle}</div>
              </div>
            </div>

            <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5 }}>
              {selectedNode.description}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              {xp >= selectedNode.requiredXp ? (
                <button
                  type="button"
                  onClick={() => handleLaunchActivity(selectedNode.route)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: BIOME_DETAILS[selectedNode.biome].gradient,
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  }}
                >
                  Enter Station ➔
                </button>
              ) : (
                <div
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#94a3b8',
                    fontWeight: 800,
                    textAlign: 'center',
                    fontSize: '13px',
                  }}
                >
                  🔒 Reach {selectedNode.requiredXp} XP to Unlock
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
