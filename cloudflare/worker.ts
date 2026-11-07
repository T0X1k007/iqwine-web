/**
 * LE WORKER DU SITE iqwine.ai SUR CLOUDFLARE.
 *
 * ── Ce qu'il fait, et pourquoi si peu ─────────────────────────────────────
 * Les pages sont des fichiers (`out/`, cf. `scripts/construire-cloudflare.mjs`)
 * servis par Cloudflare SANS passer par ce code. Il ne s'exécute que pour une
 * requête qui ne correspond à aucun fichier :
 *
 *   - `POST /api/contact` : le relais du formulaire (`lib/relais-contact`) ;
 *   - `/<clé>.txt` et `/api/indexnow-key` : la preuve IndexNow ;
 *   - un chemin sans langue (`/`, `/tarifs`, `/octave`) : la logique de
 *     `src/middleware.ts`, à l'identique ;
 *   - tout le reste : la page 404 du site, avec le statut 404.
 *
 * Chacune de ces branches tient en une fraction de milliseconde de processeur,
 * loin des 10 ms du plan gratuit qui avaient arrêté la tentative d'août.
 */
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  isLocale,
  localePath,
  negotiateLocale,
  resoudreAlias,
  segmentCanonique,
  splitLocalePath,
} from '../src/lib/locale';
import { enTetesDeSecurite } from '../src/lib/regles-de-bord';
import { traiterContact } from '../src/lib/relais-contact';
import { turnstileArme } from '../src/lib/turnstile';

interface Env {
  ASSETS: { fetch(request: Request | string): Promise<Response> };
  INDEXNOW_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

/** Les en-têtes de sécurité, posés aussi sur ce que le Worker répond lui-même. */
function securiser(reponse: Response): Response {
  const r = new Response(reponse.body, reponse);
  for (const { key, value } of enTetesDeSecurite(false)) {
    if (!r.headers.has(key)) r.headers.set(key, value);
  }
  return r;
}

function redirection(url: URL, statut: 307 | 308): Response {
  return new Response(null, { status: statut, headers: { Location: url.toString() } });
}

/** `src/middleware.ts`, à l'identique. Voir ce fichier pour le raisonnement. */
function langue(requete: Request, url: URL): Response | null {
  const { locale: dejaLocalise, rest } = splitLocalePath(url.pathname);
  if (dejaLocalise !== null) return null;

  const cible = new URL(url);
  if (rest !== '/') {
    const [premier, ...suite] = rest.replace(/^\//, '').split('/');
    const canoniqueEn = segmentCanonique(premier ?? '', 'en');
    cible.pathname =
      premier && canoniqueEn !== premier
        ? localePath(['', canoniqueEn, ...suite].join('/'), 'en')
        : localePath(resoudreAlias(rest), DEFAULT_LOCALE);
    return redirection(cible, 308);
  }

  const cookie = requete.headers.get('cookie') ?? '';
  const memorise = cookie.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`))?.[1];
  const choisie = isLocale(memorise) ? memorise : negotiateLocale(requete.headers.get('accept-language'));

  cible.pathname = localePath('/', choisie);
  const r = redirection(cible, 307);
  r.headers.set('Vary', 'Cookie, Accept-Language');
  r.headers.set('Cache-Control', 'private, no-store');
  if (!isLocale(memorise)) {
    r.headers.append(
      'Set-Cookie',
      `${LOCALE_COOKIE}=${choisie}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`,
    );
  }
  return r;
}

/** La clé IndexNow, servie seulement à son propre nom (cf. `api/indexnow-key`). */
function cleIndexNow(env: Env, url: URL): Response | null {
  const demandee =
    url.pathname === '/api/indexnow-key'
      ? null
      : url.pathname.match(/^\/([A-Za-z0-9]{8,128})\.txt$/)?.[1];
  if (demandee === undefined) return null;

  const cle = env.INDEXNOW_KEY;
  if (!cle || cle.length < 8) return new Response('IndexNow non configuré', { status: 404 });
  if (demandee !== null && demandee !== cle) return null;
  return new Response(cle, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=86400' },
  });
}

export default {
  async fetch(requete: Request, env: Env): Promise<Response> {
    const url = new URL(requete.url);

    if (url.pathname === '/api/contact') {
      if (requete.method !== 'POST') return securiser(new Response(null, { status: 405 }));
      // Sans secret, `verifierTurnstile` laisserait tout passer. Sur Vercel ce
      // n'est qu'un avertissement ; ici, on préfère refuser que d'ouvrir le
      // formulaire aux robots le jour où le secret manquerait.
      if (!turnstileArme()) {
        return securiser(Response.json({ error: 'Formulaire momentanément indisponible.' }, { status: 503 }));
      }
      return securiser(await traiterContact(requete));
    }

    const cle = cleIndexNow(env, url);
    if (cle) return securiser(cle);

    // Un chemin avec une extension, ou sous `/api`, n'est jamais une page.
    if (!url.pathname.startsWith('/api/') && !/\.[\w]+$/.test(url.pathname)) {
      const r = langue(requete, url);
      if (r) return securiser(r);
    }

    // Aucun fichier, aucune règle : la page 404 du site (`not_found_handling`).
    return securiser(await env.ASSETS.fetch(requete));
  },
};
