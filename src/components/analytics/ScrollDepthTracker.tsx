'use client';

import { useEffect, useRef } from 'react';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * Émet `scroll_depth` aux paliers 25/50/75/100 %, une seule fois chacun.
 * Passif, throttlé via requestAnimationFrame. Aucun rendu.
 */
const MILESTONES = [25, 50, 75, 100] as const;

export default function ScrollDepthTracker() {
  const fired = useRef<Set<number>>(new Set());
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        if (scrollable <= 0) return;
        const pct = (doc.scrollTop / scrollable) * 100;
        for (const m of MILESTONES) {
          if (pct >= m && !fired.current.has(m)) {
            fired.current.add(m);
            track(ANALYTICS_EVENTS.SCROLL_DEPTH, { percent: m });
          }
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
