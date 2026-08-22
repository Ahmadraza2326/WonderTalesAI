import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: "Supabase environment is not configured on the server." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session token", code: "UNAUTHENTICATED" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 3. Server-side Pre-flight Quota & Cooldown Check (Non-consuming)
    const { data: quotaStatus, error: quotaError } = await supabase.rpc(
      "get_user_generation_quota",
      { p_daily_limit: 10, p_cooldown_seconds: 20 }
    );

    if (quotaError) {
      console.error("[generate-story-package] Quota RPC error:", quotaError);
    }

    const quota = quotaStatus as {
      authenticated?: boolean;
      used?: number;
      daily_limit?: number;
      remaining?: number;
      cooldown_remaining?: number;
    } | null;

    if (quota) {
      if ((quota.cooldown_remaining ?? 0) > 0) {
        return new Response(
          JSON.stringify({
            error: `Cooldown active. Please wait ${quota.cooldown_remaining} seconds before generating another story.`,
            code: "COOLDOWN_ACTIVE",
            retry_after_seconds: quota.cooldown_remaining,
          }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      if ((quota.used ?? 0) >= (quota.daily_limit ?? 10)) {
        return new Response(
          JSON.stringify({
            error: `Daily limit of ${quota.daily_limit ?? 10} stories reached. Limit resets at midnight.`,
            code: "DAILY_LIMIT_REACHED",
          }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // 4. Validate Request Body
    const body = await req.json();
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing story generation prompt" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 5. Server-Side Gemini API Request (Gemini 3.6 Flash)
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("VITE_GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API key is not configured on the server." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`;

    const geminiResponse = await fetch(geminiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("[generate-story-package] Gemini API error:", geminiResponse.status, errorText);
      return new Response(
        JSON.stringify({
          error: `Gemini API returned error code ${geminiResponse.status}`,
          details: errorText,
        }),
        { status: geminiResponse.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const geminiData = await geminiResponse.json();
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!generatedText) {
      return new Response(
        JSON.stringify({ error: "Gemini returned an empty response." }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ text: generatedText }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err) {
    console.error("[generate-story-package] Unhandled error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
