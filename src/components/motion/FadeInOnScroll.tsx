'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FadeInOnScrollProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

/**
 * Reveal au SCROLL (façon iQForge) : le contenu se révèle quand il entre dans le
 * viewport, pas au mount. IntersectionObserver via framer-motion `whileInView`,
 * une seule fois. Le contenu déjà à l'écran au chargement s'anime immédiatement.
 * `prefers-reduced-motion` respecté (rendu direct, sans animation).
 */
const OFFSET: Record<NonNullable<FadeInOnScrollProps['direction']>, { x?: number; y?: number }> = {
  up: { y: 26 },
  down: { y: -26 },
  left: { x: 26 },
  right: { x: -26 },
};

export default function FadeInOnScroll({
  children,
  delay = 0,
  duration = 0.55,
  direction = 'up',
  className = '',
}: FadeInOnScrollProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...OFFSET[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
