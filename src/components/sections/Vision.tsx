'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

/**
 * Vision V4 — timeline 2026-2029.
 *
 * Direction V4-bis : roadmap éditoriale "où nous allons" plutôt que
 * features-list SaaS. Format colonne verticale avec hairline spine or
 * et nodes Cormorant italic. Aucun bouton, aucun lien — purement
 * narratif. Le collectionneur lit où ça mène, pas où c'est rendu.
 *
 * Aspirationnel et abstrait : positionnement de cap, pas de PRD public.
 */

type Milestone = {
  year: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};

const MILESTONES: Milestone[] = [
  {
    year: '2026',
    title: {
      fr: 'La première vague',
      en: 'The first wave',
    },
    description: {
      fr: 'Cent celliers fondateurs. Cellier vivant, Mode Tonight, scanner d\'étiquettes. La cave commence à vous parler.',
      en: 'One hundred founder cellars. Living cellar, Tonight mode, label scanner. The cellar begins to speak.',
    },
  },
  {
    year: '2027',
    title: {
      fr: 'Le palais qui apprend',
      en: 'A palate that learns',
    },
    description: {
      fr: 'Calibration profonde. Mode Restaurant. Mémoire de dégustation longitudinale. Votre palais devient cartographié.',
      en: 'Deep calibration. Restaurant mode. Longitudinal tasting memory. Your palate becomes mapped.',
    },
  },
  {
    year: '2028',
    title: {
      fr: 'La conversation devient possible',
      en: 'Conversation becomes possible',
    },
    description: {
      fr: 'Recommandations entre palais affins. Échanges silencieux entre collectionneurs. Le cercle s\'élargit sans s\'ouvrir.',
      en: 'Recommendations between kindred palates. Silent exchanges between collectors. The circle widens without opening.',
    },
  },
  {
    year: '2029',
    title: {
      fr: 'Un compagnon permanent',
      en: 'A lasting companion',
    },
    description: {
      fr: 'Multi-cave. Multi-résidence. Sommelier privé permanent. La cave n\'est plus un lieu — c\'est un dialogue.',
      en: 'Multi-cellar. Multi-residence. A lasting private sommelier. The cellar is no longer a place — it\'s a dialogue.',
    },
  },
];

export default function Vision() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="vision" withDivider rhythm="editorial">
      <FadeInOnScroll>
        <div className="text-center mb-16 sm:mb-24 max-w-3xl mx-auto">
          <div className="iq-eyebrow mb-6">
            {locale === 'fr' ? 'Vision' : 'Vision'}
          </div>
          <h2 className="iq-display italic">
            {locale === 'fr' ? 'Vers où nous allons.' : 'Where we\'re going.'}
          </h2>
          <p className="iq-lead mt-6">
            {locale === 'fr'
              ? 'Quatre saisons. Une cave qui apprend votre palais.'
              : 'Four seasons. A cellar that learns your palate.'}
          </p>
        </div>
      </FadeInOnScroll>

      <div className="relative max-w-3xl mx-auto pl-8 sm:pl-14">
        {/* Spine hairline or — vertical, étirée toute la timeline */}
        <div
          aria-hidden
          className="absolute left-2 sm:left-5 top-2 bottom-2 w-px bg-gradient-to-b from-or/10 via-or/40 to-or/10"
        />

        {MILESTONES.map((m, i) => (
          <FadeInOnScroll key={m.year} delay={0.15 + i * 0.15}>
            <article className="relative pb-14 sm:pb-20 last:pb-0">
              {/* Node circle sur le spine */}
              <div
                aria-hidden
                className="absolute -left-8 sm:-left-14 top-1 w-3 h-3 rounded-full bg-or border-2 border-background"
                style={{ marginLeft: '5px' }}
              />
              {/* Year — large mono */}
              <p className="font-mono text-[11px] tracking-[0.32em] uppercase text-or mb-3 tabular-nums">
                {m.year}
              </p>
              {/* Title italic Cormorant */}
              <h3 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-[32px] text-foreground leading-tight mb-4 tracking-[-0.01em]">
                {m.title[locale]}
              </h3>
              {/* Description body */}
              <p className="iq-body text-foreground-dim leading-relaxed max-w-xl">
                {m.description[locale]}
              </p>
            </article>
          </FadeInOnScroll>
        ))}
      </div>

      <FadeInOnScroll delay={0.85}>
        <div className="mt-16 sm:mt-24 text-center max-w-2xl mx-auto">
          <p className="font-[family-name:var(--font-display)] italic text-or/90 text-lg sm:text-xl leading-relaxed">
            {locale === 'fr'
              ? '« Chaque saison apprend une nouvelle façon d\'écouter une cave. »'
              : '"Each season teaches a new way to listen to a cellar."'}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
