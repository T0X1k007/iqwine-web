'use client';

import Link from 'next/link';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import OctaveDemoVideo from '@/components/sections/OctaveDemoVideo';
import { useLocale } from '@/lib/i18n';

/**
 * SectionAI, « L'atelier du sommelier IA »
 *
 * Grille 2 colonnes :
 *   GAUCHE  — eyebrow + h2 + lead + lien « En savoir plus sur Octave »
 *   DROITE  — démo vidéo réelle de l'app (screen-recording) dans un cadre
 *             iPhone, en boucle automatique muette.
 */
export default function SectionAI() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="ai" withDivider rhythm="standard">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 max-w-6xl mx-auto items-center">
        <div className="lg:col-span-6">
          <FadeInOnScroll>
            <div className="iq-eyebrow mb-5">
              {locale === 'fr' ? 'La lecture' : 'The reading'}
            </div>
            <h2 className="iq-h1 italic mb-5">
              {locale === 'fr'
                ? 'Octave, une intelligence qui répond en sommelier.'
                : 'Octave, an intelligence that answers like a sommelier.'}
            </h2>
            <p className="iq-lead">
              {locale === 'fr'
                ? 'Vos bouteilles lues, votre palais compris. Demandez, trois propositions, et pourquoi.'
                : 'Your bottles read, your palate understood. Just ask, three picks, and why.'}
            </p>
            <Link
              href="/sommelier-ia"
              className="group mt-7 inline-flex items-center gap-1.5 text-or hover:text-or/80 font-[family-name:var(--font-display)] italic text-lg transition-colors"
            >
              {locale === 'fr' ? 'En savoir plus sur Octave' : 'Learn more about Octave'}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </FadeInOnScroll>
        </div>

        <div className="lg:col-span-6">
          <FadeInOnScroll delay={0.15}>
            <OctaveDemoVideo locale={locale} />
          </FadeInOnScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
