'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import DemoWineCard from '@/components/demo/DemoWineCard';
import { useLocale } from '@/lib/i18n';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import {
  DEMO_MEALS,
  getDemoCards,
  mealLabel,
  type DemoMeal,
  type DemoSource,
} from '@/lib/demoData';

/**
 * SectionDemo (PR3) — démo JOUABLE.
 * L'utilisateur choisit un plat (chips) + une source (Ma cave / SAQ / Les deux).
 * Les cartes se recomposent en direct. AUCUN appel API — données factices.
 * Pas de scroll-jacking. GPU only. reduced-motion respecté.
 */

const SOURCES: { id: DemoSource; fr: string; en: string }[] = [
  { id: 'cave', fr: 'Ma cave', en: 'My cellar' },
  { id: 'saq', fr: 'SAQ', en: 'SAQ' },
  { id: 'both', fr: 'Les deux', en: 'Both' },
];

export default function SectionDemo() {
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [meal, setMeal] = useState<DemoMeal>('lasagne');
  const [source, setSource] = useState<DemoSource>('both');
  const cards = getDemoCards(meal, source);

  return (
    <section id="demo" className="section-light relative py-20 sm:py-28 scroll-mt-28">
      <div className="mx-auto w-full max-w-5xl px-6 lg:px-8">
        <FadeInOnScroll>
          <div className="text-center mb-10 sm:mb-14">
            <div className="iq-eyebrow mb-5">
              {t('Essayez maintenant', 'Try it now')}
            </div>
            <h2 className="iq-h1 italic">
              {t('Que buvez-vous ce soir ?', 'What are you drinking tonight?')}
            </h2>
            <p className="iq-lead mt-5 max-w-2xl mx-auto">
              {t(
                'Choisissez un plat, puis la source. Octave répond comme un sommelier : votre cave, la SAQ, ou les deux.',
                'Pick a dish, then a source. Octave answers like a sommelier: your cellar, the SAQ, or both.',
              )}
            </p>
          </div>
        </FadeInOnScroll>

        {/* Chips plat */}
        <FadeInOnScroll delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-4">
            {DEMO_MEALS.map((m) => {
              const selected = m === meal;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMeal(m);
                    track(ANALYTICS_EVENTS.DEMO_MEAL_SELECT, { meal: m });
                  }}
                  aria-pressed={selected}
                  className={`rounded-pill px-5 py-2.5 text-[15px] border transition-colors duration-[140ms] ease-[cubic-bezier(.32,.72,0,1)] ${
                    selected
                      ? 'border-or/60 bg-or/10 text-foreground'
                      : 'border-border-strong text-foreground-dim hover:border-or/30 hover:text-foreground'
                  }`}
                >
                  {mealLabel(m, locale)}
                </button>
              );
            })}
          </div>
        </FadeInOnScroll>

        {/* Toggle source */}
        <FadeInOnScroll delay={0.15}>
          <div
            role="tablist"
            aria-label={t('Source de recommandation', 'Recommendation source')}
            className="mx-auto mb-10 grid grid-cols-3 gap-1 max-w-md rounded-pill border border-border-strong bg-sunk p-1"
          >
            {SOURCES.map((s) => {
              const selected = s.id === source;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setSource(s.id);
                    track(ANALYTICS_EVENTS.DEMO_SOURCE_TOGGLE, { source: s.id });
                  }}
                  className={`relative rounded-pill px-3 py-2 text-[13px] font-medium transition-colors duration-[140ms] ${
                    selected ? 'text-on-gold' : 'text-foreground-dim hover:text-foreground'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="demo-source-pill"
                      transition={
                        reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }
                      }
                      className="absolute inset-0 rounded-pill bg-or"
                      aria-hidden
                    />
                  )}
                  <span className="relative z-10">{t(s.fr, s.en)}</span>
                </button>
              );
            })}
          </div>
        </FadeInOnScroll>

        {/* Cartes en direct — hauteur réservée (0 CLS) */}
        <div className="mx-auto max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[260px]">
          {cards.map((card, i) => (
            <motion.div
              key={`${meal}-${source}-${card.source}-${card.cuvee}`}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.36,
                delay: reduced ? 0 : i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ willChange: 'transform' }}
              className={cards.length === 1 ? 'sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full' : ''}
            >
              <DemoWineCard card={card} locale={locale} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
