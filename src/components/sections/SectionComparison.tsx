'use client';

import { useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * SectionComparison (#comparatif), répond « pourquoi iQWine ? ».
 * FACTUEL, jamais agressif : trois états (oui / partiel / non) qui reconnaissent
 * honnêtement les forces des concurrents (scan Vivino, apogée CellarTracker).
 * Le différenciateur émerge de la COMBINAISON, pas du dénigrement.
 * Animation : scroll-reveal uniquement (FadeInOnScroll). Table scrollable en x
 * sur très petits écrans (pas d'overflow de page).
 */

type Cell = 'yes' | 'partial' | 'no';
const TOOLS = ['iQWine', 'ChatGPT', 'Vivino', 'CellarTracker'] as const;

interface Row {
  feature: { fr: string; en: string };
  cells: [Cell, Cell, Cell, Cell]; // ordre = TOOLS
}

const ROWS: Row[] = [
  { feature: { fr: 'Connaît votre cave personnelle', en: 'Knows your personal cellar' }, cells: ['yes', 'no', 'partial', 'yes'] },
  { feature: { fr: 'Stock SAQ en temps réel (succursale)', en: 'Live SAQ stock (by store)' }, cells: ['yes', 'no', 'no', 'no'] },
  { feature: { fr: 'Recommande selon votre palais (apprend)', en: 'Recommends by your palate (learns)' }, cells: ['yes', 'partial', 'partial', 'no'] },
  { feature: { fr: 'Accord avec un plat précis', en: 'Pairs with a specific dish' }, cells: ['yes', 'partial', 'no', 'no'] },
  { feature: { fr: 'Scan d’une carte de restaurant', en: 'Scans a restaurant wine list' }, cells: ['yes', 'partial', 'no', 'no'] },
  { feature: { fr: 'Scan d’étiquette → fiche', en: 'Label scan → profile' }, cells: ['yes', 'partial', 'yes', 'no'] },
  { feature: { fr: 'Suit l’apogée des bouteilles', en: 'Tracks drinking windows' }, cells: ['yes', 'no', 'no', 'yes'] },
  { feature: { fr: 'Respecte un budget d’achat', en: 'Respects a purchase budget' }, cells: ['yes', 'no', 'no', 'no'] },
];

function CellIcon({ state }: { state: Cell }) {
  if (state === 'yes')
    return <Check size={18} strokeWidth={2.25} className="text-or mx-auto" aria-label="oui" />;
  if (state === 'partial')
    return <Minus size={18} strokeWidth={2.25} className="text-foreground-faint mx-auto" aria-label="partiel" />;
  return <span className="block text-center text-foreground-faint/50" aria-label="non">—</span>;
}

export default function SectionComparison() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const ref = useRef<HTMLElement>(null);
  const seen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !seen.current) {
          seen.current = true;
          track(ANALYTICS_EVENTS.COMPARISON_VIEW);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="comparatif" className="relative py-20 sm:py-28 scroll-mt-28">
      <div className="mx-auto w-full max-w-5xl px-6 lg:px-8">
        <FadeInOnScroll>
          <div className="text-center mb-10 sm:mb-14">
            <div className="iq-eyebrow mb-5">{t('Pourquoi iQWine', 'Why iQWine')}</div>
            <h2 className="iq-h1 italic">
              {t('Ce qu’aucun autre ne réunit.', 'What no one else brings together.')}
            </h2>
            <p className="iq-lead mt-5 max-w-2xl mx-auto">
              {t(
                'Chacun excelle sur un point. iQWine relie votre cave, la SAQ et votre palais, dans une seule intelligence.',
                'Each excels at one thing. iQWine connects your cellar, the SAQ and your palate, in one intelligence.',
              )}
            </p>
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.1}>
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 sm:p-4" />
                  {TOOLS.map((tool) => {
                    const isUs = tool === 'iQWine';
                    return (
                      <th
                        key={tool}
                        className={`p-3 sm:p-4 text-center font-[family-name:var(--font-display)] text-base sm:text-lg ${
                          isUs
                            ? 'text-or border-t border-x border-or/30 rounded-t-xl bg-or/[0.06]'
                            : 'text-foreground-dim'
                        }`}
                      >
                        {tool}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, ri) => (
                  <tr key={row.feature.en} className="border-t border-border">
                    <td className="p-3 sm:p-4 iq-small text-foreground-dim">
                      {row.feature[locale]}
                    </td>
                    {row.cells.map((cell, ci) => {
                      const isUs = ci === 0;
                      const last = ri === ROWS.length - 1;
                      return (
                        <td
                          key={ci}
                          className={`p-3 sm:p-4 ${
                            isUs
                              ? `border-x border-or/30 bg-or/[0.06] ${last ? 'border-b rounded-b-xl' : ''}`
                              : ''
                          }`}
                        >
                          <CellIcon state={cell} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.15}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.18em] uppercase text-foreground-faint">
            <span className="inline-flex items-center gap-1.5"><Check size={13} className="text-or" /> {t('Oui', 'Yes')}</span>
            <span className="inline-flex items-center gap-1.5"><Minus size={13} /> {t('Partiel', 'Partial')}</span>
            <span className="inline-flex items-center gap-1.5">— {t('Non', 'No')}</span>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
