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

  return (
    <SectionWrapper id="impact">
      <FadeInOnScroll>
        <div className="text-center mb-12">
          <div className="iq-eyebrow mb-6">{eyebrows.impact}</div>
          <h2 className="iq-h2 max-w-3xl mx-auto">
            <TitleAccent text={impact.title} />
          </h2>
        </div>
      </FadeInOnScroll>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {impact.outcomes.map((outcome) => {
          const Icon = iconMap[outcome.icon];
          return (
            <motion.div key={outcome.title} variants={staggerItemVariants}>
              <Card className="h-full">
                <div className="w-10 h-10 rounded-md bg-or/8 border border-or/20 flex items-center justify-center mb-4">
                  <Icon size={18} strokeWidth={1.5} className="text-or" />
                </div>
                <h3 className="iq-h4 mb-2">{outcome.title}</h3>
                <p className="iq-small text-foreground-dim italic">
                  {outcome.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </StaggerChildren>
    </SectionWrapper>
  );
}
