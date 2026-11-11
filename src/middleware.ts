import { NextResponse, type NextRequest } from 'next/server';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  isLocale,
  localePath,
  resoudreAlias,
  segmentCanonique,
  negotiateLocale,
  splitLocalePath,
} from '@/lib/locale';

/**
 * REDIRECTION INITIALE VERS UNE LANGUE — et rien d'autre.
 *
 * ── Ce que ce middleware fait, précisément ────────────────────────────────
 * Il n'agit que sur les chemins SANS segment de langue. Une fois sur `/fr/…`
 * ou `/en/…`, il ne touche plus à rien : c'est l'URL qui décide, et une
 * réécriture ultérieure ferait exactement ce qu'on cherche à éliminer — deux
 * langues sous une même adresse.
 *
 * ── L'ordre de préséance, et il n'est pas négociable ──────────────────────
 *   1. **le choix manuel mémorisé** (cookie), toujours ;
 *   2. sinon, `Accept-Language` ;
 *   3. sinon, le français.
 *
 * Le cookie passe AVANT la négociation parce qu'un choix explicite l'emporte
 * sur une préférence système : quelqu'un qui a cliqué « English » sur un
 * navigateur configuré en français a dit ce qu'il voulait, et le lui redemander
 * à chaque visite serait ignorer sa réponse.
 *
 * ── Jamais l'adresse IP ───────────────────────────────────────────────────
 * L'IP dit d'où part la requête, jamais quelle langue on lit. Un Québécois
 * anglophone en voyage, un francophone derrière un VPN, un robot indexant
 * depuis la Californie : s'en servir, c'est se tromper précisément sur les gens
 * qu'on cherche à servir.
 *
 * ── La racine : 307, et c'est délibéré ────────────────────────────────────
 * La racine n'a pas UNE destination : elle en a deux, selon la personne. Un 308
 * la graverait dans le cache du navigateur ET dans l'index des moteurs — le
 * premier visiteur figerait la langue de tous les suivants sur ce cache, et
 * quelqu'un qui change de langue verrait sa racine continuer de le renvoyer à
 * l'ancienne. Les redirections PERMANENTES d'anciennes URL vers les nouvelles
 * vivent dans `next.config.ts`.
 *
 * ── Une page intérieure : 308 vers le français, toujours ──────────────────
 * Un chemin nu intérieur (`/tarifs`) répondait lui aussi en 307 négocié.
 * Search Console (2026-11-06) montre que Google retenait ces chemins nus comme
 * canoniques et classait les 13 pages françaises intérieures en doublons.
 *
 * Un chemin nu intérieur redirige donc en 308 vers sa version française, la
 * même pour tout le monde : une redirection PERMANENTE ne doit jamais dépendre
 * d'un cookie ni d'une langue, sinon un cache (navigateur, CDN) qui la garde
 * resservirait à l'un le choix de l'autre. Elle n'a ni `Vary` ni cookie, et se
 * met en cache sans risque. Ces chemins ne servent plus qu'aux anciens liens
 * (le site lie toujours des URL de langue) ; un anglophone qui en suit un
 * arrive en français et bascule d'un geste. Seul l'accueil négocie.
 */

export function middleware(req: NextRequest): NextResponse {
  const { pathname, search } = req.nextUrl;
  const { locale: dejaLocalise, rest } = splitLocalePath(pathname);

  // Déjà dans une langue : l'URL fait autorité, on ne s'en mêle plus.
  if (dejaLocalise !== null) return NextResponse.next();

  const url = req.nextUrl.clone();
  // Les paramètres de campagne et les ancres survivent : `search` est recopié,
  // et un fragment n'atteint jamais le serveur — le navigateur le rattache
  // lui-même à la destination. Un lien profond partagé reste un lien profond.
  url.search = search;

  if (rest !== '/') {
    // `resoudreAlias` AVANT `localePath` : `/octave` devient `/sommelier-ia`,
    // puis se localise en `/fr/sommelier-ia`. Un seul saut, identique pour tous.
    // Un slug ANGLAIS sans préfixe (`/pricing`, `/wine-pairing`) désigne la
    // version anglaise : il y va, toujours. Sinon `/fr/pricing` serait un 404.
    // La cible ne dépend que du chemin : la 308 reste identique pour tous.
    const [premier, ...suite] = rest.replace(/^\//, '').split('/');
    const canoniqueEn = segmentCanonique(premier ?? '', 'en');
    if (premier && canoniqueEn !== premier) {
      url.pathname = localePath(['', canoniqueEn, ...suite].join('/'), 'en');
    } else {
      url.pathname = localePath(resoudreAlias(rest), DEFAULT_LOCALE);
    }
    return NextResponse.redirect(url, 308);
  }

  const memorise = req.cookies.get(LOCALE_COOKIE)?.value;
  const cible = isLocale(memorise)
    ? memorise
    : negotiateLocale(req.headers.get('accept-language'));

  url.pathname = localePath('/', cible);
  const res = NextResponse.redirect(url, 307);
  // La racine dépend du cookie et de la langue : aucun cache, ni navigateur ni
  // CDN, ne doit resservir le saut d'un autre, et la réponse le dit.
  res.headers.set('Vary', 'Cookie, Accept-Language');
  res.headers.set('Cache-Control', 'private, no-store');

  // On mémorise la langue NÉGOCIÉE aussi. Sans cela, un visiteur repasserait
  // par la négociation à chaque retour sur la racine.
  if (!isLocale(memorise)) {
    res.cookies.set(LOCALE_COOKIE, cible, {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: 'lax',
      // Jamais en clair (Mozilla Observatory, 2026-11-11) : HSTS protège déjà, Secure le dit.
      secure: true,
    });
  }
  return res;
}

/**
 * Ne s'exécute que là où c'est utile.
 *
 * Sont exclus : les fichiers d'infrastructure SEO qui ne SONT pas des pages et
 * ne doivent surtout pas être redirigés (`robots.txt`, `sitemap.xml`,
 * `llms.txt`), les routes d'API, les ressources Next, et tout ce qui porte une
 * extension — une image redirigée vers `/fr/image.png` serait un 404.
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|robots.txt|sitemap.xml|llms.txt|manifest.webmanifest|.*\\.[\\w]+$).*)',
  ],
};
