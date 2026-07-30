export function cleanJsonResponse(response: string): string {
  let cleaned = response.trim()

  // Remove Markdown JSON fences
  cleaned = cleaned.replace(/^```json/i, '')
  cleaned = cleaned.replace(/^```/i, '')
  cleaned = cleaned.replace(/```$/i, '')

  return cleaned.trim()
}