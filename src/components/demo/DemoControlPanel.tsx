'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useLocale } from '@/lib/i18n';
import { DEMO_MEALS, mealLabel, type DemoMeal, type DemoSource } from '@/lib/demoData';

/**
 * DemoControlPanel, vrai panneau de contrôle (pas des chips). Conteneur premium
 * glass arrondi, deux contrôles segmentés (plat + source) avec pastille or
 * glissante (layoutId). Donne l'impression de piloter une vraie application.
 */

const SOURCES: { id: DemoSource; fr: string; en: string }[] = [
  { id: 'cave', fr: 'Ma cave', en: 'My cellar' },
  { id: 'saq', fr: 'Près de vous', en: 'Near you' },
  { id: 'both', fr: 'Les deux', en: 'Both' },
];

export default function DemoControlPanel({
  meal,
  source,
  onMeal,
  onSource,
  ton = 'nuit',
}: {
  meal: DemoMeal;
  source: DemoSource;
  onMeal: (m: DemoMeal) => void;
  onSource: (s: DemoSource) => void;
  /**
   * Peau du panneau (refonte v3, 2026-08-13) : `nuit` = l'original (glass sur
   * espresso, home héritée) ; `jour` = la variante ivoire pour les pages
   * Fonction claires (/accord-mets-vins). La pastille or et la mécanique ne
   * changent pas — seul l'habillage suit la lumière de la section hôte.
   */
  ton?: 'nuit' | 'jour';
}) {
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 420, damping: 34 };
  const jour = ton === 'jour';
  const peau = {
    boite: jour
      ? 'rounded-2xl border border-encre/10 bg-[#fdfaf3] shadow-[0_24px_60px_-32px_rgba(60,38,18,0.35)]'
      : 'glass rounded-2xl border border-or/20 ring-1 ring-white/5 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.7)]',
    etiquette: jour ? 'text-encre-3' : 'text-foreground-faint',
    rail: jour ? 'border-encre/10 bg-papier-2' : 'border-border-strong bg-sunk',
    inactif: jour ? 'text-encre-2 hover:text-encre' : 'text-foreground-dim hover:text-foreground',
    filet: jour ? 'bg-encre/10' : 'bg-border-strong/50',
  };

  return (
    <div className={`${peau.boite} px-5 py-6 sm:px-8 sm:py-7`}>
      {/* Plat */}
      <div className="sm:flex sm:items-center sm:gap-5">
        <span className={`block sm:w-44 sm:shrink-0 font-body text-[10px] tracking-[0.22em] uppercase ${peau.etiquette} mb-2.5 sm:mb-0`}>
          {t('Ce soir je mange', 'Tonight I’m eating')}
        </span>
        <div className={`grid grid-cols-2 sm:flex sm:flex-1 gap-1 rounded-xl border ${peau.rail} p-1`}>
          {DEMO_MEALS.map((m) => {
            const on = m === meal;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onMeal(m)}
                aria-pressed={on}
                className={`relative flex-1 rounded-lg px-3 py-2.5 text-[14px] font-medium capitalize transition-colors duration-[140ms] ${
                  on ? "text-on-gold" : peau.inactif
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="demo-meal-pill"
                    transition={spring}
                    className="absolute inset-0 rounded-lg bg-or"
                    aria-hidden
                  />
                )}
                <span className="relative z-10">{mealLabel(m, locale)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={`my-4 h-px ${peau.filet}`} />

      {/* Source */}
      <div className="sm:flex sm:items-center sm:gap-5">
        <span className={`block sm:w-44 sm:shrink-0 font-body text-[10px] tracking-[0.22em] uppercase ${peau.etiquette} mb-2.5 sm:mb-0`}>
          {t('La source', 'The source')}
        </span>
        <div
          role="tablist"
          aria-label={t('Source de recommandation', 'Recommendation source')}
          className={`grid grid-cols-3 sm:flex sm:flex-1 gap-1 rounded-xl border ${peau.rail} p-1`}
        >
          {SOURCES.map((s) => {
            const on = s.id === source;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => onSource(s.id)}
                className={`relative flex-1 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors duration-[140ms] ${
                  on ? "text-on-gold" : peau.inactif
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="demo-source-pill"
                    transition={spring}
                    className="absolute inset-0 rounded-lg bg-or"
                    aria-hidden
                  />
                )}
                <span className="relative z-10">{t(s.fr, s.en)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
