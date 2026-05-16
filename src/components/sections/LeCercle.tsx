'use client';

import { motion } from 'framer-motion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import StaggerChildren, {
  staggerItemVariants,
} from '@/components/motion/StaggerChildren';
import { useLocale } from '@/lib/i18n';
import { getCircle, getEyebrows } from '@/lib/constants';

/**
 * Le Cercle — refonte magazine éditorial (Phase 3 D1).
 *
 * Architecture éditoriale :
 *   1. Header sobre (eyebrow + h2 court)
 *   2. Manifesto en hero pleine largeur — typo serif géant italique,
 *      encadré de hairlines or larges, respiration maximale
 *   3. Trois facettes en colonnes magazine (style Le Monde diplomatique) —
 *      pas d'icônes Lucide, pas de cards SaaS, hairlines or entre colonnes,
 *      titre serif + corps italique éditorial
 *
 * Sensation visée : grande maison qui parle au lecteur, pas un produit qui
 * liste ses qualités.
 */
export default function LeCercle() {
  const { locale } = useLocale();
  const circle = getCircle(locale);
  const eyebrows = getEyebrows(locale);
  const quoteOpen = locale === 'fr' ? '« ' : '“';
  const quoteClose = locale === 'fr' ? ' »' : '”';

  return (
    <SectionWrapper id="circle" withDivider>
      {/* Header sobre — ouverture éditoriale */}
      <FadeInOnScroll>
        <div className="text-center mb-20 sm:mb-28">
          <div className="iq-eyebrow mb-6">{eyebrows.circle}</div>
          <h2 className="iq-h2 max-w-3xl mx-auto">{circle.title}</h2>
        </div>
      </FadeInOnScroll>

      {/* Manifesto — hero éditorial pleine largeur, serif géant italique.
          Hairlines or larges au-dessus et en dessous donnent la respiration
          d'une citation tirée d'un grand livre. */}
      <FadeInOnScroll delay={0.15}>
        <div className="relative max-w-5xl mx-auto py-16 sm:py-24 px-4">
          <div className="absolute left-0 right-0 top-0 mx-auto w-48 sm:w-64 h-px bg-or/30" />
          <div className="absolute left-0 right-0 bottom-0 mx-auto w-48 sm:w-64 h-px bg-or/30" />

          <p
            className="font-[family-name:var(--font-display)] italic text-foreground tracking-tight text-center leading-[1.08]"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            <span className="text-or">{quoteOpen}</span>
            {circle.manifesto}
            <span className="text-or">{quoteClose}</span>
          </p>
        </div>
      </FadeInOnScroll>

      {/* Trois facettes — disposition magazine pure.
          - Pas d'icônes Lucide (trop "feature card")
          - Pas de fonds, pas de bordures arrondies
          - Hairlines or verticales entre colonnes (desktop),
            horizontales entre rangs (mobile)
          - Titre serif semibold + corps italique éditorial */}
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto mt-16 sm:mt-24">
        {circle.facets.map((facet, idx) => (
          <motion.div
            key={facet.title}
            variants={staggerItemVariants}
            className={`px-6 sm:px-10 py-10 md:py-4 ${
              idx > 0
                ? 'border-t md:border-t-0 md:border-l border-or/15'
                : ''
            }`}
          >
            <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-4 leading-tight">
              {facet.title}
            </h3>
            <p className="font-[family-name:var(--font-display)] italic text-foreground-dim text-base sm:text-lg leading-relaxed">
              {facet.description}
            </p>
          </motion.div>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}
