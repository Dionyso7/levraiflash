import { getJsonBody, json, kieRequest, uploadToKieBase64 } from './_shared.js';

function isDaguerrePreset(preset) {
  if (!preset) return false;
  if (preset?.key === 'daguerre') return true;
  if (preset?.id === 'local-daguerre') return true;
  return String(preset?.name || '').toLowerCase().trim() === 'daguerre';
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  try {
    const {
      preset,
      variant,
      imageBase64,
      imageBase64List,
      inputImageUrl,
      inputImageUrls,
      referenceImageUrls,
      uploadFileName,
      uploadFileNames,
      customPrompt,
      generationSessionId,
      uploadOnly,
    } = getJsonBody(event);

    if (uploadOnly) {
      if (!imageBase64) {
        return json(400, { error: 'Image source manquante pour upload' });
      }

      const uploadedUrl = await uploadToKieBase64(imageBase64, uploadFileName || 'source.jpg');
      return json(200, { sourceImageUrl: uploadedUrl });
    }

    if (!preset?.basePrompt) {
      return json(400, { error: 'Preset invalide' });
    }

    const safeCustomPrompt = typeof customPrompt === 'string'
      ? customPrompt.trim().replace(/\s+/g, ' ').slice(0, 380)
      : '';

    const prompt = [
      variant?.promptOverride || [preset.basePrompt, variant?.promptAddon].filter(Boolean).join(', '),
      safeCustomPrompt,
      (variant?.negativePrompt || preset?.negativePrompt) ? `Avoid: ${variant?.negativePrompt || preset?.negativePrompt}` : null,
    ].filter(Boolean).join(', ');

    const sourceMode = variant?.sourceMode === 'master' ? 'master' : 'source';
    const imageInput = [];
    let sourceImageUrl = null;

    const pushed = new Set();
    const pushImage = (url) => {
      if (typeof url !== 'string' || !url || pushed.has(url)) return;
      pushed.add(url);
      imageInput.push(url);
    };

    if (sourceMode === 'source') {
      if (Array.isArray(referenceImageUrls) && referenceImageUrls.length > 0) {
        throw new Error("La vue maitre ne peut pas reutiliser d'images de reference");
      }

      const cleanInputImageUrls = Array.isArray(inputImageUrls)
        ? inputImageUrls.filter((item) => typeof item === 'string' && item)
        : [];

      if (cleanInputImageUrls.length > 0) {
        cleanInputImageUrls.forEach(pushImage);
        sourceImageUrl = cleanInputImageUrls[0];
      } else if (imageBase64) {
        sourceImageUrl = await uploadToKieBase64(imageBase64, uploadFileName || 'source.jpg');
        pushImage(sourceImageUrl);
      } else if (inputImageUrl) {
        sourceImageUrl = inputImageUrl;
        pushImage(sourceImageUrl);
      } else {
        throw new Error('Image source manquante pour la vue maitre');
      }
    } else {
      if (imageBase64 || inputImageUrl) {
        throw new Error("Une variante derivee doit utiliser uniquement le master de la session courante");
      }

      const cleanReferenceUrls = Array.isArray(referenceImageUrls)
        ? [...new Set(referenceImageUrls.filter((url) => typeof url === 'string' && url))]
        : [];

      if (cleanReferenceUrls.length !== 1) {
        throw new Error("Une variante derivee doit recevoir exactement une image de reference");
      }

      sourceImageUrl = cleanReferenceUrls[0];
      pushImage(sourceImageUrl);
    }

    if (sourceMode === 'source' && imageInput.length === 0) {
      throw new Error("La vue maitre doit contenir au moins une image source");
    }

    if (sourceMode === 'master' && imageInput.length !== 1) {
      throw new Error("Une variante derivee doit contenir exactement une image de reference");
    }

    console.log(JSON.stringify({
      event: 'flash.generate',
      generationSessionId: generationSessionId || null,
      variantId: variant?.id || null,
      variantName: variant?.name || null,
      sourceMode,
      imageInputCount: imageInput.length,
    }));

    const input = {
      prompt,
      image_input: imageInput,
      aspect_ratio: variant?.aspectRatio || preset.aspectRatio || '1:1',
      resolution: preset.resolution || '1K',
      output_format: preset.outputFormat || 'png',
    };

    const requestedModel = typeof preset?.model === 'string' && preset.model.trim()
      ? preset.model.trim()
      : (isDaguerrePreset(preset) ? 'gpt-image-2-image-to-image' : 'nano-banana-2');

    const result = await kieRequest('createTask', {
      method: 'POST',
      body: {
        model: requestedModel,
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
