'use client';

import Link from 'next/link';
import { BookOpen, LifeBuoy, FlaskConical, ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import ContactForm from '@/components/sections/ContactForm';

/**
 * ContactContent, corps client de la page /contact (la coquille serveur garde
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
  href: string;
};

export default function ContactContent() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const cards: OptionCard[] = [
    {
      icon: BookOpen,
      href: '/tarifs#faq',
      title: t("Lire les articles d'aide", 'Read help articles'),
      body: t(
        'Réponses aux questions fréquentes sur la cave et Octave, votre sommelier.',
        'Answers to common questions about the cellar and Octave, your sommelier.',
      ),
    },
    {
      icon: LifeBuoy,
      href: '#contact-form',
      title: t('Contacter le soutien', 'Contact support'),
      body: t(
        'Un pépin ou une question précise ? Notre équipe vous répond par courriel.',
        'A glitch or a specific question? Our team replies by email.',
      ),
    },
    {
      icon: FlaskConical,
      href: '/beta',
      title: t('Devenir beta testeur', 'Become a beta tester'),
      body: t(
        'Accédez en avant-première aux nouvelles fonctions et partagez vos commentaires pour aider à améliorer iQWine.',
        'Get early access to new features and share your feedback to help improve iQWine.',
      ),
    },
  ];

  // Le titre passait SOUS la barre fixe (fermeture v3, 2026-08-14) : `py-24`
  // valait 96 px alors que la navbar en mesure 128 en desktop, soit 32 px de
  // recouvrement, et 0 px d'écart à 768 et 393. Même correctif que les pages
  // légales : on part de la hauteur RÉELLE de la barre.
  return (
    <main
      className="mouvement-jour min-h-screen px-6 pb-24"
      style={{ paddingTop: 'calc(var(--nav-h) + 3rem)' }}
    >
      <div className="w-full max-w-xl mx-auto">
        <header className="mb-10 text-center">
          <p className="font-body text-[11px] uppercase tracking-[0.28em] text-or-jour">
            {t('Nous écrire', 'Get in touch')}
          </p>
          <h1 className="iq-display mt-3 italic text-encre">
            {t('Parlons-en.', "Let's talk.")}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-encre-2">
            {t(
              'Une question, une démonstration ou un partenariat ? Écrivez-nous, nous répondons par courriel.',
              'A question, a demo or a partnership? Write to us, we reply by email.',
            )}
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-3 mb-12">
          {cards.map(({ icon: Icon, title, body, href }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col gap-2.5 rounded-xl border border-encre/12 bg-[#fdfaf3]/70 p-4 text-left transition-colors duration-[140ms] hover:border-or-jour/50"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-or-jour/15">
                <Icon className="h-[18px] w-[18px] text-or-jour" strokeWidth={1.75} />
              </span>
              <span className="flex items-center gap-1 text-[14px] font-medium text-encre">
                {title}
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-encre-3 transition-colors group-hover:text-or-jour"
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
              <span className="text-[12px] leading-snug text-encre-2">
                {body}
              </span>
            </Link>
          ))}
        </div>

        <div id="contact-form" className="scroll-mt-28">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
