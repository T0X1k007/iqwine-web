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
    description: `Gratuit, Standard ou Premium : le meme sommelier dans les trois, aucune fonction reservee. Essai gratuit, ${TRIAL_SHORT.fr}, sans carte et sans engagement.`,
  },
  en: {
    title: 'iQWine pricing: your AI sommelier, free trial, no card · iQWine',
    description: `Free, Standard or Premium: the same sommelier in all three, no feature held back. Free trial, ${TRIAL_SHORT.en}, no card, no commitment.`,
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/tarifs', locale, TEXTES);
}

/**
 * /tarifs, page de DÉCISION, refondue v3 (Eric, 2026-08-14) en 6 sections :
 * ouverture courte → forfaits (le prix arrive vite) → comparatif + CTA →
 * réassurance → FAQ → clôture ivoire.
 *
 * L'OFFRE, ELLE, A CHANGÉ le 2026-09-13 : quatre paliers sont devenus trois
 * (Gratuit · Standard · Premium), le Gratuit est entré dans la grille et monte
 * à 100 bouteilles, l'annuel du Standard passe à 129 $ sous l'étiquette « prix
 * fondateur », et le comparatif ne montre plus que les quatre lignes qui
 * diffèrent réellement. La description ci-dessus nomme donc les trois forfaits
 * et dit ce qui, justement, ne les sépare pas.
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
