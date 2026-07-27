import { useState } from 'react'

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
  childAge: '',
  language: 'English',
  theme: '',
  moral: '',
  characters: '',
  storyLength: 'short',
  readingLevel: 'beginner',
}

export function StoryForm({ onSubmit, isSubmitting = false, successMessage, errorMessage }: StoryFormProps) {
  const [values, setValues] = useState<StoryFormValues>(initialValues)
  const [errors, setErrors] = useState<StoryFormErrors>({})

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }))
  }

  function validate(valuesToValidate: StoryFormValues) {
    const nextErrors: StoryFormErrors = {}

    if (!valuesToValidate.title.trim()) {
      nextErrors.title = 'Please enter a story title.'
    }

    if (!valuesToValidate.childName.trim()) {
      nextErrors.childName = 'Please enter the child name.'
    }

    if (!valuesToValidate.childAge.trim()) {
      nextErrors.childAge = 'Please enter the child age.'
    }

    if (!valuesToValidate.theme.trim()) {
      nextErrors.theme = 'Please enter a story theme.'
    }

    if (!valuesToValidate.moral.trim()) {
      nextErrors.moral = 'Please enter a moral lesson.'
    }

    if (!valuesToValidate.characters.trim()) {
      nextErrors.characters = 'Please list the main characters.'
    }

    return nextErrors
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    await onSubmit(values)
  }

  return (
    <form className="story-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="field-group">
          <label htmlFor="title">Story Title</label>
          <input id="title" name="title" value={values.title} onChange={handleChange} />
          {errors.title ? <p className="field-error">{errors.title}</p> : null}
        </div>

        <div className="field-group">
          <label htmlFor="childName">Child Name</label>
          <input id="childName" name="childName" value={values.childName} onChange={handleChange} />
          {errors.childName ? <p className="field-error">{errors.childName}</p> : null}
        </div>

        <div className="field-group">
          <label htmlFor="childAge">Child Age</label>
          <input id="childAge" name="childAge" type="number" min="1" max="16" value={values.childAge} onChange={handleChange} />
          {errors.childAge ? <p className="field-error">{errors.childAge}</p> : null}
        </div>

        <div className="field-group">
          <label htmlFor="language">Language</label>
          <select id="language" name="language" value={values.language} onChange={handleChange}>
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="theme">Theme</label>
          <input id="theme" name="theme" value={values.theme} onChange={handleChange} />
          {errors.theme ? <p className="field-error">{errors.theme}</p> : null}
        </div>

        <div className="field-group">
          <label htmlFor="moral">Moral Lesson</label>
          <input id="moral" name="moral" value={values.moral} onChange={handleChange} />
          {errors.moral ? <p className="field-error">{errors.moral}</p> : null}
        </div>

        <div className="field-group">
          <label htmlFor="characters">Characters</label>
          <textarea id="characters" name="characters" rows={3} value={values.characters} onChange={handleChange} />
          {errors.characters ? <p className="field-error">{errors.characters}</p> : null}
        </div>

        <div className="field-group">
          <label htmlFor="storyLength">Story Length</label>
          <select id="storyLength" name="storyLength" value={values.storyLength} onChange={handleChange}>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="readingLevel">Reading Level</label>
          <select id="readingLevel" name="readingLevel" value={values.readingLevel} onChange={handleChange}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {successMessage ? <p className="form-status success">{successMessage}</p> : null}
      {errorMessage ? <p className="form-status error">{errorMessage}</p> : null}

      <button type="submit" className="button button-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save Story'}
      </button>
    </form>
  )
}
