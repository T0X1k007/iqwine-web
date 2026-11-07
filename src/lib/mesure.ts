/**
 * ── LES INTERRUPTEURS DE MESURE, TOUS ÉTEINTS PAR DÉFAUT ──────────────────
 *
 * Audit de visibilité du 2026-11-06, constats M-01, M-02 et M-07. Rien de ce
 * module ne s'allume sans une variable d'environnement posée AU BUILD par
 * Éric : variable absente (ou mal formée) = aucun script chargé, aucune
 * origine ajoutée à la CSP, liens de boutique inchangés. C'est ce que vérifie
 * la chaîne locale avant chaque déploiement.
 *
 * Aucun import : `lib/regles-de-bord` le lit pour la CSP (build, export
 * Cloudflare et Worker), et il doit rester
 * chargeable hors de Next.
 *
 * ── Mesure d'audience retenue : Cloudflare Web Analytics ──────────────────
 * Gratuit, sans témoin ni stockage local, sans empreinte (cloudflare.com/
 * web-analytics), ne journalise pas les chaînes de requête, six mois
 * d'historique (developers.cloudflare.com/web-analytics/faq). Ni événements
 * personnalisés ni UTM : `track()` (analytics.ts) n'y est donc PAS branché.
 * Comparatif et raisons : docs/mesure-attribution.md.
 *
 * Le jeton du site n'est pas un secret (il est servi dans le HTML), mais il
 * reste dans une variable pour que l'allumage soit un geste, pas un commit.
 */

/** Jeton de site Cloudflare Web Analytics : 32 caractères hexadécimaux. */
const JETON_CF = /^[0-9a-f]{32}$/i;

export function jetonCloudflareAnalytics(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const v = env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN?.trim();
  return v && JETON_CF.test(v) ? v : null;
}

/** Script de la balise, et seule origine où elle envoie en installation manuelle. */
export const CF_BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';
export const CF_BEACON_CONNECT = 'https://cloudflareinsights.com';

/**
 * Ajouts CSP, vides quand l'interrupteur est éteint. Valeurs prises de
 * developers.cloudflare.com/web-analytics/faq (« Content Security Policy »,
 * installation manuelle).
 */
export function ajoutsCspMesure(env: Record<string, string | undefined> = process.env): {
  script: string;
  connect: string;
} {
  if (!jetonCloudflareAnalytics(env)) return { script: '', connect: '' };
  return { script: ` ${CF_BEACON_SRC}`, connect: ` ${CF_BEACON_CONNECT}` };
}

/**
 * Liens de boutique avec campagne : `NEXT_PUBLIC_CAMPAGNES_BOUTIQUES=1`.
 * Apple exige EN PLUS `NEXT_PUBLIC_APP_STORE_PT`, le jeton fournisseur
 * généré dans App Store Connect (Analytics > Campaigns).
 *
 * `process.env.NEXT_PUBLIC_…` est écrit en toutes lettres : c'est la seule
 * forme que Next remplace dans le code client.
 */
export const CAMPAGNES_BOUTIQUES = process.env.NEXT_PUBLIC_CAMPAGNES_BOUTIQUES === '1';
export const APP_STORE_PROVIDER_TOKEN = process.env.NEXT_PUBLIC_APP_STORE_PT?.trim() || undefined;
