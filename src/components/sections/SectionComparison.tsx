'use client';

import { useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale, type Locale } from '@/lib/i18n';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * SectionComparison (#comparatif), « Pourquoi iQWine ? ».
 * Vague 1 : re-framé. L'intention est de VENDRE iQWine et de RASSURER, pas de
 * lancer un benchmark. iQWine est en TÊTE de colonne, mis en valeur. Le
 * concurrent premium reste mais NON NOMMÉ → « Une app de cave de luxe ».
 * Les lignes EXCLUSIVES iQWine sont EN HAUT ; une concession honnête (cave 3D /
 * localisation physique) ferme le tableau en posture, pas en faiblesse.
 * Jamais de dénigrement. Animation : scroll-reveal uniquement (FadeInOnScroll).
 */

type Cell = 'yes' | 'partial' | 'no';
// Colonnes : iQWine D'ABORD, puis l'app de luxe (non nommée), puis secondaires.
const TOOLS = [
  { fr: 'iQWine', en: 'iQWine' },
  { fr: 'Une app de cave de luxe', en: 'A luxury cellar app' },
  { fr: 'ChatGPT', en: 'ChatGPT' },
  { fr: 'Vivino', en: 'Vivino' },
  { fr: 'CellarTracker', en: 'CellarTracker' },
] as const;

interface Row {
  feature: { fr: string; en: string };
  cells: [Cell, Cell, Cell, Cell, Cell]; // ordre = TOOLS
  exclusive?: boolean; // ligne inattaquable → libellé or/gras + préfixe « Exclusif »
}

// Lignes ordonnées du plus INATTAQUABLE au plus partagé. Les exclusivités
// iQWine (un seul « yes ») sont EN TÊTE et accentuées ; concession honnête en
// bas. Bénéfices EN SITUATION (« sur place », « en direct »), pas des features.
// Ordre cellules : iQWine · app de luxe · ChatGPT · Vivino · CellarTracker.
const ROWS: Row[] = [
  { feature: { fr: 'Disponibilité locale vérifiée, magasin par magasin', en: 'Verified local availability, store by store' }, cells: ['yes', 'no', 'no', 'no', 'no'], exclusive: true },
  { feature: { fr: 'Lit une carte de restaurant, sur place', en: 'Reads a restaurant wine list, on the spot' }, cells: ['yes', 'no', 'no', 'no', 'no'] },
  { feature: { fr: 'Accorde avec votre plat précis, en direct', en: 'Pairs with your exact dish, live' }, cells: ['yes', 'no', 'partial', 'no', 'no'] },
  { feature: { fr: 'Apogée en conversation, pas en tableur', en: 'Drinking windows in conversation, not a spreadsheet' }, cells: ['yes', 'partial', 'no', 'no', 'partial'] },
  { feature: { fr: 'Ancré au marché local (disponibilités vérifiées, prix CAD)', en: 'Rooted in the local market (verified availability, CAD prices)' }, cells: ['yes', 'no', 'no', 'partial', 'no'] },
  { feature: { fr: 'Scan d’étiquette → fiche', en: 'Label scan → profile' }, cells: ['yes', 'partial', 'partial', 'yes', 'no'] },
  { feature: { fr: 'Cave 3D / localisation physique', en: '3D cellar / physical location' }, cells: ['no', 'yes', 'no', 'no', 'no'] },
];

function CellIcon({ state, locale }: { state: Cell; locale: Locale }) {
  const label = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  if (state === 'yes')
    return (
      <Check
        size={18}
        strokeWidth={2.25}
        className="text-or mx-auto"
        aria-label={label('oui', 'yes')}
      />
    );
  if (state === 'partial')
    return (
      <Minus
        size={18}
        strokeWidth={2.25}
        className="text-foreground-faint mx-auto"
        aria-label={label('partiel', 'partial')}
      />
    );
  return (
    <span
      className="block text-center text-foreground-faint/50"
      aria-label={label('non', 'no')}
    >
      —
    </span>
  );
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
              {t(
                'Pourquoi les amateurs choisissent iQWine.',
                'Why wine lovers choose iQWine.',
              )}
            </h2>
            <p className="iq-lead mt-5 max-w-2xl mx-auto">
              {t(
                'Pensée pour décider, pas seulement pour ranger. Cinq choses que personne d’autre ne réunit : la disponibilité locale, votre palais, l’apogée en clair, l’accord en situation, et le Québec.',
                'Built to decide, not just to organize. Five things no one else brings together: local availability, your palate, drinking windows in plain language, pairing in the moment, and Québec.',
              )}
            </p>
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.1}>
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 sm:p-4" />
                  {TOOLS.map((tool, ti) => {
                    const isUs = ti === 0;
                    return (
                      <th
                        key={tool.en}
                        className={`p-3 sm:p-4 text-center font-[family-name:var(--font-display)] text-base sm:text-lg align-bottom ${
                          isUs
                            ? 'text-or border-t border-x border-or/30 rounded-t-xl bg-or/[0.06]'
                            : 'text-foreground-dim'
                        }`}
                      >
                        {tool[locale]}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, ri) => (
                  <tr key={row.feature.en} className="border-t border-border">
                    <td
                      className={`p-3 sm:p-4 iq-small ${
                        row.exclusive
                          ? 'text-or font-semibold'
                          : 'text-foreground-dim'
                      }`}
                    >
                      {row.exclusive && (
                        <span className="mr-2 font-body text-[10px] tracking-[0.18em] uppercase text-or/80">
                          {t('Exclusif', 'Only here')}
                        </span>
                      )}
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
                          <CellIcon state={cell} locale={locale} />
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
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-[10px] tracking-[0.18em] uppercase text-foreground-faint">
            <span className="inline-flex items-center gap-1.5"><Check size={13} className="text-or" /> {t('Oui', 'Yes')}</span>
            <span className="inline-flex items-center gap-1.5"><Minus size={13} /> {t('Partiel', 'Partial')}</span>
            <span className="inline-flex items-center gap-1.5">— {t('Non', 'No')}</span>
          </div>
        </FadeInOnScroll>

        {/* Concession honnête → posture, pas faiblesse. */}
        <FadeInOnScroll delay={0.2}>
          <p className="mt-10 text-center font-[family-name:var(--font-display)] italic text-or/90 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {t(
              '« On ne range pas un musée. On vous dit quelle bouteille ouvrir. »',
              '"We don’t curate a museum. We tell you which bottle to open."',
            )}
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
