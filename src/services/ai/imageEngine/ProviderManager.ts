import { MockImageProvider } from '../mockImageProvider'
import type { ImageProvider } from '../imageProvider'
import type { ImageProviderRegistration, ProviderName } from './types'

export class ProviderManager {
  private providers = new Map<ProviderName, ImageProvider>()
  private activeProviderName: ProviderName | null = null

  constructor(initialProviders: ImageProviderRegistration[] = []) {
    if (initialProviders.length === 0) {
      this.register({
        name: 'mock',
        provider: new MockImageProvider(),
      })
      this.setActiveProvider('mock')
      return
    }

    initialProviders.forEach(registration => {
      this.register(registration)
    })

    this.activeProviderName = initialProviders[0]?.name ?? null
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
