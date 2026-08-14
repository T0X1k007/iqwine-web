import HomeClient from '@/components/home/HomeClient';

/**
 * Home, coquille SERVEUR (P49, 2026-07-17).
 *
 * ── Pourquoi ce fichier existe ────────────────────────────────────────────
 * La home portait `'use client'` et assemblait directement les sections. Or un
 * fichier client ne peut pas exporter `metadata` : elle était donc la SEULE
 * page publique du site sans `canonical`, et ça n'était pas un oubli, c'était
 * structurel. Sans canonical, c'est Google qui choisit quelle URL indexer pour
 * la page la plus importante du site.
 *
 * Le corps est parti dans `components/home/HomeClient.tsx`, à l'identique. On
 * adopte simplement le pattern standard Next (page serveur → composant client),
 * déjà utilisé par les 6 autres pages du site : `page.tsx` sert les métadonnées,
 * le client fait le rendu. Aucun changement de comportement, aucun changement
 * de rendu, seulement la métadonnée qui manquait.
 *
 * ── Et pourquoi il n'exporte plus de métadonnées (MFP-09) ────────────────
 * Il posait `alternates: { canonical: '/' }`. C'était juste tant qu'il n'y
 * avait qu'une seule accueil ; depuis que chaque langue a la sienne, ce
 * canonical en dur ÉCRASAIT celui du layout et faisait déclarer aux deux pages
 * la même URL racine, celle-là même qui redirige.
 *
 * Une page qui se déclare canonique vers une redirection disparaît de l'index
 * en désignant elle-même sa remplaçante. Et rien ne l'aurait signalé : la page
 * s'affiche parfaitement.
 *
 * Le layout produit désormais titre, description, canonical, `hreflang` et
 * Open Graph pour l'accueil de chaque langue. Ce fichier n'a plus rien à dire.
 */

export default function Home() {
  return <HomeClient />;
}
