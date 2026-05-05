import { deleteHistory, getJsonBody, json, listHistory, saveHistoryEntry } from './_shared.js';

export const handler = async (event) => {
  const clientId = event.queryStringParameters?.clientId;
  const taskId = event.queryStringParameters?.taskId;

  try {
    if (event.httpMethod === 'GET') {
      const history = await listHistory(clientId);
      return json(200, history);
    }

    if (event.httpMethod === 'POST') {
      const body = getJsonBody(event);
      const saved = await saveHistoryEntry({
        clientId: clientId || body.clientId,
        entry: body.entry,
      });
      return json(200, saved || { ok: true });
    }

    if (event.httpMethod === 'DELETE') {
      await deleteHistory(taskId, clientId);
      return json(200, { ok: true });
    }

    return json(405, { error: 'Method Not Allowed' });
  } catch (err) {
    return json(500, { error: err.message });
  }
};
