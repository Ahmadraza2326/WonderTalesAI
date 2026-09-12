import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProjects } from '../../services/academy/projectService'
import { GlassPanel, ParticleField, MagicalButton } from '../../components/ui/design'
import { GuideCompanionAvatar } from '../../components/academy/guide/GuideCompanionAvatar'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

export const ProjectStudioPage: React.FC = () => {
  const navigate = useNavigate()
  const projects = getAllProjects()
  const [selectedProject, setSelectedProject] = useState(projects[0])

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
      <ParticleField count={40} particleType="stardust" speed={0.4} color="#f59e0b" />

      {/* Header Capsule */}
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto 24px', zIndex: 1 }}>
        <button
          onClick={() => {
            HapticsService.light()
            sfxService.play('card_flip')
            navigate('/academy')
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back to Academy Home
        </button>

        <GlassPanel
          variant="hero"
          style={{
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
              🚀 Project Studio • Multi-Skill Capstones
            </span>
            <h1 style={{ margin: '4px 0 0', fontSize: '26px', color: '#f8fafc' }}>
              Cross-Disciplinary Creation Projects
            </h1>
          </div>
          <GuideCompanionAvatar guideId="davinci" emotion="celebrating" size={56} />
        </GlassPanel>
      </div>

      {/* Project Selector & Milestone Checklist */}
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', zIndex: 1 }}>
        {/* Left: Available Projects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Master Projects ({projects.length})
          </h2>

          {projects.map((proj) => {
            const isSelected = selectedProject?.id === proj.id
            const completedCount = proj.milestones.filter((m) => m.isCompleted).length
            return (
              <div
                key={proj.id}
                onClick={() => {
                  HapticsService.light()
                  sfxService.play('card_flip')
                  setSelectedProject(proj)
                }}
                style={{
                  padding: '18px',
                  borderRadius: '16px',
                  backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '36px' }}>{proj.coverIcon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc' }}>{proj.title}</h3>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    {completedCount}/{proj.milestones.length} Milestones Completed • ⭐ +{proj.rewardStars} Stars
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: Milestone Workspace */}
        {selectedProject && (
          <GlassPanel
            variant="elevated"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>{selectedProject.coverIcon}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>{selectedProject.title}</h3>
                <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 800 }}>
                  🏆 Reward: {selectedProject.badgeTitle} (+{selectedProject.rewardXP} XP)
                </span>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5 }}>
              {selectedProject.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>
                Project Milestones:
              </h4>

              {selectedProject.milestones.map((ms) => (
                <div
                  key={ms.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: ms.isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                    border: ms.isCompleted ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: ms.isCompleted ? '#10b981' : '#f8fafc' }}>
                      {ms.isCompleted ? '✅' : '⏳'} {ms.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      {ms.taskDescription}
                    </div>
                  </div>

                  {ms.route && !ms.isCompleted && (
                    <MagicalButton
                      variant="cosmic"
                      size="sm"
                      onClick={() => {
                        HapticsService.medium()
                        sfxService.play('star_pop')
                        navigate(ms.route!)
                      }}
                    >
                      Start Step ➡️
                    </MagicalButton>
                  )}
                </div>
              ))}
            </div>
          </GlassPanel>
        )}
      </div>
    </div>
  )
}
