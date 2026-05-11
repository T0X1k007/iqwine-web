'use client';

import { Eye, Sparkles, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import TitleAccent from '@/components/ui/TitleAccent';
import Card from '@/components/ui/Card';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import StaggerChildren, {
  staggerItemVariants,
} from '@/components/motion/StaggerChildren';
import { useLocale } from '@/lib/i18n';
import { getSolution, getEyebrows } from '@/lib/constants';

const iconMap = { Eye, Sparkles, Compass } as const;

export default function WhatIsIQWine() {
  const { locale } = useLocale();
  const solution = getSolution(locale);
  const eyebrows = getEyebrows(locale);

  return (
    <SectionWrapper withDivider>
      <FadeInOnScroll>
        <div className="text-center mb-12">
          <div className="iq-eyebrow mb-6">{eyebrows.solution}</div>
          <h2 className="iq-h2">
            <TitleAccent text={solution.title} />
          </h2>
          <p className="iq-lead mt-4 text-or italic">
            {solution.subtitle}
          </p>
        </div>
      </FadeInOnScroll>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {solution.pillars.map((pillar) => {
          const Icon = iconMap[pillar.icon];
          return (
            <motion.div key={pillar.title} variants={staggerItemVariants}>
              <Card className="h-full">
                <div className="w-11 h-11 rounded-md bg-or/8 border border-or/20 flex items-center justify-center mb-5">
                  <Icon size={20} strokeWidth={1.5} className="text-or" />
                </div>
                <h3 className="iq-h4 mb-3">{pillar.title}</h3>
                <p className="iq-body text-foreground-dim">
                  {pillar.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </StaggerChildren>
    </SectionWrapper>
  );
}
