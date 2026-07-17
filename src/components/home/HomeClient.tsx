'use client';

/**
 * Corps de la home — client, parce que `next/dynamic` avec `ssr` par défaut et
 * les sections interactives l'exigent. Extrait de `app/page.tsx` (P49, 2026-07-17).
 *
 * ── Pourquoi cette séparation ─────────────────────────────────────────────
 * `page.tsx` portait `'use client'`, et un fichier client NE PEUT PAS exporter
 * `metadata` : la home était donc la SEULE page publique sans `canonical`, et
 * c'était structurel, pas un oubli. Le pattern standard Next (page serveur →
 * composant client) le débloque sans toucher au rendu : ce fichier est
 * identique à l'ancien, au nom près.
 */

import dynamic from 'next/dynamic';
import HeroV4 from '@/components/sections/HeroV4';

// Above-fold = eager (Hero seul). Tout le reste = code-split (next/dynamic, SSR
// conservé → SEO + 0 CLS). Ordre : mémoire → palais → disponibilité locale → moments à enjeu →
// preuve → comment → pourquoi → confiance → cercle → décision.
const SectionFilm = dynamic(() => import('@/components/sections/SectionFilm')); // Experience 2.0 — film de marque (mvt #2)
const SectionDemo = dynamic(() => import('@/components/sections/SectionDemo'));
const SectionCaveWeb = dynamic(() => import('@/components/sections/SectionCaveWeb')); // « Une cave qui se souvient » (pilier)
const SectionPourquoi = dynamic(() => import('@/components/sections/SectionPourquoi')); // tension (mvt 3)
const SectionPiliers = dynamic(() => import('@/components/sections/SectionPiliers')); // 4 chapitres (mvt 4)
const SectionPalais = dynamic(() => import('@/components/sections/SectionPalais'));
const SectionSaq = dynamic(() => import('@/components/sections/SectionSaq'));
const SectionMomentsEnjeu = dynamic(() => import('@/components/sections/SectionMomentsEnjeu')); // V2.6 « Les soirs où il ne faut pas se tromper »
const SectionTroisMoments = dynamic(() => import('@/components/sections/SectionTroisMoments')); // absorbe Proof + vidéo
const SectionComparison = dynamic(() => import('@/components/sections/SectionComparison')); // « Pourquoi les amateurs choisissent iQWine »
const SectionConfiance = dynamic(() => import('@/components/sections/SectionConfiance'));
const SectionCercle = dynamic(() => import('@/components/sections/SectionCercle')); // V2.5 « Le Cercle iQWine »
const SectionTarifs = dynamic(() => import('@/components/sections/SectionTarifs'));
const SectionFaq = dynamic(() => import('@/components/sections/SectionFaq'));
const FinalCta = dynamic(() => import('@/components/sections/FinalCta'));
const StickyCTA = dynamic(() => import('@/components/ui/StickyCTA'));
const ScrollDepthTracker = dynamic(() => import('@/components/analytics/ScrollDepthTracker'));

export default function HomeClient() {
  return (
    <>
      {/* Home VISUAL 2.0 — resserrée vers les 9 mouvements : « Une cave qui se
          souvient » remonte juste après le hero (colonne vertébrale émotionnelle),
          la démo suit, « Comment ça marche » retirée (redondante avec la démo).
          Sections neuves « Pourquoi iQWine existe » + « Les grands piliers » + Film
          = build dédié à venir. */}
      <main>
        <HeroV4 />
        <SectionFilm />
        <SectionPourquoi />
        <SectionCaveWeb />
        <SectionPiliers />
        <SectionDemo />
        <SectionPalais />
        <SectionSaq />
        <SectionMomentsEnjeu />
        <SectionTroisMoments />
        <SectionComparison />
        <SectionConfiance />
        <SectionCercle />
        <SectionTarifs />
        <SectionFaq />
        <FinalCta />
      </main>
      <StickyCTA />
      <ScrollDepthTracker />
    </>
  );
}
