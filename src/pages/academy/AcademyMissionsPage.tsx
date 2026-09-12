import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getDailyAcademyMissions } from '../../services/academy/missionService'
import { MissionCard } from '../../components/academy/mission/MissionCard'
import { GlassPanel, ParticleField } from '../../components/ui/design'

export const AcademyMissionsPage: React.FC = () => {
  const navigate = useNavigate()
  const missions = getDailyAcademyMissions()

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100%',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 55%, #020617 100%)',
        color: '#ffffff',
        padding: '28px 16px 64px',
        boxSizing: 'border-box',
      }}
    >
      <ParticleField count={30} particleType="stardust" speed={0.4} color="#fbbf24" />

      <div style={{ maxWidth: '840px', width: '100%', margin: '0 auto 24px', zIndex: 1 }}>
        <button
          onClick={() => navigate('/academy')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back to Academy
        </button>

        <GlassPanel
          variant="hero"
          style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>📜</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', color: '#f8fafc' }}>
                Academy Daily Quests & Missions
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#cbd5e1' }}>
                Complete learning tasks to earn bonus Stars and Explorer XP!
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>

      <div style={{ maxWidth: '840px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 1 }}>
        {missions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  )
}
