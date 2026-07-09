'use client';

import { Check } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import BetaForm from '@/components/beta/BetaForm';

/**
 * BetaContent — corps client de /beta (la coquille serveur garde la metadata
 * SEO). Deux temps : un texte d'attentes qui pose la barre (on filtre l'intention
 * dès la lecture), puis le formulaire de candidature (BetaForm). Bilingue FR/EN.
 */

export default function BetaContent() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const expectations: [string, string][] = [
    [
      'Utiliser iQWine pour de vrai, sur votre cave, chaque semaine.',
      'Use iQWine for real, on your own cellar, every week.',
    ],
    [
      'Éprouver les nouvelles fonctions dès qu’elles arrivent — pas seulement les acquises.',
      'Put new features through their paces as soon as they land — not just the familiar ones.',
    ],
    [
      'Nous signaler bogues, frictions et idées, régulièrement. Quelques mots suffisent.',
      'Report bugs, friction and ideas — regularly. A few words are enough.',
    ],
    [
      'Répondre à nos questions de suivi (courriel, parfois un court échange).',
      'Answer our follow-up questions (email, sometimes a short chat).',
    ],
  ];

  return (
    <main className="min-h-screen px-6 py-24">
      <div className="w-full max-w-xl mx-auto">
        <header className="mb-10 text-center">
          <p className="font-body text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
            {t('Programme bêta', 'Beta program')}
          </p>
          <h1 className="iq-display italic text-foreground mt-3">
            {t('Devenez bêta-testeur.', 'Become a beta tester.')}
          </h1>
          <p className="text-muted-foreground text-[15px] mt-4 max-w-md mx-auto">
            {t(
              'Vous rejoignez un cercle restreint qui façonne iQWine avant tout le monde. En avant-première, vous mettez Octave à l’épreuve sur votre propre cave.',
              'You join a small circle shaping iQWine before anyone else. Early on, you put Octave to the test on your own cellar.',
            )}
          </p>
        </header>

        <section className="mb-12 rounded-xl border border-border bg-sunk p-6 space-y-5">
          <p className="text-foreground text-[15px] leading-relaxed">
            {t(
              'Ce n’est pas un accès gratuit : c’est une collaboration. Nous cherchons des passionnés qui ont une vraie cave, du temps pour explorer, et l’envie de nous dire ce qui fonctionne — et surtout ce qui ne fonctionne pas encore.',
              'This isn’t free access — it’s a collaboration. We’re looking for enthusiasts with a real cellar, time to explore, and the urge to tell us what works — and especially what doesn’t yet.',
            )}
          </p>

          <div>
            <p className="font-body text-[11px] font-medium tracking-[0.22em] uppercase text-muted-foreground mb-3">
              {t('Ce que nous attendons d’un bêta-testeur', 'What we expect from a beta tester')}
            </p>
            <ul className="space-y-2.5">
              {expectations.map(([fr, en]) => (
                <li key={en} className="flex items-start gap-2.5">
                  <Check
                    className="w-4 h-4 text-or shrink-0 mt-0.5"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="text-foreground text-[14px] leading-snug">{t(fr, en)}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-muted-foreground text-[14px] leading-relaxed">
            {t(
              'En retour : accès prioritaire et gratuit pendant la bêta, l’oreille directe de l’équipe, et votre empreinte sur un produit que vous aurez aidé à faire naître.',
              'In return: priority, free access during the beta, the team’s direct ear, and your mark on a product you’ll have helped bring to life.',
            )}
          </p>

          <p className="text-or text-[14px] font-medium">
            {t('Les places sont limitées. Dites-nous qui vous êtes.', 'Spots are limited. Tell us who you are.')}
          </p>
        </section>

        <div id="beta-form" className="scroll-mt-28">
          <BetaForm />
        </div>
      </div>
    </main>
  );
}
