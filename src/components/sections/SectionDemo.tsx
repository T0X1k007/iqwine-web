'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import DemoControlPanel from '@/components/demo/DemoControlPanel';
import DemoPhone from '@/components/demo/DemoPhone';
import { useLocale } from '@/lib/i18n';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { getDemoCards, type DemoMeal, type DemoSource } from '@/lib/demoData';

/**
 * SectionDemo — la vitrine d'Octave (Concept A premium). Panneau de contrôle en
 * haut, puis DEUX téléphones : votre cave (gauche) vs la SAQ (droite). Changer le
 * plat ou la source métamorphose les écrans. Le visuel domine, le texte supporte.
 * AUCUN appel API — données factices. GPU only, reduced-motion respecté.
 */

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
          <div className="text-center mb-10 sm:mb-12">
            <div className="iq-eyebrow mb-5">{t('Essayez maintenant', 'Try it now')}</div>
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

        {/* Panneau de contrôle premium */}
        <FadeInOnScroll delay={0.1}>
          <DemoControlPanel
            meal={meal}
            source={source}
            onMeal={(m) => {
              setMeal(m);
              track(ANALYTICS_EVENTS.DEMO_MEAL_SELECT, { meal: m });
            }}
            onSource={(s) => {
              setSource(s);
              track(ANALYTICS_EVENTS.DEMO_SOURCE_TOGGLE, { source: s });
            }}
          />
        </FadeInOnScroll>

        {/* Téléphones — cave (gauche) / SAQ (droite). Morph à chaque changement. */}
        <div className="mt-12 flex flex-col items-center justify-center gap-12 lg:flex-row lg:items-start lg:gap-14 min-h-[520px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {cards.map((card) => (
              <motion.div
                key={`${meal}-${card.source}`}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'transform' }}
                className="w-full max-w-[280px]"
              >
                <DemoPhone card={card} locale={locale} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
