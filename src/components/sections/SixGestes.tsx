'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import { getPlatform, getEyebrows } from '@/lib/constants';

/**
 * SixGestes V4 — remplace Platform (grid 6 cards SaaS avec glyphes C/T/R/S/Q/P)
 * par une mise en page éditoriale 2 colonnes magazine luxe.
 *
 * 6 gestes (sommelier-vivant) au lieu de 6 modules (SaaS-features).
 * Chaque entrée : phase mono numérotée + nom Cormorant italic +
 * hairline or + tagline + description prose. Pas de glyph, pas de
 * card chrome, pas de cartouche fonctionnalité.
 *
 * Sur lg+ : 2 cols. Sur md : 2 cols compactes. Sur mobile : 1 col stack.
 */
export default function SixGestes() {
  const { locale } = useLocale();
  const platform = getPlatform(locale);
  const eyebrows = getEyebrows(locale);

  return (
    <SectionWrapper id="six-gestes" withDivider>
      <FadeInOnScroll>
        <div className="text-center mb-16 sm:mb-24 max-w-3xl mx-auto">
          <div className="iq-eyebrow mb-6">{eyebrows.platform}</div>
          <h2 className="iq-display italic">{platform.title}</h2>
          <p className="iq-lead mt-6">{platform.subtitle}</p>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 lg:gap-x-20 lg:gap-y-16 max-w-6xl mx-auto">
        {platform.modules.map((m, i) => (
          <FadeInOnScroll key={m.name} delay={0.1 + i * 0.08}>
            <article className="flex flex-col">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-or/85 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-foreground-faint">
                  · {m.phase}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-[30px] text-foreground leading-tight mb-3 tracking-[-0.01em]">
                {m.name}
              </h3>
              <div className="h-px w-12 bg-or/30 mb-4" aria-hidden />
              <p className="iq-body text-foreground mb-2 leading-relaxed">
                {m.description}
              </p>
              <p className="iq-small italic text-foreground-dim leading-relaxed">
                {m.details}
              </p>
            </article>
          </FadeInOnScroll>
        ))}
      </div>

      <FadeInOnScroll delay={0.6}>
        <div className="mt-20 sm:mt-28 text-center max-w-2xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-foreground-faint">
            {platform.flowDescription}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
