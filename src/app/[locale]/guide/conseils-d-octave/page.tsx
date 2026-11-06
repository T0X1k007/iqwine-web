import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import { GuidePageContent } from '@/components/guide/GuideContent';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, faqPageDepuis } from '@/lib/structured-data';
import { GUIDE_CONSEILS, questionsDe } from '@/lib/guide';
import { DEFAULT_LOCALE, isLocale } from '@/lib/locale';
import { TEXTES_GUIDE_CONSEILS as TEXTES } from '@/lib/guide-meta';

/**
 * Page thématique du Guide d'Octave (lot P7, audit du 2026-11-06). Toutes les
 * réponses sont dans le HTML ; le `FAQPage` les déclare mot pour mot, lues
 * dans la même source (`src/lib/guide.ts`).
 */
export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(GUIDE_CONSEILS.path, locale, TEXTES);
}

export default async function Page({ params }: ParamsLocale) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(l, [
            { nom: l === 'fr' ? 'Accueil' : 'Home', chemin: '/' },
            { nom: l === 'fr' ? 'Le Guide d’Octave' : 'Octave’s Guide', chemin: '/guide' },
            { nom: GUIDE_CONSEILS.titre[l], chemin: GUIDE_CONSEILS.path },
          ]),
          faqPageDepuis(l, GUIDE_CONSEILS.path, questionsDe(GUIDE_CONSEILS)),
        ]}
      />
      <GuidePageContent page={GUIDE_CONSEILS} />
    </>
  );
}
