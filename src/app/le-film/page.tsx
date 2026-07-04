import type { Metadata } from 'next';
import LeFilmContent from '@/components/film/LeFilmContent';

export const metadata: Metadata = {
  title: 'Le film — iQWine',
  description:
    'Le film iQWine : une minute pour comprendre ce que change une cave qui se souvient et un sommelier qui vous connaît. Du premier verre au dernier.',
  alternates: { canonical: '/le-film' },
  openGraph: {
    type: 'video.other',
    title: 'Le film — iQWine',
    description:
      'Une minute pour comprendre ce que change une cave qui se souvient et un sommelier qui vous connaît.',
    videos: [
      { url: 'https://www.iqwine.ca/video/film-iqwine.mp4', type: 'video/mp4', width: 1920, height: 882 },
    ],
  },
};

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
  uploadDate: '2026-07-03',
  duration: 'PT1M6S',
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FILM_JSONLD) }}
      />
      <LeFilmContent />
    </>
  );
}
