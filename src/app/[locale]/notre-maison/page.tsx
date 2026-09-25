import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import AProposContent from '@/components/maison/AProposContent';

/**
 * /notre-maison — À PROPOS DE NOUS (GO d'Eric, 2026-08-14).
 *
 * La page conserve ses URLs (`/notre-maison` et `/en/our-story`) : l'ancienne
 * page de marque et la nouvelle racontent la même chose, l'origine d'iQWine,
 * et le slug anglais dit déjà exactement ce que la page est devenue. Aucune
 * redirection, aucune autorité perdue, un seul label de navigation à jour.
 * L'ancien corps (NotreMaisonContent) reste au dépôt jusqu'à la purge de fin
 * de phase 2.
 */
/**
 * ── LE TITLE SUIT L'IDENTITÉ PUBLIQUE (Eric, 2026-08-14) ────────────────
 * Il disait « À propos de nous », héritage de l'ancien positionnement, alors
 * que la barre du haut, le pied de page et le fil d'Ariane disent désormais
 * « Notre histoire ». Un visiteur qui clique « Notre histoire » et atterrit
 * sur un onglet « À propos de nous » doute d'être au bon endroit, et le
 * résultat de recherche ne portait aucune requête utile.
 *
 * Le nouveau title fait les deux : il reprend le libellé de navigation ET
 * ajoute la seule requête qui vaille pour cette page, « sommelier IA », en
 * racontant ce qu'elle contient vraiment (la naissance d'Octave). 67 et 61
 * caractères, dans la norme du site.
 *
 * Ce qui NE bouge PAS : l'URL, le canonical, les hreflang.
 *
 * ── LA DESCRIPTION SUIT LA NOUVELLE HISTOIRE (2026-09-25) ──────────────
 * Elle attribuait l'origine à « un amateur de vin québécois », soit Eric.
 * Elle nomme désormais Mégane, fondatrice, et le projet familial, sans
 * aucune mention corporative (iQWine inc. n'existe pas).
 */
const TEXTES = {
  fr: {
    title: 'Notre histoire : comment est né Octave, votre sommelier IA · iQWine',
    description:
      'iQWine est né d’une idée de Mégane Bigras, sa fondatrice : un sommelier personnel qui apprend vos goûts. L’histoire d’un projet familial québécois, et d’Octave.',
  },
  en: {
    title: 'Our story: how Octave, your AI sommelier, came to be · iQWine',
    description:
      'iQWine began as an idea by Mégane Bigras, its founder: a personal sommelier that learns your taste. The story of a Québec family project, and of Octave.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/notre-maison', locale, TEXTES);
}

export default function AProposPage() {
  return <AProposContent />;
}
