import { deletePreset, getJsonBody, json, listPresets, upsertPreset } from './_shared.js';

function formatPresetError(error) {
  if (error.message?.includes('flash_presets') || error.message?.includes('negative_prompt')) {
    return 'Schema flash_presets incomplet dans Supabase. Re-execute le SQL mis a jour du dossier supabase.';
  }

  return error.message;
}

export const handler = async (event) => {
  const clientId = event.queryStringParameters?.clientId;
  const presetId = event.queryStringParameters?.presetId;

  try {
    if (event.httpMethod === 'GET') {
      const presets = await listPresets(clientId);
      return json(200, presets);
    }

    if (event.httpMethod === 'POST') {
      const body = getJsonBody(event);
      const preset = await upsertPreset(clientId || body.clientId, body.preset);
      return json(200, preset);
    }

    if (event.httpMethod === 'DELETE') {
      await deletePreset(clientId, presetId);
      return json(200, { ok: true });
    }

    return json(405, { error: 'Method Not Allowed' });
  } catch (error) {
    return json(500, { error: formatPresetError(error) });
  }
};
