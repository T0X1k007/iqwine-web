'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import { getProblem, getEyebrows } from '@/lib/constants';

/**
 * Constat V4 — remplace TheProblem (grid 3 cartes SaaS) par une mise en
 * page éditoriale magazine luxe : titre serif italic + 3 paragraphes
 * numérotés à la Monocle, sans cards, sans icônes, hairlines or pour
 * séparer.
 *
 * Direction V4-bis : narrative, pas de grid SaaS. Donne l'impression
 * d'ouvrir un édito de magazine d'art de vivre, pas un dashboard.
 */
export default function Constat() {
  const { locale } = useLocale();
  const problem = getProblem(locale);
  const eyebrows = getEyebrows(locale);

  return (
    <SectionWrapper id="constat" withDivider>
      <FadeInOnScroll>
        <div className="text-center mb-16 sm:mb-24">
          <div className="iq-eyebrow mb-8">{eyebrows.problem}</div>
          <h2 className="iq-display italic max-w-4xl mx-auto">
            {problem.title}
          </h2>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-6xl mx-auto">
        {problem.points.map((point, i) => (
          <FadeInOnScroll key={point.title} delay={0.1 + i * 0.12}>
            <article className="flex flex-col">
              <div className="iq-eyebrow mb-6 text-or/85">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-[28px] italic text-foreground leading-snug mb-5 tracking-[-0.01em]">
                {point.title}
              </h3>
              <div className="h-px w-12 bg-or/25 mb-5" aria-hidden />
              <p className="iq-body text-foreground-dim leading-relaxed">
                {point.description}
              </p>
            </article>
          </FadeInOnScroll>
        ))}
      </div>

      <FadeInOnScroll delay={0.5}>
        <div className="mt-20 sm:mt-28 text-center max-w-2xl mx-auto">
          <p className="font-[family-name:var(--font-display)] italic text-or/90 text-xl sm:text-2xl leading-relaxed">
            {locale === 'fr'
              ? '« Vous ne possédez pas une liste. Vous tenez une mémoire. »'
              : '"You don\'t own a list. You hold a memory."'}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
