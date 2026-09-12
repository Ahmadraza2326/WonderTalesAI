import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GlassPanel, MagicalButton, ParticleField, WorldPortal, OrbCard } from '../components/ui/design'
import { sfxService } from '../services/audio/sfxService'
import { HapticsService } from '../services/hapticsService'

export function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleStartAdventure = () => {
    HapticsService.medium()
    sfxService.play('star_pop')
    if (user) {
      navigate('/academy')
    } else {
      navigate('/auth')
    }
  }

  const flagshipRealms = [
    { id: 'math', title: 'Citadel of Stars', domain: 'Math & Logic', icon: '🌌', gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#38bdf8' },
    { id: 'science', title: 'Living Biome Lab', domain: 'Physical & Life Science', icon: '🌿', gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)', color: '#10b981' },
    { id: 'reading', title: 'Infinite Library', domain: 'Phonics & Literacy', icon: '📜', gradient: 'linear-gradient(135deg, #451a03 0%, #b45309 100%)', color: '#fbbf24' },
    { id: 'cs', title: 'Clockwork Forge', domain: 'Algorithms & Coding', icon: '⚡', gradient: 'linear-gradient(135deg, #312e81 0%, #7c3aed 100%)', color: '#a855f7' },
  ]

  const flagshipGames = [
    { title: 'Invention Lab', subtitle: 'Structural Bridge Engineering', icon: '🌉', route: '/games/invention-lab' },
    { title: 'Creature Lab Alchemist', subtitle: 'Elemental Starlight Alchemy', icon: '🧪', route: '/games/creature-lab' },
    { title: 'RoboPath Academy', subtitle: 'Loop Algorithms & Spatial Grid', icon: '🤖', route: '/games/robopath' },
    { title: 'Potion Scales', subtitle: 'Mass & Algebraic Equilibrium', icon: '⚖️', route: '/games/potion-scales' },
  ]

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
        color: '#ffffff',
        padding: '24px 16px 80px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      aria-label="ORBis Cosmic Universe Home"
    >
      <ParticleField count={45} particleType="stardust" speed={0.35} color="#38bdf8" />

      {/* Hero Cosmic Showcase */}
      <section style={{ maxWidth: '1180px', width: '100%', margin: '0 auto 40px', zIndex: 1 }}>
        <GlassPanel
          variant="hero"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '48px 24px',
            gap: '20px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 900,
                color: '#38bdf8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: 'rgba(56, 189, 248, 0.15)',
                padding: '4px 12px',
                borderRadius: '9999px',
                border: '1px solid rgba(56, 189, 248, 0.35)',
              }}
            >
              🪐 The International Children's Learning Universe
            </span>
          </div>

          <h1
            style={{
              margin: '0',
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 900,
              color: '#f8fafc',
              lineHeight: 1.15,
              maxWidth: '820px',
              letterSpacing: '-0.02em',
            }}
          >
            Where Children Learn, Create, and Play in a Living Magical World
          </h1>

          <p
            style={{
              margin: '0',
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: '#cbd5e1',
              maxWidth: '680px',
              lineHeight: 1.6,
            }}
          >
            Explore 10 living academic realms, craft AI-illustrated storybooks, master 10 flagship brain games, and level up your cosmic explorer passport with friendly mascot companions.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
            <MagicalButton variant="cosmic" size="lg" onClick={handleStartAdventure}>
              🚀 Start Adventure
            </MagicalButton>
            <MagicalButton variant="secondary" size="lg" onClick={() => navigate('/games')}>
              🪐 Playroom Games
            </MagicalButton>
            <MagicalButton variant="ghost" size="lg" onClick={() => navigate('/stories/new')}>
              ✨ Craft a Story
            </MagicalButton>
          </div>

          {/* Quick Mascot Companion Preview */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '16px',
              padding: '10px 20px',
              background: 'rgba(15, 23, 42, 0.65)',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '13px',
              color: '#e2e8f0',
              fontWeight: 700,
            }}
          >
            <span>Friendly Guides:</span>
            <span>🦉 Poly (Math)</span>
            <span>🦊 Lexi (Reading)</span>
            <span>🦦 Newton (Science)</span>
            <span>🤖 BEEP-0 (Coding)</span>
          </div>
        </GlassPanel>
      </section>

      {/* Section 1: 🏛️ Academic Realms Showcase */}
      <section style={{ maxWidth: '1180px', width: '100%', margin: '0 auto 48px', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Pedagogical Universes
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#f8fafc', margin: '4px 0 0' }}>
              🏛️ 10 Core Academic Realms
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/academy')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#38bdf8',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Enter Academy ➔</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {flagshipRealms.map((realm) => (
            <WorldPortal
              key={realm.id}
              title={realm.title}
              subtitle={realm.domain}
              icon={realm.icon}
              themeGradient={realm.gradient}
              glowColor={realm.color}
              badgeText="Interactive World"
              onClick={() => {
                HapticsService.light()
                sfxService.play('card_flip')
                navigate(`/academy/subject/${realm.id === 'cs' ? 'computer_science' : realm.id}`)
              }}
            />
          ))}
        </div>
      </section>

      {/* Section 2: 🪐 Flagship Cognitive Games */}
      <section style={{ maxWidth: '1180px', width: '100%', margin: '0 auto 48px', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Brain Development & Simulation
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#f8fafc', margin: '4px 0 0' }}>
              🪐 10 Canonical Flagship Games
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/games')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a855f7',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>View All 10 Games ➔</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          {flagshipGames.map((game) => (
            <OrbCard
              key={game.title}
              title={game.title}
              subtitle={game.subtitle}
              icon={game.icon}
              badge="Flagship Simulation"
              onClick={() => {
                HapticsService.light()
                sfxService.play('card_flip')
                navigate(game.route)
              }}
            />
          ))}
        </div>
      </section>

      {/* Section 3: 🛡️ Parent Trust & Child Safety */}
      <section style={{ maxWidth: '1180px', width: '100%', margin: '0 auto', zIndex: 1 }}>
        <GlassPanel
          variant="elevated"
          style={{
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            borderRadius: '20px',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.3) 0%, rgba(15, 23, 42, 0.8) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
              Parent-Guided & Child-Safe by Design
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '800px' }}>
            ORBis is built from the ground up for safe, wholesome family engagement. Features include a PIN-protected Parent Zone, screen time limits, custom subject controls, progress analytics, and zero open child-to-AI public chat.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 12px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: '8px', fontSize: '12px', color: '#a7f3d0', fontWeight: 700 }}>
              ✅ 100% Ad-Free Experience
            </span>
            <span style={{ padding: '4px 12px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: '8px', fontSize: '12px', color: '#a7f3d0', fontWeight: 700 }}>
              ✅ PIN-Protected Parent Controls
            </span>
            <span style={{ padding: '4px 12px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: '8px', fontSize: '12px', color: '#a7f3d0', fontWeight: 700 }}>
              ✅ AI Safety Moderation Filters
            </span>
          </div>
        </GlassPanel>
      </section>
    </div>
  )
}
