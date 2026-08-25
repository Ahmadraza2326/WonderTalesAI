import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChildAdventureProgress, ScienceDossier } from '../../services/progressionService'
import { getAllScienceDossiers } from '../../services/progressionService'
import { sfxService } from '../../services/audio/sfxService'

interface ChildAdventurePassportProps {
  progress: ChildAdventureProgress
  onClose?: () => void
}

type PassportTab = 'showcase' | 'radar' | 'codex'

export const ChildAdventurePassport: React.FC<ChildAdventurePassportProps> = ({
  progress,
  onClose,
}) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<PassportTab>('showcase')
  const [codexFilter, setCodexFilter] = useState<'all' | 'unlocked' | 'creature_lab' | 'magic_machine' | 'mystery_detective' | 'potion_scales'>('all')
  const [selectedDossier, setSelectedDossier] = useState<ScienceDossier | null>(null)

  const {
    childName,
    avatar,
    xp,
    stars,
    currentStreak,
    level,
    explorerTitle,
    stations,
    cognitiveDomainScores,
    unlockedScienceDossiersCount,
    overallProgressPercentage,
  } = progress

  // Extract all 66 science dossiers
  const allDossiers = getAllScienceDossiers({
    creatureDiscoveriesCount: stations.creatureLab.completedCount,
    machineCompletedCount: stations.magicMachine.completedCount,
    detectiveSolvedCount: stations.mysteryDetective.completedCount,
    potionBrewedCount: stations.potionScales.completedCount,
  })

  const filteredDossiers = allDossiers.filter((d) => {
    if (codexFilter === 'all') return true
    if (codexFilter === 'unlocked') return d.unlocked
    return d.sourceStationId === codexFilter
  })

  const handleTabSwitch = (tab: PassportTab) => {
    sfxService.play('card_flip')
    setActiveTab(tab)
  }

  // Calculate Radar Polygon Points
  const domainKeys = Object.keys(cognitiveDomainScores) as Array<keyof typeof cognitiveDomainScores>
  const totalDomains = domainKeys.length
  const radarRadius = 90
  const centerCoord = 110

  const radarPoints = domainKeys
    .map((key, index) => {
      const angle = (Math.PI * 2 / totalDomains) * index - Math.PI / 2
      const score = cognitiveDomainScores[key]?.xp || 10
      // Scale from 0 to 400 XP normalized to radius
      const normalized = Math.min(1, Math.max(0.2, score / 300))
      const r = normalized * radarRadius
      const x = centerCoord + r * Math.cos(angle)
      const y = centerCoord + r * Math.sin(angle)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
        borderRadius: '24px',
        border: '2px solid rgba(168, 85, 247, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        color: '#ffffff',
      }}
      aria-label="Child Adventure Passport"
    >
      {/* 1. Passport Header & Golden Explorer Crest */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4338ca 0%, #312e81 50%, #1e1b4b 100%)',
          padding: '28px 24px',
          position: 'relative',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close passport"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '9999px',
              width: '36px',
              height: '36px',
              color: '#ffffff',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Avatar Seal */}
          <div
            className="animate-float"
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.45)',
              border: '3px solid rgba(255, 255, 255, 0.4)',
            }}
          >
            {avatar}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span
                style={{
                  background: '#fbbf24',
                  color: '#1e1b4b',
                  fontSize: '12px',
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                }}
              >
                ★ LEVEL {level} EXPLORER
              </span>
              <span style={{ fontSize: '13px', color: '#c084fc', fontWeight: 700 }}>
                ORBis Official Passport
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#f8fafc',
              }}
            >
              {childName}&apos;s Adventure Passport
            </h1>

            <p
              style={{
                margin: '4px 0 0',
                fontSize: '16px',
                fontWeight: 700,
                color: '#fbbf24',
              }}
            >
              {explorerTitle}
            </p>
          </div>

          {/* Core Metrics Capsules */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '10px 16px',
                borderRadius: '16px',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#c084fc' }}>⚡ {xp}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Total XP</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '10px 16px',
                borderRadius: '16px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#fbbf24' }}>⭐ {stars}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Total Stars</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '10px 16px',
                borderRadius: '16px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#f87171' }}>🔥 {currentStreak}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Day Streak</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '10px 16px',
                borderRadius: '16px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#60a5fa' }}>🧭 {overallProgressPercentage}%</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>World Mastered</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '0 20px',
          gap: '8px',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => handleTabSwitch('showcase')}
          style={{
            padding: '16px 20px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'showcase' ? '#fbbf24' : '#94a3b8',
            fontSize: '15px',
            fontWeight: 800,
            borderBottom: activeTab === 'showcase' ? '3px solid #fbbf24' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          <span>🏆</span>
          <span>Station Masteries</span>
        </button>

        <button
          onClick={() => handleTabSwitch('radar')}
          style={{
            padding: '16px 20px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'radar' ? '#a855f7' : '#94a3b8',
            fontSize: '15px',
            fontWeight: 800,
            borderBottom: activeTab === 'radar' ? '3px solid #a855f7' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          <span>🧠</span>
          <span>Brain Skill Radar</span>
        </button>

        <button
          onClick={() => handleTabSwitch('codex')}
          style={{
            padding: '16px 20px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'codex' ? '#06b6d4' : '#94a3b8',
            fontSize: '15px',
            fontWeight: 800,
            borderBottom: activeTab === 'codex' ? '3px solid #06b6d4' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          <span>🔬</span>
          <span>Science Codex ({unlockedScienceDossiersCount}/66)</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      <div style={{ padding: '24px' }}>
        {/* TAB 1: STATION MASTERIES */}
        {activeTab === 'showcase' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '18px',
            }}
          >
            {/* Creature Lab */}
            <StationMiniCard
              icon="🧪"
              title="Creature Lab"
              subtitle="Almanac of Wonder"
              completed={stations.creatureLab.completedCount}
              total={stations.creatureLab.totalAvailable}
              percentage={stations.creatureLab.masteryPercentage}
              badge={stations.creatureLab.badgeLabel}
              color="linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)"
              accent="#ec4899"
              onLaunch={() => navigate('/games/creature-lab')}
            />

            {/* Magic Machine Lab */}
            <StationMiniCard
              icon="⚙️"
              title="Magic Machine Lab"
              subtitle="Physics Workshop"
              completed={stations.magicMachine.completedCount}
              total={stations.magicMachine.totalAvailable}
              percentage={stations.magicMachine.masteryPercentage}
              badge={stations.magicMachine.badgeLabel}
              color="linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)"
              accent="#06b6d4"
              onLaunch={() => navigate('/playroom/magic-machine')}
            />

            {/* Mystery Detective */}
            <StationMiniCard
              icon="🔍"
              title="Mystery Detective"
              subtitle="Deduction Agency"
              completed={stations.mysteryDetective.completedCount}
              total={stations.mysteryDetective.totalAvailable}
              percentage={stations.mysteryDetective.masteryPercentage}
              badge={stations.mysteryDetective.badgeLabel}
              color="linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
              accent="#a855f7"
              onLaunch={() => navigate('/playroom/mystery-detective')}
            />

            {/* Potion Market Scales */}
            <StationMiniCard
              icon="⚖️"
              title="Potion Market Scales"
              subtitle="Apothecary Shop"
              completed={stations.potionScales.completedCount}
              total={stations.potionScales.totalAvailable}
              percentage={stations.potionScales.masteryPercentage}
              badge={stations.potionScales.badgeLabel}
              color="linear-gradient(135deg, #064e3b 0%, #0d9488 100%)"
              accent="#10b981"
              onLaunch={() => navigate('/playroom/potion-scales')}
            />
          </div>
        )}

        {/* TAB 2: BRAIN SKILL RADAR */}
        {activeTab === 'radar' && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '32px',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 0',
            }}
          >
            {/* SVG Radar Chart */}
            <div
              style={{
                width: '260px',
                height: '260px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="220" height="220" viewBox="0 0 220 220" style={{ overflow: 'visible' }}>
                {/* Background Concentric Rings */}
                {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                  <circle
                    key={i}
                    cx={centerCoord}
                    cy={centerCoord}
                    r={radarRadius * scale}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeDasharray={scale === 1 ? 'none' : '3 3'}
                  />
                ))}

                {/* Spoke Axes */}
                {domainKeys.map((_, i) => {
                  const angle = (Math.PI * 2 / totalDomains) * i - Math.PI / 2
                  const x2 = centerCoord + radarRadius * Math.cos(angle)
                  const y2 = centerCoord + radarRadius * Math.sin(angle)
                  return (
                    <line
                      key={i}
                      x1={centerCoord}
                      y1={centerCoord}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(255, 255, 255, 0.15)"
                    />
                  )
                })}

                {/* Radar Fill Area */}
                <polygon
                  points={radarPoints}
                  fill="rgba(168, 85, 247, 0.35)"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                />

                {/* Radar Vertex Dots */}
                {radarPoints.split(' ').map((point, i) => {
                  const [px, py] = point.split(',').map(Number)
                  return (
                    <circle
                      key={i}
                      cx={px}
                      cy={py}
                      r="4.5"
                      fill="#fbbf24"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  )
                })}
              </svg>
            </div>

            {/* Cognitive Domain Breakdown List */}
            <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {domainKeys.map((key) => {
                const domain = cognitiveDomainScores[key]
                return (
                  <div
                    key={key}
                    style={{
                      background: 'rgba(30, 41, 59, 0.6)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>
                        {domain.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Level {domain.level} Mastery ({domain.xp} XP)
                      </div>
                    </div>

                    <span
                      style={{
                        background: 'rgba(168, 85, 247, 0.2)',
                        color: '#c084fc',
                        fontWeight: 800,
                        fontSize: '12px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                      }}
                    >
                      ★ Lvl {domain.level}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SCIENCE OF WONDER CODEX */}
        {activeTab === 'codex' && (
          <div>
            {/* Filter Pills */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                marginBottom: '20px',
                paddingBottom: '4px',
              }}
            >
              {[
                { id: 'all', label: 'All Dossiers (66)' },
                { id: 'unlocked', label: `Unlocked Only (${unlockedScienceDossiersCount})` },
                { id: 'creature_lab', label: '🧪 Biology (24)' },
                { id: 'magic_machine', label: '⚙️ Physics (12)' },
                { id: 'mystery_detective', label: '🔍 Forensic (12)' },
                { id: 'potion_scales', label: '⚖️ Math & Mass (18)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    sfxService.play('card_flip')
                    setCodexFilter(f.id as typeof codexFilter)
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: codexFilter === f.id ? '2px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: codexFilter === f.id ? 'rgba(6, 182, 212, 0.25)' : 'rgba(30, 41, 59, 0.4)',
                    color: codexFilter === f.id ? '#ffffff' : '#94a3b8',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Dossier Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '14px',
                maxHeight: '440px',
                overflowY: 'auto',
                paddingRight: '6px',
              }}
            >
              {filteredDossiers.map((dossier) => (
                <div
                  key={dossier.id}
                  onClick={() => {
                    if (dossier.unlocked) {
                      sfxService.play('star_pop')
                      setSelectedDossier(dossier)
                    }
                  }}
                  style={{
                    background: dossier.unlocked
                      ? 'rgba(30, 41, 59, 0.7)'
                      : 'rgba(15, 23, 42, 0.4)',
                    borderRadius: '14px',
                    padding: '16px',
                    border: dossier.unlocked
                      ? '1px solid rgba(6, 182, 212, 0.35)'
                      : '1px dashed rgba(148, 163, 184, 0.2)',
                    opacity: dossier.unlocked ? 1 : 0.6,
                    cursor: dossier.unlocked ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{dossier.unlocked ? dossier.sourceStationIcon : '🔒'}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: dossier.unlocked ? '#06b6d4' : '#64748b',
                        background: 'rgba(15, 23, 42, 0.6)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {dossier.sourceStationTitle}
                    </span>
                  </div>

                  <h4
                    style={{
                      margin: '0 0 4px',
                      fontSize: '15px',
                      fontWeight: 800,
                      color: dossier.unlocked ? '#f8fafc' : '#64748b',
                    }}
                  >
                    {dossier.unlocked ? dossier.title : 'Undiscovered Concept'}
                  </h4>

                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: dossier.unlocked ? '#94a3b8' : '#475569',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {dossier.unlocked
                      ? dossier.description
                      : 'Play station games to unlock this Science of Wonder insight.'}
                  </p>
                </div>
              ))}
            </div>

            {/* Dossier Detail Modal Popup */}
            {selectedDossier && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  padding: '16px',
                }}
                onClick={() => setSelectedDossier(null)}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                    maxWidth: '480px',
                    width: '100%',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '2px solid #06b6d4',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                    color: '#ffffff',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '24px' }}>{selectedDossier.sourceStationIcon}</span>
                      <span style={{ fontSize: '13px', color: '#06b6d4', fontWeight: 800, textTransform: 'uppercase' }}>
                        {selectedDossier.sourceStationTitle} Codex
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedDossier(null)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        fontSize: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <h3 style={{ margin: '0 0 10px', fontSize: '22px', fontWeight: 900, color: '#f8fafc' }}>
                    {selectedDossier.title}
                  </h3>

                  <p style={{ margin: '0 0 16px', fontSize: '14px', lineHeight: 1.6, color: '#cbd5e1' }}>
                    {selectedDossier.description}
                  </p>

                  <div
                    style={{
                      background: 'rgba(6, 182, 212, 0.15)',
                      borderRadius: '12px',
                      padding: '14px',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#22d3ee', marginBottom: '4px' }}>
                      💡 SCIENCE FUN FACT
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: '#e2e8f0' }}>
                      {selectedDossier.funFact}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Mini Station Mastery Card for Passport Showcase Tab
 */
interface StationMiniCardProps {
  icon: string
  title: string
  subtitle: string
  completed: number
  total: number
  percentage: number
  badge: string
  color: string
  accent: string
  onLaunch: () => void
}

const StationMiniCard: React.FC<StationMiniCardProps> = ({
  icon,
  title,
  subtitle,
  completed,
  total,
  percentage,
  badge,
  color,
  accent,
  onLaunch,
}) => {
  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.5)',
        borderRadius: '18px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ background: color, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#fbbf24',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '3px 8px',
            borderRadius: '6px',
          }}
        >
          {badge}
        </span>
      </div>

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: 800, color: '#f8fafc' }}>
            {title}
          </h4>
          <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#94a3b8' }}>
            {subtitle}
          </p>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
              <span>Progress</span>
              <span>{completed}/{total} ({percentage}%)</span>
            </div>
            <div style={{ width: '100%', height: '6px', borderRadius: '9999px', background: 'rgba(15, 23, 42, 0.8)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  borderRadius: '9999px',
                  background: accent,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={onLaunch}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: 'rgba(51, 65, 85, 0.7)',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          Play Station ➔
        </button>
      </div>
    </div>
  )
}
