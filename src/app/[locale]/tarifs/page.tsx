import type { Metadata } from "next";
import { pageMetadata, type ParamsLocale } from "@/lib/page-metadata";
import TarifsContent from "@/components/tarifs/TarifsContent";
import { TRIAL_DAYS_LABEL } from "@/lib/trial";
import { PREMIUM_PLAN, STANDARD_PLAN, planLabel } from "@/lib/plans";
import { faqPageLd } from "@/lib/structured-data";
import { isLocale, DEFAULT_LOCALE } from "@/lib/locale";

/**
 * Le title portait « Tarifs · iQWine », qui ne dit ni ce qu'on achete ni ce
 * qu'on risque. Il epouse desormais la requete (« prix », « essai gratuit »)
 * et nomme le produit. URL, canonical, hreflang et l'ancre #faq ne bougent pas.
 */
const TEXTES = {
  fr: {
    // « · iQWine » retiré (2026-11-06) : le nom ouvre déjà le titre, et le
    // doublon le portait à 69 caractères, au-delà de ce qu'un résultat affiche.
    title: "Tarifs iQWine : votre sommelier IA, essai gratuit sans carte",
    // La description menait par les trois noms de forfaits et ne disait de
    // l'essai que ses deux bornes. Dans un resultat de recherche, ce sont les
    // premiers mots qui sont lus : elle mene donc par la SEQUENCE, qui est ce
    // que le visiteur vient verifier avant de cliquer.
    //
    // 2026-11-06 : elle reprenait le sous-titre MOT POUR MOT (`SIGNUP_SUB`),
    // soit 201 caractères, coupés dans un résultat de recherche. Elle garde
    // la même séquence en une phrase : Passionné offert, puis le choix.
    description: `Découvrez le forfait ${planLabel(STANDARD_PLAN.id, "fr")} gratuitement pendant ${TRIAL_DAYS_LABEL.fr}, puis continuez gratuitement ou choisissez ${planLabel(STANDARD_PLAN.id, "fr")} ou ${planLabel(PREMIUM_PLAN.id, "fr")}. Sans carte, sans engagement.`,
  },
  en: {
    title: "iQWine pricing: your AI sommelier, free trial, no card",
    description: `Discover the ${planLabel(STANDARD_PLAN.id, "en")} plan free for ${TRIAL_DAYS_LABEL.en}, then keep going for free or choose ${planLabel(STANDARD_PLAN.id, "en")} or ${planLabel(PREMIUM_PLAN.id, "en")}. No card, no commitment.`,
  },
} as const;

export async function generateMetadata({
  params,
}: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("/tarifs", locale, TEXTES);
}

/**
 * /tarifs, page de DÉCISION, refondue v3 (Eric, 2026-08-14) en 6 sections :
 * ouverture courte → forfaits (le prix arrive vite) → comparatif + CTA →
 * réassurance → FAQ → clôture ivoire.
 *
 * L'OFFRE, ELLE, A CHANGÉ le 2026-09-13 : quatre paliers sont devenus trois
 * (Gratuit · Passionné · Premium), le Gratuit est entré dans la grille et monte
 * à 100 bouteilles, l'annuel du Standard passe à 149 $ sous l'étiquette « prix
 * de lancement », et le comparatif ne montre plus que les quatre lignes qui
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
          __html: JSON.stringify(faqPageLd(langue)).replace(/</g, "\\u003c"),
        }}
      />
      <TarifsContent />
    </>
  );
}
