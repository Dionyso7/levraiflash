import { getJsonBody, json, kieRequest, uploadToKieBase64 } from './_shared.js';

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
    } = getJsonBody(event);

    if (!preset?.basePrompt) {
      return json(400, { error: 'Preset invalide' });
    }

    const prompt = [
      variant?.promptOverride || [preset.basePrompt, variant?.promptAddon].filter(Boolean).join(', '),
      customPrompt,
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

      const cleanImageBase64List = Array.isArray(imageBase64List)
        ? imageBase64List.filter((item) => typeof item === 'string' && item)
        : [];
      const cleanInputImageUrls = Array.isArray(inputImageUrls)
        ? inputImageUrls.filter((item) => typeof item === 'string' && item)
        : [];
      const cleanUploadFileNames = Array.isArray(uploadFileNames)
        ? uploadFileNames.filter((item) => typeof item === 'string' && item)
        : [];

      if (cleanImageBase64List.length > 0) {
        const uploadedUrls = await Promise.all(cleanImageBase64List.map((item, index) => (
          uploadToKieBase64(item, cleanUploadFileNames[index] || `source-${index + 1}.jpg`)
        )));
        uploadedUrls.forEach(pushImage);
        sourceImageUrl = uploadedUrls[0] || null;
      } else if (imageBase64) {
        sourceImageUrl = await uploadToKieBase64(imageBase64, uploadFileName || 'source.jpg');
        pushImage(sourceImageUrl);
      } else if (cleanInputImageUrls.length > 0) {
        cleanInputImageUrls.forEach(pushImage);
        sourceImageUrl = cleanInputImageUrls[0];
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
