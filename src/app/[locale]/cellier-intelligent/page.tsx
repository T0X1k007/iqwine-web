import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import CellierContent from '@/components/fonctions/CellierContent';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, faqPageDepuis } from '@/lib/structured-data';
import { FAQ_CELLIER } from '@/lib/faq-fonctions';
import { FREE_PLAN } from '@/lib/plans';
import { DEFAULT_LOCALE, isLocale } from '@/lib/locale';

/**
 * /cellier-intelligent — première page Fonction (conception validée par Eric,
 * 2026-08-13). Intention : « application cave à vin » (BOFU). L'histoire :
 * une cave qui se souvient, ET un sommelier qui comprend ce qu'elle contient.
 * Title/meta = hypothèses du chantier 0, affinables sur données réelles.
 */
const TEXTES = {
  // Audit du 2026-11-06 (P1) : le titre assume le Gratuit, premier mot ajouté
  // à « application de cave » dans les suggestions de recherche. À arbitrer
  // par Éric contre l'ancien « …qui sait quand ouvrir » (annexe 4, §8, point 6).
  fr: {
    title: `Application de cave à vin gratuite jusqu’à ${FREE_PLAN.maxBottles} bouteilles`,
    description: `Photo, code-barres, reçu ou import Excel : votre cave entre en un geste, et sait quand ouvrir chaque bouteille. Sur iPhone, Android et le web.`,
  },
  en: {
    title: `Wine cellar app, free up to ${FREE_PLAN.maxBottles} bottles · iQWine`,
    description: `Photo, barcode, receipt or Excel import: your cellar gets in at once, and knows when to open each bottle. On iPhone, Android and the web.`,
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/cellier-intelligent', locale, TEXTES);
}

export default async function CellierPage({ params }: ParamsLocale) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(l, [
            { nom: l === 'fr' ? 'Accueil' : 'Home', chemin: '/' },
            { nom: l === 'fr' ? 'Fonctions' : 'Features', chemin: '/fonctions' },
            { nom: l === 'fr' ? 'Le cellier' : 'The cellar', chemin: '/cellier-intelligent' },
          ]),
          faqPageDepuis(l, '/cellier-intelligent', FAQ_CELLIER),
        ]}
      />
      <CellierContent />
    </>
  );
}
