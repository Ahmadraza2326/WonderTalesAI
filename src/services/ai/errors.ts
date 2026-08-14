export class StoryGenerationError extends Error {
  readonly code: string

  constructor(message: string, code = 'GENERATION_ERROR') {
    super(message)
    this.name = 'StoryGenerationError'
    this.code = code
  }
}

export class StoryGenerationTimeoutError extends StoryGenerationError {
  constructor(message = 'Story generation timed out. The AI storyteller took too long to respond. Please try again.') {
    super(message, 'TIMEOUT')
    this.name = 'StoryGenerationTimeoutError'
  }
}

export class StoryGenerationNetworkError extends StoryGenerationError {
  constructor(message = 'Network connection failed while communicating with the storyteller. Please check your internet connection and retry.') {
    super(message, 'NETWORK_ERROR')
    this.name = 'StoryGenerationNetworkError'
  }
}

export class StoryGenerationFormatError extends StoryGenerationError {
  constructor(message = 'The AI storyteller response was malformed. Please retry generation.') {
    super(message, 'FORMAT_ERROR')
    this.name = 'StoryGenerationFormatError'
  }
}

export class StoryGenerationConfigError extends StoryGenerationError {
  constructor(message = 'Gemini API is not configured or authentication failed.') {
    super(message, 'CONFIG_ERROR')
    this.name = 'StoryGenerationConfigError'
  }
}

export class StoryGenerationQuotaError extends StoryGenerationError {
  constructor(message = 'Daily story generation quota reached. Limit resets tomorrow.') {
    super(message, 'QUOTA_ERROR')
    this.name = 'StoryGenerationQuotaError'
  }
}

export class StoryGenerationCooldownError extends StoryGenerationError {
  readonly retryAfterSeconds: number

  constructor(message = 'Please wait before generating another story.', retryAfterSeconds = 20) {
    super(message, 'COOLDOWN')
    this.name = 'StoryGenerationCooldownError'
    this.retryAfterSeconds = retryAfterSeconds
  }
}

export function classifyGenerationError(error: unknown): StoryGenerationError {
  if (error instanceof StoryGenerationError) {
    return error
  }

  const message = error instanceof Error ? error.message : String(error)
  const lower = message.toLowerCase()

  if (lower.includes('cooldown')) {
    return new StoryGenerationCooldownError(message)
  }
  if (lower.includes('timeout') || lower.includes('timed out') || lower.includes('aborted')) {
    return new StoryGenerationTimeoutError(message)
  }
  if (lower.includes('quota') || lower.includes('rate limit') || lower.includes('daily limit') || lower.includes('429') || lower.includes('resource_exhausted')) {
    return new StoryGenerationQuotaError(message)
  }
  if (lower.includes('api_key') || lower.includes('unauthenticated') || lower.includes('401') || lower.includes('403') || lower.includes('not configured')) {
    return new StoryGenerationConfigError(message)
  }
  if (lower.includes('json') || lower.includes('validation') || lower.includes('schema') || lower.includes('parse') || lower.includes('empty response')) {
    return new StoryGenerationFormatError(message)
  }
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('offline') || lower.includes('econnrefused') || lower.includes('failed to fetch')) {
    return new StoryGenerationNetworkError(message)
  }

  return new StoryGenerationError(message)
}
