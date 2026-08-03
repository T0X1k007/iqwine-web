import type { NextConfig } from 'next';
// La table des slugs est IMPORTÉE, jamais recopiée. Deux listes de routes qui
// dérivent l'une de l'autre, c'est une redirection qui pointe dans le vide le
// jour où l'on en ajoute une seule d'un côté.
import { SEGMENTS } from './src/lib/locale';

/**
 * Les pages dont le slug anglais DIFFÈRE du nom de dossier. Ce sont les seules
 * qui demandent une réécriture et une redirection ; `contact` et `beta`, dont
 * le mot est le même dans les deux langues, n'ont besoin de rien.
 */
const SLUGS_ANGLAIS = Object.entries(SEGMENTS)
  .filter(([dossier, slugs]) => slugs.en !== dossier)
  .map(([dossier, slugs]) => ({ dossier, en: slugs.en }));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    /**
     * ── L'OPTIMISEUR N'EST PLUS UTILISÉ, ET ON LE DIT (2026-08-03) ────────
     *
     * Toutes les images sont pré-converties en AVIF et WebP
     * (`scripts/generer-images.mjs`) et servies par `<picture>` via
     * `components/ui/ImageStatique`. Plus aucun `next/image` dans le dépôt.
     *
     * Le déclarer explicitement plutôt que de laisser la configuration
     * traîner : sur Cloudflare Workers, un `next/image` réintroduit par
     * distraction exigerait Cloudflare Images — un produit facturé — et la
     * panne se manifesterait en production, pas à la construction.
     *
     * Mesuré : 7 621 Ko de PNG → 304 Ko d'AVIF, soit 96 % d'octets en moins,
     * sans différence perceptible à la taille réelle d'affichage.
     */
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  async headers() {
    // Content Security Policy — strict but compatible with Next.js +
    // framer-motion + Cloudflare Turnstile (CAPTCHA) + Google Fonts.
    // Dev mode requires 'unsafe-eval' for React error overlay / sourcemaps.
    const isDev = process.env.NODE_ENV !== 'production';
    const devScriptExtras = isDev ? " 'unsafe-eval'" : '';

    const csp = [
      "default-src 'self'",
      // 'unsafe-inline' required for Next.js hydration + framer-motion animations
      // challenges.cloudflare.com required for Turnstile script
      `script-src 'self' 'unsafe-inline'${devScriptExtras} https://challenges.cloudflare.com`,
      // Google Fonts stylesheets
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob:",
      // Google Fonts font files
      "font-src 'self' data: https://fonts.gstatic.com",
      // Turnstile calls /siteverify and loads its widget from challenges.cloudflare.com
      "connect-src 'self' https://challenges.cloudflare.com",
      // Turnstile renders inside an iframe
      "frame-src https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'Content-Security-Policy', value: csp },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()',
          },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
  /**
   * ── INDEXNOW : LE FICHIER DE CLÉ DOIT VIVRE À LA RACINE ──────────────────
   *
   * Le protocole exige de prouver qu'on contrôle le domaine en servant, à
   * `https://iqwine.ai/<clé>.txt`, un fichier dont le CONTENU est la clé.
   * L'adresse fait partie de la preuve : Bing va chercher là, et nulle part
   * ailleurs.
   *
   * La route existait, mais sous `/api/indexnow-key` — donc introuvable pour
   * le moteur, et de surcroît sous un chemin que notre `robots.txt` interdit.
   * Elle était prête et inatteignable ; c'est le genre d'écart qui se raconte
   * comme « IndexNow est fait ».
   *
   * ── Pourquoi la clé est passée en paramètre ────────────────────────────
   * Sans elle, la réécriture servirait le même contenu pour n'importe quel nom
   * de fichier : `/nimportequoi.txt` révélerait la clé. La route compare donc
   * ce qui est demandé à ce qu'elle connaît, et ne répond que s'ils coïncident.
   *
   * Le motif est borné (8 à 128 caractères alphanumériques) pour ne pas
   * intercepter d'autres `.txt` — `robots.txt` et `llms.txt` gardent leurs
   * propres routes, et le motif ne les capture pas.
   */
  async rewrites() {
    return [
      {
        source: '/:cle([A-Za-z0-9]{8,128}).txt',
        destination: '/api/indexnow-key?k=:cle',
      },

      /**
       * ── LES SLUGS ANGLAIS SERVENT LES PAGES, SANS REDIRECTION ──────────
       *
       * `/en/pricing` rend le contenu de `app/[locale]/tarifs/`. C'est une
       * RÉÉCRITURE, donc invisible : l'adresse affichée reste `/en/pricing`,
       * et c'est elle que le visiteur copie, partage et met en signet.
       *
       * Une redirection aurait fait l'inverse — l'anglophone aurait vu
       * l'adresse française réapparaître dans sa barre, ce que toute cette
       * migration cherche précisément à supprimer.
       *
       * ── Pourquoi cela ne boucle pas avec la redirection ci-dessous ─────
       * Next applique les redirections AVANT les réécritures, et la
       * destination d'une réécriture n'est pas re-soumise aux redirections.
       * `/en/tarifs` reçoit donc son 301 quand il arrive de l'extérieur,
       * tandis que la réécriture l'atteint par l'intérieur sans le déclencher.
       *
       * C'est le point le plus risqué de cette migration — une boucle ici
       * rendrait le site injoignable —, donc il est VÉRIFIÉ par le contrôle 10
       * de `scripts/verifier-routage.mjs` et non supposé.
       */
      ...SLUGS_ANGLAIS.map(({ dossier, en }) => ({
        source: `/en/${en}`,
        destination: `/en/${dossier}`,
      })),
    ];
  },

  async redirects() {
    /**
     * ── LES ANCIENNES URL VERS LES NOUVELLES — EN UN SEUL SAUT ────────────
     *
     * Toutes les pages ont pris un segment de langue : `/tarifs` est devenue
     * `/fr/tarifs`. Chaque ancienne URL doit donc recevoir une redirection
     * PERMANENTE — un lien partagé, un signet, un courriel déjà envoyé doivent
     * continuer d'aboutir.
     *
     * ── Pourquoi vers le FRANÇAIS, et pas vers la racine ─────────────────
     * `/tarifs` a toujours servi du français : c'était le rendu par défaut, le
     * seul que les moteurs aient jamais vu. La redirection préserve donc ce que
     * la page ÉTAIT. La renvoyer vers `/` la ferait passer par la négociation,
     * ce qui ajoute un saut et fait dépendre d'un en-tête la destination d'une
     * redirection permanente — deux choses qu'un 308 ne doit pas faire.
     *
     * ── LA MIGRATION DE DOMAINE EST PRÉPARÉE ICI, PAS PLUS TARD ──────────
     * `REDIRECT_ORIGIN` est vide aujourd'hui : les redirections restent
     * relatives et le domaine ne change pas. Le jour de la bascule vers
     * `iqwine.ai`, on la pose à `https://iqwine.ai` et CES MÊMES règles
     * envoient directement `iqwine.ca/tarifs` → `iqwine.ai/fr/tarifs`.
     *
     * C'est ce qui évite la chaîne. Sans cela, on obtiendrait
     * `iqwine.ca/tarifs` → `iqwine.ca/fr/tarifs` → `iqwine.ai/fr/tarifs` :
     * deux sauts, une part de l'autorité perdue à chacun, et un délai
     * supplémentaire pour chaque visiteur venu d'un vieux lien. Domaine et
     * langue changent donc en UNE opération, comme demandé.
     *
     * ── Ce qui survit à la redirection ───────────────────────────────────
     * Next recopie la chaîne de requête par défaut : les paramètres de campagne
     * (`utm_*`, `ref`) arrivent intacts. Les ancres ne transitent jamais par le
     * serveur — le navigateur les rattache lui-même à la destination. Un lien
     * profond partagé reste donc un lien profond, avec son attribution.
     */
    const ORIGIN = (process.env.REDIRECT_ORIGIN || '').replace(/\/$/, '');

    /**
     * ── LES CHEMINS NUS NE SONT PLUS REDIRIGÉS ICI ──────────────────────
     *
     * `/tarifs`, `/octave` et les neuf autres avaient une redirection
     * permanente vers `/fr/…`. Elle est retirée, et il faut dire pourquoi
     * plutôt que de la voir disparaître d'un diff.
     *
     * ── Ce qui n'allait pas, MESURÉ le 2026-08-03 ───────────────────────
     * Ces redirections s'exécutent AVANT le middleware — vérifié : `/tarifs`
     * rendait 308 vers `/fr/tarifs` quel que soit l'`Accept-Language`, tandis
     * que `/nimporte-quoi`, absent de la liste, était bien négocié en 307 vers
     * `/fr/…` ou `/en/…`.
     *
     * Or `alternatesFor` déclare `x-default` sur ces chemins nus, en affirmant
     * qu'ils « négocient et redirigent vers la bonne langue de CETTE page ».
     * C'était vrai pour l'accueil seulement. Pour toutes les autres pages,
     * `x-default` désignait une adresse qui envoie tout le monde au français —
     * donc un doublon de la déclaration `fr-CA`, et un anglophone arrivant par
     * ce chemin atterrissait dans la mauvaise langue.
     *
     * ── Pourquoi la raison d'origine ne tient plus ──────────────────────
     * Le commentaire retiré disait : « un 308 ne doit pas dépendre d'un
     * en-tête ». C'est juste — et c'est exactement pourquoi ces chemins ne
     * doivent PAS être des 308. Le middleware les rend en 307, temporaire par
     * nature, ce qu'une négociation doit être. La règle est respectée en
     * changeant de code, pas en forçant une langue.
     *
     * ── Et aucune chaîne n'apparaît ─────────────────────────────────────
     * Mesuré : `iqwine.ca/tarifs` faisait DÉJÀ deux sauts (le domaine est
     * redirigé au bord, avant l'application). Après ce changement il en fait
     * toujours deux — mais le second négocie. Sur le domaine actuel,
     * `/tarifs` reste à un seul saut, désormais vers la bonne langue et le bon
     * slug : `/en/pricing` pour un anglophone.
     *
     * `/octave` est résolu par le middleware via `ALIAS` (cf. `lib/locale`),
     * ce qui lui donne lui aussi la négociation et un seul saut.
     */

    return [
      ...SLUGS_ANGLAIS.map(({ dossier, en }) => ({
        source: `/en/${dossier}`,
        destination: `${ORIGIN}/en/${en}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
