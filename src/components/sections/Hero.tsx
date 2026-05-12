'use client';

import { useRef, useEffect, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
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

  // Parallax désactivé sur :
  //   - prefers-reduced-motion (a11y)
  //   - touch devices (souvent jankier, GPU thermal cost mobile)
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);
  const parallaxOff = reduced || isTouch;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], parallaxOff ? [0, 0] : [0, 60]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], parallaxOff ? [1, 1] : [1, 0.6]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Glow bordeaux — parallax subconscient sur scroll, GPU transform only */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: glowY, opacity: glowOpacity, willChange: 'transform' }}
      >
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[min(720px,90%)] h-px bg-gradient-to-r from-transparent via-or/40 to-transparent" />
      </motion.div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <FadeInOnScroll delay={0}>
          <div className="iq-eyebrow mb-10">{hero.badge}</div>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.1}>
          <div className="flex flex-col items-center gap-6 mb-10">
            <Logo size={140} glow priority />
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold tracking-[-0.04em] leading-none">
              <span className="text-foreground">iQ</span>
              <span className="text-or">Wine</span>
              <span className="iq-period">.</span>
            </h2>
          </div>
        </FadeInOnScroll>

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

        <FadeInOnScroll delay={0.4}>
          <p className="iq-lead mt-8 max-w-2xl mx-auto">
            {content.subheadline}
          </p>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.5}>
          <div className="mt-10 flex items-center justify-center gap-4 max-w-xl mx-auto">
            <div className="flex-1 h-px bg-or/25" />
            <p className="font-[family-name:var(--font-display)] italic text-or text-base sm:text-lg tracking-tight whitespace-nowrap">
              {content.anchor}
            </p>
            <div className="flex-1 h-px bg-or/25" />
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.65}>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
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

        <FadeInOnScroll delay={0.8}>
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
