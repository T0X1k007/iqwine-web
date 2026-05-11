'use client';

import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import TheProblem from '@/components/sections/TheProblem';
import TheShift from '@/components/sections/TheShift';
import WhatIsIQForge from '@/components/sections/WhatIsIQForge';
import Platform from '@/components/sections/Platform';
import WhyDifferent from '@/components/sections/WhyDifferent';
import Impact from '@/components/sections/Impact';
import BetaAccess from '@/components/sections/BetaAccess';

export default function Home() {
  return (
    <I18nProvider>
      <Navbar />
      <main>
        <Hero />
        <TheProblem />
        <TheShift />
        <WhatIsIQForge />
        <Platform />
        <WhyDifferent />
        <Impact />
        <BetaAccess />
      </main>
      <Footer />
    </I18nProvider>
  );
}
