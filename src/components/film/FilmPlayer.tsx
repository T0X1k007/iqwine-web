'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * FilmPlayer — lecteur du film de marque iQWine (MP4 web-léger 1,6 Mo, MUET).
 *
 * Perf : lazy-load — la source n'est posée qu'à l'approche du viewport
 * (IntersectionObserver, rootMargin 300px), `preload="none"` avant ça.
 * A11y : prefers-reduced-motion → pas d'autoplay ; poster + contrôles natifs.
 *
 * variant :
 *   'teaser' → boucle, muet, sans contrôles (le parent est un lien vers /le-film)
 *   'full'   → film complet, contrôles natifs (le film étant silencieux, muet OK)
 */
export default function FilmPlayer({
  src,
  poster,
  variant = 'full',
  className = '',
}: {
  src: string;
  poster: string;
  variant?: 'teaser' | 'full';
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const teaser = variant === 'teaser';
  return (
    <video
      ref={ref}
      className={`block h-full w-full bg-sunk object-cover ${className}`}
      poster={poster}
      muted
      loop={teaser}
      playsInline
      preload="none"
      controls={!teaser}
      autoPlay={near && !reduced}
      {...(near ? { src } : {})}
      aria-label="Film iQWine"
    />
  );
}
