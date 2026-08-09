import { ProviderManager } from '../src/services/ai/imageEngine/ProviderManager';
import type { IllustrationPrompt } from '../src/services/ai/illustrationPromptGenerator';

async function testE2E() {
  const manager = new ProviderManager();
  manager.setActiveProvider('pollinations');

  const prompts: IllustrationPrompt[] = [
    {
      scene: 1,
      title: "Magical Forest",
      prompt: "A magical forest with glowing mushrooms, digital art"
    },
    {
      scene: 2,
      title: "Friendly Dragon",
      prompt: "A friendly dragon reading a book, watercolor style"
    },
    {
      scene: 3,
      title: "Cozy Treehouse",
      prompt: "A cozy treehouse at sunset, oil painting"
    }
  ];

  console.log('--- Starting Image Generation Test ---');
  console.log(`Active Provider: ${manager.getActiveProviderName()}`);

  const startTime = Date.now();

  try {
    const provider = manager.getActiveProvider();
    const results = await provider.generateImages(prompts);

    const duration = Date.now() - startTime;

    console.log(`Selected provider: ${results[0].provider ?? "unknown"}`);
    console.log(`Generation time: ${duration}ms`);

    results.forEach((r) => {
      console.log(`Scene ${r.scene}: ${r.imageUrl}`);
    });

  } catch (err) {
    console.error(err);
  }
}

testE2E();