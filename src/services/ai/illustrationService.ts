import type { StoryBook } from '../../types/storybook'

import { ImageGenerationEngine } from './imageEngine/ImageGenerationEngine'
import { ProviderManager } from './imageEngine/ProviderManager'
import type { StoryDNA } from './storyDNA'
import type { IllustrationPrompt } from './illustrationPromptGenerator'

export async function generateIllustrations(
  storyBook: StoryBook,
  _storyDNA: StoryDNA
): Promise<StoryBook> {
  const providerManager = new ProviderManager()
  const imageEngine = new ImageGenerationEngine(providerManager)

    const prompts: IllustrationPrompt[] = storyBook.pages
    .filter(page => page.illustrationPrompt)
    .map(page => ({
      scene: page.pageNumber,
      title: 'Page ' + page.pageNumber,
      prompt: page.illustrationPrompt || '',
    }))

    const result = await imageEngine.generate({ prompts })

    console.log(`[3] illustrationService.generateIllustrations - result.illustrations:`, JSON.stringify(result.illustrations, null, 2));

    storyBook.pages = storyBook.pages.map(page => {
      const illustration = result.illustrations.find(
        image => image.scene === page.pageNumber
      );
      const resultObj = {
        ...page,
        illustrationUrl:
          illustration?.imageUrl ??
          page.illustrationUrl ??
          ''
      };
      return resultObj;
    });

        console.log(`[3] illustrationService.generateIllustrations - updated pages:`, JSON.stringify(storyBook.pages, null, 2));

    return storyBook
}