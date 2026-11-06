#!/usr/bin/env node
/**
 * SYNCHRONISE les Conditions d'utilisation depuis cellier-vin — la source
 * canonique (lib/legal/legal-meta.ts y porte « SOURCE UNIQUE »).
 *
 * ── Pourquoi ce script existe (audit du 2026-08-14) ───────────────────────
 * Le site portait une DEUXIÈME rédaction manuelle des Conditions, qui avait
 * dérivé dans les deux sens : date d'effet « 9 juin » contre « 8 août »,
 * §12 bêta-testeur absent d'un côté, essai à double barrière absent de
 * l'autre. Deux textes d'un même contrat qui divergent, c'est une
 * contradiction datée sur un document contractuel. Le texte ne vit donc plus
 * qu'à UN endroit : les clés i18n `Legal.terms.*` de cellier-vin. Ici, on ne
 * fait que les recopier dans `src/lib/legal-terms.generated.json` — qui est
 * COMMITTÉ, pour qu'un clone propre du site builde sans le dépôt voisin.
 *
 * Usage :
 *   npm run legal:synchroniser   → régénère src/lib/legal-terms.generated.json
 *   npm run legal:verifier       → code 1 si le fichier committé a dérivé de
 *                                  la source ; sauté proprement (code 0) si le
 *                                  dépôt voisin est absent (clone isolé, CI).
 *   CELLIER_VIN_DIR=<chemin>     → surcharge du chemin du dépôt canonique.
 *
 * La chaîne qualité locale d'avant-déploiement doit inclure `legal:verifier`
 * (même esprit que `verifier:routage` et `images:verifier`). Pas de CI au
 * push pour ça — règle globale d'Eric.
 *
 * Garde-fou supplémentaire : les constantes d'essai du site (lib/trial.ts)
 * doivent égaler celles du produit (lib/billing/plan-catalog.ts de
 * cellier-vin). C'est exactement l'écart « promesse écrite ≠ produit livré »
 * que lib/trial.ts documente ; ici il devient une erreur bloquante.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Un canonique plus vieux que le généré (constante encore absente, clé
// disparue) est une DÉRIVE comme une autre : message net, code 1, pas de trace.
for (const evenement of ['uncaughtException', 'unhandledRejection']) {
  process.on(evenement, (erreur) => {
    console.error(`[legal] échec : ${erreur instanceof Error ? erreur.message : erreur}`);
    process.exit(1);
  });
}

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CELLIER = path.resolve(RACINE, process.env.CELLIER_VIN_DIR ?? '../cellier-vin');
const CIBLE = path.join(RACINE, 'src/lib/legal-terms.generated.json');
const MODE_VERIFIER = process.argv.includes('--verifier');

if (!existsSync(path.join(CELLIER, 'messages/fr.json'))) {
  if (MODE_VERIFIER) {
    console.log(`[legal] dépôt canonique absent (${CELLIER}) — vérification sautée.`);
    process.exit(0);
  }
  console.error(`[legal] impossible de générer : dépôt canonique absent (${CELLIER}).`);
  process.exit(1);
}

/** Lit une constante chaîne `export const NOM = "…"` d'un fichier TS du canonique. */
function constante(fichier, nom) {
  const src = readFileSync(path.join(CELLIER, fichier), 'utf8');
  const m = src.match(new RegExp(`export const ${nom}\\s*=\\s*"([^"]+)"`));
  if (!m) throw new Error(`[legal] ${nom} introuvable dans ${fichier}`);
  return m[1];
}

/** Lit une constante numérique `export const NOM = 42;`. */
function nombre(fichier, nom) {
  const src = readFileSync(path.join(CELLIER, fichier), 'utf8');
  const m = src.match(new RegExp(`export const ${nom}\\s*=\\s*(\\d+)`));
  if (!m) throw new Error(`[legal] ${nom} introuvable dans ${fichier}`);
  return Number(m[1]);
}

/** Propriété chaîne d'un objet littéral (ex. `jurisdiction: "Québec, Canada"`). */
function propriete(fichier, nom) {
  const src = readFileSync(path.join(CELLIER, fichier), 'utf8');
  const m = src.match(new RegExp(`${nom}:\\s*"([^"]+)"`));
  if (!m) throw new Error(`[legal] propriété ${nom} introuvable dans ${fichier}`);
  return m[1];
}

const fr = JSON.parse(readFileSync(path.join(CELLIER, 'messages/fr.json'), 'utf8'));
const en = JSON.parse(readFileSync(path.join(CELLIER, 'messages/en.json'), 'utf8'));

/**
 * Apostrophe typographique pour l'affichage du site : le canonique écrit
 * l'apostrophe droite (convention de ses messages), le site compose en
 * typographie soignée (’) — c'est un point relevé favorablement par l'audit
 * OQLF, on ne régresse pas. Transformation sûre : dans une prose française,
 * toute apostrophe droite est une élision.
 */
const courbe = (s) => s.replace(/'/g, '’');
const frTerms = Object.fromEntries(
  Object.entries(fr.Legal.terms).map(([k, v]) => [k, courbe(v)]),
);
const enTerms = { ...en.Legal.terms };

const clesFr = Object.keys(frTerms).sort();
const clesEn = Object.keys(enTerms).sort();
if (JSON.stringify(clesFr) !== JSON.stringify(clesEn)) {
  console.error('[legal] clés FR et EN asymétriques dans le canonique — corriger cellier-vin d’abord.');
  process.exit(1);
}

// Garde-fou essai : le produit et le site doivent promettre la même règle.
const essaiProduit = {
  days: nombre('lib/billing/plan-catalog.ts', 'TRIAL_DAYS'),
  recos: nombre('lib/billing/plan-catalog.ts', 'TRIAL_AI_RECOMMENDATIONS'),
};
const trialSite = readFileSync(path.join(RACINE, 'src/lib/trial.ts'), 'utf8');
const siteDays = Number(trialSite.match(/export const TRIAL_DAYS\s*=\s*(\d+)/)?.[1]);
const siteRecos = Number(trialSite.match(/export const TRIAL_RECOS\s*=\s*(\d+)/)?.[1]);
if (siteDays !== essaiProduit.days || siteRecos !== essaiProduit.recos) {
  console.error(
    `[legal] règle d'essai divergente : produit ${essaiProduit.days}j/${essaiProduit.recos} recos, ` +
      `site ${siteDays}j/${siteRecos} recos. Aligner src/lib/trial.ts sur plan-catalog.ts.`,
  );
  process.exit(1);
}

/**
 * ── GARDE-FOU GRILLE (audit de visibilité du 2026-11-06) ─────────────────
 * La garde d'essai ci-dessus a laissé passer trois jours de « 12 conseils »
 * parce que personne n'avait relancé `legal:verifier` après le changement de
 * l'app (constat V-01). Elle est restée juste, mais elle ne gardait que
 * l'essai. Les PRIX et les INCLUSIONS de la grille sont la même classe de
 * promesse, recopiée de la même façon dans `src/lib/plans.ts` : ils passent
 * désormais par la même porte.
 *
 * Lecture par expressions régulières, comme le reste de ce script : on lit
 * le TEXTE des deux fichiers TS, on n'exécute rien du dépôt voisin. Le bloc
 * d'un forfait est découpé de sa clé à la fin de son objet ; un champ
 * introuvable est une dérive comme une autre (exception, code 1).
 */
function champsDuBloc(src, debut, fichier) {
  const i = src.indexOf(debut);
  if (i < 0) throw new Error(`bloc « ${debut} » introuvable dans ${fichier}`);
  // Le bloc s'arrête à la première ligne qui ferme l'objet au même niveau
  // (« }, » ou « }; »), ce qui suffit aux deux fichiers lus ici.
  const fin = src.slice(i).search(/\n\s*\}[,;]/);
  const bloc = src.slice(i, fin < 0 ? undefined : i + fin);
  const lire = (nom) => {
    const m = bloc.match(new RegExp(`\\b${nom}:\\s*(-?\\d+)`));
    if (!m) throw new Error(`${nom} introuvable dans le bloc « ${debut} » de ${fichier}`);
    return Number(m[1]);
  };
  return {
    priceMonthlyCents: lire('priceMonthlyCents'),
    priceYearlyCents: lire('priceYearlyCents'),
    includedUsers: lire('includedUsers'),
    monthlyRecommendations: lire('monthlyRecommendations'),
    maxBottles: lire('maxBottles'),
  };
}
{
  const catalogue = readFileSync(path.join(CELLIER, 'lib/billing/plan-catalog.ts'), 'utf8');
  const plansSite = readFileSync(path.join(RACINE, 'src/lib/plans.ts'), 'utf8');
  // Le Gratuit de l'app n'est pas une entrée du catalogue : ses deux limites
  // vivent dans des constantes privées (FREE_BOTTLES, FREE_RECOMMENDATIONS).
  const constPrivee = (nom) => {
    const m = catalogue.match(new RegExp(`const ${nom}\\s*=\\s*(\\d+)`));
    if (!m) throw new Error(`${nom} introuvable dans lib/billing/plan-catalog.ts`);
    return Number(m[1]);
  };
  const paires = [
    // [nom lisible, bloc côté app, bloc côté site]
    ['Passionné (STANDARD)', 'STANDARD: {', 'const STANDARD_PLAN: MarketingPlan = {'],
    ['Premium (PRO)', 'PRO: {', 'const PREMIUM_PLAN: MarketingPlan = {'],
  ];
  const ecarts = [];
  // On ne lit que la grille EN VENTE (PLAN_CATALOG), jamais les retirés.
  const enVente = catalogue.slice(catalogue.indexOf('export const PLAN_CATALOG'));
  for (const [nom, blocApp, blocSite] of paires) {
    const app = champsDuBloc(enVente, blocApp, 'plan-catalog.ts');
    const site = champsDuBloc(plansSite, blocSite, 'src/lib/plans.ts');
    for (const cle of Object.keys(app)) {
      if (app[cle] !== site[cle]) ecarts.push(`${nom}.${cle} : app ${app[cle]}, site ${site[cle]}`);
    }
  }
  const gratuitSite = champsDuBloc(plansSite, 'export const FREE_PLAN = {', 'src/lib/plans.ts');
  const gratuitApp = {
    maxBottles: constPrivee('FREE_BOTTLES'),
    monthlyRecommendations: constPrivee('FREE_RECOMMENDATIONS'),
  };
  for (const cle of Object.keys(gratuitApp)) {
    if (gratuitApp[cle] !== gratuitSite[cle]) {
      ecarts.push(`Gratuit.${cle} : app ${gratuitApp[cle]}, site ${gratuitSite[cle]}`);
    }
  }
  if (ecarts.length > 0) {
    console.error(
      `[legal] grille divergente entre le produit et le site :\n  ${ecarts.join('\n  ')}\n` +
        'Aligner src/lib/plans.ts sur lib/billing/plan-catalog.ts (ou l’inverse, sur décision d’Éric).',
    );
    process.exit(1);
  }
}

const donnees = {
  _avertissement:
    'GÉNÉRÉ par scripts/synchroniser-legal.mjs depuis cellier-vin (source canonique) — ne pas éditer à la main.',
  legalVersion: constante('lib/legal/legal-meta.ts', 'LEGAL_VERSION'),
  effectiveDate: constante('lib/legal/legal-meta.ts', 'LEGAL_EFFECTIVE_DATE'),
  entity: {
    brand: propriete('lib/legal/legal-meta.ts', 'brand'),
    legalName: constante('lib/mail/identite.ts', 'RAISON_SOCIALE'),
    jurisdiction: propriete('lib/legal/legal-meta.ts', 'jurisdiction'),
    city: propriete('lib/legal/legal-meta.ts', 'city'),
  },
  contact: {
    email: constante('lib/mail/identite.ts', 'COURRIEL_SUPPORT'),
    phone: constante('lib/mail/identite.ts', 'TELEPHONE'),
    address: constante('lib/mail/identite.ts', 'ADRESSE_POSTALE'),
  },
  trial: essaiProduit,
  enNotice: en.Legal.enFallbackNotice,
  terms: { fr: frTerms, en: enTerms },
};
const texte = JSON.stringify(donnees, null, 2) + '\n';

if (MODE_VERIFIER) {
  const actuel = existsSync(CIBLE) ? readFileSync(CIBLE, 'utf8') : null;
  if (actuel === texte) {
    console.log(`[legal] à jour — version ${donnees.legalVersion} (${donnees.effectiveDate}).`);
    process.exit(0);
  }
  console.error(
    actuel === null
      ? '[legal] src/lib/legal-terms.generated.json absent — lancer npm run legal:synchroniser.'
      : '[legal] DÉRIVE : le canonique (cellier-vin) a changé sans resynchronisation. ' +
          'Lancer npm run legal:synchroniser, relire le diff, commiter.',
  );
  process.exit(1);
}

writeFileSync(CIBLE, texte);
console.log(
  `[legal] généré : version ${donnees.legalVersion} (${donnees.effectiveDate}), ` +
    `${Object.keys(frTerms).length} clés × 2 langues, depuis ${CELLIER}.`,
);
