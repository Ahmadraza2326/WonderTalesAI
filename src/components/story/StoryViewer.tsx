import type { StoryRecord } from '../../types/story'

interface StoryViewerProps {
  story: StoryRecord
}

export function StoryViewer({ story }: StoryViewerProps) {
  return (
    <section className="story-main card-panel">
      <div className="story-main__header">
        <h3>Story</h3>
      </div>

      {story.story_content ? (
        <div className="story-content">
          <p>{story.story_content}</p>
        </div>
      ) : (
        <div className="story-empty card-panel">
          <p>No AI story has been generated yet.</p>
        </div>
      )}
    </section>
  )
}