'use client';

import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import { APP_SIGNUP_URL } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * /octave — page dédiée au sommelier personnel. Angle : Octave n'est pas une
 * fonctionnalité IA, c'est quelqu'un qui connaît votre cave et vous dit quelle
 * bouteille ouvrir. Storytelling autour des moments de vie. Contenu 100 % original.
 */

type T = (fr: string, en: string) => string;

const MOMENTS: { fr: [string, string]; en: [string, string] }[] = [
  {
    fr: ['Je reçois des amis', 'Dites-lui qui vient et ce que vous servez. Octave compose la soirée, du verre d’ouverture au dernier plat.'],
    en: ['I’m having friends over', 'Tell him who’s coming and what you’re serving. Octave composes the evening, from the opening glass to the last course.'],
  },
  {
    fr: ['Je cuisine un repas spécial', 'Nommez le plat. Octave accorde, du choix le plus sûr au plus audacieux, et vous explique pourquoi.'],
    en: ['I’m cooking something special', 'Name the dish. Octave pairs it, from the safest choice to the boldest, and tells you why.'],
  },
  {
    fr: ['Je ne sais pas quoi ouvrir', 'Trois bouteilles de VOTRE cave, prêtes ce soir, présentées comme un sommelier vous les présenterait.'],
    en: ['I don’t know what to open', 'Three bottles from YOUR cellar, ready tonight, presented the way a sommelier would present them.'],
  },
  {
    fr: ['Est-ce que cette bouteille est prête ?', 'Octave vous dit où elle en est, ce qu’elle offre maintenant, et combien de temps il vous reste.'],
    en: ['Is this bottle ready?', 'Octave tells you where it stands, what it offers now, and how long you still have.'],
  },
  {
    fr: ['J’hésite entre plusieurs', 'Octave tranche selon votre palais, le plat et le moment, et assume son choix.'],
    en: ['I’m torn between a few', 'Octave decides by your palate, the dish and the moment, and stands by the choice.'],
  },
  {
    fr: ['Je suis au restaurant', 'Photographiez la carte des vins. Octave accorde à votre plat, dans votre budget, en quelques secondes.'],
    en: ['I’m at the restaurant', 'Snap the wine list. Octave pairs it to your dish, within your budget, in seconds.'],
  },
  {
    fr: ['J’achète une bouteille', 'Scannez l’étiquette. Octave la lit selon VOTRE palais — pas selon une note moyenne anonyme.'],
    en: ['I’m buying a bottle', 'Scan the label. Octave reads it through YOUR palate — not an anonymous average score.'],
  },
];

const DIFFERENCE: { fr: [string, string]; en: [string, string] }[] = [
  {
    fr: ['Il connaît VOTRE cave', 'Pas un catalogue mondial. Vos bouteilles, vos millésimes, ce qu’il vous reste.'],
    en: ['He knows YOUR cellar', 'Not a global catalogue. Your bottles, your vintages, what you have left.'],
  },
  {
    fr: ['Il apprend votre palais', 'Plus vous goûtez, plus ses conseils vous ressemblent. Vos goûts, pas une moyenne.'],
    en: ['He learns your palate', 'The more you taste, the more his advice sounds like you. Your taste, not an average.'],
  },
  {
    fr: ['Il parle en sommelier', 'Pas une fiche technique. Une recommandation qu’on a envie de suivre, ce soir.'],
    en: ['He speaks like a sommelier', 'Not a spec sheet. A recommendation you actually want to follow, tonight.'],
  },
  {
    fr: ['Il connaît la SAQ en direct', 'Disponibilités par succursale, en temps réel. Le bon vin, vraiment trouvable.'],
    en: ['He knows the SAQ live', 'Availability by store, in real time. The right wine, actually findable.'],
  },
];

export default function OctaveContent() {
  const { locale } = useLocale();
  const t: T = (fr, en) => (locale === 'fr' ? fr : en);

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative px-6 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(142,42,42,0.10),transparent_70%)]" aria-hidden />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="iq-eyebrow mb-6">{t('Rencontrez Octave', 'Meet Octave')}</p>
          <h1 className="iq-display italic">
            {t('Votre sommelier. Pas une fonctionnalité.', 'Your sommelier. Not a feature.')}
          </h1>
          <p className="iq-lead mt-7 max-w-2xl mx-auto">
            {t(
              'Vous n’avez pas seulement une cave. Vous avez quelqu’un pour vous dire quelle bouteille ouvrir.',
              'You don’t just own a cellar. You have someone to tell you which bottle to open.',
            )}
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href={APP_SIGNUP_URL}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'octave-hero' })}
            >
              <Button variant="cta" size="lg">
                {t('Débuter l’essai gratuit', 'Start the free trial')}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CE QU'OCTAVE FAIT */}
      <section className="px-6 py-16 lg:py-20 border-t border-white/5">
        <div className="mx-auto max-w-3xl text-center">
          <FadeInOnScroll>
            <p className="iq-eyebrow mb-5">{t('Ce qu’il fait', 'What he does')}</p>
            <h2 className="iq-h1 italic">
              {t('Octave goûte avec vous.', 'Octave tastes with you.')}
            </h2>
            <p className="iq-lead mt-6 max-w-2xl mx-auto">
              {t(
                'Il connaît votre cave, votre palais et la SAQ en temps réel. Vous lui dites le repas, le moment, l’envie. Il vous dit la bouteille, et pourquoi c’est la bonne.',
                'He knows your cellar, your palate and the SAQ in real time. You tell him the meal, the moment, the mood. He tells you the bottle, and why it’s the right one.',
              )}
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      {/* MOMENTS DE VIE */}
      <section className="px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="iq-eyebrow mb-5">{t('Vos moments', 'Your moments')}</p>
              <h2 className="iq-h1 italic">
                {t('Un compagnon de décision', 'A decision companion')}
              </h2>
            </div>
          </FadeInOnScroll>
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden border border-white/5">
            {MOMENTS.map((m, i) => {
              const [title, body] = locale === 'fr' ? m.fr : m.en;
              return (
                <FadeInOnScroll key={i} delay={Math.min(i * 0.05, 0.3)}>
                  <div className="h-full bg-white/[0.015] p-7">
                    <h3 className="font-[family-name:var(--font-display)] italic text-xl text-or leading-snug">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-[15px] leading-relaxed mt-3">{body}</p>
                  </div>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXEMPLE DE RECOMMANDATION (la profondeur) */}
      <section className="px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-3xl">
          <FadeInOnScroll>
            <p className="iq-eyebrow mb-5 text-center">
              {t('Une recommandation d’Octave', 'A recommendation from Octave')}
            </p>
            <h2 className="iq-h1 italic text-center mb-10">
              {t('Pas une fiche. Un sommelier.', 'Not a card. A sommelier.')}
            </h2>
            <figure className="rounded-2xl border border-or/15 bg-or/[0.03] p-8 lg:p-10">
              <blockquote className="font-[family-name:var(--font-display)] text-foreground/90 text-[19px] sm:text-[21px] leading-relaxed">
                {t(
                  'Ce Châteauneuf-du-Pape traverse une magnifique phase d’expression. La mûre, la garrigue et les épices douces se posent sur des tanins fondus, et l’équilibre est remarquable. Il accompagnera parfaitement votre carré d’agneau aux herbes, et tiendra tête à un plateau de fromages affinés. Il est tout près de son apogée : exceptionnel ce soir, il gagnera encore en complexité d’ici deux à trois ans. Si vous voulez l’ouvrir maintenant, carafez-le une heure.',
                  'This Châteauneuf-du-Pape is in a beautiful phase of expression. Blackberry, garrigue and sweet spice settle over melted tannins, and the balance is remarkable. It will pair perfectly with your herb-crusted rack of lamb, and stand up to a board of aged cheeses. It’s right near its peak: exceptional tonight, it will gain complexity over the next two to three years. If you’re opening it now, decant it for an hour.',
                )}
              </blockquote>
              <figcaption className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.14em] uppercase text-foreground-faint">
                <span>{t('Apogée · maintenant → 2 ans', 'Peak · now → 2 yrs')}</span>
                <span>{t('Tanins · fondus', 'Tannins · melted')}</span>
                <span>{t('Acidité · fraîche', 'Acidity · fresh')}</span>
                <span>{t('Corps · ample', 'Body · full')}</span>
              </figcaption>
            </figure>
            <p className="text-center text-muted-foreground text-[15px] mt-6 max-w-xl mx-auto">
              {t(
                'Notes, accord, apogée, structure, autres accords possibles — Octave dit tout ce qu’un sommelier dirait, sans jamais que vous ayez à le demander.',
                'Notes, pairing, peak, structure, other possible matches — Octave says everything a sommelier would, without you ever having to ask.',
              )}
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      {/* POURQUOI DIFFÉRENT */}
      <section className="px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="iq-eyebrow mb-5">{t('Pourquoi Octave', 'Why Octave')}</p>
              <h2 className="iq-h1 italic max-w-2xl mx-auto">
                {t(
                  'Une base de données dit ce qu’est un vin. Octave dit lequel ouvrir.',
                  'A database tells you what a wine is. Octave tells you which to open.',
                )}
              </h2>
            </div>
          </FadeInOnScroll>
          <div className="grid gap-6 sm:grid-cols-2">
            {DIFFERENCE.map((d, i) => {
              const [title, body] = locale === 'fr' ? d.fr : d.en;
              return (
                <FadeInOnScroll key={i} delay={Math.min(i * 0.06, 0.24)}>
                  <div className="h-full rounded-xl border border-white/5 bg-white/[0.015] p-6">
                    <h3 className="font-[family-name:var(--font-display)] italic text-lg text-foreground">
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

      {/* CTA FINAL */}
      <section className="px-6 py-24 lg:py-32 border-t border-white/5 text-center">
        <FadeInOnScroll>
          <h2 className="iq-display italic max-w-3xl mx-auto">
            {t('Votre prochaine bouteille vous attend.', 'Your next bottle is waiting.')}
          </h2>
          <p className="iq-lead mt-6 max-w-xl mx-auto">
            {t('Faites connaissance avec Octave ce soir.', 'Get to know Octave tonight.')}
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <a
              href={APP_SIGNUP_URL}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'octave-final' })}
            >
              <Button variant="cta" size="lg">
                {t('Débuter l’essai gratuit', 'Start the free trial')}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground-faint">
              {t('14 jours gratuits · Aucune carte requise', '14 days free · No card required')}
            </p>
          </div>
        </FadeInOnScroll>
      </section>
    </main>
  );
}
