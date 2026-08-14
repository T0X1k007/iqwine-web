import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import TarifsContent from '@/components/tarifs/TarifsContent';
import { TRIAL_SHORT } from '@/lib/trial';
import { faqPageLd } from '@/lib/structured-data';
import { isLocale, DEFAULT_LOCALE } from '@/lib/locale';

/**
 * Le title portait « Tarifs · iQWine », qui ne dit ni ce qu'on achete ni ce
 * qu'on risque. Il epouse desormais la requete (« prix », « essai gratuit »)
 * et nomme le produit. URL, canonical, hreflang et l'ancre #faq ne bougent pas.
 */
const TEXTES = {
  fr: {
    title: 'Tarifs iQWine : votre sommelier IA, essai gratuit sans carte · iQWine',
    description: `Trois formules selon votre cave, un meme sommelier dans toutes. Essai gratuit, ${TRIAL_SHORT.fr}, sans carte et sans engagement.`,
  },
  en: {
    title: 'iQWine pricing: your AI sommelier, free trial, no card · iQWine',
    description: `Three plans for your cellar, the same sommelier in every one. Free trial, ${TRIAL_SHORT.en}, no card, no commitment.`,
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/tarifs', locale, TEXTES);
}

/**
 * /tarifs, page de DÉCISION, refondue v3 (Eric, 2026-08-14) en 6 sections :
 * ouverture courte → forfaits (le prix arrive vite) → comparatif + CTA →
 * réassurance → FAQ → clôture ivoire. L'offre elle-même n'a pas bougé d'un
 * mot : prix, quotas, forfaits, essai, conditions et destinations de CTA sont
 * identiques. Seules la hiérarchie et la présentation changent.
 */
/**
 * Le `FAQPage` est émis ICI, et nulle part ailleurs : c'est la seule page qui
 * AFFICHE les questions (via `SectionFaq`). Il vivait dans le graphe global du
 * layout, donc sur 26 pages qui n'en montrent aucune.
 */
export default async function TarifsPage({ params }: ParamsLocale) {
  const { locale } = await params;
  const langue = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageLd(langue)).replace(/</g, '\\u003c'),
        }}
      />
      <TarifsContent />
    </>
  );
}
