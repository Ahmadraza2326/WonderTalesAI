import { ProviderManager } from '../src/services/ai/imageEngine/ProviderManager';
import type { IllustrationPrompt } from '../src/services/ai/illustrationPromptGenerator';

const WONDERTALES_PROMPTS: IllustrationPrompt[] = [
  {
    scene: 1,
    title: 'The Whispering Forest',
    prompt: 'Children\'s storybook illustration of a magical forest with glowing bioluminescent mushrooms and soft moonlight, Pixar-quality, warm cinematic lighting, soft painterly textures.'
  },
  {
    scene: 2,
    title: 'The Dragon\'s New Library',
    prompt: 'A friendly green dragon wearing spectacles, carefully reading a large leather-bound book in a cozy stone library, expressive facial emotions, Pixar-quality, highly detailed.'
  },
  {
    scene: 3,
    title: 'Sunrise at the Treehouse',
    prompt: 'A cozy wooden treehouse perched high in an ancient oak tree at sunrise, golden light filtering through leaves, family friendly atmosphere, high quality digital illustration.'
  }
];

async function verifyProvider(providerName: string) {
  console.log(`\n--- Testing Provider: ${providerName.toUpperCase()} ---`);

  const manager = new ProviderManager();
  manager.setActiveProvider(providerName as any);
  const provider = manager.getActiveProvider();

  const startTime = Date.now();
  const results = await provider.generateImages(WONDERTALES_PROMPTS);
  const duration = Date.now() - startTime;

  let successCount = 0;
  let failCount = 0;

  for (const res of results) {
    const promptObj = WONDERTALES_PROMPTS.find(p => p.scene === res.scene);
    console.log(`\n[Scene ${res.scene}] ${promptObj?.title}`);
    console.log(`  Prompt: ${promptObj?.prompt.substring(0, 50)}...`);
    console.log(`  URL: ${res.imageUrl}`);
    console.log(`  Provider: ${res.provider || providerName}`);

    try {
      const response = await fetch(res.imageUrl);
      if (response.ok) {
        console.log('  Result: PASS');
        successCount++;
      } else {
        console.log(`  Result: FAIL (HTTP ${response.status})`);
        failCount++;
      }
    } catch (e) {
      console.log(`  Result: FAIL (Fetch error)`);
      failCount++;
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Total scenes: ${results.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Avg time: ${(duration / results.length).toFixed(0)}ms`);
}

async function runAll() {
  await verifyProvider('pollinations');
}

runAll().catch(console.error);
