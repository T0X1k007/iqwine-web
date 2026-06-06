import type { Metadata } from 'next';
import ContactForm from '@/components/sections/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — iQWine',
  description:
    'Contactez l’équipe iQWine : information, démonstration ou partenariat.',
};

/**
 * /contact — page de contact iQWine (Contactez-nous / Démonstration /
 * Partenariat). Le formulaire POST vers /api/contact (forward app cellier-vin).
 */
export default function ContactPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl">
        <header className="mb-10 text-center">
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
            iQWine
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl tracking-tight text-foreground mt-3 leading-tight">
            Parlons-en.
          </h1>
          <p className="text-muted-foreground text-[15px] mt-4 max-w-md mx-auto">
            Une question, une démonstration ou un partenariat ? Écrivez-nous —
            nous répondons par courriel.
          </p>
        </header>
        <ContactForm />
      </div>
    </main>
  );
}
