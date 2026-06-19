'use client';

import dynamic from 'next/dynamic';
import HeroV4 from '@/components/sections/HeroV4';

// Above-fold = eager (Hero seul, désormais sans framer-motion). Tout le reste =
// code-split (next/dynamic, SSR conservé → SEO + 0 CLS) pour sortir framer-motion
// du chemin critique et accélérer le LCP mobile.
const SectionDemo = dynamic(() => import('@/components/sections/SectionDemo'));
const SectionComparison = dynamic(() => import('@/components/sections/SectionComparison'));
const SectionProof = dynamic(() => import('@/components/sections/SectionProof'));
const SectionTroisMoments = dynamic(() => import('@/components/sections/SectionTroisMoments'));
const SectionAI = dynamic(() => import('@/components/sections/SectionAI'));
const SectionCaveWeb = dynamic(() => import('@/components/sections/SectionCaveWeb'));
const SectionConfiance = dynamic(() => import('@/components/sections/SectionConfiance'));
const Pricing = dynamic(() => import('@/components/sections/Pricing'));
const SectionFaq = dynamic(() => import('@/components/sections/SectionFaq'));
const VagueFondateurs = dynamic(() => import('@/components/sections/VagueFondateurs'));
const FinalCta = dynamic(() => import('@/components/sections/FinalCta'));
const StickyCTA = dynamic(() => import('@/components/ui/StickyCTA'));
const ScrollDepthTracker = dynamic(() => import('@/components/analytics/ScrollDepthTracker'));

export default function Home() {
  return (
    <>
      <main>
        <HeroV4 />
        <SectionDemo />
        <SectionComparison />
        <SectionProof />
        <SectionTroisMoments />
        <SectionAI />
        <SectionCaveWeb />
        <SectionConfiance />
        <Pricing />
        <SectionFaq />
        <VagueFondateurs />
        <FinalCta />
      </main>
      <StickyCTA />
      <ScrollDepthTracker />
    </>
  );
}
