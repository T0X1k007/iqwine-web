import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import ContactContent from '@/components/sections/ContactContent';
import { turnstileSiteKey } from '@/lib/turnstile';

const TEXTES = {
  fr: {
    title: 'Contact · iQWine',
    description:
      'Contactez l’équipe iQWine : information, démonstration ou partenariat.',
  },
  en: {
    title: 'Contact · iQWine',
    description:
      'Get in touch with the iQWine team: questions, a demo, or a partnership.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/contact', locale, TEXTES);
}

/**
 * /contact, page de contact iQWine. La coquille serveur porte la metadata SEO ;
 * le corps bilingue (FR/EN) et le formulaire vivent dans ContactContent (client).
 * Le formulaire POST vers /api/contact (forward app cellier-vin).
 */
export default function ContactPage() {
  // La clé du widget anti-bot passe par une seule fonction (`lib/turnstile.ts`)
  // au lieu d'un `process.env` éparpillé dans les composants : le jour où sa
  // provenance change, elle change à un seul endroit. Absente, elle vaut `''`
  // et le formulaire est exactement celui d'avant.
  return <ContactContent turnstileSiteKey={turnstileSiteKey()} />;
}
