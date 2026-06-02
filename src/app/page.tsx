'use client';

import dynamic from 'next/dynamic';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
const Pricing = dynamic(() => import('@/components/sections/Pricing'));
const SectionFaq = dynamic(() => import('@/components/sections/SectionFaq'));
const VagueFondateurs = dynamic(() => import('@/components/sections/VagueFondateurs'));
const FinalCta = dynamic(() => import('@/components/sections/FinalCta'));
const StickyCTA = dynamic(() => import('@/components/ui/StickyCTA'));
const ScrollDepthTracker = dynamic(() => import('@/components/analytics/ScrollDepthTracker'));

export default function Home() {
  return (
    <I18nProvider>
      <Navbar />
      <main>
        <HeroV4 />
        <SectionDemo />
        <SectionComparison />
        <SectionProof />
        <SectionTroisMoments />
        <SectionAI />
        <SectionCaveWeb />
        <Pricing />
        <SectionFaq />
        <VagueFondateurs />
        <FinalCta />
      </main>
      <Footer />
      <StickyCTA />
      <ScrollDepthTracker />
    </I18nProvider>
  );
}
