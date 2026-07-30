import type { LearningPackage } from './learningPackage'

export const learningPackageSchemaExample: LearningPackage = {
  story: "Once upon a time...",

  storyDNA: {
    title: "The Brave Lion",

    moral: "Helping others makes everyone stronger.",

    theme: "Friendship",

    characters: [
      "Ali",
      "Leo"
    ],

    locations: [
      "Whispering Forest",
      "Crystal Cave"
    ],

    importantObjects: [
      "Magic Stone",
      "Golden Key"
    ],

    keyEvents: [
      "Ali meets Leo",
      "They rescue a bird",
      "They discover the Magic Stone"
    ],

    vocabulary: [
      {
        word: "Gigantic",
        meaning: "Very large",
        difficulty: "medium",
        partOfSpeech: "Adjective",
        example: "Leo was a gigantic lion.",
        synonym: "Huge"
      }
    ],

    emotions: [
      "Curiosity",
      "Kindness",
      "Courage",
      "Joy"
    ],

    educationalConcepts: [
      "Friendship",
      "Problem Solving",
      "Helping Others"
    ]
  },

  vocabulary: [
    {
      word: "Gigantic",
      meaning: "Very large",
      difficulty: "medium",
      partOfSpeech: "Adjective",
      example: "Leo was a gigantic lion.",
      synonym: "Huge"
    }
  ],

  quizSeeds: [
    {
      question: "Why did Ali help Leo?",
      answer: "Because Leo was hurt.",
      options: [
        "Because Leo was hurt.",
        "Because Leo was angry.",
        "Because Leo was sleeping.",
        "Because Leo was hungry."
      ],
      explanation: "Ali chose kindness."
    }
  ],

  gameSeeds: [
    {
      type: "memory",
      data: {
        pairs: [
          ["Ali", "Boy"],
          ["Leo", "Lion"]
        ]
      }
    }
  ],

  parentGuide: {
    discussionQuestions: [
      "Why is helping others important?",
      "What would you have done?"
    ],
    realLifeActivity:
      "Help a family member with a small task today."
  },

  illustrations: [
    {
      scene: 1,
      prompt:
        "Ali meets Leo in a colorful magical forest."
    }
  ],

  narration: {
    style: "Warm and playful",

    voices: [
      "Narrator",
      "Ali",
      "Leo"
    ],

    soundEffects: [
      "Birds",
      "Wind",
      "Footsteps"
    ]
  },

  metadata: {
    schemaVersion: 1,

    language: "English",

    recommendedAge: "6-8",

    readingLevel: "Beginner"
  }
}