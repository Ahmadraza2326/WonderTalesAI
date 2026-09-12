import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GlassPanel } from '../components/ui/design/GlassPanel'
import { AnimatedIcon, type IconKind } from '../components/ui/design/AnimatedIcon'
import { ParticleField } from '../components/ui/design/ParticleField'
import { sfxService } from '../services/audio/sfxService'
import { HapticsService } from '../services/hapticsService'

interface ExplorePortal {
  id: string
  title: string
  subtitle: string
  description: string
  iconKind: IconKind
  to: string
  accentColor: string
  glowColor: string
  badge: string
}

const EXPLORE_PORTALS: ExplorePortal[] = [
  {
    id: 'library',
    title: 'Universal Library',
    subtitle: 'Grand Starlight Archives',
    description: 'Explore unlimited enchanted storybooks, illustrated readers, and audio folktales across 10 academic realms.',
    iconKind: 'scroll',
    to: '/academy/library',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    badge: '1,200+ Books & Texts',
  },
  {
    id: 'create',
    title: 'Creative Studio',
    subtitle: 'Art & Story Maker',
    description: 'Illustrate magical scenes, compose cosmic melodies, and co-create AI-illustrated bedtime storybooks.',
    iconKind: 'palette',
    to: '/academy/create',
    accentColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.45)',
    badge: 'AI Creator Studio',
  },
  {
    id: 'sanctuary',
    title: 'Starlight Sanctuary',
    subtitle: 'Creature Habitat & Nursery',
    description: 'Pet, feed, and bond with your hatched elemental companions to earn bonus Hearts, XP, and cosmic gifts.',
    iconKind: 'heart',
    to: '/sanctuary',
    accentColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    badge: 'Creature Care',
  },
  {
    id: 'passport',
    title: 'Explorer Passport',
    subtitle: 'Badges, Milestones & Mastery',
    description: 'View your realm badges, world discovery stamps, streak milestones, and Cosmic Grandmaster progress.',
    iconKind: 'trophy',
    to: '/passport',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    badge: 'Adventure Log',
  },
  {
    id: 'parent',
    title: 'Parent Zone',
    subtitle: 'Safety & Cognitive Insights',
    description: 'PIN-protected screen time limits, subject controls, learning analytics, and skill development reports.',
    iconKind: 'shield',
    to: '/parent-zone',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    badge: 'Parent Controls',
  },
  {
    id: 'profile',
    title: 'Profile & Settings',
    subtitle: 'Explorer Customization',
    description: 'Manage child explorer profiles, switch avatar companions, sound preferences, and learning modes.',
    iconKind: 'user',
    to: '/profile',
    accentColor: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.45)',
    badge: 'Account & Audio',
  },
]

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate()

  const handlePortalClick = (to: string) => {
    HapticsService.medium()
    sfxService.play('card_flip')
    navigate(to)
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 32px) 80px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#f8fafc',
      }}
      aria-label="ORBis Explore Observatory Hub"
    >
      <ParticleField count={36} particleType="stardust" speed={0.25} color="#c084fc" />

      {/* Header Hub Banner */}
      <header
        style={{
          maxWidth: '1080px',
          width: '100%',
          textAlign: 'center',
          marginBottom: '36px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            marginBottom: '12px',
          }}
        >
          <AnimatedIcon kind="crystal" size={16} color="#c084fc" animate="pulse" />
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#e9d5ff', letterSpacing: '0.04em' }}>
            CELESTIAL OBSERVATORY
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.8rem, 4.5vw, 2.75rem)',
            fontWeight: 900,
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Explore the ORBis Universe
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            color: '#94a3b8',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Discover enchanted libraries, create original illustrated tales, care for mythical companions, and track your cosmic adventure.
        </p>
      </header>

      {/* 6 Explore Realm Destination Portals */}
      <main
        style={{
          maxWidth: '1080px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {EXPLORE_PORTALS.map((portal) => (
          <GlassPanel
            key={portal.id}
            variant="card"
            interactive={true}
            onClick={() => handlePortalClick(portal.to)}
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              borderRadius: '20px',
              cursor: 'pointer',
              border: `1.5px solid ${portal.accentColor}33`,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 27, 75, 0.85) 100%)',
              transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease, border-color 0.22s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = `0 12px 32px rgba(0, 0, 0, 0.6), 0 0 24px ${portal.glowColor}`
              e.currentTarget.style.borderColor = `${portal.accentColor}88`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)'
              e.currentTarget.style.borderColor = `${portal.accentColor}33`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `radial-gradient(circle at 30% 30%, ${portal.accentColor}33 0%, rgba(15, 23, 42, 0.8) 100%)`,
                  border: `1px solid ${portal.accentColor}55`,
                }}
              >
                <AnimatedIcon kind={portal.iconKind} size={24} color={portal.accentColor} animate="pulse" />
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: portal.accentColor,
                  background: `${portal.accentColor}18`,
                  border: `1px solid ${portal.accentColor}44`,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                }}
              >
                {portal.badge}
              </span>
            </div>

            <div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  margin: '0 0 4px',
                  color: '#f8fafc',
                }}
              >
                {portal.title}
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: portal.accentColor,
                  margin: '0 0 8px',
                }}
              >
                {portal.subtitle}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: '#cbd5e1',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {portal.description}
              </p>
            </div>

            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 800,
                color: portal.accentColor,
              }}
            >
              <span>Enter Realm</span>
              <span>→</span>
            </div>
          </GlassPanel>
        ))}
      </main>
    </div>
  )
}
