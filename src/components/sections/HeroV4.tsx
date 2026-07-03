'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import HeroDemo from '@/components/sections/HeroDemo';
import HeroTrustBar from '@/components/sections/HeroTrustBar';
import { useLocale } from '@/lib/i18n';
import { getHero, buildSignupUrl } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * Hero V4, composition éditoriale 2 colonnes (lg+) / stack mobile.
 *
 * LEFT  : eyebrow + Cormorant H1 italic + sub + anchor + dual CTA + closer
 * RIGHT : iPhone éditorial — vraies captures de l'app en crossfade (HeroDemo)
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
      /* L'offset top réel = --nav-h (hauteur navbar fixe + safe-area), donc le
         contenu démarre TOUJOURS sous la barre, à toutes les largeurs. Sur lg+
         on remplit le viewport restant et on centre le bloc dans cet espace
         (justify-center borné par le pt offset → plus de chevauchement). */
      className="relative flex flex-col justify-start lg:justify-center overflow-hidden pt-[calc(var(--nav-h)+1.5rem)] pb-12 lg:pb-16 lg:min-h-[100dvh]"
    >
      {/* Phase 6, plus de blob « spotlight » daté. Ambiance locale TRÈS
          subtile, au hero seul : un dégradé chaud diffus en haut (faible
          opacité) + une fine ligne or discrète. Jamais un halo de page. */}
      {/* Hero « La Matière » (VISUAL 2.0) : lumière de bougie champagne + arête de
          laiton brossé + profondeur (vignette). Matière, lumière, profondeur —
          aucun bordeaux ambiant (le bordeaux reste rare). */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-[62%] bg-[radial-gradient(ellipse_64%_78%_at_50%_-6%,rgba(217,182,103,0.11),transparent_66%)]" />
        <div className="absolute left-1/2 top-[10%] h-px w-[min(760px,82%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-or-soft/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(125%_95%_at_50%_38%,transparent_54%,rgba(0,0,0,0.38))]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-16 lg:items-center">
          {/* LEFT, bloc typographique éditorial */}
          <div className="lg:col-span-6 text-center lg:text-left">
            {/* Above-fold critique = rendu immédiat (pas d'opacity:0) pour un LCP rapide.
                Hero épuré : le titre est le 1er élément. */}
            <p className="font-body text-[11px] font-medium tracking-[0.28em] uppercase text-or/90 mb-5">
              {content.eyebrow}
            </p>

            <h1 className="iq-hero italic">
              <span className="block text-foreground">{content.headlineTop}</span>
              <span className="block text-or">{content.headlineBottom}</span>
            </h1>

            <p className="iq-lead mt-6 max-w-xl lg:mx-0 mx-auto">{content.subheadline}</p>

            <p className="mt-4 max-w-xl lg:mx-0 mx-auto font-[family-name:var(--font-display)] italic text-foreground/80 text-lg sm:text-xl leading-relaxed">
              {content.categoryLine}
            </p>

            <FadeInOnScroll delay={0.55}>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <a
                  href={buildSignupUrl('hero', { lang: locale })}
                  onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'hero' })}
                  className="w-full sm:w-auto"
                >
                  <Button variant="cta" size="lg" className="w-full sm:w-auto">
                    {content.ctaHeroPrimary}
                    <ArrowRight size={16} strokeWidth={1.75} />
                  </Button>
                </a>
                <a href="#demo" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    {content.ctaHeroSecondary}
                    <ChevronDown size={16} strokeWidth={1.75} />
                  </Button>
                </a>
              </div>
            </FadeInOnScroll>

            <p className="mt-5 iq-small text-foreground-dim text-center lg:text-left">
              {content.reassurance}
            </p>

          </div>

          {/* RIGHT : visuel produit — vraies captures app (HeroDemo), flottant sur une
              nappe champagne, avec la présence subtile de l'Anneau d'Octave (matière + profondeur). */}
          <div className="lg:col-span-6 flex flex-col items-center mt-12 lg:mt-0">
            <div className="relative w-full flex justify-center">
              {/* Présence subtile de l'Anneau d'Octave — « Octave veille » */}
              <svg
                viewBox="0 0 120 120"
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] max-w-[135%] -translate-x-1/2 -translate-y-1/2 opacity-60"
              >
                <defs>
                  <radialGradient id="heroAnneauNode">
                    <stop offset="0" stopColor="#fff7e6" />
                    <stop offset="0.4" stopColor="#ebd7a6" />
                    <stop offset="1" stopColor="#d9b667" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(217,182,103,0.20)" strokeWidth="0.7" />
                <circle cx="60" cy="18" r="10" fill="url(#heroAnneauNode)" />
                <circle cx="60" cy="18" r="1.8" fill="#fff7e6" />
              </svg>
              {/* Nappe lumineuse champagne — le mockup flotte comme un objet lit */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[440px] w-[420px] max-w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-[100px]"
                style={{ background: 'radial-gradient(50% 50% at 50% 46%, rgba(217,182,103,0.22), transparent 70%)' }}
              />
              <FadeInOnScroll delay={0.3} direction="left" className="w-full flex justify-center">
                <HeroDemo />
              </FadeInOnScroll>
            </div>
          </div>
        </div>

        {/* Cartouche de confiance, ancrée en bas du hero — referme la composition. */}
        <FadeInOnScroll delay={0.7}>
          <div className="mt-10 lg:mt-12">
            <HeroTrustBar />
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
