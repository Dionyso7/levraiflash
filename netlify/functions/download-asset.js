import { json } from './_shared.js';

function sanitizeFileName(name = 'flash-result.png') {
  return String(name)
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    || 'flash-result.png';
}

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const url = event.queryStringParameters?.url;
  const requestedFileName = event.queryStringParameters?.fileName;

  if (!url) {
    return json({ error: 'Missing url parameter' }, 400);
  }

  try {
    const remote = await fetch(url);
    if (!remote.ok) {
      return json({ error: 'Impossible de recuperer le fichier distant' }, 502);
    }

    const arrayBuffer = await remote.arrayBuffer();
    const contentType = remote.headers.get('content-type') || 'application/octet-stream';
    const fileName = sanitizeFileName(requestedFileName);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
      body: Buffer.from(arrayBuffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch {
    return json({ error: 'Telechargement impossible' }, 500);
  }
}
