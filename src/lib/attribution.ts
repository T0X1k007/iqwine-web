/**
 * ── LA SOURCE D'ACQUISITION, DE L'ATTERRISSAGE À L'INSCRIPTION ────────────
 *
 * Audit de visibilité du 2026-11-06, constat M-03. Chaque CTA d'essai portait
 * `utm_source=marketing`, quelle que soit la provenance du visiteur : arrivé
 * de Google, de `chatgpt.com?utm_source=chatgpt.com` ou d'une publication,
 * il s'inscrivait sous la même étiquette. L'app (`parseSignupEntry`,
 * cellier-vin) sait pourtant lire et garder une vraie source.
 *
 * Ce module fait trois choses, toutes PURES (aucun accès au navigateur, aucun
 * import, pour que `node --test` le charge sans Next ni alias `@/`) :
 *
 *   1. `lireAttributionArrivee` : tire de l'URL d'arrivée l'UTM entrant, ou à
 *      défaut le DOMAINE du référent (jamais son chemin ni sa requête) ;
 *   2. `construireUrlInscription` : fabrique le lien d'essai, en posant cette
 *      source à la place de `marketing`, qui reste le repli ;
 *   3. `lienBoutiqueAvecCampagne` : ajoute les paramètres de campagne
 *      documentés par Apple et Google aux liens de boutique.
 *
 * Le stockage (sessionStorage) et la réécriture au clic vivent dans le
 * composant client `AttributionArrivee`.
 *
 * ── Les bornes sont celles de l'app ───────────────────────────────────────
 * 64 caractères, `[A-Za-z0-9._+-]`, comme `parseSignupEntry` : une valeur
 * que l'app rejetterait n'a aucune raison de voyager. Cette classe exclut
 * d'office `@`, l'espace et `/` : un courriel, un nom ou un chemin ne passent
 * pas. Aucune donnée personnelle n'entre dans l'URL.
 */

/** Même motif que l'app (cellier-vin, `lib/auth/signup-entry.ts`). */
const VALEUR_ATTRIBUTION = /^[A-Za-z0-9._+-]{1,64}$/;

/** Repli historique, conservé tel quel : pas de source connue = `marketing`. */
export const ATTRIBUTION_REPLI = Object.freeze({
  source: 'marketing',
  medium: 'cta',
  campaign: 'trial',
});

export interface Attribution {
  /** `utm_source` d'arrivée, ou domaine du référent. */
  source: string;
  medium?: string;
  campaign?: string;
  /** D'où vient `source` : un UTM explicite, ou le référent HTTP. */
  origine: 'utm' | 'referent';
}

export function valeurAttributionValide(v: unknown): v is string {
  return typeof v === 'string' && VALEUR_ATTRIBUTION.test(v);
}

/**
 * Domaines « maison » : une navigation interne ou un retour depuis l'app ne
 * sont pas une source d'acquisition. L'ancien domaine n'y figure pas : il
 * redirige en 301, et une redirection garde le référent d'ORIGINE, il
 * n'apparaît donc jamais comme référent.
 */
const SUFFIXES_MAISON = ['iqwine.ai'];

function estDomaineMaison(hote: string, hoteCourant: string): boolean {
  if (hote === hoteCourant) return true;
  return SUFFIXES_MAISON.some((s) => hote === s || hote.endsWith(`.${s}`));
}

/**
 * Lit l'attribution d'une arrivée.
 *
 * @param recherche   `location.search` de la page d'atterrissage
 * @param referent    `document.referrer` (peut être vide)
 * @param hoteCourant `location.hostname`, pour ignorer la navigation interne
 * @returns `null` si rien d'exploitable : l'appelant garde alors ce qu'il a.
 */
export function lireAttributionArrivee(
  recherche: string,
  referent: string,
  hoteCourant = '',
): Attribution | null {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(recherche);
  } catch {
    params = new URLSearchParams();
  }

  const source = params.get('utm_source');
  if (valeurAttributionValide(source)) {
    const a: Attribution = { source, origine: 'utm' };
    const medium = params.get('utm_medium');
    const campaign = params.get('utm_campaign');
    if (valeurAttributionValide(medium)) a.medium = medium;
    if (valeurAttributionValide(campaign)) a.campaign = campaign;
    return a;
  }

  if (!referent) return null;
  let url: URL;
  try {
    url = new URL(referent);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  // Le DOMAINE seulement : `hostname` n'a ni chemin, ni requête, ni port, ni
  // identifiants. On retire `www.` pour regrouper `www.google.com` et
  // `google.com` sous une même source.
  const hote = url.hostname.toLowerCase().replace(/^www\./, '');
  if (!hote || estDomaineMaison(hote, hoteCourant.toLowerCase())) return null;
  if (!valeurAttributionValide(hote)) return null;
  return { source: hote, medium: 'referral', origine: 'referent' };
}

/**
 * Relit une attribution stockée (sessionStorage). Le stockage est une entrée
 * comme une autre : tout est revalidé, rien n'est cru sur parole.
 */
export function relireAttribution(brut: string | null | undefined): Attribution | null {
  if (!brut) return null;
  let o: unknown;
  try {
    o = JSON.parse(brut);
  } catch {
    return null;
  }
  if (!o || typeof o !== 'object') return null;
  const r = o as Record<string, unknown>;
  if (!valeurAttributionValide(r.source)) return null;
  if (r.origine !== 'utm' && r.origine !== 'referent') return null;
  const a: Attribution = { source: r.source, origine: r.origine };
  if (valeurAttributionValide(r.medium)) a.medium = r.medium;
  if (valeurAttributionValide(r.campaign)) a.campaign = r.campaign;
  return a;
}

/**
 * Règle de conservation, pour un même onglet : un UTM explicite remplace ce
 * qui était gardé (c'est une campagne qu'on a voulu marquer) ; un référent ne
 * fait que combler un vide (premier contact). `null` = ne rien écrire.
 */
export function attributionAConserver(
  arrivee: Attribution | null,
  existante: Attribution | null,
): Attribution | null {
  if (!arrivee) return null;
  if (arrivee.origine === 'utm') return arrivee;
  return existante ? null : arrivee;
}

/**
 * Pose l'attribution sur une URL d'inscription existante, sans toucher à
 * `src`, `plan`, `period` ni `lang`. Sans attribution, l'URL reste celle du
 * repli (`marketing` / `cta` / `trial`).
 *
 * Avec une attribution, on transmet ce qui est connu et rien d'autre : un
 * visiteur arrivé avec le seul `utm_source=chatgpt.com` ne reçoit pas un
 * `utm_medium=cta` qui ferait croire à une campagne de CTA. L'emplacement du
 * bouton, lui, reste dans `src`.
 */
export function appliquerAttribution(url: URL, a: Attribution | null): URL {
  if (!a || !valeurAttributionValide(a.source)) return url;
  url.searchParams.set('utm_source', a.source);
  if (a.medium && valeurAttributionValide(a.medium)) url.searchParams.set('utm_medium', a.medium);
  else url.searchParams.delete('utm_medium');
  if (a.campaign && valeurAttributionValide(a.campaign)) {
    url.searchParams.set('utm_campaign', a.campaign);
  } else url.searchParams.delete('utm_campaign');
  return url;
}

export interface OptionsInscription {
  plan?: string;
  period?: 'monthly' | 'yearly';
  lang?: string;
  attribution?: Attribution | null;
}

/**
 * Le lien d'essai. `buildSignupUrl` (constants.ts) y délègue.
 * Best-effort : retombe sur `base` nu si l'URL est invalide.
 */
export function construireUrlInscription(
  base: string,
  emplacement: string,
  opts: OptionsInscription = {},
): string {
  try {
    const url = new URL(base);
    url.searchParams.set('utm_source', ATTRIBUTION_REPLI.source);
    url.searchParams.set('utm_medium', ATTRIBUTION_REPLI.medium);
    url.searchParams.set('utm_campaign', ATTRIBUTION_REPLI.campaign);
    url.searchParams.set('src', emplacement);
    if (opts.plan) url.searchParams.set('plan', opts.plan);
    if (opts.period) url.searchParams.set('period', opts.period);
    if (opts.lang) url.searchParams.set('lang', opts.lang);
    appliquerAttribution(url, opts.attribution ?? null);
    return url.toString();
  } catch {
    return base;
  }
}

/** Vrai si `href` est un lien vers la page d'inscription `base`. */
export function estLienInscription(href: string, base: string): boolean {
  try {
    const a = new URL(href);
    const b = new URL(base);
    return a.origin === b.origin && a.pathname === b.pathname;
  } catch {
    return false;
  }
}

/**
 * ── LIENS DE BOUTIQUE AVEC CAMPAGNE (constat M-07) ────────────────────────
 *
 * Apple, « Campaign links » (developer.apple.com/help/app-store-connect-
 * analytics/acquisition/campaign-links, lu le 2026-11-06) : `pt=` est le
 * jeton fournisseur, PROPRE AU COMPTE DÉVELOPPEUR et généré dans App Store
 * Connect à la création du premier lien de campagne ; `ct=` nomme la
 * campagne, 30 caractères au plus. Sans les DEUX, rien n'est attribué : on
 * n'ajoute donc rien tant que `pt` manque.
 *
 * Google Play : le paramètre `referrer` de l'URL de la fiche, encodé, est
 * relu par l'app via l'Install Referrer API (developer.android.com/google/
 * play/installreferrer/library) ; Play Console classe les visites venues d'un
 * lien marqué UTM dans « Tracked channels (UTM) » des rapports d'acquisition
 * (support.google.com/googleplay/android-developer/answer/6263332). Les
 * visites web (play.google.com sur ordinateur) n'y sont PAS comptées.
 *
 * Chiffres agrégés seulement, dans les consoles des boutiques : rien n'est
 * collecté par le site.
 */
export function lienBoutiqueAvecCampagne(
  url: string,
  boutique: 'apple' | 'google',
  emplacement: string,
  reglages: { appleProviderToken?: string; campagnesActives: boolean },
): string {
  if (!reglages.campagnesActives || !valeurAttributionValide(emplacement)) return url;
  try {
    const u = new URL(url);
    if (boutique === 'apple') {
      const pt = reglages.appleProviderToken;
      if (!pt || !/^\d{1,20}$/.test(pt)) return url;
      u.searchParams.set('pt', pt);
      u.searchParams.set('ct', `site-${emplacement}`.slice(0, 30));
      return u.toString();
    }
    u.searchParams.set(
      'referrer',
      `utm_source=iqwine.ai&utm_medium=site&utm_campaign=${emplacement}`,
    );
    return u.toString();
  } catch {
    return url;
  }
}
