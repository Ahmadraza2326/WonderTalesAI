import { cameraPresets, type CameraPresetDefinition } from './cameraPresets'
import { SceneCategory } from './sceneTypes'

export interface SceneDirectionMetadata {
  category: SceneCategory
  cameraPreset: CameraPresetDefinition
  lighting: string
  mood: string
  composition: string
  visualEmphasis: string
}

export interface SceneDirectorInput {
  sceneDescription?: string
  categoryHint?: SceneCategory
  characterCount?: number
  isAction?: boolean
  isEmotional?: boolean
  isDreamlike?: boolean
  isQuiet?: boolean
}

export class SceneDirector {
  analyze(input: SceneDirectorInput): SceneDirectionMetadata {
    const category = this.selectCategory(input)
    const cameraPreset = this.selectCameraPreset(input)

    return {
      category,
      cameraPreset,
      lighting: this.selectLighting(input),
      mood: this.selectMood(input),
      composition: this.selectComposition(input),
      visualEmphasis: this.selectVisualEmphasis(input),
    }
  }

  private selectCategory(input: SceneDirectorInput): SceneCategory {
    if (input.categoryHint) {
      return input.categoryHint
    }

    if (input.isAction) {
      return SceneCategory.ACTION
    }

    if (input.isEmotional) {
      return SceneCategory.EMOTIONAL
    }

    if (input.isDreamlike) {
      return SceneCategory.FANTASY
    }

    if (input.isQuiet) {
      return SceneCategory.BEDTIME
    }

    if ((input.characterCount ?? 0) > 2) {
      return SceneCategory.CONVERSATION
    }

    return SceneCategory.DISCOVERY
  }

  private selectCameraPreset(input: SceneDirectorInput): CameraPresetDefinition {
    if (input.isAction) {
      return cameraPresets['Low Angle']
    }

    if (input.isDreamlike) {
      return cameraPresets['Establishing Shot']
    }

    if (input.isQuiet) {
      return cameraPresets['Close-up']
    }

    if ((input.characterCount ?? 0) > 2) {
      return cameraPresets['Medium Shot']
    }

    return cameraPresets['Wide Shot']
  }

  private selectLighting(input: SceneDirectorInput): string {
    if (input.isDreamlike) {
      return 'Soft, magical lighting with gentle highlights and warm gradients.'
    }

    if (input.isEmotional) {
      return 'Balanced lighting with subtle shadows to support sentiment.'
    }

    if (input.isAction) {
      return 'Dynamic contrast with strong highlights and dramatic shadows.'
    }

    return 'Clear, calm lighting with even exposure and natural warmth.'
  }

  private selectMood(input: SceneDirectorInput): string {
    if (input.isDreamlike) {
      return 'Wonder-filled and imaginative.'
    }

    if (input.isEmotional) {
      return 'Tender and reflective.'
    }

    if (input.isAction) {
      return 'Energetic and adventurous.'
    }

    return 'Gentle and inviting.'
  }

  private selectComposition(input: SceneDirectorInput): string {
    if (input.isAction) {
      return 'Strong leading lines and directional movement across the frame.'
    }

    if (input.isQuiet) {
      return 'Minimal composition with calm negative space and centered focus.'
    }

    return 'Balanced composition with clear focal interest and supporting context.'
  }

  private selectVisualEmphasis(input: SceneDirectorInput): string {
    if (input.isDreamlike) {
      return 'Highlight magical details and storybook atmosphere.'
    }

    if (input.isEmotional) {
      return 'Focus on facial expression and emotional connection.'
    }

    if (input.isAction) {
      return 'Emphasize motion, urgency, and momentum.'
    }

    return 'Highlight the most important character or object in the scene.'
  }
}
