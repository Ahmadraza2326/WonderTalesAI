import type { StoryRecord } from '../../types/story'
import type { LifeSkill } from '../../services/ai/learningPackage'

interface LifeSkillsSectionProps {
  story: StoryRecord
}

export function LifeSkillsSection({
  story,
}: LifeSkillsSectionProps) {
  const lifeSkills = story.learning_package?.lifeSkills

  if (!lifeSkills || lifeSkills.length === 0) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>🌱 Life Skills</h3>

      {lifeSkills.map(
        (skill: LifeSkill, index: number) => (
          <div
            key={index}
            style={{
              marginBottom: index === lifeSkills.length - 1 ? 0 : '1rem',
            }}
          >
            <h4>{skill.skill}</h4>

            {skill.explanation ? <p>{skill.explanation}</p> : null}
          </div>
        )
      )}
    </section>
  )
}