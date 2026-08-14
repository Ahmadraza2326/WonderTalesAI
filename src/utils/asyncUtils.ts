import { StoryGenerationTimeoutError } from '../services/ai/errors'

export const DEFAULT_AI_TIMEOUT_MS = 45000 // 45 seconds timeout for story generation

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = DEFAULT_AI_TIMEOUT_MS,
  customMessage?: string
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new StoryGenerationTimeoutError(customMessage))
    }, timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timer) {
      clearTimeout(timer)
    }
  }
}
