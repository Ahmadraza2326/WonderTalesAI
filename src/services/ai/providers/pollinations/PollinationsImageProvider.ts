import type { GeneratedIllustration, ImageProvider } from '../../imageProvider';
import type { IllustrationPrompt } from '../../illustrationPromptGenerator';
import { supabase } from '../../../../lib/supabase';

export class PollinationsImageProvider implements ImageProvider {
  async generateImages(prompts: IllustrationPrompt[]): Promise<GeneratedIllustration[]> {
    return Promise.all(prompts.map((prompt) => this.generateImage(prompt)));
  }

  private async generateImage(prompt: IllustrationPrompt): Promise<GeneratedIllustration> {
    const { data, error } = await supabase.functions.invoke<{
      imageBase64: string;
      mimeType: string;
    }>('generate-pollinations-image', {
      body: {
        prompt: prompt.prompt,
        width: 512,
        height: 512,
        seed: Math.floor(Math.random() * 10000),
        model: 'flux'
      }
    })

    if (error || !data) {
      throw new Error(
        `Pollinations generation failed: ${error?.message || 'No data returned'}`
      )
    }

    const imageUrl = `data:${data.mimeType};base64,${data.imageBase64}`

    return {
      scene: prompt.scene,
      imageUrl: imageUrl,
      provider: 'pollinations',
    };
  }
}
