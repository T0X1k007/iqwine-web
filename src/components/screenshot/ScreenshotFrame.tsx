'use client';

import { useRef, type ReactNode, type CSSProperties } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

/**
 * ScreenshotFrame — capture app iQWine présentée en frame iPhone éditorial.
 *
 * Direction V4-bis (Eric 2026-05-20) : remplacer les mockups codés par de
 * vraies captures, MAIS conserver une expérience iPhone vivante et
 * interactive (sticky, scroll dans téléphone, crossfade entre écrans).
 *
 * Modes :
 *   - 'static'        — image figée, optionnels rotation/glow
 *   - 'sticky'        — frame se colle au viewport, idéal pour scènes narratives
 *   - 'crossfade'     — N captures, fondu enchaîné piloté par le scroll
 *   - 'scroll-inside' — capture verticale haute, scroll vertical dans la frame
 *
 * Frames :
 *   - 'iphone' — bezel arrondi 40px + dynamic island + or alpha subtle (def)
 *   - 'simple' — image directe avec shadow-bottle (pas de bezel)
 *
 * Captures non-existantes : passer `src="placeholder:LABEL"`. Affiche un
 * placeholder éditorial chaud (gradient walnut + mono caption) jusqu'à ce
 * qu'une vraie capture /screenshots/<file>.png la remplace.
 *
 * Accessibilité :
 *   - prefers-reduced-motion : tous les modes scroll dégradent en static
 *   - alt obligatoire (image OR placeholder caption)
 */

type Frame = 'iphone' | 'simple';

type BaseProps = {
  alt: string;
  width?: number;        // px, default 320 (iPhone 15 Pro echelle 1:1)
  frame?: Frame;          // default 'iphone'
  rotation?: number;      // deg subtil, -3 à +3, default 0
  glow?: boolean;         // halo or autour de la frame, default false
  priority?: boolean;     // next/image priority pour LCP, default false
  topOffset?: number;     // sticky top offset en px, default 96
  className?: string;
};

type StaticProps = BaseProps & {
  mode?: 'static';
  src: string;
};

type StickyProps = BaseProps & {
  mode: 'sticky';
  src: string;
};

type CrossfadeProps = BaseProps & {
  mode: 'crossfade';
  src: string[];          // 2+ captures
};

type ScrollInsideProps = BaseProps & {
  mode: 'scroll-inside';
  src: string;            // image typiquement 2× à 4× la hauteur de la frame
  imageAspectRatio?: number; // height / width de l'image source, default 3
};

export type ScreenshotFrameProps =
  | StaticProps
  | StickyProps
  | CrossfadeProps
  | ScrollInsideProps;

/* ───────────────────────── orchestration ───────────────────────── */

export default function ScreenshotFrame(props: ScreenshotFrameProps) {
  const reduced = useReducedMotion();
  const mode = props.mode ?? 'static';

  // Reduced motion : tous les modes scroll dégradent en static.
  if (reduced || mode === 'static') {
    const src = Array.isArray(props.src) ? props.src[0]! : props.src;
    const staticProps: StaticProps = {
      mode: 'static',
      src,
      alt: props.alt,
      width: props.width,
      frame: props.frame,
      rotation: props.rotation,
      glow: props.glow,
      priority: props.priority,
      topOffset: props.topOffset,
      className: props.className,
    };
    return <StaticFrame {...staticProps} />;
  }

  if (mode === 'sticky') return <StickyFrame {...(props as StickyProps)} />;
  if (mode === 'crossfade') return <CrossfadeFrame {...(props as CrossfadeProps)} />;
  if (mode === 'scroll-inside')
    return <ScrollInsideFrame {...(props as ScrollInsideProps)} />;

  return null;
}

/* ───────────────────────── frame chrome (iPhone bezel) ───────────────────────── */

const IPHONE_ASPECT = 19.5 / 9; // hauteur / largeur, iPhone 15 Pro
const BEZEL = 6;
const OUTER_RADIUS = 40;
const INNER_RADIUS = 32;

export function FrameChrome({
  width,
  frame = 'iphone',
  rotation = 0,
  glow = false,
  children,
}: {
  width: number;
  frame?: Frame;
  rotation?: number;
  glow?: boolean;
  children: ReactNode;
}) {
  const height = Math.round(width * IPHONE_ASPECT);
  const innerStyle: CSSProperties =
    frame === 'iphone'
      ? {
          width,
          height,
          borderRadius: OUTER_RADIUS,
          background: '#0F0A08',
          padding: BEZEL,
          boxShadow:
            'var(--shadow-bottle, 0 32px 96px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.3))',
          border: '1px solid rgba(217, 182, 103, 0.15)',
        }
      : {
          width,
          height: Math.round(width * 1.4),
          borderRadius: 16,
          background: 'transparent',
          padding: 0,
          boxShadow:
            'var(--shadow-elevated, 0 24px 64px rgba(0,0,0,0.36))',
          border: '1px solid rgba(243, 236, 231, 0.08)',
        };

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={
        rotation ? { transform: `rotate(${rotation}deg)` } : undefined
      }
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-10 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(217, 182, 103, 0.16), transparent 70%)',
            borderRadius: OUTER_RADIUS + 24,
          }}
        />
      )}
      <div className="relative overflow-hidden" style={innerStyle}>
        {frame === 'iphone' && (
          <div
            aria-hidden
            className="absolute left-1/2 z-30 -translate-x-1/2 rounded-full bg-black"
            style={{ top: 14, width: 88, height: 26 }}
          />
        )}
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            borderRadius: frame === 'iphone' ? INNER_RADIUS : 14,
            background: 'var(--color-card)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── static mode ───────────────────────── */

function StaticFrame({
  src,
  alt,
  width = 320,
  frame = 'iphone',
  rotation = 0,
  glow = false,
  priority = false,
  className,
}: StaticProps) {
  const innerWidth = frame === 'iphone' ? width - BEZEL * 2 : width;
  const innerHeight =
    frame === 'iphone'
      ? Math.round((width - BEZEL * 2) * IPHONE_ASPECT)
      : Math.round(width * 1.4);

  return (
    <div className={className}>
      <FrameChrome width={width} frame={frame} rotation={rotation} glow={glow}>
        {isPlaceholder(src) ? (
          <Placeholder text={placeholderLabel(src)} />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={innerWidth * 2}
            height={innerHeight * 2}
            sizes={`${width}px`}
            priority={priority}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </FrameChrome>
    </div>
  );
}

/* ───────────────────────── sticky mode ───────────────────────── */

function StickyFrame({
  src,
  alt,
  width = 320,
  frame = 'iphone',
  rotation = 0,
  glow = false,
  priority = false,
  topOffset = 96,
  className,
}: StickyProps) {
  return (
    <div className={className} style={{ position: 'relative', height: '100%' }}>
      <div style={{ position: 'sticky', top: topOffset }}>
        <StaticFrame
          src={src}
          alt={alt}
          width={width}
          frame={frame}
          rotation={rotation}
          glow={glow}
          priority={priority}
        />
      </div>
    </div>
  );
}

/* ───────────────────────── crossfade mode ───────────────────────── */

function CrossfadeFrame({
  src,
  alt,
  width = 320,
  frame = 'iphone',
  rotation = 0,
  glow = false,
  topOffset = 96,
  className,
}: CrossfadeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Fallback : un seul écran fourni → static.
  if (!Array.isArray(src) || src.length < 2) {
    return (
      <StaticFrame
        src={Array.isArray(src) ? src[0]! : src}
        alt={alt}
        width={width}
        frame={frame}
        rotation={rotation}
        glow={glow}
        className={className}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', height: '100%' }}
    >
      <div style={{ position: 'sticky', top: topOffset }}>
        <FrameChrome
          width={width}
          frame={frame}
          rotation={rotation}
          glow={glow}
        >
          {src.map((s, i) => (
            <CrossfadeLayer
              key={`${s}-${i}`}
              src={s}
              alt={alt}
              index={i}
              total={src.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </FrameChrome>
      </div>
    </div>
  );
}

function CrossfadeLayer({
  src,
  alt,
  index,
  total,
  scrollYProgress,
}: {
  src: string;
  alt: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Découpe [0, 1] en N segments, pic d'opacité au centre de chaque segment.
  // Crossfade large (overlap 40%) pour transition douce, jamais saccadée.
  const segment = 1 / total;
  const center = segment * (index + 0.5);
  const half = segment * 0.7;
  const left = Math.max(0, center - half);
  const right = Math.min(1, center + half);
  const opacity = useTransform(
    scrollYProgress,
    [left, center, right],
    [index === 0 ? 1 : 0, 1, index === total - 1 ? 1 : 0],
    { clamp: true },
  );

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      {isPlaceholder(src) ? (
        <Placeholder text={placeholderLabel(src)} />
      ) : (
        <Image src={src} alt={alt} fill sizes="320px" style={{ objectFit: 'cover' }} />
      )}
    </motion.div>
  );
}

/* ───────────────────────── scroll-inside mode ───────────────────────── */

function ScrollInsideFrame({
  src,
  alt,
  width = 320,
  frame = 'iphone',
  rotation = 0,
  glow = false,
  topOffset = 96,
  imageAspectRatio = 3,
  className,
}: ScrollInsideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const innerWidth = frame === 'iphone' ? width - BEZEL * 2 : width;
  const imageHeightPx = innerWidth * imageAspectRatio;
  const frameInnerHeight =
    frame === 'iphone'
      ? Math.round(innerWidth * IPHONE_ASPECT)
      : Math.round(innerWidth * 1.4);
  const maxTranslate = imageHeightPx - frameInnerHeight;
  const y = useTransform(scrollYProgress, [0.1, 0.9], [0, -maxTranslate], {
    clamp: true,
  });

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', height: '100%' }}
    >
      <div style={{ position: 'sticky', top: topOffset }}>
        <FrameChrome
          width={width}
          frame={frame}
          rotation={rotation}
          glow={glow}
        >
          {isPlaceholder(src) ? (
            <Placeholder text={placeholderLabel(src)} tall />
          ) : (
            <motion.div
              className="absolute inset-x-0 top-0"
              style={{ y, willChange: 'transform' }}
            >
              <Image
                src={src}
                alt={alt}
                width={innerWidth * 2}
                height={imageHeightPx * 2}
                sizes={`${width}px`}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </motion.div>
          )}
        </FrameChrome>
      </div>
    </div>
  );
}

/* ───────────────────────── placeholder éditorial ───────────────────────── */

function isPlaceholder(src: string) {
  return src.startsWith('placeholder:');
}

function placeholderLabel(src: string) {
  return src.slice('placeholder:'.length);
}

function Placeholder({ text, tall = false }: { text: string; tall?: boolean }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        height: tall ? '300%' : '100%',
        background:
          'linear-gradient(180deg, #2a2018 0%, #150f0c 50%, #2a2018 100%)',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <span
        style={{
          color: 'rgba(243, 236, 231, 0.32)',
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          lineHeight: 1.6,
        }}
      >
        {text || 'Capture · iqwine'}
      </span>
    </div>
  );
}
