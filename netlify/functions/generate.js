import { getJsonBody, json, kieRequest, uploadToKieBase64 } from './_shared.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  try {
    const { preset, variant, imageBase64, inputImageUrl, customPrompt } = getJsonBody(event);

    if (!preset?.basePrompt) {
      return json(400, { error: 'Preset invalide' });
    }

    const prompt = [
      preset.basePrompt,
      variant?.promptAddon,
      customPrompt,
      preset?.negativePrompt ? `Avoid: ${preset.negativePrompt}` : null,
    ].filter(Boolean).join(', ');

    const imageInput = [];
    let sourceImageUrl = inputImageUrl || null;

    if (sourceImageUrl) {
      imageInput.push(sourceImageUrl);
    } else if (imageBase64) {
      sourceImageUrl = await uploadToKieBase64(imageBase64, 'source.jpg');
      imageInput.push(sourceImageUrl);
    }

    const input = {
      prompt,
      image_input: imageInput,
      aspect_ratio: variant?.aspectRatio || preset.aspectRatio || '1:1',
      resolution: preset.resolution || '1K',
      output_format: preset.outputFormat || 'png',
    };

    const result = await kieRequest('createTask', {
      method: 'POST',
      body: {
        model: 'nano-banana-2',
        input,
      },
    });

    if (result.code !== 200) {
      throw new Error(result.msg || 'Erreur API kie.ai');
    }

    return json(200, {
      taskId: result.data.taskId,
      variantId: variant?.id || null,
      variantName: variant?.name || null,
      sourceImageUrl,
    });
  } catch (err) {
    return json(500, { error: err.message });
  }
};
