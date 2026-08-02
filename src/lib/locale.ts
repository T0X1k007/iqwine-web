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
 * Le REPLI final de la négociation — pas la langue « par défaut du site ».
 *
 * La nuance est celle qu'Eric a tranchée. Le français est le repli
 * OPÉRATIONNEL du lancement au Québec : c'est ce qu'on sert quand ni le
 * souvenir, ni le profil, ni le navigateur ne disent rien. Ce n'est pas une
 * propriété du site, et `x-default` ne le déclare donc PAS — il désigne la
 * racine neutre, qui négocie.
 *
 * Le jour où l'anglais pèse davantage, changer cette ligne change le repli
 * sans rien dire de faux aux moteurs entre-temps.
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
 * Le cookie de langue — MÊME NOM que celui de l'application.
 *
 * ── Ce que ce partage de nom résout ──────────────────────────────────────
 * L'application écrit `iqwine-locale` depuis `User.locale`, la langue du
 * PROFIL. Dès que ce cookie porte un domaine couvrant les deux hôtes
 * (`.iqwine.ai`), le site marketing le lit sans code supplémentaire : la
 * priorité « langue du profil pour un utilisateur connecté » tombe d'elle-même.
 *
 * ── L'ordre réel, et pourquoi il vaut mieux qu'une cascade rigide ────────
 * Les deux premières priorités d'Eric — choix mémorisé, puis langue du profil —
 * écrivent le MÊME cookie. C'est donc le geste le plus RÉCENT qui l'emporte :
 * changer sa langue dans l'application la propage au site, cliquer FR/EN sur le
 * site l'emporte à son tour. Une cascade à quatre niveaux, elle, aurait figé
 * une préséance et fait ignorer l'un des deux gestes selon l'ordre — sans
 * jamais dire lequel.
 *
 * Viennent ensuite `Accept-Language`, puis le repli.
 *
 * ── Ce que le cookie ne fait JAMAIS ──────────────────────────────────────
 * Il ne sert qu'à la redirection depuis un chemin sans langue. Une fois sur
 * `/fr/…` ou `/en/…`, c'est l'URL qui décide : le cookie ne peut pas
 * contredire le chemin, sinon on retomberait sur « deux langues sous une même
 * URL ».
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
 * ── La bascule a EU LIEU le 2026-08-02 ────────────────────────────────────
 * Elle est lue depuis l'environnement, en un seul endroit — et c'est ce qui a
 * permis de déplacer ENSEMBLE les canonicals, les `hreflang`, le sitemap, les
 * données structurées et les redirections, en une opération.
 *
 * Le repli suit maintenant la variable : `https://iqwine.ai`, **l'apex**, pas
 * `www.` — depuis la bascule, c'est `www.` qui redirige vers l'apex, et non
 * l'inverse. Laisser l'ancienne valeur ferait annoncer un domaine mort partout
 * où la variable manque, sans qu'aucun build n'échoue : la panne la plus chère
 * d'une migration est celle qui a l'air d'avoir réussi.
 */
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://iqwine.ai'
).replace(/\/$/, '');

/** URL absolue et canonique d'un chemin nu, dans une langue. */
export function absoluteUrl(rest: string, locale: Locale): string {
  return `${SITE_ORIGIN}${localePath(rest, locale)}`;
}

/**
 * Le bloc `alternates` de Next : canonical + hreflang + x-default.
 *
 * ── `x-default` pointe vers la RACINE, et c'est délibéré (décision d'Eric) ─
 * Il désigne le point d'entrée NEUTRE : `https://iqwine.ai/`, qui négocie et
 * oriente. Il ne désigne pas le français.
 *
 * La distinction n'est pas théorique. `x-default` répond à « quelle version
 * servir à quelqu'un dont je ne sais pas la langue ? ». Y mettre le français
 * répondrait « le français », ce qui est un repli OPÉRATIONNEL — vrai pour le
 * lancement au Québec — et non une propriété du site. Le jour où l'anglais
 * pèse davantage, la réponse changerait sans qu'aucune balise ne l'ait dit.
 *
 * ── Et pourquoi une URL qui REDIRIGE est ici correcte ────────────────────
 * Un `canonical` ne doit jamais pointer vers une redirection — il désigne LA
 * page, et un saut n'est pas une page. `x-default` désigne au contraire un
 * comportement : Google documente explicitement la page qui détecte et
 * redirige comme son cas d'usage. Les deux règles se contrediraient si elles
 * répondaient à la même question ; elles n'y répondent pas.
 */
export function alternatesFor(rest: string, locale: Locale) {
  return {
    canonical: absoluteUrl(rest, locale),
    languages: {
      'fr-CA': absoluteUrl(rest, 'fr'),
      'en-CA': absoluteUrl(rest, 'en'),
      // La racine du CHEMIN, sans langue : `/tarifs` pour la page tarifs,
      // `/` pour l'accueil. Chacune a son propre point d'entrée neutre, qui
      // négocie et redirige vers la bonne langue de CETTE page.
      'x-default': `${SITE_ORIGIN}${rest === '/' ? '/' : rest}`,
    },
  };
}
