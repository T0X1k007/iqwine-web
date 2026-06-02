'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import ScreenshotFrame from '@/components/screenshot/ScreenshotFrame';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';

/**
 * SectionProof (#produit) — PREUVE HONNÊTE.
 * Uniquement de vraies captures du produit (proof of usage = l'app réelle).
 * AUCUN faux témoignage, AUCUNE métrique inventée. Note de marque first-person
 * factuelle. Quand de vrais témoignages/validations sommeliers existeront, les
 * brancher dans le bloc commenté ci-dessous.
 */

const SHOTS: { src: string; cap: { fr: string; en: string } }[] = [
  {
    src: '/screenshots/02-home-suggestions.png',
    cap: { fr: 'Ce soir — 3 suggestions de votre cave', en: 'Tonight — 3 picks from your cellar' },
  },
  {
    src: '/screenshots/03-menu-scan.png',
    cap: { fr: 'Au restaurant — la carte accordée à votre plat', en: 'At the restaurant — the list paired to your dish' },
  },
  {
    src: '/screenshots/01-fiche-vin.png',
    cap: { fr: 'Scan d’étiquette — la fiche selon votre palais', en: 'Label scan — the profile, by your palate' },
  },
];

export default function SectionProof() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <SectionWrapper id="produit" withDivider rhythm="editorial">
      <FadeInOnScroll>
        <div className="text-center mb-12 sm:mb-16">
          <div className="iq-eyebrow mb-5">{t('Le produit, en vrai', 'The real product')}</div>
          <h2 className="iq-display italic max-w-3xl mx-auto">
            {t('Pas une promesse. L’application.', 'Not a promise. The app.')}
          </h2>
          <p className="iq-lead mt-6 max-w-2xl mx-auto">
            {t(
              'Conçu au Québec, par des amateurs de vin, pour répondre à une seule question : quoi ouvrir ce soir ?',
              'Made in Québec, by wine lovers, to answer one question: what should you open tonight?',
            )}
          </p>
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.1}>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2 sm:mx-0 sm:px-0 sm:justify-center sm:flex-wrap">
          {SHOTS.map((shot, i) => (
            <div key={shot.src} className="shrink-0 flex flex-col items-center">
              <ScreenshotFrame
                mode="static"
                frame="iphone"
                src={shot.src}
                alt={shot.cap[locale]}
                width={232}
                rotation={i === 1 ? 0 : i === 0 ? -2 : 2}
                glow={i === 1}
              />
              <p className="iq-eyebrow-mute mt-5 text-center max-w-[232px]">
                {shot.cap[locale]}
              </p>
            </div>
          ))}
        </div>
      </FadeInOnScroll>

      {/*
        EMPLACEMENT TÉMOIGNAGES RÉELS — à activer UNIQUEMENT avec de vrais
        verbatims (nom + consentement). Aucune fausse preuve sociale.
        <ProofQuotes quotes={[{ name, role, quote }]} />
      */}
    </SectionWrapper>
  );
}
