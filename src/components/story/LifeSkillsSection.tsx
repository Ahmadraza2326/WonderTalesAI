import type { StoryRecord } from '../../types/story'

interface LifeSkillsSectionProps {
  story: StoryRecord
}

export function LifeSkillsSection({
  story,
}: LifeSkillsSectionProps) {
  const lifeSkills =
    story.learning_package?.lifeSkills

  if (!lifeSkills || lifeSkills.length === 0) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>🌱 Life Skills</h3>

      {lifeSkills.map(
        (skill: any, index: number) => (
          <div
            key={index}
            style={{
              marginBottom: '1rem',
            }}
          >
            <h4>{skill.skill}</h4>

            <p>{skill.description}</p>
          </div>
        )
      )}
    </section>
  )
}