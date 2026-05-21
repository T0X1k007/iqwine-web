'use client';

import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroV4 from '@/components/sections/HeroV4';
import Constat from '@/components/sections/Constat';
import SceneSunday from '@/components/sections/SceneSunday';
import SceneRestaurant from '@/components/sections/SceneRestaurant';
import SceneCarnet from '@/components/sections/SceneCarnet';
import SixGestes from '@/components/sections/SixGestes';
import Palais from '@/components/sections/Palais';
import LeCercle from '@/components/sections/LeCercle';
import Difference from '@/components/sections/Difference';
import Vision from '@/components/sections/Vision';
import Pricing from '@/components/sections/Pricing';
import VagueFondateurs from '@/components/sections/VagueFondateurs';

export default function Home() {
  return (
    <I18nProvider>
      <Navbar />
      <main>
        <HeroV4 />
        <Constat />
        <SceneSunday />
        <SceneRestaurant />
        <SceneCarnet />
        <SixGestes />
        <Palais />
        <LeCercle />
        <Difference />
        <Vision />
        <Pricing />
        <VagueFondateurs />
      </main>
      <Footer />
    </I18nProvider>
  );
}
