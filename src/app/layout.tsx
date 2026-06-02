import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

/**
 * Fonts via next/font/google : auto-self-host, auto-preload critique,
 * zero CLS sur fonts (size-adjust + fallback metric matching), zéro FOUT.
 * Élimine le @import url Google Fonts qui bloque le first paint.
 *
 * Direction éditoriale alignée cellier-vin (lib/fonts.ts) :
 *   - Display = Cormorant Garamond (serif magazine luxe, italic disponible)
 *     → titres, hero, citations, signatures, phrases sommelier
 *   - Body = Inter (sans-serif lisible, performance lecture)
 *     → labels, boutons, captions, prose
 *   - Mono = JetBrains Mono → eyebrows, IDs, codes éditoriaux
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'], // 700 inutilisé — retiré (perf police mobile)
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'], // 300/700 inutilisés — retirés
  display: 'swap',
  variable: '--font-inter',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  fallback: ['ui-monospace', 'Menlo', 'monospace'],
});

export const metadata: Metadata = {
  title: 'iQWine — Votre sommelier IA : cave, SAQ, restaurant',
  description:
    'Le sommelier IA qui sait quoi ouvrir, quoi acheter et quoi commander. Il connaît vos goûts, votre cave et la SAQ en temps réel. Essai 14 jours, sans carte.',
  openGraph: {
    title: 'iQWine — Votre sommelier IA : cave, SAQ, restaurant',
    description:
      'Recommande depuis votre cave, la SAQ (dispo en temps réel) ou les deux. Scan de carte et d\'étiquette, profil de goût qui apprend. Essai 14 jours, sans carte.',
    type: 'website',
    locale: 'fr_CA',
    siteName: 'iQWine',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iQWine — Votre sommelier IA : cave, SAQ, restaurant',
    description:
      'Quoi ouvrir ce soir ? Quoi acheter à la SAQ ? Votre sommelier IA le sait. Essai 14 jours, sans carte.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
