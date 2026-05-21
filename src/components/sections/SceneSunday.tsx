'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import ScreenshotFrame from '@/components/screenshot/ScreenshotFrame';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

/**
 * SceneSunday — Scène I : dimanche soir, sommelier privé.
 *
 * Layout V4-bis : 2 cols (lg+) — narratif tall LEFT + iPhone sticky RIGHT.
 * L'iPhone reste présent à l'écran pendant que le texte narratif défile.
 * Pas de crossfade ici (1 seule capture forte). Reduced-motion : dégrade
 * automatiquement en static via ScreenshotFrame.
 *
 * Capture : 02-home-suggestions.png — « Bonsoir, à table ! »,
 * Cormorant italic display sur fond restaurant doré, sommelier privé
 * qui demande ce qu'on mange ce soir.
 */

type Paragraph = {
  eyebrow: Record<Locale, string>;
  body: Record<Locale, string>;
};

const PARAGRAPHS: Paragraph[] = [
  {
    eyebrow: { fr: 'Le moment', en: 'The moment' },
    body: {
      fr: 'Vous rentrez. La table est mise. Le four chante. Une seule question reste : qu\'allez-vous ouvrir ?',
      en: 'You come home. The table is set. The oven hums. One question remains: what will you open?',
    },
  },
  {
    eyebrow: { fr: 'La question', en: 'The question' },
    body: {
      fr: 'L\'app vous demande ce que vous mangez ce soir. Deux mots suffisent — bœuf bourguignon, risotto aux truffes, poisson grillé.',
      en: 'The app asks what you\'re eating tonight. Two words are enough — beef bourguignon, truffle risotto, grilled fish.',
    },
  },
  {
    eyebrow: { fr: 'La réponse', en: 'The answer' },
    body: {
      fr: 'Trois bouteilles de votre cave. Chacune avec sa raison. La plus proche de l\'apogée. La plus en phase avec votre palais. Celle dont vous aviez oublié l\'existence.',
      en: 'Three bottles from your cellar. Each with its reason. The closest to peak. The most aligned with your palate. The one you had forgotten about.',
    },
  },
];

export default function SceneSunday() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="scene-sunday" withDivider rhythm="editorial">
      <FadeInOnScroll>
        <div className="text-center mb-16 sm:mb-24 max-w-3xl mx-auto">
          <div className="iq-eyebrow mb-6">
            {locale === 'fr' ? 'Scène I' : 'Scene I'}
          </div>
          <h2 className="iq-display italic">
            {locale === 'fr'
              ? 'Dimanche soir, à table.'
              : 'Sunday evening, at the table.'}
          </h2>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 max-w-7xl mx-auto">
        {/* LEFT — tall narrative (3 paragraphes espacés) */}
        <div className="lg:col-span-7 flex flex-col gap-[28vh] lg:gap-[44vh] py-8 lg:py-[20vh]">
          {PARAGRAPHS.map((p, i) => (
            <FadeInOnScroll key={i} delay={0.05 + i * 0.05}>
              <article className="max-w-xl">
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-or/85 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-foreground-faint">
                    · {p.eyebrow[locale]}
                  </span>
                </div>
                <p className="font-[family-name:var(--font-display)] italic text-foreground text-2xl sm:text-3xl lg:text-[34px] leading-relaxed tracking-[-0.005em]">
                  {p.body[locale]}
                </p>
              </article>
            </FadeInOnScroll>
          ))}
        </div>

        {/* RIGHT — iPhone sticky */}
        <div className="lg:col-span-5 hidden lg:block">
          <ScreenshotFrame
            mode="sticky"
            frame="iphone"
            src="/screenshots/02-home-suggestions.png"
            alt={
              locale === 'fr'
                ? 'Accueil sommelier — Bonsoir, à table'
                : 'Sommelier home — Good evening, at the table'
            }
            width={300}
            rotation={1.5}
            glow
            topOffset={120}
          />
        </div>

        {/* Mobile — iPhone après le texte, static */}
        <div className="lg:hidden mt-8 flex justify-center">
          <FadeInOnScroll delay={0.2}>
            <ScreenshotFrame
              mode="static"
              frame="iphone"
              src="/screenshots/02-home-suggestions.png"
              alt={
                locale === 'fr'
                  ? 'Accueil sommelier — Bonsoir, à table'
                  : 'Sommelier home — Good evening, at the table'
              }
              width={280}
              glow
            />
          </FadeInOnScroll>
        </div>
      </div>

      <FadeInOnScroll delay={0.5}>
        <div className="mt-20 sm:mt-28 text-center max-w-2xl mx-auto">
          <p className="font-[family-name:var(--font-display)] italic text-or/90 text-lg sm:text-xl leading-relaxed">
            {locale === 'fr'
              ? '« La cave devient une conversation. »'
              : '"The cellar becomes a conversation."'}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
