import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import BetaContent from '@/components/beta/BetaContent';
import { turnstileSiteKey } from '@/lib/turnstile';

const TEXTES = {
  fr: {
    title: 'Devenir bêta-testeur · iQWine',
    description:
      'Rejoignez le cercle restreint des bêta-testeurs iQWine : accès en avant-première, en échange d’un vrai temps de test et de vos commentaires.',
  },
  en: {
    title: 'Become a beta tester · iQWine',
    description:
      'Join the small circle of iQWine beta testers: early access, in exchange for real testing time and your feedback.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  const base = pageMetadata('/beta', locale, TEXTES);
  return {
    ...base,
    /**
     * P49, /beta est une surface TRANSITOIRE (recrutement de testeurs), pas
     * une page de produit. Elle était indexable ET absente du sitemap : la pire
     * combinaison, un orphelin que Google trouve quand même par un lien externe.
     * Tranché : noindex assumé. Réversible d'une ligne.
     *
     * Et pas d'`alternates` : déclarer des variantes de langue sur une page
     * qu'on demande d'ignorer serait annoncer ce qu'on cache.
     */
    robots: { index: false, follow: true },
    alternates: undefined,
  };
}

/**
 * /beta, candidature bêta-testeur. La coquille serveur porte la metadata SEO ;
 * le corps bilingue (attentes + formulaire) vit dans BetaContent (client). Le
 * formulaire POST vers /api/contact (category BETA → forward app cellier-vin).
 */
export default function BetaPage() {
  return <BetaContent turnstileSiteKey={turnstileSiteKey()} />;
}
