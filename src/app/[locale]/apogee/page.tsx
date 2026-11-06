import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import ApogeeContent from '@/components/fonctions/ApogeeContent';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, faqPageDepuis } from '@/lib/structured-data';
import { FAQ_APOGEE } from '@/lib/faq-fonctions';
import { DEFAULT_LOCALE, isLocale } from '@/lib/locale';

/**
 * /apogee — dernier pilier hérité refondu (GO d'Eric, 2026-08-14). Les URLs
 * et les slugs ne bougent PAS (/apogee ↔ /en/drinking-window) : seule la
 * page change, donc aucune redirection, aucune autorité perdue et aucun
 * contrôle de routage supplémentaire.
 *
 * Le title épouse la question telle qu'on la tape (« quand ouvrir une
 * bouteille de vin ») ; la description donne les trois états en langage
 * humain et la promesse de veille, sans empiler les requêtes.
 */
const TEXTES = {
  // Audit du 2026-11-06 (P2) : la description donnait les trois états hérités
  // (« Trop jeune, à son sommet… »). Elle dit maintenant les libellés servis
  // par l'app v0.163.0 et la source de la fenêtre.
  fr: {
    title: 'Quand boire un vin ? L’apogée de chaque bouteille · iQWine',
    description:
      'Jeune, à boire maintenant ou à boire sans tarder : Octave lit la fenêtre de chaque bouteille de votre cave, dit d’où elle vient, vous prévient à temps.',
    ogTitle: 'L’apogée, suivie par Octave',
    ogDescription: 'Vous l’avez gardée dix ans. Ne l’ouvrez pas un an trop tard.',
  },
  en: {
    title: 'When to drink a wine? Each bottle’s drinking window · iQWine',
    description:
      'Young, drink now or drink soon: Octave reads the window of every bottle in your cellar, says where it comes from, and lets you know at the right moment.',
    ogTitle: 'The drinking window, tracked by Octave',
    ogDescription: 'You kept it ten years. Don’t open it a year too late.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/apogee', locale, TEXTES);
}

export default async function ApogeePage({ params }: ParamsLocale) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(l, [
            { nom: l === 'fr' ? 'Accueil' : 'Home', chemin: '/' },
            { nom: l === 'fr' ? 'Fonctions' : 'Features', chemin: '/fonctions' },
            { nom: l === 'fr' ? 'L’apogée' : 'The drinking window', chemin: '/apogee' },
          ]),
          faqPageDepuis(l, '/apogee', FAQ_APOGEE),
        ]}
      />
      <ApogeeContent />
    </>
  );
}
