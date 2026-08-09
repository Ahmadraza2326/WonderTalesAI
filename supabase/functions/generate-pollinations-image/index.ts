import { serve } from "std/http/server.ts";
import { encode } from "std/encoding/base64.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const POLLINATIONS_API_KEY = Deno.env.get("POLLINATIONS_API_KEY");
    if (!POLLINATIONS_API_KEY) {
      return new Response(JSON.stringify({ error: "Configuration Error" }), { status: 500 });
    }

    const { prompt, width, height, seed, model } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://gen.pollinations.ai/image/${encodedPrompt}?width=${width || 1024}&height=${height || 1024}&seed=${seed || 42}&model=${model || "flux"}&nologo=true`;

    const response = await fetch(url, {
      headers: { "Authorization": `Bearer ${POLLINATIONS_API_KEY}` }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Image API Error" }), { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const base64Image = encode(new Uint8Array(imageBuffer));

    return new Response(JSON.stringify({ imageBase64: base64Image, mimeType: contentType }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
});
