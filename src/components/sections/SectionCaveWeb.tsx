'use client';

import Image from 'next/image';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';

/**
 * SectionCaveWeb — « Votre cave, enfin vivante »
 *
 * V5-quinquies Eric : capture desktop réelle (08-cellier-desktop.png
 * 2974×1516 HD retina). Sidebar "La Cave Bigras" + grid 3 cols
 * cards bouteilles. Plus de mobile iPhone — le desktop vend la
 * puissance, l'app web complète.
 *
 * Layout : titre LEFT + capture desktop landscape RIGHT (lg+), stack
 * mobile. Frame éditorial : cadre fin or alpha + shadow chaud +
 * subtle rotation pour ne pas être trop "screenshot brut".
 */

export default function SectionCaveWeb() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="cave-web" withDivider rhythm="standard">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-7xl mx-auto items-center">
        {/* LEFT — typo */}
        <div className="lg:col-span-4">
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

        {/* RIGHT — capture desktop landscape (cockpit / mission control) */}
        <div className="lg:col-span-8">
          <FadeInOnScroll delay={0.2} direction="left">
            <div
              className="relative rounded-xl overflow-hidden border border-or/15"
              style={{
                boxShadow:
                  '0 32px 96px rgba(0, 0, 0, 0.55), 0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(243, 236, 231, 0.05)',
                transform: 'rotate(-0.5deg)',
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background:
                    'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(212, 165, 72, 0.08), transparent 70%)',
                }}
              />
              <Image
                src="/screenshots/08-cellier-desktop.png"
                alt={
                  locale === 'fr'
                    ? 'La cave Bigras — vue desktop complète avec sidebar et grid bouteilles'
                    : 'Bigras cellar — full desktop view with sidebar and bottles grid'
                }
                width={1487}
                height={758}
                sizes="(min-width: 1024px) 64vw, 100vw"
                className="block w-full h-auto"
                priority={false}
              />
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
