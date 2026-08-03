#!/usr/bin/env node
/**
 * SOUMETTRE LES URL À INDEXNOW — après une migration d'adresses.
 *
 * ── À quoi ça sert, et quand ──────────────────────────────────────────────
 * Un sitemap est lu quand le moteur passe. IndexNow, lui, est un signal
 * POUSSÉ : Bing, Yandex et quelques autres reçoivent la liste immédiatement.
 * Sur une migration d'URL, cette différence compte — les anciennes adresses
 * restent servies en 301 et continuent d'être visitées tant que l'index n'a pas
 * été mis à jour.
 *
 * On soumet les DEUX : les nouvelles adresses (pour qu'elles soient
 * découvertes) et les anciennes (pour que le 301 soit vu et l'index remplacé).
 * Ne soumettre que les nouvelles laisserait les anciennes vivre dans l'index
 * jusqu'au prochain passage naturel.
 *
 * ── Google n'est pas concerné ─────────────────────────────────────────────
 * Google ne participe pas à IndexNow. Pour lui, le sitemap mis à jour dans la
 * Search Console est le canal — un geste humain, dans une console.
 *
 * ── Ce que ce script ne fait jamais ───────────────────────────────────────
 * Il n'affiche pas la clé. Elle vient de l'environnement, elle est envoyée à
 * l'API, et elle n'apparaît ni dans la sortie ni dans un journal.
 *
 * Usage :  INDEXNOW_KEY=… node scripts/soumettre-indexnow.mjs [--essai]
 *          `--essai` affiche ce qui serait envoyé, sans rien envoyer.
 */

import { SEGMENTS } from '../src/lib/locale.ts';

const ESSAI = process.argv.includes('--essai');
const HOTE = 'iqwine.ai';
const ORIGINE = `https://${HOTE}`;
const CLE = process.env.INDEXNOW_KEY;

if (!CLE && !ESSAI) {
  console.error('✗ INDEXNOW_KEY absente. Elle est posée sur Vercel ; pour un envoi');
  console.error('  local, l’exporter dans le shell — jamais l’écrire dans un fichier.');
  process.exit(1);
}

/**
 * La liste, dérivée de la MÊME table que les routes.
 *
 * Écrire les URL à la main ici, c'est garantir qu'un jour on ajoutera une page
 * sans penser à ce fichier — et qu'elle ne sera jamais soumise.
 */
const urls = [`${ORIGINE}/fr`, `${ORIGINE}/en`];
for (const [dossier, slugs] of Object.entries(SEGMENTS)) {
  // `/beta` est HORS sitemap par décision — « page d'atterrissage à diffusion
  // contrôlée, pas une destination d'acquisition ». La pousser à IndexNow
  // reviendrait à la faire indexer par une autre porte, et à contredire cette
  // décision sans que personne ne s'en aperçoive.
  if (dossier === 'beta') continue;
  urls.push(`${ORIGINE}/fr/${slugs.fr}`);
  urls.push(`${ORIGINE}/en/${slugs.en}`);
  // L'ANCIENNE adresse anglaise, quand elle a changé : c'est elle qui doit être
  // revisitée pour que son 301 soit constaté et l'index remplacé.
  if (slugs.en !== dossier) urls.push(`${ORIGINE}/en/${dossier}`);
}

console.log(`→ ${urls.length} URL pour ${HOTE}`);
for (const u of urls) console.log(`    ${u}`);

if (ESSAI) {
  console.log('\n(--essai : rien n’a été envoyé)');
  process.exit(0);
}

// Échéance dure : une API tierce qui ne répond pas ne doit pas figer un
// enchaînement de déploiement. 124 est la convention `timeout`.
const echeance = setTimeout(() => {
  console.error('\n✗ IndexNow n’a pas répondu en 30 s.');
  process.exit(124);
}, 30_000);
echeance.unref();

const reponse = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOTE,
    key: CLE,
    keyLocation: `${ORIGINE}/${CLE}.txt`,
    urlList: urls,
  }),
});

clearTimeout(echeance);

// 200 et 202 valent acceptation ; 202 signifie « reçu, clé en cours de
// validation ». 403 = clé introuvable à `keyLocation`, 422 = URL hors du
// domaine déclaré. On distingue, parce que « échec » ne dirait pas quoi faire.
const explication = {
  200: 'accepté',
  202: 'accepté — clé en cours de validation',
  400: 'requête mal formée',
  403: 'clé refusée : vérifier qu’elle est bien servie à keyLocation',
  422: 'une URL n’appartient pas au domaine déclaré',
  429: 'trop de soumissions — réessayer plus tard',
};

const detail = explication[reponse.status] ?? 'réponse inattendue';
console.log(`\n${reponse.status < 300 ? '✓' : '✗'} IndexNow : ${reponse.status} — ${detail}`);
process.exit(reponse.status < 300 ? 0 : 1);
