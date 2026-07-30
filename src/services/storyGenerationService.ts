import { getGeminiClient } from './geminiService'
import { buildStoryPrompt } from './ai/prompts'
import type { StoryRecord } from '../types/story'

export async function generateStory(
  story: StoryRecord
): Promise<string> {
  const client = getGeminiClient()

 const prompt = buildStoryPrompt(story)

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