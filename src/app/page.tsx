'use client';

import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroV4 from '@/components/sections/HeroV4';
import SectionAI from '@/components/sections/SectionAI';
import SectionConversation from '@/components/sections/SectionConversation';
import SectionCaveWeb from '@/components/sections/SectionCaveWeb';
import SectionTroisMoments from '@/components/sections/SectionTroisMoments';
import Pricing from '@/components/sections/Pricing';
import VagueFondateurs from '@/components/sections/VagueFondateurs';

export default function Home() {
  return (
    <I18nProvider>
      <Navbar />
      <main>
        <HeroV4 />
        <SectionAI />
        <SectionConversation />
        <SectionCaveWeb />
        <SectionTroisMoments />
        <Pricing />
        <VagueFondateurs />
      </main>
      <Footer />
    </I18nProvider>
  );
}
