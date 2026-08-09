import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.VITE_GEMINI_API_KEY,
});

try {
  const pager = await ai.models.list();

  console.log("=== AVAILABLE MODELS ===");

  for await (const model of pager) {
    console.log(model.name);
  }
} catch (err) {
  console.error(err);
}