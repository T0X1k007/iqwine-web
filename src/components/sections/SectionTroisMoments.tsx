'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import ScreenshotFrame from '@/components/screenshot/ScreenshotFrame';
import OctaveDemoVideo from '@/components/sections/OctaveDemoVideo';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

/**
 * SectionTroisMoments — section unique « Partout où vous buvez ».
 *
 * Vague 1 : fusion. Cette section absorbe les anciennes sections Proof (vraies
 * captures du produit) et AI (démo vidéo Octave via OctaveDemoVideo), toutes
 * deux RETIRÉES. Trois moments d'usage en un coup d'œil :
 * À la maison · Au point de vente · Au restaurant.
 *
 * Captures DISTINCTES par colonne (jamais le même PNG deux fois) :
 *   maison      → 02-home-suggestions (choisir dans sa cave)
 *   point de vente → 06-recherche-hors-cave (bouteille en tablette, en magasin)
 *   restaurant  → 03-menu-scan (accord avec le plat, sur place)
 *
 * Mobile : stack vertical (iPhone + texte par moment), puis la vidéo Octave.
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
    eyebrow: { fr: '01 · À la maison', en: '01 · At home' },
    title: {
      fr: 'À la maison',
      en: 'At home',
    },
    body: {
      fr: 'Quoi ouvrir ce soir ? Octave choisit dans votre cave, selon votre palais.',
      en: 'What to open tonight? Octave picks from your cellar, to match your palate.',
    },
    src: '/screenshots/02-home-suggestions.png',
    alt: {
      fr: 'Accueil Octave, suggestions du soir depuis votre cave',
      en: 'Octave home, tonight’s picks from your cellar',
    },
  },
  {
    eyebrow: { fr: '02 · Au point de vente', en: '02 · At the store' },
    title: {
      fr: 'Au point de vente',
      en: 'At the store',
    },
    body: {
      fr: 'Octave vous guide vers la bouteille en tablette, près de vous, partout au Québec.',
      en: 'Octave guides you to the bottle on the shelf, near you, across Québec.',
    },
    src: '/screenshots/06-recherche-hors-cave.png',
    alt: {
      fr: 'Recherche locale, disponibilité par magasin',
      en: 'Local search, availability by store',
    },
  },
  {
    eyebrow: { fr: '03 · Au restaurant', en: '03 · At the restaurant' },
    title: {
      fr: 'Au restaurant',
      en: 'At the restaurant',
    },
    body: {
      fr: 'Scannez la carte des vins : Octave repère l’accord avec votre plat, sur place.',
      en: 'Scan the wine list: Octave finds the pairing for your dish, right at the table.',
    },
    src: '/screenshots/03-menu-scan.png',
    alt: {
      fr: 'Scan de la carte des vins, accord avec le plat',
      en: 'Wine list scan, pairing with the dish',
    },
  },
];

export default function SectionTroisMoments() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="trois-moments" withDivider rhythm="standard" className="section-breathe">
      <FadeInOnScroll>
        <div className="text-center mb-14 sm:mb-20 max-w-3xl mx-auto">
          <div className="iq-eyebrow mb-6">
            {locale === 'fr' ? 'Partout où vous buvez' : 'Wherever you drink'}
          </div>
          <h2 className="iq-display italic">
            {locale === 'fr'
              ? 'À la maison. Au point de vente. Au restaurant.'
              : 'At home. At the store. At the restaurant.'}
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
                width={i === 2 ? 264 : 190}
                rotation={i === 1 ? -1 : 1}
                glow
              />
              <div className="mt-8 flex items-baseline gap-3 mb-3">
                <span className="font-body text-[10px] tracking-[0.32em] uppercase text-or/85 tabular-nums">
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

      {/* KILL-SHOT RESTO — le moat fort : le scan resto en situation. */}
      <FadeInOnScroll delay={0.35}>
        <div className="mt-16 sm:mt-20 text-center max-w-3xl mx-auto">
          <div className="iq-eyebrow mb-5">
            {locale === 'fr' ? 'Au restaurant' : 'At the restaurant'}
          </div>
          <p className="font-[family-name:var(--font-display)] text-foreground/90 text-xl sm:text-2xl leading-relaxed">
            {locale === 'fr'
              ? 'Vivino note une bouteille. ChatGPT ne voit pas la carte. Octave lit CETTE carte, pour CE plat, dans CE budget — à CETTE table.'
              : 'Vivino rates a bottle. ChatGPT can’t see the list. Octave reads THIS list, for THIS dish, in THIS budget — at THIS table.'}
          </p>
          <span className="mx-auto mt-7 mb-6 block h-px w-12 bg-or/40" aria-hidden />
          <p className="font-[family-name:var(--font-display)] italic text-or text-lg sm:text-xl leading-relaxed">
            {locale === 'fr'
              ? 'Le seul sommelier qui vous suit jusqu’à la table du restaurant.'
              : 'The only sommelier that follows you to the restaurant table.'}
          </p>
        </div>
      </FadeInOnScroll>

      {/* Démo vidéo Octave — absorbée depuis SectionAI (OctaveDemoVideo). */}
      <FadeInOnScroll delay={0.45}>
        <div className="mt-20 sm:mt-24">
          <OctaveDemoVideo locale={locale} />
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.55}>
        <div className="mt-16 sm:mt-20 text-center max-w-2xl mx-auto">
          <p className="font-[family-name:var(--font-display)] italic text-or/90 text-lg sm:text-xl leading-relaxed">
            {locale === 'fr'
              ? '« Conçu au Québec, par des amateurs de vin, pour une seule question : quoi ouvrir ce soir ? »'
              : '"Made in Québec, by wine lovers, for one question: what should you open tonight?"'}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
