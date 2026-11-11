/**
 * LES RÈGLES DE BORD : en-têtes de sécurité, redirections permanentes, slugs
 * anglais. Une seule source, lue par deux hébergements.
 *
 * ── Pourquoi ce module existe ─────────────────────────────────────────────
 * Sur Vercel, `next.config.ts` les applique. Sur Cloudflare, le site est un
 * export statique : `_headers` et `_redirects` sont générés à la construction
 * (`scripts/construire-cloudflare.mjs`) et le Worker (`cloudflare/worker.ts`)
 * pose les mêmes en-têtes sur ses propres réponses. Deux copies de la CSP ou
 * de la liste des redirections dériveraient au premier ajout d'un seul côté.
 *
 * Ce module, comme `lib/locale`, ne doit RIEN importer de Next ni du client :
 * le Worker le regroupe tel quel.
 */
// Extension explicite : ce module est aussi lu par Node sans bundler
// (`scripts/construire-cloudflare.mjs`), qui ne la devine pas.
import { SEGMENTS } from './locale.ts';
import { ajoutsCspMesure } from './mesure.ts';

/**
 * L'environnement lu par l'interrupteur de mesure : celui du build (Node), ou
 * les variables du Worker (`nodejs_compat`). Absent = mesure éteinte.
 */
function environnement(): Record<string, string | undefined> {
  return typeof process !== 'undefined' && process.env ? process.env : {};
}

/**
 * Les pages dont le slug anglais DIFFÈRE du nom de dossier. Ce sont les seules
 * qui demandent une réécriture et une redirection ; `contact` et `beta`, dont
 * le mot est le même dans les deux langues, n'ont besoin de rien.
 */
export const SLUGS_ANGLAIS = Object.entries(SEGMENTS)
  .filter(([dossier, slugs]) => slugs.en !== dossier)
  .map(([dossier, slugs]) => ({ dossier, en: slugs.en }));

/**
 * Content Security Policy, stricte mais compatible avec Next.js, framer-motion,
 * Cloudflare Turnstile et Google Fonts. Le développement exige 'unsafe-eval'
 * pour l'overlay d'erreurs de React.
 *
 * Mesure d'audience (audit 2026-11-06, M-02) : `ajoutsCspMesure` rend des
 * chaînes VIDES tant que `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN` n'est pas posé.
 * Éteinte, la CSP est identique, octet pour octet, à celle d'avant.
 */
export function politiqueDeContenu(isDev: boolean): string {
  const mesure = ajoutsCspMesure(environnement());
  return [
    "default-src 'self'",
    // 'unsafe-inline' requis par l'hydratation de Next et framer-motion ;
    // challenges.cloudflare.com pour le script de Turnstile.
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com${mesure.script}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    `connect-src 'self' https://challenges.cloudflare.com${mesure.connect}`,
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    // ── PAS d'upgrade-insecure-requests EN DEV (2026-08-12) ──────────────
    // Le serveur de dev se consulte en HTTP pur via Tailscale
    // (http://100.x.x.x:3020). Cette directive force alors CHAQUE asset vers
    // https://100.x.x.x:3020, qui n'écoute pas en TLS : la page arrive nue,
    // sans CSS ni images. `localhost` y échappe (origine « de confiance »
    // pour Chrome), c'est pourquoi le bug n'apparaît QUE depuis une autre
    // machine. En production, derrière Cloudflare, la directive reste.
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}

/** Les en-têtes de sécurité posés sur TOUTES les réponses. */
export function enTetesDeSecurite(isDev: boolean): { key: string; value: string }[] {
  return [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    // Les ressources du site ne se chargent que depuis iqwine.ai et ses sous-domaines
    // (Mozilla Observatory, 2026-11-11). Les aperçus des réseaux, lus par leurs serveurs, ne
    // sont pas concernés : la règle ne vaut que pour les navigateurs.
    { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
    // Sans `preload` (décision d'Éric du 2026-11-11) : aucune inscription à la liste
    // préchargée des navigateurs, difficile à annuler et étendue à tous les sous-domaines.
    // HSTS jamais en dev : si le site est un jour consulté via un NOM
    // (MagicDNS Tailscale), un HSTS de deux ans épinglerait ce nom en
    // HTTPS dans le navigateur, irrécupérable côté serveur.
    ...(isDev
      ? []
      : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]),
    { key: 'Content-Security-Policy', value: politiqueDeContenu(isDev) },
    {
      key: 'Permissions-Policy',
      value:
        'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()',
    },
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
  ];
}

/**
 * Les redirections permanentes, toutes à un seul saut. L'historique de chaque
 * groupe est raconté dans `next.config.ts`, à l'endroit où Vercel les applique.
 */
export function redirectionsPermanentes(origine = ''): { source: string; destination: string }[] {
  const o = origine.replace(/\/$/, '');
  return [
    // Les anciens slugs anglais (nom de dossier) vers le slug public.
    ...SLUGS_ANGLAIS.map(({ dossier, en }) => ({ source: `/en/${dossier}`, destination: `${o}/en/${en}` })),
    // /recevoir absorbée par /accord-mets-vins (Eric, 2026-08-13).
    { source: '/fr/recevoir', destination: `${o}/fr/accord-mets-vins` },
    { source: '/en/recevoir', destination: `${o}/en/wine-pairing` },
    { source: '/en/entertaining', destination: `${o}/en/wine-pairing` },
    // /recherche absorbée par /choisir-un-vin (Eric, 2026-08-14).
    { source: '/fr/recherche', destination: `${o}/fr/choisir-un-vin` },
    { source: '/en/recherche', destination: `${o}/en/how-to-choose-wine` },
    { source: '/en/search', destination: `${o}/en/how-to-choose-wine` },
  ];
}
