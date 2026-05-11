'use client';

import type { ReactNode } from 'react';

interface FadeInOnScrollProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

/**
 * Animation entrée — CSS keyframes (translate + fade), zero JS observer.
 * Joue une seule fois au mount. Plus fiable que useInView en preview/SSR.
 */
const directionClass = {
  up: 'iq-fade-up',
  down: 'iq-fade-down',
  left: 'iq-fade-left',
  right: 'iq-fade-right',
};

export default function FadeInOnScroll({
  children,
  delay = 0,
  duration = 0.42,
  direction = 'up',
  className = '',
}: FadeInOnScrollProps) {
  return (
    <div
      className={`${directionClass[direction]} ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
}
