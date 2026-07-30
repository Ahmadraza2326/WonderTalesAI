import { getGeminiClient } from './geminiService'
import type { StoryRecord } from '../types/story'

export async function generateStory(
  story: StoryRecord
): Promise<string> {
  const client = getGeminiClient()

  const prompt = `
You are an expert children's author.

Write ONE original children's story.

Requirements:

Title: ${story.title}

Child Name: ${story.child_name}

Child Age: ${story.child_age}

Language: ${story.language}

Theme: ${story.theme}

Characters:
${story.characters}

Moral:
${story.moral}

Story Length:
${story.story_length}

Reading Level:
${story.reading_level}

Rules:

- Safe for children.
- Educational.
- Positive ending.
- Funny where appropriate.
- Age appropriate.
- Include dialogue.
- End with the moral naturally.

Return ONLY the story text.
`

  const response = await client.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  })

  const text = response.text?.trim()

  if (!text) {
    throw new Error("Gemini returned an empty story.")
  }

  return text
}