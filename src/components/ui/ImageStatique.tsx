/**
 * UNE IMAGE PRÉ-CONVERTIE — AVIF, repli WebP, repli PNG.
 *
 * ── Pourquoi ce composant existe (2026-08-03) ─────────────────────────────
 * Le site passait par `next/image`, qui optimise à l'exécution. Sur Cloudflare
 * Workers, cette optimisation exige **Cloudflare Images**, un produit facturé à
 * l'image livrée. Or il n'y avait que TROIS captures concernées, toutes connues
 * à la construction.
 *
 * Elles sont donc converties une fois pour toutes
 * (`scripts/generer-images.mjs`) et servies telles quelles. Le résultat est
 * meilleur que l'optimisation à la volée, pas seulement moins cher : le premier
 * visiteur d'une taille donnée n'attend plus la conversion.
 *
 * Mesuré : 1503 Ko de PNG → 183 Ko d'AVIF, soit 88 % d'octets en moins, sans
 * différence perceptible à la taille réelle d'affichage.
 *
 * ── `width` et `height` sont OBLIGATOIRES, et c'est le point ──────────────
 * Le navigateur réserve la place avant d'avoir reçu le premier octet. Sans
 * eux, le texte qui suit l'image saute au moment où elle arrive — c'est le
 * déplacement de mise en page que mesure le CLS, et l'un des trois Core Web
 * Vitals. Un composant d'image qui les rend facultatifs est un composant qui
 * les fera oublier.
 *
 * ── L'ordre des `<source>` compte ────────────────────────────────────────
 * Le navigateur prend LE PREMIER format qu'il sait lire. AVIF d'abord (le plus
 * léger), WebP ensuite, et le `<img>` final sert de repli universel — c'est
 * lui qui porte `alt`, `width`, `height` et les styles.
 */

interface ImageStatiqueProps {
  /** Le PNG source. Les variantes en sont dérivées par convention de nom. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /**
   * Les largeurs générées, quand il y en a plusieurs.
   *
   * Absent → une seule variante, nommée comme la source (`x.png` → `x.avif`).
   * Présent → variantes suffixées (`x-1487.avif`), déclarées en `srcSet` avec
   * leur descripteur `w`, pour que le navigateur choisisse selon `sizes`.
   */
  largeurs?: number[];
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  /**
   * Repli applicatif quand l'image ne charge pas.
   *
   * Ce n'est PAS le repli de format — celui-là est fait par les `<source>`.
   * C'est le cas où aucun fichier n'arrive : réseau coupé, actif manquant. Un
   * appelant peut alors afficher autre chose (`DemoPhone` montre une
   * silhouette de bouteille plutôt qu'un cadre vide).
   */
  onError?: () => void;
}

function variantes(src: string, ext: 'avif' | 'webp', largeurs?: number[]): string {
  const base = src.replace(/\.png$/, '');
  if (!largeurs || largeurs.length === 0) return `${base}.${ext}`;
  return largeurs.map((l) => `${base}-${l}.${ext} ${l}w`).join(', ');
}

export function ImageStatique({
  src,
  alt,
  width,
  height,
  largeurs,
  sizes,
  className,
  style,
  loading = 'lazy',
  fetchPriority = 'auto',
  onError,
}: ImageStatiqueProps) {
  return (
    <picture>
      <source srcSet={variantes(src, 'avif', largeurs)} sizes={sizes} type="image/avif" />
      <source srcSet={variantes(src, 'webp', largeurs)} sizes={sizes} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={className}
        style={style}
        onError={onError}
      />
    </picture>
  );
}
