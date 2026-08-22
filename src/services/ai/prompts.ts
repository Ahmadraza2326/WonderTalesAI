import type { StoryRecord } from '../../types/story'
import { getLearningPackageSchemaPrompt } from './schemaToPrompt'
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

function getLanguageGuidelines(language?: string): string {
  if (!language) return ''
  const langLower = language.toLowerCase()
  if (langLower.includes('urdu') || langLower === 'ur' || langLower === 'ur-pk') {
    return `
Language & Orthography Guidelines for Urdu (اردو):
- The entire story, title, vocabulary words, explanations, reflection questions, and parent guide MUST be written in beautiful, natural, child-friendly Pakistani Urdu using standard Urdu script (اردو رسم الخط).
- Do NOT use Roman Urdu or Latin transliteration.
- Do NOT use Hindi vocabulary or Arabic-only phrasing where natural Urdu is standard.
- The tone must be warm, expressive, grammatically correct, and suitable for parents reading aloud to children.
`
  }
  if (langLower.includes('arabic') || langLower === 'ar' || langLower === 'ar-sa') {
    return `
Language & Orthography Guidelines for Arabic (العربية):
- The entire story, title, vocabulary words, explanations, reflection questions, and parent guide MUST be written in modern standard Arabic (الفصحى) using Arabic script.
- Ensure warm, engaging, child-friendly narrative tone.
`
  }
  return `
Language Guidelines:
- The story narrative, dialogue, and learning content MUST be written in ${language}.
`
}

function getStoryLengthRules(length?: string): string {
  if (length === 'short') {
    return 'Story Length: Short (Generate approximately 300-500 words. The story must be concise but fully formed.)'
  } else if (length === 'medium') {
    return 'Story Length: Medium (Generate approximately 600-800 words. The story must have a developed middle section.)'
  } else if (length === 'long') {
    return 'Story Length: Long (Generate approximately 900-1200 words. The story must be detailed, highly descriptive, and expansive.)'
  }
  return 'Story Length: Medium'
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
${getLanguageGuidelines(story.language)}

Theme:
${story.theme}

Characters:
${story.characters}

Moral:
${story.moral}

${getStoryLengthRules(story.story_length)}

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
${getLanguageGuidelines(story.language)}

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

export function buildTranslationPrompt(
  story: StoryRecord,
  targetLocale: { name: string; nativeName: string; bcp47: string; code: string }
): string {
  const originalNarrative = story.learning_package?.story || story.story_content || ''

  return `
${SYSTEM_PROMPT}

You are an expert children's literary translator for ORBIS.

Translate the following original children's story and learning package faithfully into ${targetLocale.name} (${targetLocale.nativeName}, locale: ${targetLocale.bcp47}).

Translation & Orthography Rules:
- Translate ONLY from the canonical original story provided below.
- Preserve the exact storyline, character names, warmth, moral values, and educational intent.
- Make the language natural, fluent, and captivating for young listeners and readers.
- Do NOT abbreviate, shorten, summarize, or omit any scenes or educational activities.
${getLanguageGuidelines(targetLocale.name)}

Return ONLY valid JSON matching the exact schema below.
Do not wrap in markdown or \`\`\`json.

${getLearningPackageSchemaPrompt()}

=== CANONICAL ORIGINAL STORY TO TRANSLATE ===
Original Title: ${story.title}
Original Child Hero: ${story.child_name} (Age: ${story.child_age})
Original Theme: ${story.theme}
Original Moral: ${story.moral}
Original Characters: ${story.characters}
Original Narrative:
${originalNarrative}
`
}