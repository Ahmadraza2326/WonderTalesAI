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

  readingSkills: [
    {
      skill: "Prediction",
      explanation: "Encourages children to think about what might happen next."
    },
    {
      skill: "Sequencing",
      explanation: "Helps children understand the order of events."
    }
  ],

  lifeSkills: [
    {
      skill: "Kindness",
      explanation: "Helping others even when nothing is expected in return."
    },
    {
      skill: "Courage",
      explanation: "Facing challenges with confidence."
    }
  ],

  criticalThinking: [
    {
      question: "What could Ali have done differently to help Leo?"
    },
    {
      question: "Why do you think helping the bird changed the ending?"
    }
  ],

  creativeActivity: {
    title: "Draw Your Own Adventure",
    instructions:
      "Draw another magical place that Ali and Leo could explore together."
  },

  funFact: {
    title: "Did You Know?",
    fact: "Lions can sleep for around 20 hours every day."
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
    schemaVersion: 2,

    language: "English",

    recommendedAge: "6-8",

    readingLevel: "Beginner"
  }
}