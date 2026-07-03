import { ImageResponse } from 'next/og';

/**
 * Image Open Graph de marque (1200×630) — partage social premium.
 *
 * Rendu sobre, dark-luxe : fond cave sombre (#150f0c), wordmark iQWine en
 * or champagne (#d9b667), mention « Octave » (le sommelier IA), tagline
 * « Votre sommelier IA ». Aucune dépendance image externe : tout est dessiné
 * via ImageResponse (next/og) pour rester déterministe et léger.
 *
 * Next 16 sert automatiquement cette image pour <meta property="og:image">.
 * `twitter-image.tsx` réexporte ce module (même visuel summary_large_image).
 *
 * Runtime Node (défaut) : Next prérend le PNG au build et le sert en statique
 * — moins coûteux qu'un rendu edge à la demande pour une image figée.
 */
export const alt = 'iQWine — Votre sommelier personnel, propulsé par Octave';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const OR = '#d9b667'; // or champagne (VISUAL 2.0)
const OR_SOFT = '#ebd7a6';
const CAVE = '#150f0c'; // espresso canvas (aligné app — jamais noir pur)

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
          fontFamily: 'Georgia, "Times New Roman", serif',
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

        {/* Eyebrow */}
        <div
          style={{
            fontSize: 22,
            letterSpacing: 12,
            textTransform: 'uppercase',
            color: 'rgba(217,182,103,0.72)',
            fontFamily: 'system-ui, sans-serif',
            marginBottom: 28,
          }}
        >
          Sommelier IA
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: 'flex',
            fontSize: 150,
            fontWeight: 600,
            color: OR,
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          iQWine
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 46,
            fontStyle: 'italic',
            color: '#f4ead6',
            marginTop: 30,
          }}
        >
          Votre sommelier personnel.
        </div>

        {/* Signature Octave */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 40,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{ width: 36, height: 1, backgroundColor: 'rgba(217,182,103,0.5)' }}
          />
          <div style={{ fontSize: 24, letterSpacing: 4, color: OR_SOFT }}>
            propulsé par Octave
          </div>
          <div
            style={{ width: 36, height: 1, backgroundColor: 'rgba(217,182,103,0.5)' }}
          />
        </div>

        {/* Signature de marque — discrète, en pied */}
        <div
          style={{
            position: 'absolute',
            bottom: 78,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            fontSize: 26,
            fontStyle: 'italic',
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
    size,
  );
}
