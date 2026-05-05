export const DEFAULT_PRESET_TEMPLATES = [
  {
    key: 'fleuriste',
    name: 'Fleuriste',
    description: "Plan 01 maître fidèle au réel, puis dérivés oniriques pour lévitation et pétales figés.",
    theme: 'editorial',
    basePrompt: 'A fresh flower bouquet placed on a clean white surface, soft diffused natural light from the left, neutral white background, flowers in sharp focus with visible petal texture and natural color, no styling props, no hands, no text, product photography, 85mm lens equivalent, f/4 aperture, photorealistic',
    negativePrompt: 'hands, fingers, face, person, watermark, text, logo, blur on subject, artificial flowers, plastic, dark background, harsh shadows, Instagram filter look',
    aspectRatio: '1:1',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Bouquet studio',
        promptAddon: 'Anchor shot, faithful to the real bouquet, clean packshot feel.',
        aspectRatio: '1:1',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Bouquet flottant',
        promptAddon: 'The same flower bouquet floating mid-air against a pure white background, warm golden rim light from behind sculpting the outline of the stems and petals, soft inner shadow below the bouquet suggesting weightlessness, flowers in sharp focus, background completely clean, no hands, no support visible, no text, editorial product photography, photorealistic.',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Pétales figés',
        promptAddon: 'The same flower bouquet surrounded by individual petals suspended mid-air as if just exploded outward, petals frozen in motion at various distances and angles, soft white background with very subtle depth haze, warm diffused studio light, each petal sharp with visible texture, no hands, no text, photorealistic, high-end floral editorial photography.',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'caviste',
    name: 'Caviste',
    description: "Plan 01 documentaire, puis désir par lévitation sculptée et versement freeze-frame.",
    theme: 'premium',
    basePrompt: 'A single wine bottle standing upright on a dark slate surface, soft directional studio light from the upper left creating a gentle highlight along the glass, dark charcoal background, bottle in full sharp focus showing glass texture and wine color through the glass, no label text required to be legible, no hands, no glass, no props, product photography, 85mm lens equivalent, photorealistic',
    negativePrompt: 'hands gripping bottle, face, person, watermark, readable label text, blurry liquid, cartoon, illustration, colored gel background, cheap looking, plastic surface',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Bouteille studio',
        promptAddon: 'Anchor shot, sober documentary bottle shot, faithful to the bottle shape and wine color.',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Lévitation sombre',
        promptAddon: 'The same wine bottle levitating vertically in mid-air against a deep black background, two narrow rim lights on each side sculpting the curve of the glass, wine color visible as a rich translucent layer inside, subtle reflection on an invisible glossy surface below, no hands, no support, no text, luxury editorial product photography, photorealistic.',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Versement freeze-frame',
        promptAddon: 'Dark red wine pouring from a bottle into a large round wine glass, frozen at the exact moment the liquid enters the glass, dynamic wine splash frozen mid-motion with fine droplets suspended in air, warm amber backlighting making the wine appear luminous and translucent, dark background, no hands visible on bottle, no text, high-speed photography aesthetic, photorealistic.',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'chocolatier',
    name: 'Chocolatier',
    description: "Plan 01 fidèle produit, puis gourmandise par coulée et cassure suspendue.",
    theme: 'premium',
    basePrompt: 'An open chocolate box photographed from slightly above, chocolates neatly arranged inside showing varied shapes and glazed surfaces, soft diffused light from above with no harsh shadows, neutral light warm-toned background, chocolates in sharp focus with visible surface texture and sheen, no hands, no text, no props, clean food product photography, 50mm lens equivalent, photorealistic',
    negativePrompt: 'hands, fingers, face, watermark, text, melted mess, burnt chocolate, dirty surface, artificial colors, cartoon, illustration, blurry subject',
    aspectRatio: '1:1',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Boîte ouverte',
        promptAddon: 'Anchor shot, faithful to the real assortment and surface finish of the chocolates.',
        aspectRatio: '1:1',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Coulée chocolat',
        promptAddon: 'A thin stream of liquid dark chocolate falling and frozen perfectly mid-flow before hitting a glossy dark surface, the stream shows internal texture and warm brown tones, a small frozen splash at the point of impact below, dramatic warm side lighting creating a highlight along the chocolate stream, deep dark background, no hands, no text, macro food photography, photorealistic.',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Cassure suspendue',
        promptAddon: 'A single dark chocolate square breaking apart, the two halves frozen mid-separation in the air, fine chocolate crumbs and shards suspended around the break point, clean matte dark background, warm directional light from the side showing the rough interior texture of the broken chocolate, no hands, no text, macro product photography, photorealistic.',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'epicerie-fine',
    name: 'Épicerie fine',
    description: "Plan 01 propre et honnête, puis abondance premium et coulée sensorielle.",
    theme: 'commerce',
    basePrompt: 'A single artisan product jar placed on a light natural wood surface, soft natural window light from the left, clean white or light beige background, jar in full sharp focus showing label texture and product color through glass, no hands, no additional props, honest product photography, 85mm lens equivalent, photorealistic',
    negativePrompt: 'hands, face, watermark, readable labels, plastic packaging, supermarket products, harsh flash lighting, dark background, cluttered composition, artificial colors',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Produit phare',
        promptAddon: 'Anchor shot, faithful to the jar, color and material.',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Coulée dorée',
        promptAddon: 'Golden honey pouring from a jar frozen mid-flow, the honey stream caught at its thickest and most luminous point, warm backlight shining directly through the honey making it glow amber and translucent, light natural surface below catching a small pool of honey, clean light background, no hands, no text, macro food editorial photography, photorealistic.',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: "Table d'abondance",
        promptAddon: 'Flat lay overhead shot of an artisan food selection arranged on a white marble surface, including a jar of the same product from shot 01 alongside complementary items such as aged cheese, bread, dried fruits and nuts, natural linen napkin, warm diffused natural light, composed with generous negative space between items, no hands, no text, no branding visible, lifestyle food editorial photography, photorealistic.',
        aspectRatio: '1:1',
        enabledByDefault: true,
        sourceMode: 'master',
      },
    ],
  },
  {
    key: 'parfumeur',
    name: 'Parfumeur',
    description: "Plan 01 ancre absolue, puis prestige, brume et storytelling botanique.",
    theme: 'premium',
    basePrompt: 'A single perfume bottle standing upright on a clean reflective white surface, soft diffused studio light from slightly above and to the left, white background, bottle in complete sharp focus showing glass clarity, cap detail, and the color of the fragrance liquid inside, subtle clean reflection on the surface below, no hands, no text, no props, luxury product photography, 85mm lens equivalent, photorealistic',
    negativePrompt: 'hands, face, person, watermark, text, logo, blur, cheap packaging, distorted bottle, plastic appearance, noisy mist',
    aspectRatio: '4:5',
    resolution: '1K',
    outputFormat: 'png',
    variants: [
      {
        key: 'plan-01',
        name: 'Flacon studio',
        promptAddon: 'Absolute anchor shot, the shape, juice color and bottle style must be perfectly established.',
        aspectRatio: '4:5',
        enabledByDefault: true,
        isMaster: true,
        sourceMode: 'source',
      },
      {
        key: 'plan-02',
        name: 'Lévitation velours',
        promptAddon: 'The same perfume bottle floating vertically mid-air against a deep black velvet background, narrow rim lights on both sides creating a thin luminous edge along the glass silhouette, fragrance liquid color glowing from within the bottle, perfectly clean surface reflection below, no hands, no support structure visible, no text, ultra sharp, luxury editorial product photography, photorealistic.',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-03',
        name: 'Mist freeze',
        promptAddon: 'The same perfume bottle with a fine mist of fragrance droplets frozen mid-air around and above it, individual micro-droplets catching a soft backlight and creating a luminous halo effect, dark background, bottle itself in sharp focus, the mist cloud slightly soft and ethereal, no hands, no nozzle visible, no text, luxury fragrance campaign photography, photorealistic.',
        aspectRatio: '4:5',
        enabledByDefault: true,
        sourceMode: 'master',
      },
      {
        key: 'plan-04',
        name: 'Botaniques',
        promptAddon: 'The same perfume bottle placed at the center of a composed arrangement of raw botanical ingredients on a dark stone surface, surrounding items include fresh rose petals, dried woody bark pieces, small glass vessel with amber resin, scattered spice seeds, soft warm directional light from above casting gentle shadows, bottle sharp, ingredients slightly softer, no hands, no text, luxury fragrance editorial photography, photorealistic.',
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

function normalizeOutputFormat(value, fallback = 'auto') {
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

async function ensureDefaultPresets(clientId, existingRows = []) {
  const existingIds = new Set((Array.isArray(existingRows) ? existingRows : []).map((row) => row.id));
  const missingRows = createDefaultPresetRows(clientId).filter((row) => !existingIds.has(row.id));

  if (missingRows.length === 0) {
    return false;
  }

  await supabaseRequest('flash_presets', {
    method: 'POST',
    prefer: 'return=minimal',
    body: missingRows,
  });

  return true;
}

export async function listPresets(clientId) {
  if (!clientId) {
    throw new Error('clientId manquant');
  }

  let rows = await supabaseRequest(
    `flash_presets?client_id=eq.${encodeFilter(clientId)}&select=id,name,description,theme,base_prompt,negative_prompt,aspect_ratio,resolution,output_format,variants,created_at,updated_at&order=created_at.asc`,
  );

  const insertedDefaults = await ensureDefaultPresets(clientId, rows);

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
