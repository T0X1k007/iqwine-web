'use client';

import { Lock } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import TitleAccent from '@/components/ui/TitleAccent';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import { getBeta, getEyebrows } from '@/lib/constants';

/**
 * BetaAccess — Coming Soon, no form.
 * Pas d'inscription publique. Sur invitation, accueil personnel.
 */
export default function BetaAccess() {
  const { locale } = useLocale();
  const beta = getBeta(locale);
  const eyebrows = getEyebrows(locale);

  return (
    <SectionWrapper id="beta" withDivider>
      <FadeInOnScroll>
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-card border border-border-strong rounded-2xl p-8 sm:p-14 overflow-hidden">
            {/* Glow or doux derrière la carte */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-or/40 to-transparent" />
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[480px] h-[240px] rounded-full bg-or/8 blur-[100px]" />
            </div>

            <div className="relative text-center">
              {/* Eyebrow */}
              <div className="iq-eyebrow mb-6">{eyebrows.beta}</div>

              {/* Lock icon discret */}
              <div className="flex justify-center mb-7">
                <div className="w-14 h-14 rounded-full bg-or/10 border border-or/30 flex items-center justify-center">
                  <Lock size={20} strokeWidth={1.5} className="text-or" />
                </div>
              </div>

              {/* Title */}
              <h2 className="iq-h2 mb-5">
                <TitleAccent text={beta.title} />
              </h2>

              {/* Description */}
              <p className="iq-lead mb-8 max-w-xl mx-auto">
                {beta.description}
              </p>

              {/* Detail italique éditoriale */}
              <p className="font-[family-name:var(--font-display)] italic text-foreground-dim text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
                {beta.detail}
              </p>

              {/* Note discrète + ligne or */}
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-border">
                <div className="w-8 h-px bg-or/40" />
                <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
                  {beta.note}
                </p>
                <div className="w-8 h-px bg-or/40" />
              </div>
            </div>
          </div>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
