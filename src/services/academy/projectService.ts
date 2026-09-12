/**
 * ORBis Project-Based Learning Service
 * Manages cross-disciplinary projects that combine Math, Science, Art, Writing, Logic, and Coding.
 */

import type { LearningProject } from '../../types/learningUniverse'

export const LEARNING_PROJECTS: LearningProject[] = [
  {
    id: 'project_space_station',
    title: 'Architect of the Orbital Space Station',
    description: 'Design and build an orbital space habitat balancing mass, life support, and robot repair routes.',
    gradeBands: ['grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6'],
    coverIcon: '🛰️',
    badgeId: 'badge_space_architect',
    badgeTitle: 'Master Orbital Architect',
    guideId: 'davinci',
    milestones: [
      {
        id: 'ms_1_station_blueprints',
        title: 'Step 1: Sketch Station Blueprints (Art & Geometry)',
        domain: 'art',
        taskDescription: 'Draw the modular living ring and solar array panels in the Creative Studio.',
        isCompleted: true,
        route: '/academy/create',
      },
      {
        id: 'ms_2_mass_balance',
        title: 'Step 2: Balance Cargo Mass (Math & Fractions)',
        domain: 'math',
        taskDescription: 'Equally distribute heavy supply containers using fraction fractions on the scale.',
        isCompleted: true,
        route: '/academy/practice/ps_math_fractions',
      },
      {
        id: 'ms_3_life_support',
        title: 'Step 3: Hydroponic Oxygen Garden (Science & Biology)',
        domain: 'science',
        taskDescription: 'Adjust sunlight and water in the Science Lab to produce oxygen for the crew.',
        isCompleted: false,
        route: '/academy/science',
      },
      {
        id: 'ms_4_robot_patrol',
        title: 'Step 4: Program Maintenance Droid (Coding & Algorithms)',
        domain: 'coding',
        taskDescription: 'Sequence BEEP-0 navigation commands around the solar truss without collision.',
        isCompleted: false,
        route: '/playroom/robopath',
      },
    ],
    rewardXP: 100,
    rewardStars: 10,
  },
  {
    id: 'project_eco_sanctuary',
    title: 'Guardian of the Island Sanctuary',
    description: 'Create a thriving wildlife reserve balancing predator-prey food webs and renewable energy.',
    gradeBands: ['grade_1', 'grade_2', 'grade_3', 'grade_4'],
    coverIcon: '🏝️',
    badgeId: 'badge_eco_guardian',
    badgeTitle: 'Master Eco Guardian',
    guideId: 'newton',
    milestones: [
      {
        id: 'ms_eco_1_creature_creation',
        title: 'Step 1: Draw Canopy Species (Creativity)',
        domain: 'art',
        taskDescription: 'Design an animal with climbing paws in Creative Studio.',
        isCompleted: true,
        route: '/academy/create',
      },
      {
        id: 'ms_eco_2_trophic_web',
        title: 'Step 2: Balance Food Web (Science)',
        domain: 'science',
        taskDescription: 'Achieve 85% biodiversity equilibrium in the Ecosystem Sandbox.',
        isCompleted: false,
        route: '/playroom/ecosystem-sandbox',
      },
      {
        id: 'ms_eco_3_nature_log',
        title: 'Step 3: Field Guide Notes (Writing)',
        domain: 'writing',
        taskDescription: 'Compose a 3-sentence scientific field log describing your species.',
        isCompleted: false,
        route: '/stories',
      },
    ],
    rewardXP: 80,
    rewardStars: 8,
  },
]

export function getAllProjects(): LearningProject[] {
  return LEARNING_PROJECTS
}

export function getProjectById(id: string): LearningProject | undefined {
  return LEARNING_PROJECTS.find((p) => p.id === id)
}
