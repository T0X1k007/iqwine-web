'use client';

import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * FinalCta, clôture plein écran, dernier point de conversion. Un seul bouton,
 * une réassurance. Halo or sur noir (CSS pur, pas de framer).
 */
export default function FinalCta() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  // Phase 6 (discipline de l'or), halo or décoratif retiré ; la clôture
  // repose sur la typographie et le CTA, pas sur un glow.
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <FadeInOnScroll>
          <h2 className="iq-display italic">
            {t('Trouvez votre prochaine bonne bouteille.', 'Find your next great bottle.')}
          </h2>
          <p className="iq-lead mt-6 max-w-xl mx-auto">
            {t(
              'Quoi ouvrir ce soir, quoi acheter près de vous, Octave le sait déjà.',
              'What to open tonight, what to buy near you, Octave already knows.',
            )}
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <a
              href={buildSignupUrl('final', { lang: locale })}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'final' })}
            >
              <Button variant="cta" size="lg">
                {t('Essai gratuit 14 jours', 'Free Trial 14 Days')}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
            <p className="font-body text-[10px] tracking-[0.18em] uppercase text-foreground-faint">
              {t(
                '14 jours gratuits · Sans carte · Résiliable en un geste',
                '14 free days · No card · Cancel anytime',
              )}
            </p>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
