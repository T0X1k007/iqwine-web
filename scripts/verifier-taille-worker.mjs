#!/usr/bin/env node
/**
 * LE WORKER DOIT TENIR DANS LE PLAN GRATUIT — garde bloquante.
 *
 * ── Ce qu'elle protège ────────────────────────────────────────────────────
 * Cloudflare limite chaque Worker à **3 MiB compressés** sur le plan Free, et
 * à 10 MiB sur le plan Paid (minimum 5 USD par mois pour le compte).
 *
 * Mesuré le 2026-08-03 par `wrangler deploy --dry-run` : **2436,42 KiB**, soit
 * 2,38 MiB. On tient, avec 21 % de marge. Deux mesures consécutives donnent le
 * même octet — c'est une propriété de la construction, pas du bruit.
 *
 * ── Pourquoi une garde, alors qu'on tient ─────────────────────────────────
 * Parce que 21 % de marge, c'est UNE dépendance. Une bibliothèque de dates,
 * un client d'API, un utilitaire ajouté par une ligne d'`import` — et le
 * déploiement échoue en production avec une erreur de taille, ou pire, la
 * décision de passer au plan payant se prend sous la pression d'un incident
 * plutôt qu'à froid.
 *
 * C'est la même logique que le budget d'octets de l'application : la
 * régression la plus fréquente et la plus invisible en revue de code est une
 * dépendance lourde ajoutée sans qu'on la voie.
 *
 * ── Ce que cette garde N'EST PAS ──────────────────────────────────────────
 * Un interdit. Relever le plafond est une décision légitime le jour où une
 * fonction le justifie — et passer au plan payant en est une aussi. Ce qu'il
 * ne faut pas, c'est le découvrir en production.
 *
 * Les ACTIFS ne comptent pas : les 119 fichiers de `public/` passent par le
 * binding `ASSETS`, pas par le Worker. C'est pourquoi 23 Mo d'images
 * n'entrent pas dans ce budget.
 *
 * Usage :  node scripts/verifier-taille-worker.mjs
 *          (exige que `opennextjs-cloudflare build` ait été lancé avant)
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const LIMITE_FREE_KIB = 3 * 1024;
/** Mesuré le 2026-08-03. Sert de repère, pas de seuil. */
const REFERENCE_KIB = 2436.42;
/** On alerte AVANT le mur : à 90 % de la limite, il reste le temps de décider. */
const SEUIL_KIB = LIMITE_FREE_KIB * 0.9;

if (!existsSync('.open-next/worker.js')) {
  console.error('✗ `.open-next` absent — lancer `opennextjs-cloudflare build` avant.');
  process.exit(1);
}

let sortie;
try {
  sortie = execFileSync(
    'npx',
    ['wrangler', 'deploy', '--dry-run', '--outdir=/tmp/verif-taille-worker'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 300_000 },
  );
} catch (err) {
  console.error('✗ `wrangler deploy --dry-run` a échoué :');
  console.error(String(err.stdout ?? '') + String(err.stderr ?? ''));
  process.exit(1);
}

const m = sortie.match(/gzip:\s*([\d.]+)\s*KiB/);
if (!m) {
  console.error('✗ taille introuvable dans la sortie de wrangler. Sortie brute :');
  console.error(sortie);
  process.exit(1);
}

const kib = Number(m[1]);
const pct = ((kib / LIMITE_FREE_KIB) * 100).toFixed(0);
const delta = kib - REFERENCE_KIB;

console.log(`  Worker compressé : ${kib.toFixed(2)} KiB  (${(kib / 1024).toFixed(2)} MiB)`);
console.log(`  Limite plan Free : ${LIMITE_FREE_KIB} KiB  →  ${pct} % consommés`);
console.log(
  `  Référence 2026-08-03 : ${REFERENCE_KIB} KiB  ` +
    `(${delta >= 0 ? '+' : ''}${delta.toFixed(0)} KiB)`,
);

if (kib > LIMITE_FREE_KIB) {
  console.error(
    `\n✗ DÉPASSEMENT — ${kib.toFixed(0)} KiB > ${LIMITE_FREE_KIB} KiB.\n` +
      '  Le déploiement échouera sur le plan Free. Deux issues : retirer ce qui\n' +
      '  a grossi, ou passer au plan Paid (10 MiB, 5 USD/mois). Regarder CE QUI\n' +
      "  a grossi avant de choisir — c'est presque toujours une dépendance.",
  );
  process.exit(1);
}

if (kib > SEUIL_KIB) {
  console.error(
    `\n✗ MARGE ÉPUISÉE — ${pct} % de la limite du plan Free.\n` +
      "  On ne dépasse pas encore, mais il ne reste plus de place pour une\n" +
      '  dépendance. Décider maintenant, à froid, plutôt que sous la pression\n' +
      "  d'un déploiement bloqué.",
  );
  process.exit(1);
}

console.log(`\n✓ Tient dans le plan gratuit — ${(LIMITE_FREE_KIB - kib).toFixed(0)} KiB de marge.`);
