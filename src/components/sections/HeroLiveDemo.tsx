'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import DemoWineCard from '@/components/demo/DemoWineCard';
import { useLocale } from '@/lib/i18n';
import { getDemoCards, mealLabel, type DemoMeal } from '@/lib/demoData';

/**
 * HeroLiveDemo — mock vivant du hero (premium, V2).
 *
 * Cycle : tape « lasagne » → révèle 2 recos → tient → EFFACE lettre par lettre
 * → tape « sushi » → révèle d'AUTRES recos → tient → efface → recommence.
 * Pacing lent et fluide (pas de reset brutal). Les cartes sortent en fondu
 * (AnimatePresence) avant la réécriture du plat.
 *
 * GPU only (opacity/translateY). Hauteur réservée (0 CLS).
 * prefers-reduced-motion → frame finale statique (lasagne), zéro timer.
 */

const HERO_MEALS: DemoMeal[] = ['lasagne', 'sushi'];

// Pacing premium (ms)
const PAUSE_START = 360;
const TYPE_IN = 92; // frappe posée
const REVEAL_DELAY = 460; // respiration avant les cartes
const HOLD = 4200; // temps de lecture
const HIDE_DUR = 540; // laisse le fondu de sortie se jouer
const ERASE = 52; // effacement un peu plus vif que la frappe
const GAP = 560; // silence avant le plat suivant

export default function HeroLiveDemo() {
  const { locale } = useLocale();
  const reduced = useReducedMotion();

  const [mealIndex, setMealIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [revealed, setRevealed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const meal = HERO_MEALS[mealIndex] ?? 'lasagne';
  const cards = getDemoCards(meal, 'both');

  useEffect(() => {
    const clearAll = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const push = (fn: () => void, at: number) =>
      timers.current.push(setTimeout(fn, at));

    if (reduced) {
      setMealIndex(0);
      setTyped(mealLabel('lasagne', locale));
      setRevealed(true);
      return;
    }

    const schedule = (idx: number) => {
      const word = mealLabel(HERO_MEALS[idx] ?? 'lasagne', locale);
      setMealIndex(idx);
      setTyped('');
      setRevealed(false);

      let t = PAUSE_START;
      for (let i = 1; i <= word.length; i++) {
        const slice = word.slice(0, i);
        push(() => setTyped(slice), t);
        t += TYPE_IN;
      }
      t += REVEAL_DELAY;
      push(() => setRevealed(true), t);
      t += HOLD;
      push(() => setRevealed(false), t); // fondu de sortie des cartes
      t += HIDE_DUR;
      for (let i = word.length - 1; i >= 0; i--) {
        const slice = word.slice(0, i);
        push(() => setTyped(slice), t);
        t += ERASE;
      }
      t += GAP;
      push(() => schedule((idx + 1) % HERO_MEALS.length), t);
    };

    schedule(0);
    return clearAll;
  }, [reduced, locale]);

  return (
    <div
      className="relative mx-auto w-full max-w-[400px]"
      role="img"
      aria-label={
        locale === 'fr'
          ? 'Démonstration : un plat saisi, deux vins recommandés — un de votre cave, un à la SAQ.'
          : 'Demo: a dish typed, two recommended wines — one from your cellar, one at the SAQ.'
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[32px] bg-or/10 blur-[60px]"
      />

      <div className="relative glass rounded-2xl border border-border-strong p-4 sm:p-5 shadow-[var(--shadow-elevated)]">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} strokeWidth={1.75} className="text-or" />
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
            {locale === 'fr' ? 'Sommelier iQWine' : 'iQWine sommelier'}
          </span>
        </div>

        <div className="rounded-lg border border-border bg-sunk px-4 py-3">
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-foreground-faint mb-1">
            {locale === 'fr' ? 'Que mangez-vous ce soir ?' : 'What are you eating tonight?'}
          </p>
          <p className="iq-h4 text-foreground min-h-[1.4em]">
            {typed}
            {!reduced && (
              <span
                className="inline-block w-[2px] h-[1em] align-middle bg-or ml-0.5"
                style={{ animation: 'iq-caret 1.05s steps(1) infinite' }}
              />
            )}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 min-h-[280px]">
          <AnimatePresence mode="popLayout">
            {revealed &&
              cards.map((card, i) => (
                <motion.div
                  key={`${meal}-${card.source}-${card.cuvee}`}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.5,
                    delay: reduced ? 0 : i * 0.14,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ willChange: 'transform' }}
                >
                  <DemoWineCard card={card} locale={locale} />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
