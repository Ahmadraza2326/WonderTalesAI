import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { StoryForm } from '../components/ui/StoryForm'
import { authService } from '../services/authService'
import { storyService } from '../services/storyService'

type StoryFormValues = {
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

export function CreateStoryPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(values: StoryFormValues) {
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    const { data: authData } = await authService.getUser()
    const user = authData?.user

    if (!user) {
      setErrorMessage('You must be signed in to save a story.')
      setIsSubmitting(false)
      return
    }

    const { error } = await storyService.createStory(user.id, values)

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return
    }

    setSuccessMessage('Story saved successfully.')
    setIsSubmitting(false)
    navigate('/stories', { replace: true })
  }

  return (
    <PageContainer title="Create Story" intro="Create a personalized story draft for your child and save it to your workspace.">
      <StoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} successMessage={successMessage} errorMessage={errorMessage} />
    </PageContainer>
  )
}
