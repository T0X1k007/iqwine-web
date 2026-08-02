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

/** Les onze pages indexables, en chemins NUS. */
const PAGES = [
  '/',
  '/sommelier-ia',
  '/le-film',
  '/apogee',
  '/recherche',
  '/recevoir',
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

console.log('\n2. Les anciennes URL redirigent en PERMANENT, en UN saut');
for (const p of PAGES.filter((p) => p !== '/')) {
  const r = await sansSuivre(p);
  const attendu = `/fr${p}`;
  verifier(`${p} → ${attendu}`, r.status === 308 && r.location.endsWith(attendu), `${r.status} ${r.location}`);
}
{
  const r = await sansSuivre('/octave');
  verifier(
    '/octave → /fr/sommelier-ia en UN saut',
    r.status === 308 && r.location.endsWith('/fr/sommelier-ia'),
    `${r.status} ${r.location}`,
  );
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
for (const p of ['/', '/tarifs', '/apogee']) {
  for (const l of ['fr', 'en']) {
    const chemin = p === '/' ? `/${l}` : `/${l}${p}`;
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
for (const [depuis, attendu] of [
  ['/fr/apogee', '/en/apogee'],
  ['/en/apogee', '/fr/apogee'],
]) {
  const { corps } = await html(depuis);
  verifier(`${depuis} → ${attendu}`, corps.includes(`href="${attendu}"`));
}

console.log('\n7. Sitemap bilingue, découvrable');
{
  const { corps } = await html('/sitemap.xml');
  const urls = (corps.match(/<loc>/g) || []).length;
  verifier('22 URL (11 pages × 2 langues)', urls === 22, `${urls} trouvées`);
  verifier('chaque entrée porte ses alternates', (corps.match(/x-default/g) || []).length === 22);
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

console.log(`\n${controles - echecs}/${controles} contrôles passés.\n`);
process.exit(echecs === 0 ? 0 : 1);
