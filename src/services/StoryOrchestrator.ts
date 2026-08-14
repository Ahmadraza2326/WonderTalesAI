import type { StoryRecord } from '../types/story'
import type { Json } from '../types/database.types'
import { assetEngine } from './AssetEngine'
import { storyService } from './storyService'
import {
  generateLearningPackage as generateLearningPackageService,
} from './learningPackageGenerationService'

export class StoryOrchestrator {
  async generate(story: StoryRecord) {
    const learningPackage = await generateLearningPackageService(story)
    const generatedStory = learningPackage.story

    const assets = await assetEngine.build(
      {
        ...story,
        story_content: generatedStory,
        learning_package: learningPackage,
      },
      learningPackage
    )

    return {
      generatedStory,
      learningPackage,
      storyBook: assets.storyBook,
      narration: assets.narration,
    }
  }

  async generateLearningPackage(
    story: StoryRecord,
    userId: string
  ): Promise<StoryRecord> {
    const learningPackage = await generateLearningPackageService(story)
    const generatedStory = learningPackage.story
    const generatedAt = new Date().toISOString()

    const { error } = await storyService.updateStory(story.id, userId, {
      story_content: generatedStory,
      learning_package: learningPackage as unknown as Json,
      generation_status: 'generated',
      generated_at: generatedAt,
    })

    if (error) {
      throw error
    }

    return {
      ...story,
      story_content: generatedStory,
      learning_package: learningPackage,
      generation_status: 'generated',
      generated_at: generatedAt,
    }
  }
}

export const storyOrchestrator = new StoryOrchestrator()
