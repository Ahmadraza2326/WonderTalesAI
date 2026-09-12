import React, { memo, useState } from 'react'
import type { StoryRecord } from '../../types/story'

interface IllustrationGalleryProps {
  story: StoryRecord
}

interface ImageAsset {
  scene: number
  imageUrl: string
  caption?: string
}

export const IllustrationGallery = memo(function IllustrationGallery({
  story,
}: IllustrationGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null)

  // Collect any actual rendered image assets from learning package illustrations
  const validImages: ImageAsset[] = []

  const illustrations = story.learning_package?.illustrations
  if (Array.isArray(illustrations)) {
    illustrations.forEach((item, idx) => {
      const itemWithUrl = item as unknown as { image_url?: string; imageUrl?: string; url?: string; prompt?: string; scene?: number }
      const resolvedUrl = itemWithUrl.image_url || itemWithUrl.imageUrl || itemWithUrl.url
      if (resolvedUrl && typeof resolvedUrl === 'string' && (resolvedUrl.startsWith('http') || resolvedUrl.startsWith('data:'))) {
        validImages.push({
          scene: typeof itemWithUrl.scene === 'number' ? itemWithUrl.scene : idx + 1,
          imageUrl: resolvedUrl,
          caption: itemWithUrl.prompt || `Scene ${idx + 1}`,
        })
      }
    })
  }

  // If NO actual image assets exist, hide the gallery entirely (do NOT show text-only placeholders)
  if (validImages.length === 0) {
    return null
  }

  return (
    <section className="card-panel illustration-gallery-section" aria-labelledby="illustration-gallery-heading">
      <div className="illustration-gallery-header">
        <h3 id="illustration-gallery-heading">🖼️ Story Illustrations ({validImages.length})</h3>
        <p className="text-muted">Artwork created for this story</p>
      </div>

      <div className="illustration-thumbnail-grid">
        {validImages.map((image) => (
          <button
            key={image.scene}
            type="button"
            className="illustration-thumbnail-card"
            onClick={() => setSelectedImage(image)}
            title={`View Scene ${image.scene} in full`}
          >
            <div className="thumbnail-frame">
              <img src={image.imageUrl} alt={image.caption || `Scene ${image.scene}`} loading="lazy" />
            </div>
            <span className="thumbnail-label">Scene {image.scene}</span>
          </button>
        ))}
      </div>

      {/* Modal / Lightbox for focused illustration */}
      {selectedImage ? (
        <div
          className="illustration-lightbox-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImage(null)}
        >
          <div className="illustration-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <h4>Scene {selectedImage.scene}</h4>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setSelectedImage(null)}
                aria-label="Close image preview"
              >
                ✕
              </button>
            </div>
            <img src={selectedImage.imageUrl} alt={selectedImage.caption || `Scene ${selectedImage.scene}`} />
            {selectedImage.caption ? <p className="lightbox-caption">{selectedImage.caption}</p> : null}
          </div>
        </div>
      ) : null}
    </section>
  )
})