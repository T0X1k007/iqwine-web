'use client';

import { Check } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import BetaForm from '@/components/beta/BetaForm';

/**
 * BetaContent, corps client de /beta (la coquille serveur garde la metadata
 * SEO). Deux temps : un texte d'attentes qui pose la barre (on filtre l'intention
 * dès la lecture), puis le formulaire de candidature (BetaForm). Bilingue FR/EN.
 */

interface BetaContentProps {
  /** Clé publique Turnstile, lue par la coquille serveur (corps client ici). */
  turnstileSiteKey?: string;
}

export default function BetaContent({ turnstileSiteKey = '' }: BetaContentProps) {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const expectations: [string, string][] = [
    [
      'Utiliser iQWine pour de vrai, sur votre cave, chaque semaine.',
      'Use iQWine for real, on your own cellar, every week.',
    ],
    [
      'Éprouver les nouvelles fonctions dès qu’elles arrivent, pas seulement les acquises.',
      'Put new features through their paces as soon as they land, not just the familiar ones.',
    ],
    [
      'Nous signaler bogues, frictions et idées, régulièrement. Quelques mots suffisent.',
      'Report bugs, friction and ideas, regularly. A few words are enough.',
    ],
    [
      'Répondre à nos questions de suivi (courriel, parfois un court échange).',
      'Answer our follow-up questions (email, sometimes a short chat).',
    ],
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
            {t('Programme bêta', 'Beta program')}
          </p>
          {/* Micro-correction de fermeture v3 (Eric, 2026-08-14) : `iq-display`
              monte à 96 px, l'échelle la plus grande du système, et « bêta-
              testeur » se cassait en deux avec un trait d'union dans un
              conteneur de 576 px. On adopte l'échelle des H1 v3 (58 px maxi),
              `text-balance` pour un retour propre, et on interdit la césure.
              Le style de la page n'est pas touché par ailleurs. */}
          <h1
            className="mt-3 text-balance font-[family-name:var(--font-display)] font-medium italic leading-[1.08] tracking-[-0.02em] text-encre [hyphens:none]"
            style={{ fontSize: 'clamp(34px, 5vw, 58px)' }}
          >
            {t('Devenez bêta-testeur.', 'Become a beta tester.')}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-encre-2">
            {t(
              'Vous rejoignez un cercle restreint qui façonne iQWine avant tout le monde. En avant-première, vous mettez Octave à l’épreuve sur votre propre cave.',
              'You join a small circle shaping iQWine before anyone else. Early on, you put Octave to the test on your own cellar.',
            )}
          </p>
        </header>

        <section className="mb-12 space-y-5 rounded-xl border border-encre/12 bg-[#fdfaf3]/70 p-6">
          <p className="text-[15px] leading-relaxed text-encre">
            {t(
              'Ce n’est pas un accès gratuit : c’est une collaboration. Nous cherchons des passionnés qui ont une vraie cave, du temps pour explorer, et l’envie de nous dire ce qui fonctionne, et surtout ce qui ne fonctionne pas encore.',
              'This isn’t free access, it’s a collaboration. We’re looking for enthusiasts with a real cellar, time to explore, and the urge to tell us what works, and especially what doesn’t yet.',
            )}
          </p>

          <div>
            <p className="mb-3 font-body text-[11px] font-medium uppercase tracking-[0.22em] text-encre-3">
              {t('Ce que nous attendons d’un bêta-testeur', 'What we expect from a beta tester')}
            </p>
            <ul className="space-y-2.5">
              {expectations.map(([fr, en]) => (
                <li key={en} className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-or-jour"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="text-[14px] leading-snug text-encre">{t(fr, en)}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[14px] leading-relaxed text-encre-2">
            {t(
              'En retour : accès prioritaire et gratuit pendant la bêta, l’oreille directe de l’équipe, et votre empreinte sur un produit que vous aurez aidé à faire naître.',
              'In return: priority, free access during the beta, the team’s direct ear, and your mark on a product you’ll have helped bring to life.',
            )}
          </p>

          <p className="text-[14px] font-medium text-bordeaux-jour">
            {t('Les places sont limitées. Dites-nous qui vous êtes.', 'Spots are limited. Tell us who you are.')}
          </p>
        </section>

        <div id="beta-form" className="scroll-mt-28">
          <BetaForm turnstileSiteKey={turnstileSiteKey} />
        </div>
      </div>
    </main>
  );
}
