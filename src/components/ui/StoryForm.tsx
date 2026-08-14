import { useState } from 'react'

export type StoryFormValues = {
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
  title: '',
  childName: '',
  childAge: '6',
  language: 'English',
  theme: '🏰 Enchanted Starlight Forest',
  moral: '❤️ Kindness & Empathy',
  characters: 'Luna and 🦉 Oliver the Wise Owl',
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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [values, setValues] = useState<StoryFormValues>(initialValues)
  const [selectedCompanion, setSelectedCompanion] = useState<string>('owl')
  const [errors, setErrors] = useState<StoryFormErrors>({})

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
        nextErrors.title = 'Please enter a story title.'
      }
      if (!values.childName.trim()) {
        nextErrors.childName = 'Please enter the child’s name.'
      }
      if (!values.childAge.trim()) {
        nextErrors.childAge = 'Please select or enter the child’s age.'
      }
    } else if (step === 2) {
      if (!values.theme.trim()) {
        nextErrors.theme = 'Please choose a story world or theme.'
      }
      if (!values.moral.trim()) {
        nextErrors.moral = 'Please select a moral lesson.'
      }
      if (!values.characters.trim()) {
        nextErrors.characters = 'Please describe the characters.'
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
          { step: 1, label: '1. The Hero', icon: '👤' },
          { step: 2, label: '2. The World', icon: '🏰' },
          { step: 3, label: '3. Reading Goal', icon: '📚' },
          { step: 4, label: '4. Tale Review', icon: '✨' },
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
            <span className="form-section__badge">Step 1 of 4</span>
            <h2 id="step-hero" className="form-section__title">
              Who is the Hero of this Tale?
            </h2>
            <p className="form-section__subtitle">
              Every ORBIS adventure begins with your child and their loyal companion.
            </p>
          </div>

          <div className="form-grid">
            <div className="field-group full-width">
              <label htmlFor="title">Story Title</label>
              <input
                id="title"
                name="title"
                placeholder="e.g. Luna and the Whispering Tree"
                value={values.title}
                onChange={handleChange}
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title ? <p className="field-error">{errors.title}</p> : null}
            </div>

            <div className="field-group">
              <label htmlFor="childName">Child's Name</label>
              <input
                id="childName"
                name="childName"
                placeholder="e.g. Luna"
                value={values.childName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.childName)}
              />
              {errors.childName ? (
                <p className="field-error">{errors.childName}</p>
              ) : null}
            </div>

            <div className="field-group">
              <label htmlFor="childAge">Child's Age (Years)</label>
              <input
                id="childAge"
                name="childAge"
                type="number"
                inputMode="numeric"
                min="1"
                max="16"
                placeholder="e.g. 6"
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
              <label>Choose a Magical Story Companion</label>
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
        </section>
      ) : null}

      {/* STEP 2: The World & Lesson */}
      {currentStep === 2 ? (
        <section className="form-section card-panel" aria-labelledby="step-world">
          <div className="form-section__header">
            <span className="form-section__badge">Step 2 of 4</span>
            <h2 id="step-world" className="form-section__title">
              Choose the Story World & Values
            </h2>
            <p className="form-section__subtitle">
              Select an imaginative realm and a life-shaping moral for the journey.
            </p>
          </div>

          <div className="form-grid">
            <div className="field-group full-width">
              <label>Select an Inspiring Realm</label>
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
                <label htmlFor="theme" className="sublabel">Or write a custom setting:</label>
                <input
                  id="theme"
                  name="theme"
                  placeholder="e.g. Floating island of giant glowing sunflowers"
                  value={values.theme}
                  onChange={handleChange}
                />
              </div>
              {errors.theme ? <p className="field-error">{errors.theme}</p> : null}
            </div>

            <div className="field-group full-width">
              <label htmlFor="moral">Moral Lesson / Value</label>
              <input
                id="moral"
                name="moral"
                placeholder="e.g. Kindness and listening to friends"
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
              <label htmlFor="characters">Characters in this Adventure</label>
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
            <span className="form-section__badge">Step 3 of 4</span>
            <h2 id="step-reading" className="form-section__title">
              Reading Goals & Duration
            </h2>
            <p className="form-section__subtitle">
              Tailor the language, pace, and reading difficulty for your young reader.
            </p>
          </div>

          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                name="language"
                value={values.language}
                onChange={handleChange}
              >
                <option value="English">🇬🇧 English</option>
                <option value="Arabic">🇦🇪 Arabic (العربية)</option>
                <option value="French">🇫🇷 French (Français)</option>
                <option value="Spanish">🇪🇸 Spanish (Español)</option>
                <option value="German">🇩🇪 German (Deutsch)</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="storyLength">Story Length</label>
              <select
                id="storyLength"
                name="storyLength"
                value={values.storyLength}
                onChange={handleChange}
              >
                <option value="short">⚡ Short (Quick adventure)</option>
                <option value="medium">📖 Medium (Standard read)</option>
                <option value="long">🌟 Long (Bedtime journey)</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="readingLevel">Reading Level</label>
              <select
                id="readingLevel"
                name="readingLevel"
                value={values.readingLevel}
                onChange={handleChange}
              >
                <option value="beginner">🌱 Beginner (Simple words, rhyming)</option>
                <option value="intermediate">🌿 Intermediate (Engaging dialogue)</option>
                <option value="advanced">🌳 Advanced (Rich vocabulary)</option>
              </select>
            </div>

            {/* Smart Live Reading Estimator Card (Client-side, Zero AI Cost) */}
            <div className="live-estimator-card full-width" aria-live="polite">
              <div className="estimator-header">
                <span className="estimator-icon">📊</span>
                <div>
                  <h4 className="estimator-title">Smart Tale Estimator</h4>
                  <p className="estimator-subtitle">Bedtime planning breakdown based on age {values.childAge || '6'}</p>
                </div>
              </div>
              <div className="estimator-metrics">
                <div className="metric-pill">
                  <span className="metric-label">Estimated Length</span>
                  <span className="metric-value">{estimates.words}</span>
                </div>
                <div className="metric-pill">
                  <span className="metric-label">StoryBook Pages</span>
                  <span className="metric-value">{estimates.pages}</span>
                </div>
                <div className="metric-pill">
                  <span className="metric-label">Reading Time</span>
                  <span className="metric-value">{estimates.duration}</span>
                </div>
              </div>
              <small className="estimator-disclaimer">
                *Estimates for pacing and bedtime planning. Story text and illustration count vary naturally.
              </small>
            </div>
          </div>
        </section>
      ) : null}

      {/* STEP 4: Magic Review Screen */}
      {currentStep === 4 ? (
        <section className="form-section card-panel" aria-labelledby="step-review">
          <div className="form-section__header">
            <span className="form-section__badge">Step 4 of 4</span>
            <h2 id="step-review" className="form-section__title">
              Magic Tale Review
            </h2>
            <p className="form-section__subtitle">
              Verify your story parameters before Orbis AI crafts your draft.
            </p>
          </div>

          <div className="tale-review-card">
            <div className="review-book-cover">
              <span className="review-cover-icon">📖</span>
              <h3 className="review-story-title">{values.title || 'Untitled Story Adventure'}</h3>
              <p className="review-author">ORBIS Story Studio • By DINARYX</p>
            </div>

            <div className="review-details-grid">
              <div className="review-detail-item">
                <span className="detail-label">Hero & Age</span>
                <span className="detail-value">
                  👤 {values.childName || 'Hero'} (Age {values.childAge || '6'})
                </span>
              </div>

              <div className="review-detail-item">
                <span className="detail-label">Story World</span>
                <span className="detail-value">{values.theme || 'Magical World'}</span>
              </div>

              <div className="review-detail-item">
                <span className="detail-label">Moral Focus</span>
                <span className="detail-value">{values.moral || 'Kindness'}</span>
              </div>

              <div className="review-detail-item">
                <span className="detail-label">Characters</span>
                <span className="detail-value">{values.characters}</span>
              </div>

              <div className="review-detail-item">
                <span className="detail-label">Reading Target</span>
                <span className="detail-value">
                  {values.language} • {values.readingLevel} • {estimates.duration}
                </span>
              </div>
            </div>

            {/* Deterministic Safe Prompt Enhancement Preview */}
            <div className="prompt-preview-box">
              <span className="prompt-preview-badge">✨ Storyteller Direction</span>
              <p className="prompt-preview-text">
                Orbis AI will craft a gentle, imaginative tale starring <strong>{values.childName || 'the hero'}</strong> with <strong>{values.characters}</strong>, journeying through <strong>{values.theme}</strong> with themes of <strong>{values.moral}</strong>.
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
            ← Back
          </button>
        ) : <div />}

        {currentStep < 4 ? (
          <button
            type="button"
            className="button button-primary wizard-btn-next"
            onClick={handleNext}
          >
            Next Step →
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
                <span>Creating Story Adventure…</span>
              </>
            ) : (
              '✨ Create Story Adventure'
            )}
          </button>
        )}
      </div>
    </form>
  )
}
