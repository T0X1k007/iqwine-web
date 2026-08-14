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
 * Ce qui NE bouge PAS : l'URL, le canonical, les hreflang et le H1 narratif.
 */
const TEXTES = {
  fr: {
    title: 'Notre histoire : comment est né Octave, votre sommelier IA · iQWine',
    description:
      'Octave est né d’une question toute simple, posée par un amateur de vin québécois : choisir une bouteille dans ses goûts, l’ouvrir au bon moment, la partager autour du bon repas.',
  },
  en: {
    title: 'Our story: how Octave, your AI sommelier, came to be · iQWine',
    description:
      'Octave was born from a simple question asked by a Québec wine lover: choose a bottle suited to your taste, open it at the right time, share it over the right meal.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/notre-maison', locale, TEXTES);
}

export default function AProposPage() {
  return <AProposContent />;
}
