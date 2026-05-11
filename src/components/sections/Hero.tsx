'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import { getHero } from '@/lib/constants';

const VARIANT = 'A' as const;

export default function Hero() {
  const { locale } = useLocale();
  const hero = getHero(locale);
  const content = VARIANT === 'A' ? hero.variantA : hero.variantB;

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Glow bordeaux derrière le logo — accent dramatique */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[min(720px,90%)] h-px bg-gradient-to-r from-transparent via-or/40 to-transparent" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Eyebrow — mono uppercase or */}
        <FadeInOnScroll delay={0}>
          <div className="iq-eyebrow mb-10">{hero.badge}</div>
        </FadeInOnScroll>

        {/* Logo officiel — verre à vin doré, hero element */}
        <FadeInOnScroll delay={0.1}>
          <div className="flex flex-col items-center gap-6 mb-10">
            <Logo size={140} glow />
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold tracking-[-0.04em] leading-none">
              <span className="text-foreground">iQ</span>
              <span className="text-or">Wine</span>
              <span className="iq-period">.</span>
            </h2>
          </div>
        </FadeInOnScroll>

        {/* Two-line headline — Inter Display, accent or sur ligne 2 */}
        <FadeInOnScroll delay={0.25}>
          <h1 className="iq-h1 mx-auto max-w-4xl">
            <span className="block text-foreground">{content.headlineTop ?? content.headline}</span>
            {content.headlineBottom && (
              <span className="block text-or">
                {content.headlineBottom}
              </span>
            )}
          </h1>
        </FadeInOnScroll>

        {/* Lead — Inter body, dim ivoire */}
        <FadeInOnScroll delay={0.4}>
          <p className="iq-lead mt-8 max-w-2xl mx-auto">
            {content.subheadline}
          </p>
        </FadeInOnScroll>

        {/* CTA row — primary bordeaux, secondary outlined */}
        <FadeInOnScroll delay={0.55}>
          <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <a href="#beta" className="w-full sm:w-auto">
              <Button variant="or" size="lg" className="w-full sm:w-auto">
                {hero.ctaPrimary}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
            <a href="#platform" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                {hero.ctaSecondary}
                <ChevronDown size={16} strokeWidth={1.75} />
              </Button>
            </a>
          </div>
        </FadeInOnScroll>

        {/* Tagline éditoriale en bas du hero — la phrase fondatrice */}
        <FadeInOnScroll delay={0.7}>
          <p className="mt-16 font-[family-name:var(--font-display)] italic text-foreground-faint text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {locale === 'fr'
              ? '« Le compagnon œnologique qui comprend votre palais et votre cave mieux que vous-même. »'
              : '"The wine companion that understands your palate and your cellar better than you do."'}
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
