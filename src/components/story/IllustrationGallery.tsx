import { memo } from 'react'
import type { StoryRecord } from '../../types/story'
import type { IllustrationPrompt } from '../../services/ai/learningPackage'

interface IllustrationGalleryProps {
  story: StoryRecord
}

export const IllustrationGallery = memo(function IllustrationGallery({
  story,
}: IllustrationGalleryProps) {
  const illustrations = story.learning_package?.illustrations

  if (!illustrations || !Array.isArray(illustrations) || illustrations.length === 0) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>🖼️ Illustration Gallery</h3>

      {illustrations.map(
        (illustration: IllustrationPrompt, index: number) => {
          const sceneNumber = typeof illustration.scene === 'number' ? illustration.scene : index + 1
          const promptText = illustration.prompt ?? ''

          return (
            <div
              key={index}
              style={{
                marginBottom: index === illustrations.length - 1 ? 0 : '1rem',
                paddingBottom: index === illustrations.length - 1 ? 0 : '1rem',
                borderBottom: index === illustrations.length - 1 ? 'none' : '1px solid var(--border, #ddd)',
              }}
            >
              <h4>Scene {sceneNumber}</h4>

              {promptText ? <p>{promptText}</p> : null}
            </div>
          )
        }
      )}
    </section>
  )
})