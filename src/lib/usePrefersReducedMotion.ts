'use client';

import { useEffect, useState } from 'react';

/**
 * usePrefersReducedMotion — respect total des préférences accessibilité.
 * SSR-safe : renvoie false côté serveur, mise à jour au mount client.
 *
 * Référence DNA cellier-vin §6.3 : « prefers-reduced-motion respecté absolument ».
 */
export default function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
