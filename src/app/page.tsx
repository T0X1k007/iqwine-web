import type { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';

/**
 * Home — coquille SERVEUR (P49, 2026-07-17).
 *
 * ── Pourquoi ce fichier existe ────────────────────────────────────────────
 * La home portait `'use client'` et assemblait directement les sections. Or un
 * fichier client ne peut pas exporter `metadata` : elle était donc la SEULE
 * page publique du site sans `canonical`, et ça n'était pas un oubli — c'était
 * structurel. Sans canonical, c'est Google qui choisit quelle URL indexer pour
 * la page la plus importante du site.
 *
 * Le corps est parti dans `components/home/HomeClient.tsx`, à l'identique. On
 * adopte simplement le pattern standard Next (page serveur → composant client),
 * déjà utilisé par les 6 autres pages du site : `page.tsx` sert les métadonnées,
 * le client fait le rendu. Aucun changement de comportement, aucun changement
 * de rendu — seulement la métadonnée qui manquait.
 *
 * `title`/`description` restent hérités du layout (ils y sont déjà justes) :
 * on n'ajoute ICI que ce qui manquait, pour ne pas dupliquer une source.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return <HomeClient />;
}
