import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_PROMPT_LENGTH = 1500;
const DEFAULT_WIDTH = 512;
const DEFAULT_HEIGHT = 512;
const MAX_DIMENSION = 1024;
const MIN_DIMENSION = 256;

// Child-safe reference keywords embedded directly into positive prompts
const _CHILD_SAFE_NEGATIVE_PROMPT =
  "scary, horror, gore, blood, violence, weapon, creepy, distorted face, extra limbs, dark gritty, text, watermark, signature";

interface ImageRequestBody {
  prompt?: string;
  width?: number;
  height?: number;
  theme?: string;
  mood?: string;
  scene?: number;
  skipCloud?: boolean;
}

function clampDimension(dim: number | undefined, defaultVal: number): number {
  if (typeof dim !== "number" || isNaN(dim)) return defaultVal;
  return Math.min(MAX_DIMENSION, Math.max(MIN_DIMENSION, Math.round(dim)));
}

// Zero-cost procedural SVG fallback for offline / API exhaustion
function generateProceduralStorySvg(
  prompt: string,
  width: number,
  height: number,
  theme = "starlight",
  scene = 1
): string {
  const sanitizedPrompt = (prompt || "A magical journey")
    .replace(/[<>&"']/g, "")
    .slice(0, 100);

  const themeColors: Record<string, { bg1: string; bg2: string; accent: string; star: string }> = {
    space: { bg1: "#0f172a", bg2: "#1e1b4b", accent: "#38bdf8", star: "#fef08a" },
    forest: { bg1: "#064e3b", bg2: "#022c22", accent: "#34d399", star: "#fde047" },
    ocean: { bg1: "#0c4a6e", bg2: "#082f49", accent: "#38bdf8", star: "#7dd3fc" },
    magic: { bg1: "#3b0764", bg2: "#1e1b4b", accent: "#c084fc", star: "#fbcfe8" },
    starlight: { bg1: "#1e1b4b", bg2: "#312e81", accent: "#818cf8", star: "#fde047" },
  };

  const palette = themeColors[theme.toLowerCase()] || themeColors.starlight;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bg1}"/>
      <stop offset="100%" stop-color="${palette.bg2}"/>
    </linearGradient>
    <radialGradient id="glowGrad" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${palette.bg2}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#glowGrad)"/>
  <g fill="${palette.star}" opacity="0.8">
    <circle cx="${width * 0.2}" cy="${height * 0.25}" r="3"/>
    <circle cx="${width * 0.8}" cy="${height * 0.15}" r="2.5"/>
    <circle cx="${width * 0.5}" cy="${height * 0.3}" r="4"/>
    <circle cx="${width * 0.15}" cy="${height * 0.6}" r="2"/>
    <circle cx="${width * 0.85}" cy="${height * 0.7}" r="3"/>
  </g>
  <circle cx="${width * 0.5}" cy="${height * 0.45}" r="${Math.min(width, height) * 0.22}" fill="${palette.accent}" opacity="0.25"/>
  <text x="${width * 0.5}" y="${height * 0.45}" text-anchor="middle" font-size="48" font-family="system-ui, sans-serif">✨</text>
  <text x="${width * 0.5}" y="${height * 0.75}" text-anchor="middle" fill="#ffffff" font-size="18" font-weight="700" font-family="'Outfit', system-ui, sans-serif" opacity="0.95">Scene ${scene}</text>
  <text x="${width * 0.5}" y="${height * 0.82}" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="system-ui, sans-serif" opacity="0.8">${sanitizedPrompt}</text>
</svg>`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // 1. Authenticate with Supabase JWT
    const authHeader = req.headers.get("Authorization") ?? req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authorization required", code: "UNAUTHENTICATED" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session token", code: "UNAUTHENTICATED" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Parse & Validate Payload
    const body: ImageRequestBody = await req.json().catch(() => ({}));
    const rawPrompt = body.prompt?.trim();

    if (!rawPrompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required", code: "INVALID_PROMPT" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (rawPrompt.length > MAX_PROMPT_LENGTH) {
      return new Response(
        JSON.stringify({
          error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters`,
          code: "PROMPT_TOO_LONG",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const width = clampDimension(body.width, DEFAULT_WIDTH);
    const height = clampDimension(body.height, DEFAULT_HEIGHT);
    const theme = body.theme || "starlight";
    const scene = typeof body.scene === "number" ? body.scene : 1;

    // Enhance prompt for clean Pixar/Storybook art style with embedded child-safety visual constraints
    const enhancedPrompt = `Vibrant, joyful children's storybook illustration, Disney Pixar digital art style, soft warm cinematic lighting, whimsical, gentle, child-friendly, no scary elements, no violence, no gore, clean family artwork: ${rawPrompt}`;

    // 3. Tier 1: Cloudflare Workers AI (FLUX.1-schnell)
    const CF_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");
    const CF_AI_TOKEN = Deno.env.get("CLOUDFLARE_AI_TOKEN");

    if (CF_ACCOUNT_ID && CF_AI_TOKEN && !body.skipCloud) {
      try {
        const cfResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${CF_AI_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: enhancedPrompt,
              num_steps: 4,
            }),
          }
        );

        if (cfResponse.ok) {
          const contentType = cfResponse.headers.get("content-type") || "";
          let base64Image = "";
          let mime = "image/jpeg";

          if (contentType.includes("application/json")) {
            const json = await cfResponse.json();
            if (json.result?.image) {
              base64Image = json.result.image;
              mime = "image/jpeg";
            }
          } else {
            const arrayBuffer = await cfResponse.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            let binary = "";
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            base64Image = btoa(binary);
            mime = contentType.includes("png") ? "image/png" : "image/jpeg";
          }

          if (base64Image) {
            return new Response(
              JSON.stringify({
                imageBase64: `data:${mime};base64,${base64Image}`,
                mimeType: mime,
                provider: "cloudflare-flux",
                width,
                height,
              }),
              { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        } else {
          console.warn(`[generate-image] Cloudflare AI returned ${cfResponse.status}:`, await cfResponse.text());
        }
      } catch (cfErr) {
        console.warn("[generate-image] Cloudflare AI fetch failed:", cfErr);
      }
    }

    // 4. Tier 2: Hugging Face Serverless Inference Fallback with bounded 503 retry (FLUX.1-schnell)
    const HF_TOKEN = Deno.env.get("HF_TOKEN");
    if (HF_TOKEN && !body.skipCloud) {
      const maxHfAttempts = 2;
      for (let attempt = 1; attempt <= maxHfAttempts; attempt++) {
        try {
          const hfResponse = await fetch(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                inputs: enhancedPrompt,
              }),
            }
          );

          if (hfResponse.ok) {
            const arrayBuffer = await hfResponse.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            let binary = "";
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64Image = btoa(binary);

            return new Response(
              JSON.stringify({
                imageBase64: `data:image/jpeg;base64,${base64Image}`,
                mimeType: "image/jpeg",
                provider: "huggingface-flux",
                width,
                height,
              }),
              { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          } else if (hfResponse.status === 503 && attempt < maxHfAttempts) {
            console.warn("[generate-image] Hugging Face 503 (model loading), waiting 2s before retry...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
          } else {
            console.warn(`[generate-image] Hugging Face returned ${hfResponse.status}:`, await hfResponse.text());
            break;
          }
        } catch (hfErr) {
          console.warn("[generate-image] Hugging Face fetch failed:", hfErr);
          break;
        }
      }
    }

    // 5. Tier 3: Zero-Egress Procedural SVG Story Engine Fallback
    const svgString = generateProceduralStorySvg(rawPrompt, width, height, theme, scene);
    const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));

    return new Response(
      JSON.stringify({
        imageBase64: `data:image/svg+xml;base64,${svgBase64}`,
        mimeType: "image/svg+xml",
        provider: "procedural-svg",
        width,
        height,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[generate-image] Unhandled error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", code: "SERVER_ERROR" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
