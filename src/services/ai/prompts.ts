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

${SAFETY_RULES}

Return ONLY the story text.
`
}