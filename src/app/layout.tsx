import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

/**
 * Fonts via next/font/google : auto-self-host, auto-preload critique,
 * zero CLS sur fonts (size-adjust + fallback metric matching), zéro FOUT.
 * Élimine le @import url Google Fonts qui bloque le first paint.
 */
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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
  title: 'iQWine — L\'intelligence privée de votre cave',
  description:
    'Le sommelier privé des collectionneurs modernes. Sommelier privé. Mémoire de dégustation. Cellier vivant. Sur invitation.',
  openGraph: {
    title: 'iQWine — L\'intelligence privée de votre cave',
    description:
      'Le sommelier privé des collectionneurs modernes. Cellier vivant, mode Tonight, mode Restaurant, scanner d\'étiquettes, calibration du palais.',
    type: 'website',
    locale: 'fr_CA',
    siteName: 'iQWine',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iQWine — L\'intelligence privée de votre cave',
    description:
      'Première vague · 100 celliers · Sur invitation.',
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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
