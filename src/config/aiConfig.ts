export interface AIProviderConfig {
  apiKey?: string
  model?: string
  timeoutMs?: number
  baseUrl?: string
}

export interface AIConfig {
  gemini: AIProviderConfig
  defaultProvider: string
}

function readEnv(name: string): string | undefined {
  const value = import.meta.env?.[name]

  if (typeof value === 'string' && value.trim() !== '') {
    return value
  }

  return undefined
}

function readNumberEnv(name: string): number | undefined {
  const value = readEnv(name)

  if (!value) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function normalizeConfig(): AIConfig {
  const geminiApiKey = readEnv('VITE_GEMINI_API_KEY')
  const geminiModel = readEnv('VITE_GEMINI_MODEL') ?? 'gemini-2.0-flash'
  const geminiTimeoutMs = readNumberEnv('VITE_GEMINI_TIMEOUT_MS') ?? 30000
  const geminiBaseUrl = readEnv('VITE_GEMINI_BASE_URL')

  return {
    gemini: {
      apiKey: geminiApiKey,
      model: geminiModel,
      timeoutMs: geminiTimeoutMs,
      baseUrl: geminiBaseUrl,
    },
    defaultProvider: readEnv('VITE_AI_DEFAULT_PROVIDER') ?? 'mock',
  }
}

export const aiConfig: AIConfig = normalizeConfig()

export function getAIConfig(): AIConfig {
  return aiConfig
}

export function getGeminiConfig(): AIProviderConfig {
  return aiConfig.gemini
}

export function hasGeminiConfig(): boolean {
  return Boolean(aiConfig.gemini.apiKey)
}
