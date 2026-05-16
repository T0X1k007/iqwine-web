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

type ModuleColor = 'cellier' | 'sommelier' | 'decouverte';
type Module = ReturnType<typeof getPlatform>['modules'][number];

const colorTextClass: Record<ModuleColor, string> = {
  cellier: 'text-cellier',
  sommelier: 'text-sommelier',
  decouverte: 'text-decouverte',
};

const colorBorderClass: Record<ModuleColor, string> = {
  cellier: 'border-cellier/40',
  sommelier: 'border-sommelier/40',
  decouverte: 'border-decouverte/40',
};

// Glyph background — gradient diagonal subtil de la couleur du module.
const colorBgGradient: Record<ModuleColor, string> = {
  cellier:
    'bg-[radial-gradient(circle_at_30%_30%,rgba(201,163,106,0.18),rgba(201,163,106,0.04))]',
  sommelier:
    'bg-[radial-gradient(circle_at_30%_30%,rgba(140,111,68,0.20),rgba(140,111,68,0.05))]',
  decouverte:
    'bg-[radial-gradient(circle_at_30%_30%,rgba(201,123,71,0.18),rgba(201,123,71,0.04))]',
};

/**
 * Platform — Phase 3 D2 : composition asymétrique éditoriale.
 *
 * Layout desktop (Option β) :
 *   ┌────────────────────┬──────────────┐
 *   │                    │  Restaurant  │
 *   │   MODE TONIGHT     ├──────────────┤
 *   │   (hero 3/5)       │  Scanner     │
 *   │                    ├──────────────┤
 *   │                    │  Recherche   │
 *   └────────────────────┴──────────────┘
 *   ┌──────────┬──────────┐
 *   │ Cellier  │  Palais  │
 *   └──────────┴──────────┘
 *
 * Mobile : stack vertical, Tonight en premier.
 *
 * Microcopy Phase 1B préservée. Mockups iPhone non touchés.
 */
export default function Platform() {
  const { locale } = useLocale();
  const platform = getPlatform(locale);
  const eyebrows = getEyebrows(locale);

  // Index par glyph — robuste vs réordonnancement futur du tableau modules.
  const byGlyph = Object.fromEntries(
    platform.modules.map((m) => [m.glyph, m])
  ) as Record<string, Module>;

  const tonight = byGlyph['T'];
  const restaurant = byGlyph['R'];
  const scanner = byGlyph['S'];
  const recherche = byGlyph['Q'];
  const cellier = byGlyph['C'];
  const palais = byGlyph['P'];

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

      <StaggerChildren>
        {/* Top row — Tonight hero (3/5 gauche) + stack 3 compacts (2/5 droite) */}
        <div className="flex flex-col lg:flex-row gap-5">
          <motion.div
            variants={staggerItemVariants}
            className="lg:w-3/5 flex"
          >
            <HeroCard module={tonight} />
          </motion.div>

          <div className="lg:w-2/5 flex flex-col gap-4">
            <motion.div variants={staggerItemVariants}>
              <CompactCard module={restaurant} />
            </motion.div>
            <motion.div variants={staggerItemVariants}>
              <CompactCard module={scanner} />
            </motion.div>
            <motion.div variants={staggerItemVariants}>
              <CompactCard module={recherche} />
            </motion.div>
          </div>
        </div>

        {/* Bottom row — Cellier + Palais (50/50) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <motion.div variants={staggerItemVariants}>
            <StandardCard module={cellier} />
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <StandardCard module={palais} />
          </motion.div>
        </div>
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

/* ───────────────────────────────────────────────────────────
 * HeroCard — Mode Tonight, présence éditoriale maximale.
 * Glyph 20×20 italique grand, padding généreux, description serif large.
 * Phase badge en bas + hairline = signature éditoriale magazine. */
function HeroCard({ module: mod }: { module: Module }) {
  return (
    <Card accentColor={mod.color} glass className="h-full flex flex-col p-8 sm:p-10 lg:p-12">
      <div className="flex items-start gap-5 mb-8">
        <div
          className={`relative shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center border ${colorBorderClass[mod.color]} ${colorBgGradient[mod.color]}`}
        >
          <span
            className={`font-[family-name:var(--font-display)] text-4xl font-semibold italic tracking-tight leading-none ${colorTextClass[mod.color]}`}
          >
            {mod.glyph}
          </span>
        </div>

        <div className="min-w-0 pt-2">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-2">
            {mod.tagline}
          </p>
          <h3
            className={`font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-tight leading-tight ${colorTextClass[mod.color]}`}
          >
            {mod.name}
          </h3>
        </div>
      </div>

      {/* Hairline or fine — séparation éditoriale */}
      <div className="h-px bg-or/20 mb-8" />

      {/* Description hero — serif italique grand format */}
      <p className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-medium italic text-foreground tracking-tight leading-snug mb-4">
        {mod.description}
      </p>

      <p className="font-[family-name:var(--font-display)] italic text-foreground-dim text-base sm:text-lg leading-relaxed">
        {mod.details}
      </p>

      {/* Phase badge bottom — signature éditoriale */}
      <div className="mt-auto pt-8 flex items-center gap-3">
        <div className="w-6 h-px bg-or/40" />
        <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-or">
          {mod.phase}
        </p>
      </div>
    </Card>
  );
}

/* ───────────────────────────────────────────────────────────
 * CompactCard — Restaurant, Scanner, Recherche.
 * Layout horizontal compact : glyph gauche + contenu droite.
 * Pas de hairline interne ni details — densité éditoriale. */
function CompactCard({ module: mod }: { module: Module }) {
  return (
    <Card accentColor={mod.color} glass className="h-full p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div
          className={`relative shrink-0 w-11 h-11 rounded-lg flex items-center justify-center border ${colorBorderClass[mod.color]} ${colorBgGradient[mod.color]}`}
        >
          <span
            className={`font-[family-name:var(--font-display)] text-lg font-semibold italic tracking-tight leading-none ${colorTextClass[mod.color]}`}
          >
            {mod.glyph}
          </span>
        </div>

        <div className="min-w-0 pt-0.5 flex-1">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <h3
              className={`font-[family-name:var(--font-display)] text-base sm:text-lg font-semibold tracking-tight leading-tight ${colorTextClass[mod.color]}`}
            >
              {mod.name}
            </h3>
            <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-or/70 shrink-0">
              {mod.phase}
            </p>
          </div>
          <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-muted-foreground mb-2.5">
            {mod.tagline}
          </p>
          <p className="font-[family-name:var(--font-display)] italic text-foreground text-base leading-snug">
            {mod.description}
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ───────────────────────────────────────────────────────────
 * StandardCard — Cellier vivant, Palais.
 * Bottom row 50/50, plus de largeur que la grille 3-cols précédente.
 * Conserve le rendu vertical complet (titre + tagline + description + details). */
function StandardCard({ module: mod }: { module: Module }) {
  return (
    <Card accentColor={mod.color} glass className="h-full p-7 sm:p-8">
      <div className="flex items-start gap-4 mb-6">
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
            className={`font-[family-name:var(--font-display)] text-lg sm:text-xl font-semibold tracking-tight ${colorTextClass[mod.color]}`}
          >
            {mod.name}
          </h3>
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-muted-foreground mt-1.5">
            {mod.tagline}
          </p>
        </div>
      </div>

      {/* Hairline or fine */}
      <div className="h-px bg-or/15 mb-5" />

      <p className="font-[family-name:var(--font-display)] text-lg font-medium italic leading-snug text-foreground tracking-tight mb-2">
        {mod.description}
      </p>
      <p className="iq-small text-foreground-dim italic">{mod.details}</p>
    </Card>
  );
}
