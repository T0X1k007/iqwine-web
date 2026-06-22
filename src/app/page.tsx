'use client';

import dynamic from 'next/dynamic';
import HeroV4 from '@/components/sections/HeroV4';

// Above-fold = eager (Hero seul). Tout le reste = code-split (next/dynamic, SSR
// conservé → SEO + 0 CLS). Ordre Vague 1 : mémoire → palais → SAQ → preuve →
// comment → pourquoi → confiance → décision.
const SectionDemo = dynamic(() => import('@/components/sections/SectionDemo'));
const SectionCaveWeb = dynamic(() => import('@/components/sections/SectionCaveWeb')); // « Une cave qui se souvient » (pilier)
const SectionPalais = dynamic(() => import('@/components/sections/SectionPalais'));
const SectionSaq = dynamic(() => import('@/components/sections/SectionSaq'));
const SectionTroisMoments = dynamic(() => import('@/components/sections/SectionTroisMoments')); // absorbe Proof + vidéo
const SectionCommentCaMarche = dynamic(() => import('@/components/sections/SectionCommentCaMarche'));
const SectionComparison = dynamic(() => import('@/components/sections/SectionComparison')); // « Pourquoi les amateurs choisissent iQWine »
const SectionConfiance = dynamic(() => import('@/components/sections/SectionConfiance'));
const SectionTarifs = dynamic(() => import('@/components/sections/SectionTarifs'));
const SectionFaq = dynamic(() => import('@/components/sections/SectionFaq'));
const FinalCta = dynamic(() => import('@/components/sections/FinalCta'));
const StickyCTA = dynamic(() => import('@/components/ui/StickyCTA'));
const ScrollDepthTracker = dynamic(() => import('@/components/analytics/ScrollDepthTracker'));

export default function Home() {
  return (
    <>
      <main>
        <HeroV4 />
        <SectionDemo />
        <SectionCaveWeb />
        <SectionPalais />
        <SectionSaq />
        <SectionTroisMoments />
        <SectionCommentCaMarche />
        <SectionComparison />
        <SectionConfiance />
        <SectionTarifs />
        <SectionFaq />
        <FinalCta />
      </main>
      <StickyCTA />
      <ScrollDepthTracker />
    </>
  );
}
