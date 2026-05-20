'use client';

import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroV4 from '@/components/sections/HeroV4';
import TheProblem from '@/components/sections/TheProblem';
import Platform from '@/components/sections/Platform';
import Impact from '@/components/sections/Impact';
import LeCercle from '@/components/sections/LeCercle';
import BetaAccess from '@/components/sections/BetaAccess';

export default function Home() {
  return (
    <I18nProvider>
      <Navbar />
      <main>
        <HeroV4 />
        <TheProblem />
        <Platform />
        <Impact />
        <LeCercle />
        <BetaAccess />
      </main>
      <Footer />
    </I18nProvider>
  );
}
