'use client';

import { motion } from 'framer-motion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import TitleAccent from '@/components/ui/TitleAccent';
import Card from '@/components/ui/Card';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import StaggerChildren, {
  staggerItemVariants,
} from '@/components/motion/StaggerChildren';
import { useLocale } from '@/lib/i18n';
import { getPlatform, getEyebrows } from '@/lib/constants';

const colorTextClass = {
  cellier: 'text-cellier',
  sommelier: 'text-sommelier',
  decouverte: 'text-decouverte',
} as const;

const colorBorderClass = {
  cellier: 'border-cellier/30',
  sommelier: 'border-sommelier/30',
  decouverte: 'border-decouverte/30',
} as const;

const colorBgClass = {
  cellier: 'bg-cellier/8',
  sommelier: 'bg-sommelier/10',
  decouverte: 'bg-decouverte/8',
} as const;

export default function Platform() {
  const { locale } = useLocale();
  const platform = getPlatform(locale);
  const eyebrows = getEyebrows(locale);

  return (
    <SectionWrapper id="platform">
      <FadeInOnScroll>
        <div className="text-center mb-14">
          <div className="iq-eyebrow mb-6">{eyebrows.platform}</div>
          <h2 className="iq-h2 max-w-3xl mx-auto">
            <TitleAccent text={platform.title} />
          </h2>
          <p className="iq-lead mt-5 max-w-2xl mx-auto">
            {platform.subtitle}
          </p>
        </div>
      </FadeInOnScroll>

      {/* Six features en grille 2/3 cols, glyph + accent border */}
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platform.modules.map((mod) => (
          <motion.div key={mod.name} variants={staggerItemVariants}>
            <Card accentColor={mod.color} className="h-full">
              <div className="flex items-start gap-4 mb-5">
                {/* Glyph */}
                <div
                  className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border ${colorBorderClass[mod.color]} ${colorBgClass[mod.color]}`}
                >
                  <span
                    className={`font-[family-name:var(--font-display)] text-xl font-bold tracking-tight leading-none ${colorTextClass[mod.color]}`}
                  >
                    {mod.glyph}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3
                    className={`font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight ${colorTextClass[mod.color]}`}
                  >
                    {mod.name}
                  </h3>
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground mt-1">
                    {mod.tagline}
                  </p>
                </div>
              </div>

              <p className="iq-body font-semibold text-foreground mb-2">
                {mod.description}
              </p>
              <p className="iq-small text-foreground-dim">{mod.details}</p>
            </Card>
          </motion.div>
        ))}
      </StaggerChildren>

      {/* Flow line at bottom — 6 phases mono */}
      <FadeInOnScroll delay={0.3}>
        <div className="flex items-center justify-center mt-12">
          <p className="font-mono text-[11px] tracking-[0.32em] uppercase text-or text-center">
            {platform.flowDescription}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
