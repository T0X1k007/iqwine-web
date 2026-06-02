'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import DemoWineCard from '@/components/demo/DemoWineCard';
import { useLocale } from '@/lib/i18n';
import { getDemoCards, mealLabel } from '@/lib/demoData';

/**
 * HeroLiveDemo — mock vivant du hero (PR2).
 *
 * Joue en boucle : le champ « Que mangez-vous ce soir ? » se tape (« lasagne »),
 * puis 2 cartes apparaissent en stagger (1 cave « À son meilleur » + 1 SAQ
 * « Disponible »), avec l'explication IA. AUCUN appel API.
 *
 * - GPU only (opacity/translateY). Pas de layout shift (hauteur réservée).
 * - prefers-reduced-motion → frame finale statique, zéro timer.
 */

const MEAL = 'lasagne' as const;
const TYPE_MS = 95;
const HOLD_MS = 3600;

export default function HeroLiveDemo() {
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const word = mealLabel(MEAL, locale);
  const cards = getDemoCards(MEAL, 'both');

  const [typed, setTyped] = useState(reduced ? word : '');
  const [revealed, setRevealed] = useState(Boolean(reduced));
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (reduced) {
      setTyped(word);
      setRevealed(true);
      return;
    }
    const clearAll = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const run = () => {
      setTyped('');
      setRevealed(false);
      // 1. typing
      for (let i = 1; i <= word.length; i++) {
        timers.current.push(
          setTimeout(() => setTyped(word.slice(0, i)), i * TYPE_MS),
        );
      }
      // 2. reveal cards
      const afterType = word.length * TYPE_MS + 350;
      timers.current.push(setTimeout(() => setRevealed(true), afterType));
      // 3. loop
      timers.current.push(
        setTimeout(() => {
          clearAll();
          run();
        }, afterType + HOLD_MS),
      );
    };

    run();
    return clearAll;
  }, [reduced, word]);

  return (
    <div
      className="relative mx-auto w-full max-w-[400px]"
      role="img"
      aria-label={
        locale === 'fr'
          ? 'Démonstration : « lasagne » → deux vins recommandés, un de votre cave, un à la SAQ.'
          : 'Demo: "lasagna" → two recommended wines, one from your cellar, one at the SAQ.'
      }
    >
      {/* halo or subtil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[32px] bg-or/10 blur-[60px]"
      />

      <div className="relative glass rounded-2xl border border-border-strong p-4 sm:p-5 shadow-[var(--shadow-elevated)]">
        {/* En-tête sommelier */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} strokeWidth={1.75} className="text-or" />
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
            {locale === 'fr' ? 'Sommelier iQWine' : 'iQWine sommelier'}
          </span>
        </div>

        {/* Champ « Que mangez-vous ce soir ? » */}
        <div className="rounded-lg border border-border bg-sunk px-4 py-3">
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-foreground-faint mb-1">
            {locale === 'fr' ? 'Que mangez-vous ce soir ?' : 'What are you eating tonight?'}
          </p>
          <p className="iq-h4 text-foreground min-h-[1.4em]">
            {typed}
            {!reduced && !revealed && (
              <span className="inline-block w-[2px] h-[1em] align-middle bg-or animate-pulse ml-0.5" />
            )}
          </p>
        </div>

        {/* Cartes — hauteur réservée pour éviter le CLS */}
        <div className="mt-4 flex flex-col gap-3 min-h-[280px]">
          <AnimatePresence>
            {revealed &&
              cards.map((card, i) => (
                <motion.div
                  key={`${card.source}-${card.cuvee}`}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.42,
                    delay: reduced ? 0 : i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
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
