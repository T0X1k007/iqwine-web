'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import ScreenshotFrame from '@/components/screenshot/ScreenshotFrame';
import { useLocale } from '@/lib/i18n';

/**
 * SectionCaveWeb — « Votre cave, enfin vivante »
 *
 * V5 condensé : montre la cave en grand, capture réelle (05-cave-
 * visuelle.png — grid bouteilles fond ivoire showcase, apogées,
 * millésimes). Pas de dashboard SaaS, pas de tableur — un grid
 * éditorial magazine luxe.
 *
 * Capture mobile pour l'instant (iPhone frame width=400). Si plus
 * tard une capture desktop est fournie, swap pour mode="static"
 * frame="simple" en pleine largeur.
 *
 * Layout : titre LEFT + iPhone large RIGHT (lg+) / stack mobile.
 */

export default function SectionCaveWeb() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="cave-web" withDivider rhythm="standard">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 max-w-6xl mx-auto items-center">
        {/* LEFT — typo */}
        <div className="lg:col-span-5">
          <FadeInOnScroll>
            <div className="iq-eyebrow mb-6">
              {locale === 'fr' ? 'La cave' : 'The cellar'}
            </div>
            <h2 className="iq-h1 italic mb-6">
              {locale === 'fr'
                ? 'Votre cave, enfin vivante.'
                : 'Your cellar, finally alive.'}
            </h2>
            <p className="iq-lead mb-6">
              {locale === 'fr'
                ? 'Chaque bouteille avec sa photo, son millésime, son apogée. Plus une liste — un cellier qui respire.'
                : 'Each bottle with its photo, its vintage, its drinking window. No longer a list — a cellar that breathes.'}
            </p>
            <div className="flex items-center gap-4 max-w-md">
              <div className="h-px w-12 bg-or/30" />
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-foreground-faint">
                {locale === 'fr'
                  ? '487 bouteilles · 75 appellations · 62 régions'
                  : '487 bottles · 75 appellations · 62 regions'}
              </p>
            </div>
          </FadeInOnScroll>
        </div>

        {/* RIGHT — iPhone grand format avec capture cave */}
        <div className="lg:col-span-7 flex justify-center">
          <FadeInOnScroll delay={0.2} direction="left">
            <ScreenshotFrame
              mode="static"
              frame="iphone"
              src="/screenshots/05-cave-visuelle.png"
              alt={
                locale === 'fr'
                  ? 'La cave en grille — bouteilles avec photos et apogées'
                  : 'The cellar grid — bottles with photos and drinking windows'
              }
              width={340}
              rotation={-1.5}
              glow
            />
          </FadeInOnScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
