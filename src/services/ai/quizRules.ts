export const QUIZ_RULES = `
Generate 5 quiz questions.

Requirements:

- Mix different question types:
  - Recall
  - Understanding
  - Reasoning
  - Moral
  - Vocabulary

Each question must include:

- question
- answer
- options (4)
- explanation

Rules:

- Only one correct answer.
- Wrong answers should be believable.
- Explanations should teach, not just reveal the answer.
- Keep language appropriate for the child's age.
`;