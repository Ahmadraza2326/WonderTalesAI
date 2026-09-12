import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { AcademySkill } from '../../../types/academy'
import { loadAllSkillProgress } from '../../../services/academy/masteryService'
import { SkillCrystal, GlassPanel } from '../../ui/design'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

interface SkillMapGalaxyProps {
  skills: AcademySkill[]
  title?: string
}

export const SkillMapGalaxy: React.FC<SkillMapGalaxyProps> = ({
  skills,
  title = 'Skill Constellation Galaxy',
}) => {
  const navigate = useNavigate()
  const progressMap = loadAllSkillProgress()

  const handleSkillClick = (skill: AcademySkill) => {
    HapticsService.medium()
    sfxService.play('star_pop')
    navigate(`/academy/skill/${skill.id}`)
  }

  return (
    <GlassPanel
      variant="hero"
      style={{
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🌌</span>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#f8fafc' }}>{title}</h3>
        </div>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
          {skills.length} Interactive Learning Nodes
        </span>
      </div>

      {/* Galaxy Constellation Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        {skills.map((skill) => {
          const prog = progressMap[skill.id]
          const tier = prog?.masteryLevel || 'not_started'

          return (
            <div
              key={skill.id}
              onClick={() => handleSkillClick(skill)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <SkillCrystal tier={tier} size={48} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>
                  {skill.icon} {skill.title}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', textTransform: 'capitalize' }}>
                  {tier.replace('_', ' ')}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </GlassPanel>
  )
}
