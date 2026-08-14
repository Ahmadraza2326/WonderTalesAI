/**
 * Scans a string to extract the first valid JSON object using a deterministic balanced-bracket scanner.
 * Correctly accounts for string literals, escape sequences, and nested structures.
 */
function scanBalancedJsonObject(text: string): string | null {
  const len = text.length

  for (let i = 0; i < len; i++) {
    if (text[i] === '{') {
      const startIndex = i
      let depth = 0
      let inString = false
      let escape = false

      for (let j = startIndex; j < len; j++) {
        const char = text[j]

        if (escape) {
          escape = false
          continue
        }

        if (char === '\\' && inString) {
          escape = true
          continue
        }

        if (char === '"') {
          inString = !inString
          continue
        }

        if (!inString) {
          if (char === '{') {
            depth++
          } else if (char === '}') {
            depth--
            if (depth === 0) {
              const candidate = text.slice(startIndex, j + 1)
              try {
                JSON.parse(candidate)
                return candidate
              } catch {
                // If this substring does not parse as valid JSON, continue scanning
                break
              }
            }
          }
        }
      }
    }
  }

  return null
}

export function cleanJsonResponse(response: string): string {
  if (!response || typeof response !== 'string') {
    return ''
  }

  const trimmed = response.trim()

  // 1. Check for fenced code blocks (```json ... ``` or ``` ... ```)
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/gi
  let fenceMatch: RegExpExecArray | null

  while ((fenceMatch = fenceRegex.exec(trimmed)) !== null) {
    const fencedContent = fenceMatch[1].trim()
    const extractedFromFence = scanBalancedJsonObject(fencedContent)
    if (extractedFromFence) {
      return extractedFromFence
    }
  }

  // 2. Scan entire response for a balanced JSON object (handles conversational preambles/postscripts)
  const extracted = scanBalancedJsonObject(trimmed)
  if (extracted) {
    return extracted
  }

  // 3. Fallback cleanup
  let fallback = trimmed
  fallback = fallback.replace(/^```json\s*/i, '')
  fallback = fallback.replace(/^```\s*/i, '')
  fallback = fallback.replace(/\s*```$/i, '')
  return fallback.trim()
}