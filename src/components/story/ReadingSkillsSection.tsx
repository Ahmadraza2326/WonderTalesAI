import type { StoryRecord } from '../../types/story'
import type { ReadingSkill } from '../../services/ai/learningPackage'

interface ReadingSkillsSectionProps {
  story: StoryRecord
}

export function ReadingSkillsSection({
  story,
}: ReadingSkillsSectionProps) {
  const readingSkills =
    story.learning_package?.readingSkills

  if (!readingSkills || readingSkills.length === 0) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>📚 Reading Skills</h3>

      {readingSkills.map(
        (
          skill: ReadingSkill,
          index: number
        ) => (
          <div
            key={index}
            style={{
              marginBottom: '1rem',
            }}
          >
            <h4>{skill.skill}</h4>

            <p>{skill.explanation}</p>
          </div>
        )
      )}
    </section>
  )
}