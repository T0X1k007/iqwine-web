import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

/**
 * Image Open Graph de marque (1200×630) — partage social premium.
 *
 * Rendu sobre, dark-luxe : fond cave sombre (#150f0c), wordmark iQWine en
 * or champagne (#d9b667), tagline serif, signature « propulsé par Octave ».
 * Tout est dessiné via ImageResponse (next/og), zéro dépendance image externe.
 *
 * VISUAL 2.0 — TYPO DE MARQUE dans l'image : Satori ne lit pas next/font, on
 * fournit donc les buffers WOFF (statiques, subset latin, @fontsource, OFL) :
 *   - Cormorant Garamond (600 + 500 italic) = display serif (wordmark, taglines)
 *   - Hanken Grotesk (500)                  = sans (eyebrow, signature)
 * WOFF est supporté par Satori (WOFF2 non). Buffers lus du disque (readFileSync,
 * relatif à process.cwd() = racine projet) : robuste en webpack-dev ET au build
 * turbopack qui PRÉREND ce PNG (○ static) — pas de fetch(URL) qui casse en dev.
 * Cf. src/app/_og-fonts/ (LICENSE.txt).
 *
 * `twitter-image.tsx` réexporte ce module (même typo/visuel summary_large_image).
 */
export const alt = 'iQWine — Votre sommelier personnel, propulsé par Octave';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const OR = '#d9b667'; // or champagne (VISUAL 2.0)
const OR_SOFT = '#ebd7a6';
const CAVE = '#150f0c'; // espresso canvas (aligné app — jamais noir pur)
const DISPLAY = 'Cormorant Garamond';
const SANS = 'Hanken Grotesk';

const FONT_DIR = join(process.cwd(), 'src/app/_og-fonts');
const FONTS = [
  {
    name: DISPLAY,
    data: readFileSync(join(FONT_DIR, 'cormorant-600.woff')),
    weight: 600 as const,
    style: 'normal' as const,
  },
  {
    name: DISPLAY,
    data: readFileSync(join(FONT_DIR, 'cormorant-500italic.woff')),
    weight: 500 as const,
    style: 'italic' as const,
  },
  {
    name: SANS,
    data: readFileSync(join(FONT_DIR, 'hanken-500.woff')),
    weight: 500 as const,
    style: 'normal' as const,
  },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: CAVE,
          // Vignette chaude discrète vers le centre — profondeur de cave.
          backgroundImage:
            'radial-gradient(circle at 50% 38%, rgba(217,182,103,0.14), rgba(21,15,12,0) 60%)',
          position: 'relative',
          fontFamily: DISPLAY,
        }}
      >
        {/* Filet or supérieur — cadrage éditorial sobre. */}
        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 80,
            right: 80,
            height: 1,
            backgroundColor: 'rgba(217,182,103,0.32)',
          }}
        />

        {/* Eyebrow — Hanken (sans, tracké) */}
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 22,
            letterSpacing: 12,
            textTransform: 'uppercase',
            color: 'rgba(217,182,103,0.72)',
            marginBottom: 28,
          }}
        >
          Sommelier IA
        </div>

        {/* Wordmark — Cormorant 600 */}
        <div
          style={{
            display: 'flex',
            fontWeight: 600,
            fontSize: 150,
            color: OR,
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          iQWine
        </div>

        {/* Tagline — Cormorant italic */}
        <div
          style={{
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 46,
            color: '#f4ead6',
            marginTop: 30,
          }}
        >
          Votre sommelier personnel.
        </div>

        {/* Signature Octave — Hanken (sans) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 40,
            fontFamily: SANS,
            fontWeight: 500,
          }}
        >
          <div style={{ width: 36, height: 1, backgroundColor: 'rgba(217,182,103,0.5)' }} />
          <div style={{ fontSize: 24, letterSpacing: 4, color: OR_SOFT }}>propulsé par Octave</div>
          <div style={{ width: 36, height: 1, backgroundColor: 'rgba(217,182,103,0.5)' }} />
        </div>

        {/* Signature de marque — Cormorant italic, en pied */}
        <div
          style={{
            position: 'absolute',
            bottom: 74,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 26,
            color: 'rgba(217,182,103,0.62)',
          }}
        >
          Une cave qui se souvient.
        </div>

        {/* Filet or inférieur */}
        <div
          style={{
            position: 'absolute',
            bottom: 56,
            left: 80,
            right: 80,
            height: 1,
            backgroundColor: 'rgba(217,182,103,0.32)',
          }}
        />
      </div>
    ),
    { ...size, fonts: FONTS },
  );
}
