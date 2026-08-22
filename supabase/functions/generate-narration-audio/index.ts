import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STORAGE_BUCKET = "story-assets";

function pcmToWav(pcmBytes: Uint8Array, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Uint8Array {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBytes.length;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // Helper to write ASCII string
  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF chunk descriptor
  writeString(0, "RIFF");
  view.setUint32(4, totalSize - 8, true);
  writeString(8, "WAVE");

  // fmt sub-chunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data sub-chunk
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  // Copy PCM data
  new Uint8Array(buffer, headerSize).set(pcmBytes);

  return new Uint8Array(buffer);
}

// Convert base64 to Uint8Array safely in Deno/Edge
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// --- TTS Provider Abstraction ---

interface NarrationInput {
  text: string;
  language: string;
  voiceName?: string;
}

interface NarrationSegmentResult {
  wavBytes: Uint8Array;
  providerUsed: string;
  modelUsed?: string;
  statusLog: any[];
  timepoints?: { markName: string; timeSeconds: number }[];
}

interface TTSProvider {
  generate(input: NarrationInput): Promise<NarrationSegmentResult>;
}

// 1. Gemini TTS Provider (Current / Development)
class GeminiTTSProvider implements TTSProvider {
  constructor(private apiKey: string) {}

  async generate(input: NarrationInput): Promise<NarrationSegmentResult> {
    const models = [
      "gemini-3.1-flash-tts-preview",
      "gemini-2.5-flash-preview-tts",
    ];

    const statusLog: any[] = [];
    const voiceName = input.voiceName || "Puck";
    
    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
      const maxRetries = 2;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: input.text }] }],
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: {
                      voiceName,
                    },
                  },
                },
              },
            }),
          });

          if (res.status === 429) {
            statusLog.push({ model, attempt, status: 429, action: "retry_wait" });
            const waitMs = attempt * 2500;
            await new Promise((resolve) => setTimeout(resolve, waitMs));
            continue;
          }

          statusLog.push({ model, attempt, status: res.status });

          if (!res.ok) {
            break; // try next model
          }

          const data = await res.json();
          const part = data?.candidates?.[0]?.content?.parts?.[0];
          const b64Data = part?.inlineData?.data;

          if (b64Data) {
            const rawPcm = base64ToUint8Array(b64Data);
            statusLog.push({ model, attempt, event: "audio_decoded" });
            return { 
              wavBytes: pcmToWav(rawPcm, 24000, 1, 16), 
              providerUsed: "GeminiTTS",
              modelUsed: model, 
              statusLog 
            };
          } else {
            statusLog.push({ model, attempt, event: "no_audio_data" });
          }
        } catch (_e: any) {
          statusLog.push({ model, attempt, error: _e.message });
        }
      }
    }

    throw new Error(`Failed to generate TTS audio across available Gemini models. Logs: ${JSON.stringify(statusLog)}`);
  }
}

// 2. Google Cloud TTS Provider (Prototype / Future Production)
class GoogleCloudTTSProvider implements TTSProvider {
  constructor(private apiKey: string) {}

  async generate(input: NarrationInput): Promise<NarrationSegmentResult> {
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`;
    const statusLog: any[] = [];
    
    // Note: This expects input.text to be valid SSML if you want timepoints.
    // E.g., <speak><mark name="sentence-1"/>Hello.</speak>
    const isSsml = input.text.includes('<speak>');
    const payload: any = {
      input: isSsml ? { ssml: input.text } : { text: input.text },
      voice: { languageCode: input.language, name: input.voiceName },
      audioConfig: { audioEncoding: 'LINEAR16', sampleRateHertz: 24000 },
    };

    if (isSsml) {
      payload.enableTimePointing = ["SSML_MARK"];
    }

    statusLog.push({ event: "request_started", provider: "GoogleCloudTTS" });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    statusLog.push({ event: "request_completed", status: res.status });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Google Cloud TTS failed: ${res.status} ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    if (!data.audioContent) {
      throw new Error("Google Cloud TTS returned no audioContent.");
    }

    // Google Cloud returns base64 encoded audio bytes
    const wavBytes = base64ToUint8Array(data.audioContent);
    statusLog.push({ event: "audio_decoded" });

    return {
      wavBytes,
      providerUsed: "GoogleCloudTTS",
      modelUsed: input.voiceName,
      statusLog,
      timepoints: data.timepoints, // e.g. [{ markName: "sentence-1", timeSeconds: 0.0 }]
    };
  }
}

serve(async (req: Request) => {
  // 1. Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    // 2. Authenticate the caller via Supabase JWT
    const authHeader = req.headers.get("Authorization") ?? req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authorization required", code: "UNAUTHENTICATED" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Supabase server environment is not configured." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured on the server." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Invalid token format", code: "UNAUTHENTICATED" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    let user = null;
    try {
      const { data, error: authError } = await userClient.auth.getUser(token);
      if (authError || !data?.user) {
        return new Response(
          JSON.stringify({ error: "Invalid or expired session token", code: "UNAUTHENTICATED" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      user = data.user;
    } catch (_authEx) {
      return new Response(
        JSON.stringify({ error: "Authentication validation failed", code: "UNAUTHENTICATED" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 3. Parse Request Payload
    const body = await req.json();
    const { storyId, segments, language, contentHash, forceRegenerate = false } = body;

    if (!storyId || !segments || !Array.isArray(segments) || segments.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing storyId or segments array in request payload.", code: "INVALID_PAYLOAD" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Abuse Prevention & Limits
    if (segments.length > 50) {
      return new Response(
        JSON.stringify({ error: "Maximum of 50 narration segments allowed per request.", code: "LIMIT_EXCEEDED" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let totalChars = 0;
    for (const seg of segments) {
      if (typeof seg.text !== "string" || seg.text.length > 2000) {
        return new Response(
          JSON.stringify({ error: "Each narration segment must not exceed 2,000 characters.", code: "LIMIT_EXCEEDED" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      totalChars += seg.text.length;
    }

    if (totalChars > 25000) {
      return new Response(
        JSON.stringify({ error: "Total story narration content must not exceed 25,000 characters.", code: "LIMIT_EXCEEDED" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize parameters against directory traversal
    const safeStoryId = String(storyId).replace(/[^a-zA-Z0-9_-]/g, "");
    const safeHash = String(contentHash || "default").replace(/[^a-zA-Z0-9_-]/g, "");

    // 4. Authorize caller ownership of the requested storyId via RLS
    const { data: storyRecord, error: storyError } = await userClient
      .from("stories")
      .select("id, user_id")
      .eq("id", safeStoryId)
      .single();

    if (storyError || !storyRecord || storyRecord.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Story not found or unauthorized.", code: "FORBIDDEN" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const diagnostics: any[] = [];
    const tStart = Date.now();

    // 5. Generate & Store Audio for each segment (Idempotent, Concurrent)
    const hydratedSegments = await Promise.all(segments.map(async (segment) => {
      const safeSegmentId = String(segment.id).replace(/[^a-zA-Z0-9_-]/g, "");
      const audioPath = `${user.id}/${safeStoryId}/narration/${safeHash}/segment-${safeSegmentId}.wav`;
      let audioBytes: Uint8Array | null = null;
      let durationSeconds = segment.duration || 0;

      // Check if audio file already exists in Supabase Storage (Idempotency)
      if (!forceRegenerate) {
        const { data: existingData, error: downloadError } = await adminClient.storage
          .from(STORAGE_BUCKET)
          .download(audioPath);

        if (!downloadError && existingData) {
          const buffer = await existingData.arrayBuffer();
          audioBytes = new Uint8Array(buffer);
          // 24000Hz 16-bit mono PCM with 44-byte header
          const pcmLength = Math.max(0, audioBytes.length - 44);
          durationSeconds = Math.max(1, Math.round(pcmLength / 48000));
        }
      }

      // If not cached, generate via TTS provider
      if (!audioBytes) {
        const textToNarrate = segment.text.trim();
        if (!textToNarrate) {
          return {
            id: segment.id,
            text: segment.text,
            speaker: segment.speaker || "Narrator",
            audioPath: null,
            audioUrl: null,
            duration: 0,
          };
        }

        const tGeminiStart = Date.now();
        let providerResult: NarrationSegmentResult | null = null;
        let generationError: any = null;

        try {
          // Provider Selection Strategy
          const providerType = body.provider || "gemini";
          let ttsProvider: TTSProvider;

          if (providerType === "google-cloud") {
            const gcpKey = Deno.env.get("GCP_API_KEY");
            if (!gcpKey) throw new Error("GCP_API_KEY missing for Google Cloud TTS.");
            ttsProvider = new GoogleCloudTTSProvider(gcpKey);
          } else {
            ttsProvider = new GeminiTTSProvider(geminiApiKey);
          }

          providerResult = await ttsProvider.generate({
            text: textToNarrate,
            language: language,
          });
          
          audioBytes = providerResult.wavBytes;

          // Estimate duration from WAV bytes
          const pcmLength = Math.max(0, audioBytes.length - 44);
          durationSeconds = Math.max(1, Math.round(pcmLength / 48000));
        } catch (e: any) {
          generationError = e;
          const msg = String(e.message || "");
          if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("QuotaFailure")) {
             return {
                id: segment.id,
                error: "TTS_QUOTA_EXHAUSTED",
                diagnostics: "TTS quota exhausted. Narration temporarily unavailable.",
             };
          }
        }

        const tGeminiEnd = Date.now();

        if (audioBytes) {
          const tUploadStart = Date.now();
          // Upload to Supabase Storage story-assets bucket
          const { error: uploadError } = await adminClient.storage
            .from(STORAGE_BUCKET)
            .upload(audioPath, audioBytes, {
              contentType: "audio/wav",
              upsert: true,
            });

          if (uploadError) {
            console.error(`Failed to upload audio to ${audioPath}:`, uploadError);
            throw new Error(`Storage upload failed for segment ${segment.id}: ${uploadError.message}`);
          }
          const tUploadEnd = Date.now();

          diagnostics.push({
            segmentId: segment.id,
            geminiMs: tGeminiEnd - tGeminiStart,
            uploadMs: tUploadEnd - tUploadStart,
            providerUsed: providerResult?.providerUsed,
            modelUsed: providerResult?.modelUsed,
            geminiLog: providerResult?.statusLog,
          });
        } else {
          diagnostics.push({
            segmentId: segment.id,
            error: generationError ? generationError.message : "Unknown generation error",
          });
          return {
            id: segment.id,
            text: segment.text,
            speaker: segment.speaker || "Narrator",
            audioPath: null,
            audioUrl: null,
            duration: 0,
          };
        }
      } else {
        diagnostics.push({
          segmentId: segment.id,
          cached: true
        });
      }

      const tUrlStart = Date.now();
      // Create signed URL for playback (valid for 1 hour)
      const { data: signedData } = await adminClient.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(audioPath, 60 * 60);

      return {
        id: segment.id,
        text: segment.text,
        speaker: segment.speaker || "Narrator",
        emotion: segment.emotion || "neutral",
        audioPath,
        audioUrl: signedData?.signedUrl || "",
        duration: durationSeconds,
        timepoints: providerResult?.timepoints,
      };
    }));

    const tTotal = Date.now() - tStart;

    return new Response(
      JSON.stringify({
        success: true,
        storyId,
        language: language || "en-US",
        contentHash: safeHash,
        segments: hydratedSegments,
        diagnostics: { totalMs: tTotal, segments: diagnostics }
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err: any) {
    console.error("[generate-narration-audio] Error:", err.message);
    return new Response(
      JSON.stringify({
        error: err.message || "Failed to generate narration audio",
        code: "TTS_GENERATION_FAILED",
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
