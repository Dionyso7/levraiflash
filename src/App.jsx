import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Camera,
  X,
  Zap,
  Download,
  ChevronDown,
  ChevronLeft,
  RotateCcw,
  Image,
  Sparkles,
  ShoppingBag,
  Crown,
  Share,
  TreePine,
  Sun,
  Clock,
  Trash2,
  SlidersHorizontal,
  Plus,
  Copy,
  Save,
  Pencil,
  CheckSquare,
  Square,
  Layers3,
} from 'lucide-react';
import './App.css';
import { LOCAL_DEFAULT_PRESETS } from './defaultPresets';

const API = '/api';
const CLIENT_ID_KEY = 'flash_client_id';
const MAX_BATCH_ITEMS = 20;
const MAX_BATCH_CONCURRENCY = 20;
const BATCH_DB_NAME = 'flash_batch';
const BATCH_STORE_NAME = 'batch_state';
const BATCH_STATE_KEY = 'current';
const VISIBLE_DEFAULT_PRESET_NAMES = new Set(['Universel editorial', 'Luxe Pinterest', 'Editorial Overlay', 'Nouveau Produit']);

const THEME_META = {
  commerce: { icon: ShoppingBag, color: '#3B82F6', label: 'Commerce' },
  social: { icon: Share, color: '#EC4899', label: 'Social' },
  editorial: { icon: Sun, color: '#F59E0B', label: 'Editorial' },
  premium: { icon: Crown, color: '#8B5CF6', label: 'Premium' },
  outdoor: { icon: TreePine, color: '#10B981', label: 'Outdoor' },
  custom: { icon: Sparkles, color: '#6B7280', label: 'Custom' },
};

function getVisibleFallbackPresets() {
  return LOCAL_DEFAULT_PRESETS
    .filter((preset) => VISIBLE_DEFAULT_PRESET_NAMES.has(preset?.name))
    .map((preset) => normalizePreset(preset));
}

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function getClientId() {
  try {
    const existing = localStorage.getItem(CLIENT_ID_KEY);
    if (existing) return existing;

    const nextId = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, nextId);
    return nextId;
  } catch {
    return crypto.randomUUID();
  }
}

function createVariant(overrides = {}) {
  const isMaster = overrides.isMaster ?? false;
  return {
    id: overrides.id || crypto.randomUUID(),
    name: overrides.name || 'Nouvelle variante',
    promptAddon: overrides.promptAddon || '',
    promptOverride: overrides.promptOverride || '',
    negativePrompt: overrides.negativePrompt || '',
    aspectRatio: overrides.aspectRatio || '1:1',
    enabledByDefault: overrides.enabledByDefault ?? true,
    isMaster,
    sourceMode: isMaster ? 'source' : 'master',
  };
}

function createBatchFolder(overrides = {}) {
  return {
    id: overrides.id || crypto.randomUUID(),
    name: overrides.name || 'Nouvelle boutique',
    presetId: overrides.presetId ?? null,
    collapsed: overrides.collapsed ?? false,
  };
}

function createPreset(overrides = {}) {
  const variants = (overrides.variants || [createVariant({
    name: 'Vue principale',
    aspectRatio: overrides.aspectRatio || '1:1',
    isMaster: true,
    sourceMode: 'source',
  })]).map((variant) => createVariant(variant));

  return {
    id: overrides.id || crypto.randomUUID(),
    name: overrides.name || 'Nouveau preset',
    description: overrides.description || '',
    theme: overrides.theme || 'custom',
    basePrompt: overrides.basePrompt || 'Professional product photography, realistic, preserve the exact product details and brand fidelity.',
    negativePrompt: overrides.negativePrompt || '',
    aspectRatio: overrides.aspectRatio || '1:1',
    resolution: overrides.resolution || '1K',
    outputFormat: overrides.outputFormat || 'png',
    variants: ensureSingleMaster(variants),
  };
}

function createSourceImage(file, previewUrl) {
  return {
    id: crypto.randomUUID(),
    file,
    previewUrl,
    name: file?.name || 'reference.jpg',
  };
}

function normalizePreset(preset) {
  return createPreset({
    ...preset,
    variants: Array.isArray(preset?.variants) ? preset.variants : [],
  });
}

function normalizeAssets(images = []) {
  return images.flatMap((item, index) => {
    if (typeof item === 'string') {
      return [{ id: `asset-${index}`, url: item, label: `Image ${index + 1}`, variantId: null }];
    }

    if (item && typeof item === 'object' && typeof item.url === 'string') {
      return [{
        id: item.id || `asset-${index}`,
        url: item.url,
        label: item.label || `Image ${index + 1}`,
        variantId: item.variantId || null,
      }];
    }

    return [];
  });
}

function defaultSelectedVariantIds(preset) {
  if (!preset) return [];
  const masterId = preset.variants.find((variant) => variant.isMaster)?.id;
  const enabled = preset.variants.filter((variant) => variant.enabledByDefault).map((variant) => variant.id);
  const next = enabled.length ? enabled : preset.variants.map((variant) => variant.id);
  if (masterId && !next.includes(masterId)) {
    return [masterId, ...next];
  }
  return next;
}

function ensureSingleMaster(variants) {
  const hasMaster = variants.some((variant) => variant.isMaster);

  return variants.map((variant, index) => {
    const isMaster = hasMaster ? variant.isMaster : index === 0;
    return {
      ...variant,
      isMaster,
      sourceMode: isMaster ? 'source' : 'master',
    };
  });
}

function getMasterVariant(preset, selectedIds) {
  const selectedVariants = preset.variants.filter((variant) => selectedIds.includes(variant.id));
  if (selectedVariants.length === 0) return null;
  return selectedVariants.find((variant) => variant.isMaster) || selectedVariants[0];
}

function getEffectiveVariantConfig(preset, variant) {
  const promptBase = variant?.promptOverride || [preset?.basePrompt, variant?.promptAddon].filter(Boolean).join(', ');
  const negativePrompt = variant?.negativePrompt || preset?.negativePrompt || '';

  return {
    prompt: [promptBase, negativePrompt ? `Avoid: ${negativePrompt}` : null].filter(Boolean).join(', '),
    promptBase,
    negativePrompt,
    aspectRatio: variant?.aspectRatio || preset?.aspectRatio || '1:1',
    resolution: preset?.resolution || '1K',
    outputFormat: preset?.outputFormat || 'png',
    sourceMode: variant?.isMaster ? 'source' : 'master',
    usesPromptOverride: Boolean(variant?.promptOverride),
    usesVariantNegativePrompt: Boolean(variant?.negativePrompt),
  };
}

function themeMeta(theme) {
  return THEME_META[theme] || THEME_META.custom;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function sanitizeFileName(value, fallback = 'asset') {
  const normalized = String(value || fallback)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || fallback;
}

function getAssetExtension(url, fallback = 'png') {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split('.').pop()?.toLowerCase();
    if (ext && /^[a-z0-9]+$/.test(ext)) {
      return ext;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function batchStatusLabel(status) {
  switch (status) {
    case 'draft':
      return 'Pret';
    case 'uploading':
      return 'Upload refs';
    case 'generating-master':
      return 'Master';
    case 'generating-variants':
      return 'Variantes';
    case 'done':
      return 'Termine';
    case 'failed':
      return 'Erreur';
    default:
      return 'Pret';
  }
}

function createBatchItem(file, previewUrl, preset, preferredVariantIds = [], overrides = {}) {
  const validVariantIds = preset
    ? preferredVariantIds.filter((id) => preset.variants.some((variant) => variant.id === id))
    : [];

  return {
    id: crypto.randomUUID(),
    name: file?.name || `Produit-${Date.now()}`,
    folderId: overrides.folderId || null,
    sourceImages: [createSourceImage(file, previewUrl)],
    presetId: preset?.id || null,
    selectedVariantIds: validVariantIds.length ? validVariantIds : defaultSelectedVariantIds(preset),
    status: 'draft',
    progress: 0,
    currentVariantName: '',
    results: [],
    error: null,
  };
}

function isBatchItemConfigComplete(item) {
  return item.sourceImages.length > 0 && Boolean(item.presetId) && item.selectedVariantIds.length > 0;
}

function isBatchItemLocked(status) {
  return ['uploading', 'generating-master', 'generating-variants'].includes(status);
}

function isLikelyMobileDevice() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent || '';
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
}

function isAppleMobileDevice() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return true;
  }

  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

function serializeBatchState({ folders, items }) {
  return {
    folders: folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      presetId: folder.presetId ?? null,
      collapsed: Boolean(folder.collapsed),
    })),
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      folderId: item.folderId ?? null,
      presetId: item.presetId ?? null,
      selectedVariantIds: Array.isArray(item.selectedVariantIds) ? item.selectedVariantIds : [],
      status: item.status,
      progress: item.progress,
      currentVariantName: item.currentVariantName,
      results: Array.isArray(item.results) ? item.results : [],
      error: item.error,
      sourceImages: item.sourceImages.map((image) => ({
        id: image.id,
        name: image.name,
        file: image.file,
      })),
    })),
  };
}

function openBatchDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }

    const request = indexedDB.open(BATCH_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(BATCH_STORE_NAME)) {
        db.createObjectStore(BATCH_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Impossible d ouvrir le stockage batch'));
  });
}

async function readPersistedBatchState(clientId) {
  const db = await openBatchDb();
  if (!db) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(BATCH_STORE_NAME, 'readonly');
    const store = transaction.objectStore(BATCH_STORE_NAME);
    const request = store.get(`${clientId}:${BATCH_STATE_KEY}`);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error || new Error('Impossible de lire le batch'));
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

async function writePersistedBatchState(clientId, state) {
  const db = await openBatchDb();
  if (!db) {
    return;
  }

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(BATCH_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(BATCH_STORE_NAME);
    store.put(state, `${clientId}:${BATCH_STATE_KEY}`);

    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error('Impossible de sauvegarder le batch'));
    transaction.onabort = () => reject(transaction.error || new Error('Sauvegarde batch interrompue'));
  });

  db.close();
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function getFileNameFromDisposition(disposition, fallback) {
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] || fallback;
}

async function readJsonResponse(res) {
  const text = await res.text();
  const trimmed = text.trim();
  const devHint = typeof window !== 'undefined'
    ? ` Tu es probablement sur le port Vite (${window.location.host}). En dev, lance "npm run dev" et ouvre http://localhost:8891/ (ou l'URL Netlify Dev).`
    : ' En dev, lance "npm run dev" et ouvre http://localhost:8891/ (ou l\'URL Netlify Dev).';

  try {
    return trimmed ? JSON.parse(trimmed) : null;
  } catch {
    if (/^<!doctype/i.test(trimmed) || /^<html/i.test(trimmed)) {
      throw new Error(`API indisponible ou mauvaise URL.${devHint}`);
    }

    const snippet = trimmed.slice(0, 120).replace(/\s+/g, ' ');
    const nonJsonHint = /^SyntaxError[:\s]/i.test(trimmed) || /^Cannot\s/i.test(trimmed) || /^Error[:\s]/i.test(trimmed)
      ? devHint
      : '';
    throw new Error(`Reponse API non JSON: ${snippet || 'contenu vide'}.${nonJsonHint}`);
  }
}

async function saveBlob(blob, fileName) {
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], fileName, { type: blob.type || 'application/octet-stream' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: fileName });
        return;
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        return;
      }
    }
  }

  downloadBlob(blob, fileName);
}

function submitBundleDownloadForm({ items, archiveName }) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `${API}/download-bundle`;
  form.style.display = 'none';

  const itemsInput = document.createElement('input');
  itemsInput.type = 'hidden';
  itemsInput.name = 'items';
  itemsInput.value = JSON.stringify(items);

  const archiveInput = document.createElement('input');
  archiveInput.type = 'hidden';
  archiveInput.name = 'archiveName';
  archiveInput.value = archiveName;

  form.appendChild(itemsInput);
  form.appendChild(archiveInput);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

async function shareFiles(files, title = 'FLASH') {
  if (
    typeof navigator === 'undefined'
    || typeof navigator.share !== 'function'
    || typeof navigator.canShare !== 'function'
    || !navigator.canShare({ files })
  ) {
    return false;
  }

  try {
    await navigator.share({ files, title });
    return true;
  } catch (err) {
    if (err?.name === 'AbortError') {
      return true;
    }

    return false;
  }
}

export default function App() {
  const [step, setStep] = useState('capture');
  const [sourceImages, setSourceImages] = useState([]);
  const [batchFolders, setBatchFolders] = useState([]);
  const [batchItems, setBatchItems] = useState([]);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchDownloading, setBatchDownloading] = useState(false);
  const [selectedBatchFolderId, setSelectedBatchFolderId] = useState(null);
  const [editingBatchFolderId, setEditingBatchFolderId] = useState(null);
  const [editingBatchFolderName, setEditingBatchFolderName] = useState('');
  const [batchStateReady, setBatchStateReady] = useState(false);
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [editingPreset, setEditingPreset] = useState(null);
  const [selectedVariantIds, setSelectedVariantIds] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [resultsMeta, setResultsMeta] = useState({
    archiveName: 'flash-resultats.zip',
    folderName: 'resultats',
    outputFormat: 'png',
  });
  const [resultsDownloading, setResultsDownloading] = useState(false);
  const [mobileSaverOpen, setMobileSaverOpen] = useState(false);
  const [mobileSaverTitle, setMobileSaverTitle] = useState('FLASH');
  const [mobileSaverItems, setMobileSaverItems] = useState([]);
  const [mobileSaverActiveFileId, setMobileSaverActiveFileId] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingPresets, setLoadingPresets] = useState(true);
  const [savingPreset, setSavingPreset] = useState(false);
  const [currentVariantName, setCurrentVariantName] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);
  const batchFileRef = useRef(null);
  const batchSourceFileRef = useRef(null);
  const batchFileTargetFolderRef = useRef(null);
  const clientIdRef = useRef(getClientId());
  const activeGenerationRef = useRef(0);
  const activeBatchRunRef = useRef(0);
  const activeBatchJobsRef = useRef(new Set());
  const ignoredBatchItemsRef = useRef(new Set());
  const batchHistoryLoadedRunRef = useRef(null);
  const sourcePreviewUrlsRef = useRef(new Set());
  const batchSourceTargetItemRef = useRef(null);

  const selectedPreset = useMemo(
    () => presets.find((preset) => preset.id === selectedPresetId) || null,
    [presets, selectedPresetId],
  );
  const presetNameMap = useMemo(
    () => Object.fromEntries(presets.map((preset) => [preset.id, preset.name])),
    [presets],
  );
  const batchSummary = useMemo(() => {
    const summary = {
      folders: batchFolders.length,
      total: batchItems.length,
      running: 0,
      done: 0,
      failed: 0,
      assets: 0,
    };

    batchItems.forEach((item) => {
      summary.assets += item.results.length;
      if (item.status === 'done') summary.done += 1;
      else if (item.status === 'failed') summary.failed += 1;
      else summary.running += 1;
    });

    return summary;
  }, [batchFolders.length, batchItems]);
  const prefersDirectMobileSave = useMemo(
    () => {
      if (typeof navigator === 'undefined') {
        return false;
      }

      const supportsShare = typeof navigator.share === 'function';
      const touchHeuristic = typeof window !== 'undefined'
        && 'ontouchstart' in window
        && typeof window.innerWidth === 'number'
        && window.innerWidth < 980;

      return isAppleMobileDevice() || isLikelyMobileDevice() || supportsShare || touchHeuristic;
    },
    [],
  );
  const canDownloadResults = useMemo(
    () => results.length > 0 && !resultsDownloading,
    [results, resultsDownloading],
  );
  const batchFoldersWithItems = useMemo(() => batchFolders.map((folder) => {
    const items = batchItems.filter((item) => item.folderId === folder.id);
    const preset = presets.find((entry) => entry.id === folder.presetId)
      || presets.find((entry) => entry.id === items[0]?.presetId)
      || null;
    const stats = {
      total: items.length,
      launchable: 0,
      running: 0,
      done: 0,
      failed: 0,
      assets: 0,
    };

    items.forEach((item) => {
      stats.assets += item.results.length;
      if (item.status === 'done') stats.done += 1;
      else if (item.status === 'failed') stats.failed += 1;
      else if (['uploading', 'generating-master', 'generating-variants'].includes(item.status)) stats.running += 1;

      if (isBatchItemConfigComplete(item) && ['draft', 'pending', 'failed'].includes(item.status)) {
        stats.launchable += 1;
      }
    });

    return {
      ...folder,
      preset,
      items,
      stats,
      canDownload: !batchRunning && !batchDownloading && items.some((item) => item.results.length > 0),
    };
  }), [batchDownloading, batchFolders, batchItems, batchRunning, presets]);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/history?clientId=${encodeURIComponent(clientIdRef.current)}`);
      const data = await readJsonResponse(res);

      if (!res.ok) {
        throw new Error(data?.error || "Impossible de charger l'historique");
      }

      setHistory(Array.isArray(data) ? data : []);
    } catch {
      setHistory([]);
    }
  }, []);

  const resetGenerationContext = useCallback(() => {
    activeGenerationRef.current += 1;
    setResults([]);
    setResultsMeta({
      archiveName: 'flash-resultats.zip',
      folderName: 'resultats',
      outputFormat: 'png',
    });
    setError(null);
    setProgress(0);
    setGenerating(false);
    setCurrentVariantName('');
    setShowHistory(false);
  }, []);

  const rememberPreviewUrl = useCallback((previewUrl) => {
    if (previewUrl) {
      sourcePreviewUrlsRef.current.add(previewUrl);
    }
  }, []);

  const releasePreviewUrl = useCallback((previewUrl) => {
    if (previewUrl && sourcePreviewUrlsRef.current.has(previewUrl)) {
      URL.revokeObjectURL(previewUrl);
      sourcePreviewUrlsRef.current.delete(previewUrl);
    }
  }, []);

  const clearSourceImages = useCallback(() => {
    sourceImages.forEach((image) => releasePreviewUrl(image.previewUrl));
    setSourceImages([]);
  }, [releasePreviewUrl, sourceImages]);

  const clearBatchItems = useCallback(() => {
    setBatchItems((current) => {
      current.forEach((item) => item.sourceImages.forEach((image) => releasePreviewUrl(image.previewUrl)));
      return [];
    });
  }, [releasePreviewUrl]);

  const addSourceImages = useCallback((items) => {
    const nextItems = Array.isArray(items) ? items.filter((item) => item?.file && item?.previewUrl) : [];
    if (nextItems.length === 0) return;
    resetGenerationContext();
    nextItems.forEach((item) => rememberPreviewUrl(item.previewUrl));
    setSourceImages((current) => [...current, ...nextItems]);
    setStep('preset');
  }, [rememberPreviewUrl, resetGenerationContext]);

  const removeSourceImage = useCallback((imageId) => {
    const image = sourceImages.find((item) => item.id === imageId);
    if (!image) return;
    resetGenerationContext();
    releasePreviewUrl(image.previewUrl);
    setSourceImages((current) => current.filter((item) => item.id !== imageId));
  }, [releasePreviewUrl, resetGenerationContext, sourceImages]);

  const loadPresets = useCallback(async () => {
    setLoadingPresets(true);
    try {
      const res = await fetch(`${API}/presets?clientId=${encodeURIComponent(clientIdRef.current)}`);
      const data = await readJsonResponse(res);

      if (!res.ok) {
        throw new Error(data?.error || 'Impossible de charger les presets');
      }

      const allPresets = Array.isArray(data) ? data.map(normalizePreset) : [];
      const curatedPresets = allPresets.filter((preset) => VISIBLE_DEFAULT_PRESET_NAMES.has(preset?.name));
      const nextPresets = curatedPresets.length > 0
        ? curatedPresets
        : (allPresets.length > 0 ? allPresets : getVisibleFallbackPresets());
      setPresets(nextPresets);
      setSelectedPresetId((currentId) => {
        if (currentId && nextPresets.some((preset) => preset.id === currentId)) {
          return currentId;
        }

        return nextPresets[0]?.id || null;
      });
    } catch (err) {
      const fallbackPresets = getVisibleFallbackPresets();
      if (fallbackPresets.length > 0) {
        setError(null);
        setPresets(fallbackPresets);
        setSelectedPresetId((currentId) => {
          if (currentId && fallbackPresets.some((preset) => preset.id === currentId)) {
            return currentId;
          }

          return fallbackPresets[0]?.id || null;
        });
      } else {
        setError(err.message);
        setPresets([]);
      }
    } finally {
      setLoadingPresets(false);
    }
  }, []);

  useEffect(() => {
    loadPresets();
    loadHistory();
  }, [loadHistory, loadPresets]);

  useEffect(() => {
    let cancelled = false;

    const hydrateBatchState = async () => {
      try {
        const stored = await readPersistedBatchState(clientIdRef.current);
        if (cancelled || !stored) {
          return;
        }

        const storedFolders = Array.isArray(stored.folders)
          ? stored.folders.map((folder) => createBatchFolder(folder))
          : [];
        const fallbackFolderId = storedFolders[0]?.id || crypto.randomUUID();
        const nextFolders = storedFolders.length > 0
          ? storedFolders
          : (Array.isArray(stored.items) && stored.items.length > 0
            ? [createBatchFolder({ id: fallbackFolderId, name: 'Boutique 1' })]
            : []);
        const nextItems = Array.isArray(stored.items)
          ? stored.items.map((item, itemIndex) => {
            const hydratedSources = Array.isArray(item.sourceImages)
              ? item.sourceImages.flatMap((image, imageIndex) => {
                if (!image?.file) {
                  return [];
                }

                const file = image.file instanceof File
                  ? image.file
                  : new File([image.file], image.name || `reference-${imageIndex + 1}.jpg`, {
                    type: image.file?.type || 'image/jpeg',
                  });
                const previewUrl = URL.createObjectURL(file);
                rememberPreviewUrl(previewUrl);

                return [{
                  id: image.id || crypto.randomUUID(),
                  file,
                  previewUrl,
                  name: image.name || file.name,
                }];
              })
              : [];
            const safeStatus = ['draft', 'done', 'failed'].includes(item?.status) ? item.status : 'draft';

            return {
              id: item?.id || crypto.randomUUID(),
              name: item?.name || hydratedSources[0]?.name || `Produit-${itemIndex + 1}`,
              folderId: item?.folderId || fallbackFolderId,
              sourceImages: hydratedSources,
              presetId: item?.presetId || null,
              selectedVariantIds: Array.isArray(item?.selectedVariantIds) ? item.selectedVariantIds : [],
              status: safeStatus,
              progress: safeStatus === 'done' ? 100 : 0,
              currentVariantName: safeStatus === 'done' ? (item?.currentVariantName || 'Generation terminee') : '',
              results: safeStatus === 'done' ? normalizeAssets(item?.results) : [],
              error: safeStatus === 'failed' ? (item?.error || null) : null,
            };
          })
          : [];

        if (!cancelled) {
          setBatchFolders(nextFolders);
          setBatchItems(nextItems);
        }
      } catch {
        // Le batch local est optionnel ; on ignore les erreurs de restauration.
      } finally {
        if (!cancelled) {
          setBatchStateReady(true);
        }
      }
    };

    void hydrateBatchState();

    return () => {
      cancelled = true;
    };
  }, [rememberPreviewUrl]);

  useEffect(() => {
    if (editingPreset || !selectedPreset) {
      return;
    }

    setSelectedVariantIds((current) => {
      const validIds = new Set(selectedPreset.variants.map((variant) => variant.id));
      const kept = current.filter((id) => validIds.has(id));
      return kept.length ? kept : defaultSelectedVariantIds(selectedPreset);
    });
  }, [selectedPreset, editingPreset]);

  useEffect(() => {
    if (!batchStateReady || presets.length === 0) return;

    const normalizedFolders = batchFolders.map((folder) => ({
      ...folder,
      presetId: presets.some((preset) => preset.id === folder.presetId) ? folder.presetId : (presets[0]?.id || null),
    }));

    if (normalizedFolders.some((folder, index) => folder.presetId !== batchFolders[index]?.presetId)) {
      setBatchFolders(normalizedFolders);
    }

    setBatchItems((current) => current.map((item) => {
      const folder = normalizedFolders.find((entry) => entry.id === item.folderId) || null;
      const preset = presets.find((entry) => entry.id === item.presetId)
        || presets.find((entry) => entry.id === folder?.presetId)
        || presets[0];
      const selectedIds = item.selectedVariantIds.filter((id) => preset.variants.some((variant) => variant.id === id));
      return {
        ...item,
        presetId: preset?.id || null,
        selectedVariantIds: selectedIds.length ? selectedIds : defaultSelectedVariantIds(preset),
      };
    }));
  }, [batchFolders, batchStateReady, presets]);

  useEffect(() => {
    if (batchFolders.length === 0) {
      setSelectedBatchFolderId(null);
      setEditingBatchFolderId(null);
      setEditingBatchFolderName('');
      return;
    }

    setSelectedBatchFolderId((current) => (
      batchFolders.some((folder) => folder.id === current) ? current : batchFolders[0].id
    ));
  }, [batchFolders]);

  useEffect(() => {
    if (!batchStateReady) return undefined;

    const timeoutId = window.setTimeout(() => {
      void writePersistedBatchState(
        clientIdRef.current,
        serializeBatchState({ folders: batchFolders, items: batchItems }),
      ).catch(() => {});
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [batchFolders, batchItems, batchStateReady]);

  useEffect(() => () => {
    sourcePreviewUrlsRef.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    sourcePreviewUrlsRef.current.clear();
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      setError("Impossible d'acceder a la camera");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'product.jpg', { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(blob);
      addSourceImages([createSourceImage(file, previewUrl)]);
      stopCamera();
    }, 'image/jpeg', 0.92);
  }, [addSourceImages, stopCamera]);

  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    addSourceImages(files.map((file) => createSourceImage(file, URL.createObjectURL(file))));
    e.target.value = '';
  }, [addSourceImages]);

  const createEmptyBatchFolder = useCallback(() => {
    const nextFolder = createBatchFolder({
      name: `Boutique ${batchFolders.length + 1}`,
      presetId: selectedPreset?.id || presets[0]?.id || null,
    });

    setBatchFolders((current) => [...current, nextFolder]);
    setSelectedBatchFolderId(nextFolder.id);
    setEditingBatchFolderId(nextFolder.id);
    setEditingBatchFolderName(nextFolder.name);
    setStep('batch');
    setShowHistory(false);
    setError(null);
  }, [batchFolders.length, presets, selectedPreset]);

  const openBatchFilePicker = useCallback((folderId = null) => {
    let targetFolderId = folderId;

    if (!targetFolderId) {
      const nextFolder = createBatchFolder({
        name: `Boutique ${batchFolders.length + 1}`,
        presetId: selectedPreset?.id || presets[0]?.id || null,
      });
      targetFolderId = nextFolder.id;
      setBatchFolders((current) => [...current, nextFolder]);
      setSelectedBatchFolderId(nextFolder.id);
    }

    batchFileTargetFolderRef.current = targetFolderId;
    setStep('batch');
    setShowHistory(false);
    batchFileRef.current?.click();
  }, [batchFolders.length, presets, selectedPreset]);

  const addBatchFiles = useCallback((files, folderId) => {
    const nextFiles = Array.from(files || []);
    if (nextFiles.length === 0) return;

    const availableSlots = MAX_BATCH_ITEMS - batchItems.length;
    if (availableSlots <= 0) {
      setError(`Le mode batch est limite a ${MAX_BATCH_ITEMS} produits.`);
      return;
    }

    const targetFolder = batchFolders.find((folder) => folder.id === folderId) || null;
    if (!targetFolder) {
      setError('Choisis d abord une boutique pour ajouter des produits.');
      return;
    }

    const presetForNewItems = presets.find((entry) => entry.id === targetFolder.presetId)
      || selectedPreset
      || presets[0]
      || null;
    const acceptedFiles = nextFiles.slice(0, availableSlots);
    const nextItems = acceptedFiles.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      rememberPreviewUrl(previewUrl);
      return createBatchItem(file, previewUrl, presetForNewItems, selectedVariantIds, { folderId: targetFolder.id });
    });

    setBatchItems((current) => [...current, ...nextItems]);
    setSelectedBatchFolderId(targetFolder.id);
    setStep('batch');
    setShowHistory(false);

    if (nextFiles.length > acceptedFiles.length) {
      setError(`Seulement ${MAX_BATCH_ITEMS} produits peuvent etre prepares dans le batch.`);
    }
  }, [batchFolders, batchItems.length, presets, rememberPreviewUrl, selectedPreset, selectedVariantIds]);

  const handleBatchFileUpload = useCallback((e) => {
    const targetFolderId = batchFileTargetFolderRef.current || selectedBatchFolderId;
    batchFileTargetFolderRef.current = null;
    addBatchFiles(e.target.files || [], targetFolderId);
    e.target.value = '';
  }, [addBatchFiles, selectedBatchFolderId]);

  const openBatchSourcePicker = useCallback((itemId) => {
    batchSourceTargetItemRef.current = itemId;
    batchSourceFileRef.current?.click();
  }, []);

  const handleBatchSourceUpload = useCallback((e) => {
    const targetItemId = batchSourceTargetItemRef.current;
    const files = Array.from(e.target.files || []);
    batchSourceTargetItemRef.current = null;
    e.target.value = '';

    if (!targetItemId || files.length === 0) {
      return;
    }

    const nextImages = files.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      rememberPreviewUrl(previewUrl);
      return createSourceImage(file, previewUrl);
    });

    setBatchItems((current) => current.map((item) => {
      if (item.id !== targetItemId || isBatchItemLocked(item.status)) {
        return item;
      }

      return {
        ...item,
        sourceImages: [...item.sourceImages, ...nextImages],
        status: 'draft',
        progress: 0,
        currentVariantName: '',
        results: [],
        error: null,
      };
    }));
  }, [rememberPreviewUrl]);

  const removeBatchSourceImage = useCallback((itemId, imageId) => {
    setBatchItems((current) => current.map((item) => {
      if (item.id !== itemId || isBatchItemLocked(item.status)) {
        return item;
      }

      const nextSourceImages = item.sourceImages.filter((image) => image.id !== imageId);
      const removedImage = item.sourceImages.find((image) => image.id === imageId);
      if (removedImage) {
        releasePreviewUrl(removedImage.previewUrl);
      }

      return {
        ...item,
        name: item.name === removedImage?.name && nextSourceImages[0]?.name ? nextSourceImages[0].name : item.name,
        sourceImages: nextSourceImages,
        status: 'draft',
        progress: 0,
        currentVariantName: '',
        results: [],
        error: null,
      };
    }));
  }, [releasePreviewUrl]);

  const persistHistoryEntry = useCallback(async (entry) => {
    const res = await fetch(`${API}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: clientIdRef.current,
        entry,
      }),
    });
    const data = await readJsonResponse(res);

    if (!res.ok) {
      throw new Error(data?.error || "Impossible d'enregistrer l'historique");
    }

    return data;
  }, []);

  const pollTask = useCallback((taskId, { onProgress, shouldAbort } = {}) => new Promise((resolve, reject) => {
    let attempts = 0;

    const poll = async () => {
      if (shouldAbort?.()) {
        reject(new Error('Generation ignoree car la session a change'));
        return;
      }

      if (attempts >= 120) {
        reject(new Error('Timeout - generation trop longue'));
        return;
      }

      try {
        const res = await fetch(`${API}/status?taskId=${encodeURIComponent(taskId)}`);
        const data = await readJsonResponse(res);

        if (!res.ok) {
          throw new Error(data?.error || 'Erreur de generation');
        }

        if (data.status === 'done') {
          onProgress?.(1);
          resolve(Array.isArray(data.images) ? data.images : []);
          return;
        }

        if (data.status === 'failed') {
          reject(new Error('Echec de la generation. Reessaye.'));
          return;
        }

        attempts += 1;
        const ratioWithinTask = Math.min(0.92, Math.max((data.progress || 0) / 100, attempts / 120));
        onProgress?.(ratioWithinTask);
        setTimeout(poll, 3000);
      } catch (err) {
        attempts += 1;
        if (attempts >= 120) {
          reject(err);
          return;
        }
        setTimeout(poll, 5000);
      }
    };

    poll();
  }), []);

  const requestBundleDownload = useCallback(async ({ items, archiveName }) => {
    try {
      const res = await fetch(`${API}/download-bundle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, archiveName }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Impossible de preparer le telechargement');
      }

      const blob = await res.blob();
      const fileName = getFileNameFromDisposition(res.headers.get('Content-Disposition'), archiveName);
      await saveBlob(blob, fileName);
    } catch (err) {
      if (err instanceof TypeError) {
        submitBundleDownloadForm({ items, archiveName });
        return;
      }

      throw err;
    }
  }, []);

  const fetchAssetFile = useCallback(async ({ url, fileName }) => {
    const params = new URLSearchParams({
      url,
      fileName,
    });
    const res = await fetch(`${API}/download-asset?${params.toString()}`);

    if (!res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error(`API indisponible. En dev, lance "npm run dev" et ouvre http://localhost:8891/ (ou l'URL Netlify Dev).`);
      }
      const data = await res.json().catch(() => null);
      throw new Error(data?.error || `Impossible de recuperer ${fileName}`);
    }

    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type || 'application/octet-stream' });
  }, []);

  const buildBundleItems = useCallback((collections) => collections
    .filter((collection) => Array.isArray(collection?.assets) && collection.assets.length > 0)
    .map((collection, collectionIndex) => ({
      folderName: sanitizeFileName(collection.folderName, `resultats-${collectionIndex + 1}`),
      files: collection.assets.map((asset, assetIndex) => ({
        url: asset.url,
        fileName: `${String(assetIndex + 1).padStart(2, '0')}-${sanitizeFileName(asset.label || `resultat-${assetIndex + 1}`)}.${collection.outputFormat || getAssetExtension(asset.url, 'png')}`,
      })),
    })), []);

  const closeMobileSaver = useCallback(() => {
    setMobileSaverOpen(false);
    setMobileSaverActiveFileId(null);
  }, []);

  const openMobileSaver = useCallback(({ items, title, archiveName }) => {
    setMobileSaverTitle(title || 'FLASH');
    setMobileSaverItems(items);
    setMobileSaverOpen(true);
  }, []);

  const saveCollections = useCallback(async ({ collections, archiveName, title }) => {
    const items = buildBundleItems(collections);
    if (items.length === 0) {
      throw new Error('Aucun asset a enregistrer');
    }

    if (prefersDirectMobileSave) {
      const totalFiles = items.reduce((sum, item) => sum + item.files.length, 0);
      if (totalFiles > 1) {
        openMobileSaver({ items, title, archiveName });
        return;
      }

      const single = items.flatMap((item) => item.files.map((file) => ({
        folderName: item.folderName,
        file,
      })))[0];

      if (!single) {
        throw new Error('Aucun asset a enregistrer');
      }

      const resolvedName = items.length > 1 ? `${single.folderName}-${single.file.fileName}` : single.file.fileName;
      const downloaded = await fetchAssetFile({ url: single.file.url, fileName: resolvedName });
      await saveBlob(downloaded, downloaded.name);
      return;
    }

    await requestBundleDownload({ items, archiveName });
  }, [buildBundleItems, fetchAssetFile, openMobileSaver, prefersDirectMobileSave, requestBundleDownload]);

  const downloadMobileSaverFile = useCallback(async (file) => {
    if (!file?.url || !file?.fileName) return;

    try {
      setMobileSaverActiveFileId(file.id);
      setError(null);
      const downloaded = await fetchAssetFile({ url: file.url, fileName: file.fileName });
      await saveBlob(downloaded, downloaded.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setMobileSaverActiveFileId(null);
    }
  }, [fetchAssetFile]);

  const shareMobileSaverAll = useCallback(async () => {
    if (!mobileSaverItems.length) return;

    try {
      setMobileSaverActiveFileId('__all__');
      setError(null);

      const files = await Promise.all(mobileSaverItems.flatMap((item) => item.files.map((file) => fetchAssetFile({
        url: file.url,
        fileName: mobileSaverItems.length > 1 ? `${item.folderName}-${file.fileName}` : file.fileName,
      }))));

      const shared = await shareFiles(files, mobileSaverTitle || 'FLASH');
      if (shared) {
        closeMobileSaver();
        return;
      }

      for (const file of files) {
        await saveBlob(file, file.name);
      }

      closeMobileSaver();
    } catch (err) {
      setError(err.message);
    } finally {
      setMobileSaverActiveFileId(null);
    }
  }, [fetchAssetFile, mobileSaverItems, mobileSaverTitle, closeMobileSaver]);

  const downloadSingleResult = useCallback(async (asset, fileName) => {
    try {
      setError(null);
      const file = await fetchAssetFile({
        url: asset.url,
        fileName,
      });
      await saveBlob(file, file.name);
    } catch (err) {
      setError(err.message);
    }
  }, [fetchAssetFile]);

  const runGenerationJob = useCallback(async ({
    sourceImages: jobSourceImages,
    preset,
    selectedVariantIds: jobSelectedVariantIds,
    shouldAbort,
    onStageChange,
    onProgress,
  }) => {
    if (jobSourceImages.length === 0 || !preset || jobSelectedVariantIds.length === 0) {
      throw new Error('Configuration de generation incomplete');
    }

    const variants = preset.variants.filter((variant) => jobSelectedVariantIds.includes(variant.id));
    const masterVariant = getMasterVariant(preset, jobSelectedVariantIds);

    if (variants.length === 0 || !masterVariant) {
      throw new Error('Choisis au moins une variante a generer');
    }

    const sessionId = crypto.randomUUID();
    const sourceUploads = await Promise.all(jobSourceImages.map(async (image, index) => {
      const imageBase64 = await toBase64(image.file);
      const sourceExtension = (image.file.name?.split('.').pop() || 'jpg').replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg';
      const uploadRes = await fetch(`${API}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationSessionId: sessionId,
          uploadOnly: true,
          imageBase64,
          uploadFileName: `flash-source-${sessionId}-${index + 1}.${sourceExtension}`,
        }),
      });
      const uploadData = await readJsonResponse(uploadRes);

      if (!uploadRes.ok || uploadData?.error || !uploadData?.sourceImageUrl) {
        throw new Error(uploadData?.error || `Erreur d'upload sur la reference ${index + 1}`);
      }

      return uploadData.sourceImageUrl;
    }));

    if (shouldAbort?.()) {
      throw new Error('Generation ignoree car la session a change');
    }

    const nextAssets = [];
    const secondaryVariants = variants.filter((variant) => variant.id !== masterVariant.id);

    onStageChange?.({ status: 'generating-master', currentVariantName: `Master - ${masterVariant.name}` });

    const masterRes = await fetch(`${API}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        generationSessionId: sessionId,
        preset,
        variant: { ...masterVariant, sourceMode: 'source' },
        inputImageUrls: sourceUploads,
      }),
    });

    const masterData = await readJsonResponse(masterRes);
    if (!masterRes.ok || masterData?.error) {
      throw new Error(masterData?.error || 'Erreur de generation du master');
    }

    const masterUrls = await pollTask(masterData.taskId, {
      shouldAbort,
      onProgress: (ratio) => {
        onProgress?.(Math.max(5, Math.round(5 + ratio * (secondaryVariants.length ? 30 : 95))));
      },
    });

    masterUrls.forEach((url, imageIndex) => {
      nextAssets.push({
        id: `${masterVariant.id}-${imageIndex}`,
        url,
        label: masterUrls.length > 1 ? `${masterVariant.name} ${imageIndex + 1}` : masterVariant.name,
        variantId: masterVariant.id,
      });
    });

    const masterImageUrl = masterUrls[0];

    if (!masterImageUrl) {
      throw new Error("Le master asset n'a renvoye aucune image");
    }

    if (secondaryVariants.length > 0) {
      onStageChange?.({ status: 'generating-variants', currentVariantName: 'Variantes en parallele' });
      const progressMap = Object.fromEntries(secondaryVariants.map((variant) => [variant.id, 0]));
      const updateParallelProgress = () => {
        const average = Object.values(progressMap).reduce((sum, value) => sum + value, 0) / secondaryVariants.length;
        onProgress?.(Math.max(35, Math.round(35 + average * 65)));
      };

      const secondaryResults = await Promise.allSettled(
        secondaryVariants.map(async (variant) => {
          const res = await fetch(`${API}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              generationSessionId: sessionId,
              preset,
              variant: { ...variant, sourceMode: 'master' },
              referenceImageUrls: [masterImageUrl],
            }),
          });
          const data = await readJsonResponse(res);

          if (!res.ok || data?.error) {
            throw new Error(data?.error || `Erreur sur ${variant.name}`);
          }

          const urls = await pollTask(data.taskId, {
            shouldAbort,
            onProgress: (ratio) => {
              progressMap[variant.id] = ratio;
              updateParallelProgress();
            },
          });

          return { variant, urls };
        }),
      );

      const failed = [];
      secondaryResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          result.value.urls.forEach((url, imageIndex) => {
            nextAssets.push({
              id: `${result.value.variant.id}-${imageIndex}`,
              url,
              label: result.value.urls.length > 1 ? `${result.value.variant.name} ${imageIndex + 1}` : result.value.variant.name,
              variantId: result.value.variant.id,
            });
          });
          return;
        }

        failed.push(result.reason?.message || 'variante inconnue');
      });

      if (failed.length === secondaryVariants.length) {
        throw new Error(failed[0] || 'Toutes les variantes secondaires ont echoue');
      }

      if (failed.length > 0) {
        onStageChange?.({
          status: 'generating-variants',
          currentVariantName: `Variantes partielles - ${failed.length} echec(s)`,
        });
      }
    }

    const entry = {
      taskId: sessionId,
      presetId: preset.id,
      presetName: preset.name,
      images: nextAssets,
    };

    await persistHistoryEntry(entry);

    return {
      sessionId,
      assets: nextAssets,
    };
  }, [persistHistoryEntry, pollTask]);

  const generate = useCallback(async () => {
    if (sourceImages.length === 0 || !selectedPreset || selectedVariantIds.length === 0) return;

    const runId = activeGenerationRef.current + 1;
    activeGenerationRef.current = runId;
    setGenerating(true);
    setError(null);
    setResults([]);
    setProgress(5);
    setCurrentVariantName('');

    try {
      const { assets } = await runGenerationJob({
        sourceImages,
        preset: selectedPreset,
        selectedVariantIds,
        shouldAbort: () => activeGenerationRef.current !== runId,
        onStageChange: ({ currentVariantName: nextVariantName }) => {
          setCurrentVariantName(nextVariantName || '');
        },
        onProgress: setProgress,
      });

      if (activeGenerationRef.current !== runId) {
        return;
      }

      setResults(assets);
      setResultsMeta({
        archiveName: `flash-${sanitizeFileName(selectedPreset.name, 'preset')}-${new Date().toISOString().slice(0, 10)}.zip`,
        folderName: sanitizeFileName(selectedPreset.name, 'resultats'),
        outputFormat: selectedPreset.outputFormat || 'png',
      });
      setStep('results');
      setProgress(100);
      await loadHistory();
    } catch (err) {
      if (activeGenerationRef.current === runId) {
        setError(err.message);
      }
    } finally {
      if (activeGenerationRef.current === runId) {
        setGenerating(false);
        setCurrentVariantName('');
      }
    }
  }, [loadHistory, runGenerationJob, selectedPreset, selectedVariantIds, sourceImages]);

  const updateBatchItemState = useCallback((itemId, patch) => {
    setBatchItems((current) => current.map((item) => (item.id === itemId ? { ...item, ...patch } : item)));
  }, []);

  const toggleBatchFolderCollapsed = useCallback((folderId) => {
    setBatchFolders((current) => current.map((folder) => (
      folder.id === folderId ? { ...folder, collapsed: !folder.collapsed } : folder
    )));
  }, []);

  const startBatchFolderRename = useCallback((folder) => {
    setEditingBatchFolderId(folder.id);
    setEditingBatchFolderName(folder.name);
  }, []);

  const cancelBatchFolderRename = useCallback(() => {
    setEditingBatchFolderId(null);
    setEditingBatchFolderName('');
  }, []);

  const commitBatchFolderRename = useCallback((folderId) => {
    const nextName = editingBatchFolderName.trim();
    if (!nextName) {
      cancelBatchFolderRename();
      return;
    }

    setBatchFolders((current) => current.map((folder) => (
      folder.id === folderId
        ? { ...folder, name: nextName }
        : folder
    )));
    cancelBatchFolderRename();
  }, [cancelBatchFolderRename, editingBatchFolderName]);

  const updateBatchFolderPreset = useCallback((folderId, presetId) => {
    setBatchFolders((current) => current.map((folder) => (
      folder.id === folderId
        ? { ...folder, presetId }
        : folder
    )));
  }, []);

  const removeBatchFolder = useCallback((folderId) => {
    const removedItemIds = new Set();

    setBatchItems((current) => current.filter((item) => {
      if (item.folderId !== folderId) {
        return true;
      }

      removedItemIds.add(item.id);
      item.sourceImages.forEach((image) => releasePreviewUrl(image.previewUrl));
      return false;
    }));

    removedItemIds.forEach((itemId) => {
      ignoredBatchItemsRef.current.add(itemId);
      activeBatchJobsRef.current.delete(itemId);
    });

    setBatchFolders((current) => current.filter((folder) => folder.id !== folderId));
    setSelectedBatchFolderId((current) => (current === folderId ? null : current));
    setError(null);
  }, [releasePreviewUrl]);

  const removeBatchItem = useCallback((itemId) => {
    ignoredBatchItemsRef.current.add(itemId);
    activeBatchJobsRef.current.delete(itemId);
    setBatchItems((current) => current.filter((item) => {
      if (item.id !== itemId) return true;
      item.sourceImages.forEach((image) => releasePreviewUrl(image.previewUrl));
      return false;
    }));
  }, [releasePreviewUrl]);

  const updateBatchItemPreset = useCallback((itemId, presetId) => {
    const preset = presets.find((entry) => entry.id === presetId) || null;
    updateBatchItemState(itemId, {
      presetId,
      selectedVariantIds: defaultSelectedVariantIds(preset),
      error: null,
      results: [],
      progress: 0,
      status: 'draft',
      currentVariantName: '',
    });
  }, [presets, updateBatchItemState]);

  const executeBatchItem = useCallback(async (item, runId) => {
    const preset = presets.find((entry) => entry.id === item.presetId);

    if (!item || !preset || !isBatchItemConfigComplete(item)) {
      return;
    }

    activeBatchJobsRef.current.add(item.id);

    try {
      updateBatchItemState(item.id, {
        status: 'uploading',
        progress: 2,
        error: null,
        currentVariantName: 'Preparation des references',
      });

      const { assets } = await runGenerationJob({
        sourceImages: item.sourceImages,
        preset,
        selectedVariantIds: item.selectedVariantIds,
        shouldAbort: () => (
          activeBatchRunRef.current !== runId
          || ignoredBatchItemsRef.current.has(item.id)
        ),
        onStageChange: ({ status, currentVariantName: nextVariantName }) => {
          if (ignoredBatchItemsRef.current.has(item.id)) return;
          updateBatchItemState(item.id, {
            status: status || 'pending',
            currentVariantName: nextVariantName || '',
          });
        },
        onProgress: (nextProgress) => {
          if (ignoredBatchItemsRef.current.has(item.id)) return;
          updateBatchItemState(item.id, { progress: nextProgress });
        },
      });

      if (activeBatchRunRef.current !== runId || ignoredBatchItemsRef.current.has(item.id)) {
        return;
      }

      updateBatchItemState(item.id, {
        status: 'done',
        progress: 100,
        currentVariantName: 'Generation terminee',
        results: assets,
        error: null,
      });
    } catch (err) {
      if (activeBatchRunRef.current !== runId || ignoredBatchItemsRef.current.has(item.id)) {
        return;
      }

      updateBatchItemState(item.id, {
        status: 'failed',
        progress: 0,
        currentVariantName: '',
        results: [],
        error: err.message,
      });
    } finally {
      activeBatchJobsRef.current.delete(item.id);
      ignoredBatchItemsRef.current.delete(item.id);
    }
  }, [presets, runGenerationJob, updateBatchItemState]);

  const startBatchGeneration = useCallback(async (folderId) => {
    const folderItems = batchItems.filter((item) => item.folderId === folderId);
    if (folderItems.length === 0) {
      setError('Ajoute au moins un produit dans cette boutique.');
      return;
    }

    const runnableItems = folderItems.filter((item) => isBatchItemConfigComplete(item) && ['draft', 'pending', 'failed'].includes(item.status));
    if (runnableItems.length === 0) {
      setError('Chaque produit de cette boutique doit avoir un preset et au moins une variante active.');
      return;
    }

    if (!batchRunning) {
      activeBatchRunRef.current += 1;
      batchHistoryLoadedRunRef.current = null;
      ignoredBatchItemsRef.current.clear();
    }

    setBatchRunning(true);
    setError(null);
    setShowHistory(false);

    setBatchItems((current) => current.map((item) => ({
      ...item,
      status: item.folderId === folderId && isBatchItemConfigComplete(item)
        ? (['done', 'uploading', 'generating-master', 'generating-variants'].includes(item.status) ? item.status : 'pending')
        : (item.folderId === folderId ? 'failed' : item.status),
      progress: item.folderId === folderId
        ? (['done', 'uploading', 'generating-master', 'generating-variants'].includes(item.status) ? item.progress : 0)
        : item.progress,
      currentVariantName: item.folderId === folderId
        ? (['done', 'uploading', 'generating-master', 'generating-variants'].includes(item.status) ? item.currentVariantName : '')
        : item.currentVariantName,
      results: item.status === 'done' ? item.results : [],
      error: item.folderId === folderId
        ? (isBatchItemConfigComplete(item) ? null : 'Configuration incomplete')
        : item.error,
    })));
  }, [batchItems, batchRunning]);

  useEffect(() => {
    if (!batchRunning) {
      return;
    }

    const runId = activeBatchRunRef.current;
    const pendingItems = batchItems.filter((item) => (
      item.status === 'pending'
      && isBatchItemConfigComplete(item)
      && !activeBatchJobsRef.current.has(item.id)
      && !ignoredBatchItemsRef.current.has(item.id)
    ));
    const availableSlots = Math.max(0, MAX_BATCH_CONCURRENCY - activeBatchJobsRef.current.size);

    pendingItems.slice(0, availableSlots).forEach((item) => {
      void executeBatchItem(item, runId);
    });

    const hasPending = batchItems.some((item) => (
      item.status === 'pending'
      && isBatchItemConfigComplete(item)
      && !ignoredBatchItemsRef.current.has(item.id)
    ));

    if (activeBatchJobsRef.current.size === 0 && !hasPending) {
      setBatchRunning(false);

      if (batchHistoryLoadedRunRef.current !== runId) {
        batchHistoryLoadedRunRef.current = runId;
        void loadHistory();
      }
    }
  }, [batchItems, batchRunning, executeBatchItem, loadHistory]);

  const downloadBatchResults = useCallback(async (folderId) => {
    const folder = batchFolders.find((entry) => entry.id === folderId) || null;
    if (!folder || batchRunning || batchDownloading) return;

    setBatchDownloading(true);
    setError(null);

    try {
      const completedItems = batchItems.filter((item) => item.folderId === folderId && item.results.length > 0);
      if (completedItems.length === 0) {
        throw new Error('Aucun resultat disponible dans cette boutique.');
      }

      const collections = completedItems.map((item, index) => {
        const preset = presets.find((entry) => entry.id === item.presetId) || null;
        return {
          folderName: item.name.replace(/\.[^.]+$/, ''),
          outputFormat: preset?.outputFormat || 'png',
          assets: item.results,
          fallbackIndex: index,
        };
      });

      await saveCollections({
        collections,
        archiveName: `flash-${sanitizeFileName(folder.name, 'boutique')}-${new Date().toISOString().slice(0, 10)}.zip`,
        title: folder.name,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBatchDownloading(false);
    }
  }, [batchDownloading, batchFolders, batchItems, batchRunning, presets, saveCollections]);

  const downloadResultsBundle = useCallback(async () => {
    if (!canDownloadResults) return;

    setResultsDownloading(true);
    setError(null);

    try {
      await saveCollections({
        collections: [{
        folderName: resultsMeta.folderName,
        outputFormat: resultsMeta.outputFormat,
        assets: results,
      }],
        archiveName: resultsMeta.archiveName,
        title: 'FLASH resultats',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setResultsDownloading(false);
    }
  }, [canDownloadResults, results, resultsMeta, saveCollections]);

  const reset = useCallback(() => {
    resetGenerationContext();
    clearSourceImages();
    setStep('capture');
    stopCamera();
  }, [clearSourceImages, resetGenerationContext, stopCamera]);

  const resetBatch = useCallback(() => {
    activeBatchRunRef.current += 1;
    activeBatchJobsRef.current.clear();
    ignoredBatchItemsRef.current.clear();
    batchHistoryLoadedRunRef.current = null;
    batchFileTargetFolderRef.current = null;
    setBatchRunning(false);
    clearBatchItems();
    setBatchFolders([]);
    setSelectedBatchFolderId(null);
    setEditingBatchFolderId(null);
    setEditingBatchFolderName('');
    setError(null);
    setStep('capture');
    stopCamera();
  }, [clearBatchItems, stopCamera]);

  const deleteHistory = async (taskId) => {
    try {
      const params = new URLSearchParams({
        taskId,
        clientId: clientIdRef.current,
      });
      const res = await fetch(`${API}/history?${params.toString()}`, { method: 'DELETE' });
      const data = await readJsonResponse(res);

      if (!res.ok || data?.error) {
        throw new Error(data?.error || "Impossible de supprimer l'historique");
      }

      await loadHistory();
    } catch (err) {
      setError(err.message);
    }
  };

  const savePreset = async () => {
    if (!editingPreset) return;

    setSavingPreset(true);
    setError(null);

    try {
      const res = await fetch(`${API}/presets?clientId=${encodeURIComponent(clientIdRef.current)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset: editingPreset }),
      });
      const data = await readJsonResponse(res);

      if (!res.ok) {
        throw new Error(data?.error || 'Impossible de sauvegarder le preset');
      }

      const savedPreset = normalizePreset(data);
      setPresets((current) => {
        const exists = current.some((preset) => preset.id === savedPreset.id);
        return exists
          ? current.map((preset) => (preset.id === savedPreset.id ? savedPreset : preset))
          : [...current, savedPreset];
      });
      setSelectedPresetId(savedPreset.id);
      setSelectedVariantIds(defaultSelectedVariantIds(savedPreset));
      setEditingPreset(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPreset(false);
    }
  };

  const startNewPreset = () => {
    setEditingPreset(createPreset());
    setStep('preset');
    setShowHistory(false);
  };

  const startEditPreset = () => {
    if (!selectedPreset) return;
    setEditingPreset(createPreset(selectedPreset));
  };

  const duplicatePreset = () => {
    if (!selectedPreset) return;
    setEditingPreset(createPreset({
      ...selectedPreset,
      id: crypto.randomUUID(),
      name: `${selectedPreset.name} copie`,
      variants: selectedPreset.variants.map((variant) => ({
        ...variant,
        id: crypto.randomUUID(),
      })),
    }));
  };

  const removePreset = async () => {
    if (!selectedPreset) return;
    if (!window.confirm(`Supprimer le preset "${selectedPreset.name}" ?`)) return;

    try {
      const params = new URLSearchParams({
        clientId: clientIdRef.current,
        presetId: selectedPreset.id,
      });
      const res = await fetch(`${API}/presets?${params.toString()}`, { method: 'DELETE' });
      const data = await readJsonResponse(res);

      if (!res.ok) {
        throw new Error(data?.error || 'Impossible de supprimer le preset');
      }

      const nextPresets = presets.filter((preset) => preset.id !== selectedPreset.id);
      setPresets(nextPresets);
      setSelectedPresetId(nextPresets[0]?.id || null);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateEditingPreset = (field, value) => {
    setEditingPreset((current) => ({ ...current, [field]: value }));
  };

  const updateEditingVariant = (variantId, field, value) => {
    setEditingPreset((current) => {
      const nextVariants = current.variants.map((variant) => {
        if (variant.id !== variantId) {
          return field === 'isMaster' && value ? { ...variant, isMaster: false } : variant;
        }

        const nextVariant = { ...variant, [field]: value };
        if (field === 'isMaster' && value) {
          nextVariant.sourceMode = 'source';
        }
        return nextVariant;
      });

      return {
        ...current,
        variants: ensureSingleMaster(nextVariants),
      };
    });
  };

  const addVariant = () => {
    setEditingPreset((current) => ({
      ...current,
      variants: [...current.variants, createVariant({ aspectRatio: current.aspectRatio, sourceMode: 'master' })],
    }));
  };

  const removeVariant = (variantId) => {
    setEditingPreset((current) => {
      if (current.variants.length <= 1) return current;
      return {
        ...current,
        variants: ensureSingleMaster(current.variants.filter((variant) => variant.id !== variantId)),
      };
    });
  };

  const toggleVariantSelection = (variantId) => {
    if (!selectedPreset) return;

    const masterId = selectedPreset.variants.find((variant) => variant.isMaster)?.id;
    setSelectedVariantIds((current) => {
      const next = current.includes(variantId)
        ? current.filter((id) => id !== variantId)
        : [...current, variantId];

      if (next.length === 0) {
        return [];
      }

      if (masterId && !next.includes(masterId)) {
        return [masterId, ...next];
      }

      return next;
    });
  };

  const viewHistoryItem = (item) => {
    const historyPreset = presets.find((preset) => preset.id === item.presetId) || null;
    setResults(normalizeAssets(item.images));
    setResultsMeta({
      archiveName: `flash-${sanitizeFileName(item.presetName || presetNameMap[item.presetId] || 'historique', 'historique')}-${new Date().toISOString().slice(0, 10)}.zip`,
      folderName: sanitizeFileName(item.presetName || presetNameMap[item.presetId] || 'historique', 'historique'),
      outputFormat: historyPreset?.outputFormat || 'png',
    });
    setSelectedPresetId(item.presetId);
    setShowHistory(false);
    setStep('results');
  };

  const currentPresetForDisplay = editingPreset || selectedPreset;

  return (
    <div className="app">
      <header className="header">
        {(step !== 'capture' || showHistory) && (
          <button
            className="btn-back"
            disabled={step === 'batch' && batchRunning}
            onClick={() => {
              if (showHistory) setShowHistory(false);
              else if (editingPreset) setEditingPreset(null);
              else if (step === 'results') reset();
              else if (step === 'batch') setStep('capture');
              else {
                stopCamera();
                setStep('capture');
              }
            }}
          >
            <ChevronLeft size={22} />
          </button>
        )}
        <div className="logo">
          <Zap size={18} className="logo-icon" />
          <span>FLASH</span>
        </div>
        <div className="header-actions">
          {step === 'capture' && !showHistory && (
            <>
              <button className="btn-back" onClick={() => { setShowHistory(false); setStep('preset'); }}>
                <SlidersHorizontal size={17} />
              </button>
              <button className="btn-back" onClick={() => { loadHistory(); setShowHistory(true); }}
                style={{ opacity: history.length ? 1 : 0.35 }}>
                <Clock size={17} />
              </button>
            </>
          )}
          {step !== 'capture' && !showHistory && (
            <button className="btn-back" onClick={step === 'batch' ? resetBatch : reset} disabled={step === 'batch' && batchRunning}>
              <RotateCcw size={17} />
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="toast">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {showHistory && (
        <div className="screen">
          <h2 className="section-title"><Clock size={16} /> Historique</h2>
          {history.length === 0 ? (
            <p className="empty-msg">Aucune generation pour l'instant</p>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item.taskId} className="history-card" onClick={() => viewHistoryItem(item)}>
                  <div className="history-thumb">
                    <img src={item.images[0]?.url} alt="" />
                  </div>
                  <div className="history-info">
                    <strong>{item.presetName || presetNameMap[item.presetId] || item.presetId}</strong>
                    <small>{formatDate(item.date)} - {item.images.length} asset{item.images.length > 1 ? 's' : ''}</small>
                  </div>
                  <button className="btn-delete" onClick={(e) => { e.stopPropagation(); deleteHistory(item.taskId); }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 'capture' && !showHistory && (
        <div className="screen">
          <div className="page-intro">
            <h2 className="section-title"><Camera size={16} /> Capture produit</h2>
            <p className="section-copy">Ajoute une ou plusieurs references produit, puis passe sur tes presets pour lancer une serie complete.</p>
          </div>
          <div className="viewfinder">
            <video ref={videoRef} autoPlay playsInline muted />
            {cameraActive && <div className="crosshair" />}
            {!cameraActive && (
              <div className="viewfinder-placeholder">
                <Camera size={48} strokeWidth={1.2} />
                <p>Photographie ton produit</p>
              </div>
            )}
          </div>
          <div className="capture-bar">
            <button className="btn-secondary" onClick={() => fileRef.current?.click()}>
              <Image size={20} />
              <span>Galerie</span>
            </button>
            <button className="btn-shutter" onClick={cameraActive ? capturePhoto : startCamera}>
              <div className="shutter-ring"><Camera size={26} /></div>
            </button>
            <div className="spacer" />
          </div>
          <div className="quick-actions">
            <button className="btn-secondary wide" onClick={() => setStep('preset')}>
              <SlidersHorizontal size={18} />
              <span>Preset unique</span>
            </button>
            <button className="btn-secondary wide" onClick={() => setStep('batch')}>
              <Layers3 size={18} />
              <span>Batch x20</span>
            </button>
          </div>
        </div>
      )}

      {step === 'preset' && (
        <div className="screen">
          <div className="page-intro">
            <h2 className="section-title"><SlidersHorizontal size={16} /> Presets de shooting</h2>
            <p className="section-copy">Construis des recettes de shooting reutilisables avec plusieurs variantes automatiques.</p>
          </div>

          <div className="preview-card">
            {sourceImages.length > 0 ? (
              <>
                <div className="preview-card-head">
                  <div>
                    <strong>{sourceImages.length} reference{sourceImages.length > 1 ? 's' : ''} source</strong>
                    <small>Ajoute par exemple une vue globale de l'objet et un gros plan de l'etiquette.</small>
                  </div>
                  <button className="btn-secondary" onClick={() => fileRef.current?.click()} disabled={generating}>
                    <Plus size={16} />
                    <span>Ajouter</span>
                  </button>
                </div>
                <div className={`preview-grid ${sourceImages.length === 1 ? 'single' : ''}`}>
                  {sourceImages.map((image, index) => (
                    <div key={image.id} className="preview-item">
                      <img src={image.previewUrl} alt={`Reference ${index + 1}`} />
                      <div className="preview-meta">
                        <strong>{index === 0 ? 'Vue principale' : `Reference ${index + 1}`}</strong>
                        <small>{image.name}</small>
                      </div>
                      <button
                        type="button"
                        className="btn-delete preview-remove"
                        onClick={() => removeSourceImage(image.id)}
                        disabled={generating}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="preview-empty">
                <Image size={28} />
                <p>Ajoute une ou plusieurs images de reference pour lancer les variantes. Tu peux quand meme creer et editer tes presets maintenant.</p>
                <button className="btn-secondary" onClick={() => fileRef.current?.click()}>
                  <Plus size={16} />
                  <span>Ajouter des refs</span>
                </button>
              </div>
            )}
          </div>

          <div className="toolbar">
            <button className="btn-secondary" onClick={() => setStep('batch')} disabled={Boolean(editingPreset)}>
              <Layers3 size={16} />
              <span>Mode batch</span>
            </button>
          </div>

          {loadingPresets ? (
            <p className="empty-msg">Chargement des presets...</p>
          ) : (
            <div className="preset-library">
              {presets.map((preset) => {
                const meta = themeMeta(preset.theme);
                const Icon = meta.icon;
                const active = selectedPresetId === preset.id && !editingPreset;

                return (
                  <button
                    key={preset.id}
                    className={`preset ${active ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      setEditingPreset(null);
                    }}
                    style={{ '--c': meta.color }}
                  >
                    <div className="preset-icon"><Icon size={22} /></div>
                    <div className="preset-info">
                      <strong>{preset.name}</strong>
                      <small>{preset.description || meta.label}</small>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {editingPreset ? (
            <div className="editor-card">
              <div className="editor-head">
                <h3>Edition du preset</h3>
                <span className="editor-badge">Preset editable</span>
              </div>

              <label className="field">
                <span>Nom</span>
                <input value={editingPreset.name} onChange={(e) => updateEditingPreset('name', e.target.value)} />
              </label>

              <label className="field">
                <span>Description</span>
                <input value={editingPreset.description} onChange={(e) => updateEditingPreset('description', e.target.value)} />
              </label>

              <label className="field">
                <span>Prompt maitre</span>
                <textarea rows={5} value={editingPreset.basePrompt} onChange={(e) => updateEditingPreset('basePrompt', e.target.value)} />
              </label>

              <label className="field">
                <span>Negative prompt</span>
                <textarea rows={3} value={editingPreset.negativePrompt} onChange={(e) => updateEditingPreset('negativePrompt', e.target.value)} />
              </label>

              <div className="form-grid">
                <label className="field">
                  <span>Theme</span>
                  <select value={editingPreset.theme} onChange={(e) => updateEditingPreset('theme', e.target.value)}>
                    {Object.entries(THEME_META).map(([value, meta]) => (
                      <option key={value} value={value}>{meta.label}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Aspect ratio</span>
                  <select value={editingPreset.aspectRatio} onChange={(e) => updateEditingPreset('aspectRatio', e.target.value)}>
                    <option value="auto">AUTO</option>
                    <option value="1:1">1:1</option>
                    <option value="4:5">4:5</option>
                    <option value="9:16">9:16</option>
                    <option value="16:9">16:9</option>
                  </select>
                </label>
                <label className="field">
                  <span>Resolution</span>
                  <select value={editingPreset.resolution} onChange={(e) => updateEditingPreset('resolution', e.target.value)}>
                    <option value="1K">1K</option>
                  </select>
                </label>
                <label className="field">
                  <span>Format</span>
                  <select value={editingPreset.outputFormat} onChange={(e) => updateEditingPreset('outputFormat', e.target.value)}>
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                  </select>
                </label>
              </div>

              <div className="variants-head">
                <h3>Variantes automatiques</h3>
                <button className="btn-secondary" onClick={addVariant}>
                  <Plus size={16} />
                  <span>Ajouter</span>
                </button>
              </div>

              <div className="variant-list">
                {editingPreset.variants.map((variant) => {
                  const effective = getEffectiveVariantConfig(editingPreset, variant);

                  return (
                    <div key={variant.id} className="variant-card">
                      <div className="variant-row">
                        <label className="field">
                          <span>Nom de la vue</span>
                          <input value={variant.name} onChange={(e) => updateEditingVariant(variant.id, 'name', e.target.value)} />
                        </label>
                        <label className="field narrow">
                          <span>Ratio</span>
                          <select value={variant.aspectRatio} onChange={(e) => updateEditingVariant(variant.id, 'aspectRatio', e.target.value)}>
                            <option value="auto">AUTO</option>
                            <option value="1:1">1:1</option>
                            <option value="4:5">4:5</option>
                            <option value="9:16">9:16</option>
                            <option value="16:9">16:9</option>
                          </select>
                        </label>
                      </div>
                      <div className="variant-row">
                        <div className="field">
                          <span>Reference image</span>
                          <div className="field-readonly">
                            {variant.isMaster
                              ? 'References source de la session courante'
                              : 'Master asset de la session courante'}
                          </div>
                        </div>
                        <label className="checkbox-row master-row">
                          <input
                            type="checkbox"
                            checked={variant.isMaster}
                            onChange={(e) => updateEditingVariant(variant.id, 'isMaster', e.target.checked)}
                          />
                          <span>Vue maitre</span>
                        </label>
                      </div>
                      <label className="field">
                        <span>Consigne additionnelle</span>
                        <textarea rows={3} value={variant.promptAddon} onChange={(e) => updateEditingVariant(variant.id, 'promptAddon', e.target.value)} />
                      </label>
                      <label className="field">
                        <span>Prompt complet de la variante</span>
                        <textarea rows={6} value={variant.promptOverride} onChange={(e) => updateEditingVariant(variant.id, 'promptOverride', e.target.value)} placeholder="Si vide, FLASH utilise le prompt maitre + la consigne additionnelle." />
                      </label>
                      <label className="field">
                        <span>Negative prompt de la variante</span>
                        <textarea rows={3} value={variant.negativePrompt} onChange={(e) => updateEditingVariant(variant.id, 'negativePrompt', e.target.value)} placeholder="Si vide, FLASH utilise le negative prompt du preset." />
                      </label>
                      <div className="effective-box">
                        <div className="effective-head">
                          <strong>Payload effectif</strong>
                          <span>{effective.usesPromptOverride ? 'Prompt verrouille' : 'Prompt herite'}</span>
                        </div>
                        <div className="effective-grid">
                          <div>
                            <span className="detail-label">Source</span>
                            <p>{variant.isMaster ? 'References source de la session courante' : 'Master asset de la session courante'}</p>
                          </div>
                          <div>
                            <span className="detail-label">Sortie</span>
                            <p>{effective.aspectRatio} - {effective.resolution} - {effective.outputFormat.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="effective-section">
                          <span className="detail-label">Prompt reel envoye</span>
                          <pre>{effective.prompt}</pre>
                        </div>
                      </div>
                      <div className="variant-actions">
                        <label className="checkbox-row">
                          <input
                            type="checkbox"
                            checked={variant.enabledByDefault}
                            onChange={(e) => updateEditingVariant(variant.id, 'enabledByDefault', e.target.checked)}
                          />
                          <span>Active par defaut</span>
                        </label>
                        <button className="btn-delete inline" onClick={() => removeVariant(variant.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="toolbar">
                <button className="btn-secondary" onClick={() => setEditingPreset(null)}>Annuler</button>
                <button className="btn-main" disabled={savingPreset} onClick={savePreset}>
                  {savingPreset ? <><span className="spinner" />Sauvegarde...</> : <><Save size={18} />Sauvegarder le preset</>}
                </button>
              </div>
            </div>
          ) : currentPresetForDisplay ? (
            <div className="preset-detail">
              <div className="detail-head">
                <div>
                  <h3>{currentPresetForDisplay.name}</h3>
                  <p>{currentPresetForDisplay.description || 'Preset pret pour une production reutilisable.'}</p>
                </div>
                <span className="editor-badge">{themeMeta(currentPresetForDisplay.theme).label}</span>
              </div>

              <div className="detail-grid">
                <div className="detail-card">
                  <span className="detail-label">Prompt maitre</span>
                  <p>{currentPresetForDisplay.basePrompt}</p>
                </div>
                {currentPresetForDisplay.negativePrompt && (
                  <div className="detail-card">
                    <span className="detail-label">Negative prompt</span>
                    <p>{currentPresetForDisplay.negativePrompt}</p>
                  </div>
                )}
                <div className="detail-card">
                  <span className="detail-label">Sortie</span>
                  <p>{currentPresetForDisplay.aspectRatio} - {currentPresetForDisplay.resolution} - {currentPresetForDisplay.outputFormat.toUpperCase()}</p>
                </div>
              </div>

              <div className="variants-head">
                <h3>Variantes a produire</h3>
                <span className="subtle">{selectedVariantIds.length} selectionnee{selectedVariantIds.length > 1 ? 's' : ''}</span>
              </div>
              <div className="variant-list">
                {currentPresetForDisplay.variants.map((variant) => {
                  const checked = selectedVariantIds.includes(variant.id);
                  const effective = getEffectiveVariantConfig(currentPresetForDisplay, variant);
                  return (
                    <div key={variant.id} className={`variant-select ${checked ? 'active' : ''}`}>
                      <button className="variant-select-main" onClick={() => toggleVariantSelection(variant.id)}>
                        <div className="variant-check">
                          {checked ? <CheckSquare size={18} /> : <Square size={18} />}
                        </div>
                        <div className="variant-content">
                          <strong>{variant.name}</strong>
                          <small>
                            {variant.isMaster
                              ? 'Vue maitre generee depuis les references source de la session'
                              : `Source : master asset de la session courante - ${variant.promptAddon || 'Aucune consigne additionnelle'}`}
                          </small>
                        </div>
                        <span className="variant-ratio">{variant.aspectRatio}</span>
                      </button>
                      <div className="variant-debug">
                        <div className="variant-debug-grid">
                          <div>
                            <span className="detail-label">Source reelle</span>
                            <p>{variant.isMaster ? 'References source de la session courante' : 'Master asset de la session courante'}</p>
                          </div>
                          <div>
                            <span className="detail-label">Payload</span>
                            <p>{effective.aspectRatio} - {effective.resolution} - {effective.outputFormat.toUpperCase()}</p>
                          </div>
                          <div>
                            <span className="detail-label">Prompt</span>
                            <p>{effective.usesPromptOverride ? 'Prompt complet de variante' : 'Prompt maitre + consigne'}</p>
                          </div>
                          <div>
                            <span className="detail-label">Negative</span>
                            <p>{effective.usesVariantNegativePrompt ? 'Negative de variante' : 'Negative du preset'}</p>
                          </div>
                        </div>
                        <div className="effective-section">
                          <span className="detail-label">Prompt reel envoye a KIE</span>
                          <pre>{effective.prompt}</pre>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="toolbar">
                <button className="btn-secondary" onClick={() => setStep('batch')}>
                  <Layers3 size={16} />
                  <span>Basculer en batch</span>
                </button>
              </div>

              <button className="btn-main" disabled={sourceImages.length === 0 || generating || selectedVariantIds.length === 0} onClick={generate}>
                {generating ? (
                  <><span className="spinner" />Generation {currentVariantName ? `- ${currentVariantName}` : ''} - {Math.round(progress)}%</>
                ) : (
                  <><Sparkles size={18} />Generer la serie</>
                )}
              </button>
              {sourceImages.length === 0 && <p className="helper-text">Ajoute d'abord une ou plusieurs references pour lancer ce preset.</p>}
              {generating && (
                <div className="progress">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          ) : (
            <p className="empty-msg">Aucun preset disponible.</p>
          )}
        </div>
      )}

      {step === 'batch' && (
        <div className="screen">
          <div className="page-intro">
            <h2 className="section-title"><Layers3 size={16} /> Batch produits</h2>
            <p className="section-copy">Organise jusqu'a {MAX_BATCH_ITEMS} produits dans des boutiques persistantes, chacune avec son preset principal, ses stats et ses actions de generation.</p>
          </div>

          <div className="batch-summary">
            <div className="summary-pill"><strong>{batchSummary.folders}</strong><span>boutiques</span></div>
            <div className="summary-pill"><strong>{batchSummary.total}</strong><span>produits</span></div>
            <div className="summary-pill"><strong>{batchSummary.done}</strong><span>termines</span></div>
            <div className="summary-pill"><strong>{batchSummary.assets}</strong><span>assets</span></div>
          </div>

          <div className="toolbar batch-page-toolbar">
            <button className="btn-secondary" onClick={createEmptyBatchFolder}>
              <ShoppingBag size={16} />
              <span>Nouvelle boutique</span>
            </button>
            {batchFolders.length > 0 && (
              <>
                <label className="field batch-folder-picker">
                  <span>Ajouter dans</span>
                  <select value={selectedBatchFolderId || ''} onChange={(e) => setSelectedBatchFolderId(e.target.value)}>
                    {batchFolders.map((folder) => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </label>
                <button className="btn-secondary" onClick={() => openBatchFilePicker(selectedBatchFolderId)} disabled={!selectedBatchFolderId || batchItems.length >= MAX_BATCH_ITEMS}>
                  <Plus size={16} />
                  <span>Ajouter des produits</span>
                </button>
              </>
            )}
          </div>

          {batchFolders.length === 0 ? (
            <div className="preview-empty batch-empty">
              <ShoppingBag size={28} />
              <p>Cree une premiere boutique pour regrouper les produits d'une meme session sans les melanger avec les autres.</p>
              <button className="btn-secondary" onClick={createEmptyBatchFolder}>
                <ShoppingBag size={16} />
                <span>Creer une boutique</span>
              </button>
            </div>
          ) : (
            <div className="batch-list">
              {batchFoldersWithItems.map((folder) => {
                const isEditingFolder = editingBatchFolderId === folder.id;
                return (
                  <div key={folder.id} className="batch-folder">
                    <div className="batch-folder-head">
                      <button className="batch-folder-toggle" onClick={() => toggleBatchFolderCollapsed(folder.id)}>
                        <span className={`batch-folder-chevron ${folder.collapsed ? 'collapsed' : ''}`}>
                          <ChevronDown size={16} />
                        </span>
                        <div className="batch-folder-title">
                          {isEditingFolder ? (
                            <input
                              value={editingBatchFolderName}
                              onChange={(e) => setEditingBatchFolderName(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  commitBatchFolderRename(folder.id);
                                }
                                if (e.key === 'Escape') {
                                  cancelBatchFolderRename();
                                }
                              }}
                              onBlur={() => commitBatchFolderRename(folder.id)}
                              autoFocus
                            />
                          ) : (
                            <>
                              <strong>{folder.name}</strong>
                              <small>{folder.preset?.name || 'Preset principal manquant'} - {folder.stats.total} produit{folder.stats.total > 1 ? 's' : ''}</small>
                            </>
                          )}
                        </div>
                      </button>

                      <div className="batch-folder-actions">
                        {isEditingFolder ? (
                          <>
                            <button className="btn-secondary compact" type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => commitBatchFolderRename(folder.id)}>
                              <Save size={14} />
                              <span>OK</span>
                            </button>
                            <button className="btn-delete" type="button" onMouseDown={(e) => e.preventDefault()} onClick={cancelBatchFolderRename}>
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="btn-delete" type="button" onClick={() => startBatchFolderRename(folder)}>
                              <Pencil size={16} />
                            </button>
                            <button className="btn-delete" type="button" onClick={() => downloadBatchResults(folder.id)} disabled={!folder.canDownload}>
                              <Download size={16} />
                            </button>
                            <button className="btn-delete" type="button" onClick={() => removeBatchFolder(folder.id)}>
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="batch-folder-stats">
                      <div className="detail-card compact">
                        <span className="detail-label">Preset principal</span>
                        <p>{folder.preset?.name || 'Non defini'}</p>
                      </div>
                      <div className="detail-card compact">
                        <span className="detail-label">Stats</span>
                        <p>{folder.stats.done} termines - {folder.stats.failed} erreurs</p>
                      </div>
                      <div className="detail-card compact">
                        <span className="detail-label">Progression</span>
                        <p>{folder.stats.running > 0 ? `${folder.stats.running} en cours` : `${folder.stats.launchable} a lancer`}</p>
                      </div>
                      <div className="detail-card compact">
                        <span className="detail-label">Resultats</span>
                        <p>{folder.stats.assets} asset{folder.stats.assets > 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {!folder.collapsed && (
                      <div className="batch-folder-body">
                        <div className="batch-folder-toolbar">
                          <label className="field">
                            <span>Preset principal</span>
                            <select value={folder.presetId || ''} onChange={(e) => updateBatchFolderPreset(folder.id, e.target.value)}>
                              {presets.map((presetOption) => (
                                <option key={presetOption.id} value={presetOption.id}>{presetOption.name}</option>
                              ))}
                            </select>
                          </label>
                          <div className="toolbar batch-folder-toolbar-actions">
                            <button className="btn-secondary" onClick={() => openBatchFilePicker(folder.id)} disabled={batchItems.length >= MAX_BATCH_ITEMS}>
                              <Plus size={16} />
                              <span>Ajouter des produits</span>
                            </button>
                            <button className="btn-main batch-cta" onClick={() => startBatchGeneration(folder.id)} disabled={folder.stats.launchable === 0}>
                              {folder.stats.running > 0
                                ? <><span className="spinner" />Lancer les nouveaux ({folder.stats.launchable})</>
                                : <><Sparkles size={18} />Generer la boutique</>}
                            </button>
                          </div>
                        </div>

                        {folder.items.length === 0 ? (
                          <div className="preview-empty batch-folder-empty">
                            <Layers3 size={24} />
                            <p>Ajoute des produits dans cette boutique pour garder ses generations et ses resultats ensemble.</p>
                          </div>
                        ) : (
                          <div className="batch-list">
                            {folder.items.map((item, index) => {
                              const preset = presets.find((entry) => entry.id === item.presetId) || null;
                              return (
                                <div key={item.id} className={`batch-card status-${item.status}`}>
                                  <div className="batch-card-head">
                                    <div>
                                      <strong>{item.name}</strong>
                                      <small>Produit {index + 1} - {preset?.name || 'Preset manquant'}</small>
                                    </div>
                                    <span className={`batch-badge status-${item.status}`}>{batchStatusLabel(item.status)}</span>
                                  </div>

                                  <div className="batch-card-body">
                                    <div className="batch-thumb">
                                      <img src={item.sourceImages[0]?.previewUrl} alt={item.name} />
                                    </div>
                                    <div className="batch-config">
                                      <label className="field">
                                        <span>Preset</span>
                                        <select
                                          value={item.presetId || ''}
                                          onChange={(e) => updateBatchItemPreset(item.id, e.target.value)}
                                          disabled={isBatchItemLocked(item.status)}
                                        >
                                          {presets.map((presetOption) => (
                                            <option key={presetOption.id} value={presetOption.id}>{presetOption.name}</option>
                                          ))}
                                        </select>
                                      </label>
                                      <div className="batch-meta-grid">
                                        <div className="detail-card compact">
                                          <span className="detail-label">Sources</span>
                                          <p>{item.sourceImages.length} reference{item.sourceImages.length > 1 ? 's' : ''}</p>
                                        </div>
                                        <div className="detail-card compact">
                                          <span className="detail-label">Variantes</span>
                                          <p>{item.selectedVariantIds.length} par defaut</p>
                                        </div>
                                        <div className="detail-card compact">
                                          <span className="detail-label">Progression</span>
                                          <p>{Math.round(item.progress)}%</p>
                                        </div>
                                      </div>
                                      <div className="toolbar batch-card-toolbar">
                                        <button
                                          className="btn-secondary"
                                          onClick={() => openBatchSourcePicker(item.id)}
                                          disabled={isBatchItemLocked(item.status)}
                                        >
                                          <Plus size={16} />
                                          <span>Ajouter refs</span>
                                        </button>
                                      </div>
                                      {item.currentVariantName && <p className="helper-text left">{item.currentVariantName}</p>}
                                      {item.error && <p className="batch-error">{item.error}</p>}
                                    </div>
                                  </div>

                                  {item.sourceImages.length > 0 && (
                                    <div className="batch-sources-grid">
                                      {item.sourceImages.map((image, imageIndex) => (
                                        <div key={image.id} className="batch-source-thumb">
                                          <img src={image.previewUrl} alt={image.name || `Reference ${imageIndex + 1}`} />
                                          <div className="batch-source-meta">
                                            <span>{imageIndex === 0 ? 'Vue principale' : `Ref ${imageIndex + 1}`}</span>
                                          </div>
                                          <button
                                            type="button"
                                            className="btn-delete preview-remove"
                                            onClick={() => removeBatchSourceImage(item.id, image.id)}
                                            disabled={isBatchItemLocked(item.status)}
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div className="progress">
                                    <div className="progress-fill" style={{ width: `${item.progress}%` }} />
                                  </div>

                                  {item.results.length > 0 && (
                                    <div className="batch-results-grid">
                                      {item.results.slice(0, 4).map((asset) => (
                                        <div key={asset.id} className="batch-result-thumb">
                                          <img src={asset.url} alt={asset.label} />
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div className="batch-actions">
                                    <span className="subtle">{item.results.length} resultat{item.results.length > 1 ? 's' : ''}</span>
                                    <button className="btn-delete" onClick={() => removeBatchItem(item.id)}>
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {step === 'results' && (
        <div className="screen">
          <div className="page-intro">
            <h2 className="section-title"><Sparkles size={16} /> Resultats</h2>
            <p className="section-copy">Assets produits avec le preset selectionne, prets a etre telecharges ou rejoues.</p>
          </div>
          <div className="toolbar">
            <button className="btn-secondary" onClick={downloadResultsBundle} disabled={!canDownloadResults}>
              <Download size={16} />
              <span>{resultsDownloading ? (prefersDirectMobileSave ? 'Preparation des images...' : 'Preparation du zip...') : (prefersDirectMobileSave ? 'Tout enregistrer' : 'Tout telecharger')}</span>
            </button>
          </div>
          <div className="gallery">
            {results.map((asset, i) => (
              <div key={asset.id || i} className="gallery-item">
                <img src={asset.url} alt={asset.label || `Resultat ${i + 1}`} />
                <div className="gallery-meta">
                  <strong>{asset.label || `Resultat ${i + 1}`}</strong>
                </div>
                <button
                  type="button"
                  className="btn-dl"
                  onClick={() => downloadSingleResult(asset, `flash-${selectedPresetId || 'preset'}-${i + 1}.${resultsMeta.outputFormat || getAssetExtension(asset.url, 'png')}`)}
                >
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
          <button className="btn-main" onClick={reset}>
            <RotateCcw size={18} />Nouvelle session
          </button>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileUpload} hidden />
      <input ref={batchFileRef} type="file" accept="image/*" multiple onChange={handleBatchFileUpload} hidden />
      <input ref={batchSourceFileRef} type="file" accept="image/*" multiple onChange={handleBatchSourceUpload} hidden />

      {mobileSaverOpen && (
        <div className="mobile-saver-overlay" onClick={closeMobileSaver}>
          <div className="mobile-saver-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-saver-head">
              <div className="mobile-saver-title">
                <strong>{mobileSaverTitle || 'FLASH'}</strong>
                <small>Sauvegarde mobile : touche une image pour ouvrir le menu et choisir “Enregistrer l image”.</small>
              </div>
              <button className="btn-delete" type="button" onClick={closeMobileSaver}>
                <X size={16} />
              </button>
            </div>

            <div className="toolbar mobile-saver-toolbar">
              <button className="btn-secondary" type="button" onClick={shareMobileSaverAll} disabled={mobileSaverActiveFileId === '__all__'}>
                <Share size={16} />
                <span>{mobileSaverActiveFileId === '__all__' ? 'Preparation...' : 'Partager tout'}</span>
              </button>
            </div>

            <div className="mobile-saver-grid">
              {mobileSaverItems.flatMap((item) => item.files.map((file, index) => {
                const id = `${item.folderName}-${file.fileName}-${index}`;
                const mergedName = mobileSaverItems.length > 1 ? `${item.folderName}-${file.fileName}` : file.fileName;
                return (
                  <button
                    key={id}
                    type="button"
                    className="mobile-saver-item"
                    onClick={() => downloadMobileSaverFile({ id, url: file.url, fileName: mergedName })}
                    disabled={mobileSaverActiveFileId === id}
                  >
                    <div className="mobile-saver-thumb">
                      <img src={file.url} alt={file.fileName} />
                    </div>
                    <div className="mobile-saver-meta">
                      <span>{file.fileName}</span>
                      {mobileSaverActiveFileId === id && <small>Preparation...</small>}
                    </div>
                  </button>
                );
              }))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
