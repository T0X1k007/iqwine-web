'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import Button from '@/components/ui/Button';
import DemoControlPanel from '@/components/demo/DemoControlPanel';
import DemoPhone from '@/components/demo/DemoPhone';
import { useLocale } from '@/lib/i18n';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { buildSignupUrl } from '@/lib/constants';
import { getDemoCards, type DemoMeal, type DemoSource } from '@/lib/demoData';

/**
 * SectionDemo — la vitrine d'Octave (Concept A premium). Panneau de contrôle en
 * haut, puis DEUX téléphones : votre cave (gauche) vs près de vous (droite). Changer le
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
                'Choisissez un plat, puis la source. Octave répond comme un sommelier : votre cave, une bouteille disponible près de vous, ou les deux.',
                'Pick a dish, then a source. Octave answers like a sommelier: your cellar, a bottle available near you, or both.',
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

        {/* Téléphones — cave (gauche) / près de vous (droite). Morph à chaque changement. */}
        <div className="relative mt-12 min-h-[600px]">
          {/* Scène lumineuse champagne derrière les téléphones (skin B — VISUAL 2.0) :
             une nappe de lumière chaude fait « poper » les mockups sombres et guide l'œil. */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[480px] w-[760px] max-w-[96%] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-95 blur-[100px]"
            style={{ background: 'radial-gradient(50% 50% at 50% 44%, rgba(217,182,103,0.28), rgba(217,182,103,0.09) 44%, transparent 72%)' }}
            aria-hidden
          />
          {/* Second halo, plus resserré et lumineux, juste derrière la ligne des mockups */}
          <div
            className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[240px] w-[440px] max-w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-[70px]"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(235,215,166,0.18), transparent 70%)' }}
            aria-hidden
          />
          <div className="flex flex-col items-center justify-center gap-12 lg:flex-row lg:items-start lg:gap-16">
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
                  className="w-full max-w-[350px]"
                >
                  <DemoPhone card={card} locale={locale} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* CTA de capture — « Et avec VOTRE cave ? » */}
        <FadeInOnScroll delay={0.1}>
          <div className="mt-14 flex flex-col items-center gap-3 text-center">
            <a
              href={buildSignupUrl('demo', { lang: locale })}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'demo' })}
            >
              <Button variant="cta" size="lg">
                {t(
                  'Et avec VOTRE cave ? — Essai gratuit',
                  'And with YOUR cellar? — Free trial',
                )}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
            <p className="font-body text-[10px] tracking-[0.18em] uppercase text-foreground-faint">
              {t(
                '14 jours · sans carte · aucune cave à saisir',
                '14 days · no card · no cellar to enter',
              )}
            </p>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
