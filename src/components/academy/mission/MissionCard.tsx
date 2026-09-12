import React from 'react'
import type { AcademyMission } from '../../../types/academy'
import { GlassPanel } from '../../ui/design'

interface MissionCardProps {
  mission: AcademyMission
  onClaimReward?: (missionId: string) => void
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onClaimReward }) => {
  return (
    <GlassPanel
      variant="elevated"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        borderRadius: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            {mission.badgeIcon}
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#f8fafc' }}>
              {mission.title}
            </h4>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#cbd5e1' }}>
              {mission.description}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8' }}>
            +{mission.xpReward} XP
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24' }}>
            +{mission.starsReward} ⭐
          </span>
        </div>
      </div>

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {mission.tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: task.completed ? '#10b981' : '#94a3b8' }}>
                {task.completed ? '✅' : '⚪'}
              </span>
              <span style={{ fontSize: '13px', color: '#e2e8f0' }}>{task.label}</span>
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {task.currentCount} / {task.targetCount}
            </span>
          </div>
        ))}
      </div>

      {mission.isCompleted && onClaimReward && (
        <button
          onClick={() => onClaimReward(mission.id)}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Claim Reward ✨
        </button>
      )}
    </GlassPanel>
  )
}
