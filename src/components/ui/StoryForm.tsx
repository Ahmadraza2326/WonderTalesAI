import { useState, useMemo } from 'react'
import { useChildProfiles } from '../../hooks/useChildProfiles'
import { useI18n } from '../../context/I18nContext'
import { ChildProfileCard } from '../profile/ChildProfileCard'
import { AddChildModal } from '../profile/AddChildModal'
import type { ChildProfile } from '../../types/childProfile'
import { getUnlockedStorySeeds, type StorySeedPrompt } from '../../services/worldRecommendationService'
import { sfxService } from '../../services/audio/sfxService'

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

type StoryFormErrors = Partial<Record<keyof StoryFormValues, string>>

type StoryFormProps = {
  onSubmit: (values: StoryFormValues) => Promise<void> | void
  isSubmitting?: boolean
  successMessage?: string | null
  errorMessage?: string | null
}

const initialValues: StoryFormValues = {
  childId: null,
  title: '',
  childName: '',
  childAge: '6',
  language: 'English',
  theme: '🏰 Enchanted Starlight Forest',
  moral: '❤️ Kindness & Empathy',
  characters: 'Luna and 🦉 Oliver the Wise Owl (wise & gentle)',
  storyLength: 'short',
  readingLevel: 'beginner',
}

interface CompanionPreset {
  id: string
  name: string
  avatar: string
  tagline: string
  description: string
}

const COMPANIONS: CompanionPreset[] = [
  {
    id: 'owl',
    name: 'Oliver the Owl',
    avatar: '🦉',
    tagline: 'Wise & Gentle',
    description: 'A clever guide with soft feathers who knows forest secrets.',
  },
  {
    id: 'dragon',
    name: 'Sparky the Dragon',
    avatar: '🐉',
    tagline: 'Playful & Brave',
    description: 'A tiny dragon who lights up dark caves with warm golden sparks.',
  },
  {
    id: 'fox',
    name: 'Felix the Fox',
    avatar: '🦊',
    tagline: 'Clever & Curious',
    description: 'A quick-thinking scout who finds hidden paths and riddles.',
  },
  {
    id: 'fairy',
    name: 'Twinkle the Fairy',
    avatar: '🧚',
    tagline: 'Magical & Caring',
    description: 'A starlight fairy who spreads joy and protects quiet dreams.',
  },
  {
    id: 'pup',
    name: 'Cosmo the Space Pup',
    avatar: '🚀',
    tagline: 'Loyal Explorer',
    description: 'A cheerful robotic puppy ready for rocket ship adventures.',
  },
  {
    id: 'dolphin',
    name: 'Echo the Dolphin',
    avatar: '🐬',
    tagline: 'Joyful & Friendly',
    description: 'A swift swimmer who guides friends through shimmering coral reefs.',
  },
]

interface WorldPreset {
  id: string
  name: string
  icon: string
  tag: string
  description: string
}

const WORLDS: WorldPreset[] = [
  {
    id: 'forest',
    name: '🏰 Enchanted Starlight Forest',
    icon: '🏰',
    tag: 'Fantasy & Magic',
    description: 'Glowing trees, talking critters, and paths paved with stardust.',
  },
  {
    id: 'space',
    name: '🚀 Galactic Stardust Odyssey',
    icon: '🚀',
    tag: 'Sci-Fi Adventure',
    description: 'Sparkling nebulas, friendly alien pals, and planet-hopping ships.',
  },
  {
    id: 'ocean',
    name: '🌊 Deep Ocean Coral Kingdom',
    icon: '🌊',
    tag: 'Underwater Wonder',
    description: 'Sunlit reef palaces, playful seahorses, and glowing pearl caves.',
  },
  {
    id: 'village',
    name: '🐾 Whispering Animal Village',
    icon: '🐾',
    tag: 'Cozy Friendship',
    description: 'Treehouse cottages where friendly animals bake pies and solve mysteries.',
  },
  {
    id: 'dino',
    name: '🦕 Prehistoric Dino Isle',
    icon: '🦕',
    tag: 'Nature & Exploration',
    description: 'Gentle dinosaur companions, giant ferns, and crystal springs.',
  },
  {
    id: 'detective',
    name: '🔍 Secret Curiosity Detective',
    icon: '🔍',
    tag: 'Mystery & Logic',
    description: 'Hidden footprints, friendly clues, and delightful puzzles to crack.',
  },
]

const MORAL_CHIPS = [
  '❤️ Kindness & Empathy',
  '🦁 Bravery & Courage',
  '🤝 Friendship & Sharing',
  '🌱 Curiosity & Learning',
  '✨ Self-Confidence & Joy',
  '🌍 Caring for Nature',
]

const AGE_CHIPS = [
  { label: '3–5 yrs', value: '4' },
  { label: '6–8 yrs', value: '7' },
  { label: '9–11 yrs', value: '10' },
  { label: '12+ yrs', value: '12' },
]

export function StoryForm({
  onSubmit,
  isSubmitting = false,
  successMessage,
  errorMessage,
}: StoryFormProps) {
  const { t } = useI18n()
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [values, setValues] = useState<StoryFormValues>(initialValues)
  const [selectedCompanion, setSelectedCompanion] = useState<string>('owl')
  const [errors, setErrors] = useState<StoryFormErrors>({})
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)

  const {
    profiles,
    selectedProfileId,
    selectedProfile,
    selectProfile,
    createProfile,
  } = useChildProfiles()

  function handleSelectProfile(profile: ChildProfile | null) {
    if (!profile) {
      selectProfile(null)
      return
    }

    selectProfile(profile)
    const companion = COMPANIONS.find((c) => c.id === selectedCompanion) || COMPANIONS[0]
    const childName = profile.name.trim() || 'Hero'
    const newCharacters = `${childName} and ${companion.avatar} ${companion.name} (${companion.tagline.toLowerCase()})`

    setValues((current) => ({
      ...current,
      childId: profile.id,
      childName: profile.name,
      childAge: String(profile.age),
      readingLevel: profile.reading_level || current.readingLevel,
      language: profile.preferred_language || current.language,
      theme: profile.favorite_theme || current.theme,
      characters: newCharacters,
      title: current.title ? current.title : `${childName} and the ${companion.name}`,
    }))

    setErrors((current) => ({
      ...current,
      childName: undefined,
      childAge: undefined,
    }))
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function handleSelectChip(name: keyof StoryFormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function handleSelectCompanion(companion: CompanionPreset) {
    setSelectedCompanion(companion.id)
    const childName = values.childName.trim() || 'Hero'
    const newCharacters = `${childName} and ${companion.avatar} ${companion.name} (${companion.tagline.toLowerCase()})`
    setValues((current) => ({ ...current, characters: newCharacters }))
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
    sfxService.play('star_pop')
    setValues((current) => ({
      ...current,
      title: seed.title,
      theme: seed.theme,
      characters: seed.character,
      moral: seed.moral,
    }))
    setErrors({})
  }

  function handleSelectWorld(world: WorldPreset) {
    setValues((current) => ({ ...current, theme: world.name }))
    setErrors((current) => ({ ...current, theme: undefined }))
  }

  // Live Reading Estimator (deterministic client-side calculation)
  function getEstimates() {
    const lengthMap: Record<string, { words: string; pages: string; duration: string }> = {
      short: { words: '~350 words', pages: '~4 pages', duration: '~3–4 min read' },
      medium: { words: '~650 words', pages: '~6 pages', duration: '~5–7 min read' },
      long: { words: '~1,000 words', pages: '~8 pages', duration: '~8–12 min bedtime' },
    }
    return lengthMap[values.storyLength] || lengthMap.short
  }

  function validateStep(step: number): boolean {
    const nextErrors: StoryFormErrors = {}

    if (step === 1) {
      if (!values.title.trim()) {
        nextErrors.title = t('err_child_name_required')
      }
      if (!values.childName.trim()) {
        nextErrors.childName = t('err_child_name_required')
      }
      if (!values.childAge.trim()) {
        nextErrors.childAge = t('err_child_age_required')
      }
    } else if (step === 2) {
      if (!values.theme.trim()) {
        nextErrors.theme = t('err_theme_required')
      }
      if (!values.moral.trim()) {
        nextErrors.moral = t('err_moral_required')
      }
      if (!values.characters.trim()) {
        nextErrors.characters = t('err_child_name_required')
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return false
    }

    setErrors({})
    return true
  }

  function handleNext() {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4)
      }
    }
  }

  function handlePrev() {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Validate all steps before final submission
    if (!validateStep(1) || !validateStep(2)) {
      return
    }

    await onSubmit(values)
  }

  const estimates = getEstimates()

  return (
    <form className="story-wizard" onSubmit={handleSubmit} noValidate>
      {/* Wizard Progress Stepper */}
      <nav className="wizard-stepper" aria-label="Creation Steps">
        {[
          { step: 1, label: t('step_1_title'), icon: '👤' },
          { step: 2, label: t('step_2_title'), icon: '🏰' },
          { step: 3, label: t('step_3_title'), icon: '📚' },
          { step: 4, label: t('step_4_title'), icon: '✨' },
        ].map((item) => (
          <button
            type="button"
            key={item.step}
            className={`wizard-step-btn ${currentStep === item.step ? 'active' : ''} ${
              currentStep > item.step ? 'completed' : ''
            }`}
            onClick={() => {
              if (item.step < currentStep || validateStep(currentStep)) {
                setCurrentStep(item.step as 1 | 2 | 3 | 4)
              }
            }}
          >
            <span className="wizard-step-icon">{item.icon}</span>
            <span className="wizard-step-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* STEP 1: The Hero & Companion */}
      {currentStep === 1 ? (
        <section className="form-section card-panel" aria-labelledby="step-hero">
          <div className="form-section__header">
            <span className="form-section__badge">{t('step_1_title')}</span>
            <h2 id="step-hero" className="form-section__title">
              {t('who_is_hero')}
            </h2>
            <p className="form-section__subtitle">
              {t('step_1_subtitle')}
            </p>
          </div>

          {/* Child Profile Quick Selector (Phase 8A) */}
          <div className="child-profile-selector-section">
            <div className="child-profile-selector-header">
              <h3 className="child-profile-selector-title">
                <span>🌟</span>
                <span>{t('select_child_profile')}</span>
              </h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                + {t('add_child_profile')}
              </button>
            </div>

            <div className="child-profile-carousel">
              {profiles.map((profile) => (
                <ChildProfileCard
                  key={profile.id}
                  profile={profile}
                  isSelected={selectedProfileId === profile.id}
                  onSelect={handleSelectProfile}
                  compact
                />
              ))}

              <div
                role="button"
                tabIndex={0}
                className={`child-profile-card custom-child ${
                  selectedProfileId === null ? 'selected' : ''
                }`}
                onClick={() => handleSelectProfile(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelectProfile(null)
                  }
                }}
              >
                <div className="child-profile-avatar-container">
                  <span className="child-profile-avatar">✏️</span>
                </div>
                <div className="child-profile-details">
                  <div className="child-profile-name">{t('or_enter_custom_hero')}</div>
                  <div className="child-profile-meta-row">{t('create_new_story')}</div>
                </div>
              </div>
            </div>

            {selectedProfile && (
              <p className="form-help-text" style={{ marginTop: '0.75rem', color: 'var(--brand-purple)' }}>
                ✨ {t('step_1_subtitle')} (<strong>{selectedProfile.name}</strong>)
              </p>
            )}
          </div>

          <div className="form-grid">
            <div className="field-group full-width">
              <label htmlFor="title">{t('story_title_label')}</label>
              <input
                id="title"
                name="title"
                placeholder={t('story_title_placeholder')}
                value={values.title}
                onChange={handleChange}
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title ? <p className="field-error">{errors.title}</p> : null}
            </div>

            <div className="field-group">
              <label htmlFor="childName">{t('who_is_hero')}</label>
              <input
                id="childName"
                name="childName"
                placeholder={t('hero_name_placeholder')}
                value={values.childName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.childName)}
              />
              {errors.childName ? (
                <p className="field-error">{errors.childName}</p>
              ) : null}
            </div>

            <div className="field-group">
              <label htmlFor="childAge">{t('hero_age')}</label>
              <input
                id="childAge"
                name="childAge"
                type="number"
                inputMode="numeric"
                min="2"
                max="16"
                placeholder="6"
                value={values.childAge}
                onChange={handleChange}
                aria-invalid={Boolean(errors.childAge)}
              />
              <div className="chip-list" role="group" aria-label="Quick age selector">
                {AGE_CHIPS.map((chip) => (
                  <button
                    type="button"
                    key={chip.value}
                    className={`form-chip ${values.childAge === chip.value ? 'active' : ''}`}
                    onClick={() => handleSelectChip('childAge', chip.value)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              {errors.childAge ? (
                <p className="field-error">{errors.childAge}</p>
              ) : null}
            </div>

            <div className="field-group full-width">
              <label>{t('choose_companion')}</label>
              <div className="companion-grid" role="group" aria-label="Companion Avatar Options">
                {COMPANIONS.map((companion) => (
                  <button
                    type="button"
                    key={companion.id}
                    className={`companion-card ${selectedCompanion === companion.id ? 'active' : ''}`}
                    onClick={() => handleSelectCompanion(companion)}
                  >
                    <span className="companion-avatar">{companion.avatar}</span>
                    <span className="companion-name">{companion.name}</span>
                    <span className="companion-tagline">{companion.tagline}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AddChildModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmitProfile={createProfile}
            onSuccess={(newProfile) => handleSelectProfile(newProfile)}
          />
        </section>
      ) : null}

      {/* STEP 2: The World & Lesson */}
      {currentStep === 2 ? (
        <section className="form-section card-panel" aria-labelledby="step-world">
          <div className="form-section__header">
            <span className="form-section__badge">{t('step_2_title')}</span>
            <h2 id="step-world" className="form-section__title">
              {t('choose_world')}
            </h2>
            <p className="form-section__subtitle">
              {t('step_2_subtitle')}
            </p>
          </div>

          <div className="form-grid">
            {/* Playroom Discovery Story Seeds */}
            <div className="field-group full-width">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🪐</span>
                <span>Unlocked Playroom Story Seeds</span>
                <span style={{ fontSize: '11px', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
                  Game Bridge
                </span>
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '10px',
                  marginBottom: '1rem',
                }}
              >
                {storySeeds.map((seed) => (
                  <button
                    type="button"
                    key={seed.id}
                    onClick={() => handleSelectSeed(seed)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: values.title === seed.title
                        ? '2px solid #a855f7'
                        : '1px solid rgba(168, 85, 247, 0.2)',
                      background: values.title === seed.title
                        ? 'rgba(168, 85, 247, 0.2)'
                        : 'rgba(30, 41, 59, 0.5)',
                      color: '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '20px' }}>{seed.emoji}</span>
                      <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: 800 }}>
                        {seed.isUnlocked ? '✓ UNLOCKED' : '🔒 DISCOVER'}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>{seed.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{seed.unlockedByLabel}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group full-width">
              <label>{t('choose_world')}</label>
              <div className="world-grid" role="group" aria-label="Story World Options">
                {WORLDS.map((world) => (
                  <button
                    type="button"
                    key={world.id}
                    className={`world-card ${values.theme === world.name ? 'active' : ''}`}
                    onClick={() => handleSelectWorld(world)}
                  >
                    <span className="world-icon">{world.icon}</span>
                    <div className="world-card-info">
                      <span className="world-name">{world.name}</span>
                      <span className="world-desc">{world.description}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="custom-theme-input">
                <label htmlFor="theme" className="sublabel">{t('or_enter_custom_hero')}:</label>
                <input
                  id="theme"
                  name="theme"
                  placeholder="🏰 Enchanted Starlight Forest"
                  value={values.theme}
                  onChange={handleChange}
                />
              </div>
              {errors.theme ? <p className="field-error">{errors.theme}</p> : null}
            </div>

            <div className="field-group full-width">
              <label htmlFor="moral">{t('core_moral')}</label>
              <input
                id="moral"
                name="moral"
                placeholder="❤️ Kindness & Empathy"
                value={values.moral}
                onChange={handleChange}
                aria-invalid={Boolean(errors.moral)}
              />
              <div className="chip-list" role="group" aria-label="Moral lesson suggestions">
                {MORAL_CHIPS.map((chip) => (
                  <button
                    type="button"
                    key={chip}
                    className={`form-chip ${values.moral === chip ? 'active' : ''}`}
                    onClick={() => handleSelectChip('moral', chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              {errors.moral ? <p className="field-error">{errors.moral}</p> : null}
            </div>

            <div className="field-group full-width">
              <label htmlFor="characters">{t('character_cast_summary')}</label>
              <textarea
                id="characters"
                name="characters"
                rows={2}
                placeholder="e.g. Luna and Oliver the Owl"
                value={values.characters}
                onChange={handleChange}
                aria-invalid={Boolean(errors.characters)}
              />
              {errors.characters ? (
                <p className="field-error">{errors.characters}</p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* STEP 3: Reading Goals & Live Estimation */}
      {currentStep === 3 ? (
        <section className="form-section card-panel" aria-labelledby="step-reading">
          <div className="form-section__header">
            <span className="form-section__badge">{t('step_3_title')}</span>
            <h2 id="step-reading" className="form-section__title">
              {t('step_3_subtitle')}
            </h2>
            <p className="form-section__subtitle">
              {t('default_story_preferences_desc')}
            </p>
          </div>

          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="language">{t('story_language')}</label>
              <select
                id="language"
                name="language"
                value={values.language}
                onChange={handleChange}
              >
                <option value="English">🇬🇧 English</option>
                <option value="Urdu">🇵🇰 Urdu (اردو)</option>
                <option value="Arabic">🇦🇪 Arabic (العربية)</option>
                <option value="Spanish">🇪🇸 Spanish (Español)</option>
                <option value="French">🇫🇷 French (Français)</option>
                <option value="German">🇩🇪 German (Deutsch)</option>
                <option value="Mandarin">🇨🇳 Mandarin (中文)</option>
                <option value="Japanese">🇯🇵 Japanese (日本語)</option>
                <option value="Hindi">🇮🇳 Hindi (हिन्दी)</option>
                <option value="Portuguese">🇧🇷 Portuguese (Português)</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="storyLength">{t('story_length')}</label>
              <select
                id="storyLength"
                name="storyLength"
                value={values.storyLength}
                onChange={handleChange}
              >
                <option value="short">⚡ {t('length_short')}</option>
                <option value="medium">📖 {t('length_medium')}</option>
                <option value="long">🌟 {t('length_long')}</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="readingLevel">{t('select_reading_level')}</label>
              <select
                id="readingLevel"
                name="readingLevel"
                value={values.readingLevel}
                onChange={handleChange}
              >
                <option value="beginner">🌱 {t('reading_level_beginner')}</option>
                <option value="intermediate">🌿 {t('reading_level_intermediate')}</option>
                <option value="advanced">🌳 {t('reading_level_advanced')}</option>
              </select>
            </div>

            {/* Smart Live Reading Estimator Card (Client-side, Zero AI Cost) */}
            <div className="live-estimator-card full-width" aria-live="polite">
              <div className="estimator-header">
                <span className="estimator-icon">📊</span>
                <div>
                  <h4 className="estimator-title">{t('author_notes')}</h4>
                  <p className="estimator-subtitle">{t('estimated_reading_time')}: {values.childAge || '6'}y</p>
                </div>
              </div>
              <div className="estimator-metrics">
                <div className="metric-pill">
                  <span className="metric-label">{t('estimated_words')}</span>
                  <span className="metric-value">{estimates.words}</span>
                </div>
                <div className="metric-pill">
                  <span className="metric-label">{t('story_pages_count')}</span>
                  <span className="metric-value">{estimates.pages}</span>
                </div>
                <div className="metric-pill">
                  <span className="metric-label">{t('estimated_reading_time')}</span>
                  <span className="metric-value">{estimates.duration}</span>
                </div>
              </div>
              <small className="estimator-disclaimer">
                *{t('print_disclaimer')}
              </small>
            </div>
          </div>
        </section>
      ) : null}

      {/* STEP 4: Magic Review Screen */}
      {currentStep === 4 ? (
        <section className="form-section card-panel" aria-labelledby="step-review">
          <div className="form-section__header">
            <span className="form-section__badge">{t('step_4_title')}</span>
            <h2 id="step-review" className="form-section__title">
              {t('step_4_title')}
            </h2>
            <p className="form-section__subtitle">
              {t('step_4_subtitle')}
            </p>
          </div>

          <div className="tale-review-card">
            <div className="review-book-cover">
              <span className="review-cover-icon">📖</span>
              <h3 className="review-story-title">{values.title || t('create_new_story')}</h3>
              <p className="review-author">{t('app_name')} • By DINARYX</p>
            </div>

            <div className="review-details-grid">
              <div className="review-detail-item">
                <span className="detail-label">{t('who_is_hero')}</span>
                <span className="detail-value">
                  👤 {values.childName || 'Hero'} ({values.childAge || '6'}y)
                </span>
              </div>

              <div className="review-detail-item">
                <span className="detail-label">{t('choose_world')}</span>
                <span className="detail-value">{values.theme || 'Magical World'}</span>
              </div>

              <div className="review-detail-item">
                <span className="detail-label">{t('core_moral')}</span>
                <span className="detail-value">{values.moral || 'Kindness'}</span>
              </div>

              <div className="review-detail-item">
                <span className="detail-label">{t('character_cast_summary')}</span>
                <span className="detail-value">{values.characters}</span>
              </div>

              <div className="review-detail-item">
                <span className="detail-label">{t('select_reading_level')}</span>
                <span className="detail-value">
                  {values.language} • {values.readingLevel} • {estimates.duration}
                </span>
              </div>
            </div>

            {/* Deterministic Safe Prompt Enhancement Preview */}
            <div className="prompt-preview-box">
              <span className="prompt-preview-badge">✨ {t('author_notes')}</span>
              <p className="prompt-preview-text">
                {values.childName || 'Hero'} • {values.characters} • {values.theme} • {values.moral}.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {successMessage ? (
        <p className="form-status success" role="status">
          ✨ {successMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="form-status error" role="alert">
          ⚠️ {errorMessage}
        </p>
      ) : null}

      {/* Wizard Action Controls */}
      <div className="wizard-controls">
        {currentStep > 1 ? (
          <button
            type="button"
            className="button button-secondary wizard-btn-prev"
            onClick={handlePrev}
          >
            {t('prev_step')}
          </button>
        ) : <div />}

        {currentStep < 4 ? (
          <button
            type="button"
            className="button button-primary wizard-btn-next"
            onClick={handleNext}
          >
            {t('next_step')}
          </button>
        ) : (
          <button
            type="submit"
            className="button button-primary form-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="button-spinner" aria-hidden="true" />
                <span>{t('generating_story')}</span>
              </>
            ) : (
              t('create_illustrated_tale')
            )}
          </button>
        )}
      </div>
    </form>
  )
}
