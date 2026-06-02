'use client';

import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroV4 from '@/components/sections/HeroV4';
import SectionDemo from '@/components/sections/SectionDemo';
import SectionComparison from '@/components/sections/SectionComparison';
import SectionProof from '@/components/sections/SectionProof';
import SectionAI from '@/components/sections/SectionAI';
import SectionConversation from '@/components/sections/SectionConversation';
import SectionCaveWeb from '@/components/sections/SectionCaveWeb';
import SectionTroisMoments from '@/components/sections/SectionTroisMoments';
import Pricing from '@/components/sections/Pricing';
import VagueFondateurs from '@/components/sections/VagueFondateurs';
import StickyCTA from '@/components/ui/StickyCTA';
import ScrollDepthTracker from '@/components/analytics/ScrollDepthTracker';

export default function Home() {
  return (
    <I18nProvider>
      <Navbar />
      <main>
        <HeroV4 />
        <SectionDemo />
        <SectionComparison />
        <SectionProof />
        <SectionAI />
        <SectionConversation />
        <SectionCaveWeb />
        <SectionTroisMoments />
        <Pricing />
        <VagueFondateurs />
      </main>
      <Footer />
      <StickyCTA />
      <ScrollDepthTracker />
    </I18nProvider>
  );
}
