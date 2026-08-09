import { getAIConfig } from '../../../config/aiConfig'


import { MockImageProvider } from '../mockImageProvider'
import { GeminiImageProvider } from '../providers/gemini/geminiImageProvider'
import { PollinationsImageProvider } from '../providers/pollinations/PollinationsImageProvider'
import type { ImageProvider } from '../imageProvider'
import type { ImageProviderRegistration, ProviderName } from './types'

export class ProviderManager {
  private providers = new Map<ProviderName, ImageProvider>()
  private activeProviderName: ProviderName | null = null

  constructor(initialProviders: ImageProviderRegistration[] = []) {
    this.registerBuiltInProviders()

    initialProviders.forEach(registration => {
      this.register(registration)
    })

    this.activeProviderName = this.getConfiguredActiveProviderName()
  }

  private registerBuiltInProviders(): void {
    this.register({
      name: 'mock',
      provider: new MockImageProvider(),
    })

        this.register({
      name: 'pollinations',
      provider: new PollinationsImageProvider(),
    })

    this.register({
      name: 'gemini',
      provider: new GeminiImageProvider(),
    })
  }

    private getConfiguredActiveProviderName(): ProviderName | null {
    const { defaultProvider } = getAIConfig()
    const normalizedProvider = (defaultProvider?.trim().toLowerCase() as ProviderName) ?? 'mock'

    if (this.providers.has(normalizedProvider)) {
      return normalizedProvider
    }

    if (this.providers.has('mock')) {
      return 'mock'
    }

    return this.providers.size > 0 ? Array.from(this.providers.keys())[0] : null
  }

  register(registration: ImageProviderRegistration): void {
    this.providers.set(registration.name, registration.provider)
  }

  setActiveProvider(name: ProviderName): void {
    if (!this.providers.has(name)) {
      throw new Error(`Provider not registered: ${name}`)
    }

    this.activeProviderName = name
  }

  getActiveProvider(): ImageProvider {
    if (!this.activeProviderName) {
      throw new Error('No active image provider configured')
    }

    const provider = this.providers.get(this.activeProviderName)

    if (!provider) {
      throw new Error(`Active provider not found: ${this.activeProviderName}`)
    }

    return provider
  }

  getActiveProviderName(): ProviderName | null {
    return this.activeProviderName
  }
}
