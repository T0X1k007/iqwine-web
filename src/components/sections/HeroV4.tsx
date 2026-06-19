'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import HeroVisual from '@/components/sections/HeroVisual';
import HeroTrustBar from '@/components/sections/HeroTrustBar';
import { useLocale } from '@/lib/i18n';
import { getHero, APP_SIGNUP_URL } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * Hero V4, composition éditoriale 2 colonnes (lg+) / stack mobile.
 *
 * LEFT  : eyebrow + Cormorant H1 italic + sub + anchor + dual CTA + closer
 * RIGHT : iPhone avec capture fiche bouteille (placeholder en attendant
 *         Phase 2, Eric capture via Chrome MCP avec ses credentials)
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
      className="relative min-h-[88dvh] lg:h-[100dvh] lg:min-h-[640px] flex flex-col justify-center overflow-hidden pt-24 pb-10 lg:pt-28 lg:pb-12"
    >
      {/* Phase 6, plus de blob « spotlight » daté. Ambiance locale TRÈS
          subtile, au hero seul : un dégradé chaud diffus en haut (faible
          opacité) + une fine ligne or discrète. Jamais un halo de page. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(142,42,42,0.10),transparent_70%)]" />
        <div className="absolute left-1/2 top-[12%] h-px w-[min(720px,80%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-or/20 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-center">
          {/* LEFT, bloc typographique éditorial */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Above-fold critique = rendu immédiat (pas d'opacity:0) pour un LCP rapide.
                Phase 7, hero épuré : eyebrow « SOMMELIER IA · CAVE · … » ET la ligne
                d'ancrage « Conçu au Québec · … » retirées (redondantes, alourdissaient
                le 1er frame). Titre = 1er élément. */}
            <h1 className="iq-hero italic">
              <span className="block text-foreground">{content.headlineTop}</span>
              <span className="block text-or">{content.headlineBottom}</span>
            </h1>

            <p className="iq-lead mt-6 max-w-xl lg:mx-0 mx-auto">{content.subheadline}</p>

            <FadeInOnScroll delay={0.55}>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <a
                  href={APP_SIGNUP_URL}
                  onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'hero' })}
                  className="w-full sm:w-auto"
                >
                  <Button variant="cta" size="lg" className="w-full sm:w-auto">
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

          {/* RIGHT, emplacement photographie « art de vivre » (Q19 option B).
              La démo vivante a migré en section 2 ; le hero s'ouvre sur
              l'émotion. Vraie photo en Phase 7. */}
          <div className="lg:col-span-5 flex flex-col items-center mt-8 lg:mt-0">
            <FadeInOnScroll delay={0.3} direction="left" className="w-full">
              <HeroVisual />
            </FadeInOnScroll>

            {/* Citation, italique éditoriale sous le mockup (réplique iQForge) */}
            <FadeInOnScroll delay={0.85}>
              <p className="mt-8 lg:mt-10 text-center font-[family-name:var(--font-display)] italic text-foreground/85 text-lg sm:text-xl leading-relaxed">
                {locale === 'fr'
                  ? '« Ne plus gérer une cave. Vivre avec elle. »'
                  : '"Stop managing a cellar. Live with it."'}
              </p>
            </FadeInOnScroll>
          </div>
        </div>

        {/* Cartouche de confiance, flush CTA « 14 jours » → bord droit de la démo */}
        <FadeInOnScroll delay={0.7}>
          <div className="mt-7 lg:mt-8">
            <HeroTrustBar />
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
