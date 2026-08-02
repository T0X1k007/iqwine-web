import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import LeFilmContent from '@/components/film/LeFilmContent';

const TEXTES = {
  fr: {
    title: 'Le film — iQWine',
    description:
      'Le film iQWine : une minute pour comprendre ce que change une cave qui se souvient et un sommelier qui vous connaît. Du premier verre au dernier.',
    ogTitle: 'Le film — iQWine',
    ogDescription:
      'Une minute pour comprendre ce que change une cave qui se souvient et un sommelier qui vous connaît.',
  },
  en: {
    title: 'The film — iQWine',
    description:
      'The iQWine film: one minute to see what changes when a cellar remembers and a sommelier knows you. From the first glass to the last.',
    ogTitle: 'The film — iQWine',
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
          url: 'https://www.iqwine.ca/video/film-iqwine.mp4',
          type: 'video/mp4',
          width: 1920,
          height: 882,
        },
      ],
    },
  };
}

/**
 * Données structurées VideoObject — éligibilité aux résultats vidéo Google +
 * lecture inline dans la SERP. Le film est SSR (cf. FilmPlayer <source>), donc
 * cohérent avec ce qu'annonce le schema.
 */
const FILM_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'iQWine — le film',
  description:
    'Sept chapitres, un seul sommelier — du verre ouvert au bon moment à la carte déchiffrée au restaurant.',
  thumbnailUrl: 'https://www.iqwine.ca/video/film-iqwine-poster.jpg',
  contentUrl: 'https://www.iqwine.ca/video/film-iqwine.mp4',
  uploadDate: '2026-07-03T09:00:00-04:00',
  duration: 'PT1M6S',
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FILM_JSONLD).replace(/</g, "\\u003c") }}
      />
      <LeFilmContent />
    </>
  );
}
