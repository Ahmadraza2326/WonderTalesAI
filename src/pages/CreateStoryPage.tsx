import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { StoryForm, type StoryFormValues } from '../components/ui/StoryForm'
import { useAuth } from '../context/AuthContext'
import { storyService } from '../services/storyService'

export function CreateStoryPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(values: StoryFormValues) {
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    if (!user) {
      setErrorMessage('You must be signed in to save a story.')
      setIsSubmitting(false)
      return
    }

    const { data, error } = await storyService.createStory(user.id, values)

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return
    }

    setSuccessMessage('Story draft created successfully!')
    setIsSubmitting(false)

    if (data?.id) {
      navigate(`/stories/${data.id}`)
    } else {
      navigate('/stories', { replace: true })
    }
  }

  return (
    <PageContainer
      title="ORBIS Story Studio"
      intro="Create a personalized tale for your child with our guided storytelling wizard."
    >
      <StoryForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
    </PageContainer>
  )
}
