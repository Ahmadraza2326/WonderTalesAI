export interface AIRequestOptions {
  retryCount?: number
  cooldownMs?: number
}

export interface TextResponse {
  text: string
  model: string
  provider: string
}

export interface ImageResponse {
  imageUrl: string
  model: string
  provider: string
}

export interface AIProvider {
  name: string
  generateText(prompt: string, model: string): Promise<TextResponse>
  generateImage(prompt: string, model: string): Promise<ImageResponse>
}
