import type { MetadataRoute } from 'next';

/**
 * Sitemap — routes publiques indexables (iQWine). Le domaine suit metadataBase
 * (layout.tsx) : canonique non-www iqwine.ca. Les 4 chapitres (Octave via
 * /sommelier-ia, Apogée, Recherche, Recevoir) + /le-film sont des destinations
 * Experience 2.0 → déclarées pour l'indexation. /octave n'est PAS listé : il
 * redirige vers /sommelier-ia (on ne déclare que la canonique).
 */
const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.iqwine.ca';

type Entry = MetadataRoute.Sitemap[number];
type Freq = Entry['changeFrequency'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const route = (path: string, priority: number, changeFrequency: Freq): Entry => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    route('/', 1.0, 'monthly'),
    route('/sommelier-ia', 0.9, 'monthly'),
    route('/le-film', 0.8, 'monthly'),
    route('/apogee', 0.8, 'monthly'),
    route('/recherche', 0.8, 'monthly'),
    route('/recevoir', 0.8, 'monthly'),
    route('/tarifs', 0.7, 'monthly'),
    route('/notre-maison', 0.5, 'yearly'),
    route('/contact', 0.4, 'yearly'),
    route('/conditions', 0.3, 'yearly'),
    route('/confidentialite', 0.3, 'yearly'),
  ];
}
