'use client';

import { BookOpen, LifeBuoy, FlaskConical, ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import ContactForm from '@/components/sections/ContactForm';

/**
 * ContactContent — corps client de la page /contact (la coquille serveur garde
 * la metadata SEO). Bilingue FR/EN via le pattern useLocale + t(fr, en), comme
 * la barre de navigation et le pied de page. Français canadien standard.
 *
 * Cartes de raccourci (Lire les articles d'aide · Contacter le soutien ·
 * Devenir beta testeur) au-dessus du formulaire ; chacune mène au formulaire
 * (ancre #contact-form) dont le sélecteur « Sujet » oriente la demande.
 */

type OptionCard = {
  icon: typeof BookOpen;
  title: string;
  body: string;
};

export default function ContactContent() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const cards: OptionCard[] = [
    {
      icon: BookOpen,
      title: t("Lire les articles d'aide", 'Read help articles'),
      body: t(
        'Réponses aux questions fréquentes sur la cave et le sommelier IA.',
        'Answers to common questions about the cellar and the AI sommelier.',
      ),
    },
    {
      icon: LifeBuoy,
      title: t('Contacter le soutien', 'Contact support'),
      body: t(
        'Un pépin ou une question précise ? Notre équipe vous répond par courriel.',
        'A glitch or a specific question? Our team replies by email.',
      ),
    },
    {
      icon: FlaskConical,
      title: t('Devenir beta testeur', 'Become a beta tester'),
      body: t(
        'Accédez en avant-première aux nouvelles fonctions et partagez vos commentaires pour aider à améliorer iQWine.',
        'Get early access to new features and share your feedback to help improve iQWine.',
      ),
    },
  ];

  return (
    <main className="min-h-screen px-6 py-24">
      <div className="w-full max-w-xl mx-auto">
        <header className="mb-10 text-center">
          <p className="font-body text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
            {t('Nous écrire', 'Get in touch')}
          </p>
          <h1 className="iq-display italic text-foreground mt-3">
            {t('Parlons-en.', "Let's talk.")}
          </h1>
          <p className="text-muted-foreground text-[15px] mt-4 max-w-md mx-auto">
            {t(
              'Une question, une démonstration ou un partenariat ? Écrivez-nous — nous répondons par courriel.',
              'A question, a demo or a partnership? Write to us — we reply by email.',
            )}
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-3 mb-12">
          {cards.map(({ icon: Icon, title, body }) => (
            <a
              key={title}
              href="#contact-form"
              className="group flex flex-col gap-2.5 rounded-xl border border-border bg-sunk p-4 text-left hover:border-or/50 transition-colors duration-[140ms]"
            >
              <span className="inline-flex w-9 h-9 rounded-lg bg-or/15 items-center justify-center">
                <Icon className="w-[18px] h-[18px] text-or" strokeWidth={1.75} />
              </span>
              <span className="flex items-center gap-1 text-[14px] font-medium text-foreground">
                {title}
                <ArrowUpRight
                  className="w-3.5 h-3.5 text-muted-foreground group-hover:text-or transition-colors"
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
              <span className="text-[12px] leading-snug text-muted-foreground">
                {body}
              </span>
            </a>
          ))}
        </div>

        <div id="contact-form" className="scroll-mt-28">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
