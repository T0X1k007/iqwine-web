'use client';

import { LifeBuoy } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import ContactForm from '@/components/sections/ContactForm';

/**
 * SupportContent, corps client de /support (la coquille serveur garde la
 * metadata SEO). Bilingue FR/EN via useLocale + t(fr, en), comme /contact.
 *
 * ── Pourquoi cette page existe, alors que /contact existe ─────────────────
 * Une boutique d'applications exige une adresse d'assistance PUBLIQUE, et
 * celle de l'application (`app.iqwine.ai/support`) demande une session : un
 * visiteur venu de Google Play y tombe sur un écran de connexion, c'est-à-dire
 * exactement l'inverse de ce qu'on lui promet. `iqwine.ai/support` est donc
 * l'adresse canonique déclarée aux boutiques, et elle n'exige rien.
 *
 * Support et Contact restent DEUX intentions. Contact accueille la
 * démonstration, le partenariat, la question commerciale. Support accueille
 * quelqu'un qui a un problème, souvent quelqu'un qui n'arrive PLUS à se
 * connecter, donc précisément quelqu'un que l'application ne peut pas servir.
 * Les fondre aurait rendu la page des boutiques bavarde au mauvais moment.
 *
 * ── Une seule file derrière les deux ──────────────────────────────────────
 * Rien de tout cela n'ouvre un second système. Le formulaire poste vers le
 * relais unique du site, qui écrit un `ContactRequest` dans l'application,
 * visible au même endroit que tous les autres, et notifie `support@iqwine.ca`
 * par le même chemin. Deux portes, une file.
 */
export default function SupportContent({
  turnstileSiteKey = '',
}: {
  turnstileSiteKey?: string;
}) {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  // Le titre passait SOUS la barre fixe sur les pages ivoire (fermeture v3,
  // 2026-08-14) : on part de la hauteur RÉELLE de la barre, comme /contact.
  return (
    <main
      className="mouvement-jour min-h-screen px-6 pb-24"
      style={{ paddingTop: 'calc(var(--nav-h) + 3rem)' }}
    >
      <div className="w-full max-w-xl mx-auto">
        <header className="mb-10 text-center">
          <p className="font-body inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-or-jour">
            <LifeBuoy className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            {t('Assistance', 'Help')}
          </p>
          <h1 className="iq-display mt-3 text-encre">
            {t('Support iQWine', 'iQWine Support')}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-encre-2">
            {t(
              'Un problème, une question sur votre compte ou votre abonnement ? Écrivez-nous ici. Aucun compte n’est nécessaire, et nous répondons par courriel.',
              'A problem, a question about your account or your subscription? Write to us here. No account needed, and we reply by email.',
            )}
          </p>
        </header>

        {/* La porte de l'application, dite une fois, sans détourner celle-ci.
            Quelqu'un qui est déjà connecté y gagne son historique de demandes ;
            quelqu'un qui ne l'est pas reste ici, et c'est le but de la page. */}
        <p className="mb-10 text-center text-[13px] text-encre-3">
          {t('Vous avez déjà un compte ?', 'Already have an account?')}{' '}
          <a
            href="https://app.iqwine.ai/support"
            className="underline underline-offset-4 transition-colors hover:text-or-jour"
          >
            {t(
              'Le support est aussi dans l’application',
              'Support is also inside the app',
            )}
          </a>
          {t(
            ', vos demandes précédentes y sont.',
            ', your previous requests are there.',
          )}
        </p>

        {/*
          * DEUX SUJETS, ET PAS SIX.
          *
          * /contact en propose six parce qu'il accueille aussi la
          * démonstration et le partenariat. Ici, les deux seuls qui décrivent
          * un problème : « Support » pour le technique et le compte,
          * « Facturation » pour l'argent. Ce choix n'est pas cosmétique, il
          * décide de l'alias qui reçoit : `support@` pour le premier,
          * `billing@` pour le second (table de routage de l'application).
          * Une personne bloquée sur un paiement n'a pas à écrire au support
          * technique pour être ensuite transférée.
          */}
        <ContactForm
          turnstileSiteKey={turnstileSiteKey}
          categories={['SUPPORT', 'BILLING']}
          defaultCategory="SUPPORT"
          page="support"
        />
      </div>
    </main>
  );
}
