import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import ContactContent from '@/components/sections/ContactContent';

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
  return <ContactContent />;
}
