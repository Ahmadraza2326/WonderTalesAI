import type {
  GeneratedIllustration,
  ImageProvider,
} from "../../imageProvider";

import type {
  IllustrationPrompt,
} from "../../illustrationPromptGenerator";

import { getGeminiClient } from "../../../geminiService";

export class GeminiImageProvider implements ImageProvider {

  // Models to try in order
  private readonly MODELS = [
    "gemini-3.1-flash-image",
    "gemini-3.1-flash-image-preview",
    "gemini-2.5-flash-image",
  ];

  async generateImages(
    prompts: IllustrationPrompt[]
  ): Promise<GeneratedIllustration[]> {

    return Promise.all(
      prompts.map((prompt) => this.generateImage(prompt))
    );

  }

  private async generateImage(
    prompt: IllustrationPrompt
  ): Promise<GeneratedIllustration> {

    const client = getGeminiClient();

    let lastError: unknown = null;

    for (const model of this.MODELS) {

      try {

        console.log(`Trying image model: ${model}`);

        const response = await client.models.generateContent({

          model,

          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt.prompt,
                },
              ],
            },
          ],

          config: {
            responseModalities: ["IMAGE"],
          },

        });

        const parts =
          response.candidates?.[0]?.content?.parts ?? [];

        const imagePart = parts.find(
          (part) => part.inlineData?.data
        );

        if (imagePart?.inlineData?.data) {

          console.log(`✅ Image generated using ${model}`);

          return {

            scene: prompt.scene,

            imageUrl: `data:image/png;base64,${imagePart.inlineData.data}`,

          };

        }

        console.warn(
          `Model ${model} returned no image. Trying next model...`
        );

      } catch (error) {

        console.warn(`❌ ${model} failed`);

        console.warn(error);

        lastError = error;

      }

    }

    console.error("All Gemini image models failed.");

    if (lastError instanceof Error) {

      throw new Error(
        `Image generation failed.\n\n${lastError.message}`
      );

    }

    throw new Error(
      "All Gemini image models failed."
    );

  }

}