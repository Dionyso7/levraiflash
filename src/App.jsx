import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Camera,
  X,
  Zap,
  Download,
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

const API = '/api';
const CLIENT_ID_KEY = 'flash_client_id';

const THEME_META = {
  commerce: { icon: ShoppingBag, color: '#3B82F6', label: 'Commerce' },
  social: { icon: Share, color: '#EC4899', label: 'Social' },
  editorial: { icon: Sun, color: '#F59E0B', label: 'Editorial' },
  premium: { icon: Crown, color: '#8B5CF6', label: 'Premium' },
  outdoor: { icon: TreePine, color: '#10B981', label: 'Outdoor' },
  custom: { icon: Sparkles, color: '#6B7280', label: 'Custom' },
};

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
  return {
    id: overrides.id || crypto.randomUUID(),
    name: overrides.name || 'Nouvelle variante',
    promptAddon: overrides.promptAddon || '',
    aspectRatio: overrides.aspectRatio || '1:1',
    enabledByDefault: overrides.enabledByDefault ?? true,
    isMaster: overrides.isMaster ?? false,
    sourceMode: overrides.isMaster ? 'source' : (overrides.sourceMode || 'master'),
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
      sourceMode: isMaster ? 'source' : (variant.sourceMode || 'master'),
    };
  });
}

function getMasterVariant(preset, selectedIds) {
  const selectedVariants = preset.variants.filter((variant) => selectedIds.includes(variant.id));
  if (selectedVariants.length === 0) return null;
  return selectedVariants.find((variant) => variant.isMaster) || selectedVariants[0];
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

export default function App() {
  const [step, setStep] = useState('capture');
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [editingPreset, setEditingPreset] = useState(null);
  const [selectedVariantIds, setSelectedVariantIds] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState([]);
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
  const clientIdRef = useRef(getClientId());

  const selectedPreset = useMemo(
    () => presets.find((preset) => preset.id === selectedPresetId) || null,
    [presets, selectedPresetId],
  );
  const presetNameMap = useMemo(
    () => Object.fromEntries(presets.map((preset) => [preset.id, preset.name])),
    [presets],
  );

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/history?clientId=${encodeURIComponent(clientIdRef.current)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible de charger l'historique");
      }

      setHistory(Array.isArray(data) ? data : []);
    } catch {
      setHistory([]);
    }
  }, []);

  const loadPresets = useCallback(async () => {
    setLoadingPresets(true);
    try {
      const res = await fetch(`${API}/presets?clientId=${encodeURIComponent(clientIdRef.current)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Impossible de charger les presets');
      }

      const nextPresets = Array.isArray(data) ? data.map(normalizePreset) : [];
      setPresets(nextPresets);
      setSelectedPresetId((currentId) => {
        if (currentId && nextPresets.some((preset) => preset.id === currentId)) {
          return currentId;
        }

        return nextPresets[0]?.id || null;
      });
    } catch (err) {
      setError(err.message);
      setPresets([]);
    } finally {
      setLoadingPresets(false);
    }
  }, []);

  useEffect(() => {
    loadPresets();
    loadHistory();
  }, [loadHistory, loadPresets]);

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

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      setError("Impossible d'accéder à la caméra");
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
      setPhoto(URL.createObjectURL(blob));
      setPhotoFile(new File([blob], 'product.jpg', { type: 'image/jpeg' }));
      stopCamera();
      setStep('preset');
    }, 'image/jpeg', 0.92);
  }, [stopCamera]);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    setPhotoFile(file);
    setStep('preset');
  }, []);

  const persistHistoryEntry = useCallback(async (entry) => {
    const res = await fetch(`${API}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: clientIdRef.current,
        entry,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Impossible d'enregistrer l'historique");
    }

    return data;
  }, []);

  const pollTask = useCallback((taskId, { onProgress } = {}) => new Promise((resolve, reject) => {
    let attempts = 0;

    const poll = async () => {
      if (attempts >= 120) {
        reject(new Error('Timeout — génération trop longue'));
        return;
      }

      try {
        const res = await fetch(`${API}/status?taskId=${encodeURIComponent(taskId)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Erreur de génération');
        }

        if (data.status === 'done') {
          onProgress?.(1);
          resolve(Array.isArray(data.images) ? data.images : []);
          return;
        }

        if (data.status === 'failed') {
          reject(new Error('Échec de la génération. Réessaye.'));
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

  const generate = useCallback(async () => {
    if (!photoFile || !selectedPreset || selectedVariantIds.length === 0) return;

    const variants = selectedPreset.variants.filter((variant) => selectedVariantIds.includes(variant.id));
    const masterVariant = getMasterVariant(selectedPreset, selectedVariantIds);

    if (variants.length === 0 || !masterVariant) {
      setError('Choisis au moins une variante à générer');
      return;
    }

    setGenerating(true);
    setError(null);
    setProgress(5);
    setCurrentVariantName('');

    try {
      const imageBase64 = await toBase64(photoFile);
      const sessionId = crypto.randomUUID();
      const nextAssets = [];
      const secondaryVariants = variants.filter((variant) => variant.id !== masterVariant.id);

      setCurrentVariantName(`Master · ${masterVariant.name}`);

      const masterRes = await fetch(`${API}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preset: selectedPreset,
          variant: { ...masterVariant, sourceMode: 'source' },
          imageBase64,
        }),
      });

      const masterData = await masterRes.json();
      if (!masterRes.ok || masterData.error) {
        throw new Error(masterData.error || 'Erreur de génération du master');
      }

      const sourceImageUrl = masterData.sourceImageUrl;
      const masterUrls = await pollTask(masterData.taskId, {
        onProgress: (ratio) => {
          setProgress(Math.max(5, Math.round(5 + ratio * (secondaryVariants.length ? 30 : 95))));
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
        throw new Error("Le master asset n'a renvoyé aucune image");
      }

      if (secondaryVariants.length > 0) {
        setCurrentVariantName('Variantes en parallèle');
        const progressMap = Object.fromEntries(secondaryVariants.map((variant) => [variant.id, 0]));
        const updateParallelProgress = () => {
          const average = Object.values(progressMap).reduce((sum, value) => sum + value, 0) / secondaryVariants.length;
          setProgress(Math.max(35, Math.round(35 + average * 65)));
        };

        const secondaryResults = await Promise.allSettled(
          secondaryVariants.map(async (variant) => {
            const inputImageUrl = variant.sourceMode === 'source' ? sourceImageUrl : masterImageUrl;
            const res = await fetch(`${API}/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                preset: selectedPreset,
                variant,
                inputImageUrl,
              }),
            });
            const data = await res.json();

            if (!res.ok || data.error) {
              throw new Error(data.error || `Erreur sur ${variant.name}`);
            }

            const urls = await pollTask(data.taskId, {
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
          throw new Error(failed[0] || 'Toutes les variantes secondaires ont échoué');
        }

        if (failed.length > 0) {
          setError(`Certaines variantes ont échoué : ${failed.join(', ')}`);
        }
      }

      const entry = {
        taskId: sessionId,
        presetId: selectedPreset.id,
        presetName: selectedPreset.name,
        images: nextAssets,
      };

      await persistHistoryEntry(entry);
      setResults(nextAssets);
      setStep('results');
      setProgress(100);
      await loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
      setCurrentVariantName('');
    }
  }, [photoFile, selectedPreset, selectedVariantIds, persistHistoryEntry, pollTask, loadHistory]);

  const reset = useCallback(() => {
    setStep('capture');
    setPhoto(null);
    setPhotoFile(null);
    setResults([]);
    setError(null);
    setProgress(0);
    setGenerating(false);
    setShowHistory(false);
    setCurrentVariantName('');
    stopCamera();
  }, [stopCamera]);

  const deleteHistory = async (taskId) => {
    try {
      const params = new URLSearchParams({
        taskId,
        clientId: clientIdRef.current,
      });
      const res = await fetch(`${API}/history?${params.toString()}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Impossible de supprimer l'historique");
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
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Impossible de sauvegarder le preset');
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
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Impossible de supprimer le preset');
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
    setResults(normalizeAssets(item.images));
    setSelectedPresetId(item.presetId);
    setShowHistory(false);
    setStep('results');
  };

  const currentPresetForDisplay = editingPreset || selectedPreset;

  return (
    <div className="app">
      <header className="header">
        {(step !== 'capture' || showHistory) && (
          <button className="btn-back" onClick={() => {
            if (showHistory) setShowHistory(false);
            else if (editingPreset) setEditingPreset(null);
            else if (step === 'results') reset();
            else { stopCamera(); setStep('capture'); }
          }}>
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
            <button className="btn-back" onClick={reset}><RotateCcw size={17} /></button>
          )}
        </div>
      </header>

      {error && (
        <div className="toast">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {/* === HISTORY === */}
      {showHistory && (
        <div className="screen">
          <h2 className="section-title"><Clock size={16} /> Historique</h2>
          {history.length === 0 ? (
            <p className="empty-msg">Aucune génération pour l'instant</p>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item.taskId} className="history-card" onClick={() => viewHistoryItem(item)}>
                  <div className="history-thumb">
                    <img src={item.images[0]?.url} alt="" />
                  </div>
                  <div className="history-info">
                    <strong>{item.presetName || presetNameMap[item.presetId] || item.presetId}</strong>
                    <small>{formatDate(item.date)} · {item.images.length} asset{item.images.length > 1 ? 's' : ''}</small>
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

      {/* === CAPTURE === */}
      {step === 'capture' && !showHistory && (
        <div className="screen">
          <div className="page-intro">
            <h2 className="section-title"><Camera size={16} /> Capture produit</h2>
            <p className="section-copy">Prends une photo propre puis passe sur tes presets de shooting pour lancer une serie complete.</p>
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
              <Layers3 size={18} />
              <span>Bibliotheque presets</span>
            </button>
            <button className="btn-secondary wide" onClick={() => { loadHistory(); setShowHistory(true); }}>
              <Clock size={18} />
              <span>Sessions recentes</span>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} hidden />
        </div>
      )}

      {/* === PRESET === */}
      {step === 'preset' && (
        <div className="screen">
          <div className="page-intro">
            <h2 className="section-title"><SlidersHorizontal size={16} /> Presets de shooting</h2>
            <p className="section-copy">Construis des recettes de shooting réutilisables avec plusieurs variantes automatiques.</p>
          </div>

          <div className="preview-card">
            {photo ? (
              <div className="preview-thumb"><img src={photo} alt="Produit" /></div>
            ) : (
              <div className="preview-empty">
                <Image size={28} />
                <p>Ajoute une photo pour lancer les variantes. Tu peux quand meme créer et éditer tes presets maintenant.</p>
              </div>
            )}
          </div>

          <div className="toolbar">
            <button className="btn-secondary" onClick={startNewPreset}>
              <Plus size={16} />
              <span>Nouveau</span>
            </button>
            <button className="btn-secondary" onClick={startEditPreset} disabled={!selectedPreset || Boolean(editingPreset)}>
              <Pencil size={16} />
              <span>Modifier</span>
            </button>
            <button className="btn-secondary" onClick={duplicatePreset} disabled={!selectedPreset}>
              <Copy size={16} />
              <span>Dupliquer</span>
            </button>
            <button className="btn-secondary danger" onClick={removePreset} disabled={!selectedPreset || Boolean(editingPreset)}>
              <Trash2 size={16} />
              <span>Supprimer</span>
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
                {editingPreset.variants.map((variant) => (
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
                      <label className="field">
                        <span>Source de génération</span>
                        <select
                          value={variant.sourceMode}
                          disabled={variant.isMaster}
                          onChange={(e) => updateEditingVariant(variant.id, 'sourceMode', e.target.value)}
                        >
                          <option value="master">Depuis le master</option>
                          <option value="source">Depuis la photo source</option>
                        </select>
                      </label>
                      <label className="checkbox-row master-row">
                        <input
                          type="checkbox"
                          checked={variant.isMaster}
                          onChange={(e) => updateEditingVariant(variant.id, 'isMaster', e.target.checked)}
                        />
                        <span>Vue maître</span>
                      </label>
                    </div>
                    <label className="field">
                      <span>Consigne additionnelle</span>
                      <textarea rows={3} value={variant.promptAddon} onChange={(e) => updateEditingVariant(variant.id, 'promptAddon', e.target.value)} />
                    </label>
                    <div className="variant-actions">
                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={variant.enabledByDefault}
                          onChange={(e) => updateEditingVariant(variant.id, 'enabledByDefault', e.target.checked)}
                        />
                        <span>Active par défaut</span>
                      </label>
                      <button className="btn-delete inline" onClick={() => removeVariant(variant.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
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
                  <p>{currentPresetForDisplay.description || 'Preset prêt pour une production réutilisable.'}</p>
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
                  <p>{currentPresetForDisplay.aspectRatio} · {currentPresetForDisplay.resolution} · {currentPresetForDisplay.outputFormat.toUpperCase()}</p>
                </div>
              </div>

              <div className="variants-head">
                <h3>Variantes à produire</h3>
                <span className="subtle">{selectedVariantIds.length} sélectionnée{selectedVariantIds.length > 1 ? 's' : ''}</span>
              </div>
              <div className="variant-list">
                {currentPresetForDisplay.variants.map((variant) => {
                  const checked = selectedVariantIds.includes(variant.id);
                  return (
                    <button key={variant.id} className={`variant-select ${checked ? 'active' : ''}`} onClick={() => toggleVariantSelection(variant.id)}>
                      <div className="variant-check">
                        {checked ? <CheckSquare size={18} /> : <Square size={18} />}
                      </div>
                      <div className="variant-content">
                        <strong>{variant.name}</strong>
                        <small>
                          {variant.isMaster
                            ? 'Vue maître générée depuis la photo source'
                            : `${variant.sourceMode === 'source' ? 'Source : photo d’origine' : 'Source : master asset'} · ${variant.promptAddon || 'Aucune consigne additionnelle'}`}
                        </small>
                      </div>
                      <span className="variant-ratio">{variant.aspectRatio}</span>
                    </button>
                  );
                })}
              </div>

              <button className="btn-main" disabled={!photoFile || generating || selectedVariantIds.length === 0} onClick={generate}>
                {generating ? (
                  <><span className="spinner" />Génération {currentVariantName ? `· ${currentVariantName}` : ''} · {Math.round(progress)}%</>
                ) : (
                  <><Sparkles size={18} />Générer la série</>
                )}
              </button>
              {!photoFile && <p className="helper-text">Ajoute d'abord une photo pour lancer ce preset.</p>}
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

      {/* === RESULTS === */}
      {step === 'results' && (
        <div className="screen">
          <div className="page-intro">
            <h2 className="section-title"><Sparkles size={16} /> Résultats</h2>
            <p className="section-copy">Assets produits avec le preset sélectionné, prêts à être téléchargés ou rejoués.</p>
          </div>
          <div className="gallery">
            {results.map((asset, i) => (
              <div key={asset.id || i} className="gallery-item">
                <img src={asset.url} alt={asset.label || `Résultat ${i + 1}`} />
                <div className="gallery-meta">
                  <strong>{asset.label || `Résultat ${i + 1}`}</strong>
                </div>
                <a href={asset.url} download={`flash-${selectedPresetId || 'preset'}-${i + 1}.png`} className="btn-dl">
                  <Download size={16} />
                </a>
              </div>
            ))}
          </div>
          <button className="btn-main" onClick={reset}>
            <RotateCcw size={18} />Nouvelle session
          </button>
        </div>
      )}
    </div>
  );
}
