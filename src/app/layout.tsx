import type { Metadata } from 'next';
import { Cormorant_Garamond, Hanken_Grotesk } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

/**
 * Fonts via next/font/google : auto-self-host, auto-preload critique,
 * zero CLS sur fonts (size-adjust + fallback metric matching), zéro FOUT.
 * Élimine le @import url Google Fonts qui bloque le first paint.
 *
 * Direction éditoriale alignée cellier-vin (lib/fonts.ts) — iQWine VISUAL 2.0 :
 *   - Display = Cormorant Garamond (serif magazine luxe, italic disponible)
 *     → titres, hero, citations, signatures, phrases sommelier
 *   - Body = Hanken Grotesk (sans humaniste chaud, remplace Inter)
 *     → labels, boutons, captions, prose, eyebrows
 *   - Mono = pile système (JetBrains Mono retiré — aligné app, perf)
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'], // 700 inutilisé — retiré (perf police mobile)
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-hanken',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  // Base absolue pour résoudre les URL d'images sociales (opengraph-image /
  // twitter-image générées par Next 16). Override possible via env si besoin.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://iqwine.ca',
  ),
  title: 'iQWine — Votre sommelier IA : cave, disponibilité locale, restaurant',
  description:
    'Le sommelier IA qui sait quoi ouvrir, quoi acheter et quoi commander. Il connaît vos goûts, votre cave et la disponibilité locale, magasin par magasin. Essai 14 jours, sans carte.',
  openGraph: {
    title: 'iQWine — Votre sommelier IA : cave, disponibilité locale, restaurant',
    description:
      'Recommande depuis votre cave, la disponibilité locale (magasin par magasin) ou les deux. Scan de carte et d\'étiquette, profil de goût qui apprend. Essai 14 jours, sans carte.',
    type: 'website',
    locale: 'fr_CA',
    siteName: 'iQWine',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iQWine — Votre sommelier IA : cave, disponibilité locale, restaurant',
    description:
      'Quoi ouvrir ce soir ? Où l\'acheter près de vous ? Votre sommelier IA le sait. Essai 14 jours, sans carte.',
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
      className={`${cormorant.variable} ${hanken.variable}`}
    >
      <body>
        {/* Chrome GLOBAL (Q16 + Q18) — Navbar et Footer sur TOUTES les pages,
            plus aucune page « avec pied mais sans tête ». I18nProvider remonté
            ici (la Navbar et les sections en ont besoin) ; il enveloppe tout le
            contenu. */}
        <I18nProvider>
          <Navbar />
          {children}
          <Footer />
        </I18nProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
