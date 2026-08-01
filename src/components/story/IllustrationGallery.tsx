import type { StoryRecord } from '../../types/story'

interface IllustrationGalleryProps {
  story: StoryRecord
}

export function IllustrationGallery({
  story,
}: IllustrationGalleryProps) {
  const illustrations =
    story.learning_package?.illustrations

  if (
    !illustrations ||
    illustrations.length === 0
  ) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>🖼️ Illustration Gallery</h3>

      {illustrations.map(
        (
          illustration: {
            scene: number
            prompt: string
          },
          index: number
        ) => (
          <div
            key={index}
            style={{
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #ddd',
            }}
          >
            <h4>
              Scene {illustration.scene}
            </h4>

            <p>{illustration.prompt}</p>
          </div>
        )
      )}
    </section>
  )
}