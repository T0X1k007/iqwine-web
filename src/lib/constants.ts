import type { Locale } from './i18n';
import { SIGNUP_CTA, SIGNUP_REASSURANCE, TRIAL_ON_SIGNUP } from '@/lib/trial';
import {
  construireUrlInscription,
  lienBoutiqueAvecCampagne,
  type Attribution,
} from '@/lib/attribution';
import { APP_STORE_PROVIDER_TOKEN, CAMPAGNES_BOUTIQUES } from '@/lib/mesure';

/**
 * URL d'essai self-serve (app produit). Le CTA primaire mène à un essai
 * RÉEL sans carte, plus de gate bloquant côté marketing. La DURÉE de
 * l'essai n'est pas écrite ici : elle vit dans `src/lib/trial.ts`, seule
 * source, parce qu'elle a deux bornes et qu'on n'en a longtemps écrit qu'une.
 * Override possible via NEXT_PUBLIC_APP_SIGNUP_URL.
 */
export const APP_SIGNUP_URL =
  process.env.NEXT_PUBLIC_APP_SIGNUP_URL || 'https://app.iqwine.ai/signup';

/**
 * URL de connexion (app produit) pour les utilisateurs existants.
 * Override possible via NEXT_PUBLIC_APP_LOGIN_URL.
 */
export const APP_LOGIN_URL =
  process.env.NEXT_PUBLIC_APP_LOGIN_URL || 'https://app.iqwine.ai/login';

/**
 * iOS 1.0 EST PUBLIÉE (2026-08-28). URL App Store canonique, boutique CA.
 *
 * Elle sert au badge App Store (`BadgesPlateformes`) et, si un jour on active
 * `CTA_VERS_STORE` ci-dessous, aux CTA de la page d'accueil.
 *
 * ── Le segment de nom suit le nom de la fiche (audit du 2026-11-06) ───────
 * Elle portait `iqwine-sommelier-ia-vins`, l'ancien nom de la fiche. Apple ne
 * lit que l'identifiant (`id6798458954`) et redirige tout autre segment : le
 * lien n'était donc pas cassé, mais il n'était plus l'adresse canonique, celle
 * que la fiche française déclare elle-même (`rel="canonical"` de la page
 * servie avec `?l=fr-CA`, vérifié par curl le 2026-11-06).
 *
 * ⚠️ Sans `?l=fr-CA`, Apple renvoie encore cette adresse en 301 vers le
 * segment anglais (`iqwine-personal-sommelier`) de la boutique CA : la langue
 * de la fiche se choisit par ce paramètre, pas par le segment. Une URL par
 * langue éviterait ce saut ; elle demanderait de localiser cette constante,
 * ce que ce lot ne fait pas.
 */
export const APP_STORE_URL =
  'https://apps.apple.com/ca/app/iqwine-sommelier-personnel/id6798458954';

/**
 * Android 1.0 EST PUBLIÉE (2026-09-16), approuvée par Google Play. URL Play
 * Store canonique, identifiant d'application `ca.iqwine.app`.
 *
 * C'est cette constante, et elle seule, qui pilote la plaque Android de
 * `BadgesPlateformes` : une URL en fait un lien « Disponible sur Android »,
 * `null` la ramène à l'annonce « Bientôt disponible », désactivée. Le type
 * garde donc son `| null`, pour qu'un retrait de la boutique reste un `null`
 * à poser ici, sans toucher au composant.
 */
export const PLAY_STORE_URL: string | null =
  'https://play.google.com/store/apps/details?id=ca.iqwine.app';

/**
 * LA BASCULE DES CTA (décision d'Eric, 2026-08-28).
 *
 * La conception du 2026-08-12 liait le libellé du CTA principal à la
 * publication : `APP_STORE_URL !== null` faisait passer le hero et la
 * résolution de « Rencontrer Octave » à « Télécharger iQWine ». iOS est
 * publiée depuis, et cette bascule n'a délibérément PAS été activée :
 *
 *   - le gros du trafic d'une page d'accueil est sur ordinateur, où un lien
 *     de boutique est un cul-de-sac ;
 *   - la ligne « Essai gratuit · Sans carte » qui accompagne les deux CTA
 *     deviendrait un contresens, les boutiques ne connaissent pas notre essai.
 *
 * Une troisième raison a existé jusqu'au 2026-09-16 : « Android n'est pas
 * publiée, un visiteur Android à qui l'on dit Télécharger ne trouve rien. »
 * Elle est tombée, l'application Android est en ligne. Les deux autres
 * tiennent, la bascule reste donc au repos.
 *
 * La disponibilité mobile se dit désormais par les badges, et le CTA continue
 * de faire entrer TOUT LE MONDE dans l'essai. Passer ce booléen à `true`
 * rebascule les deux CTA sans autre changement — mais il faudra alors revoir
 * la ligne d'essai qui les suit, elle ne vaudra plus.
 */
export const CTA_VERS_STORE = false;

/**
 * Construit l'URL d'essai en propageant l'attribution vers l'app (cross-domain) :
 * UTM + source (emplacement du CTA) + plan/période/langue éventuels.
 * L'app cellier-vin lit ces params au signup pour boucler visiteur→essai→payant.
 * Best-effort : retombe sur APP_SIGNUP_URL nu si l'URL est invalide.
 *
 * ── `utm_source=marketing` n'est plus qu'un REPLI (audit 2026-11-06, M-03) ──
 * Le rendu serveur ne connaît pas la provenance du visiteur : il écrit le
 * repli. Le composant `AttributionArrivee` relit au clic la source gardée à
 * l'atterrissage et la pose à sa place, par `appliquerAttribution`, la même
 * logique que l'option `attribution` ci-dessous (`src/lib/attribution.ts`).
 * `src` garde toujours l'emplacement du CTA.
 */
export function buildSignupUrl(
  source: string,
  opts?: {
    plan?: string;
    period?: 'monthly' | 'yearly';
    lang?: Locale;
    attribution?: Attribution | null;
  },
): string {
  return construireUrlInscription(APP_SIGNUP_URL, source, opts);
}

/**
 * Lien de boutique, avec les paramètres de campagne SI l'interrupteur
 * `NEXT_PUBLIC_CAMPAGNES_BOUTIQUES` est posé (et, pour Apple, le jeton
 * fournisseur). Sinon : l'URL canonique, inchangée. Les données structurées
 * et llms.txt gardent toujours l'URL canonique : seuls les liens cliquables
 * passent par ici.
 */
export function lienBoutique(boutique: 'apple' | 'google', emplacement: string): string {
  const url = boutique === 'apple' ? APP_STORE_URL : PLAY_STORE_URL;
  if (!url) return '';
  return lienBoutiqueAvecCampagne(url, boutique, emplacement, {
    appleProviderToken: APP_STORE_PROVIDER_TOKEN,
    campagnesActives: CAMPAGNES_BOUTIQUES,
  });
}

/**
 * Copywriting iQWine, voix sommelier d'hôtel particulier.
 * Positionnement : « Le système d'intelligence privé de votre cave. »
 * (OS du collectionneur, semé subtilement, pas d'acronyme tech en clair.)
 *
 * Voix : vouvoiement éditorial luxe (FR) · same elevation in EN.
 * Phrases 8-14 mots. Voix active. Pas d'exclamation. Pas de SaaS-speak.
 * Vocabulaire collectionneur permis : collection, réserve, garde,
 * dégustation, millésime, apogée, plateau, finale, élevage.
 */

// ─── Navigation V5 (ancres existantes après condensation) ───
// ── Navigation (architecture Fonctions, validée par Eric le 2026-08-13) ────
// Quatre liens, pas quinze : Octave = QUI il est · Fonctions = CE qu'il fait ·
// Notre histoire = D'OÙ ça vient · Tarifs = COMMENT commencer. Les ancres de
// sections quittent la nav, la home se lit, elle ne se navigue pas.
//
// « Notre histoire » (Eric, 2026-08-14) est un LIBELLÉ de navigation, pas une
// page nouvelle : il pointe les URLs existantes (/notre-maison ↔
// /en/our-story). Aucune redirection, aucun canonical ni hreflang touché,
// aucun H1 modifié — l'identité SEO de la page ne bouge pas d'un octet.
const NAV_LINKS_MAP = {
  en: [
    { label: 'Octave', href: '/sommelier-ia' },
    { label: 'Our story', href: '/notre-maison' },
    { label: 'Pricing', href: '/tarifs' },
  ],
  fr: [
    { label: 'Octave', href: '/sommelier-ia' },
    { label: 'Notre histoire', href: '/notre-maison' },
    { label: 'Tarifs', href: '/tarifs' },
  ],
} as const;

// ── Pages en pause (Eric, 2026-09-25) ─────────────────────────────────────
// Un chemin listé ici reste EN LIGNE à son URL, mais tous les liens internes
// qui le visent (barre, menu mobile, pied de page, pages) deviennent inertes :
// libellé visible, rien à cliquer. LocaleLink fait le tri, un seul endroit.
// Mettre une page en pause : ajouter son chemin. La rouvrir : le retirer.
//
// VIDE depuis le 2026-09-25 : /notre-maison a été refondue et remise en
// ligne le jour même. Le mécanisme reste, c'est lui qui rend la mise en
// pause d'une page immédiate et réversible sans toucher à chaque lien.
export const PAGES_EN_PAUSE: readonly string[] = [];

// ─── Menu « Fonctions » (dropdown), des MOMENTS, jamais des modules ───────
// Tant qu'une page Fonction n'est pas née (ordre L), son entrée mène au
// moment correspondant du hub ; on bascule vers la vraie route à sa naissance.
const FONCTIONS_LINKS_MAP = {
  en: [
    { label: 'Choosing a wine', sous: 'In the store, for your palate', href: '/choisir-un-vin' },
    { label: 'At the restaurant', sous: 'The wine list, read for you', href: '/carte-des-vins' },
    { label: 'Wine pairing', sous: 'The meal is ready, so is the bottle', href: '/accord-mets-vins' },
    { label: 'The cellar', sous: 'Your cave, known by heart', href: '/cellier-intelligent' },
    { label: 'Peak window', sous: 'Every bottle has its moment', href: '/apogee' },
    { label: 'All features →', sous: 'The whole day with Octave', href: '/fonctions' },
  ],
  fr: [
    { label: 'Choisir un vin', sous: 'En magasin, pour votre palais', href: '/choisir-un-vin' },
    { label: 'Au restaurant', sous: 'La carte des vins, lue pour vous', href: '/carte-des-vins' },
    { label: 'Accords mets-vins', sous: 'Le repas est prêt, la bouteille aussi', href: '/accord-mets-vins' },
    { label: 'Le cellier', sous: 'Votre cave, sue par cœur', href: '/cellier-intelligent' },
    { label: 'L’apogée', sous: 'Chaque bouteille a son moment', href: '/apogee' },
    { label: 'Toutes les fonctions →', sous: 'La journée complète avec Octave', href: '/fonctions' },
  ],
} as const;

// ─── Hero ───
// Positionnement OS d'entrée + anchor concret + signal exclusivité subtil.
const HERO_MAP = {
  en: {
    tagline: 'Your personal sommelier.',
    trust: [
      { title: 'Made in Québec', lines: ['Hosted in Canada', 'Private data'] },
      { title: 'Encrypted & private', lines: ['Private by design', 'Never sold'] },
      { title: 'Local availability', lines: ['Verified store by store, near you'] },
      { title: 'No card required', lines: [TRIAL_ON_SIGNUP.en, 'Cancel anytime'] },
    ],
    variantA: {
      eyebrow: 'YOUR PERSONAL SOMMELIER',
      headlineTop: 'Always know',
      headlineBottom: 'which bottle to open.',
      subheadline:
        "Octave knows your cellar, your taste, every bottle's peak and where to find it near you, and turns it all into one decision: the right bottle, at the right moment.",
      categoryLine: 'Others organize your cellar. Octave tells you what to do with it.',
      reassurance: `${SIGNUP_REASSURANCE.en} · No cellar to enter`,
      ctaHeroPrimary: 'Find what to drink tonight',
      ctaHeroSecondary: 'See Octave in action',
    },
    ctaPrimary: SIGNUP_CTA.en,
  },
  fr: {
    tagline: 'Votre sommelier personnel.',
    trust: [
      { title: 'Conçu au Québec', lines: ['Hébergé au Canada', 'Données privées'] },
      { title: 'Chiffré & privé', lines: ['Privé dès la conception', 'Jamais revendu'] },
      { title: 'Disponibilité locale', lines: ['Vérifiée magasin par magasin, près de vous'] },
      { title: 'Aucune carte requise', lines: [TRIAL_ON_SIGNUP.fr, 'Annulable en tout temps'] },
    ],
    variantA: {
      eyebrow: 'VOTRE SOMMELIER PERSONNEL',
      headlineTop: 'Sachez toujours',
      headlineBottom: 'quelle bouteille ouvrir.',
      subheadline:
        "Octave connaît votre cave, votre palais, l'apogée de chaque bouteille et où la trouver près de vous, et transforme tout ça en une décision : la bonne bouteille, au bon moment.",
      categoryLine: 'Les autres rangent votre cave. Octave vous dit quoi en faire.',
      reassurance: `${SIGNUP_REASSURANCE.fr} · Aucune cave à saisir`,
      ctaHeroPrimary: 'Trouver quoi boire ce soir',
      ctaHeroSecondary: 'Voir Octave en action',
    },
    ctaPrimary: SIGNUP_CTA.fr,
  },
};

// ─── Accessor functions ───
export function getNavLinks(locale: Locale) {
  return NAV_LINKS_MAP[locale];
}

export function getFonctionsLinks(locale: Locale) {
  return FONCTIONS_LINKS_MAP[locale];
}
export function getHero(locale: Locale) {
  return HERO_MAP[locale];
}
