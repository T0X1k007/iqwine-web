'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import ScreenshotFrame from '@/components/screenshot/ScreenshotFrame';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

/**
 * SectionTroisMoments — fusion compacte des anciennes SceneSunday +
 * SceneRestaurant + SceneCarnet en UNE section, 3 colonnes (lg+).
 *
 * Direction V5 : montrer 3 moments en un coup d'œil, plus de
 * scrollytelling 300dvh par scene. Chaque colonne = mini-iPhone
 * + titre Cormorant + 1 paragraphe court (4 lignes max). L'arc
 * narratif est implicite : soir privé → restaurant discret → mémoire.
 *
 * Mobile : stack vertical (iPhone + texte par moment, 3 fois).
 */

type Moment = {
  eyebrow: Record<Locale, string>;
  title: Record<Locale, string>;
  body: Record<Locale, string>;
  src: string;
  alt: Record<Locale, string>;
};

const MOMENTS: Moment[] = [
  {
    eyebrow: { fr: '01 · Ce soir', en: '01 · Tonight' },
    title: {
      fr: 'Le sommelier en cuisine',
      en: 'The sommelier in the kitchen',
    },
    body: {
      fr: 'Vous dites ce que vous mangez. Trois bouteilles de votre cave montent, chacune avec sa raison.',
      en: 'You say what you\'re eating. Three bottles from your cellar rise, each with its reason.',
    },
    src: '/screenshots/02-home-suggestions.png',
    alt: {
      fr: 'Accueil sommelier — Bonsoir, à table',
      en: 'Sommelier home — Good evening, at the table',
    },
  },
  {
    eyebrow: { fr: '02 · Au restaurant', en: '02 · At the restaurant' },
    title: {
      fr: 'L\'accord discret',
      en: 'The discreet pairing',
    },
    body: {
      fr: 'Le menu × votre cave d\'expérience. Une suggestion. Aucun spectacle. Le sommelier de la table reste maître.',
      en: 'The menu × your cellar of experience. One suggestion. No show. The room\'s sommelier stays in charge.',
    },
    src: '/screenshots/03-menu-scan.png',
    alt: {
      fr: 'Mode Restaurant — accords mets et vins',
      en: 'Restaurant mode — food and wine pairing',
    },
  },
  {
    eyebrow: { fr: '03 · Le carnet', en: '03 · The journal' },
    title: {
      fr: 'La mémoire qui apprend',
      en: 'A memory that learns',
    },
    body: {
      fr: 'Chaque bouteille bue laisse une trace. Trente plus tard, votre cave commence à vous comprendre.',
      en: 'Each bottle opened leaves a trace. Thirty later, your cellar begins to understand you.',
    },
    src: '/screenshots/04-carnet.png',
    alt: {
      fr: 'Carnet de dégustation — Mémoire',
      en: 'Tasting journal — Memory',
    },
  },
];

export default function SectionTroisMoments() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="trois-moments" withDivider rhythm="standard">
      <FadeInOnScroll>
        <div className="text-center mb-14 sm:mb-20 max-w-3xl mx-auto">
          <div className="iq-eyebrow mb-6">
            {locale === 'fr' ? 'Trois moments' : 'Three moments'}
          </div>
          <h2 className="iq-display italic">
            {locale === 'fr'
              ? 'Trois moments où votre cave devient compagne.'
              : 'Three moments when your cellar becomes a companion.'}
          </h2>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-10 max-w-6xl mx-auto">
        {MOMENTS.map((m, i) => (
          <FadeInOnScroll key={i} delay={0.1 + i * 0.12}>
            <article className="flex flex-col items-center text-center">
              <ScreenshotFrame
                mode="static"
                frame="iphone"
                src={m.src}
                alt={m.alt[locale]}
                width={220}
                rotation={i === 1 ? -1 : 1}
                glow
              />
              <div className="mt-8 flex items-baseline gap-3 mb-3">
                <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-or/85 tabular-nums">
                  {m.eyebrow[locale]}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-[26px] text-foreground leading-snug mb-4 tracking-[-0.01em] max-w-[260px]">
                {m.title[locale]}
              </h3>
              <p className="iq-body text-foreground-dim leading-relaxed max-w-[280px]">
                {m.body[locale]}
              </p>
            </article>
          </FadeInOnScroll>
        ))}
      </div>

      <FadeInOnScroll delay={0.5}>
        <div className="mt-16 sm:mt-20 text-center max-w-2xl mx-auto">
          <p className="font-[family-name:var(--font-display)] italic text-or/90 text-lg sm:text-xl leading-relaxed">
            {locale === 'fr'
              ? '« Une cave, trois saisons d\'une même conversation. »'
              : '"One cellar, three seasons of the same conversation."'}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
