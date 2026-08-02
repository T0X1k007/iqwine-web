/**
 * LA LANGUE EST DANS L'URL — et nulle part ailleurs (MFP-09, GO d'Eric).
 *
 * ── Ce que ce module remplace ─────────────────────────────────────────────
 * Le site choisissait sa langue côté CLIENT : `localStorage`, lu après le
 * montage. Trois conséquences, toutes silencieuses :
 *
 *   · un robot ne voyait JAMAIS que le rendu par défaut, le français. Tout le
 *     contenu anglais était invisible pour Google et Bing ;
 *   · **deux langues vivaient sous une même URL** — ce que les moteurs
 *     traitent comme du contenu instable, et ce qu'aucun `hreflang` ne peut
 *     décrire ;
 *   · sans JavaScript, il n'y avait pas d'anglais du tout.
 *
 * Désormais la langue est un SEGMENT D'URL. Elle est donc connue au moment du
 * rendu serveur, avant toute hydratation, et chaque langue a sa page.
 *
 * ── Ce module ne doit RIEN importer de client ─────────────────────────────
 * Il est lu par le middleware, par `generateMetadata`, par le sitemap et par
 * les composants serveur. Une seule dépendance vers React le rendrait
 * inutilisable dans le middleware — et l'on se retrouverait à réécrire la
 * négociation ailleurs, donc à la voir diverger.
 */

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * Le français est le défaut : le produit est québécois, le marché d'origine
 * est francophone, et c'est ce que le site servait jusqu'ici. Un `x-default`
 * pointant vers le français est donc la vérité, pas une commodité.
 */
export const DEFAULT_LOCALE: Locale = 'fr';

/** Étiquette BCP-47, pour `<html lang>`, `hreflang` et `Intl`. */
export const BCP47: Record<Locale, string> = {
  fr: 'fr-CA',
  en: 'en-CA',
};

/** Nom de la langue dans SA propre langue — jamais traduit. */
export const LOCALE_NAME: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
};

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v);
}

/**
 * Le cookie qui mémorise un choix MANUEL.
 *
 * Il ne sert qu'à la redirection depuis la racine. Une fois sur `/fr/…` ou
 * `/en/…`, c'est l'URL qui décide — le cookie ne peut jamais contredire le
 * chemin, sinon on retomberait sur « deux langues sous une même URL ».
 */
export const LOCALE_COOKIE = 'iqwine-locale';

/** Un an : un choix de langue n'a pas de raison d'expirer avant. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Découpe un chemin en (langue, reste).
 *
 * `/fr/tarifs` → `{ locale: 'fr', rest: '/tarifs' }`
 * `/tarifs`    → `{ locale: null, rest: '/tarifs' }`
 */
export function splitLocalePath(pathname: string): { locale: Locale | null; rest: string } {
  const segments = pathname.split('/');
  const premier = segments[1];
  if (isLocale(premier)) {
    const rest = '/' + segments.slice(2).join('/');
    return { locale: premier, rest: rest === '/' ? '/' : rest.replace(/\/$/, '') };
  }
  return { locale: null, rest: pathname };
}

/** Construit l'URL localisée d'un chemin nu. `/tarifs` + `en` → `/en/tarifs`. */
export function localePath(rest: string, locale: Locale): string {
  const propre = rest === '/' ? '' : rest.startsWith('/') ? rest : `/${rest}`;
  return `/${locale}${propre}`;
}

/**
 * L'équivalent EXACT de la page courante dans l'autre langue.
 *
 * C'est l'exigence n°4 : un sélecteur qui renverrait à l'accueil ferait perdre
 * sa page à quiconque change de langue, et c'est le moment précis où il ne faut
 * pas la lui faire perdre.
 */
export function alternatePath(pathname: string, cible: Locale): string {
  const { rest } = splitLocalePath(pathname);
  return localePath(rest, cible);
}

/**
 * Négocie la langue depuis `Accept-Language`.
 *
 * ── Jamais l'adresse IP ───────────────────────────────────────────────────
 * Exigence n°6, et elle est fondée : un Québécois anglophone en voyage, un
 * francophone derrière un VPN, un robot indexant depuis la Californie — l'IP
 * dit d'où part la requête, jamais quelle langue on lit. La rediriger sur cette
 * base, c'est se tromper sur exactement les gens qu'on cherche à servir.
 *
 * ── Et jamais autre chose qu'une redirection INITIALE ─────────────────────
 * Cette négociation ne s'applique qu'à la racine, et seulement en l'absence de
 * choix mémorisé. Un choix manuel l'emporte toujours (exigence n°2).
 */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const candidats = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      const poids = q ? Number.parseFloat(q.split('=')[1] ?? '1') : 1;
      return { tag: (tag ?? '').trim().toLowerCase(), poids: Number.isNaN(poids) ? 0 : poids };
    })
    .filter((c) => c.tag.length > 0)
    .sort((a, b) => b.poids - a.poids);

  for (const c of candidats) {
    // `en-CA`, `en-US`, `en` → anglais. Idem pour le français.
    const base = c.tag.split('-')[0];
    if (isLocale(base)) return base;
    if (c.tag === '*') return DEFAULT_LOCALE;
  }
  return DEFAULT_LOCALE;
}

/**
 * L'origine canonique du site.
 *
 * ── Préparée pour la bascule vers `iqwine.ai` ─────────────────────────────
 * Elle est lue depuis l'environnement, en un seul endroit. Le jour de la
 * migration, changer `NEXT_PUBLIC_SITE_URL` déplace ENSEMBLE les canonicals,
 * les `hreflang`, le sitemap, les données structurées et les redirections —
 * ce qui est exactement ce qu'il faut pour que domaine et langue changent en
 * UNE opération, sans chaîne de redirections intermédiaire.
 */
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.iqwine.ca'
).replace(/\/$/, '');

/** URL absolue et canonique d'un chemin nu, dans une langue. */
export function absoluteUrl(rest: string, locale: Locale): string {
  return `${SITE_ORIGIN}${localePath(rest, locale)}`;
}

/**
 * Le bloc `alternates` de Next : canonical + hreflang + x-default.
 *
 * `x-default` pointe vers le FRANÇAIS et non vers la racine : la racine
 * redirige, et déclarer une URL qui redirige comme `x-default` fait pointer les
 * moteurs vers un saut plutôt que vers une page.
 */
export function alternatesFor(rest: string, locale: Locale) {
  return {
    canonical: absoluteUrl(rest, locale),
    languages: {
      'fr-CA': absoluteUrl(rest, 'fr'),
      'en-CA': absoluteUrl(rest, 'en'),
      'x-default': absoluteUrl(rest, DEFAULT_LOCALE),
    },
  };
}
