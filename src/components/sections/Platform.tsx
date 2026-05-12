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
  cellier: 'border-cellier/40',
  sommelier: 'border-sommelier/40',
  decouverte: 'border-decouverte/40',
} as const;

// Glyph background — gradient diagonal subtil de la couleur du module.
const colorBgGradient = {
  cellier:
    'bg-[radial-gradient(circle_at_30%_30%,rgba(201,163,106,0.18),rgba(201,163,106,0.04))]',
  sommelier:
    'bg-[radial-gradient(circle_at_30%_30%,rgba(140,111,68,0.20),rgba(140,111,68,0.05))]',
  decouverte:
    'bg-[radial-gradient(circle_at_30%_30%,rgba(201,123,71,0.18),rgba(201,123,71,0.04))]',
} as const;

export default function Platform() {
  const { locale } = useLocale();
  const platform = getPlatform(locale);
  const eyebrows = getEyebrows(locale);

  return (
    <SectionWrapper id="platform">
      <FadeInOnScroll>
        <div className="text-center mb-16">
          <div className="iq-eyebrow mb-6">{eyebrows.platform}</div>
          <h2 className="iq-h2 max-w-3xl mx-auto">
            <TitleAccent text={platform.title} />
          </h2>
          <p className="iq-lead mt-5 max-w-2xl mx-auto italic">
            {platform.subtitle}
          </p>
        </div>
      </FadeInOnScroll>

      {/* Six features — grille 2/3 cols, design premium luxe sobre */}
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {platform.modules.map((mod) => (
          <motion.div key={mod.name} variants={staggerItemVariants}>
            <Card accentColor={mod.color} glass className="h-full">
              <div className="flex items-start gap-4 mb-6">
                {/* Glyph — pastille gradient avec lettre serif italique */}
                <div
                  className={`relative shrink-0 w-14 h-14 rounded-xl flex items-center justify-center border ${colorBorderClass[mod.color]} ${colorBgGradient[mod.color]}`}
                >
                  <span
                    className={`font-[family-name:var(--font-display)] text-2xl font-semibold italic tracking-tight leading-none ${colorTextClass[mod.color]}`}
                  >
                    {mod.glyph}
                  </span>
                </div>

                <div className="min-w-0 pt-1">
                  <h3
                    className={`font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight ${colorTextClass[mod.color]}`}
                  >
                    {mod.name}
                  </h3>
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-muted-foreground mt-1.5">
                    {mod.tagline}
                  </p>
                </div>
              </div>

              {/* Hairline divider */}
              <div className="h-px bg-border mb-5" />

              <p className="font-[family-name:var(--font-display)] text-lg font-medium leading-snug text-foreground tracking-tight mb-2">
                {mod.description}
              </p>
              <p className="iq-small text-foreground-dim italic">{mod.details}</p>
            </Card>
          </motion.div>
        ))}
      </StaggerChildren>

      {/* Flow line — 6 phases en mono uppercase or */}
      <FadeInOnScroll delay={0.3}>
        <div className="flex items-center justify-center mt-14">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-or/30" />
            <p className="font-mono text-[11px] tracking-[0.32em] uppercase text-or text-center">
              {platform.flowDescription}
            </p>
            <div className="w-8 h-px bg-or/30" />
          </div>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
