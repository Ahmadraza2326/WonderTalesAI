export const CameraPreset = {
  ESTABLISHING_SHOT: 'Establishing Shot',
  CLOSE_UP: 'Close-up',
  MEDIUM_SHOT: 'Medium Shot',
  WIDE_SHOT: 'Wide Shot',
  OVER_THE_SHOULDER: 'Over-the-Shoulder',
  BIRDS_EYE_VIEW: "Bird's-eye View",
  LOW_ANGLE: 'Low Angle',
  HIGH_ANGLE: 'High Angle',
} as const

export type CameraPreset = (typeof CameraPreset)[keyof typeof CameraPreset]

export interface CameraPresetDefinition {
  name: CameraPreset
  framing: string
  focus: string
}

export const cameraPresets: Record<CameraPreset, CameraPresetDefinition> = {
  [CameraPreset.ESTABLISHING_SHOT]: {
    name: CameraPreset.ESTABLISHING_SHOT,
    framing: 'Wide environment framing that introduces the setting.',
    focus: 'Establish the world, scale, and spatial context.',
  },
  [CameraPreset.CLOSE_UP]: {
    name: CameraPreset.CLOSE_UP,
    framing: 'Tight framing around the subject\'s face or hands.',
    focus: 'Emphasize emotion, detail, and intimacy.',
  },
  [CameraPreset.MEDIUM_SHOT]: {
    name: CameraPreset.MEDIUM_SHOT,
    framing: 'Balanced framing showing the subject and some surroundings.',
    focus: 'Highlight character presence and simple interaction.',
  },
  [CameraPreset.WIDE_SHOT]: {
    name: CameraPreset.WIDE_SHOT,
    framing: 'Broader composition with visible context and movement.',
    focus: 'Capture relationships between characters and environment.',
  },
  [CameraPreset.OVER_THE_SHOULDER]: {
    name: CameraPreset.OVER_THE_SHOULDER,
    framing: 'View from behind one character looking toward another.',
    focus: 'Strengthen perspective and dialogue tension.',
  },
  [CameraPreset.BIRDS_EYE_VIEW]: {
    name: CameraPreset.BIRDS_EYE_VIEW,
    framing: 'Top-down composition revealing layout and patterns.',
    focus: 'Show structure, symmetry, or strategic placement.',
  },
  [CameraPreset.LOW_ANGLE]: {
    name: CameraPreset.LOW_ANGLE,
    framing: 'Low perspective that makes the subject feel dominant.',
    focus: 'Create power, drama, or wonder.',
  },
  [CameraPreset.HIGH_ANGLE]: {
    name: CameraPreset.HIGH_ANGLE,
    framing: 'High perspective looking down on the subject.',
    focus: 'Suggest vulnerability, distance, or quiet observation.',
  },
}
