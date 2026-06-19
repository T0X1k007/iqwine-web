'use client';

import { ArrowRight, Wine, Heart, MapPin, ScanLine, Sparkles, Quote } from 'lucide-react';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import DemoPhone from '@/components/demo/DemoPhone';
import { getDemoCards } from '@/lib/demoData';
import { useLocale } from '@/lib/i18n';
import { APP_SIGNUP_URL } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * /octave, page dédiée au sommelier personnel. Angle : Octave n'est pas une
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
    fr: ['J’achète une bouteille', 'Scannez l’étiquette. Octave la lit selon VOTRE palais, pas selon une note moyenne anonyme.'],
    en: ['I’m buying a bottle', 'Scan the label. Octave reads it through YOUR palate, not an anonymous average score.'],
  },
];

const EXAMPLES: { label: { fr: string; en: string }; fr: string; en: string }[] = [
  {
    label: { fr: 'Un grand Bordeaux mature', en: 'A mature great Bordeaux' },
    fr: 'Il a passé le cap. Le fruit a cédé au cuir, au cèdre et au sous-bois, les tanins se sont faits dentelle. À ouvrir maintenant, sur une viande rouge ou un gibier. N’attendez plus, il vous offre son sommet.',
    en: 'It’s over the threshold. Fruit has given way to leather, cedar and forest floor, the tannins now lace-fine. Open it now, with red meat or game. Don’t wait any longer, it’s at its summit.',
  },
  {
    label: { fr: 'Un Pinot Noir délicat', en: 'A delicate Pinot Noir' },
    fr: 'Tout en retenue. Griotte, rose fanée, une fraîcheur qui danse. Servez-le légèrement rafraîchi, sur un saumon grillé ou des champignons. Sa délicatesse est sa force, ne la couvrez pas.',
    en: 'All restraint. Morello cherry, faded rose, a freshness that dances. Serve it lightly chilled, with grilled salmon or mushrooms. Its delicacy is its strength, don’t bury it.',
  },
  {
    label: { fr: 'Un Chardonnay boisé', en: 'An oaked Chardonnay' },
    fr: 'Beurre, noisette grillée, une pointe de vanille du fût. La bouche est ample, mais l’acidité tient la ligne. Superbe sur une volaille à la crème ou un homard. Sortez-le un quart d’heure avant, pas plus.',
    en: 'Butter, toasted hazelnut, a touch of barrel vanilla. The palate is broad, yet the acidity holds the line. Superb with creamy poultry or lobster. Take it out fifteen minutes ahead, no more.',
  },
  {
    label: { fr: 'Un Champagne de célébration', en: 'A celebration Champagne' },
    fr: 'Bulles fines, pain grillé, pomme mûre. C’est un vin de seuil et de toast, un vin qui dit oui. Ouvrez-le frais, sans autre cérémonie que le moment. Il n’attendait qu’une bonne raison.',
    en: 'Fine bubbles, toast, ripe apple. A wine of thresholds and toasts, a wine that says yes. Open it cold, with no ceremony but the moment. It was only ever waiting for a good reason.',
  },
];

const COMPARISON = {
  question: {
    fr: '« Quoi boire avec mon bœuf braisé, ce soir ? »',
    en: '“What should I drink with my braised beef tonight?”',
  },
  generic: {
    fr: 'Un rouge corsé conviendrait, par exemple un Bordeaux, une Syrah ou un Côtes-du-Rhône.',
    en: 'A full-bodied red would work, say a Bordeaux, a Syrah or a Côtes-du-Rhône.',
  },
  octave: {
    fr: 'Ouvrez votre Barolo 2022 de Pio Cesare : il est à son apogée, ses tanins fondus adorent un braisé. Sinon, à votre SAQ, le Guigal Côtes-du-Rhône à 24,50 $ est en stock, charnu et épicé, parfait ce soir.',
    en: 'Open your 2022 Pio Cesare Barolo: it’s at its peak, its melted tannins love a braise. Otherwise, at your SAQ, the Guigal Côtes-du-Rhône at $24.50 is in stock, fleshy and spiced, perfect tonight.',
  },
};

const PILLARS: { icon: typeof Wine; fr: [string, string]; en: [string, string] }[] = [
  {
    icon: Wine,
    fr: ['Votre cave', 'Vos bouteilles, vos millésimes, ce qu’il vous reste. Octave recommande dans ce que vous possédez vraiment, pas dans un catalogue mondial.'],
    en: ['Your cellar', 'Your bottles, your vintages, what you have left. Octave recommends from what you actually own, not a global catalogue.'],
  },
  {
    icon: Heart,
    fr: ['Votre palais', 'Plus vous notez vos dégustations, plus ses conseils vous ressemblent. Vos goûts, pas une note moyenne anonyme.'],
    en: ['Your palate', 'The more you log your tastings, the more its advice sounds like you. Your taste, not an anonymous average.'],
  },
  {
    icon: MapPin,
    fr: ['La SAQ en direct', 'Disponibilités par succursale, en temps réel. Quand Octave suggère un achat, il est vraiment trouvable, près de vous.'],
    en: ['The SAQ live', 'Availability by store, in real time. When Octave suggests a purchase, it’s actually findable, near you.'],
  },
];

const TESTIMONIALS: { fr: string; en: string; who: { fr: string; en: string } }[] = [
  {
    fr: 'Je demande quoi ouvrir ce soir, et la réponse tombe juste, dans ma propre cave. Je ne fais plus tourner trois applications.',
    en: 'I ask what to open tonight, and the answer is spot on, from my own cellar. No more juggling three apps.',
    who: { fr: 'Bruno, Montréal', en: 'Bruno, Montreal' },
  },
  {
    fr: 'Au restaurant, je photographie la carte et j’ai un accord à mon budget en quelques secondes. C’est devenu un réflexe.',
    en: 'At the restaurant I snap the list and get a pairing within my budget in seconds. It’s become a reflex.',
    who: { fr: 'Dany, Mirabel', en: 'Dany, Mirabel' },
  },
];

export default function OctaveContent() {
  const { locale } = useLocale();
  const t: T = (fr, en) => (locale === 'fr' ? fr : en);

  // « Voir Octave en action » : 3 scènes, 3 vins distincts (bulles / rouge /
  // blanc SAQ), mises en scène variées pour ne pas dupliquer le bloc de la home.
  const scenes = [
    {
      caption: t('Scan d’étiquette', 'Label scan'),
      sub: t('Octave lit l’étiquette selon VOTRE palais.', 'Octave reads the label through YOUR palate.'),
      card: getDemoCards('sushi', 'cave')[0],
      lift: 'lg:mt-10',
    },
    {
      caption: t('Un plat, l’accord', 'A dish, the pairing'),
      sub: t('Vous nommez le plat. Octave accorde, et explique.', 'You name the dish. Octave pairs it, and explains.'),
      card: getDemoCards('boeuf', 'cave')[0],
      lift: '',
    },
    {
      caption: t('Trouvé à la SAQ', 'Found at the SAQ'),
      sub: t('En rupture chez vous ? Octave trouve à la SAQ.', 'Out at home? Octave finds it at the SAQ.'),
      card: getDemoCards('huitres', 'saq')[0],
      lift: 'lg:mt-10',
    },
  ];

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
                {t('Essai gratuit 14 jours', 'Free Trial 14 Days')}
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

      {/* VOIR OCTAVE EN ACTION — le produit montré, scènes variées */}
      <section className="section-light px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="iq-eyebrow mb-5 inline-flex items-center gap-2">
                <ScanLine size={14} strokeWidth={1.75} aria-hidden />
                {t('Voir Octave en action', 'See Octave in action')}
              </p>
              <h2 className="iq-h1 italic max-w-2xl mx-auto">
                {t('Ce que vous voyez, vraiment.', 'What you actually see.')}
              </h2>
            </div>
          </FadeInOnScroll>
          <div className="flex flex-col items-center justify-center gap-14 lg:flex-row lg:items-start lg:gap-10">
            {scenes.map((scene, i) =>
              scene.card ? (
                <FadeInOnScroll
                  key={i}
                  delay={Math.min(i * 0.1, 0.3)}
                  className={`w-full max-w-[330px] ${scene.lift}`}
                >
                  <DemoPhone card={scene.card} locale={locale} caption={scene.caption} />
                  <p className="mt-5 text-center text-foreground-dim text-[14px] leading-relaxed max-w-[280px] mx-auto">
                    {scene.sub}
                  </p>
                </FadeInOnScroll>
              ) : null,
            )}
          </div>
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
                'Notes, accord, apogée, structure, autres accords possibles, Octave dit tout ce qu’un sommelier dirait, sans jamais que vous ayez à le demander.',
                'Notes, pairing, peak, structure, other possible matches, Octave says everything a sommelier would, without you ever having to ask.',
              )}
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      {/* COMMENT OCTAVE VOUS CONNAÎT — 3 piliers visuels */}
      <section className="px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="iq-eyebrow mb-5">{t('Comment il vous connaît', 'How he knows you')}</p>
              <h2 className="iq-h1 italic max-w-2xl mx-auto">
                {t('Trois choses qu’aucune IA générique ne sait.', 'Three things no generic AI knows.')}
              </h2>
            </div>
          </FadeInOnScroll>
          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => {
              const [title, body] = locale === 'fr' ? p.fr : p.en;
              const Icon = p.icon;
              return (
                <FadeInOnScroll key={i} delay={Math.min(i * 0.08, 0.24)}>
                  <div className="h-full rounded-2xl border border-or/15 bg-or/[0.03] p-7">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-or/30 bg-or/10 text-or mb-5">
                      <Icon size={20} strokeWidth={1.75} aria-hidden />
                    </span>
                    <h3 className="font-[family-name:var(--font-display)] italic text-xl text-foreground">{title}</h3>
                    <p className="text-muted-foreground text-[15px] leading-relaxed mt-3">{body}</p>
                  </div>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* POURQUOI OCTAVE EST DIFFÉRENT — côte à côte IA générique vs Octave */}
      <section className="px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <FadeInOnScroll>
            <div className="text-center mb-4">
              <p className="iq-eyebrow mb-5">{t('Pourquoi Octave est différent', 'Why Octave is different')}</p>
              <h2 className="iq-h1 italic max-w-2xl mx-auto">
                {t('Même question. Deux réponses.', 'Same question. Two answers.')}
              </h2>
            </div>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.1}>
            <p className="text-center font-[family-name:var(--font-display)] italic text-foreground/90 text-xl sm:text-2xl max-w-2xl mx-auto mb-10">
              {COMPARISON.question[locale]}
            </p>
          </FadeInOnScroll>
          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            <FadeInOnScroll delay={0.15} className="h-full">
              <div className="h-full rounded-2xl border border-white/5 bg-white/[0.015] p-7">
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-foreground-faint mb-4">
                  {t('Une IA générique', 'A generic AI')}
                </p>
                <p className="text-muted-foreground text-[16px] leading-relaxed">{COMPARISON.generic[locale]}</p>
                <p className="mt-5 text-[13px] text-foreground-faint italic">
                  {t('Vrai, mais ne connaît ni votre cave, ni vos goûts, ni la SAQ.', 'True, but it knows neither your cellar, your taste, nor the SAQ.')}
                </p>
              </div>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.22} className="h-full">
              <div className="h-full rounded-2xl border border-or/30 bg-or/[0.05] p-7">
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-or mb-4 inline-flex items-center gap-2">
                  <Sparkles size={13} strokeWidth={2} aria-hidden />
                  Octave
                </p>
                <p className="font-[family-name:var(--font-display)] text-foreground text-[17px] leading-relaxed">{COMPARISON.octave[locale]}</p>
                <p className="mt-5 text-[13px] text-or/90 italic">
                  {t('Votre bouteille, à son apogée, ou la bonne à la SAQ près de vous.', 'Your bottle, at its peak, or the right one at the SAQ near you.')}
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* UNE RÉPONSE DIFFÉRENTE POUR CHAQUE BOUTEILLE */}
      <section className="px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="iq-eyebrow mb-5">{t('Jamais générique', 'Never generic')}</p>
              <h2 className="iq-h1 italic max-w-2xl mx-auto">
                {t(
                  'Une réponse différente pour chaque bouteille.',
                  'A different answer for every bottle.',
                )}
              </h2>
            </div>
          </FadeInOnScroll>
          <div className="grid gap-6 sm:grid-cols-2">
            {EXAMPLES.map((ex, i) => (
              <FadeInOnScroll key={i} delay={Math.min(i * 0.06, 0.24)}>
                <figure className="h-full rounded-2xl border border-white/5 bg-white/[0.015] p-7">
                  <figcaption className="iq-eyebrow mb-4">
                    {locale === 'fr' ? ex.label.fr : ex.label.en}
                  </figcaption>
                  <blockquote className="font-[family-name:var(--font-display)] text-foreground/90 text-[17px] leading-relaxed">
                    {locale === 'fr' ? ex.fr : ex.en}
                  </blockquote>
                </figure>
              </FadeInOnScroll>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-[15px] mt-10 max-w-xl mx-auto">
            {t(
              'Même question, quatre vins, quatre réponses. Octave ne récite pas une fiche : il comprend ce qu’il y a dans le verre.',
              'Same question, four wines, four answers. Octave doesn’t recite a card: it understands what’s in the glass.',
            )}
          </p>
        </div>
      </section>

      {/* PREUVE — témoignages sobres (avis d'exemple, jamais de faux chiffres) */}
      <section className="px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="iq-eyebrow mb-5">{t('Ils vivent avec Octave', 'They live with Octave')}</p>
            </div>
          </FadeInOnScroll>
          <div className="grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((tm, i) => (
              <FadeInOnScroll key={i} delay={Math.min(i * 0.1, 0.2)}>
                <figure className="h-full rounded-2xl border border-white/5 bg-white/[0.015] p-7">
                  <Quote size={22} strokeWidth={1.5} className="text-or/60 mb-4" aria-hidden />
                  <blockquote className="font-[family-name:var(--font-display)] italic text-foreground/90 text-[18px] leading-relaxed">
                    {locale === 'fr' ? tm.fr : tm.en}
                  </blockquote>
                  <figcaption className="mt-5 font-mono text-[11px] tracking-[0.14em] uppercase text-foreground-faint">
                    {locale === 'fr' ? tm.who.fr : tm.who.en}
                  </figcaption>
                </figure>
              </FadeInOnScroll>
            ))}
          </div>
          <p className="text-center text-foreground-faint text-[12px] mt-6">
            {t('Avis d’exemple, remplacés par de vrais témoignages au lancement.', 'Sample reviews, replaced by real testimonials at launch.')}
          </p>
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
                {t('Essai gratuit 14 jours', 'Free Trial 14 Days')}
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
