'use client';

import Image from 'next/image';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';

/**
 * SectionCaveWeb, « Une cave qui se souvient » — pilier émotionnel central
 * (Vague 1). Le fichier et l'export `SectionCaveWeb` sont conservés pour ne
 * pas casser l'import ; seul le contenu change. La cave n'est plus un
 * inventaire qui oublie : c'est une mémoire qui apprend votre palais.
 *
 * Layout : titre + corps + 4 appuis LEFT, capture cockpit desktop RIGHT
 * (08-cellier-desktop.png HD retina), conservée de la version précédente.
 */

export default function SectionCaveWeb() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const pillars = [
    t('Mémoire de vos goûts', 'A memory of your tastes'),
    t(
      'Apogée suivie, bouteille par bouteille',
      'Drinking windows tracked, bottle by bottle',
    ),
    t('Historique de vos dégustations', 'A history of your tastings'),
    t(
      'Apprentissage continu de votre palais',
      'Continuous learning of your palate',
    ),
  ];

  return (
    <SectionWrapper id="cave-web" tone="light" withDivider rhythm="standard">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-7xl mx-auto items-center">
        {/* LEFT, typo */}
        <div className="lg:col-span-5">
          <FadeInOnScroll>
            <div className="iq-eyebrow mb-6">
              {t("LE CŒUR D'IQWINE", 'THE HEART OF IQWINE')}
            </div>
            <h2 className="iq-h1 italic mb-6">
              {t('Une cave qui se souvient.', 'A cellar that remembers.')}
            </h2>
            <p className="iq-lead mb-8">
              {t(
                "Elle se souvient de ce que vous avez aimé. Elle connaît l'apogée de chaque bouteille, votre historique, vos préférences — et elle apprend à chaque dégustation. Vous ne gérez plus un inventaire qui oublie. Vous vivez avec une cave qui vous connaît.",
                'It remembers what you loved. It knows the drinking window of every bottle, your history, your preferences — and it learns with every tasting. You no longer manage an inventory that forgets. You live with a cellar that knows you.',
              )}
            </p>
            <ul className="space-y-3 max-w-md">
              {pillars.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="h-px w-6 bg-or/40 shrink-0" aria-hidden />
                  <span className="iq-small text-foreground-dim">{p}</span>
                </li>
              ))}
            </ul>
          </FadeInOnScroll>
        </div>

        {/* RIGHT, capture cockpit desktop (conservée) */}
        <div className="lg:col-span-7">
          <FadeInOnScroll delay={0.2} direction="left">
            <div
              className="relative rounded-xl overflow-hidden border border-or/15"
              style={{
                // Ombre adoucie en charbon chaud pour la section claire.
                boxShadow:
                  '0 28px 80px rgba(33, 27, 23, 0.22), 0 6px 20px rgba(33, 27, 23, 0.12)',
                transform: 'rotate(-0.5deg)',
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background:
                    'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(212, 165, 72, 0.08), transparent 70%)',
                }}
              />
              <Image
                src="/screenshots/08-cellier-desktop.png"
                alt={t(
                  'La cave Bigras, vue desktop complète avec sidebar et grid bouteilles',
                  'Bigras cellar, full desktop view with sidebar and bottles grid',
                )}
                width={1487}
                height={758}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="block w-full h-auto"
                priority={false}
              />
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
