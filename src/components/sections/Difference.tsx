'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

/**
 * Difference V4 — manifesto contrastif tableau hairlines.
 *
 * Direction V4-bis : positionnement explicite vs. inventaire/dashboard/
 * AI gimmick. Format magazine luxe : tableau 2 colonnes éditorial avec
 * hairlines or, italiques Cormorant, sans card, sans coche, sans icône.
 *
 * Volontairement court : un collectionneur lit 4 lignes, pas 12.
 */

type ContrastRow = {
  not: Record<Locale, string>;
  is: Record<Locale, string>;
};

const ROWS: ContrastRow[] = [
  {
    not: { fr: 'Une app d\'inventaire', en: 'An inventory app' },
    is: { fr: 'Une mémoire de cave', en: 'A cellar\'s memory' },
  },
  {
    not: { fr: 'Un dashboard de collection', en: 'A collection dashboard' },
    is: { fr: 'Un sommelier discret', en: 'A discreet sommelier' },
  },
  {
    not: { fr: 'Un assistant IA bavard', en: 'A chatty AI assistant' },
    is: { fr: 'Un compagnon qui écoute', en: 'A companion that listens' },
  },
  {
    not: { fr: 'Un classement de notes', en: 'A scoring system' },
    is: { fr: 'Votre palais cartographié', en: 'Your palate mapped' },
  },
];

export default function Difference() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="difference" withDivider>
      <FadeInOnScroll>
        <div className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto">
          <div className="iq-eyebrow mb-6">
            {locale === 'fr' ? 'La différence' : 'The difference'}
          </div>
          <h2 className="iq-display italic">
            {locale === 'fr'
              ? 'Ce qu\'iQWine n\'est pas. Ce qu\'iQWine est.'
              : 'What iQWine is not. What iQWine is.'}
          </h2>
        </div>
      </FadeInOnScroll>

      <div className="max-w-4xl mx-auto">
        {/* Headers : éyebrow mono très discret pour annoncer les 2 colonnes */}
        <FadeInOnScroll delay={0.15}>
          <div className="grid grid-cols-2 gap-8 sm:gap-16 pb-5 border-b border-or/20">
            <div className="iq-eyebrow-mute text-left">
              {locale === 'fr' ? 'N\'est pas' : 'Is not'}
            </div>
            <div className="iq-eyebrow text-right sm:text-left">
              {locale === 'fr' ? 'Est' : 'Is'}
            </div>
          </div>
        </FadeInOnScroll>

        {ROWS.map((row, i) => (
          <FadeInOnScroll key={row.not[locale]} delay={0.25 + i * 0.1}>
            <div className="grid grid-cols-2 gap-8 sm:gap-16 py-6 sm:py-7 border-b border-border last:border-b-0">
              <div className="font-[family-name:var(--font-display)] italic text-foreground-faint text-lg sm:text-xl leading-snug line-through decoration-or/30 decoration-1">
                {row.not[locale]}
              </div>
              <div className="font-[family-name:var(--font-display)] italic text-or text-lg sm:text-xl leading-snug">
                {row.is[locale]}
              </div>
            </div>
          </FadeInOnScroll>
        ))}
      </div>

      <FadeInOnScroll delay={0.7}>
        <div className="mt-20 sm:mt-28 text-center max-w-2xl mx-auto">
          <p className="font-[family-name:var(--font-display)] italic text-or/90 text-xl sm:text-2xl leading-relaxed">
            {locale === 'fr'
              ? '« On ne mesure pas une cave. On la fréquente. »'
              : '"You don\'t measure a cellar. You spend time with it."'}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
