import { json, kieRequest } from './_shared.js';

export const handler = async (event) => {
  const taskId = event.queryStringParameters?.taskId;

  if (!taskId) {
    return json(400, { error: 'taskId manquant' });
  }

  try {
    const result = await kieRequest(`recordInfo?taskId=${encodeURIComponent(taskId)}`);

    if (result.code !== 200) {
      throw new Error(result.msg || 'Erreur API kie.ai');
    }

    const { state, resultJson, progress } = result.data;

    if (state === 'success') {
      const parsed = JSON.parse(resultJson);
      const images = parsed.resultUrls || [];

      return json(200, { status: 'done', images });
    }

    if (state === 'fail') {
      return json(200, { status: 'failed' });
    }

    return json(200, { status: 'generating', progress: progress || 0 });
  } catch (err) {
    return json(500, { error: err.message });
  }
};
