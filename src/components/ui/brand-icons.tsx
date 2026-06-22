/**
 * Icônes de marque iQWine — marques maison réutilisées (cartouche de confiance
 * du hero + section Confiance). Extraites de HeroTrustBar pour éviter la
 * duplication (source unique).
 */

export function FleurDeLys({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 1.5c-1.7 2-2.6 3.9-2.6 5.7 0 1.9.9 3.6 2.6 5.1 1.7-1.5 2.6-3.2 2.6-5.1 0-1.8-.9-3.7-2.6-5.7Z" />
      <path d="M4.9 8c-.6 1.9-.5 3.4.4 4.6.8 1.1 2.2 1.8 4.1 2.1-.2-1.8-.8-3.3-1.7-4.5C7 9.4 6.1 8.7 4.9 8Z" />
      <path d="M19.1 8c-1.2.7-2.1 1.4-2.8 2.2-.9 1.2-1.5 2.7-1.7 4.5 1.9-.3 3.3-1 4.1-2.1.9-1.2 1-2.7.4-4.6Z" />
      <rect x="8" y="15.5" width="8" height="1.7" rx="0.85" />
      <path d="M10.4 18.2c.3 1.5.8 2.9 1.6 4.3.8-1.4 1.3-2.8 1.6-4.3h-3.2Z" />
    </svg>
  );
}
