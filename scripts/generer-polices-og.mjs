#!/usr/bin/env node
/**
 * GÉNÈRE `src/app/_og-fonts/polices.ts` À PARTIR DES FICHIERS `.woff`.
 *
 * ── Pourquoi embarquer les polices plutôt que les lire ────────────────────
 * L'image Open Graph est dessinée par Satori, qui ne lit pas `next/font` : il
 * faut lui fournir les octets. Trois façons de les obtenir, et deux ne
 * marchent pas partout :
 *
 *   · `readFileSync` — fonctionne sous Node, **impossible sous Cloudflare
 *     Workers** : il n'y a pas de système de fichiers. Et l'appel étant au
 *     niveau module, le fichier ne peut même pas être IMPORTÉ dans ce runtime,
 *     que la route s'exécute ou non ;
 *   · `fetch(new URL(…, import.meta.url))` — la solution habituellement
 *     recommandée, mais elle casse en développement : `import.meta.url` désigne
 *     alors un chemin `file://`, que le `fetch` de Node ne sait pas ouvrir.
 *     L'en-tête du module le disait déjà — « pas de fetch(URL) qui casse en
 *     dev » — c'est une leçon déjà payée, on ne la repaie pas ;
 *   · **embarquer les octets en base64** — aucun système de fichiers, aucun
 *     réseau, identique dans les deux runtimes. C'est ce que fait ce script.
 *
 * ── Le coût, mesuré ──────────────────────────────────────────────────────
 * 82 Ko de WOFF → environ 107 Ko de base64, chargés uniquement par la route
 * Open Graph — qui est PRÉRENDUE à la construction. Aucun visiteur ne
 * télécharge ces octets ; ils ne servent qu'à fabriquer un PNG une fois.
 *
 * ── Les `.woff` restent la source de vérité ──────────────────────────────
 * Le module généré est commité pour que la construction n'ait pas d'étape
 * supplémentaire, mais on ne l'édite jamais à la main : on remplace le `.woff`
 * et on relance ce script.
 *
 * Usage :  node scripts/generer-polices-og.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER = join(RACINE, 'src/app/_og-fonts');

const fichiers = readdirSync(DOSSIER)
  .filter((f) => f.endsWith('.woff'))
  .sort();

if (fichiers.length === 0) {
  console.error(`✗ aucun .woff dans ${DOSSIER}`);
  process.exit(1);
}

/** `cormorant-500italic.woff` → `CORMORANT_500ITALIC` */
const nomConstante = (f) => f.replace(/\.woff$/, '').replace(/[^a-z0-9]/gi, '_').toUpperCase();

const lignes = [
  '// ⚠ FICHIER GÉNÉRÉ — ne pas éditer à la main.',
  '//',
  '// Source : les `.woff` de ce dossier. Régénérer avec :',
  '//     node scripts/generer-polices-og.mjs',
  '//',
  '// Les octets sont embarqués en base64 pour que le module fonctionne SANS',
  '// système de fichiers — condition nécessaire sous Cloudflare Workers, où',
  "// `readFileSync` n'existe pas et où un appel au niveau module empêcherait",
  "// jusqu'à l'import du fichier. Cf. l'en-tête du script pour les deux autres",
  '// approches et pourquoi elles ne tiennent pas.',
  '',
  '/**',
  " * Décode le base64 en octets, dans les DEUX runtimes.",
  ' *',
  ' * `atob` est disponible sous Node depuis la version 16 et fait partie du',
  " * socle des Workers : c'est le seul décodeur qui ne demande ni `Buffer`",
  ' * (absent des Workers sans `nodejs_compat`) ni dépendance.',
  ' */',
  'function octets(b64: string): ArrayBuffer {',
  '  const binaire = atob(b64);',
  '  const tampon = new Uint8Array(binaire.length);',
  '  for (let i = 0; i < binaire.length; i += 1) tampon[i] = binaire.charCodeAt(i);',
  '  return tampon.buffer;',
  '}',
  '',
];

for (const f of fichiers) {
  const b64 = readFileSync(join(DOSSIER, f)).toString('base64');
  lignes.push(`export const ${nomConstante(f)} = octets(`);
  // Découpé en morceaux : une seule ligne de 45 000 caractères rend le fichier
  // illisible dans un diff et fait ramer les éditeurs.
  for (let i = 0; i < b64.length; i += 120) {
    lignes.push(`  '${b64.slice(i, i + 120)}' +`);
  }
  lignes[lignes.length - 1] = lignes[lignes.length - 1].replace(/ \+$/, '');
  lignes.push(');');
  lignes.push('');
}

const sortie = join(DOSSIER, 'polices.ts');
writeFileSync(sortie, lignes.join('\n'));

const octetsTotal = fichiers.reduce((s, f) => s + readFileSync(join(DOSSIER, f)).length, 0);
console.log(`✓ ${sortie}`);
console.log(
  `  ${fichiers.length} polices · ${(octetsTotal / 1024).toFixed(0)} Ko de WOFF ` +
    `→ ${(readFileSync(sortie).length / 1024).toFixed(0)} Ko de module`,
);
