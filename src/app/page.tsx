'use client';

import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroV4 from '@/components/sections/HeroV4';
import Constat from '@/components/sections/Constat';
import Platform from '@/components/sections/Platform';
import Impact from '@/components/sections/Impact';
import LeCercle from '@/components/sections/LeCercle';
import VagueFondateurs from '@/components/sections/VagueFondateurs';

export default function Home() {
  return (
    <I18nProvider>
      <Navbar />
      <main>
        <HeroV4 />
        <Constat />
        <Platform />
        <Impact />
        <LeCercle />
        <VagueFondateurs />
      </main>
      <Footer />
    </I18nProvider>
  );
}
