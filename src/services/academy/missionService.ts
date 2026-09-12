import type { AcademyMission } from '../../types/academy'

export const DAILY_ACADEMY_MISSIONS: AcademyMission[] = [
  {
    id: 'mission_daily_math_explorer',
    title: 'Daily Math Crystal Hunt',
    description: 'Complete 1 interactive lesson and score 80%+ on any math practice set.',
    badgeIcon: '📐',
    subjectId: 'math',
    xpReward: 80,
    starsReward: 4,
    isCompleted: false,
    tasks: [
      {
        id: 't1',
        label: 'Complete 1 Math Lesson',
        completed: false,
        targetCount: 1,
        currentCount: 0,
        targetType: 'lesson',
        targetId: 'lesson_ten_frames',
      },
      {
        id: 't2',
        label: 'Achieve 80%+ on Math Practice',
        completed: false,
        targetCount: 1,
        currentCount: 0,
        targetType: 'practice',
        targetId: 'practice_ten_frames',
      },
    ],
  },
  {
    id: 'mission_daily_word_alchemist',
    title: 'Word Alchemist Quest',
    description: 'Forge 2 root prefix words in English Language Arts.',
    badgeIcon: '🔥',
    subjectId: 'english',
    xpReward: 70,
    starsReward: 3,
    isCompleted: false,
    tasks: [
      {
        id: 't1',
        label: 'Complete Prefix Morphology Lesson',
        completed: false,
        targetCount: 1,
        currentCount: 0,
        targetType: 'lesson',
        targetId: 'lesson_prefixes_un_re',
      },
      {
        id: 't2',
        label: 'Pass Word Forging Practice',
        completed: false,
        targetCount: 1,
        currentCount: 0,
        targetType: 'practice',
        targetId: 'practice_prefixes_un_re',
      },
    ],
  },
  {
    id: 'mission_daily_robot_coder',
    title: 'Robotic Pathfinder',
    description: 'Write flawless directional algorithm sequences for BEEP-0.',
    badgeIcon: '🤖',
    subjectId: 'computer_science',
    xpReward: 90,
    starsReward: 5,
    isCompleted: false,
    tasks: [
      {
        id: 't1',
        label: 'Complete Sequencing Lesson',
        completed: false,
        targetCount: 1,
        currentCount: 0,
        targetType: 'lesson',
        targetId: 'lesson_sequencing',
      },
      {
        id: 't2',
        label: 'Play Robo-Path Academy Capstone',
        completed: false,
        targetCount: 1,
        currentCount: 0,
        targetType: 'game',
        targetId: 'robopath',
      },
    ],
  },
]

export function getDailyAcademyMissions(): AcademyMission[] {
  return DAILY_ACADEMY_MISSIONS
}
