#!/usr/bin/env node
/**
 * PRÉ-CONVERTIT LES CAPTURES EN AVIF ET WEBP — une fois, à la source.
 *
 * ── Pourquoi, et pourquoi c'est MIEUX que l'optimisation à la volée ───────
 * Sur Cloudflare Workers, `next/image` exige Cloudflare Images, un produit
 * facturé à l'image livrée. Or toutes les images de ce site sont connues à la
 * construction — aucune ne vient d'un utilisateur.
 *
 * ⚠ Le premier recensement en annonçait QUATRE. Il n'en voyait que quatre :
 * il cherchait les `src="…"` littéraux et ratait tout ce qui vit dans un
 * tableau de données — dont les HUIT photos de bouteilles, à ~700 Ko pièce.
 * Le compte réel est de quinze images pour 7,8 Mo. Chercher une chaîne dans du
 * code n'est pas la même chose qu'inventorier ce que le code utilise.
 *
 * L'optimisation à l'exécution existe pour des images nombreuses ou fournies
 * par l'utilisateur. Ici elle ferait payer — en argent, et en latence : le
 * PREMIER visiteur d'une taille donnée attend la conversion. Pré-convertir
 * supprime les deux.
 *
 * ── Les tailles viennent de l'AFFICHAGE, pas de la source ────────────────
 * Mesuré dans le code, le 2026-08-03 :
 *
 *   captures de téléphone    →  rendues à 264 px (`ScreenshotFrame`). À 2×, il
 *                               faut ~530 px : leur largeur native (~630)
 *                               suffit, une seule variante.
 *   08-cellier-desktop       →  `sizes="(min-width:1024px) 58vw, 100vw"`.
 *                               Sur un écran de 1920, 58vw ≈ 1114 px ; à 2×,
 *                               ~2230 px. D'où deux variantes, 1487 et 2974.
 *   photos de bouteilles     →  affichées 160×234 dans `DemoPhone`, stockées
 *                               en 1000×1500. On servait NEUF FOIS plus de
 *                               pixels que l'écran n'en montre. 320 px couvre
 *                               le 2× ; ~700 Ko deviennent 7 Ko.
 *
 * Générer plus large que nécessaire, c'est refaire à la main l'erreur qu'on
 * reproche à l'optimiseur : livrer des octets que personne ne regarde.
 *
 * ── Les PNG restent la source de vérité ──────────────────────────────────
 * Ils ne sont ni supprimés ni modifiés. Ils servent de repli ultime dans le
 * `<picture>` et de source à toute régénération.
 *
 * Usage :  node scripts/generer-images.mjs [--verifier]
 *          `--verifier` ne génère rien : il compare et affiche les poids.
 */

import { writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(RACINE, 'public');
const VERIFIER = process.argv.includes('--verifier');

/**
 * Chaque entrée dit : la source, et les largeurs RÉELLEMENT affichées.
 *
 * `qualite` est plus basse en AVIF qu'en WebP à rendu équivalent — c'est la
 * raison d'être du format. Les valeurs viennent d'un compromis mesuré, pas
 * d'un défaut : au-dessus, le gain de poids s'effondre ; en dessous, les
 * dégradés de l'interface sombre se mettent à bander visiblement.
 */
const IMAGES = [
  // Captures de téléphone — rendues à 264 px dans `ScreenshotFrame`, donc
  // ~530 px à 2×. Leur largeur native (~630) couvre déjà ce besoin : une seule
  // variante, sans agrandissement.
  { source: 'screenshots/01-fiche-vin.png', largeurs: [640] },
  { source: 'screenshots/02-home-suggestions.png', largeurs: [640] },
  { source: 'screenshots/03-menu-scan.png', largeurs: [640] },
  { source: 'screenshots/04-carnet.png', largeurs: [638] },
  { source: 'screenshots/06-recherche-hors-cave.png', largeurs: [638] },

  // La seule assez grande pour que deux variantes se justifient : `sizes` la
  // demande à 58vw, soit ~1114 px sur un écran de 1920, ~2230 px à 2×.
  { source: 'screenshots/08-cellier-desktop.png', largeurs: [1487, 2974] },

  // ── LES PHOTOS DE BOUTEILLES — le vrai gisement ──────────────────────────
  // Huit fichiers de 1000×1500 pour ~700 Ko chacun, soit 5,4 Mo… affichés à
  // 160×234 dans `DemoPhone`. On servait donc neuf fois plus de pixels que
  // l'écran n'en montre. 320 px couvre le 2×.
  //
  // Elles ont un canal alpha (fond détouré) : AVIF et WebP le gardent, ce qui
  // interdit un repli JPEG mais pas le PNG d'origine.
  { source: 'photos/wines/castello-ama.png', largeurs: [320] },
  { source: 'photos/wines/gimonnet.png', largeurs: [320] },
  { source: 'photos/wines/guigal.png', largeurs: [320] },
  { source: 'photos/wines/masciarelli.png', largeurs: [320] },
  { source: 'photos/wines/pio-cesare.png', largeurs: [320] },
  { source: 'photos/wines/ragotiere.png', largeurs: [320] },
  { source: 'photos/wines/trimbach.png', largeurs: [320] },
  { source: 'photos/wines/william-fevre.png', largeurs: [320] },
];

const QUALITE_AVIF = 62;
const QUALITE_WEBP = 82;

const ko = (n) => `${(n / 1024).toFixed(0)} Ko`;

let totalAvant = 0;
let totalApres = 0;

for (const { source, largeurs } of IMAGES) {
  const chemin = join(PUBLIC, source);
  if (!existsSync(chemin)) {
    console.error(`✗ source introuvable : ${source}`);
    process.exit(1);
  }
  const meta = await sharp(chemin).metadata();
  const poidsSource = statSync(chemin).size;
  totalAvant += poidsSource;
  console.log(`\n${source}  ${meta.width}×${meta.height}  ${ko(poidsSource)}`);

  for (const largeur of largeurs) {
    // On ne SUR-échantillonne jamais : agrandir une source, c'est fabriquer des
    // octets sans information.
    const cible = Math.min(largeur, meta.width);
    const suffixe = largeurs.length > 1 ? `-${cible}` : '';
    const base = source.replace(/\.png$/, suffixe);

    for (const [ext, options] of [
      ['avif', { quality: QUALITE_AVIF, effort: 6 }],
      ['webp', { quality: QUALITE_WEBP, effort: 5 }],
    ]) {
      const sortie = join(PUBLIC, `${base}.${ext}`);
      if (!VERIFIER) {
        // Appel de méthode EXPLICITE plutôt qu'un `[ext](…)` en fin de chaîne :
        // après un saut de ligne, JavaScript peut lire `[ext]` comme un accès
        // indexé au résultat précédent et non comme la méthode suivante.
        // `no-unexpected-multiline` a raison de le refuser — c'est ambigu pour
        // le lecteur autant que pour l'analyseur.
        const image = sharp(chemin).resize({ width: cible, withoutEnlargement: true });
        const buf = await (ext === 'avif' ? image.avif(options) : image.webp(options)).toBuffer();
        writeFileSync(sortie, buf);
      }
      if (existsSync(sortie)) {
        const p = statSync(sortie).size;
        if (ext === 'avif') totalApres += p;
        console.log(`   ${String(cible).padStart(5)} px  ${ext.padEnd(4)}  ${ko(p).padStart(8)}`);
      }
    }
  }
}

console.log('\n──────────────────────────────────────────');
console.log(`  PNG sources ......... ${ko(totalAvant)}`);
console.log(`  AVIF livrés ......... ${ko(totalApres)}`);
if (totalAvant > 0) {
  console.log(`  ► ${(100 - (totalApres / totalAvant) * 100).toFixed(0)} % d'octets en moins`);
}
console.log(
  '\n  Les PNG restent en place : repli ultime du <picture>, et source de\n' +
    '  toute régénération. Ils ne sont jamais servis à un navigateur moderne.',
);
