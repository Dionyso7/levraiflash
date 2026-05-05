export const DEFAULT_PRESET_TEMPLATES = [
  {
    key: 'fleuriste',
    name: 'Fleuriste',
    description: "Le bouquet doit rester identique a travers tous les plans. Seule la mise en scene change.",
    theme: 'editorial',
    basePrompt: 'The flower bouquet from the reference image, reproduced exactly with identical flowers, identical colors, identical arrangement and identical proportions. Placed upright on a clean white surface, soft diffused natural light from the left, pure white background, bouquet in full sharp focus with visible petal texture, stems clearly visible and bound, no vase, no hands, no text, no props, product photography, 85mm lens equivalent, photorealistic',
    negativePrompt: 'hands, fingers, face, person, watermark, text, logo, artificial flowers, plastic, dark background, harsh shadows, different flowers, altered bouquet, vase',
    aspectRatio: '1:1',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Ancre studio',
        promptAddon: 'Fidele au reel, a generer en premier.',
        promptOverride: 'The flower bouquet from the reference image, reproduced exactly with identical flowers, identical colors, identical arrangement and identical proportions. Placed upright on a clean white surface, soft diffused natural light from the left, pure white background, bouquet in full sharp focus with visible petal texture, stems clearly visible and bound, no vase, no hands, no text, no props, product photography, 85mm lens equivalent, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, text, logo, artificial flowers, plastic, dark background, harsh shadows, different flowers, altered bouquet, vase',
        aspectRatio: '1:1',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Bouquet flottant',
        promptAddon: 'Money shot.',
        promptOverride: 'The exact same flower bouquet as in the reference image, with identical flowers, identical colors, identical arrangement and identical proportions - do not alter or hallucinate any part of the bouquet. The bouquet floating mid-air against a pure white background, stems hanging freely below with no surface contact, warm golden rim light from behind sculpting the outline of the stems and petals, soft diffused shadow below suggesting weightlessness, flowers in sharp focus, background completely clean, no hands, no support visible, no text, editorial product photography, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, text, different flowers, altered bouquet, vase, surface contact, support structure, dark background',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Petales figes en vol',
        promptAddon: 'Effet WOW.',
        promptOverride: 'The exact same flower bouquet as in the reference image, with identical flowers, identical colors, identical arrangement and identical proportions - do not alter or hallucinate any part of the bouquet. The bouquet standing upright surrounded by individual petals suspended mid-air as if just exploded outward from the bouquet, petals matching the exact colors of the flowers in the reference, petals frozen in motion at various distances and angles, pure white background, warm diffused studio light, each petal in sharp focus with visible texture, no hands, no text, high-end floral editorial photography, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, text, different flowers, wrong petal colors, altered bouquet, dark background, harsh shadows',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'caviste',
    name: 'Caviste',
    description: "La bouteille, l'etiquette, la capsule et la couleur du verre doivent etre identiques dans chaque plan.",
    theme: 'premium',
    basePrompt: 'The exact wine bottle from the reference image, reproduced with identical bottle shape, identical glass color, identical capsule color, identical label design, identical label text and typography, identical proportions. Bottle standing upright on a dark slate surface, soft directional studio light from the upper left creating a gentle highlight along the glass, dark charcoal background, full bottle in sharp focus, no additional props, no hands, no glass, no text added, product photography, 85mm lens equivalent, photorealistic',
    negativePrompt: 'hands, face, person, watermark, different bottle, different label, altered label text, invented label, hallucinated text, blurry label, additional bottles, wine glass, props',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Ancre studio',
        promptAddon: 'Fidele au reel, a generer en premier.',
        promptOverride: 'The exact wine bottle from the reference image, reproduced with identical bottle shape, identical glass color, identical capsule color, identical label design, identical label text and typography, identical proportions. Bottle standing upright on a dark slate surface, soft directional studio light from the upper left creating a gentle highlight along the glass, dark charcoal background, full bottle in sharp focus, no additional props, no hands, no glass, no text added, product photography, 85mm lens equivalent, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different bottle, different label, altered label text, invented label, hallucinated text, blurry label, additional bottles, wine glass, props',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Levitation fond sombre',
        promptAddon: 'Money shot.',
        promptOverride: 'The exact same wine bottle as in the reference image, with identical bottle shape, identical glass color, identical capsule color, identical label design and identical label text fully preserved and legible - do not alter or hallucinate any part of the bottle or label. The bottle levitating vertically mid-air against a deep black background, two narrow rim lights on each side sculpting the curve of the glass, wine color visible as a rich translucent layer inside the glass, subtle reflection on a glossy surface below, no hands, no support structure visible, luxury editorial product photography, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different bottle, different label, altered label, invented text, blurry label, support structure, white background, props',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Accord mets et vins',
        promptAddon: 'Lifestyle.',
        promptOverride: 'The exact same wine bottle as in the reference image, with identical bottle shape, identical glass color, identical capsule color, identical label design and identical label text fully preserved and legible - do not alter or hallucinate any part of the bottle or label. The bottle placed upright on a dark slate board surrounded by aged cheese, dark grapes and a folded linen cloth, overhead flat lay composition, soft warm light from above, no hands, no wine glass, luxury food and wine editorial photography, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different bottle, different label, altered label, invented text, blurry label, wine glass, cluttered composition, bright background',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'chocolatier',
    name: 'Chocolatier',
    description: "La boite et les chocolats doivent rester identiques. Les plans d'effet derivent de la reference sans l'alterer.",
    theme: 'premium',
    basePrompt: 'The exact chocolate box from the reference image, reproduced with identical box shape, identical box design, identical chocolates arrangement, identical chocolate colors and shapes. Box open and photographed from slightly above, soft diffused light from above with no harsh shadows, neutral warm-toned light background, chocolates in sharp focus with visible surface texture and sheen, no hands, no text added, no additional props, clean food product photography, 50mm lens equivalent, photorealistic',
    negativePrompt: 'hands, fingers, face, person, watermark, different chocolates, different box, altered design, closed box, dark background, harsh shadows',
    aspectRatio: '1:1',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Ancre studio',
        promptAddon: 'Fidele au reel, a generer en premier.',
        promptOverride: 'The exact chocolate box from the reference image, reproduced with identical box shape, identical box design, identical chocolates arrangement, identical chocolate colors and shapes. Box open and photographed from slightly above, soft diffused light from above with no harsh shadows, neutral warm-toned light background, chocolates in sharp focus with visible surface texture and sheen, no hands, no text added, no additional props, clean food product photography, 50mm lens equivalent, photorealistic',
        negativePrompt: 'hands, fingers, face, person, watermark, different chocolates, different box, altered design, closed box, dark background, harsh shadows',
        aspectRatio: '1:1',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Coulee chocolat freeze',
        promptAddon: 'Desir immediat.',
        promptOverride: 'A thin stream of liquid dark chocolate whose color exactly matches the chocolates in the reference image, falling and frozen perfectly mid-flow above a glossy dark surface, the stream showing internal texture and warm brown tones, a small frozen splash at the point of impact below, dramatic warm side lighting creating a highlight along the chocolate stream, deep dark background, no hands, no text, macro food photography, photorealistic',
        negativePrompt: 'hands, fingers, face, watermark, text, burnt chocolate, dirty surface, wrong chocolate color, cartoon, blurry subject',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Cassure suspendue',
        promptAddon: 'Effet WOW.',
        promptOverride: 'A single dark chocolate square whose color and finish exactly match the chocolates in the reference image, breaking apart with the two halves frozen mid-separation in the air, fine chocolate crumbs and shards suspended around the break point showing the exact same chocolate texture as the reference, clean matte dark background, warm directional light from the side revealing the rough interior texture, no hands, no text, macro product photography, photorealistic',
        negativePrompt: 'hands, fingers, face, watermark, text, wrong chocolate color, burnt chocolate, dirty surface, cartoon, blurry subject',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'epicerie-fine',
    name: 'Épicerie fine',
    description: "Le pot ou produit phare doit conserver son etiquette et sa forme exactes dans chaque plan.",
    theme: 'commerce',
    basePrompt: 'The exact artisan product from the reference image, reproduced with identical jar or packaging shape, identical label design, identical label text and typography, identical product color visible through the packaging. Placed on a light natural wood surface, soft natural window light from the left, clean white or light beige background, product in full sharp focus showing label texture and detail, no hands, no additional props, honest product photography, 85mm lens equivalent, photorealistic',
    negativePrompt: 'hands, face, person, watermark, different product, different label, altered label text, invented label, hallucinated text, plastic packaging, dark background, supermarket products',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Ancre studio',
        promptAddon: 'Fidele au reel, a generer en premier.',
        promptOverride: 'The exact artisan product from the reference image, reproduced with identical jar or packaging shape, identical label design, identical label text and typography, identical product color visible through the packaging. Placed on a light natural wood surface, soft natural window light from the left, clean white or light beige background, product in full sharp focus showing label texture and detail, no hands, no additional props, honest product photography, 85mm lens equivalent, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different product, different label, altered label text, invented label, hallucinated text, plastic packaging, dark background, supermarket products',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Coulee doree freeze backlit',
        promptAddon: 'Money shot.',
        promptOverride: 'The exact same product jar as in the reference image, with identical jar shape, identical label design and identical label text fully preserved - do not alter or hallucinate any part of the jar or label. The product pouring or dripping from the jar frozen mid-flow, the liquid matching the exact color of the product in the reference image, warm backlight shining directly through the liquid making it glow and appear translucent, light natural surface below, clean light background, no hands, no text, macro food editorial photography, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different product, different label, altered label, invented text, dark background, artificial colors',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: "Overhead table d'abondance",
        promptAddon: 'Art de vivre.',
        promptOverride: 'The exact same product jar as in the reference image, with identical jar shape, identical label design and identical label text fully preserved and legible - do not alter or hallucinate any part of the jar or label. The jar placed at the center of a flat lay overhead composition on a white marble surface, surrounded by complementary artisan items such as aged cheese, bread, dried fruits and nuts and a natural linen napkin, warm diffused natural light from above, generous negative space between items, no hands, no text, lifestyle food editorial photography, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different product, altered label, invented text, plastic packaging, supermarket products, cluttered composition, dark background',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'parfumeur',
    name: 'Parfumeur',
    description: "Le flacon est un objet de luxe a forte identite visuelle. Sa forme, sa couleur de jus et son bouchon doivent etre preserves.",
    theme: 'premium',
    basePrompt: 'The exact perfume bottle from the reference image, reproduced with identical bottle shape, identical cap design, identical glass color, identical fragrance liquid color, identical proportions. Standing upright on a clean reflective white surface, soft diffused studio light from slightly above and to the left, white background, bottle in complete sharp focus showing glass clarity and cap detail, subtle clean reflection on the surface below, no hands, no text, no props, luxury product photography, 85mm lens equivalent, photorealistic',
    negativePrompt: 'hands, face, person, watermark, different bottle, different cap, altered shape, invented design, dark background, props, text',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Ancre studio',
        promptAddon: 'Fidele au reel, a generer en premier.',
        promptOverride: 'The exact perfume bottle from the reference image, reproduced with identical bottle shape, identical cap design, identical glass color, identical fragrance liquid color, identical proportions. Standing upright on a clean reflective white surface, soft diffused studio light from slightly above and to the left, white background, bottle in complete sharp focus showing glass clarity and cap detail, subtle clean reflection on the surface below, no hands, no text, no props, luxury product photography, 85mm lens equivalent, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different bottle, different cap, altered shape, invented design, dark background, props, text',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Levitation fond velours',
        promptAddon: 'Prestige.',
        promptOverride: 'The exact same perfume bottle as in the reference image, with identical bottle shape, identical cap design, identical glass color and identical fragrance liquid color fully preserved - do not alter or hallucinate any part of the bottle. The bottle floating vertically mid-air against a deep black velvet background, narrow rim lights on both sides creating a thin luminous edge along the glass silhouette, fragrance liquid color glowing from within, perfectly clean surface reflection below, no hands, no support structure visible, no text, ultra sharp, luxury editorial product photography, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different bottle, altered shape, support structure, white background, props, text, different cap',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Mist freeze',
        promptAddon: 'Effet unique.',
        promptOverride: 'The exact same perfume bottle as in the reference image, with identical bottle shape, identical cap design, identical glass color and identical fragrance liquid color fully preserved - do not alter or hallucinate any part of the bottle. A fine mist of fragrance micro-droplets frozen mid-air around and above the bottle, individual droplets catching a soft backlight and creating a luminous halo, dark background, bottle itself in sharp focus, mist cloud slightly soft and ethereal, no nozzle visible, no hands, no text, luxury fragrance campaign photography, photorealistic',
        negativePrompt: 'hands, nozzle, face, person, watermark, different bottle, altered shape, white background, text, different cap, harsh light',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-04',
        name: 'Ingredients botaniques',
        promptAddon: 'Storytelling.',
        promptOverride: 'The exact same perfume bottle as in the reference image, with identical bottle shape, identical cap design, identical glass color and identical fragrance liquid color fully preserved - do not alter or hallucinate any part of the bottle. The bottle placed at the center of a composed arrangement of raw botanical ingredients on a dark stone surface, surrounding items include fresh rose petals, dried woody bark, small glass vessel with amber resin and scattered spice seeds, soft warm directional light from above casting gentle shadows, bottle in sharp focus, ingredients slightly softer, no hands, no text, luxury fragrance editorial photography, photorealistic',
        negativePrompt: 'hands, face, person, watermark, different bottle, altered shape, white background, text, different cap, cluttered composition',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
];

export function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export function getJsonBody(event) {
  if (!event.body) {
    return {};
  }

  try {
    return JSON.parse(event.body);
  } catch {
    throw new Error('Body JSON invalide');
  }
}

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} non configurée`);
  }

  return value;
}

function generateId(prefix) {
  return `${prefix}_${globalThis.crypto.randomUUID()}`;
}

export async function kieRequest(path, { method = 'GET', body } = {}) {
  const apiKey = requireEnv('KIEAI_API_KEY');
  const response = await fetch(`https://api.kie.ai/api/v1/jobs/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.msg || `Erreur KIE AI (${response.status})`);
  }

  return payload;
}

export async function uploadToKieBase64(imageBase64, fileName = 'photo.jpg') {
  const apiKey = requireEnv('KIEAI_API_KEY');
  const fileContent = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const response = await fetch('https://kieai.redpandaai.co/api/file-base64-upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base64Data: fileContent,
      fileName,
      uploadPath: 'images',
    }),
  });

  const payload = await response.json().catch(() => null);

  const uploadedUrl = payload?.data?.fileUrl || payload?.data?.downloadUrl;

  if (!response.ok || payload?.code !== 200 || !uploadedUrl) {
    throw new Error(payload?.msg || "Upload de l'image vers KIE échoué");
  }

  return uploadedUrl;
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!url) {
    throw new Error('SUPABASE_URL non configurée');
  }

  return { url, serviceRoleKey };
}

export async function supabaseRequest(path, { method = 'GET', body, prefer } = {}) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    if (Array.isArray(payload) && payload[0]?.message) {
      throw new Error(payload[0].message);
    }

    throw new Error(payload?.message || payload?.error_description || payload || `Erreur Supabase (${response.status})`);
  }

  return payload;
}

function encodeFilter(value) {
  return encodeURIComponent(value);
}

function sanitizeText(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function normalizeOutputFormat(value, fallback = 'png') {
  const normalized = sanitizeText(value, fallback).toLowerCase();
  return ['png', 'jpg', 'webp'].includes(normalized) ? normalized : fallback;
}

function normalizeAspectRatio(value, fallback = '1:1') {
  const normalized = sanitizeText(value, fallback).toLowerCase();
  return ['auto', '1:1', '4:5', '9:16', '16:9'].includes(normalized) ? normalized : fallback;
}

function normalizeVariantInput(variant, index, presetAspectRatio) {
  const name = sanitizeText(variant?.name, `Variante ${index + 1}`);

  return {
    id: sanitizeText(variant?.id, generateId('variant')),
    name,
    promptAddon: sanitizeText(variant?.promptAddon),
    promptOverride: sanitizeText(variant?.promptOverride),
    negativePrompt: sanitizeText(variant?.negativePrompt),
    aspectRatio: normalizeAspectRatio(variant?.aspectRatio, presetAspectRatio || '1:1'),
    enabledByDefault: Boolean(variant?.enabledByDefault),
    isMaster: Boolean(variant?.isMaster),
    sourceMode: sanitizeText(variant?.sourceMode, 'master') === 'source' ? 'source' : 'master',
  };
}

function normalizePresetInput(input, { fallbackId, clientId } = {}) {
  const aspectRatio = normalizeAspectRatio(input?.aspectRatio, '1:1');
  const variants = Array.isArray(input?.variants) ? input.variants : [];

  const normalizedVariants = variants.length > 0
    ? variants.map((variant, index) => normalizeVariantInput(variant, index, aspectRatio))
    : [normalizeVariantInput({ name: 'Vue principale', promptAddon: '', isMaster: true, sourceMode: 'source' }, 0, aspectRatio)];

  if (!normalizedVariants.some((variant) => variant.isMaster)) {
    normalizedVariants[0].isMaster = true;
  }

  normalizedVariants.forEach((variant) => {
    if (variant.isMaster) {
      variant.sourceMode = 'source';
    }
  });

  return {
    id: sanitizeText(input?.id, fallbackId || generateId('preset')),
    client_id: clientId,
    name: sanitizeText(input?.name, 'Nouveau preset'),
    description: sanitizeText(input?.description),
    theme: sanitizeText(input?.theme, 'custom'),
    base_prompt: sanitizeText(input?.basePrompt, 'Professional product photography, realistic, preserve the exact product details.'),
    negative_prompt: sanitizeText(input?.negativePrompt),
    aspect_ratio: aspectRatio,
    resolution: sanitizeText(input?.resolution, '1K'),
    output_format: normalizeOutputFormat(input?.outputFormat, 'png'),
    variants: normalizedVariants,
    updated_at: new Date().toISOString(),
  };
}

function createDefaultPresetRows(clientId) {
  return DEFAULT_PRESET_TEMPLATES.map((template) => normalizePresetInput({
    id: `${clientId}_${template.key}`,
    name: template.name,
    description: template.description,
    theme: template.theme,
    basePrompt: template.basePrompt,
    negativePrompt: template.negativePrompt,
    aspectRatio: template.aspectRatio,
    resolution: template.resolution,
    outputFormat: template.outputFormat,
    variants: template.variants.map((variant) => ({
      id: `${clientId}_${template.key}_${variant.key}`,
      name: variant.name,
      promptAddon: variant.promptAddon,
      promptOverride: variant.promptOverride,
      negativePrompt: variant.negativePrompt,
      aspectRatio: variant.aspectRatio,
      enabledByDefault: variant.enabledByDefault,
      isMaster: variant.isMaster,
      sourceMode: variant.sourceMode,
    })),
  }, { clientId }));
}

export function toPresetItem(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    theme: row.theme || 'custom',
    basePrompt: row.base_prompt,
    negativePrompt: row.negative_prompt || '',
    aspectRatio: normalizeAspectRatio(row.aspect_ratio, '1:1'),
    resolution: row.resolution || '1K',
    outputFormat: normalizeOutputFormat(row.output_format, 'png'),
    variants: Array.isArray(row.variants) ? row.variants.map((variant, index) => normalizeVariantInput(variant, index, row.aspect_ratio)) : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function syncDefaultPresets(clientId, existingRows = []) {
  const rows = createDefaultPresetRows(clientId);
  const managedIds = new Set(rows.map((row) => row.id));
  const staleRows = (Array.isArray(existingRows) ? existingRows : []).filter((row) => (
    typeof row?.id === 'string'
    && row.id.startsWith(`${clientId}_`)
    && !managedIds.has(row.id)
  ));

  await supabaseRequest('flash_presets', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=minimal',
    body: rows,
  });

  if (staleRows.length > 0) {
    await Promise.all(staleRows.map((row) => supabaseRequest(
      `flash_presets?id=eq.${encodeFilter(row.id)}&client_id=eq.${encodeFilter(clientId)}`,
      {
        method: 'DELETE',
        prefer: 'return=minimal',
      },
    )));
  }

  return rows.length > 0;
}

export async function listPresets(clientId) {
  if (!clientId) {
    throw new Error('clientId manquant');
  }

  let rows = await supabaseRequest(
    `flash_presets?client_id=eq.${encodeFilter(clientId)}&select=id,name,description,theme,base_prompt,negative_prompt,aspect_ratio,resolution,output_format,variants,created_at,updated_at&order=created_at.asc`,
  );

  const insertedDefaults = await syncDefaultPresets(clientId, rows);

  if (!Array.isArray(rows) || rows.length === 0 || insertedDefaults) {
    rows = await supabaseRequest(
      `flash_presets?client_id=eq.${encodeFilter(clientId)}&select=id,name,description,theme,base_prompt,negative_prompt,aspect_ratio,resolution,output_format,variants,created_at,updated_at&order=created_at.asc`,
    );
  }

  return Array.isArray(rows) ? rows.map(toPresetItem) : [];
}

export async function upsertPreset(clientId, preset) {
  if (!clientId) {
    throw new Error('clientId manquant');
  }

  const row = normalizePresetInput(preset, {
    fallbackId: sanitizeText(preset?.id),
    clientId,
  });

  const rows = await supabaseRequest('flash_presets?on_conflict=id', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: [row],
  });

  return Array.isArray(rows) && rows[0] ? toPresetItem(rows[0]) : toPresetItem(row);
}

export async function deletePreset(clientId, presetId) {
  if (!clientId || !presetId) {
    throw new Error('clientId ou presetId manquant');
  }

  await supabaseRequest(
    `flash_presets?id=eq.${encodeFilter(presetId)}&client_id=eq.${encodeFilter(clientId)}`,
    {
      method: 'DELETE',
      prefer: 'return=minimal',
    },
  );
}

function normalizeHistoryImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.flatMap((item, index) => {
    if (typeof item === 'string') {
      return [{
        id: `asset_${index}`,
        url: item,
        label: `Image ${index + 1}`,
        variantId: null,
      }];
    }

    if (item && typeof item === 'object' && typeof item.url === 'string') {
      return [{
        id: sanitizeText(item.id, `asset_${index}`),
        url: item.url,
        label: sanitizeText(item.label, `Image ${index + 1}`),
        variantId: sanitizeText(item.variantId, null),
      }];
    }

    return [];
  });
}

export function toHistoryItem(row) {
  return {
    taskId: row.task_id,
    presetId: row.preset_id,
    presetName: row.preset_name || '',
    images: normalizeHistoryImages(row.images),
    date: row.created_at,
  };
}

export async function listHistory(clientId) {
  if (!clientId) {
    throw new Error('clientId manquant');
  }

  const rows = await supabaseRequest(
    `flash_history?client_id=eq.${encodeFilter(clientId)}&select=task_id,preset_id,preset_name,images,created_at&order=created_at.desc`,
  );

  return Array.isArray(rows) ? rows.map(toHistoryItem) : [];
}

export async function saveHistoryEntry({ clientId, entry }) {
  if (!clientId || !entry?.taskId || !entry?.presetId || !Array.isArray(entry?.images)) {
    return null;
  }

  const rows = await supabaseRequest(
    'flash_history?on_conflict=client_id,task_id',
    {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      body: [{
        client_id: clientId,
        task_id: entry.taskId,
        preset_id: entry.presetId,
        preset_name: sanitizeText(entry.presetName),
        images: normalizeHistoryImages(entry.images),
      }],
    },
  );

  return Array.isArray(rows) && rows[0] ? toHistoryItem(rows[0]) : null;
}

export async function deleteHistory(taskId, clientId) {
  if (!taskId || !clientId) {
    throw new Error('taskId ou clientId manquant');
  }

  await supabaseRequest(
    `flash_history?task_id=eq.${encodeFilter(taskId)}&client_id=eq.${encodeFilter(clientId)}`,
    {
      method: 'DELETE',
      prefer: 'return=minimal',
    },
  );
}
