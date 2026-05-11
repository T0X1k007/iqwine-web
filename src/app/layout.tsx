import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'iQWine — Le compagnon œnologique',
  description:
    'iQWine est le compagnon œnologique qui comprend votre palais et votre cave mieux que vous-même. Pas un inventaire — un second cerveau œnologique privé.',
  openGraph: {
    title: 'iQWine — Le compagnon œnologique',
    description:
      'Le compagnon qui comprend votre palais et votre cave mieux que vous-même. Cellier vivant, sommelier nocturne, mode restaurant, scanner d\'étiquettes, calibration du palais.',
    type: 'website',
    locale: 'fr_CA',
    siteName: 'iQWine',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iQWine — Le compagnon œnologique',
    description:
      'Un second cerveau œnologique privé. Bientôt disponible.',
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
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
