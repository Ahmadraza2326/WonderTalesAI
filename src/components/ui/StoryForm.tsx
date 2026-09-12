import React, { useState, useMemo, useEffect } from 'react'
import { useChildProfiles } from '../../hooks/useChildProfiles'
import { ChildProfileCard } from '../profile/ChildProfileCard'
import { AddChildModal } from '../profile/AddChildModal'
import type { ChildProfile } from '../../types/childProfile'
import type { GuideId } from '../../types/learningUniverse'
import { getUnlockedStorySeeds, type StorySeedPrompt } from '../../services/worldRecommendationService'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'
import { GlassPanel } from './design/GlassPanel'
import { MagicalButton } from './design/MagicalButton'
import { AnimatedIcon, type IconKind } from './design/AnimatedIcon'
import { GuideCharacterSvg } from '../academy/guide/GuideCharacterSvg'

export type StoryFormValues = {
  childId?: string | null
  title: string
  childName: string
  childAge: string
  language: string
  theme: string
  moral: string
  characters: string
  storyLength: string
  readingLevel: string
}

export type StoryFormProps = {
  onSubmit: (values: StoryFormValues) => Promise<void> | void
  isSubmitting?: boolean
  successMessage?: string | null
  errorMessage?: string | null
}

const initialValues: StoryFormValues = {
  childId: null,
  title: 'The Great Starlight Adventure',
  childName: 'Luna',
  childAge: '6',
  language: 'English',
  theme: 'Enchanted Starlight Forest',
  moral: 'Kindness & Empathy',
  characters: 'Luna and Oliver the Wise Owl (wise & gentle)',
  storyLength: 'short',
  readingLevel: 'beginner',
}

interface CompanionPreset {
  id: string
  guideId: GuideId
  name: string
  tagline: string
  description: string
  accentColor: string
}

const COMPANIONS: CompanionPreset[] = [
  {
    id: 'owl',
    guideId: 'poly',
    name: 'Oliver the Owl',
    tagline: 'Wise & Gentle',
    description: 'A clever guide with soft feathers who knows forest secrets.',
    accentColor: '#38bdf8',
  },
  {
    id: 'dragon',
    guideId: 'nova',
    name: 'Sparky the Dragon',
    tagline: 'Playful & Brave',
    description: 'A tiny dragon who lights up dark caves with warm golden sparks.',
    accentColor: '#f97316',
  },
  {
    id: 'fox',
    guideId: 'lexi',
    name: 'Felix the Fox',
    tagline: 'Clever & Curious',
    description: 'A quick-thinking scout who finds hidden paths and riddles.',
    accentColor: '#fbbf24',
  },
  {
    id: 'fairy',
    guideId: 'davinci',
    name: 'Twinkle the Fairy',
    tagline: 'Magical & Caring',
    description: 'A starlight fairy who spreads joy and protects quiet dreams.',
    accentColor: '#ec4899',
  },
  {
    id: 'pup',
    guideId: 'beep_0',
    name: 'Cosmo the Space Pup',
    tagline: 'Loyal Explorer',
    description: 'A cheerful robotic companion ready for rocket ship adventures.',
    accentColor: '#a855f7',
  },
  {
    id: 'dolphin',
    guideId: 'harmony',
    name: 'Echo the Dolphin',
    tagline: 'Joyful & Friendly',
    description: 'A swift swimmer who guides friends through shimmering coral reefs.',
    accentColor: '#06b6d4',
  },
]

interface WorldPreset {
  id: string
  name: string
  iconKind: IconKind
  tag: string
  description: string
  color: string
}

const WORLDS: WorldPreset[] = [
  {
    id: 'forest',
    name: 'Enchanted Starlight Forest',
    iconKind: 'biome',
    tag: 'Fantasy & Magic',
    description: 'Glowing trees, talking critters, and paths paved with stardust.',
    color: '#10b981',
  },
  {
    id: 'space',
    name: 'Galactic Stardust Odyssey',
    iconKind: 'star',
    tag: 'Sci-Fi Adventure',
    description: 'Sparkling nebulas, friendly alien pals, and planet-hopping ships.',
    color: '#8b5cf6',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean Coral Kingdom',
    iconKind: 'crystal',
    tag: 'Underwater Wonder',
    description: 'Sunlit reef palaces, playful seahorses, and glowing pearl caves.',
    color: '#06b6d4',
  },
  {
    id: 'village',
    name: 'Whispering Animal Village',
    iconKind: 'citadel',
    tag: 'Cozy Friendship',
    description: 'Treehouse cottages where friendly animals bake pies and solve mysteries.',
    color: '#f59e0b',
  },
  {
    id: 'dino',
    name: 'Prehistoric Dino Isle',
    iconKind: 'radiance',
    tag: 'Nature & Exploration',
    description: 'Gentle dinosaur companions, giant ferns, and crystal springs.',
    color: '#84cc16',
  },
  {
    id: 'detective',
    name: 'Secret Curiosity Detective',
    iconKind: 'enigma',
    tag: 'Mystery & Logic',
    description: 'Hidden footprints, friendly clues, and delightful puzzles to crack.',
    color: '#ec4899',
  },
]

interface MoralOption {
  id: string
  label: string
  iconKind: IconKind
  color: string
}

const MORAL_OPTIONS: MoralOption[] = [
  { id: 'kindness', label: 'Kindness & Empathy', iconKind: 'heart', color: '#f43f5e' },
  { id: 'bravery', label: 'Bravery & Courage', iconKind: 'radiance', color: '#f59e0b' },
  { id: 'friendship', label: 'Friendship & Sharing', iconKind: 'sparkle', color: '#38bdf8' },
  { id: 'curiosity', label: 'Curiosity & Learning', iconKind: 'biome', color: '#10b981' },
  { id: 'confidence', label: 'Self-Confidence & Joy', iconKind: 'star', color: '#a855f7' },
  { id: 'nature', label: 'Caring for Nature', iconKind: 'globe', color: '#06b6d4' },
]

const AGE_CHIPS = [
  { label: '3–5 yrs', value: '4', readingLevel: 'beginner' },
  { label: '6–8 yrs', value: '7', readingLevel: 'beginner' },
  { label: '9–11 yrs', value: '10', readingLevel: 'intermediate' },
  { label: '12+ yrs', value: '12', readingLevel: 'advanced' },
]

export function StoryForm({
  onSubmit,
  isSubmitting = false,
  successMessage,
  errorMessage,
}: StoryFormProps) {
  const [values, setValues] = useState<StoryFormValues>(initialValues)
  const [selectedCompanion, setSelectedCompanion] = useState<string>('owl')
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)

  const {
    profiles,
    selectedProfileId,
    selectProfile,
    createProfile,
  } = useChildProfiles()

  // Auto-select first profile if available
  useEffect(() => {
    if (profiles.length > 0 && !selectedProfileId) {
      handleSelectProfile(profiles[0])
    }
  }, [profiles, selectedProfileId])

  function handleSelectProfile(profile: ChildProfile | null) {
    if (!profile) {
      selectProfile(null)
      return
    }

    selectProfile(profile)
    const companion = COMPANIONS.find((c) => c.id === selectedCompanion) || COMPANIONS[0]
    const childName = profile.name.trim() || 'Hero'
    const newCharacters = `${childName} and ${companion.name} (${companion.tagline.toLowerCase()})`

    setValues((current) => ({
      ...current,
      childId: profile.id,
      childName: profile.name,
      childAge: String(profile.age || '6'),
      readingLevel: profile.reading_level || current.readingLevel,
      language: profile.preferred_language || current.language,
      theme: profile.favorite_theme || current.theme,
      characters: newCharacters,
      title: `${childName} & the ${companion.name}`,
    }))
  }

  function handleSelectCompanion(companion: CompanionPreset) {
    HapticsService.light()
    sfxService.play('card_flip')
    setSelectedCompanion(companion.id)
    const childName = values.childName.trim() || 'Hero'
    const newCharacters = `${childName} and ${companion.name} (${companion.tagline.toLowerCase()})`
    setValues((current) => ({
      ...current,
      characters: newCharacters,
      title: `${childName} and ${companion.name}`,
    }))
  }

  function handleSelectWorld(world: WorldPreset) {
    HapticsService.medium()
    sfxService.play('star_pop')
    setValues((current) => ({ ...current, theme: world.name }))
  }

  // Playroom Unlocked Story Seeds
  const storySeeds = useMemo(() => {
    let creatureCount = 3
    let machineCount = 3
    let detectiveCount = 2
    let potionCount = 3

    if (typeof window !== 'undefined' && window.localStorage && selectedProfileId) {
      try {
        const savedCreatures = window.localStorage.getItem(`orbis_creature_lab_discovered_${selectedProfileId}`)
        if (savedCreatures) creatureCount = JSON.parse(savedCreatures).length

        const savedMachines = window.localStorage.getItem(`orbis_magic_machine_completed_${selectedProfileId}`)
        if (savedMachines) machineCount = JSON.parse(savedMachines).length

        const savedDetective = window.localStorage.getItem(`orbis_mystery_detective_solved_${selectedProfileId}`)
        if (savedDetective) detectiveCount = JSON.parse(savedDetective).length

        const savedPotions = window.localStorage.getItem(`orbis_potion_scales_completed_${selectedProfileId}`)
        if (savedPotions) potionCount = JSON.parse(savedPotions).length
      } catch {
        // Safe fallback
      }
    }

    return getUnlockedStorySeeds({
      creatureDiscoveriesCount: creatureCount,
      machineCompletedCount: machineCount,
      detectiveSolvedCount: detectiveCount,
      potionBrewedCount: potionCount,
    })
  }, [selectedProfileId])

  function handleSelectSeed(seed: StorySeedPrompt) {
    HapticsService.success()
    sfxService.play('star_pop')
    setValues((current) => ({
      ...current,
      title: seed.title,
      theme: seed.theme,
      characters: seed.character,
      moral: seed.moral,
    }))
  }

  async function handleFastSubmit(e: React.FormEvent) {
    e.preventDefault()
    HapticsService.heavy()
    sfxService.play('victory_fanfare')

    const submissionValues: StoryFormValues = {
      ...values,
      childName: values.childName.trim() || 'Explorer',
      title: values.title.trim() || `${values.childName || 'Explorer'}'s Magical Story`,
      theme: values.theme.trim() || 'Enchanted Starlight Forest',
      moral: values.moral.trim() || 'Kindness & Empathy',
      characters: values.characters.trim() || `${values.childName || 'Explorer'} and Oliver the Owl`,
      storyLength: values.storyLength || 'short',
      readingLevel: values.readingLevel || 'beginner',
      language: values.language || 'English',
    }

    await onSubmit(submissionValues)
  }

  return (
    <form className="story-wizard ultra-simple-creator" onSubmit={handleFastSubmit} noValidate>
      {/* 1. Hero & Companion Visual Selector */}
      <GlassPanel
        tier="floating"
        style={{
          padding: 'clamp(1.25rem, 3vw, 1.75rem)',
          marginBottom: '1.5rem',
          borderRadius: '24px',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  color: '#fbbf24',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: 'rgba(251, 191, 36, 0.15)',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <AnimatedIcon kind="star" size={12} color="#fbbf24" />
                STEP 1 • HERO & COMPANION
              </span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                fontWeight: 900,
                margin: 0,
                color: '#f8fafc',
                letterSpacing: '-0.02em',
              }}
            >
              Who is starring in this book?
            </h2>
          </div>

          <MagicalButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            aria-label="Add new child profile"
          >
            + Add Child
          </MagicalButton>
        </div>

        {/* Profile Avatars Carousel */}
        {profiles.length > 0 && (
          <div className="child-profile-carousel" style={{ marginBottom: '1.25rem' }}>
            {profiles.map((profile) => (
              <ChildProfileCard
                key={profile.id}
                profile={profile}
                isSelected={selectedProfileId === profile.id}
                onSelect={handleSelectProfile}
                compact
              />
            ))}
          </div>
        )}

        {/* Hero Name & Age Chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <label
              htmlFor="childName"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.4rem' }}
            >
              Hero Name
            </label>
            <input
              id="childName"
              name="childName"
              value={values.childName}
              onChange={(e) => {
                const name = e.target.value
                setValues((prev) => ({
                  ...prev,
                  childName: name,
                  title: `${name || 'Hero'}'s Magical Story`,
                }))
              }}
              placeholder="e.g. Luna"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                color: '#f8fafc',
                fontSize: '1rem',
                fontWeight: 700,
                outline: 'none',
                minHeight: '48px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.4rem' }}>
              Age Range
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} role="radiogroup" aria-label="Select Age Range">
              {AGE_CHIPS.map((chip) => {
                const isSelected = values.childAge === chip.value
                return (
                  <button
                    type="button"
                    key={chip.value}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      HapticsService.light()
                      setValues((prev) => ({
                        ...prev,
                        childAge: chip.value,
                        readingLevel: chip.readingLevel,
                      }))
                    }}
                    style={{
                      flex: '1 1 auto',
                      minWidth: '70px',
                      minHeight: '48px',
                      padding: '0.6rem 0.9rem',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.12)',
                      backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                      color: isSelected ? '#c084fc' : '#cbd5e1',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 14px rgba(139, 92, 246, 0.35)' : 'none',
                      transition: 'all 160ms ease',
                    }}
                  >
                    {chip.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Canonical Vector Guide Companion Picker */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.6rem' }}>
            Choose Magical Companion
          </label>
          <div
            className="companion-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
              gap: '0.75rem',
            }}
            role="radiogroup"
            aria-label="Choose Magical Companion"
          >
            {COMPANIONS.map((companion) => {
              const isSelected = selectedCompanion === companion.id
              return (
                <button
                  type="button"
                  key={companion.id}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${companion.name}, ${companion.tagline}`}
                  onClick={() => handleSelectCompanion(companion)}
                  style={{
                    padding: '0.9rem 0.75rem',
                    borderRadius: '18px',
                    border: isSelected ? `2px solid ${companion.accentColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: isSelected ? `${companion.accentColor}22` : 'rgba(15, 23, 42, 0.55)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: isSelected ? `0 0 18px ${companion.accentColor}45` : 'none',
                    transition: 'all 180ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    minHeight: '110px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GuideCharacterSvg
                      guideId={companion.guideId}
                      size={54}
                      pose={isSelected ? 'excited' : 'happy'}
                    />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '0.88rem', color: isSelected ? '#f8fafc' : '#e2e8f0' }}>
                    {companion.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: isSelected ? companion.accentColor : '#94a3b8', fontWeight: 600 }}>
                    {companion.tagline}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </GlassPanel>

      {/* 2. World & Story Seeds Selector */}
      <GlassPanel
        tier="floating"
        style={{
          padding: 'clamp(1.25rem, 3vw, 1.75rem)',
          marginBottom: '1.5rem',
          borderRadius: '24px',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 900,
                color: '#c084fc',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: 'rgba(192, 132, 252, 0.15)',
                padding: '3px 8px',
                borderRadius: '9999px',
                border: '1px solid rgba(192, 132, 252, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <AnimatedIcon kind="crystal" size={12} color="#c084fc" />
              STEP 2 • STORY WORLD & SEEDS
            </span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
              fontWeight: 900,
              margin: 0,
              color: '#f8fafc',
              letterSpacing: '-0.02em',
            }}
          >
            Where does the adventure take place?
          </h2>
        </div>

        {/* Playroom Story Seeds Carousel */}
        {storySeeds.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#c084fc',
                marginBottom: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <AnimatedIcon kind="sparkle" size={16} color="#c084fc" />
              <span>Unlocked Playroom Story Seeds</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
                gap: '0.75rem',
              }}
            >
              {storySeeds.slice(0, 3).map((seed) => (
                <button
                  type="button"
                  key={seed.id}
                  onClick={() => handleSelectSeed(seed)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '16px',
                    border: values.title === seed.title ? '2px solid #a855f7' : '1px solid rgba(168, 85, 247, 0.3)',
                    backgroundColor: values.title === seed.title ? 'rgba(168, 85, 247, 0.25)' : 'rgba(30, 41, 59, 0.5)',
                    color: '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    minHeight: '64px',
                    boxShadow: values.title === seed.title ? '0 0 14px rgba(168, 85, 247, 0.35)' : 'none',
                    transition: 'all 160ms ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AnimatedIcon kind="sparkle" size={20} color="#c084fc" animate="sparkle" />
                    <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 900, letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <AnimatedIcon kind="unlock" size={10} color="#fbbf24" />
                      UNLOCKED
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>{seed.title}</div>
                  <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>{seed.unlockedByLabel}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6 Theme Worlds Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '0.75rem',
          }}
          role="radiogroup"
          aria-label="Select Story World"
        >
          {WORLDS.map((world) => {
            const isSelected = values.theme === world.name
            return (
              <button
                type="button"
                key={world.id}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${world.name}, ${world.tag}`}
                onClick={() => handleSelectWorld(world)}
                style={{
                  padding: '1rem',
                  borderRadius: '18px',
                  border: isSelected ? `2.5px solid ${world.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: isSelected ? `${world.color}18` : 'rgba(15, 23, 42, 0.55)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: isSelected ? `0 0 20px ${world.color}35` : 'none',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 180ms ease',
                  minHeight: '84px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <AnimatedIcon
                    kind={world.iconKind}
                    size={28}
                    color={world.color}
                    glowColor={world.color}
                    animate={isSelected ? 'sparkle' : 'none'}
                  />
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: isSelected ? world.color : '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {world.tag}
                  </span>
                </div>
                <div style={{ fontWeight: 900, fontSize: '0.92rem', color: isSelected ? '#f8fafc' : '#e2e8f0' }}>
                  {world.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  {world.description}
                </div>
              </button>
            )
          })}
        </div>
      </GlassPanel>

      {/* 3. Collapsible Advanced Options */}
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            color: '#c084fc',
            fontSize: '0.88rem',
            fontWeight: 800,
            cursor: 'pointer',
            padding: '0.6rem 1.25rem',
            transition: 'all 160ms ease',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AnimatedIcon kind="circuit" size={16} color="#c084fc" />
          <span>{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options (Language, Morals & Length)'}</span>
        </button>
      </div>

      {showAdvanced && (
        <GlassPanel
          tier="grounded"
          style={{
            padding: 'clamp(1.25rem, 3vw, 1.5rem)',
            marginBottom: '1.5rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <label htmlFor="language" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                Language
              </label>
              <select
                id="language"
                name="language"
                value={values.language}
                onChange={(e) => setValues((prev) => ({ ...prev, language: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: '#f8fafc',
                  fontSize: '0.92rem',
                  minHeight: '48px',
                }}
              >
                <option value="English">English (UK/Global)</option>
                <option value="Urdu">Urdu (اردو)</option>
                <option value="Arabic">Arabic (العربية)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Mandarin">Mandarin (中文)</option>
                <option value="Japanese">Japanese (日本語)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Portuguese">Portuguese (Português)</option>
              </select>
            </div>

            <div>
              <label htmlFor="storyLength" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                Story Length
              </label>
              <select
                id="storyLength"
                name="storyLength"
                value={values.storyLength}
                onChange={(e) => setValues((prev) => ({ ...prev, storyLength: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: '#f8fafc',
                  fontSize: '0.92rem',
                  minHeight: '48px',
                }}
              >
                <option value="short">Short Tale (~4 Pages, ~3 min)</option>
                <option value="medium">Medium Tale (~6 Pages, ~6 min)</option>
                <option value="long">Bedtime Story (~8 Pages, ~10 min)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.4rem' }}>
              Core Moral Lesson
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {MORAL_OPTIONS.map((moral) => {
                const isSelected = values.moral === moral.label
                return (
                  <button
                    type="button"
                    key={moral.id}
                    onClick={() => setValues((prev) => ({ ...prev, moral: moral.label }))}
                    style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: '12px',
                      border: isSelected ? `2px solid ${moral.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: isSelected ? `${moral.color}25` : 'rgba(15, 23, 42, 0.6)',
                      color: isSelected ? '#f8fafc' : '#cbd5e1',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      minHeight: '44px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 160ms ease',
                    }}
                  >
                    <AnimatedIcon kind={moral.iconKind} size={14} color={moral.color} />
                    <span>{moral.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Messages */}
      {errorMessage && (
        <div
          className="form-status error"
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            fontWeight: 700,
          }}
          role="alert"
        >
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div
          className="form-status success"
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#6ee7b7',
            fontWeight: 700,
          }}
          role="status"
        >
          {successMessage}
        </div>
      )}

      {/* 4. Single-Tap Universal Story & Learning Generator */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '2rem' }}>
        <MagicalButton
          type="submit"
          variant="cosmic"
          size="lg"
          disabled={isSubmitting}
          style={{
            width: '100%',
            maxWidth: '560px',
            minHeight: '62px',
            fontSize: '1.25rem',
            borderRadius: '20px',
            boxShadow: '0 12px 32px rgba(139, 92, 246, 0.45), 0 0 24px rgba(245, 158, 11, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          {isSubmitting ? (
            <>
              <span className="button-spinner" aria-hidden="true" />
              <span>Weaving Complete Tale & Learning Package...</span>
            </>
          ) : (
            <>
              <AnimatedIcon kind="wand" size={20} color="#ffffff" animate="sparkle" />
              <span>Launch Complete Tale (1-Click)</span>
              <AnimatedIcon kind="arrow_right" size={18} color="#ffffff" />
            </>
          )}
        </MagicalButton>
        <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
          ⚡ Bundles Story Narrative, Web Speech Narration, Quizzes & Vocabulary Tooltips (+50 XP • +10 Stars)
        </div>
      </div>

      <AddChildModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmitProfile={createProfile}
        onSuccess={(newProfile) => handleSelectProfile(newProfile)}
      />
    </form>
  )
}
