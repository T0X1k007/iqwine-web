'use client';

import { ArrowRight, Wine, MessageCircle, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import Pricing from '@/components/sections/Pricing';
import SectionFaq from '@/components/sections/SectionFaq';
import { useLocale } from '@/lib/i18n';
import { APP_SIGNUP_URL } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * /tarifs, page de DÉCISION. Aide le visiteur à choisir (positionnement par
 * profil), puis les prix, le « comment ça marche », les bénéfices, la FAQ, les
 * plateformes, un CTA. Contenu 100 % original. Réutilise Pricing + SectionFaq.
 */

type T = (fr: string, en: string) => string;

const POSITIONS: { fr: [string, string]; en: [string, string]; highlight?: boolean }[] = [
  {
    fr: ['Essai gratuit', 'Découvrir Octave et importer votre cave, sans engagement.'],
    en: ['Free trial', 'Discover Octave and import your cellar, no commitment.'],
  },
  {
    fr: ['Standard', 'L’amateur de vin avec une cave personnelle.'],
    en: ['Standard', 'The wine lover with a personal cellar.'],
  },
  {
    fr: ['Pro', 'Le passionné qui consulte Octave souvent et possède une plus grande cave.'],
    en: ['Pro', 'The enthusiast who asks Octave often and keeps a larger cellar.'],
    highlight: true,
  },
  {
    fr: ['Famille', 'Plusieurs utilisateurs, plusieurs palais, une cave partagée.'],
    en: ['Famille', 'Several users, several palates, one shared cellar.'],
  },
];

const STEPS: { icon: typeof Wine; fr: [string, string]; en: [string, string] }[] = [
  {
    icon: Wine,
    fr: ['Importez ou créez votre cave', 'Scannez vos étiquettes ou ajoutez vos bouteilles. Octave apprend ce que vous avez.'],
    en: ['Import or create your cellar', 'Scan your labels or add your bottles. Octave learns what you have.'],
  },
  {
    icon: MessageCircle,
    fr: ['Demandez conseil à Octave', 'Le repas, le moment, l’envie, dites-lui, comme à un sommelier.'],
    en: ['Ask Octave', 'The meal, the moment, the mood, just tell him, like a sommelier.'],
  },
  {
    icon: Sparkles,
    fr: ['Ouvrez la bonne bouteille', 'La bonne, au bon moment. Et vous savez pourquoi.'],
    en: ['Open the right bottle', 'The right one, at the right time. And you know why.'],
  },
];

const BENEFITS: { fr: string; en: string }[] = [
  { fr: 'Sachez quoi ouvrir ce soir.', en: 'Know what to open tonight.' },
  { fr: 'Ne manquez plus l’apogée d’une bouteille.', en: 'Never miss a bottle’s peak again.' },
  { fr: 'Recevez des accords adaptés à votre cave.', en: 'Get pairings drawn from your own cellar.' },
  { fr: 'Retrouvez votre vin en quelques secondes.', en: 'Find your wine in seconds.' },
  { fr: 'Obtenez l’avis d’un sommelier à tout moment.', en: 'Get a sommelier’s take, anytime.' },
];

export default function TarifsContent() {
  const { locale } = useLocale();
  const t: T = (fr, en) => (locale === 'fr' ? fr : en);

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative px-6 pt-32 pb-16 lg:pt-40 lg:pb-20 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(142,42,42,0.10),transparent_70%)]" aria-hidden />
        <div className="relative mx-auto max-w-3xl">
          <p className="iq-eyebrow mb-6">{t('Tarifs', 'Pricing')}</p>
          <h1 className="iq-display italic">{t('Trouvez votre Octave.', 'Find your Octave.')}</h1>
          <p className="iq-lead mt-7 max-w-2xl mx-auto">
            {t(
              'Chaque formule commence par 14 jours gratuits, sans carte. Vous découvrez Octave, puis vous choisissez, ou pas.',
              'Every plan starts with 14 free days, no card. You discover Octave, then you choose, or not.',
            )}
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href={APP_SIGNUP_URL}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'tarifs-hero' })}
            >
              <Button variant="cta" size="lg">
                {t('Essai gratuit 14 jours', 'Free Trial 14 Days')}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* LEQUEL EST POUR VOUS, positionnement par profil */}
      <section className="px-6 py-16 lg:py-20 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="iq-eyebrow mb-5">{t('Lequel est pour vous ?', 'Which one is for you?')}</p>
              <h2 className="iq-h1 italic">{t('Chaque formule a son profil.', 'Each plan has a profile.')}</h2>
            </div>
          </FadeInOnScroll>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {POSITIONS.map((p, i) => {
              const [title, body] = locale === 'fr' ? p.fr : p.en;
              return (
                <FadeInOnScroll key={i} delay={Math.min(i * 0.06, 0.24)}>
                  <div
                    className={`h-full rounded-xl border p-6 ${
                      p.highlight ? 'border-or/30 bg-or/[0.04]' : 'border-white/5 bg-white/[0.015]'
                    }`}
                  >
                    <h3 className="font-[family-name:var(--font-display)] italic text-xl text-or">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-[15px] leading-relaxed mt-2">{body}</p>
                  </div>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* LES PRIX (réutilise la section Pricing : plans + toggle annuel) */}
      <Pricing />

      {/* COMMENT ÇA FONCTIONNE */}
      <section className="px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <FadeInOnScroll>
            <div className="text-center mb-14">
              <p className="iq-eyebrow mb-5">{t('Comment ça fonctionne ?', 'How it works')}</p>
              <h2 className="iq-h1 italic">{t('En trois gestes.', 'In three moves.')}</h2>
            </div>
          </FadeInOnScroll>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((s, i) => {
              const [title, body] = locale === 'fr' ? s.fr : s.en;
              const Icon = s.icon;
              return (
                <FadeInOnScroll key={i} delay={Math.min(i * 0.08, 0.24)}>
                  <div className="text-center sm:text-left">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <span className="font-[family-name:var(--font-display)] italic text-or text-2xl tabular-nums">
                        {i + 1}
                      </span>
                      <Icon size={20} strokeWidth={1.5} className="text-or/70" aria-hidden />
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] italic text-xl text-foreground leading-snug">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-[15px] leading-relaxed mt-2">{body}</p>
                  </div>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* POURQUOI LES AMATEURS CHOISISSENT iQWINE, bénéfices */}
      <section className="px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-3xl">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="iq-eyebrow mb-5">{t('Pourquoi iQWine', 'Why iQWine')}</p>
              <h2 className="iq-h1 italic">
                {t('Pourquoi les amateurs choisissent iQWine', 'Why wine lovers choose iQWine')}
              </h2>
            </div>
          </FadeInOnScroll>
          <ul className="space-y-px rounded-2xl overflow-hidden border border-white/5">
            {BENEFITS.map((b, i) => (
              <FadeInOnScroll key={i} delay={Math.min(i * 0.05, 0.25)}>
                <li className="flex items-center gap-4 bg-white/[0.015] px-6 py-5">
                  <Sparkles size={18} strokeWidth={1.5} className="text-or shrink-0" aria-hidden />
                  <span className="font-[family-name:var(--font-display)] italic text-lg text-foreground">
                    {locale === 'fr' ? b.fr : b.en}
                  </span>
                </li>
              </FadeInOnScroll>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ (réutilise la section existante) */}
      <SectionFaq />

      {/* PLATEFORMES */}
      <section className="px-6 py-14 border-t border-white/5 text-center">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
          {t('Disponible sur iPhone et sur le web', 'Available on iPhone and on the web')}
        </p>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 py-24 lg:py-32 border-t border-white/5 text-center">
        <FadeInOnScroll>
          <h2 className="iq-display italic max-w-3xl mx-auto">
            {t('Commencez ce soir.', 'Start tonight.')}
          </h2>
          <p className="iq-lead mt-6 max-w-xl mx-auto">
            {t('14 jours pour rencontrer Octave. Aucune carte requise.', '14 days to meet Octave. No card required.')}
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href={APP_SIGNUP_URL}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'tarifs-final' })}
            >
              <Button variant="cta" size="lg">
                {t('Essai gratuit 14 jours', 'Free Trial 14 Days')}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
          </div>
        </FadeInOnScroll>
      </section>
    </main>
  );
}
