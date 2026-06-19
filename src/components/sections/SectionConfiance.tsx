'use client';

import { Lock, Server } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { FleurDeLys, SaqLive } from '@/components/ui/brand-icons';
import { useLocale } from '@/lib/i18n';

/**
 * SectionConfiance — preuve sociale + confiance (Phase 8).
 *
 * Registre PLAISIR, jamais la peur : trois témoignages (placeholders
 * CLAIREMENT identifiés comme exemples, à remplacer par de vrais avis) +
 * quatre badges FACTUELS (Québec, Canada, chiffré, SAQ en direct). Aucun
 * chiffre inventé : aucune statistique tant qu'elle n'est pas vraie et
 * confirmée.
 *
 * Tonalité SOMBRE (chaude, jamais anxiogène), insérée entre CaveWeb (clair) et
 * Pricing (clair) : rétablit l'alternance Cave -> Confiance(sombre) -> Pricing
 * au seuil de la décision. (L'alternance stricte parfaite est impossible — la
 * section IA doit rester sombre à une parité contraire au hero/clôture — ce
 * placement ramène le rythme à un seul écart assumé, la paire TroisMoments+IA.)
 */

type Testimonial = { quoteFr: string; quoteEn: string; name: string; city: string };

const TESTIMONIALS: Testimonial[] = [
  {
    quoteFr:
      'Je demande quoi ouvrir ce soir, et la réponse tombe juste, depuis ma propre cave.',
    quoteEn:
      'I ask what to open tonight, and the answer is spot on — from my own cellar.',
    name: 'Éric',
    city: 'Blainville, Québec',
  },
  {
    quoteFr:
      'Il me dit ce qui est en tablette à ma SAQ, ce soir même. Fini les allers pour rien.',
    quoteEn:
      'It tells me what’s on the shelf at my SAQ, tonight. No more wasted trips.',
    name: 'André',
    city: 'Terrebonne, Québec',
  },
  {
    quoteFr:
      'Il a appris mes goûts. Chaque suggestion me ressemble un peu plus.',
    quoteEn: 'It learned my taste. Each suggestion feels a little more like me.',
    name: 'François',
    city: 'Saint-Jérôme, Québec',
  },
];

export default function SectionConfiance() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const badges = [
    { icon: <FleurDeLys size={26} />, label: t('Conçu au Québec', 'Made in Québec') },
    {
      icon: <Server size={24} strokeWidth={1.75} />,
      label: t('Hébergé au Canada', 'Hosted in Canada'),
    },
    { icon: <Lock size={24} strokeWidth={1.75} />, label: t('Chiffré', 'Encrypted') },
    { icon: <SaqLive size={26} />, label: t('Données SAQ en temps réel', 'Live SAQ data') },
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
              'Conçu au Québec, vos données protégées, les disponibilités SAQ en direct. Le reste, c’est le plaisir.',
              'Built in Québec, your data protected, live SAQ availability. The rest is pleasure.',
            )}
          </p>
        </div>
      </FadeInOnScroll>

      {/* Témoignages — EXEMPLES, à remplacer par de vrais avis au lancement. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {TESTIMONIALS.map((item, i) => (
          <FadeInOnScroll key={item.name} delay={0.12 + i * 0.1} className="h-full">
            <figure className="relative flex h-full flex-col rounded-2xl border border-border-strong bg-card p-7">
              <span className="absolute right-4 top-4 rounded-full border border-border-strong px-2.5 py-0.5 font-mono text-[9px] tracking-[0.18em] uppercase text-foreground-faint">
                {t('Exemple', 'Sample')}
              </span>
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
        {t(
          'Avis d’exemple — remplacés par de vrais témoignages au lancement',
          'Sample reviews — replaced by real testimonials at launch',
        )}
      </p>

      {/* Badges FACTUELS — sobres, registre plaisir, aucun chiffre. */}
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
