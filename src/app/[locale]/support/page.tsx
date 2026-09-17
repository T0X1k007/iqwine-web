import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import SupportContent from '@/components/sections/SupportContent';
import { turnstileSiteKey } from '@/lib/turnstile';

const TEXTES = {
  fr: {
    title: 'Support · iQWine',
    description:
      'Obtenez de l’aide pour iQWine. Écrivez au support depuis cette page, sans compte, et nous répondons par courriel.',
  },
  en: {
    title: 'Support · iQWine',
    description:
      'Get help with iQWine. Write to support from this page, no account required, and we reply by email.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/support', locale, TEXTES);
}

/**
 * /support, l'adresse d'assistance PUBLIQUE d'iQWine, et celle qu'on déclare
 * aux boutiques. La coquille serveur porte la metadata SEO ; le corps bilingue
 * et le formulaire vivent dans SupportContent (client).
 *
 * Le formulaire POST vers /api/contact, le relais unique du site, qui écrit un
 * `ContactRequest` dans l'application et notifie `support@iqwine.ca`. Aucune
 * authentification, aucun second système de billets.
 */
export default function SupportPage() {
  // Même provenance de clé anti-bot que /contact : une seule fonction, et un
  // formulaire strictement identique à celui d'avant quand elle est absente.
  return <SupportContent turnstileSiteKey={turnstileSiteKey()} />;
}
