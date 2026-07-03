import type { Metadata } from 'next';
import LeFilmContent from '@/components/film/LeFilmContent';

export const metadata: Metadata = {
  title: 'Le film — iQWine',
  description:
    'Le film iQWine : une minute pour comprendre ce que change une cave qui se souvient et un sommelier qui vous connaît. Du premier verre au dernier.',
  alternates: { canonical: '/le-film' },
  openGraph: {
    title: 'Le film — iQWine',
    description:
      'Une minute pour comprendre ce que change une cave qui se souvient et un sommelier qui vous connaît.',
  },
};

export default function Page() {
  return <LeFilmContent />;
}
