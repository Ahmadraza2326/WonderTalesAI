import React, { useState, useEffect, useRef } from 'react'
import {
  DEFAULT_AVATARS,
  INTEREST_SUGGESTIONS,
  validateChildProfileInput,
} from '../../services/childProfileService'
import type { ChildProfile, CreateChildProfileInput } from '../../types/childProfile'
import { useI18n } from '../../context/I18nContext'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export interface AddChildModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (profile: ChildProfile) => void
  initialData?: Partial<ChildProfile> | null
  mode?: 'create' | 'edit'
  onSubmitProfile: (
    input: CreateChildProfileInput
  ) => Promise<{ data: ChildProfile | null; error: string | null }>
}

const LANGUAGE_OPTIONS = [
  'English',
  'Urdu',
  'Arabic',
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Japanese',
  'Hindi',
  'Portuguese',
]

export const AddChildModal: React.FC<AddChildModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  mode = 'create',
  onSubmitProfile,
}) => {
  const { t } = useI18n()
  const [name, setName] = useState(initialData?.name || '')
  const [age, setAge] = useState(initialData?.age ? String(initialData.age) : '6')
  const [avatar, setAvatar] = useState(initialData?.avatar || '🦁')
  const [readingLevel, setReadingLevel] = useState(initialData?.reading_level || 'intermediate')
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialData?.interests || ['Space & Planets', 'Dinosaurs']
  )
  const [customInterest, setCustomInterest] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState(
    initialData?.preferred_language || 'English'
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nameInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '')
        setAge(initialData.age ? String(initialData.age) : '6')
        setAvatar(initialData.avatar || '🦁')
        setReadingLevel(initialData.reading_level || 'intermediate')
        setSelectedInterests(initialData.interests || ['Space & Planets'])
        setPreferredLanguage(initialData.preferred_language || 'English')
      } else {
        setName('')
        setAge('6')
        setAvatar('🦁')
        setReadingLevel('intermediate')
        setSelectedInterests(['Space & Planets', 'Dinosaurs'])
        setPreferredLanguage('English')
      }
      setError(null)
      setIsSubmitting(false)
      setTimeout(() => nameInputRef.current?.focus(), 50)
    }
  }, [isOpen, initialData])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  const handleAgeChange = (newAge: string) => {
    setAge(newAge)
    const num = Number(newAge)
    if (num <= 5) setReadingLevel('beginner')
    else if (num <= 8) setReadingLevel('intermediate')
    else setReadingLevel('advanced')
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customInterest.trim()
    if (trimmed && !selectedInterests.includes(trimmed)) {
      setSelectedInterests((prev) => [...prev, trimmed])
      setCustomInterest('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validation = validateChildProfileInput({
      name,
      age,
      reading_level: readingLevel,
      interests: selectedInterests,
      avatar,
      preferred_language: preferredLanguage,
    })

    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setIsSubmitting(true)
    const result = await onSubmitProfile({
      name: validation.sanitized.name,
      age: validation.sanitized.age,
      reading_level: validation.sanitized.reading_level,
      interests: validation.sanitized.interests,
      avatar: validation.sanitized.avatar,
      preferred_language: validation.sanitized.preferred_language,
    })

    setIsSubmitting(false)

    if (result.error || !result.data) {
      setError(result.error || 'Failed to save child profile.')
    } else {
      onSuccess(result.data)
      onClose()
    }
  }

  return (
    <div
      className="add-child-modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose()
      }}
    >
      <div
        ref={modalRef}
        className="add-child-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-child-modal-title"
      >
        <div className="add-child-modal-header">
          <div className="add-child-modal-title-group">
            <span className="add-child-modal-icon" aria-hidden="true">
              {avatar}
            </span>
            <div>
              <h3 id="add-child-modal-title">
                {mode === 'create' ? t('add_child_profile') : t('edit_child_profile')}
              </h3>
              <p className="add-child-modal-subtitle">
                {t('no_children_profiles_desc')}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="add-child-modal-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="form-feedback error add-child-error" role="alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-child-form">
          {/* Avatar Selector */}
          <div className="form-group">
            <label className="form-label" id="avatar-label">
              {t('choose_companion')}
            </label>
            <div
              className="avatar-picker-grid"
              role="radiogroup"
              aria-labelledby="avatar-label"
            >
              {DEFAULT_AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  role="radio"
                  aria-checked={avatar === av}
                  className={`avatar-option-btn ${avatar === av ? 'selected' : ''}`}
                  onClick={() => setAvatar(av)}
                >
                  <span className="avatar-emoji">{av}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Child Name & Age */}
          <div className="form-row two-cols">
            <div className="form-group">
              <label htmlFor="child-name-input" className="form-label required">
                {t('child_name')}
              </label>
              <input
                ref={nameInputRef}
                id="child-name-input"
                type="text"
                className="form-input"
                placeholder={t('hero_name_placeholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="child-age-select" className="form-label required">
                {t('child_age')}
              </label>
              <select
                id="child-age-select"
                className="form-select"
                value={age}
                onChange={(e) => handleAgeChange(e.target.value)}
                disabled={isSubmitting}
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reading Level & Language */}
          <div className="form-row two-cols">
            <div className="form-group">
              <label htmlFor="child-reading-level" className="form-label">
                {t('select_reading_level')}
              </label>
              <select
                id="child-reading-level"
                className="form-select"
                value={readingLevel}
                onChange={(e) => setReadingLevel(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="beginner">{t('reading_level_beginner')}</option>
                <option value="intermediate">{t('reading_level_intermediate')}</option>
                <option value="advanced">{t('reading_level_advanced')}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="child-pref-lang" className="form-label">
                {t('preferred_language')}
              </label>
              <select
                id="child-pref-lang"
                className="form-select"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                disabled={isSubmitting}
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interests & Passions */}
          <div className="form-group">
            <label className="form-label" id="interests-label">
              {t('interests_hobbies')}
            </label>
            <div
              className="interests-chip-cloud"
              role="group"
              aria-labelledby="interests-label"
            >
              {INTEREST_SUGGESTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest)
                return (
                  <button
                    key={interest}
                    type="button"
                    className={`interest-chip-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleInterest(interest)}
                    aria-pressed={isSelected}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {interest}
                  </button>
                )
              })}
            </div>

            <div className="custom-interest-row">
              <input
                type="text"
                className="form-input custom-interest-input"
                placeholder={t('interests_hobbies')}
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                maxLength={40}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddCustomInterest}
                disabled={!customInterest.trim() || isSubmitting}
              >
                +
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="add-child-modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!name.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  <span>{t('saving')}</span>
                </>
              ) : (
                t('save_profile')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
