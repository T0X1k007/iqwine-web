'use client';

import {
  Clock,
  BookOpen,
  Search,
  Utensils,
  Camera,
  Wine,
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import TitleAccent from '@/components/ui/TitleAccent';
import Card from '@/components/ui/Card';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import StaggerChildren, {
  staggerItemVariants,
} from '@/components/motion/StaggerChildren';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n';
import { getProblem, getEyebrows } from '@/lib/constants';

const iconMap = {
  Clock,
  BookOpen,
  Search,
  Utensils,
  Camera,
  Wine,
} as const;

export default function TheProblem() {
  const { locale } = useLocale();
  const problem = getProblem(locale);
  const eyebrows = getEyebrows(locale);

  return (
    <SectionWrapper id="problem">
      <FadeInOnScroll>
        <div className="mb-14 text-center">
          <div className="iq-eyebrow mb-6">{eyebrows.problem}</div>
          <h2 className="iq-h2 max-w-3xl mx-auto">
            <TitleAccent text={problem.title} />
          </h2>
        </div>
      </FadeInOnScroll>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {problem.points.map((point) => {
          const Icon = iconMap[point.icon];
          return (
            <motion.div key={point.title} variants={staggerItemVariants}>
              <Card className="h-full">
                <div className="w-10 h-10 rounded-md bg-or/8 border border-or/20 flex items-center justify-center mb-5">
                  <Icon size={18} strokeWidth={1.5} className="text-or" />
                </div>
                <h3 className="iq-h4 mb-3">{point.title}</h3>
                <p className="iq-body text-foreground-dim">
                  {point.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </StaggerChildren>
    </SectionWrapper>
  );
}
