import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
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
    const vers = (path: string) => `${ORIGIN}/fr${path === '/' ? '' : path}`;

    /** Les chemins nus qui existaient AVANT le segment de langue. */
    const ANCIENNES = [
      '/apogee',
      '/beta',
      '/conditions',
      '/confidentialite',
      '/contact',
      '/le-film',
      '/notre-maison',
      '/recevoir',
      '/recherche',
      '/sommelier-ia',
      '/tarifs',
    ];

    return [
      /**
       * `/octave` → `/fr/sommelier-ia`, en UN saut.
       *
       * Elle pointait vers `/sommelier-ia`, qui redirige maintenant elle-même.
       * L'avoir laissée telle quelle aurait créé exactement la chaîne que tout
       * ce bloc cherche à éviter — et sur la page la plus liée du site.
       */
      { source: '/octave', destination: vers('/sommelier-ia'), permanent: true },

      ...ANCIENNES.map((path) => ({
        source: path,
        destination: vers(path),
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
