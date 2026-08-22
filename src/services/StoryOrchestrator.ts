import type { StoryRecord } from '../types/story'
import type { Json } from '../types/database.types'
import { assetEngine } from './AssetEngine'
import { storyService } from './storyService'
import { quotaService } from './quotaService'
import {
  generateLearningPackage as generateLearningPackageService,
} from './learningPackageGenerationService'
import { classifyGenerationError } from './ai/errors'

export class StoryOrchestrator {
  private activeGenerations = new Map<string, number>()

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
    // 1. Pre-flight check: Verify quota and cooldown eligibility without pre-consuming
    await quotaService.checkQuota()

    // 2. Generation attempt version lock (prevents late promises from race condition)
    const currentVersion = (this.activeGenerations.get(story.id) ?? 0) + 1
    this.activeGenerations.set(story.id, currentVersion)

    // 3. Mark generation as in-progress in database
    await storyService.updateStory(story.id, userId, {
      generation_status: 'generating',
    })

    try {
      // 4. Perform the single AI generation call
      const learningPackage = await generateLearningPackageService(story)

      // Guard: discard if a newer retry generation was started
      if (this.activeGenerations.get(story.id) !== currentVersion) {
        throw new Error('Superseded by a newer generation attempt.')
      }

      const generatedStory = learningPackage.story
      const generatedAt = new Date().toISOString()

      // 5. Mark generation as ready with generated content
      const { error } = await storyService.updateStory(story.id, userId, {
        story_content: generatedStory,
        learning_package: learningPackage as unknown as Json,
        generation_status: 'ready',
        status: 'ready',
        generated_at: generatedAt,
      })

      if (error) {
        throw error
      }

      // 6. Atomically consume exactly 1 quota unit only upon successful generation and save
      try {
        await quotaService.consumeQuota()
      } catch (quotaErr) {
        console.warn('Quota consumption recorded with notice:', quotaErr)
      }

      return {
        ...story,
        story_content: generatedStory,
        learning_package: learningPackage,
        generation_status: 'ready',
        status: 'ready',
        generated_at: generatedAt,
      }
    } catch (error) {
      // If superseded, don't mark as failed
      if (this.activeGenerations.get(story.id) !== currentVersion) {
        throw error
      }

      const classified = classifyGenerationError(error)

      // 6. Persist failed state to database so reopening /stories/:id doesn't hang
      try {
        await storyService.updateStory(story.id, userId, {
          generation_status: 'failed',
        })
      } catch (persistErr) {
        console.warn('Unable to persist failed generation status to database:', persistErr)
      }

      throw classified
    }
  }
}

export const storyOrchestrator = new StoryOrchestrator()
