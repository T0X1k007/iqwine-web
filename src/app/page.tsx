'use client';

import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import TheProblem from '@/components/sections/TheProblem';
import Platform from '@/components/sections/Platform';
import Impact from '@/components/sections/Impact';
import BetaAccess from '@/components/sections/BetaAccess';

export default function Home() {
  return (
    <I18nProvider>
      <Navbar />
      <main>
        <Hero />
        <TheProblem />
        <Platform />
        <Impact />
        <BetaAccess />
      </main>
      <Footer />
    </I18nProvider>
  );
}
