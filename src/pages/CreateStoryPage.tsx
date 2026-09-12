import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { StoryForm, type StoryFormValues } from '../components/ui/StoryForm'
import { StickyBackButton } from '../components/layout/StickyBackButton'
import { StoryGenerationOverlay } from '../components/story/wizard/StoryGenerationOverlay'
import { ParticleField } from '../components/ui/design/ParticleField'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import { storyService } from '../services/storyService'
import { storyOrchestrator } from '../services/StoryOrchestrator'
import { generateStoryBook } from '../services/storybookGenerator'
import { storyAssetCacheService } from '../services/storyAssetCacheService'

export function CreateStoryPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useI18n()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentValues, setCurrentValues] = useState<StoryFormValues | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(values: StoryFormValues) {
    setIsSubmitting(true)
    setCurrentValues(values)
    setSuccessMessage(null)
    setErrorMessage(null)

    if (!user) {
      setErrorMessage(t('auth_intro'))
      setIsSubmitting(false)
      return
    }

    const { data: createdStory, error } = await storyService.createStory(user.id, values)

    if (error || !createdStory) {
      setErrorMessage(error?.message || 'Unable to create story.')
      setIsSubmitting(false)
      return
    }

    try {
      // 1-Click Atomic Pipeline: Weave Complete Tale, Learning Package & Illustrated StoryBook
      let finalizedStory = createdStory
      if (!createdStory.learning_package) {
        try {
          finalizedStory = await storyOrchestrator.generateLearningPackage(createdStory, user.id)
        } catch (orchErr) {
          console.warn('Learning package generation deferred to reader:', orchErr)
        }
      }

      // Generate & cache StoryBook structure for zero-latency reading
      const storyBook = await generateStoryBook(finalizedStory)
      await storyAssetCacheService.saveStoryBook(finalizedStory, user.id, storyBook)

      setSuccessMessage('Magical Tale woven successfully! Launching StoryBook...')
      setIsSubmitting(false)
      navigate(`/stories/${finalizedStory.id}`)
    } catch (pipelineErr) {
      console.warn('Atomic story pipeline encountered non-fatal error, proceeding to reader:', pipelineErr)
      setIsSubmitting(false)
      navigate(`/stories/${createdStory.id}`)
    }
  }

  return (
    <PageContainer
      title={t('story_studio_title')}
      intro={t('story_studio_intro')}
    >
      <StickyBackButton fallbackTo="/overworld" label="Overworld Map" />

      {/* Ambient Celestial Stardust Field */}
      <ParticleField count={24} particleType="stardust" speed={0.4} color="#a855f7" />

      {/* 4-Stage AI Story Generation Overlay */}
      <StoryGenerationOverlay
        isOpen={isSubmitting}
        childName={currentValues?.childName || 'Explorer'}
        storyTitle={currentValues?.title || 'Magical Adventure'}
      />

      <StoryForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
    </PageContainer>
  )
}
