'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion';

interface CountUpProps {
  /** Valeur cible (entier) */
  to: number;
  /** Durée en ms (défaut 2400 — luxe lent) */
  duration?: number;
  /** className appliquée à l'élément */
  className?: string;
  /** suffix affiché après le nombre (ex: "+", "%") */
  suffix?: string;
}

/**
 * CountUp — animation atmosphérique discrète.
 * Une seule occurrence par page (DNA §6 : « count-up extremely limited »).
 * Tween easeOutQuart, lent, déclenché à 30 % visible.
 * Respect prefers-reduced-motion : affiche directement la valeur finale.
 */
export default function CountUp({
  to,
  duration = 2400,
  className = '',
  suffix = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(reducedMotion ? to : 0);

  useEffect(() => {
    if (!inView || reducedMotion) {
      setValue(to);
      return;
    }
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutQuart — décélération luxe, pas de bounce
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(to * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reducedMotion]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
      {suffix}
    </span>
  );
}
