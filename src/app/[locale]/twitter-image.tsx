/**
 * Image Twitter/X (summary_large_image), réutilise le même visuel de marque
 * que l'Open Graph (fond cave sombre, wordmark or, signature Octave).
 * Next 16 sert ce module pour <meta name="twitter:image">.
 */
export { default, alt, size, contentType, generateStaticParams } from './opengraph-image';
// Une option de segment se déclare littéralement, elle ne se réexporte pas.
export const dynamic = 'force-static';
