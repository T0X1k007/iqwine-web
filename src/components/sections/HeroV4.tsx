'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import HeroLiveDemo from '@/components/sections/HeroLiveDemo';
import HeroTrustBar from '@/components/sections/HeroTrustBar';
import { useLocale } from '@/lib/i18n';
import { getHero, APP_SIGNUP_URL } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

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

  return (
    <section
      id="hero"
      className="relative min-h-[90dvh] flex flex-col justify-center overflow-hidden pt-28 pb-14 lg:pt-36 lg:pb-20"
    >
      {/* Glow wine-rouge — vignette derrière le contenu */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[22%] h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute left-1/2 top-[12%] h-px w-[min(720px,80%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-or/35 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-center">
          {/* LEFT — bloc typographique éditorial */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Above-fold critique = rendu immédiat (pas d'opacity:0) pour un LCP rapide. */}
            <div className="iq-eyebrow mb-6">{hero.badge}</div>

            <h1 className="iq-hero italic">
              <span className="block text-foreground">{content.headlineTop}</span>
              <span className="block text-or">{content.headlineBottom}</span>
            </h1>

            <p className="iq-lead mt-6 max-w-xl lg:mx-0 mx-auto">
              {content.subheadline}
            </p>

            <FadeInOnScroll delay={0.4}>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 max-w-xl lg:mx-0 mx-auto">
                <div className="hidden lg:block h-px w-12 bg-or/30" />
                <p className="font-[family-name:var(--font-display)] italic text-or text-base sm:text-lg tracking-tight">
                  {content.anchor}
                </p>
                <div className="hidden lg:block h-px flex-1 bg-or/15" />
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.55}>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <a
                  href={APP_SIGNUP_URL}
                  onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'hero' })}
                  className="w-full sm:w-auto"
                >
                  <Button variant="or" size="lg" className="w-full sm:w-auto">
                    {hero.ctaPrimary}
                    <ArrowRight size={16} strokeWidth={1.75} />
                  </Button>
                </a>
                <a href="#demo" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    {hero.ctaSecondary}
                    <ChevronDown size={16} strokeWidth={1.75} />
                  </Button>
                </a>
              </div>
            </FadeInOnScroll>

          </div>

          {/* RIGHT — mock vivant : « lasagne » → recommandations en direct */}
          <div className="lg:col-span-5 flex flex-col items-center mt-16 lg:mt-0">
            <FadeInOnScroll delay={0.3} direction="left" className="w-full">
              <HeroLiveDemo />
            </FadeInOnScroll>

            {/* Citation — italique éditoriale sous le mockup (réplique iQForge) */}
            <FadeInOnScroll delay={0.85}>
              <p className="mt-8 lg:mt-10 text-center font-[family-name:var(--font-display)] italic text-foreground/85 text-lg sm:text-xl leading-relaxed">
                {locale === 'fr'
                  ? '« Ne plus gérer une cave. Vivre avec elle. »'
                  : '"Stop managing a cellar. Live with it."'}
              </p>
            </FadeInOnScroll>
          </div>
        </div>

        {/* Cartouche de confiance — flush CTA « 14 jours » → bord droit de la démo */}
        <FadeInOnScroll delay={0.7}>
          <div className="mt-12 lg:mt-14">
            <HeroTrustBar />
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
