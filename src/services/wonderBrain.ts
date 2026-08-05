import type { StoryRecord } from "../types/story"

export interface WonderBrainContext {
  story: StoryRecord
}

export class WonderBrain {

 private context: WonderBrainContext

constructor(context: WonderBrainContext) {
  this.context = context
}

  get story() {
    return this.context.story
  }

  get childAge() {
    return Number(this.story.child_age ?? 7)
  }

  get language() {
    return this.story.language
  }

  get readingLevel() {
    return this.story.reading_level
  }

  get storyLength() {
    return this.story.story_length
  }

  get theme() {
    return this.story.theme
  }

  get moral() {
    return this.story.moral
  }

  get characters() {
    return this.story.characters
  }

  get title() {
    return this.story.title
  }

}