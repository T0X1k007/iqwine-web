import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import LeFilmContent from '@/components/film/LeFilmContent';
import { BCP47, type Locale } from '@/lib/locale';

const TEXTES = {
  fr: {
    title: 'Le film · iQWine',
    description:
      'Le film iQWine : une minute pour comprendre ce que change une cave qui se souvient et un sommelier qui vous connaît. Du premier verre au dernier.',
    ogTitle: 'Le film, iQWine',
    ogDescription:
      'Une minute pour comprendre ce que change une cave qui se souvient et un sommelier qui vous connaît.',
  },
  en: {
    title: 'The film · iQWine',
    description:
      'The iQWine film: one minute to see what changes when a cellar remembers and a sommelier knows you. From the first glass to the last.',
    ogTitle: 'The film, iQWine',
    ogDescription:
      'One minute to see what changes when a cellar remembers and a sommelier knows you.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  const base = pageMetadata('/le-film', locale, TEXTES);
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      // `video.other` et la vidéo elle-même survivent au passage bilingue :
      // c'est ce qui donne à cette page son aperçu lisible sur les réseaux, et
      // ce serait le genre de détail qu'une conversion mécanique effacerait.
      type: 'video.other',
      videos: [
        {
          url: 'https://iqwine.ai/video/film-iqwine.mp4',
          type: 'video/mp4',
          width: 1920,
          height: 882,
        },
      ],
    },
  };
}

/**
 * Données structurées VideoObject, éligibilité aux résultats vidéo Google +
 * lecture inline dans la SERP. Le film est SSR (cf. FilmPlayer <source>), donc
 * cohérent avec ce qu'annonce le schema.
 *
 * Le nom et la description suivent la langue servie (audit du 2026-11-06,
 * lot G) : ils étaient en français sur /en/the-film aussi.
 */
const FILM_TEXTES = {
  fr: {
    name: 'iQWine, le film',
    description:
      'Sept chapitres, un seul sommelier, du verre ouvert au bon moment à la carte déchiffrée au restaurant.',
  },
  en: {
    name: 'iQWine, the film',
    description:
      'Seven chapters, one sommelier, from the glass opened at the right moment to the wine list deciphered at the restaurant.',
  },
} as const;

function filmJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    ...FILM_TEXTES[locale],
    inLanguage: BCP47[locale],
    // ── Le domaine COMPTE ici, plus qu'ailleurs ───────────────────────────
    // Ces deux adresses ne sont pas lues par un navigateur mais par l'indexeur
    // vidéo de Google, qui va CHERCHER les fichiers. `www.iqwine.ca` répond 308
    // vers `iqwine.ai`, une redirection inter-domaines sur la ressource même
    // que le schema déclare. Au mieux la vidéo est attribuée à l'ancien
    // domaine, au pire elle n'est pas indexée du tout. Vérifié le 2026-08-03 :
    // les deux fichiers répondent 206 sur `iqwine.ai`.
    thumbnailUrl: 'https://iqwine.ai/video/film-iqwine-poster.jpg',
    contentUrl: 'https://iqwine.ai/video/film-iqwine.mp4',
    uploadDate: '2026-07-03T09:00:00-04:00',
    duration: 'PT1M6S',
  };
}

export default async function Page({ params }: ParamsLocale) {
  const { locale: brut } = await params;
  const locale: Locale = brut === 'en' ? 'en' : 'fr';
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(filmJsonLd(locale)).replace(/</g, "\\u003c") }}
      />
      <LeFilmContent />
    </>
  );
}
