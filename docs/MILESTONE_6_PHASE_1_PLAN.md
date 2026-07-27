# Milestone 6 – Phase 1

## Objective

Prepare WonderTales for Gemini AI integration without changing the current UI.

---

## Tasks

Create:

src/services/geminiService.ts

The service should:

- Initialize the Gemini client.
- Read the API key from environment variables.
- Export a reusable Gemini client.
- Not generate stories yet.

---

## Environment Variables

Use:

VITE_GEMINI_API_KEY

Do not hardcode any API key.

---

## Requirements

- No UI changes.
- No story generation.
- No database writes.
- No placeholder responses.

---

## Verification

- Project builds successfully.
- Service compiles.
- API key is read from environment variables.
