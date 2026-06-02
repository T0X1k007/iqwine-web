'use client';

import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import { APP_SIGNUP_URL } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * FinalCta — clôture plein écran, dernier point de conversion. Un seul bouton,
 * une réassurance. Halo or sur noir (CSS pur, pas de framer).
 */
export default function FinalCta() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-or/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <FadeInOnScroll>
          <h2 className="iq-display italic">
            {t('Votre prochaine bouteille vous attend.', 'Your next bottle is waiting.')}
          </h2>
          <p className="iq-lead mt-6 max-w-xl mx-auto">
            {t(
              'Quoi ouvrir ce soir, quoi acheter à la SAQ — votre sommelier le sait déjà.',
              'What to open tonight, what to buy at the SAQ — your sommelier already knows.',
            )}
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <a
              href={APP_SIGNUP_URL}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'final' })}
            >
              <Button variant="or" size="lg">
                {t('Commencer — 14 jours, sans carte', 'Start free — 14 days, no card')}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground-faint">
              {t('Aucune carte requise · Résiliable en un geste', 'No card required · Cancel anytime')}
            </p>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
