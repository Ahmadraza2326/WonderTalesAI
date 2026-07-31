import type { StoryRecord } from '../../types/story'
import type { VocabularyWord } from '../../services/ai/storyDNA'

interface VocabularySectionProps {
  story: StoryRecord
}

export function VocabularySection({
  story,
}: VocabularySectionProps) {
  const vocabulary = story.learning_package?.vocabulary

  if (!vocabulary || vocabulary.length === 0) {
    return null
  }

  return (
    <section className="card-panel">
      <h3>📖 Vocabulary</h3>

      {vocabulary.map(
        (word: VocabularyWord, index: number) => (
          <div
            key={index}
            style={{
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #ddd',
            }}
          >
            <h4>{word.word}</h4>

            <p>
              <strong>Meaning:</strong>{' '}
              {word.meaning ?? '—'}
            </p>

            <p>
              <strong>Difficulty:</strong>{' '}
              {word.difficulty ?? '—'}
            </p>

            <p>
              <strong>Example:</strong>{' '}
              {word.example ?? '—'}
            </p>

            <p>
              <strong>Synonym:</strong>{' '}
              {word.synonym ?? '—'}
            </p>
          </div>
        )
      )}
    </section>
  )
}