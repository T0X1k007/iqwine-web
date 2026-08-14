import type { Metadata } from 'next';
import { Cormorant_Garamond, Hanken_Grotesk } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '../globals.css';
import { TRIAL_SHORT } from '@/lib/trial';
import { notFound } from 'next/navigation';
import { siteGraphLd } from '@/lib/structured-data';
import { LOCALES, isLocale, BCP47, SITE_ORIGIN } from '@/lib/locale';
import { pageMetadata } from '@/lib/page-metadata';

/**
 * Fonts via next/font/google : auto-self-host, auto-preload critique,
 * zero CLS sur fonts (size-adjust + fallback metric matching), zéro FOUT.
 * Élimine le @import url Google Fonts qui bloque le first paint.
 *
 * Direction éditoriale alignée cellier-vin (lib/fonts.ts), iQWine VISUAL 2.0 :
 *   - Display = Cormorant Garamond (serif magazine luxe, italic disponible)
 *     → titres, hero, citations, signatures, phrases sommelier
 *   - Body = Hanken Grotesk (sans humaniste chaud, remplace Inter)
 *     → labels, boutons, captions, prose, eyebrows
 *   - Mono = pile système (JetBrains Mono retiré, aligné app, perf)
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'], // 700 inutilisé, retiré (perf police mobile)
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

/**
 * Données structurées site-wide (Organization + WebSite), éligibilité rich
 * results + graphe de connaissances Google. Rendu SSR (JSON-LD) dans le <body>.
 */
/**
 * P49, sérialisation JSON-LD SÛRE. `JSON.stringify` seul laisse passer un
 * `</script>` littéral : le navigateur fermerait la balise et exécuterait la
 * suite. Inoffensif tant que le graph est statique, mais c'est exactement le
 * motif qui devient une XSS le jour où l'on y injecte du contenu variable
 * (FAQ, avis, nom de page). On le durcit AVANT d'en avoir besoin, pas après.
 * Miroir de `lib/guide/jsonld.ts` côté app (source unique du raisonnement).
 */
function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}



/**
 * Le socle de métadonnées, commun aux deux langues.
 *
 * PRIVÉ, et non exporté : Next refuse `metadata` et `generateMetadata` dans le
 * même fichier, et c'est une bonne règle, deux sources de métadonnées pour une
 * page finiraient par se contredire. `generateMetadata` en dérive ci-dessous en
 * y ajoutant ce qui dépend de la langue.
 */
const BASE_METADATA: Metadata = {
  // Base absolue pour résoudre les URL d'images sociales (opengraph-image /
  // twitter-image générées par Next 16). Override possible via env si besoin.
  // Canonique = www (l'hôte réellement servi ; l'apex 307-redirige vers www).
  metadataBase: new URL(SITE_ORIGIN),
  robots: { index: true, follow: true },
};

/**
 * Les textes de l'ACCUEIL, dans les deux langues.
 *
 * Ils vivaient en français, en dur, dans un `metadata` unique, donc la page
 * anglaise portait un titre et une description français. Invisible à l'œil,
 * puisque le corps de la page, lui, était traduit ; mais c'est exactement ce
 * qu'un moteur lit et ce qu'un partage social affiche.
 */
/* Refonte v3 (2026-08-13) : la métadonnée porte la PROMESSE, Octave, le
 * sommelier IA qui apprend vos goûts, et plus une liste de fonctions. Les
 * expressions de recherche (sommelier IA, choisir un vin, carte des vins,
 * cave) restent présentes, naturellement. */
const TEXTES_ACCUEIL = {
  fr: {
    title: 'iQWine · Octave, votre sommelier IA qui apprend vos goûts',
    description: `Octave, votre sommelier IA, apprend votre palais et vous aide à choisir un vin, en magasin, au restaurant, devant votre cave. Essai : ${TRIAL_SHORT.fr}, sans carte.`,
    ogTitle: 'Octave. À l’unisson de vos goûts.',
    ogDescription: `Votre sommelier IA personnel : il apprend vos goûts, lit une carte des vins, accorde vos plats et connaît votre cave, jusqu'à l'apogée de chaque bouteille. Essai : ${TRIAL_SHORT.fr}, sans carte.`,
  },
  en: {
    title: 'iQWine · Octave, the AI sommelier that learns your taste',
    description: `Octave, your personal AI sommelier, learns your palate and helps you choose wine, in the store, at the restaurant, in front of your cellar. Free trial: ${TRIAL_SHORT.en}, no card.`,
    ogTitle: 'Octave. In tune with your taste.',
    ogDescription: `Your personal AI sommelier: he learns your taste, reads wine lists, pairs your meals and knows your cellar, down to each bottle's peak window. Free trial: ${TRIAL_SHORT.en}, no card.`,
  },
} as const;


export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    ...BASE_METADATA,
    // Titre, description, canonical, hreflang et Open Graph de l'accueil de
    // CETTE langue. Les pages filles les surchargent avec leur propre chemin.
    ...pageMetadata('/', locale, TEXTES_ACCUEIL),
  };
}

/**
 * LE LAYOUT RACINE, il porte désormais la LANGUE (GO d'Eric, MFP-09).
 *
 * ── Pourquoi il a déménagé sous `[locale]` ────────────────────────────────
 * `<html lang>` doit refléter la langue de la page. À la racine, il valait
 * « fr » en dur : l'anglais était servi sous un document déclaré français ,
 * faux pour un lecteur d'écran, faux pour un moteur, faux pour un traducteur
 * automatique. La documentation de Next 16 prévoit exactement ce déplacement :
 * « The root layout can also be nested in the new folder ».
 *
 * ── Toute autre langue est une 404, délibérément ──────────────────────────
 * `/de/tarifs` ne doit pas rendre du français : cela créerait une troisième URL
 * servant un contenu qui n'est pas le sien, que les moteurs traiteraient comme
 * du contenu dupliqué. Une 404 est la réponse honnête.
 */
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={BCP47[locale]}
      suppressHydrationWarning
      className={`${cormorant.variable} ${hanken.variable}`}
    >
      <body>
        {/*
          Le graphe est produit DANS la langue de la page. Servir un balisage
          français sous une URL anglaise ferait décrire la page par autre chose
          que ce qu'elle est, or le balisage doit refléter le contenu visible,
          c'est la condition d'éligibilité aux résultats enrichis.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteGraphLd(locale)) }}
        />
        {/* Chrome GLOBAL, Navbar et Footer sur TOUTES les pages. Le
            fournisseur de langue REÇOIT désormais sa valeur de l'URL au lieu de
            la lire dans localStorage après le montage. */}
        <I18nProvider locale={locale}>
          {/* Lien d'évitement clavier (QA refonte v3, 2026-08-13) : premier
              élément focusable, invisible jusqu'au focus. La cible enveloppe
              {children} pour exister sur TOUTES les pages. */}
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-papier focus:px-4 focus:py-2 focus:text-encre focus:shadow-lg"
          >
            {locale === 'fr' ? 'Passer au contenu' : 'Skip to content'}
          </a>
          <Navbar />
          <div id="contenu">{children}</div>
          <Footer />
        </I18nProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
