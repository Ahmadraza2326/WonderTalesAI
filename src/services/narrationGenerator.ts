import type { StoryRecord } from '../types/story'
import type { StoryNarration } from '../types/narration'

/**
 * NarrationGenerator is responsible for transforming a StoryRecord 
 * into a structured StoryNarration object.
 */
export async function generateNarration(
  story: StoryRecord
): Promise<StoryNarration> {
  // Extract story content, defaulting to empty if not present
  const storyContent = story.story_content ?? '';
  
  // Deterministically split the story into segments for narration.
  // For now, we split by paragraphs to create simple narration segments.
  const paragraphs = storyContent
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const segments = paragraphs.map((text, index) => ({
    id: index + 1,
    text: text,
    speaker: 'Narrator',
    emotion: 'neutral',
  }));

  return {
    title: story.title,
    language: story.language ?? 'en',
    segments: segments,
  };
}
