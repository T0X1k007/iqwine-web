#!/usr/bin/env node
/**
 * TESTS DE LA SOURCE D'ACQUISITION ET DES INTERRUPTEURS DE MESURE
 * (audit de visibilité du 2026-11-06, constats M-01, M-02, M-03, M-07).
 *
 * Le dépôt n'a ni vitest ni playwright (voir l'en-tête de
 * verifier-routage.mjs) : ces tests portent sur les fonctions PURES, avec le
 * lanceur intégré de Node, qui lit le TypeScript sans compilation.
 *
 *   node --test scripts/tester-attribution.mjs
 *
 * Deadline dure : 60 s, au-delà le processus sort en 124 (règle anti-stall).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  appliquerAttribution,
  attributionAConserver,
  construireUrlInscription,
  estLienInscription,
  lienBoutiqueAvecCampagne,
  lireAttributionArrivee,
  relireAttribution,
} from '../src/lib/attribution.ts';
import { ajoutsCspMesure, jetonCloudflareAnalytics } from '../src/lib/mesure.ts';

setTimeout(() => process.exit(124), 60_000).unref();

const BASE = 'https://app.iqwine.ai/signup';
const params = (u) => Object.fromEntries(new URL(u).searchParams);

test('repli inchangé : sans attribution, utm_source=marketing, src gardé', () => {
  const u = construireUrlInscription(BASE, 'hero', { lang: 'fr' });
  assert.equal(
    u,
    'https://app.iqwine.ai/signup?utm_source=marketing&utm_medium=cta&utm_campaign=trial&src=hero&lang=fr',
  );
});

test('visite simulée ?utm_source=test-audit : le lien d’essai porte la source', () => {
  const a = lireAttributionArrivee('?utm_source=test-audit', '', 'iqwine.ai');
  assert.deepEqual(a, { source: 'test-audit', origine: 'utm' });
  const u = construireUrlInscription(BASE, 'tarifs-hero', {
    plan: 'standard',
    period: 'yearly',
    lang: 'fr',
    attribution: a,
  });
  const p = params(u);
  assert.equal(p.utm_source, 'test-audit');
  assert.equal(p.src, 'tarifs-hero');
  assert.equal(p.plan, 'standard');
  assert.equal(p.period, 'yearly');
  assert.equal(p.lang, 'fr');
  // Ni medium ni campagne inventés quand l'arrivée n'en portait pas.
  assert.equal(p.utm_medium, undefined);
  assert.equal(p.utm_campaign, undefined);
});

test('réécriture au clic d’un lien rendu par le serveur (repli → source)', () => {
  const rendu = construireUrlInscription(BASE, 'nav', { lang: 'en' });
  assert.ok(estLienInscription(rendu, BASE));
  const a = lireAttributionArrivee(
    '?utm_source=chatgpt.com&utm_medium=ia&utm_campaign=lancement',
    '',
  );
  const p = params(appliquerAttribution(new URL(rendu), a).toString());
  assert.deepEqual(
    [p.utm_source, p.utm_medium, p.utm_campaign, p.src, p.lang],
    ['chatgpt.com', 'ia', 'lancement', 'nav', 'en'],
  );
});

test('référent : domaine seulement, jamais chemin ni requête', () => {
  const a = lireAttributionArrivee(
    '',
    'https://www.google.com/search?q=courriel%40exemple.com&x=1',
    'iqwine.ai',
  );
  assert.deepEqual(a, { source: 'google.com', medium: 'referral', origine: 'referent' });
  const u = construireUrlInscription(BASE, 'hero', { attribution: a });
  assert.ok(!u.includes('search'));
  assert.ok(!u.includes('courriel'));
  assert.equal(params(u).utm_medium, 'referral');
});

test('navigation interne et domaines maison ignorés', () => {
  for (const r of [
    'https://iqwine.ai/fr/tarifs',
    'https://app.iqwine.ai/login',
    'https://staging.iqwine.ai/fr',
    'http://localhost:3020/fr',
  ]) {
    assert.equal(lireAttributionArrivee('', r, 'localhost'), null, r);
  }
});

test('valeurs hors bornes rejetées (64 car., [A-Za-z0-9._+-])', () => {
  assert.equal(lireAttributionArrivee(`?utm_source=${'a'.repeat(65)}`, ''), null);
  assert.equal(lireAttributionArrivee('?utm_source=moi%40exemple.com', ''), null);
  assert.equal(lireAttributionArrivee('?utm_source=jean%20tremblay', ''), null);
  assert.equal(lireAttributionArrivee('?utm_source=a%2Fb', ''), null);
  assert.ok(lireAttributionArrivee(`?utm_source=${'a'.repeat(64)}`, ''));
  // Medium invalide écarté, source gardée.
  assert.deepEqual(lireAttributionArrivee('?utm_source=x&utm_medium=a%40b', ''), {
    source: 'x',
    origine: 'utm',
  });
  // Référent exotique ou malformé.
  assert.equal(lireAttributionArrivee('', 'android-app://com.google.app'), null);
  assert.equal(lireAttributionArrivee('', 'pas une url'), null);
});

test('stockage revalidé : JSON malformé ou falsifié rejeté', () => {
  assert.equal(relireAttribution(null), null);
  assert.equal(relireAttribution('{'), null);
  assert.equal(relireAttribution('{"source":"a@b","origine":"utm"}'), null);
  assert.equal(relireAttribution('{"source":"x","origine":"autre"}'), null);
  assert.deepEqual(relireAttribution('{"source":"x","medium":"<b>","origine":"utm"}'), {
    source: 'x',
    origine: 'utm',
  });
});

test('conservation : l’UTM remplace, le référent ne fait que combler', () => {
  const utm = { source: 'infolettre', origine: 'utm' };
  const ref = { source: 'bing.com', medium: 'referral', origine: 'referent' };
  assert.equal(attributionAConserver(utm, ref), utm);
  assert.equal(attributionAConserver(ref, utm), null);
  assert.equal(attributionAConserver(ref, null), ref);
  assert.equal(attributionAConserver(null, utm), null);
});

test('boutiques : rien sans interrupteur, Apple exige pt, Google referrer encodé', () => {
  const apple = 'https://apps.apple.com/ca/app/iqwine-sommelier-personnel/id6798458954';
  const play = 'https://play.google.com/store/apps/details?id=ca.iqwine.app';
  const off = { campagnesActives: false, appleProviderToken: '123456' };
  assert.equal(lienBoutiqueAvecCampagne(apple, 'apple', 'hero', off), apple);
  assert.equal(lienBoutiqueAvecCampagne(play, 'google', 'hero', off), play);
  const sansPt = { campagnesActives: true };
  assert.equal(lienBoutiqueAvecCampagne(apple, 'apple', 'hero', sansPt), apple);
  const on = { campagnesActives: true, appleProviderToken: '123456' };
  assert.equal(lienBoutiqueAvecCampagne(apple, 'apple', 'hero', on), `${apple}?pt=123456&ct=site-hero`);
  assert.equal(
    lienBoutiqueAvecCampagne(play, 'google', 'hero', on),
    `${play}&referrer=utm_source%3Diqwine.ai%26utm_medium%3Dsite%26utm_campaign%3Dhero`,
  );
  const ct = params(lienBoutiqueAvecCampagne(apple, 'apple', 'x'.repeat(40), on)).ct;
  assert.equal(ct.length, 30);
});

test('interrupteur de mesure : absent ou mal formé = rien, CSP inchangée', () => {
  assert.equal(jetonCloudflareAnalytics({}), null);
  assert.equal(jetonCloudflareAnalytics({ NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN: 'abc' }), null);
  assert.deepEqual(ajoutsCspMesure({}), { script: '', connect: '' });
  const env = { NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN: '0123456789abcdef0123456789abcdef' };
  assert.deepEqual(ajoutsCspMesure(env), {
    script: ' https://static.cloudflareinsights.com/beacon.min.js',
    connect: ' https://cloudflareinsights.com',
  });
});
