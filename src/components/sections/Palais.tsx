'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import { getImpact, getEyebrows } from '@/lib/constants';

/**
 * Palais V4 — remplace Impact (grid 2×2 outcomes "KPI lingo")
 * par un édito centré : la cave qui parle à son propriétaire.
 *
 * Chaque "outcome" V3 devient un message Cormorant italic large
 * sur fond chaud espresso. Pas d'icône (les icons V3 GlassWater /
 * Heart / Sparkle / Compass appartiennent au lexique SaaS).
 * Hairlines or entre messages. Centré, pleine respiration.
 *
 * Direction V4-bis : pas de roue d'arômes SVG ni de mock illustration.
 * La typographie magazine luxe Cormorant italique EST l'illustration.
 */
export default function Palais() {
  const { locale } = useLocale();
  const impact = getImpact(locale);
  const eyebrows = getEyebrows(locale);

  return (
    <SectionWrapper id="palais" withDivider rhythm="editorial">
      <FadeInOnScroll>
        <div className="text-center mb-20 sm:mb-28 max-w-3xl mx-auto">
          <div className="iq-eyebrow mb-6">{eyebrows.impact}</div>
          <h2 className="iq-display italic">{impact.title}</h2>
          <p className="iq-lead mt-8">{impact.subtitle}</p>
        </div>
      </FadeInOnScroll>

      <div className="max-w-3xl mx-auto flex flex-col">
        {impact.outcomes.map((outcome, i) => (
          <FadeInOnScroll key={outcome.title} delay={0.1 + i * 0.15}>
            <article className="py-10 sm:py-14 flex flex-col items-center text-center">
              <div className="flex items-baseline gap-3 mb-5">
                <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-or/85 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-foreground-faint">
                  · {outcome.title}
                </span>
              </div>
              <p className="font-[family-name:var(--font-display)] italic text-foreground text-2xl sm:text-3xl lg:text-[34px] leading-relaxed tracking-[-0.005em] max-w-2xl">
                « {outcome.description} »
              </p>
            </article>
            {i < impact.outcomes.length - 1 && (
              <div className="flex justify-center" aria-hidden>
                <div className="h-px w-16 bg-or/25" />
              </div>
            )}
          </FadeInOnScroll>
        ))}
      </div>

      <FadeInOnScroll delay={0.7}>
        <div className="mt-20 sm:mt-28 text-center max-w-2xl mx-auto">
          <p className="font-[family-name:var(--font-display)] italic text-or/90 text-lg sm:text-xl leading-relaxed">
            {locale === 'fr'
              ? '« Trente dégustations, et votre cave commence à vous comprendre. »'
              : '"Thirty tastings, and your cellar begins to understand you."'}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
