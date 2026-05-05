# FLASH

Application React + Vite deployable sur Netlify avec :

- génération d'images via les Netlify Functions
- stockage d'historique dans Supabase
- identifiant anonyme par navigateur pour isoler l'historique utilisateur

## Variables d'environnement

Copier `.env.example` vers `.env` puis renseigner :

```bash
KIEAI_API_KEY=...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

## Table Supabase

Créer ou mettre à jour les tables d'historique et de presets avec le script :

```sql
\i supabase/flash_history.sql
```

Ou copier le contenu du fichier `supabase/flash_history.sql` dans l'éditeur SQL de Supabase.

## Développement local

Le projet utilise `netlify dev` pour servir le front Vite et les fonctions `/api`.

```bash
npm install
npm run dev
```

L'application sera disponible via l'URL Netlify locale, généralement `http://localhost:8888`.

## Déploiement Netlify

1. Pousser le projet sur GitHub.
2. Connecter le repo dans Netlify.
3. Configurer les variables d'environnement Netlify :
   - `KIEAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Déployer.

La redirection `/api/*` vers les Netlify Functions est gérée dans `netlify.toml`.

## Architecture

- `src/App.jsx` : front React, upload image, polling de génération, affichage des résultats et de l'historique
- `netlify/functions/generate.js` : upload direct de la photo à KIE puis création d'une tâche à partir d'un preset et d'une variante
- `netlify/functions/status.js` : suivi de tâche KIE
- `netlify/functions/history.js` : lecture, écriture et suppression de l'historique
- `netlify/functions/presets.js` : CRUD des presets de shooting
- `netlify/functions/_shared.js` : helpers partagés KIE AI / Supabase

## Note

Le backend actif passe uniquement par les fonctions serverless de `netlify/functions`.
