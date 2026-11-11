#!/usr/bin/env node
/**
 * CONSTRUIRE LE SITE POUR CLOUDFLARE : un export statique dans `out/`.
 *
 * ── Pourquoi un export, et pas Next sur un Worker ─────────────────────────
 * En août, le serveur Next entier tournait dans un Worker (OpenNext) : chaque
 * requête consommait 20 à 100 ms de processeur, contre 10 permises sur le plan
 * gratuit (`docs/decision-cloudflare.md`). Or toutes les pages du site sont
 * prérendues. Servies comme fichiers, elles ne consomment AUCUN temps de
 * Worker. Seuls restent du code : la négociation de langue, le relais du
 * formulaire de contact et la clé IndexNow, quelques lignes réécrites dans
 * `cloudflare/worker.ts`, loin sous la limite.
 *
 * ── Ce que fait ce script ─────────────────────────────────────────────────
 * 1. Met de côté ce qu'un export refuse (middleware, routes `/api`), construit
 *    avec `CIBLE_HEBERGEMENT=cloudflare`, puis remet tout en place, même en cas
 *    d'échec : le dépôt sort de là tel qu'il y est entré.
 * 2. Place les pages anglaises à leur slug public (`/en/pricing`), ce que
 *    Vercel obtenait par réécriture.
 * 3. Écrit `_headers` et `_redirects` depuis `lib/regles-de-bord`, la source
 *    que lit aussi `next.config.ts`.
 *
 * Usage :  npm run build:cloudflare
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SLUGS_ANGLAIS, enTetesDeSecurite, redirectionsPermanentes } from '../src/lib/regles-de-bord.ts';

const RACINE = new URL('..', import.meta.url).pathname;
const OUT = join(RACINE, 'out');

/**
 * LES VALEURS PUBLIQUES DE `.env.production` VALENT AUSSI POUR `_headers` (2026-11-11).
 *
 * Next lit `.env.production` dans le processus qui construit les pages, pas dans celui-ci :
 * la balise de mesure partait dans le HTML, mais la CSP de `_headers`, calculée ici, ne
 * voyait pas le jeton et aurait bloqué la balise. On recopie donc ce fichier dans
 * l'environnement de ce script, sans jamais remplacer une variable déjà posée (une
 * variable de build Cloudflare garde la priorité, comme sous Next).
 */
function chargerEnvProduction() {
  const fichier = join(RACINE, '.env.production');
  if (!existsSync(fichier)) return;
  for (const ligne of readFileSync(fichier, 'utf8').split('\n')) {
    const m = ligne.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}
chargerEnvProduction();

// ── 1. Construire, avec les fichiers serveur mis de côté ─────────────────────
const aPart = mkdtempSync(join(tmpdir(), 'iqwine-cloudflare-'));
const deplaces = [
  [join(RACINE, 'src/middleware.ts'), join(aPart, 'middleware.ts')],
  [join(RACINE, 'src/app/api'), join(aPart, 'api')],
];

let code = 1;
try {
  for (const [de, vers] of deplaces) renameSync(de, vers);
  rmSync(OUT, { recursive: true, force: true });
  const build = spawnSync('npx', ['next', 'build'], {
    cwd: RACINE,
    stdio: 'inherit',
    env: { ...process.env, CIBLE_HEBERGEMENT: 'cloudflare' },
  });
  code = build.status ?? 1;
} finally {
  for (const [de, vers] of deplaces) if (existsSync(vers)) renameSync(vers, de);
  rmSync(aPart, { recursive: true, force: true });
}
if (code !== 0) process.exit(code);

// ── 2. Les pages anglaises à leur slug public ───────────────────────────────
// Le fichier HTML, son RSC (`.txt`, lu par la navigation côté client) et le
// dossier des segments préchargés. Les anciennes adresses ne sont pas gardées :
// `_redirects` les envoie en 308 vers le slug public, comme sur Vercel.
for (const { dossier, en } of SLUGS_ANGLAIS) {
  for (const suffixe of ['.html', '.txt', '']) {
    const de = join(OUT, 'en', dossier + suffixe);
    if (!existsSync(de)) continue;
    const vers = join(OUT, 'en', en + suffixe);
    cpSync(de, vers, { recursive: true });
    rmSync(de, { recursive: true, force: true });
  }
}

// ── 3. `_headers` et `_redirects` ──────────────────────────────────────────
const securite = enTetesDeSecurite(false)
  .map(({ key, value }) => `  ${key}: ${value}`)
  .join('\n');

const enTetes = [
  '/*',
  securite,
  '',
  // Les fichiers de `_next/static` portent une empreinte dans leur nom.
  '/_next/static/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
  // Polices du dépôt (`app/polices.css`) : un nom stable, un an de cache. Un
  // jour où un fichier change, il change aussi de nom.
  '/polices/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
  // Les images de partage n'ont pas d'extension : sans type déclaré, elles
  // seraient servies comme un fichier binaire quelconque.
  ...['fr', 'en'].flatMap((l) => [
    `/${l}/opengraph-image`,
    '  Content-Type: image/png',
    `/${l}/twitter-image`,
    '  Content-Type: image/png',
  ]),
  // Le même type que la route Next sur Vercel.
  '/llms.txt',
  '  Content-Type: text/markdown; charset=utf-8',
  '',
].join('\n');
writeFileSync(join(OUT, '_headers'), enTetes);

const redirections = redirectionsPermanentes()
  .map(({ source, destination }) => `${source} ${destination} 308`)
  .join('\n');
writeFileSync(join(OUT, '_redirects'), redirections + '\n');

console.log(`\n✓ Export Cloudflare prêt dans out/ (${SLUGS_ANGLAIS.length} slugs anglais placés).`);
