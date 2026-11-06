import { NextResponse, type NextRequest } from 'next/server';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  isLocale,
  localePath,
  resoudreAlias,
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
 * ── Une page intérieure : 308 vers le français, 307 vers l'anglais ────────
 * Un chemin nu intérieur (`/tarifs`) répondait lui aussi en 307. Search
 * Console a montré le prix (2026-11-06) : une redirection temporaire dit
 * « l'adresse durable, c'est moi », Google l'a retenue comme canonique, et les
 * 13 pages françaises intérieures sortaient de l'index comme doublons.
 *
 * Le repli français (Google n'envoie ni cookie ni `Accept-Language`) part
 * donc en 308 : c'est l'adresse que le `x-default` de la page désigne. Une
 * personne dont le choix ou le navigateur dit « anglais » garde sa 307 vers
 * `/en/…`. Comme la réponse dépend de la requête, elle n'est mise en cache
 * nulle part (`private, no-store`) et le dit (`Vary`).
 */

export function middleware(req: NextRequest): NextResponse {
  const { pathname, search } = req.nextUrl;
  const { locale: dejaLocalise, rest } = splitLocalePath(pathname);

  // Déjà dans une langue : l'URL fait autorité, on ne s'en mêle plus.
  if (dejaLocalise !== null) return NextResponse.next();

  const memorise = req.cookies.get(LOCALE_COOKIE)?.value;
  const cible = isLocale(memorise)
    ? memorise
    : negotiateLocale(req.headers.get('accept-language'));

  const url = req.nextUrl.clone();
  // `resoudreAlias` AVANT `localePath` : `/octave` devient `/sommelier-ia`,
  // puis se localise en `/en/ai-sommelier`. Un seul saut, dans la bonne langue.
  // Passer par une redirection de configuration aurait imposé le français, ou
  // ajouté un second saut.
  url.pathname = localePath(resoudreAlias(rest), cible);
  // Les paramètres de campagne et les ancres survivent : `search` est recopié,
  // et un fragment n'atteint jamais le serveur — le navigateur le rattache
  // lui-même à la destination. Un lien profond partagé reste un lien profond.
  url.search = search;

  const interieure = rest !== '/';
  const res = NextResponse.redirect(url, interieure && cible === DEFAULT_LOCALE ? 308 : 307);
  // Une réponse qui dépend du cookie et de la langue ne se partage pas : aucun
  // cache, ni navigateur ni CDN, ne doit resservir le saut d'un autre.
  res.headers.set('Vary', 'Cookie, Accept-Language');
  res.headers.set('Cache-Control', 'private, no-store');

  // On mémorise la langue NÉGOCIÉE aussi. Sans cela, un visiteur repasserait
  // par la négociation à chaque retour sur la racine, et un changement manuel
  // fait depuis une page intérieure serait oublié dès qu'il revient à l'accueil.
  if (!isLocale(memorise)) {
    res.cookies.set(LOCALE_COOKIE, cible, {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: 'lax',
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
