'use client';

import { useEffect, useRef } from 'react';

/**
 * FilmPlayer — lecteur du film de marque iQWine (MP4 H.264 MUET, ~5 Mo / 65 s).
 *
 * Robustesse (Experience 2.0) : la `<source>` est TOUJOURS présente dans le HTML
 * rendu côté serveur — le film existe donc pour les crawlers, le partage social,
 * les lecteurs d'écran et même sans JavaScript (le plein-écran a ses contrôles
 * natifs). On ne dépend plus du moteur React pour poser la source (ancien bug
 * « aucune <source> » vu par curl / les crawlers, car le src n'était ajouté
 * qu'au scroll via l'IntersectionObserver).
 *
 * Perf : `preload="none"` → aucun octet vidéo chargé tant que la lecture n'est
 * pas déclenchée (poster seul au repos).
 *
 * A11y : `prefers-reduced-motion` → pas d'autoplay (poster + contrôles restent).
 * L'IntersectionObserver ne fait plus QUE déclencher `play()` à l'approche du
 * viewport (amélioration progressive), sans conditionner l'existence de la source.
 *
 * variant :
 *   'teaser' → boucle, muet, sans contrôles (le parent est un lien vers /le-film)
 *   'full'   → film complet, contrôles natifs (film silencieux → muet OK)
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
  const teaser = variant === 'teaser';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced) return; // respecte l'OS : pas d'autoplay, on laisse poster + contrôles
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          void el.play().catch(() => {}); // preload="none" → charge à la lecture
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      aria-label="Film iQWine"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
