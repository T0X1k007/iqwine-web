import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import { GuideAccueilContent } from '@/components/guide/GuideContent';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, faqPageDepuis } from '@/lib/structured-data';
import { GUIDE_PREMIERS_PAS } from '@/lib/guide';
import { DEFAULT_LOCALE, isLocale } from '@/lib/locale';

/**
 * /guide ↔ /en/guide — l'accueil du Guide d'Octave sur iqwine.ai (lot P7 de
 * l'audit du 2026-11-06). Le contenu est la part publique du Guide de l'app
 * (`src/lib/guide.ts`) ; le `FAQPage` ne déclare que les deux questions que
 * CETTE page affiche en entier (Premiers pas), le sommaire n'étant que des liens.
 */
const TEXTES = {
  fr: {
    title: 'Le Guide d’Octave : le vin et votre cave, simplement · iQWine',
    description:
      'Choisir un vin pour un plat ou sur une carte, tenir sa cave, comprendre son palais : les réponses d’Octave, le sommelier d’iQWine, claires et sans jargon.',
  },
  en: {
    title: 'Octave’s Guide: wine and your cellar, simply · iQWine',
    description:
      'Choosing a wine for a dish or from a list, keeping a cellar, understanding your palate: answers from Octave, iQWine’s sommelier, clear and jargon-free.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/guide', locale, TEXTES);
}

export default async function GuidePage({ params }: ParamsLocale) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(l, [
            { nom: l === 'fr' ? 'Accueil' : 'Home', chemin: '/' },
            { nom: l === 'fr' ? 'Le Guide d’Octave' : 'Octave’s Guide', chemin: '/guide' },
          ]),
          faqPageDepuis(l, '/guide', GUIDE_PREMIERS_PAS),
        ]}
      />
      <GuideAccueilContent />
    </>
  );
}
