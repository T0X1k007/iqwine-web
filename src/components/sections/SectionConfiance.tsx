'use client';

import { Lock, Server } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { FleurDeLys, SaqLive } from '@/components/ui/brand-icons';
import { useLocale } from '@/lib/i18n';
import { TESTIMONIALS } from '@/lib/testimonials';

/**
 * SectionConfiance, preuve sociale + confiance (Phase 8).
 *
 * Registre PLAISIR, jamais la peur : trois vrais témoignages (source partagée
 * lib/testimonials) + quatre badges FACTUELS (Québec, Canada, chiffré, SAQ en
 * direct). Aucun chiffre inventé : aucune statistique tant qu'elle n'est pas
 * vraie et confirmée.
 *
 * Tonalité SOMBRE (chaude, jamais anxiogène), insérée entre CaveWeb (clair) et
 * Pricing (clair) : rétablit l'alternance Cave -> Confiance(sombre) -> Pricing
 * au seuil de la décision. (L'alternance stricte parfaite est impossible, la
 * section IA doit rester sombre à une parité contraire au hero/clôture, ce
 * placement ramène le rythme à un seul écart assumé, la paire TroisMoments+IA.)
 */

export default function SectionConfiance() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const badges = [
    { icon: <FleurDeLys size={26} />, label: t('Québec-natif', 'Québec-native') },
    {
      icon: <Server size={24} strokeWidth={1.75} />,
      label: t('Hébergé au Canada', 'Hosted in Canada'),
    },
    { icon: <Lock size={24} strokeWidth={1.75} />, label: t('Chiffré', 'Encrypted') },
    { icon: <SaqLive size={26} />, label: t('Disponibilités SAQ par succursale', 'SAQ availability by store') },
  ];

  return (
    <SectionWrapper id="confiance" withDivider rhythm="editorial">
      <FadeInOnScroll>
        <div className="text-center mb-12 sm:mb-16">
          <div className="iq-eyebrow mb-5">{t('Confiance', 'Trust')}</div>
          <h2 className="iq-display italic max-w-3xl mx-auto">
            {t('Vous êtes entre de bonnes mains.', 'You’re in good hands.')}
          </h2>
          <p className="iq-lead mt-6 max-w-2xl mx-auto">
            {t(
              'Conçu au Québec, iQWine connaît la SAQ comme aucune app étrangère ne le pourra : succursale par succursale, en direct.',
              'Built in Québec, iQWine knows the SAQ like no foreign app ever could: store by store, live.',
            )}
          </p>
        </div>
      </FadeInOnScroll>

      {/* Témoignages réels, trois voix sur la home (grille 3 colonnes propre). */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {TESTIMONIALS.slice(0, 3).map((item, i) => (
          <FadeInOnScroll key={item.name} delay={0.12 + i * 0.1} className="h-full">
            <figure className="flex h-full flex-col rounded-2xl border border-border-strong bg-card p-7">
              <blockquote className="font-[family-name:var(--font-display)] italic text-foreground text-lg leading-relaxed flex-1">
                « {locale === 'fr' ? item.quoteFr : item.quoteEn} »
              </blockquote>
              <figcaption className="mt-6 flex items-baseline gap-2">
                <span className="text-foreground font-medium">{item.name}</span>
                <span className="text-muted-foreground text-[13px]">· {item.city}</span>
              </figcaption>
            </figure>
          </FadeInOnScroll>
        ))}
      </div>

      <p className="mt-6 text-center font-mono text-[10px] tracking-[0.18em] uppercase text-foreground-faint">
        {t('Membres du programme bêta iQWine', 'iQWine beta program members')}
      </p>

      {/* Badges FACTUELS, sobres, registre plaisir, aucun chiffre. */}
      <FadeInOnScroll delay={0.2}>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-2.5 text-foreground">
              <span className="text-or shrink-0">{b.icon}</span>
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
