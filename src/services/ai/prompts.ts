import type { StoryRecord } from '../../types/story'

const SYSTEM_ROLE = `
You are an expert children's author.
`

const SAFETY_RULES = `
Rules:

- Safe for children.
- Educational.
- Positive ending.
- Funny where appropriate.
- Age appropriate.
- Include dialogue.
- End with the moral naturally.
`

const OUTPUT_RULES = `
Write naturally.

Do not use headings.

Do not use bullet points.

Do not explain the moral.

Show the moral through the characters' actions.

Return only the story text.
`

const LEARNING_PACKAGE_RULES = `
You are generating an Orbis Learning Package.

The response must follow this exact order:

1. Story

2. === STORY DNA ===

Theme:
Characters:
Vocabulary:
Key Events:
Educational Concepts:
Emotions:

Only include the sections above.

Do not add anything else.
`

function getAgeRules(age: number): string {
  if (age <= 5) {
    return `
Age Guidelines:
- Use very short sentences.
- Repeat important words.
- Keep the story playful.
- Introduce 3–5 simple vocabulary words.
- Use a very happy ending.
`
  }

  if (age <= 8) {
    return `
Age Guidelines:
- Use simple dialogue.
- Include one adventure or mystery.
- Introduce 5–8 new vocabulary words.
- Keep the story exciting but easy to follow.
- End with a meaningful lesson.
`
  }

  return `
Age Guidelines:
- Use richer descriptions.
- Include a stronger plot.
- Introduce advanced vocabulary naturally.
- Encourage curiosity and critical thinking.
- End with an inspiring conclusion.
`
}

export function buildStoryPrompt(story: StoryRecord): string {
  return `
${SYSTEM_ROLE}

Write ONE original children's story.

Requirements:

Title:
${story.title}

Child Name:
${story.child_name}

Child Age:
${story.child_age}

Language:
${story.language}

Theme:
${story.theme}

Characters:
${story.characters}

Moral:
${story.moral}

Story Length:
${story.story_length}

Reading Level:
${story.reading_level}

${getAgeRules(Number(story.child_age ?? 7))}

${SAFETY_RULES}

${OUTPUT_RULES}

${LEARNING_PACKAGE_RULES}
`
}