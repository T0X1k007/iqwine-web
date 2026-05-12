'use client';

import { BookOpen, Sparkles, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import StaggerChildren, {
  staggerItemVariants,
} from '@/components/motion/StaggerChildren';
import { useLocale } from '@/lib/i18n';
import { getCircle, getEyebrows } from '@/lib/constants';

const iconMap = { BookOpen, Sparkles, Map } as const;

/**
 * Le Cercle — section manifesto + lifestyle collectionneur.
 * La citation centrale en serif italique grand format = signature éditoriale.
 * Les 3 facettes en colonnes minimalistes (pas de cards lourdes — manifesto domine).
 */
export default function LeCercle() {
  const { locale } = useLocale();
  const circle = getCircle(locale);
  const eyebrows = getEyebrows(locale);
  const quoteOpen = locale === 'fr' ? '« ' : '“';
  const quoteClose = locale === 'fr' ? ' »' : '”';

  return (
    <SectionWrapper id="circle" withDivider>
      <FadeInOnScroll>
        <div className="text-center mb-12">
          <div className="iq-eyebrow mb-6">{eyebrows.circle}</div>
          <h2 className="iq-h2 max-w-3xl mx-auto">{circle.title}</h2>
        </div>
      </FadeInOnScroll>

      {/* Manifesto — citation centrale signature éditoriale luxe */}
      <FadeInOnScroll delay={0.15}>
        <div className="relative max-w-3xl mx-auto py-14 sm:py-20">
          {/* Hairlines or de part et d'autre */}
          <div className="absolute left-0 right-0 top-0 mx-auto w-32 h-px bg-or/30" />
          <div className="absolute left-0 right-0 bottom-0 mx-auto w-32 h-px bg-or/30" />

          <p className="font-[family-name:var(--font-display)] italic text-foreground text-2xl sm:text-3xl md:text-4xl leading-snug tracking-tight text-center px-6">
            <span className="text-or">{quoteOpen}</span>
            {circle.manifesto}
            <span className="text-or">{quoteClose}</span>
          </p>
        </div>
      </FadeInOnScroll>

      {/* Trois facettes — colonnes minimalistes, pas de cards lourdes */}
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14 max-w-5xl mx-auto mt-6">
        {circle.facets.map((facet) => {
          const Icon = iconMap[facet.icon];
          return (
            <motion.div
              key={facet.title}
              variants={staggerItemVariants}
              className="text-center"
            >
              <div className="flex justify-center mb-5">
                <div className="w-11 h-11 rounded-full bg-or/8 border border-or/25 flex items-center justify-center">
                  <Icon size={18} strokeWidth={1.5} className="text-or" />
                </div>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-foreground mb-3">
                {facet.title}
              </h3>
              <p className="iq-small text-foreground-dim leading-relaxed">
                {facet.description}
              </p>
            </motion.div>
          );
        })}
      </StaggerChildren>
    </SectionWrapper>
  );
}
