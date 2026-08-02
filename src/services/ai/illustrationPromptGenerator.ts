import { buildCharacterProfiles, type CharacterProfile } from './characterConsistency'
import { buildLocationProfiles, type LocationProfile } from './storyWorldBuilder'
import type { StoryDNA } from './storyDNA'
import { extractIllustrationScenes } from './sceneIntelligence'
import { SceneDirector } from './sceneDirector/SceneDirector'
import { composeIllustrationPrompt } from './promptComposer'

export interface IllustrationPrompt {
  scene: number
  title: string
  prompt: string
  characterProfiles?: CharacterProfile[]
  locationProfiles?: LocationProfile[]
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
  const characterProfiles = buildCharacterProfiles(storyDNA)
  const locationProfiles = buildLocationProfiles(storyDNA)
  const sceneDirector = new SceneDirector()

  const scenes =
    extractIllustrationScenes(storyDNA)

  return scenes.map(scene => {
    const sceneDirection = sceneDirector.analyze({
      sceneDescription: scene.description,
      characterCount: scene.characters.length,
      isAction: /adventure|chase|fight|race|explore|pursuit/i.test(scene.description),
      isEmotional: /sad|happy|love|fear|hope|comfort|friend/i.test(scene.description),
      isDreamlike: /magic|dream|enchanted|fantasy|moon|star|wish/i.test(scene.description),
      isQuiet: /sleep|bedtime|calm|quiet|soft|gentle/i.test(scene.description),
    })

    const basePrompt = `
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
`.trim()

    const composedPrompt = composeIllustrationPrompt({
      illustrationPrompt: basePrompt,
      characterProfiles,
      locationProfiles,
    })

    return {
      scene: scene.scene,
      title: scene.title,
      prompt: `${composedPrompt}

Scene direction:
Category: ${sceneDirection.category}
Camera: ${sceneDirection.cameraPreset.name}
Lighting: ${sceneDirection.lighting}
Mood: ${sceneDirection.mood}
Composition: ${sceneDirection.composition}
Visual emphasis: ${sceneDirection.visualEmphasis}`.trim(),
      characterProfiles,
      locationProfiles,
    }
  })
}