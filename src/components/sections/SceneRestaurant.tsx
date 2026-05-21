'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import ScreenshotFrame from '@/components/screenshot/ScreenshotFrame';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

/**
 * SceneRestaurant — Scène II : au restaurant, accords mets-vins.
 *
 * Layout V4-bis : 2 cols (lg+) — narratif tall LEFT + iPhone sticky RIGHT.
 * Pas de crossfade ici — la capture 03 montre l'algorithme Accords Mets
 * & Vins (Poulet → Tempranillo 1973, Poisson → Cuvée 2017, etc.) qui
 * EST le mode Restaurant éditorial : ce que ta cave matche à un plat.
 *
 * Capture : 03-menu-scan.png — ACCORDS METS & VINS, 5 plats avec
 * bouteille spécifique de la cave et millésime.
 */

type Paragraph = {
  eyebrow: Record<Locale, string>;
  body: Record<Locale, string>;
};

const PARAGRAPHS: Paragraph[] = [
  {
    eyebrow: { fr: 'L\'invitation', en: 'The invitation' },
    body: {
      fr: 'Vous êtes assis. Le menu arrive. Cinq plats. Vingt-six bouteilles à la carte. Vingt minutes pour décider.',
      en: 'You\'re seated. The menu arrives. Five courses. Twenty-six bottles on the list. Twenty minutes to decide.',
    },
  },
  {
    eyebrow: { fr: 'Le croisement', en: 'The crossing' },
    body: {
      fr: 'Vous photographiez. L\'app croise la carte avec ce qu\'elle sait de votre palais et de votre cave d\'expérience.',
      en: 'You take a photo. The app crosses the list with what it knows of your palate and your built experience.',
    },
  },
  {
    eyebrow: { fr: 'La réponse', en: 'The answer' },
    body: {
      fr: 'Une suggestion. Discrètement. Aucun spectacle. Le sommelier de la table reste maître. Le vôtre, en poche, n\'a fait que confirmer.',
      en: 'A suggestion. Discreetly. No show. The restaurant\'s sommelier remains in charge. Yours, in your pocket, only confirmed.',
    },
  },
];

export default function SceneRestaurant() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="scene-restaurant" rhythm="editorial">
      <FadeInOnScroll>
        <div className="text-center mb-16 sm:mb-24 max-w-3xl mx-auto">
          <div className="iq-eyebrow mb-6">
            {locale === 'fr' ? 'Scène II' : 'Scene II'}
          </div>
          <h2 className="iq-display italic">
            {locale === 'fr'
              ? 'Au restaurant, sans spectacle.'
              : 'At the restaurant, without a show.'}
          </h2>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 max-w-7xl mx-auto">
        {/* LEFT — iPhone sticky (inverse de SceneSunday pour rythme visuel) */}
        <div className="lg:col-span-5 hidden lg:block order-2 lg:order-1">
          <ScreenshotFrame
            mode="sticky"
            frame="iphone"
            src="/screenshots/03-menu-scan.png"
            alt={
              locale === 'fr'
                ? 'Mode Restaurant — accords mets et vins'
                : 'Restaurant mode — food and wine pairing'
            }
            width={300}
            rotation={-1.5}
            glow
            topOffset={120}
          />
        </div>

        {/* RIGHT — tall narrative */}
        <div className="lg:col-span-7 flex flex-col gap-[28vh] lg:gap-[44vh] py-8 lg:py-[20vh] order-1 lg:order-2">
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

        {/* Mobile — iPhone après le texte */}
        <div className="lg:hidden order-3 mt-8 flex justify-center">
          <FadeInOnScroll delay={0.2}>
            <ScreenshotFrame
              mode="static"
              frame="iphone"
              src="/screenshots/03-menu-scan.png"
              alt={
                locale === 'fr'
                  ? 'Mode Restaurant — accords mets et vins'
                  : 'Restaurant mode — food and wine pairing'
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
              ? '« Un sommelier en poche. Jamais une démonstration. »'
              : '"A sommelier in your pocket. Never a performance."'}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
