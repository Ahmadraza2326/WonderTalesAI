import type { StoryRecord } from '../../types/story'

interface CreativeActivitySectionProps {
  story: StoryRecord
}

export function CreativeActivitySection({
  story,
}: CreativeActivitySectionProps) {
  const activity = story.learning_package?.creativeActivity

  if (!activity) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>🎨 Creative Activity</h3>

      <h4>{activity.title}</h4>

      <p>{activity.instructions}</p>
    </section>
  )
}