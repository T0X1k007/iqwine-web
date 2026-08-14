#!/usr/bin/env node
/**
 * VÉRIFICATION DU ROUTAGE BILINGUE — à rejouer avant chaque déploiement.
 *
 * ── Pourquoi un script et non une suite Playwright ────────────────────────
 * Ce dépôt n'a AUCUNE infrastructure de test : ni vitest, ni playwright, ni
 * fichier de configuration. Y introduire un navigateur sans tête pour vérifier
 * des codes HTTP et des balises `<link>` ajouterait plusieurs centaines de
 * mégaoctets de dépendances et une étape de CI, pour observer ce qu'un client
 * HTTP voit déjà.
 *
 * Ce que ces contrôles doivent prouver, un navigateur ne l'apporte pas : ils
 * portent tous sur ce qui est SERVI — codes de redirection, `<html lang>`,
 * canonical, `hreflang`, sitemap. C'est précisément la vue d'un robot, qui
 * n'exécute pas de JavaScript pour indexer une balise `<link>`.
 *
 * Le jour où le site aura des parcours à tester (formulaires, états, clics),
 * Playwright deviendra le bon outil. Aujourd'hui il déguiserait en couverture
 * ce qui n'est qu'une vérification de contrat HTTP.
 *
 * ── Usage ─────────────────────────────────────────────────────────────────
 *   npm run build && npx next start -p 3100 &
 *   node scripts/verifier-routage.mjs http://localhost:3100
 *
 * Sortie : une ligne par contrôle, et un code de sortie non nul au premier
 * échec — pour qu'un enchaînement s'arrête au lieu de continuer sur une base
 * fausse.
 */

// La table des slugs, IMPORTÉE de la source unique. La recopier ici ferait
// deux vérités : le jour où l'une change, le contrôle valide l'autre.
import { SEGMENTS as SEGMENTS_ROUTAGE } from '../src/lib/locale.ts';

const BASE = (process.argv[2] || 'http://localhost:3100').replace(/\/$/, '');

let echecs = 0;
let controles = 0;

function verifier(nom, condition, detail = '') {
  controles += 1;
  const ok = Boolean(condition);
  if (!ok) echecs += 1;
  const marque = ok ? '✓' : '✗';
  console.log(`  ${marque} ${nom}${detail ? ` — ${detail}` : ''}`);
}

async function sansSuivre(chemin, entetes = {}) {
  const r = await fetch(`${BASE}${chemin}`, { redirect: 'manual', headers: entetes });
  return { status: r.status, location: r.headers.get('location') || '' };
}

async function html(chemin) {
  const r = await fetch(`${BASE}${chemin}`);
  return { status: r.status, corps: await r.text() };
}

/** Les pages indexables, en chemins NUS. `/recevoir` (2026-08-13) puis
 * `/recherche` (2026-08-14) ont quitté cette liste : absorbées par
 * `/accord-mets-vins` et `/choisir-un-vin`, elles sont devenues des ALIAS
 * (vérifiés plus bas, avec `/octave`). Les pages Fonction nées depuis vivent
 * ici comme les autres. */
const PAGES = [
  '/',
  '/fonctions',
  '/choisir-un-vin',
  '/cellier-intelligent',
  '/accord-mets-vins',
  '/carte-des-vins',
  '/sommelier-ia',
  '/le-film',
  '/apogee',
  '/tarifs',
  '/notre-maison',
  '/contact',
  '/conditions',
  '/confidentialite',
];

console.log(`\nVérification du routage bilingue — ${BASE}\n`);

console.log('1. La racine négocie, sans jamais consulter l’IP');
{
  const sans = await sansSuivre('/');
  verifier('sans en-tête → français', sans.status === 307 && sans.location.endsWith('/fr'), sans.location);
  const en = await sansSuivre('/', { 'Accept-Language': 'en-US,en;q=0.9' });
  verifier('Accept-Language en → /en', en.status === 307 && en.location.endsWith('/en'), en.location);
  const fr = await sansSuivre('/', { 'Accept-Language': 'fr-CA,fr;q=0.9' });
  verifier('Accept-Language fr → /fr', fr.status === 307 && fr.location.endsWith('/fr'), fr.location);
  const cookie = await sansSuivre('/', { 'Accept-Language': 'fr-CA', Cookie: 'iqwine-locale=en' });
  verifier('le choix manuel PRÉVAUT', cookie.location.endsWith('/en'), cookie.location);
  const params = await sansSuivre('/?utm_source=x&ref=y', { 'Accept-Language': 'en' });
  verifier('les paramètres de campagne survivent', params.location.includes('utm_source=x&ref=y'));
}

// ── 2. LES CHEMINS NUS NÉGOCIENT — ils ne forcent plus le français ────────
//
// Ils rendaient un 308 PERMANENT vers `/fr/…`, quel que soit l'`Accept-Language`.
// C'était mesurable et faux : `alternatesFor` déclare `x-default` sur ces mêmes
// chemins en affirmant qu'ils orientent selon la langue. Ils ne le faisaient
// que pour l'accueil.
//
// Ils rendent maintenant un 307 — temporaire, parce qu'une réponse qui dépend
// d'un en-tête ne peut pas être permanente — vers la bonne langue ET le bon
// slug. Un anglophone qui suit un vieux lien `/tarifs` arrive sur
// `/en/pricing`, en UN saut.
console.log('\n2. Les chemins nus négocient, vers la bonne langue et le bon slug');
for (const p of PAGES.filter((p) => p !== '/')) {
  const segment = p.slice(1);
  for (const [langue, entete] of [
    ['fr', 'fr-CA,fr;q=0.9'],
    ['en', 'en-CA,en;q=0.9'],
  ]) {
    const r = await fetch(`${BASE}${p}`, {
      redirect: 'manual',
      headers: { 'accept-language': entete },
    });
    const loc = r.headers.get('location') ?? '';
    const attendu = `/${langue}/${SEGMENTS_ROUTAGE[segment]?.[langue] ?? segment}`;
    verifier(
      `${p} (${langue}) → ${attendu} en UN saut`,
      r.status === 307 && loc.endsWith(attendu),
      `${r.status} ${loc || '(rien)'}`,
    );
  }
}
{
  const r = await sansSuivre('/octave');
  verifier(
    // 307, comme tous les chemins nus depuis qu'ils négocient : sans
    // `Accept-Language`, le repli est le français. La variante anglaise est
    // vérifiée au contrôle 11.
    '/octave → /fr/sommelier-ia en UN saut',
    r.status === 307 && r.location.endsWith('/fr/sommelier-ia'),
    `${r.status} ${r.location}`,
  );
}
{
  // `/recevoir` : absorbée par la page Accords (2026-08-13). Même mécanique
  // d'alias que `/octave` : négociation, un seul saut.
  const r = await sansSuivre('/recevoir');
  verifier(
    '/recevoir → /fr/accord-mets-vins en UN saut',
    r.status === 307 && r.location.endsWith('/fr/accord-mets-vins'),
    `${r.status} ${r.location}`,
  );
}
{
  // `/recherche` : absorbée par /choisir-un-vin (2026-08-14). Le chemin nu
  // négocie (alias) ; les trois adresses localisées de l'ancien pilier
  // reçoivent leur redirection PERMANENTE, en un saut chacune — dont
  // `/en/recherche`, qui aurait sinon enchaîné deux sauts via `/en/search`.
  const nu = await sansSuivre('/recherche');
  verifier(
    '/recherche → /fr/choisir-un-vin en UN saut',
    nu.status === 307 && nu.location.endsWith('/fr/choisir-un-vin'),
    `${nu.status} ${nu.location}`,
  );
  for (const [depuis, vers] of [
    ['/fr/recherche', '/fr/choisir-un-vin'],
    ['/en/search', '/en/how-to-choose-wine'],
    ['/en/recherche', '/en/how-to-choose-wine'],
  ]) {
    const r = await sansSuivre(depuis);
    verifier(
      `${depuis} → permanent → ${vers}`,
      (r.status === 301 || r.status === 308) && r.location.endsWith(vers),
      `${r.status} ${r.location || '(rien)'}`,
    );
  }
}

console.log('\n3. Chaque page existe dans les DEUX langues, sans JavaScript');
for (const p of PAGES) {
  for (const l of ['fr', 'en']) {
    const chemin = p === '/' ? `/${l}` : `/${l}${p}`;
    const { status, corps } = await html(chemin);
    const lang = corps.match(/<html lang="([^"]+)"/)?.[1];
    verifier(`${chemin} · lang=${lang}`, status === 200 && lang === `${l}-CA`, `HTTP ${status}`);
  }
}

console.log('\n4. Canonical et hreflang pointent vers la BONNE URL');
// Le chemin visité porte le slug LOCALISÉ — c'est tout l'objet de la migration.
// Le construire en collant `/${langue}` devant le nom de dossier reviendrait à
// vérifier une adresse qui n'existe plus qu'en redirection.
for (const p of ['/', '/tarifs', '/apogee']) {
  for (const l of ['fr', 'en']) {
    const segment = p.slice(1);
    const slug = segment ? (SEGMENTS_ROUTAGE[segment]?.[l] ?? segment) : '';
    const chemin = slug ? `/${l}/${slug}` : `/${l}`;
    const { corps } = await html(chemin);
    const canonical = corps.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || '';
    const aFr = /hrefLang="fr-CA"/i.test(corps);
    const aEn = /hrefLang="en-CA"/i.test(corps);
    verifier(
      `${chemin} canonical + hreflang fr/en`,
      canonical.endsWith(chemin) && aFr && aEn,
      canonical,
    );

    /**
     * `x-default` doit rester NEUTRE : il désigne le chemin SANS langue, qui
     * négocie. Y trouver `/fr` signifierait qu'on déclare le français comme
     * réponse universelle — alors que ce n'est qu'un repli opérationnel.
     */
    const xd = corps.match(/hrefLang="x-default" href="([^"]+)"/i)?.[1] || '';
    const neutre = !/\/(fr|en)(\/|$)/.test(new URL(xd).pathname);
    verifier(`${chemin} x-default NEUTRE`, neutre, xd);
  }
}

console.log('\n5. Titres et données structurées DIFFÈRENT selon la langue');
for (const p of ['/', '/tarifs', '/apogee']) {
  const fr = await html(p === '/' ? '/fr' : `/fr${p}`);
  const en = await html(p === '/' ? '/en' : `/en${p}`);
  const tFr = fr.corps.match(/<title>([^<]*)<\/title>/)?.[1] || '';
  const tEn = en.corps.match(/<title>([^<]*)<\/title>/)?.[1] || '';
  verifier(`${p} · titres distincts`, tFr !== '' && tEn !== '' && tFr !== tEn, `${tFr} ≠ ${tEn}`);

  const ldFr = fr.corps.match(/"inLanguage":"([^"]+)"/)?.[1];
  const ldEn = en.corps.match(/"inLanguage":"([^"]+)"/)?.[1];
  if (p === '/') {
    verifier('balisage en fr-CA / en-CA', ldFr === 'fr-CA' && ldEn === 'en-CA', `${ldFr} / ${ldEn}`);
  }
}

console.log('\n6. Le sélecteur de langue est un LIEN vers l’équivalent exact');
// Un anglophone qui clique « Français » depuis `/en/drinking-window` doit
// arriver sur `/fr/apogee` — pas sur `/fr/drinking-window`, qui n'existe pas.
// C'est le comportement que `splitLocalePath` rend possible en retraduisant
// vers le segment canonique avant de relocaliser.
for (const [depuis, attendu] of [
  [`/fr/${SEGMENTS_ROUTAGE.apogee.fr}`, `/en/${SEGMENTS_ROUTAGE.apogee.en}`],
  [`/en/${SEGMENTS_ROUTAGE.apogee.en}`, `/fr/${SEGMENTS_ROUTAGE.apogee.fr}`],
]) {
  const { corps } = await html(depuis);
  verifier(`${depuis} → ${attendu}`, corps.includes(`href="${attendu}"`));
}

console.log('\n7. Sitemap bilingue, découvrable');
{
  const { corps } = await html('/sitemap.xml');
  const urls = (corps.match(/<loc>/g) || []).length;
  // 12 pages depuis l'ajout du hub /fonctions (architecture 2026-08-13) —
  // ce compte est le CONTRAT : toute nouvelle page Fonction doit l'incrémenter
  // ici en même temps qu'elle entre dans PAGES du sitemap.
  verifier('28 URL (14 pages × 2 langues)', urls === 28, `${urls} trouvées`);
  verifier('chaque entrée porte ses alternates', (corps.match(/x-default/g) || []).length === 28);
  // Aucun `x-default` ne doit désigner une URL de langue dans le sitemap non plus.
  const xdefaults = [...corps.matchAll(/hreflang="x-default" href="([^"]+)"/g)].map((m) => m[1]);
  verifier(
    'aucun x-default ne pointe vers /fr ou /en',
    xdefaults.every((u) => !/\/(fr|en)(\/|$)/.test(new URL(u).pathname)),
  );
  const robots = await html('/robots.txt');
  verifier('robots.txt annonce le sitemap', robots.corps.includes('/sitemap.xml'));
}

console.log('\n8. Aucune boucle, l’inconnu finit en 404');
for (const p of ['/de/tarifs', '/nimporte-quoi']) {
  const r = await fetch(`${BASE}${p}`, { redirect: 'follow' });
  verifier(`${p} → 404 sans boucle`, r.status === 404, `HTTP ${r.status}`);
}


// ── 9. AUCUNE ADRESSE DE L'ANCIEN DOMAINE DANS LE CODE VIVANT ──────────────
//
// Ce contrôle ne regarde pas le réseau mais les SOURCES, et c'est voulu : trois
// adresses `iqwine.ca` avaient survécu à la bascule du 2026-08-02, invisibles
// parce que l'ancien domaine redirige (308) et que tout « marche » quand même.
//
//   · `ShareButton` partageait `www.iqwine.ca/?src=share` — or un lien partagé
//     n'est pas un lien qu'on suit une fois : il vit dans des messages, des
//     favoris, des aperçus de réseaux sociaux, chacun affichant le domaine
//     qu'on lui a donné ;
//   · les données structurées du film déclaraient `contentUrl` sur
//     `www.iqwine.ca` — lues non par un navigateur mais par l'indexeur vidéo de
//     Google, qui va CHERCHER le fichier et tombe sur une redirection
//     inter-domaines vers la ressource même que le schéma déclare ;
//   · le repli de `llms.txt` pointait sur l'ancien domaine, masqué tant que la
//     variable d'environnement est posée — donc invisible jusqu'au jour où elle
//     ne l'est pas, c'est-à-dire un changement de plateforme.
//
// Une redirection qui fonctionne est exactement ce qui rend ces erreurs
// silencieuses. Seule une lecture des sources les voit.
console.log('\n9. Aucune adresse de l’ancien domaine dans le code');
{
  const { readdirSync, readFileSync, statSync } = await import('node:fs');
  const { join, extname } = await import('node:path');

  const fichiers = [];
  (function parcourir(dossier) {
    for (const e of readdirSync(dossier)) {
      const p = join(dossier, e);
      if (statSync(p).isDirectory()) parcourir(p);
      else if (['.ts', '.tsx'].includes(extname(e))) fichiers.push(p);
    }
  })('src');

  // On retire les commentaires AVANT de chercher : la mémoire de la bascule est
  // précieuse et doit pouvoir citer l'ancien domaine sans faire rougir la porte.
  const fautifs = [];
  for (const f of fichiers) {
    const sansCommentaires = readFileSync(f, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/.*$/gm, '$1');
    if (/iqwine\.ca/.test(sansCommentaires)) fautifs.push(f);
  }
  verifier(
    `${fichiers.length} fichiers lus, aucun ne cite iqwine.ca hors commentaire`,
    fautifs.length === 0,
    fautifs.join(', '),
  );
}

// ── 10. LA MIGRATION DES SLUGS ANGLAIS ─────────────────────────────────────
//
// C'est le contrôle le plus important de ce fichier, parce que la migration
// repose sur une combinaison qui BOUCLE si elle est mal ordonnée : une
// réécriture `/en/pricing → /en/tarifs` et une redirection
// `/en/tarifs → /en/pricing` vivent côte à côte. Next applique les redirections
// avant les réécritures et ne re-soumet pas la destination d'une réécriture aux
// redirections — mais « la documentation le dit » n'est pas une vérification.
// Une boucle ici rendrait le site injoignable.
console.log('\n10. Slugs anglais — service, redirections, aucune boucle');
{
  const SEGMENTS = SEGMENTS_ROUTAGE;
  {
    const traduits = Object.entries(SEGMENTS).filter(([dossier, s]) => s.en !== dossier);

    for (const [dossier, slugs] of traduits) {
      // a) le slug anglais SERT la page, sans redirection
      const neuf = await fetch(`${BASE}/en/${slugs.en}`, { redirect: 'manual' });
      verifier(`/en/${slugs.en} sert la page`, neuf.status === 200, `HTTP ${neuf.status}`);

      // b) l'ancienne adresse anglaise redirige en 301, en UN saut
      const vieux = await fetch(`${BASE}/en/${dossier}`, { redirect: 'manual' });
      const cible = vieux.headers.get('location') ?? '';
      // ── 301 OU 308 : les deux sont PERMANENTES ────────────────────────
      //
      // `permanent: true` de Next émet un **308**, pas un 301. Ce n'est pas un
      // moindre mal : Google traite les deux à l'identique pour la
      // canonicalisation et le transfert d'autorité, et 308 préserve la
      // méthode HTTP là où 301 autorise historiquement un POST à devenir GET.
      //
      // Le reste du site — redirections de domaine, chemins nus d'avant la
      // migration — émet déjà des 308. Forcer un 301 sur ces neuf-là seulement
      // introduirait une incohérence sans rien gagner.
      //
      // Ce qui compte, et qui est vérifié : la redirection est PERMANENTE, elle
      // vise la bonne adresse, et elle ne fait qu'un saut.
      const permanente = vieux.status === 301 || vieux.status === 308;
      verifier(
        `/en/${dossier} → ${vieux.status} permanent → /en/${slugs.en}`,
        permanente && cible.endsWith(`/en/${slugs.en}`),
        `HTTP ${vieux.status} → ${cible || '(rien)'}`,
      );

      // c) aucune boucle : en suivant les sauts, on ARRIVE quelque part
      const suivi = await fetch(`${BASE}/en/${dossier}`, { redirect: 'follow' });
      verifier(`/en/${dossier} aboutit sans boucle`, suivi.status === 200, `HTTP ${suivi.status}`);

      // d) le français n'a pas bougé — c'est la moitié qu'une migration casse
      //    sans qu'on la regarde
      const fr = await fetch(`${BASE}/fr/${dossier}`, { redirect: 'manual' });
      verifier(`/fr/${dossier} intact`, fr.status === 200, `HTTP ${fr.status}`);
    }

    // e) canonical, hreflang et og:url portent le slug ANGLAIS
    //
    // Les attentes sont DÉRIVÉES de la table, jamais réécrites : un contrôle qui
    // recopie ce qu'il vérifie ne vérifie plus rien le jour où la table change.
    const { en: slugEn, fr: slugFr } = SEGMENTS.tarifs;
    const page = await html(`/en/${slugEn}`);
    verifier(
      `canonical anglais → /en/${slugEn}`,
      new RegExp(`<link rel="canonical" href="[^"]*/en/${slugEn}"`).test(page.corps),
      'canonical absent ou encore sur le nom de dossier',
    );
    verifier(
      `hreflang fr-CA → /fr/${slugFr}`,
      new RegExp(`hrefLang="fr-CA" href="[^"]*/fr/${slugFr}"`, 'i').test(page.corps),
    );
    verifier(
      `hreflang en-CA → /en/${slugEn}`,
      new RegExp(`hrefLang="en-CA" href="[^"]*/en/${slugEn}"`, 'i').test(page.corps),
    );
    // `og:url` manquait sur TOUTES les pages avant le 2026-08-03 : Next ne le
    // déduit pas du canonical. Il doit exister ET porter le slug traduit.
    verifier(
      `og:url → /en/${slugEn}`,
      new RegExp(`property="og:url" content="[^"]*/en/${slugEn}"`).test(page.corps),
      'og:url absent ou sur le mauvais slug',
    );

    // e-bis) LE SÉLECTEUR DE LANGUE mène au slug traduit
    //
    // C'est le seul comportement de cette migration qui ressemble à un parcours
    // plutôt qu'à un contrat HTTP — et c'est celui qui casserait le plus
    // visiblement : un anglophone qui clique « Français » depuis `/en/pricing`
    // doit arriver sur `/fr/tarifs`, pas sur une page inexistante.
    //
    // Il n'a pas besoin d'un navigateur pour être vérifié : `LanguageToggle`
    // rend un `<a href>` calculé au rendu serveur. Le lien EST dans le HTML.
    verifier(
      `le sélecteur de langue de /en/${slugEn} pointe vers /fr/${slugFr}`,
      new RegExp(`href="/fr/${slugFr}"`).test(page.corps),
      'le lien de bascule est absent ou pointe vers le nom de dossier',
    );

    // f) le sitemap annonce les nouvelles adresses et PLUS les anciennes
    const sm = await html('/sitemap.xml');
    for (const [dossier, slugs] of traduits) {
      verifier(`sitemap annonce /en/${slugs.en}`, sm.corps.includes(`/en/${slugs.en}`));
      verifier(
        `sitemap n’annonce plus /en/${dossier}`,
        !sm.corps.includes(`/en/${dossier}<`) && !sm.corps.includes(`/en/${dossier}"`),
        'une ancienne adresse traîne encore dans le sitemap',
      );
    }
  }
}

// ── 11. LES CHEMINS NUS NÉGOCIENT VRAIMENT ────────────────────────────────
//
// `x-default` désigne ces chemins en affirmant qu'ils orientent selon la
// langue. Ils l'affirmaient sans le faire : mesuré le 2026-08-03, `/tarifs`
// rendait 308 vers `/fr/tarifs` quel que soit l'`Accept-Language`.
console.log('\n11. Les chemins nus négocient (x-default doit dire vrai)');
{
  for (const [entete, attendu] of [
    ['fr-CA,fr;q=0.9', '/fr/tarifs'],
    ['en-CA,en;q=0.9', '/en/pricing'],
  ]) {
    const r = await fetch(`${BASE}/tarifs`, {
      redirect: 'manual',
      headers: { 'accept-language': entete },
    });
    const loc = r.headers.get('location') ?? '';
    verifier(
      `/tarifs (${entete.slice(0, 5)}) → ${attendu}`,
      loc.endsWith(attendu),
      `HTTP ${r.status} → ${loc || '(rien)'}`,
    );
  }

  // `/octave` : un alias hérité, qui doit lui aussi négocier EN UN SAUT.
  const oct = await fetch(`${BASE}/octave`, {
    redirect: 'manual',
    headers: { 'accept-language': 'en-CA,en;q=0.9' },
  });
  const locOct = oct.headers.get('location') ?? '';
  verifier(
    '/octave (en) → /en/ai-sommelier en un saut',
    locOct.endsWith('/en/ai-sommelier'),
    `HTTP ${oct.status} → ${locOct || '(rien)'}`,
  );
}

// ── LE RÉSUMÉ EST LA DERNIÈRE CHOSE DU FICHIER ────────────────────────────
//
// Il l'était déjà — puis trois sections ont été ajoutées EN DESSOUS, donc après
// le `process.exit`. Elles n'ont jamais tourné, et le script annonçait
// tranquillement « 48/62 contrôles passés » sans mentionner celles qu'il
// n'avait pas exécutées. Un rapport qui compte ce qu'il a fait, sans dire ce
// qu'il n'a pas fait, ment par omission.
//
// ⚠ Toute nouvelle section se place AU-DESSUS de ce bloc.
console.log(`\n${controles - echecs}/${controles} contrôles passés.\n`);
process.exit(echecs === 0 ? 0 : 1);
