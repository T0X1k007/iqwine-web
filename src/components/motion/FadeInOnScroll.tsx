'use client';

import { useEffect, useState, type ReactNode } from 'react';
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

  // FAIL-VISIBLE (refonte v3, 2026-08-12). Avant : le SSR rendait le contenu
  // avec `opacity: 0` inline, et seule l'hydratation le révélait. Si le morceau
  // JS d'une section dynamique ne charge pas (chunk périmé après un
  // redémarrage du serveur de dev, réseau, extension), la section restait
  // INVISIBLE pour toujours, vécu par Eric via Tailscale : page « vide » dont
  // on ne voyait que les filets. Désormais le serveur rend le contenu VISIBLE,
  // et l'animation ne s'active qu'une fois le composant réellement monté côté
  // client. Un contenu qui était déjà à l'écran au montage s'anime aussitôt
  // (whileInView le voit) ; un JS absent ne cache plus jamais rien. Bonus SEO :
  // le HTML rendu n'a plus d'état caché.
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);

  if (reduced || !monte) {
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
