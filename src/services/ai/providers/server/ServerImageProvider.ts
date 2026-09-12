import type { GeneratedIllustration, ImageProvider } from '../../imageProvider'
import type { IllustrationPrompt } from '../../illustrationPromptGenerator'
import { supabase } from '../../../../lib/supabase'

export class ServerImageProvider implements ImageProvider {
  async generateImages(prompts: IllustrationPrompt[]): Promise<GeneratedIllustration[]> {
    return Promise.all(prompts.map(prompt => this.generateImage(prompt)))
  }

  private async generateImage(prompt: IllustrationPrompt): Promise<GeneratedIllustration> {
    const { data, error } = await supabase.functions.invoke<{
      imageBase64: string
      mimeType: string
      provider: string
      width?: number
      height?: number
    }>('generate-image', {
      body: {
        prompt: prompt.prompt,
        width: 512,
        height: 512,
        scene: prompt.scene,
      },
    })

    if (error || !data?.imageBase64) {
      console.warn(
        `[ServerImageProvider] Image generation error for scene ${prompt.scene}:`,
        error
      )
      // Return procedural fallback data url rather than failing entire storybook
      const fallbackSvg = this.createLocalSvgFallback(prompt.prompt, prompt.scene)
      return {
        scene: prompt.scene,
        imageUrl: `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(fallbackSvg)))}`,
        provider: 'local-svg-fallback',
      }
    }

    // If data.imageBase64 already starts with data:, use it directly; otherwise prepend dataUrl scheme
    const imageUrl = data.imageBase64.startsWith('data:')
      ? data.imageBase64
      : `data:${data.mimeType || 'image/jpeg'};base64,${data.imageBase64}`

    return {
      scene: prompt.scene,
      imageUrl,
      provider: data.provider || 'cloudflare-flux',
    }
  }

  private createLocalSvgFallback(promptText: string, scene: number): string {
    const sanitized = (promptText || 'A magical story scene')
      .replace(/[<>&"']/g, '')
      .slice(0, 80)

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <circle cx="256" cy="220" r="90" fill="#818cf8" opacity="0.2"/>
  <text x="256" y="235" text-anchor="middle" font-size="52" font-family="system-ui">✨</text>
  <text x="256" y="360" text-anchor="middle" fill="#ffffff" font-size="20" font-weight="800" font-family="'Outfit', system-ui">Scene ${scene}</text>
  <text x="256" y="395" text-anchor="middle" fill="#c7d2fe" font-size="13" font-family="system-ui" opacity="0.85">${sanitized}</text>
</svg>`
  }
}
