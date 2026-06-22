import type { Metadata } from 'next';
import ContactContent from '@/components/sections/ContactContent';

export const metadata: Metadata = {
  title: 'Contact — iQWine',
  description:
    'Contactez l’équipe iQWine : information, démonstration ou partenariat.',
};

/**
 * /contact — page de contact iQWine. La coquille serveur porte la metadata SEO ;
 * le corps bilingue (FR/EN) et le formulaire vivent dans ContactContent (client).
 * Le formulaire POST vers /api/contact (forward app cellier-vin).
 */
export default function ContactPage() {
  return <ContactContent />;
}
