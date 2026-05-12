'use client';

import { GlassWater, Sparkle, Heart, Library } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import TitleAccent from '@/components/ui/TitleAccent';
import Card from '@/components/ui/Card';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import StaggerChildren, {
  staggerItemVariants,
} from '@/components/motion/StaggerChildren';
import { useLocale } from '@/lib/i18n';
import { getImpact, getEyebrows } from '@/lib/constants';

const iconMap = { GlassWater, Sparkle, Heart, Library } as const;

export default function Impact() {
  const { locale } = useLocale();
  const impact = getImpact(locale);
  const eyebrows = getEyebrows(locale);
  const quoteOpen = locale === 'fr' ? '« ' : '“';
  const quoteClose = locale === 'fr' ? ' »' : '”';

  return (
    <SectionWrapper id="impact">
      <FadeInOnScroll>
        <div className="text-center mb-14">
          <div className="iq-eyebrow mb-6">{eyebrows.impact}</div>
          <h2 className="iq-h2 max-w-3xl mx-auto">
            <TitleAccent text={impact.title} />
          </h2>
          <p className="iq-lead mt-5 italic max-w-2xl mx-auto">
            {impact.subtitle}
          </p>
        </div>
      </FadeInOnScroll>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {impact.outcomes.map((outcome) => {
          const Icon = iconMap[outcome.icon];
          return (
            <motion.div key={outcome.title} variants={staggerItemVariants}>
              <Card className="h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-md bg-or/8 border border-or/20 flex items-center justify-center shrink-0">
                    <Icon size={16} strokeWidth={1.5} className="text-or" />
                  </div>
                  <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-or">
                    {outcome.title}
                  </p>
                </div>
                <p className="font-[family-name:var(--font-display)] italic text-foreground text-xl sm:text-2xl leading-snug tracking-tight">
                  {quoteOpen}{outcome.description}{quoteClose}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </StaggerChildren>
    </SectionWrapper>
  );
}
