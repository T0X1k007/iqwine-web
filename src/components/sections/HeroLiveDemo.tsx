'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import DemoWineCard from '@/components/demo/DemoWineCard';
import { useLocale } from '@/lib/i18n';
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion';
import { getDemoCards, mealLabel, type DemoMeal } from '@/lib/demoData';

/**
 * HeroLiveDemo — mock vivant du hero (CSS pur, sans framer-motion → hors chemin
 * critique JS, LCP mobile rapide).
 *
 * Cycle : tape « lasagne » → révèle 2 recos → tient → EFFACE → tape « sushi »
 * → autres recos → efface → recommence. Pacing premium. Cartes en fondu via
 * transitions CSS. Hauteur réservée (0 CLS). reduced-motion → frame statique.
 */

const HERO_MEALS: DemoMeal[] = ['lasagne', 'sushi'];

const START_DELAY = 2600; // démarre la boucle APRÈS la fenêtre LCP (frame statique d'abord)
const PAUSE_START = 360;
const TYPE_IN = 92;
const REVEAL_DELAY = 460;
const HOLD = 4200;
const HIDE_DUR = 540;
const ERASE = 52;
const GAP = 560;

export default function HeroLiveDemo() {
  const { locale } = useLocale();
  const reduced = usePrefersReducedMotion();

  // 1re frame STATIQUE (SSR) : « lasagne » + cartes déjà visibles → le LCP se
  // peint tôt et se stabilise (aucune animation above-fold pendant la mesure).
  const [mealIndex, setMealIndex] = useState(0);
  const [typed, setTyped] = useState(() => mealLabel('lasagne', 'fr'));
  const [revealed, setRevealed] = useState(true);
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
      push(() => setRevealed(false), t);
      t += HIDE_DUR;
      for (let i = word.length - 1; i >= 0; i--) {
        const slice = word.slice(0, i);
        push(() => setTyped(slice), t);
        t += ERASE;
      }
      t += GAP;
      push(() => schedule((idx + 1) % HERO_MEALS.length), t);
    };

    // 1er passage : on part de la frame statique « lasagne » + cartes, on tient
    // (START_DELAY, au-delà de la fenêtre LCP), puis on efface et on enchaîne sur
    // « sushi » — la boucle continue ensuite.
    setMealIndex(0);
    setTyped(mealLabel('lasagne', locale));
    setRevealed(true);
    let t = START_DELAY;
    push(() => setRevealed(false), t);
    t += HIDE_DUR;
    const w0 = mealLabel('lasagne', locale);
    for (let i = w0.length - 1; i >= 0; i--) {
      const slice = w0.slice(0, i);
      push(() => setTyped(slice), t);
      t += ERASE;
    }
    t += GAP;
    push(() => schedule(1), t);

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
          {cards.map((card, i) => (
            <div
              key={`${meal}-${card.source}-${card.cuvee}`}
              className={`transition-all ${
                reduced ? '' : 'duration-500 ease-[cubic-bezier(.22,1,.36,1)]'
              } ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              style={revealed && !reduced ? { transitionDelay: `${i * 120}ms` } : undefined}
            >
              <DemoWineCard card={card} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
