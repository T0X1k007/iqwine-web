'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Pricing from '@/components/sections/Pricing';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';

/**
 * Section tarifs de la home (ancre #tarifs ciblée par la nav). Réutilise les
 * cartes Pricing, puis renvoie vers la page de décision complète /tarifs via un
 * lien évident « Comment ça fonctionne ? ».
 */
export default function SectionTarifs() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section id="tarifs" className="scroll-mt-28">
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
