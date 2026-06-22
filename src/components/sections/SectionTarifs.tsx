'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Pricing from '@/components/sections/Pricing';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import { APP_SIGNUP_URL } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * Section tarifs de la home (ancre #tarifs ciblée par la nav). Vague 1 : un CTA
 * NEUTRE « Commencer l'essai » coiffe la grille — démarrer sans avoir à choisir
 * un plan. La grille Pricing suit, puis le renvoi vers /tarifs.
 */
export default function SectionTarifs() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section id="tarifs" className="scroll-mt-28">
      {/* CTA neutre — commencer l'essai sans présélectionner de plan. */}
      <div className="px-6 pt-20 sm:pt-24 pb-16 sm:pb-20 text-center">
        <FadeInOnScroll>
          <a
            href={APP_SIGNUP_URL}
            onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'pricing_top' })}
            className="inline-block"
          >
            <Button variant="cta" size="lg">
              {t('Commencer l’essai', 'Start the trial')}
              <ArrowRight size={16} strokeWidth={1.75} />
            </Button>
          </a>
        </FadeInOnScroll>
      </div>

      <Pricing />
      <div className="px-6 pb-20 text-center">
        <FadeInOnScroll>
          <Link
            href="/tarifs"
            className="group inline-flex items-center gap-2 rounded-pill border border-or/30 bg-or/[0.04] px-6 py-3 text-or hover:bg-or/[0.08] font-[family-name:var(--font-display)] italic text-lg transition-colors"
          >
            {t('Comment ça fonctionne ?', 'How does it work?')}
            <ArrowRight
              size={17}
              strokeWidth={1.75}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
