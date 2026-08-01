import type { StoryDNA } from './storyDNA'
import { extractIllustrationScenes } from './sceneIntelligence'

export interface IllustrationPrompt {
  scene: number
  title: string
  prompt: string
}

function buildStyleGuide() {
  return `
Children's storybook illustration.
Pixar-quality.
Warm cinematic lighting.
Highly detailed.
Soft painterly textures.
Family friendly.
Expressive facial emotions.
Consistent character appearance.
Rich colorful environments.
No text.
No watermark.
High quality digital illustration.
`
}

function buildNegativePrompt() {
  return `
low quality,
blurry,
distorted face,
extra fingers,
cropped,
watermark,
logo,
text,
signature,
duplicate characters,
poor anatomy,
ugly,
dark image
`
}

export function generateIllustrationPrompts(
  storyDNA: StoryDNA
): IllustrationPrompt[] {
  const styleGuide = buildStyleGuide()

  const scenes =
    extractIllustrationScenes(storyDNA)

  return scenes.map(scene => ({
    scene: scene.scene,

    title: scene.title,

    prompt: `
${styleGuide}

Theme:
${storyDNA.theme}

Scene:
${scene.description}

Characters:
${scene.characters.join(', ')}

Location:
${scene.location}

Emotion:
${scene.emotion}

Important Objects:
${storyDNA.importantObjects.join(', ')}

Negative Prompt:
${buildNegativePrompt()}
`.trim(),
  }))
}