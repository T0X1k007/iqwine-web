import type { MetadataRoute } from 'next';
import { LOCALES, absoluteUrl, SITE_ORIGIN } from '@/lib/locale';

/**
 * SITEMAP BILINGUE — chaque page, dans chaque langue, avec ses alternatives.
 *
 * ── Ce qui a changé, et pourquoi ce n'est pas cosmétique ──────────────────
 * Le sitemap déclarait onze URL en une seule langue, parce qu'il n'existait
 * qu'une URL par page : l'anglais vivait sous la même adresse, choisi côté
 * client. Un moteur ne pouvait donc PAS découvrir la version anglaise — elle
 * n'avait pas d'adresse à découvrir.
 *
 * Il déclare désormais vingt-deux URL, et chacune porte ses `alternates`. C'est
 * le canal par lequel Google et Bing apprennent qu'il existe deux versions et
 * laquelle servir à qui — le sitemap étant, avec les balises `hreflang`, l'un
 * des deux moyens reconnus de le dire. Nous faisons les deux.
 *
 * ── `/beta` reste hors sitemap ────────────────────────────────────────────
 * Elle n'était pas listée avant et ne l'est pas davantage : c'est une page
 * d'atterrissage à diffusion contrôlée, pas une destination d'acquisition.
 * L'omettre est une décision, pas un oubli — d'où cette phrase.
 */

/** Les chemins NUS, sans langue. La langue est appliquée ci-dessous. */
const PAGES: Array<{ path: string; priority: number; freq: Freq }> = [
  { path: '/', priority: 1.0, freq: 'monthly' },
  { path: '/sommelier-ia', priority: 0.9, freq: 'monthly' },
  { path: '/le-film', priority: 0.8, freq: 'monthly' },
  { path: '/apogee', priority: 0.8, freq: 'monthly' },
  { path: '/recherche', priority: 0.8, freq: 'monthly' },
  { path: '/recevoir', priority: 0.8, freq: 'monthly' },
  { path: '/tarifs', priority: 0.7, freq: 'monthly' },
  { path: '/notre-maison', priority: 0.5, freq: 'yearly' },
  { path: '/contact', priority: 0.4, freq: 'yearly' },
  { path: '/conditions', priority: 0.3, freq: 'yearly' },
  { path: '/confidentialite', priority: 0.3, freq: 'yearly' },
];

type Entry = MetadataRoute.Sitemap[number];
type Freq = Entry['changeFrequency'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(page.path, locale),
      lastModified,
      changeFrequency: page.freq,
      priority: page.priority,
      alternates: {
        languages: {
          'fr-CA': absoluteUrl(page.path, 'fr'),
          'en-CA': absoluteUrl(page.path, 'en'),
          // Le point d'entrée NEUTRE de cette page — pas sa version française.
          // Cf. `alternatesFor` : `x-default` désigne un comportement, non une
          // langue, et le repli vers le français est opérationnel, pas déclaré.
          'x-default': `${SITE_ORIGIN}${page.path === '/' ? '/' : page.path}`,
        },
      },
    })),
  );
}
