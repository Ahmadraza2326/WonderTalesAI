import { useState, useMemo } from 'react'
import { PageContainer } from '../components/ui/PageContainer'
import { ParentPinModal } from '../components/parent/ParentPinModal'
import { DiplomaCertificateModal } from '../components/parent/DiplomaCertificateModal'
import { useParentPin } from '../hooks/useParentPin'
import { useChildProfiles } from '../hooks/useChildProfiles'
import { usePlaytimeCurfew } from '../hooks/usePlaytimeCurfew'
import {
  calculateAdventureProgress,
  getAllScienceDossiers,
} from '../services/progressionService'
import { sfxService } from '../services/audio/sfxService'

export function ParentZonePage() {
  const { isUnlocked, isPinSet, lockSession } = useParentPin()
  const { profiles, selectedProfile, selectProfile } = useChildProfiles()
  const activeChild = selectedProfile || (profiles.length > 0 ? profiles[0] : null)

  const {
    settings: curfewSettings,
    status: curfewStatus,
    cognitiveTime,
    updateSettings: updateCurfewSettings,
    grantExtraTime,
    triggerBedtimeWindDown,
  } = usePlaytimeCurfew(activeChild?.id)

  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(!isUnlocked)
  const [pinModalMode, setPinModalMode] = useState<'verify' | 'setup'>('verify')
  const [isDiplomaModalOpen, setIsDiplomaModalOpen] = useState<boolean>(false)
  const [selectedDossierTab, setSelectedDossierTab] = useState<'all' | 'unlocked'>('all')

  // Derive child progress stats
  const childProgress = useMemo(() => {
    return calculateAdventureProgress(activeChild)
  }, [activeChild])

  const scienceDossiers = useMemo(() => {
    return getAllScienceDossiers()
  }, [])

  const filteredDossiers = useMemo(() => {
    if (selectedDossierTab === 'unlocked') {
      return scienceDossiers.filter((d) => d.unlocked)
    }
    return scienceDossiers
  }, [scienceDossiers, selectedDossierTab])

  const handleOpenPinChange = () => {
    sfxService.play('star_pop')
    setPinModalMode('setup')
    setIsPinModalOpen(true)
  }

  const handleLockNow = () => {
    sfxService.play('component_place')
    lockSession()
    setIsPinModalOpen(true)
  }

  // If locked, show security gate backdrop with modal
  if (!isUnlocked) {
    return (
      <PageContainer>
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px 20px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #6c5ce7 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              marginBottom: '20px',
              boxShadow: '0 12px 30px rgba(108, 92, 231, 0.4)',
            }}
          >
            🛡️
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>
            Parent Intelligence Hub
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-muted)',
              maxWidth: '460px',
              marginBottom: '28px',
              lineHeight: 1.5,
            }}
          >
            This area contains cognitive screen-time insights, bedtime curfews, and achievement diploma exports.
          </p>

          <button
            type="button"
            className="button button-primary"
            onClick={() => setIsPinModalOpen(true)}
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              fontWeight: 800,
            }}
          >
            {isPinSet ? '🔑 Enter Parent PIN' : '✨ Set Up Parent PIN'}
          </button>

          <ParentPinModal
            isOpen={isPinModalOpen}
            initialMode={pinModalMode}
            onSuccess={() => setIsPinModalOpen(false)}
            onClose={() => setIsPinModalOpen(false)}
          />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="parent-zone-view" style={{ paddingBottom: '80px' }}>
        {/* Top Hub Navigation Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '32px',
            background: 'var(--surface-card)',
            padding: '20px 24px',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6c5ce7 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                boxShadow: '0 8px 20px rgba(108, 92, 231, 0.3)',
              }}
            >
              👨‍👩‍👧
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 4px' }}>
                Parent Intelligence Hub
              </h1>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Cognitive Screen-Time • Skill Mastery • Bedtime Wind-Down Controls
              </p>
            </div>
          </div>

          {/* Child Switcher & Security Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {profiles.length > 1 && (
              <select
                value={activeChild?.id || ''}
                onChange={(e) => selectProfile(e.target.value)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-alt)',
                  color: 'inherit',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.avatar} {p.name} ({p.age}y)
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={() => setIsDiplomaModalOpen(true)}
              className="button button-primary"
              style={{
                padding: '10px 18px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#1e1b4b',
                border: 'none',
              }}
            >
              🎓 Print / Export Diploma
            </button>

            <button
              type="button"
              onClick={handleOpenPinChange}
              className="button button-secondary"
              style={{ padding: '10px 14px', fontSize: '13px' }}
              title="Change Parent PIN"
            >
              ⚙️ Change PIN
            </button>

            <button
              type="button"
              onClick={handleLockNow}
              className="button button-secondary"
              style={{ padding: '10px 14px', fontSize: '13px' }}
              title="Lock Parent Zone"
            >
              🔒 Lock
            </button>
          </div>
        </div>

        {/* SECTION 1: COGNITIVE SCREEN-TIME & CURFEW METRICS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          {/* Card 1: Today's Playtime & Curfew Budget */}
          <div
            style={{
              background: 'var(--surface-card)',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                DAILY SCREEN-TIME BUDGET
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: curfewStatus.isWindDownActive
                    ? 'rgba(239, 68, 68, 0.15)'
                    : 'rgba(16, 185, 129, 0.15)',
                  color: curfewStatus.isWindDownActive ? '#f87171' : '#34d399',
                }}
              >
                {curfewStatus.isWindDownActive ? '🌙 Wind-Down Active' : '✨ Exploring'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '36px', fontWeight: 900, color: 'var(--accent)' }}>
                {curfewStatus.usedMinutesToday}
              </span>
              <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>
                / {curfewSettings.dailyLimitMinutes > 0 ? `${curfewSettings.dailyLimitMinutes} mins limit` : 'Unlimited'}
              </span>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '10px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${
                    curfewSettings.dailyLimitMinutes > 0
                      ? Math.min(100, (curfewStatus.usedMinutesToday / curfewSettings.dailyLimitMinutes) * 100)
                      : 40
                  }%`,
                  background: curfewStatus.isWindDownActive
                    ? 'linear-gradient(90deg, #f87171, #ef4444)'
                    : 'linear-gradient(90deg, #6c5ce7, #a855f7)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => grantExtraTime(15)}
                className="button button-secondary"
                style={{ flex: 1, padding: '8px 12px', fontSize: '12px', fontWeight: 700 }}
              >
                +15 Mins Bonus
              </button>
              <button
                type="button"
                onClick={triggerBedtimeWindDown}
                className="button button-secondary"
                style={{ flex: 1, padding: '8px 12px', fontSize: '12px', fontWeight: 700 }}
              >
                🌙 Test Bedtime Mode
              </button>
            </div>
          </div>

          {/* Card 2: Cognitive Domain Breakdown */}
          <div
            style={{
              background: 'var(--surface-card)',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '16px' }}>
              COGNITIVE DOMAIN DISTRIBUTION
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: '📖 Story Reading', minutes: cognitiveTime.readingMinutes, color: '#38bdf8' },
                { label: '⚙️ Logic & Physics', minutes: cognitiveTime.logicPhysicsMinutes, color: '#fbbf24' },
                { label: '🧪 Creative Discovery', minutes: cognitiveTime.creativityMinutes, color: '#ec4899' },
                { label: '🔍 Science Dossiers', minutes: cognitiveTime.scienceMinutes, color: '#34d399' },
              ].map((domain) => (
                <div key={domain.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    <span>{domain.label}</span>
                    <span style={{ color: domain.color }}>{domain.minutes} mins</span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, Math.max(5, (domain.minutes / Math.max(1, cognitiveTime.totalMinutes)) * 100))}%`,
                        background: domain.color,
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Curfew & Bedtime Settings Controls */}
          <div
            style={{
              background: 'var(--surface-card)',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '16px' }}>
              PLAYTIME CURFEW SCHEDULE
            </span>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Daily Screen-Time Limit:
              </label>
              <select
                value={curfewSettings.dailyLimitMinutes}
                onChange={(e) => updateCurfewSettings({ dailyLimitMinutes: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-alt)',
                  color: 'inherit',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                <option value={15}>15 minutes / day</option>
                <option value={30}>30 minutes / day</option>
                <option value={45}>45 minutes / day (Recommended)</option>
                <option value={60}>60 minutes / day</option>
                <option value={90}>90 minutes / day</option>
                <option value={0}>Unlimited</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Bedtime Wind-Down Hour:
              </label>
              <select
                value={`${curfewSettings.bedtimeHour}:${curfewSettings.bedtimeMinute}`}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(':').map(Number)
                  updateCurfewSettings({ bedtimeHour: h, bedtimeMinute: m })
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-alt)',
                  color: 'inherit',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                <option value="19:30">7:30 PM (Early Bedtime)</option>
                <option value="20:00">8:00 PM</option>
                <option value="20:30">8:30 PM (Standard Bedtime)</option>
                <option value="21:00">9:00 PM</option>
                <option value="21:30">9:30 PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: DISCIPLINES & STATIONS MASTERY */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '16px' }}>
            Flagship Disciplines &amp; Station Mastery ({activeChild?.name || 'Explorer'})
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              {
                icon: '🧪',
                title: 'Creature Lab',
                stat: `${childProgress.stations.creatureLab.completedCount} / 24 Species`,
                percent: childProgress.stations.creatureLab.masteryPercentage,
                badge: childProgress.stations.creatureLab.badgeLabel,
                color: '#ec4899',
              },
              {
                icon: '⚙️',
                title: 'Magic Machine',
                stat: `${childProgress.stations.magicMachine.completedCount} / 12 Inventions`,
                percent: childProgress.stations.magicMachine.masteryPercentage,
                badge: childProgress.stations.magicMachine.badgeLabel,
                color: '#fbbf24',
              },
              {
                icon: '🔍',
                title: 'Mystery Detective',
                stat: `${childProgress.stations.mysteryDetective.completedCount} / 12 Cases`,
                percent: childProgress.stations.mysteryDetective.masteryPercentage,
                badge: childProgress.stations.mysteryDetective.badgeLabel,
                color: '#38bdf8',
              },
              {
                icon: '⚖️',
                title: 'Potion Market Scales',
                stat: `${childProgress.stations.potionScales.completedCount} / 18 Potions`,
                percent: childProgress.stations.potionScales.masteryPercentage,
                badge: childProgress.stations.potionScales.badgeLabel,
                color: '#34d399',
              },
            ].map((st) => (
              <div
                key={st.title}
                style={{
                  background: 'var(--surface-card)',
                  borderRadius: '20px',
                  padding: '20px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{st.icon}</span>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 2px' }}>{st.title}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {st.stat}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    height: '8px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${st.percent}%`,
                      background: st.color,
                      borderRadius: '9999px',
                    }}
                  />
                </div>

                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 8px',
                    borderRadius: '8px',
                    background: `${st.color}20`,
                    color: st.color,
                  }}
                >
                  {st.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: SCIENCE CODEX DOSSIERS EXPLORER */}
        <div
          style={{
            background: 'var(--surface-card)',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 4px' }}>
                🔬 Science Codex Dossiers ({scienceDossiers.length} Concepts)
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Real scientific principles and phenomena explored through WonderTalesAI mini-games and stories.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSelectedDossierTab('all')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedDossierTab === 'all' ? 'var(--accent)' : 'var(--surface-alt)',
                  color: selectedDossierTab === 'all' ? '#ffffff' : 'var(--text-muted)',
                }}
              >
                All ({scienceDossiers.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedDossierTab('unlocked')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedDossierTab === 'unlocked' ? 'var(--accent)' : 'var(--surface-alt)',
                  color: selectedDossierTab === 'unlocked' ? '#ffffff' : 'var(--text-muted)',
                }}
              >
                Unlocked Only
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '14px',
              maxHeight: '450px',
              overflowY: 'auto',
              paddingRight: '6px',
            }}
          >
            {filteredDossiers.map((dossier) => (
              <div
                key={dossier.id}
                style={{
                  background: 'var(--surface-alt)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span>{dossier.sourceStationIcon}</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
                    {dossier.sourceStationTitle}
                  </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 6px' }}>{dossier.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.4 }}>
                  {dossier.description}
                </p>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--magic-star)',
                    background: 'rgba(251, 191, 36, 0.1)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                  }}
                >
                  💡 Fact: {dossier.funFact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diploma Modal */}
        {activeChild && (
          <DiplomaCertificateModal
            isOpen={isDiplomaModalOpen}
            onClose={() => setIsDiplomaModalOpen(false)}
            childProgress={childProgress}
          />
        )}

        {/* PIN Settings Modal */}
        <ParentPinModal
          isOpen={isPinModalOpen}
          initialMode={pinModalMode}
          onSuccess={() => setIsPinModalOpen(false)}
          onClose={() => setIsPinModalOpen(false)}
        />
      </div>
    </PageContainer>
  )
}
