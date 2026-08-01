import type { StoryRecord } from '../../types/story'

interface QuizSectionProps {
  story: StoryRecord
}

export function QuizSection({
  story,
}: QuizSectionProps) {
  const quiz = story.learning_package?.quizSeeds

  if (!quiz || quiz.length === 0) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>📝 Quiz</h3>

      {quiz.map((item: any, index: number) => (
        <div
          key={index}
          style={{
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #ddd',
          }}
        >
          <h4>
            Question {index + 1}
          </h4>

          <p>{item.question}</p>

          <ul>
            {item.options?.map(
              (
                option: string,
                optionIndex: number
              ) => (
                <li key={optionIndex}>
                  {option}
                </li>
              )
            )}
          </ul>

          <p>
            <strong>Answer:</strong>{' '}
            {item.answer}
          </p>

          {item.explanation && (
            <p>
              <strong>Explanation:</strong>{' '}
              {item.explanation}
            </p>
          )}
        </div>
      ))}
    </section>
  )
}