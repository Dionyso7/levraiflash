import JSZip from 'jszip';
import { getJsonBody, json } from './_shared.js';

const MAX_BUNDLE_FETCH_CONCURRENCY = 6;

function sanitizeSegment(value, fallback = 'asset') {
  const normalized = String(value || fallback)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || fallback;
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const input = Array.isArray(items) ? items : [];
  const limit = Math.max(1, Number.isFinite(concurrency) ? Math.floor(concurrency) : 1);
  const results = new Array(input.length);
  let nextIndex = 0;

  const worker = async () => {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      if (currentIndex >= input.length) return;
      results[currentIndex] = await mapper(input[currentIndex], currentIndex);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, input.length) }, worker));
  return results;
}

async function fetchRemoteFile(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Impossible de recuperer un asset distant (${response.status})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer;
}

function parseRequestBody(event) {
  const contentType = event.headers?.['content-type'] || event.headers?.['Content-Type'] || '';

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(event.body || '');
    const rawItems = params.get('items');
    return {
      items: rawItems ? JSON.parse(rawItems) : [],
      archiveName: params.get('archiveName') || 'flash-resultats.zip',
    };
  }

  return getJsonBody(event);
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  try {
    const body = parseRequestBody(event);
    const items = Array.isArray(body?.items) ? body.items : [];
    const archiveName = sanitizeSegment(body?.archiveName || 'flash-resultats.zip', 'flash-resultats.zip');

    if (items.length === 0) {
      return json(400, { error: 'Aucun asset a telecharger' });
    }

    const zip = new JSZip();

    for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
      const item = items[itemIndex];
      const folderName = sanitizeSegment(item?.folderName || `resultats-${itemIndex + 1}`, `resultats-${itemIndex + 1}`);
      const files = Array.isArray(item?.files) ? item.files : [];

      if (files.length === 0) {
        continue;
      }

      const fetchedFiles = await mapWithConcurrency(files, MAX_BUNDLE_FETCH_CONCURRENCY, async (file, fileIndex) => {
        const url = typeof file?.url === 'string' ? file.url : '';
        const fileName = sanitizeSegment(file?.fileName || `resultat-${fileIndex + 1}.png`, `resultat-${fileIndex + 1}.png`);

        if (!url) {
          throw new Error('URL d asset manquante');
        }

        const content = await fetchRemoteFile(url);
        return { fileName, content };
      });

      fetchedFiles.forEach(({ fileName, content }) => {
        zip.file(`${folderName}/${fileName}`, content);
      });
    }

    const archive = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${archiveName}"`,
        'Cache-Control': 'no-store',
      },
      body: archive.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    return json(500, { error: err.message });
  }
};
