import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('ERROR: VITE_GEMINI_API_KEY not found in .env file.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listAllModels() {
  try {
    console.log('--- Listing ALL available models ---');
    const pager = await ai.models.list();
    for await (const model of pager) {
      console.log(`Model: ${model.name} | Display: ${model.displayName}`);
    }
  } catch (err) {
    console.error('Error listing models:', err);
  }
}

listAllModels();
