export const VOCABULARY_RULES = `
Generate between 5 and 8 vocabulary words.

For every vocabulary word include:

- word
- meaning
- difficulty
- partOfSpeech
- example
- synonym

Rules:

- Words must naturally appear in the story.
- Meanings must be child-friendly.
- Examples should be different from the original sentence.
- Difficulty must be one of:
  easy
  medium
  hard
- Synonyms should also be child-friendly.
`