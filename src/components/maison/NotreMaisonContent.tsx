'use client';

import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * /notre-maison — page de marque (Vague 4). La maison où vit Octave, votre
 * sommelier. On RÉVÈLE la mission déjà présente — on ne l'invente pas : aucun
 * fait fabriqué (pas d'événement, de chiffre, de certification, de biographie).
 * Voix : vouvoiement éditorial luxe, phrases courtes, sans exclamation.
 */

type T = (fr: string, en: string) => string;

export default function NotreMaisonContent() {
  const { locale } = useLocale();
  const t: T = (fr, en) => (locale === 'fr' ? fr : en);

  return (
    <main className="overflow-hidden">
      {/* MANIFESTE */}
      <SectionWrapper rhythm="editorial" className="pt-32 lg:pt-40">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(142,42,42,0.10),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="iq-eyebrow mb-6">{t('NOTRE MAISON', 'OUR HOUSE')}</p>
          <h1 className="iq-display italic">
            {t(
              'On ne voulait pas gérer une cave. On voulait vivre avec.',
              "We didn't want to manage a cellar. We wanted to live with one.",
            )}
          </h1>
          <p className="iq-lead mt-7 max-w-2xl mx-auto">
            {t(
              'iQWine est né d’une conviction simple : une belle cave ne devrait jamais devenir une corvée de tableur. Elle devrait se souvenir à votre place.',
              "iQWine was born from a simple conviction: a beautiful cellar should never become a spreadsheet chore. It should remember in your place.",
            )}
          </p>
        </div>
      </SectionWrapper>

      {/* LE POURQUOI */}
      <SectionWrapper tone="light" withDivider rhythm="standard">
        <div className="mx-auto max-w-3xl text-center">
          <FadeInOnScroll>
            <p className="iq-eyebrow mb-5">{t('Le pourquoi', 'The why')}</p>
            <h2 className="iq-h1 italic">
              {t(
                'La meilleure bouteille, oubliée au fond de la cave.',
                'The best bottle, forgotten at the back of the cellar.',
              )}
            </h2>
            <p className="iq-lead mt-7 max-w-2xl mx-auto">
              {t(
                'On connaît tous ce moment : des invités arrivent, et la question tombe — quoi ouvrir ? On hésite, on choisit par défaut, et la bouteille qu’il fallait reste couchée, passée son apogée. Les outils existants comptent les bouteilles. Aucun ne répond à la seule question qui compte : celle-ci, ce soir ?',
                'We all know the moment: guests arrive, and the question lands — what to open? We hesitate, we settle, and the bottle that was right stays lying down, past its peak. The tools out there count bottles. None answer the only question that matters: this one, tonight?',
              )}
            </p>
          </FadeInOnScroll>
        </div>
      </SectionWrapper>

      {/* LA PHILOSOPHIE */}
      <SectionWrapper withDivider rhythm="standard">
        <div className="mx-auto max-w-3xl text-center">
          <FadeInOnScroll>
            <p className="iq-eyebrow mb-5">{t('La philosophie', 'The philosophy')}</p>
            <h2 className="iq-h1 italic">
              {t('Une cave qui se souvient.', 'A cellar that remembers.')}
            </h2>
            <p className="iq-lead mt-7 max-w-2xl mx-auto">
              {t(
                'C’est notre seule obsession. Une cave qui retient ce que vous avez aimé, qui suit l’apogée de chaque bouteille, qui apprend votre palais à chaque dégustation. Pas un inventaire qui oublie — une mémoire qui vous connaît. De cette mémoire est né Octave : le sommelier qui transforme tout ce que votre cave sait en une seule décision.',
                'It is our only obsession. A cellar that holds what you loved, that follows the peak of every bottle, that learns your palate with every tasting. Not an inventory that forgets — a memory that knows you. From that memory came Octave: the sommelier who turns everything your cellar knows into a single decision.',
              )}
            </p>
          </FadeInOnScroll>
        </div>
      </SectionWrapper>

      {/* OCTAVE, LE SOMMELIER DE LA MAISON */}
      <SectionWrapper tone="light" withDivider rhythm="standard">
        <div className="mx-auto max-w-3xl text-center">
          <FadeInOnScroll>
            <p className="iq-eyebrow mb-5">
              {t('Le sommelier de la maison', 'The sommelier of the house')}
            </p>
            <h2 className="iq-h1 italic">
              {t('Octave vit ici.', 'Octave lives here.')}
            </h2>
            <blockquote className="font-[family-name:var(--font-display)] italic text-foreground/90 text-[22px] sm:text-[26px] leading-relaxed mt-8 max-w-2xl mx-auto">
              {t(
                '« Je ne note pas les vins. Je connais les vôtres. Dites-moi le repas et le moment — je m’occupe de la bouteille. »',
                '“I don’t score wines. I know yours. Tell me the meal and the moment — I’ll take care of the bottle.”',
              )}
            </blockquote>
            <p className="font-[family-name:var(--font-display)] italic text-or text-xl sm:text-2xl mt-8">
              {t(
                'Dites-moi le moment. Je trouve la bouteille.',
                "Tell me the moment. I'll find the bottle.",
              )}
            </p>
          </FadeInOnScroll>
        </div>
      </SectionWrapper>

      {/* CONÇU ICI, POUR ICI */}
      <SectionWrapper withDivider rhythm="standard">
        <div className="mx-auto max-w-3xl text-center">
          <FadeInOnScroll>
            <p className="iq-eyebrow mb-5">{t('Conçu ici, pour ici', 'Built here, for here')}</p>
            <h2 className="iq-h1 italic">
              {t('Conçu ici. Pour ici.', 'Built here. For here.')}
            </h2>
            <p className="iq-lead mt-7 max-w-2xl mx-auto">
              {t(
                'iQWine est conçu au Québec et hébergé au Canada. Vos données ne sont ni revendues, ni utilisées contre vous. Et parce qu’on connaît la SAQ comme aucune application étrangère ne le pourra, iQWine sait quelle bouteille est en tablette, à votre succursale, partout au Québec. Le vin se vit localement. Votre sommelier aussi.',
                'iQWine is built in Québec and hosted in Canada. Your data is neither sold, nor used against you. And because we know the SAQ as no foreign app ever could, iQWine knows which bottle is on the shelf, at your branch, across Québec. Wine is lived locally. So is your sommelier.',
              )}
            </p>
          </FadeInOnScroll>
        </div>
      </SectionWrapper>

      {/* LE MOT DU FONDATEUR */}
      <SectionWrapper tone="light" withDivider rhythm="standard">
        <div className="mx-auto max-w-3xl">
          <FadeInOnScroll>
            <div className="text-center mb-10">
              <p className="iq-eyebrow mb-5">{t('Le mot du fondateur', 'A word from the founder')}</p>
            </div>
            {/* Note fondateur — verbatim de conviction à confirmer par Éric ; une vraie photo du fondateur pourra être ajoutée ici quand dispo. */}
            <figure className="rounded-2xl border border-or/15 bg-or/[0.03] p-8 lg:p-12 text-center">
              <blockquote className="font-[family-name:var(--font-display)] italic text-foreground/90 text-[21px] sm:text-[24px] leading-relaxed max-w-2xl mx-auto">
                {t(
                  '« Je n’ai pas voulu construire une application de plus. Je voulais une cave qui se souvienne — et un sommelier qui en tire la bonne bouteille, au bon moment. C’est tout ce qu’on construit. »',
                  '“I didn’t set out to build one more app. I wanted a cellar that remembers — and a sommelier who draws the right bottle from it, at the right moment. That is all we build.”',
                )}
              </blockquote>
              <figcaption className="mt-8 font-mono text-[11px] tracking-[0.14em] uppercase text-foreground-faint">
                {t(
                  'Éric · Fondateur, iQWine',
                  'Éric · Founder, iQWine',
                )}
              </figcaption>
            </figure>
          </FadeInOnScroll>
        </div>
      </SectionWrapper>

      {/* SCEAU DE CLÔTURE */}
      <SectionWrapper withDivider rhythm="editorial">
        <div className="mx-auto max-w-3xl text-center">
          <FadeInOnScroll>
            <p className="font-[family-name:var(--font-display)] italic text-or text-4xl sm:text-5xl lg:text-6xl leading-tight">
              {t('Une cave qui se souvient.', 'A cellar that remembers.')}
            </p>
            <div className="mt-12 flex flex-col items-center gap-3">
              <a
                href={buildSignupUrl('notre-maison', { lang: locale })}
                onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'notre-maison' })}
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
        </div>
      </SectionWrapper>
    </main>
  );
}
