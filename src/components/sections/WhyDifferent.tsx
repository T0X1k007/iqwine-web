'use client';

import { X, Sparkles } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import TitleAccent from '@/components/ui/TitleAccent';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import StaggerChildren, {
  staggerItemVariants,
} from '@/components/motion/StaggerChildren';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n';
import { getDifferent, getEyebrows } from '@/lib/constants';

export default function WhyDifferent() {
  const { locale } = useLocale();
  const different = getDifferent(locale);
  const eyebrows = getEyebrows(locale);

  return (
    <SectionWrapper withDivider>
      <FadeInOnScroll>
        <div className="text-center mb-12">
          <div className="iq-eyebrow mb-6">{eyebrows.different}</div>
          <h2 className="iq-h2">
            <TitleAccent text={different.title} />
          </h2>
        </div>
      </FadeInOnScroll>

      <div className="max-w-xl mx-auto">
        <StaggerChildren className="space-y-3">
          {different.points.map((point) => (
            <motion.div
              key={point}
              variants={staggerItemVariants}
              className="flex items-center gap-3 border-b border-border pb-3"
            >
              <X size={16} strokeWidth={1.5} className="text-foreground-faint shrink-0" />
              <span className="iq-body text-foreground-dim">{point}</span>
            </motion.div>
          ))}
        </StaggerChildren>

        <FadeInOnScroll delay={0.5}>
          <div className="flex items-center gap-3 mt-10 bg-elev border border-or/30 rounded-lg p-5">
            <Sparkles size={20} strokeWidth={1.5} className="text-or shrink-0" />
            <span className="iq-body font-medium text-or italic">
              {different.conclusion}
            </span>
          </div>
        </FadeInOnScroll>
      </div>
    </SectionWrapper>
  );
}
