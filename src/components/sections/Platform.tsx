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
type CardWeight = 'hero' | 'standard' | 'compact';

const colorTextClass: Record<ModuleColor, string> = {
  cellier: 'text-cellier',
  sommelier: 'text-sommelier',
  decouverte: 'text-decouverte',
};

const colorBorderClass: Record<ModuleColor, string> = {
  cellier: 'border-cellier/35',
  sommelier: 'border-sommelier/35',
  decouverte: 'border-decouverte/35',
};

// Glyph background — gradient diagonal subtil, faible présence visuelle.
const colorBgGradient: Record<ModuleColor, string> = {
  cellier:
    'bg-[radial-gradient(circle_at_30%_30%,rgba(201,163,106,0.14),rgba(201,163,106,0.03))]',
  sommelier:
    'bg-[radial-gradient(circle_at_30%_30%,rgba(140,111,68,0.16),rgba(140,111,68,0.04))]',
  decouverte:
    'bg-[radial-gradient(circle_at_30%_30%,rgba(201,123,71,0.14),rgba(201,123,71,0.03))]',
};

// Padding uniforme pour les 6 cards (Phase 3 D2bis - Ajustement A).
//
// Les variations 6-8% par weight (hero/standard/compact) créaient une fausse
// hiérarchie : le padding ne compensait pas la longueur variable du contenu,
// résultat aléatoire (mesure DOM : Restaurant standard 244px > Tonight hero
// 226px). On laisse les hauteurs venir naturellement du contenu, sans
// tentative d'organique forcé.
//
// Suffix `!` (Tailwind 4 important modifier) requis pour override le
// p-6 sm:p-8 baked-in de Card.tsx.
const paddingByWeight: Record<CardWeight, string> = {
  hero: 'p-7! sm:p-8!',
  standard: 'p-7! sm:p-8!',
  compact: 'p-7! sm:p-8!',
};

/**
 * Platform — Section Suite, refonte finale post-D2 (validée Eric 2026-05-16).
 *
 * Direction : Apple luxury / Aman Resorts / Monocle / magazine éditorial discret.
 *
 * Architecture :
 *   - 1 SEUL composant FeatureCard (suppression de HeroCard/CompactCard/StandardCard)
 *   - Hiérarchie par typographie, pas par taille de card
 *   - Variations subtiles 6-8% via padding interne (jamais row-span ni contenu)
 *   - Grid items-start → cascade organique au lieu d'auto-rows-fr SaaS
 *   - Glyph 32-34px lettrine éditoriale (faible dominance)
 *
 * Microcopy Phase 1B intacte. Mockups iPhone, Hero, Cercle, Accès, Footer
 * non touchés. Card.tsx (glass + accentColor) réutilisé tel quel.
 */
export default function Platform() {
  const { locale } = useLocale();
  const platform = getPlatform(locale);
  const eyebrows = getEyebrows(locale);

  // Index par glyph — robuste vs réordonnancement futur du tableau.
  const byGlyph = Object.fromEntries(
    platform.modules.map((m) => [m.glyph, m])
  ) as Record<string, Module>;

  // Composition row 1 / row 2 desktop. Cascade subtile des poids :
  //   row 1 : hero · standard · compact
  //   row 2 : compact · hero · standard
  // → pattern alterné, pas de symétrie SaaS.
  const cards: Array<{ module: Module; weight: CardWeight }> = [
    { module: byGlyph['T'], weight: 'hero' },        // Tonight
    { module: byGlyph['R'], weight: 'standard' },    // Restaurant
    { module: byGlyph['S'], weight: 'compact' },     // Scanner
    { module: byGlyph['Q'], weight: 'compact' },     // Recherche
    { module: byGlyph['C'], weight: 'hero' },        // Cellier
    { module: byGlyph['P'], weight: 'standard' },    // Palais
  ];

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

      {/* Grid 3x2 raffinée : items-start permet aux cards de garder leur
          hauteur naturelle, créant une cascade organique. Aucun auto-rows-fr
          qui forcerait l'égalité SaaS. */}
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {cards.map(({ module: mod, weight }) => (
          <motion.div key={mod.name} variants={staggerItemVariants}>
            <FeatureCard module={mod} weight={weight} />
          </motion.div>
        ))}
      </StaggerChildren>

      {/* Flow line — 6 phases en mono uppercase or, hairlines latérales */}
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
 * FeatureCard — composant unique unifié.
 *
 * Anatomie magazine éditorial :
 *   [glyph] OVERLINE MONO TRÈS DISCRÈTE
 *           Titre serif italique élégant
 *   ────────────────  (hairline or ultra fine)
 *   Description serif italique 18-20px medium-weight
 *   Détails serif italique 14px foreground-dim
 *
 * Le glyph 32-34px agit comme lettrine éditoriale — accompagne, ne domine pas.
 * Variations de hauteur via prop weight (padding seulement, jamais contenu). */
function FeatureCard({ module: mod, weight }: { module: Module; weight: CardWeight }) {
  return (
    <Card
      accentColor={mod.color}
      glass
      className={`h-full ${paddingByWeight[weight]}`}
    >
      <div className="flex items-start gap-3.5 mb-5">
        {/* Glyph 32×32 mobile / 34×34 desktop — lettrine éditoriale,
            faible glow, présence subtile. */}
        <div
          className={`shrink-0 w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-lg flex items-center justify-center border ${colorBorderClass[mod.color]} ${colorBgGradient[mod.color]}`}
        >
          <span
            className={`font-[family-name:var(--font-display)] text-[15px] sm:text-base font-semibold italic tracking-tight leading-none ${colorTextClass[mod.color]}`}
          >
            {mod.glyph}
          </span>
        </div>

        <div className="min-w-0 pt-0.5 flex-1">
          {/* Overline mono ultra discrète — signature éditoriale */}
          <p className="font-mono text-[9.5px] tracking-[0.28em] uppercase text-muted-foreground/75 mb-1.5">
            {mod.tagline}
          </p>
          {/* Titre serif roman — ancrage visuel (Ajustement B).
              L'italique est réservé à la voix éditoriale : glyph + description + details. */}
          <h3
            className={`font-[family-name:var(--font-display)] text-[20px] sm:text-[22px] font-semibold tracking-tight leading-tight ${colorTextClass[mod.color]}`}
          >
            {mod.name}
          </h3>
        </div>
      </div>

      {/* Hairline or ultra fine — ligne magazine luxe (pas un divider SaaS) */}
      <div className="h-px bg-or/10 mb-5" />

      {/* Description serif italique plus présente — la phrase signature */}
      <p className="font-[family-name:var(--font-display)] italic text-foreground text-lg sm:text-[19px] font-medium tracking-tight leading-snug mb-3">
        {mod.description}
      </p>

      {/* Détails respirants et raffinés */}
      <p className="font-[family-name:var(--font-display)] italic text-foreground-dim text-sm leading-relaxed">
        {mod.details}
      </p>
    </Card>
  );
}
