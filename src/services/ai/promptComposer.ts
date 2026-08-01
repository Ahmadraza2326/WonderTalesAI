import type { CharacterProfile } from './characterConsistency'
import type { LocationProfile } from './storyWorldBuilder'

export interface PromptComposerInput {
  illustrationPrompt: string
  characterProfiles: CharacterProfile[]
  locationProfiles: LocationProfile[]
}

export function composeIllustrationPrompt(
  input: PromptComposerInput
): string {
  const basePrompt = input.illustrationPrompt.trim()
  const primaryCharacter = pickPrimaryCharacter(input.characterProfiles)
  const primaryLocation = pickPrimaryLocation(input.locationProfiles)

  const characterLines = input.characterProfiles.length > 0
    ? input.characterProfiles.map(profile => {
        const details = [
          profile.appearance,
          profile.clothing,
          profile.personality,
          profile.artStyle,
        ].filter(Boolean)

        return `- ${profile.name}: ${details.join('; ')}`
      })
    : ['- No character details provided.']

  const locationLines = input.locationProfiles.length > 0
    ? input.locationProfiles.map(profile => {
        const details = [
          profile.environment,
          profile.architecture,
          profile.lighting,
          profile.atmosphere,
          `colors: ${profile.dominantColors.join(', ')}`,
          `objects: ${profile.importantObjects.join(', ')}`,
        ].filter(Boolean)

        return `- ${profile.name}: ${details.join('; ')}`
      })
    : ['- No location details provided.']

  const environment = primaryLocation?.environment ?? 'rich storybook environment'
  const lighting = primaryLocation?.lighting ?? 'warm cinematic lighting'
  const atmosphere = primaryLocation?.atmosphere ?? 'gentle and magical'
  const style = primaryCharacter?.artStyle ?? 'storybook illustration style'

  return [
    basePrompt,
    '',
    'Character consistency:',
    ...characterLines,
    '',
    'Environment and location:',
    ...locationLines,
    '',
    'Environment description:',
    `Render ${environment} with a clear sense of place and believable spatial depth.`,
    '',
    'Camera framing:',
    'Use a medium-wide cinematic composition with the main characters clearly visible and the scene framed for storytelling.',
    '',
    'Lighting:',
    `Apply ${lighting} with soft highlights, strong readability, and balanced contrast.`,
    '',
    'Mood and atmosphere:',
    `Create an ${atmosphere.toLowerCase()} mood that feels inviting, emotional, and polished.`,
    '',
    'Artistic style:',
    `Illustrate in ${style} with painterly texture, expressive faces, rich color, and polished storybook charm.`,
    '',
    'Quality guidance:',
    'Maintain sharp focus, consistent anatomy, vivid color, strong composition, and high-end illustration quality. No text, no watermark, no logo, and no cluttered background.',
    '',
    'Negative prompt:',
    'low quality, blurry, distorted anatomy, extra fingers, cropped framing, text, watermark, logo, duplicate characters, poor composition, dark muddy tones, cluttered background.',
  ].join('\n').trim()
}

function pickPrimaryCharacter(
  characterProfiles: CharacterProfile[]
): CharacterProfile | undefined {
  return characterProfiles[0]
}

function pickPrimaryLocation(
  locationProfiles: LocationProfile[]
): LocationProfile | undefined {
  return locationProfiles[0]
}
