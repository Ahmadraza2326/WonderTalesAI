export const SceneCategory = {
  ADVENTURE: 'Adventure',
  DISCOVERY: 'Discovery',
  CONVERSATION: 'Conversation',
  CELEBRATION: 'Celebration',
  MYSTERY: 'Mystery',
  BEDTIME: 'Bedtime',
  ACTION: 'Action',
  EMOTIONAL: 'Emotional',
  LEARNING: 'Learning',
  FANTASY: 'Fantasy',
} as const

export type SceneCategory = (typeof SceneCategory)[keyof typeof SceneCategory]
