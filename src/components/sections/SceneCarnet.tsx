'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import ScreenshotFrame from '@/components/screenshot/ScreenshotFrame';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

/**
 * SceneCarnet — Scène III : mémoire de cave, carnet de dégustation.
 *
 * Layout V4-bis : 2 cols (lg+) — narratif tall LEFT + iPhone sticky RIGHT.
 *
 * Capture : 04-carnet.png — « Mémoire » Cormorant italic display +
 * 3 bouteilles bues récemment avec photos fond ivoire + dates +
 * actions « Annoter / Replacer en cave ».
 *
 * (Mode scroll-inside non utilisé ici car capture est de hauteur
 * iPhone standard. Si tu fournis plus tard une capture VERTICALE 3×
 * du Carnet via DevTools "Capture full size screenshot", on pourra
 * basculer en mode='scroll-inside'.)
 */

type Paragraph = {
  eyebrow: Record<Locale, string>;
  body: Record<Locale, string>;
};

const PARAGRAPHS: Paragraph[] = [
  {
    eyebrow: { fr: 'L\'empreinte', en: 'The imprint' },
    body: {
      fr: 'Chaque bouteille bue laisse une empreinte. Date. Compagnie. Sensation. Une note que vous écrivez en deux phrases — ou pas du tout.',
      en: 'Each bottle opened leaves an imprint. Date. Company. Sensation. A note you write in two sentences — or not at all.',
    },
  },
  {
    eyebrow: { fr: 'L\'apprentissage', en: 'The learning' },
    body: {
      fr: 'L\'app conserve. Le palais se révèle. Vous aimez de plus en plus les blancs minéraux. Vos six derniers choix le confirment, doucement.',
      en: 'The app keeps record. The palate reveals itself. You increasingly favor mineral whites. Your last six choices confirm it, quietly.',
    },
  },
  {
    eyebrow: { fr: 'La signature', en: 'The signature' },
    body: {
      fr: 'Trente bouteilles plus tard, votre cave commence à vous comprendre. Cinquante, elle vous devance.',
      en: 'Thirty bottles later, your cellar begins to understand you. Fifty, it anticipates you.',
    },
  },
];

export default function SceneCarnet() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="scene-carnet" withDivider rhythm="editorial">
      <FadeInOnScroll>
        <div className="text-center mb-16 sm:mb-24 max-w-3xl mx-auto">
          <div className="iq-eyebrow mb-6">
            {locale === 'fr' ? 'Scène III' : 'Scene III'}
          </div>
          <h2 className="iq-display italic">
            {locale === 'fr'
              ? 'La cave qui se souvient.'
              : 'A cellar that remembers.'}
          </h2>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 max-w-7xl mx-auto">
        {/* LEFT — tall narrative */}
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
            src="/screenshots/04-carnet.png"
            alt={
              locale === 'fr'
                ? 'Carnet de dégustation — Mémoire'
                : 'Tasting journal — Memory'
            }
            width={300}
            rotation={1.5}
            glow
            topOffset={120}
          />
        </div>

        {/* Mobile — iPhone après le texte */}
        <div className="lg:hidden mt-8 flex justify-center">
          <FadeInOnScroll delay={0.2}>
            <ScreenshotFrame
              mode="static"
              frame="iphone"
              src="/screenshots/04-carnet.png"
              alt={
                locale === 'fr'
                  ? 'Carnet de dégustation — Mémoire'
                  : 'Tasting journal — Memory'
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
              ? '« Ce que vous buvez écrit ce que vous êtes. »'
              : '"What you drink writes who you are."'}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
