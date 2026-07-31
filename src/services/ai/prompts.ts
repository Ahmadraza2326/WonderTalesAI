import type { StoryRecord } from '../../types/story'
import { getLearningPackageSchemaPrompt } from './schemaToPrompt.ts'
import { EDUCATION_RULES } from './educationRules'
import { VOCABULARY_RULES } from './vocabularyRules'
import { QUIZ_RULES } from './quizRules'

const SYSTEM_PROMPT = `
You are Orbis AI.

You are one of the world's best children's educational storytellers.

Your goal is to create stories that are:

- Safe
- Educational
- Creative
- Emotionally engaging
- Age appropriate

Never generate harmful, frightening, violent or inappropriate content.

Always encourage curiosity, kindness and learning.
`

const STORY_RULES = `
Writing Rules:

- Write naturally.
- Include dialogue.
- Do not use headings.
- Do not use bullet points.
- Show the moral through actions.
- End positively.
- Make the story memorable.

Output Rules:

- Return only the requested content.
- Follow the requested structure exactly.
`

const STORY_DNA_RULES = `
Generate Story DNA.

Include:

- Title
- Moral
- Theme
- Characters
- Locations
- Important Objects
- Key Events
- Vocabulary
- Emotions
- Educational Concepts
`

const READING_SKILLS_RULES = `
Generate 2–4 reading skills.

Each skill must include:

- skill
- explanation
`

const LIFE_SKILLS_RULES = `
Generate 2–4 life skills.

Each skill must include:

- skill
- explanation
`

const CRITICAL_THINKING_RULES = `
Generate 2 thoughtful questions.

Do not ask simple recall questions.

Encourage reasoning.
`

function getAgeRules(age: number): string {
  if (age <= 5) {
    return `
Age Guidelines:

- Very short sentences.
- Simple vocabulary.
- Repetition is encouraged.
- Happy ending.
`
  }

  if (age <= 8) {
    return `
Age Guidelines:

- Simple dialogue.
- Small adventure.
- Easy vocabulary.
- Clear lesson.
`
  }

  return `
Age Guidelines:

- Rich descriptions.
- Larger adventure.
- More advanced vocabulary.
- Encourage imagination.
`
}

function buildStoryRequest(story: StoryRecord): string {
  return `
Generate one original children's story.

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

After the story write exactly:

=== STORY DNA ===

Theme:
Characters:
Vocabulary:
Key Events:
Educational Concepts:
Emotions:
`
}

export function buildStoryPrompt(story: StoryRecord): string {
  return `
${SYSTEM_PROMPT}

${STORY_RULES}

${buildStoryRequest(story)}
`
}

export function buildLearningPackagePrompt(
  story: StoryRecord
): string {
  return `
${SYSTEM_PROMPT}

${STORY_RULES}

${STORY_DNA_RULES}

${READING_SKILLS_RULES}

${LIFE_SKILLS_RULES}

${CRITICAL_THINKING_RULES}

${EDUCATION_RULES}

${VOCABULARY_RULES}

${QUIZ_RULES}

Generate ONE complete Learning Package.

Return ONLY valid JSON.

Do not wrap the JSON in markdown.

Do not use \`\`\`json.

The JSON must exactly match this schema:

${getLearningPackageSchemaPrompt()}

Story Requirements

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
`
}