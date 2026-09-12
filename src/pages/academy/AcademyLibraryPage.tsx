import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { filterLibraryItems } from '../../services/academy/libraryRegistry'
import type { ContentCategory, GradeBand } from '../../types/learningUniverse'
import { GlassPanel, ParticleField, OrbCard } from '../../components/ui/design'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

export const AcademyLibraryPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<GradeBand | 'all'>('all')

  const categories: Array<{ id: ContentCategory | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'All Wonders', icon: '🌌' },
    { id: 'learn', label: 'Lessons', icon: '🏛️' },
    { id: 'books', label: 'Books', icon: '📖' },
    { id: 'create', label: 'Create', icon: '🎨' },
    { id: 'think', label: 'Think Lab', icon: '🧩' },
    { id: 'science', label: 'Science Lab', icon: '🔬' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
  ]

  const gradeBands: Array<{ id: GradeBand | 'all'; label: string }> = [
    { id: 'all', label: 'All Grades' },
    { id: 'pre_k', label: 'Pre-K' },
    { id: 'kindergarten', label: 'Kinder' },
    { id: 'grade_1', label: 'Grade 1' },
    { id: 'grade_2', label: 'Grade 2' },
    { id: 'grade_3', label: 'Grade 3' },
    { id: 'grade_4', label: 'Grade 4' },
    { id: 'grade_5', label: 'Grade 5' },
  ]

  const items = filterLibraryItems({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    gradeBand: selectedGrade === 'all' ? undefined : selectedGrade,
    searchQuery,
  })

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
      <ParticleField count={40} particleType="stardust" speed={0.4} color="#38bdf8" />

      {/* Header Capsule */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 24px', zIndex: 1 }}>
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
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                📚 Universal Content Library
              </span>
              <h1 style={{ margin: '4px 0 0', fontSize: '26px', color: '#f8fafc' }}>
                Explore the Learning Universe
              </h1>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="🔍 Search lessons, books, stories, science..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#f8fafc',
                fontSize: '14px',
                width: '280px',
                maxWidth: '100%',
              }}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  HapticsService.light()
                  sfxService.play('star_pop')
                  setSelectedCategory(cat.id)
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '12px',
                  backgroundColor: selectedCategory === cat.id ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: selectedCategory === cat.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: selectedCategory === cat.id ? '#38bdf8' : '#cbd5e1',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Grade Band Filter Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginRight: '4px' }}>Grade:</span>
            {gradeBands.map((grade) => (
              <button
                key={grade.id}
                onClick={() => {
                  HapticsService.light()
                  sfxService.play('card_flip')
                  setSelectedGrade(grade.id)
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: selectedGrade === grade.id ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.04)',
                  border: selectedGrade === grade.id ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: selectedGrade === grade.id ? '#c084fc' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {grade.label}
              </button>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Library Grid */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            {selectedCategory === 'all' ? 'All Learning Wonders' : selectedCategory.toUpperCase()} ({items.length})
          </h2>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
            <h3>No learning items match your search.</h3>
            <p>Try selecting another category or clearing your search term.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {items.map((item) => (
              <OrbCard
                key={item.id}
                title={item.title}
                subtitle={item.description}
                icon={item.icon}
                badge={`${item.durationMinutes} min • ${item.difficulty}`}
                onClick={() => {
                  HapticsService.medium()
                  sfxService.play('card_flip')
                  navigate(item.route)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
