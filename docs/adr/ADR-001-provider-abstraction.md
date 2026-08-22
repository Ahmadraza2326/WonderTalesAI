# ADR-001: Provider Abstraction

- Status: Accepted
- Date: 2026-08-02

## Context

WonderTalesAI relies on external AI services for several capabilities, including story generation, narration, and image generation. These providers may differ in quality, pricing, latency, capabilities, and availability.

Using a single provider directly throughout the application would make the product harder to evolve as requirements change.

## Decision

WonderTalesAI will use provider abstraction layers for AI capabilities so that the product can interact with multiple providers through a common interface.

This means the application will depend on abstract service contracts rather than hard-coding a specific vendor implementation in every workflow.

## Why This Decision Matters

### Scalability

Provider abstraction makes it easier to add or swap services as usage grows. If one provider becomes too slow, expensive, or less reliable, the product can route requests to another implementation without rewriting the main application logic.

### Maintainability

The core product code can stay focused on user workflows rather than vendor-specific APIs. This improves readability, reduces duplication, and makes future upgrades safer.

### Vendor Independence

The platform is not locked to a single AI provider. This reduces strategic risk and allows the team to choose tools based on capability, cost, and reliability at the time of integration.

The architecture is prepared for future providers such as alternative text generation services, voice providers, or visual generation systems. New providers can be added behind the same interface with limited impact on the rest of the application.

## VoiceProvider Abstraction & TTS

ORBis uses the `VoiceProvider` interface (located in `src/services/ai/voiceProvider.ts`) to manage Text-to-Speech (TTS) generation. This abstraction ensures the core application (`audioController.ts`, `readAlongSpeechService.ts`) is completely decoupled from the underlying TTS engine.

### Production Cloud Provider Path
By default (or when `VITE_TTS_PROVIDER` is not set to `piper`), ORBis utilizes the `OrbisVoiceProvider` which calls the `generate-narration-audio` Supabase Edge Function. This edge function securely interacts with Cloud TTS APIs (e.g., Gemini or Google Cloud TTS). The browser is never responsible for production provider credentials.

### Local Piper Development Setup
For local development and testing, a local Piper TTS engine can be used without incurring API costs.
1. The frontend checks `VITE_TTS_PROVIDER=piper` and instantiates the `PiperVoiceProvider`.
2. The `PiperVoiceProvider` calls a lightweight local Node.js server (`scripts/local_tts_server.ts`) running at `http://localhost:3001/api/tts`.
3. The local server spawns the isolated `piper.exe` process, streams the generated WAV audio back, and the provider seamlessly converts it into a local blob URL (`audioUrl`) for playback.

#### Required Configuration
To use Piper locally, set the following environment variables in your `.env`:
- `VITE_TTS_PROVIDER=piper`
- `PIPER_EXECUTABLE_PATH=<absolute_or_relative_path_to_piper.exe>`
- `PIPER_MODEL_DIR=<absolute_or_relative_path_to_piper_models_directory>`

### How to Add a Future TTS Provider
1. Implement the `VoiceProvider` interface in `src/services/ai/providers/`.
2. The `generateNarration` method should accept an array of text segments and return an array of `GeneratedNarration` objects containing standard `audioUrl` links (which can be standard URLs, Data URIs, or Blob URLs).
3. Update the factory logic in `src/services/ai/narrationGenerationService.ts` to instantiate your new provider based on configuration.

## Consequences

### Positive

- Easier experimentation with providers
- Cleaner separation between product logic and external integration
- Improved resilience and flexibility

### Tradeoffs

- Requires an initial design effort to define consistent interfaces
- Adds a small layer of abstraction that must be maintained over time

## Summary

Provider abstraction is a foundational decision for WonderTalesAI because it supports growth, lowers maintenance cost, and keeps the product adaptable as the AI ecosystem evolves.
