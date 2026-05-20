'use client';

import { useRef, useEffect, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import ScreenshotFrame from '@/components/screenshot/ScreenshotFrame';
import { useLocale } from '@/lib/i18n';
import { getHero } from '@/lib/constants';

/**
 * Hero V4 — composition éditoriale 2 colonnes (lg+) / stack mobile.
 *
 * LEFT  : eyebrow + Cormorant H1 italic + sub + anchor + dual CTA + closer
 * RIGHT : iPhone avec capture fiche bouteille (placeholder en attendant
 *         Phase 2 — Eric capture via Chrome MCP avec ses credentials)
 *
 * Animations V4-bis :
 *   - Mount reveal staggered (CSS keyframes, zero JS observer)
 *   - iPhone glide-in from right + parallax subtle Y sur scroll
 *   - GPU transform only (no layout thrash)
 *   - prefers-reduced-motion + touch device : parallax désactivé
 *
 * Pas de pulsations, pas de Lottie, pas de bounce. Direction Apple/Aman/Stripe Press.
 */
export default function HeroV4() {
  const { locale } = useLocale();
  const hero = getHero(locale);
  const content = hero.variantA;

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
  const phoneY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxOff ? [0, 0] : [-8, 48],
  );
  const glowY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxOff ? [0, 0] : [0, 40],
  );
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  const placeholderCaption =
    locale === 'fr'
      ? 'Fiche · Pomerol 1995'
      : 'Bottle · Pomerol 1995';

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-32"
    >
      {/* Glow wine-rouge — vignette derrière le contenu, parallax subtle */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: glowY, opacity: glowOpacity, willChange: 'transform' }}
        aria-hidden
      >
        <div className="absolute left-1/2 top-[22%] h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute left-1/2 top-[12%] h-px w-[min(720px,80%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-or/35 to-transparent" />
      </motion.div>

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-center">
          {/* LEFT — bloc typographique éditorial */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <FadeInOnScroll delay={0}>
              <div className="iq-eyebrow mb-8">{hero.badge}</div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.1}>
              <h1 className="iq-hero italic">
                <span className="block text-foreground">{content.headlineTop}</span>
                <span className="block text-or">{content.headlineBottom}</span>
              </h1>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.28}>
              <p className="iq-lead mt-8 max-w-xl lg:mx-0 mx-auto">
                {content.subheadline}
              </p>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.4}>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 max-w-xl lg:mx-0 mx-auto">
                <div className="hidden lg:block h-px w-12 bg-or/30" />
                <p className="font-[family-name:var(--font-display)] italic text-or text-base sm:text-lg tracking-tight">
                  {content.anchor}
                </p>
                <div className="hidden lg:block h-px flex-1 bg-or/15" />
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.55}>
              <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <a href="#beta" className="w-full sm:w-auto">
                  <Button variant="or" size="lg" className="w-full sm:w-auto">
                    {hero.ctaPrimary}
                    <ArrowRight size={16} strokeWidth={1.75} />
                  </Button>
                </a>
                <a href="#vision" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    {hero.ctaSecondary}
                    <ChevronDown size={16} strokeWidth={1.75} />
                  </Button>
                </a>
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.75}>
              <p className="mt-16 font-[family-name:var(--font-display)] italic text-foreground-faint text-sm sm:text-base max-w-md lg:mx-0 mx-auto leading-relaxed">
                {locale === 'fr'
                  ? '« Ne plus gérer une cave. Vivre avec elle. »'
                  : '"Stop managing a cellar. Live with it."'}
              </p>
            </FadeInOnScroll>
          </div>

          {/* RIGHT — iPhone capture fiche bouteille */}
          <div className="lg:col-span-5 flex flex-col items-center mt-16 lg:mt-0">
            <FadeInOnScroll delay={0.3} direction="left">
              <motion.div
                style={{
                  y: phoneY,
                  willChange: 'transform',
                }}
              >
                <ScreenshotFrame
                  mode="static"
                  frame="iphone"
                  src="placeholder:Fiche · Pomerol 1995"
                  alt={
                    locale === 'fr'
                      ? 'Fiche de bouteille — application iQWine'
                      : 'Bottle profile — iQWine application'
                  }
                  width={300}
                  rotation={-2}
                  glow
                  priority
                />
              </motion.div>
              <p className="iq-eyebrow-mute mt-6 text-center">
                {placeholderCaption}
              </p>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
