import { getGeminiClient } from './src/services/geminiService.ts';

async function listModels() {
  try {
    const client = getGeminiClient();
   const pager = await client.models.list();

for await (const model of pager) {
  console.log(model.name);
}
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
