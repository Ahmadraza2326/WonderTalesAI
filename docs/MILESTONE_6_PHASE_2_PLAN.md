# Milestone 6 – Phase 2

## Objective

Verify that WonderTales can successfully communicate with Gemini.

---

## Scope

Do not generate children's stories yet.

Instead:

- Add a temporary "Test Gemini Connection" action in the Story Workspace.
- Call Gemini through geminiService.
- Send a very small prompt.
- Display the returned response.
- Do not save anything to Supabase.

---

## Requirements

- Use geminiService only.
- No direct SDK usage from React pages.
- No database writes.
- No story generation.
- Keep TypeScript strict.
- Handle loading.
- Handle API errors gracefully.

---

## Verification

- The button sends a request.
- Gemini returns a response.
- The response is displayed.
- Project builds successfully.