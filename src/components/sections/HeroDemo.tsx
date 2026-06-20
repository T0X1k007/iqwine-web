'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import DemoPhone from '@/components/demo/DemoPhone';
import { getDemoCards, mealLabel, DEMO_MEALS } from '@/lib/demoData';
import { useLocale } from '@/lib/i18n';

/**
 * HeroDemo — remplace l'ancien emplacement photo du hero. Animation de SÉLECTION
 * de vin : Octave recommande une bouteille pour un plat, et fait défiler les plats
 * (lasagne d'abord) avec un fondu doux. Centré dans sa colonne. Téléphone en mode
 * sombre pour s'harmoniser au hero. reduced-motion : fige sur la lasagne.
 */
export default function HeroDemo() {
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((p) => (p + 1) % DEMO_MEALS.length), 4500);
    return () => clearInterval(id);
  }, [reduced]);

  const meal = DEMO_MEALS[i] ?? 'lasagne';
  const card = getDemoCards(meal, 'cave')[0];
  if (!card) return null;

  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <div className="flex w-full flex-col items-center">
      <p className="mb-4 font-mono text-[11px] tracking-[0.24em] uppercase text-foreground-faint">
        {t('Octave choisit pour', 'Octave picks for')}{' '}
        <span className="text-or">{mealLabel(meal, locale)}</span>
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={meal}
          initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.97 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[300px] lg:max-w-[290px] xl:max-w-[310px]"
          style={{ willChange: 'transform, opacity' }}
        >
          <DemoPhone card={card} locale={locale} caption={t('Votre cave', 'Your cellar')} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
