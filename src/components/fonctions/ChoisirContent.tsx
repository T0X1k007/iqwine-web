'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import FilAriane from '@/components/ui/FilAriane';
import LigneAccord from '@/components/ui/LigneAccord';
import LocaleLink from '@/components/ui/LocaleLink';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import Button from '@/components/ui/Button';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { TRIAL_SHORT } from '@/lib/trial';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { ArrowRight } from 'lucide-react';

/**
 * /choisir-un-vin — « Choisir un vin, sans plus jamais hésiter devant le
 * rayon. » (conception validée avec 3 ajustements, Eric 2026-08-14).
 *
 * La page de la requête la plus LARGE du site : « comment choisir un vin ».
 * Elle absorbe l'ancien pilier /recherche (301). Arc en 5 sections :
 * S1 le moment (ivoire) → S2 l'ancien monde, bref → S3 le compagnon d'achat
 * (climax produit) → S4 nuit, cave + proximité → S5 la résolution, sur la
 * personne.
 *
 * ── Les 3 ajustements d'Eric, contraignants ─────────────────────────────
 * 1. S4 dit le RÉSULTAT, jamais la mécanique : pas d'ordre des opérations,
 *    pas de « vérifié point de vente par point de vente », pas de priorité
 *    cave/proximité décrite. Titre et texte fournis par Eric, quasi tels
 *    quels.
 * 2. AUCUNE revendication d'exclusivité, nulle part. Le fil rouge (la
 *    relation, l'apprentissage du palais) guide l'écriture sans être répété.
 * 3. La conclusion porte sur la PERSONNE : « La bonne bouteille existe.
 *    Celle qui vous ressemble. » L'arc de la page : de « quel est le
 *    meilleur vin ? » à « quel est le bon vin pour moi ? ».
 *
 * Protection du produit — RÈGLE CORRIGÉE (Eric, 2026-08-14) : la frontière
 * est PREUVE PRODUIT = OUI, DOCUMENTATION DU WORKFLOW = NON. Les captures
 * STATIQUES, fiches, bouteilles et résultats sont des preuves marketing et
 * doivent se voir ; seuls les enregistrements ou animations qui rejouent un
 * parcours complet (saisie → étapes → résultat) et les explications de
 * mécanique interne sont proscrits. D'où, ici : la carte de recommandation
 * de S3 porte une VRAIE bouteille du dépôt, et S4 montre la capture réelle
 * 06-recherche-hors-cave (cave, apogée, disponibilité), un écran de
 * RÉSULTAT, jamais une séquence. Vérité produit (déjà vérifiée au code pour
 * la home S3) : montrer une bouteille ou demander par où commencer ; palais
 * + budget (SommelierSearch.budgetMin/Max) ; le pourquoi en une phrase.
 *
 * Photos : CHOIX-01 (S1, paysage 3:2, la paralysie face au rayon) et
 * CHOIX-02 (S3, portrait 3:4, le geste du compagnon) — exclusives, fournies
 * par Eric le 2026-08-14, converties par le pipeline habituel (AVIF q55 +
 * WebP q76 en 800/1400, JPEG q80 progressif en repli).
 */

export default function ChoisirContent() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <main>
      {/* ══ S1 · LE MOMENT (ivoire) ═════════════════════════════════════ */}
      <section className="mouvement-jour relative" style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-8 lg:px-8 lg:pb-14 lg:pt-10">
          <FilAriane
            elements={[
              { label: t('Accueil', 'Home'), href: '/' },
              { label: t('Fonctions', 'Features'), href: '/fonctions' },
              { label: t('Choisir un vin', 'Choosing a wine') },
            ]}
          />
          <div className="mt-9 grid items-center gap-10 lg:grid-cols-[0.52fr_0.48fr] lg:gap-14">
            <div>
              <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
                {t('Choisir un vin', 'Choosing a wine')}
              </p>
              <h1
                className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(32px, 4.8vw, 58px)' }}
              >
                {t('Choisir un vin,', 'Choosing a wine,')}
                <br />
                <span className="text-bordeaux-jour">
                  {t(
                    'sans plus jamais hésiter devant le rayon.',
                    'without ever hesitating in front of the shelf again.',
                  )}
                </span>
              </h1>
              <p className="mt-5 max-w-[52ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">
                {t(
                  'Des centaines d’étiquettes, toutes prometteuses. Elles parlent à tout le monde ; aucune ne vous connaît.',
                  'Hundreds of labels, all promising. They speak to everyone; none of them knows you.',
                )}
              </p>
            </div>
            {/* CHOIX-01 (photo d'Eric, 2026-08-14) : la paralysie du choix,
                vécue de l'intérieur — seul, de dos, face au rayon. */}
            <FadeInOnScroll delay={0.1}>
              <figure className="overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                <picture>
                  <source type="image/avif" srcSet="/photos/lifestyle/choisir-rayon-800.avif 800w, /photos/lifestyle/choisir-rayon-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 46vw" />
                  <source type="image/webp" srcSet="/photos/lifestyle/choisir-rayon-800.webp 800w, /photos/lifestyle/choisir-rayon-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 46vw" />
                  <img
                    src="/photos/lifestyle/choisir-rayon.jpg"
                    alt={t(
                      'Une personne seule, de dos, immobile devant un grand rayon de vins à la lumière chaleureuse.',
                      'A person alone, seen from behind, standing still in front of a large wine shelf in warm light.',
                    )}
                    width={1536}
                    height={1024}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="h-auto w-full"
                  />
                </picture>
              </figure>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ══ S2 · L'ANCIEN MONDE (ivoire, bref) ══════════════════════════ */}
      <section id="reperes" className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-[680px] text-center">
            <FadeInOnScroll>
              <h2
                className="font-[family-name:var(--font-display)] font-medium leading-[1.12] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(26px, 3.6vw, 42px)' }}
              >
                {t('Les repères habituels notent le vin. ', 'The usual signposts rate the wine. ')}
                <span className="text-bordeaux-jour">{t('Jamais votre goût.', 'Never your taste.')}</span>
              </h2>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.08}>
              <div className="mx-auto mt-6 max-w-[52ch] space-y-3 text-[16px] leading-relaxed text-encre-2 md:text-[17px]">
                <p>
                  {t(
                    'La note moyenne dit ce que le monde a aimé. Le monde n’est pas vous.',
                    'An average score says what the world liked. The world isn’t you.',
                  )}
                </p>
                <p>
                  {t(
                    'Les listes de « meilleurs vins » sont les mêmes pour tout le monde.',
                    'Lists of “best wines” are the same for everyone.',
                  )}
                </p>
                <p>
                  {t(
                    'Et la plus belle étiquette reste un pari, mieux habillé.',
                    'And the prettiest label is still a gamble, better dressed.',
                  )}
                </p>
              </div>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.14}>
              <p className="mx-auto mt-7 max-w-[40ch] font-[family-name:var(--font-display)] text-[19px] italic leading-snug text-encre md:text-[21px]">
                {t(
                  'Ce qui manque, ce n’est pas un avis de plus. C’est quelqu’un qui connaît votre palais.',
                  'What’s missing isn’t one more opinion. It’s someone who knows your palate.',
                )}
              </p>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ══ S3 · LE COMPAGNON D'ACHAT (ivoire, climax produit) ══════════ */}
      <section id="compagnon" className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto grid max-w-[1060px] items-center gap-10 lg:grid-cols-[0.56fr_0.44fr] lg:gap-14">
            <div>
              <FadeInOnScroll>
                <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
                  {t('En magasin', 'In the store')}
                </p>
                <h2
                  className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
                  style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}
                >
                  {t('Votre compagnon d’achat, ', 'Your shopping companion, ')}
                  <span className="text-bordeaux-jour">
                    {t('dans l’allée des vins.', 'right in the wine aisle.')}
                  </span>
                </h2>
                <p className="mt-4 max-w-[50ch] text-[16px] leading-relaxed text-encre-2 md:text-[17px]">
                  {t(
                    'Montrez une bouteille à Octave, ou demandez-lui par où commencer. Il met en évidence celles qui correspondent à votre palais et à votre budget, et vous dit pourquoi, en une phrase.',
                    'Show Octave a bottle, or ask him where to start. He highlights the ones that match your palate and your budget, and tells you why, in one sentence.',
                  )}
                </p>
              </FadeInOnScroll>
              <FadeInOnScroll delay={0.12}>
                {/* La preuve : une VRAIE bouteille proposée, avec le pourquoi
                    en une phrase — le résultat que l'utilisateur obtient,
                    jamais le chemin pour y arriver. */}
                <figure className="mt-6 max-w-[440px] rounded-[16px] border border-or-jour/30 bg-[#fdfaf3] p-5 shadow-[0_24px_60px_-32px_rgba(36,27,20,0.35)]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-encre-3">
                      <OctaveAnneau size={15} className="text-or-jour" />
                      {t('Bouteille proposée', 'Suggested bottle')}
                    </span>
                    <span className="rounded-full bg-or-jour/12 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-or-jour">
                      {t('Pour votre palais', 'For your palate')}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element -- bouteille détourée du dépôt, WebP léger */}
                    <img
                      src="/photos/wines/castello-ama.webp"
                      alt=""
                      width={1000}
                      height={1500}
                      loading="lazy"
                      decoding="async"
                      className="h-[104px] w-auto drop-shadow-[0_10px_18px_rgba(60,38,18,0.28)] sm:h-[112px]"
                      draggable={false}
                    />
                    <div className="min-w-0">
                      <p className="font-[family-name:var(--font-display)] text-[19px] font-semibold leading-tight text-encre sm:text-[20px]">
                        Chianti Classico
                      </p>
                      <p className="mt-0.5 text-[13px] text-encre-2">Castello di Ama · {t('Toscane', 'Tuscany')}</p>
                      <blockquote className="mt-2.5 font-[family-name:var(--font-display)] text-[14.5px] italic leading-snug text-encre-2 sm:text-[15px]">
                        {t(
                          '« La cerise fraîche et l’acidité vive que votre palais aime. Et dans votre budget. »',
                          '“The fresh cherry and bright acidity your palate loves. And within your budget.”',
                        )}
                      </blockquote>
                    </div>
                  </div>
                </figure>
              </FadeInOnScroll>
            </div>
            {/* CHOIX-02 (photo d'Eric, 2026-08-14) : le geste du compagnon,
                la bouteille en main, le téléphone à moitié cadré, écran non
                lisible. */}
            <FadeInOnScroll delay={0.1}>
              <figure className="mx-auto w-full max-w-[400px] overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                <picture>
                  <source type="image/avif" srcSet="/photos/lifestyle/choisir-geste-800.avif 800w, /photos/lifestyle/choisir-geste-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 400px" />
                  <source type="image/webp" srcSet="/photos/lifestyle/choisir-geste-800.webp 800w, /photos/lifestyle/choisir-geste-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 400px" />
                  <img
                    src="/photos/lifestyle/choisir-geste.jpg"
                    alt={t(
                      'Une main tient une bouteille inclinée devant le rayon, l’autre un téléphone à moitié cadré, écran non lisible.',
                      'One hand holds a tilted bottle in front of the shelf, the other a half-framed phone, its screen unreadable.',
                    )}
                    width={1086}
                    height={1448}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full"
                  />
                </picture>
              </figure>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ══ S4 · CAVE + PROXIMITÉ — le moment nuit ══════════════════════
          Formulation RÉSULTAT (titre et texte d'Eric, 2026-08-14) : le
          visiteur comprend qu'Octave tient compte de ce qu'il possède, peut
          l'aider près de chez lui, et que la disponibilité est vérifiée.
          Jamais comment le moteur décide, cherche, priorise ou enchaîne. */}
      <section
        id="pres-de-vous"
        data-nav-delai="90"
        className="relative overflow-hidden text-foreground"
        style={{
          background:
            'linear-gradient(180deg, var(--color-papier) 0%, #2a1d13 6%, #150f0c 16%, #150f0c 100%)',
        }}
      >
        <div className="relative mx-auto w-[min(480px,72%)] pt-10">
          <LigneAccord variante="inflexion" ton="nuit" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-6 py-12 lg:px-8 lg:py-16">
          <div className="mx-auto grid max-w-[1000px] items-center gap-12 lg:grid-cols-[0.58fr_0.42fr] lg:gap-14">
            <div className="text-center lg:text-left">
              <FadeInOnScroll>
                <h2
                  className="mx-auto max-w-[24ch] font-[family-name:var(--font-display)] font-medium leading-[1.14] tracking-[-0.02em] lg:mx-0"
                  style={{ fontSize: 'clamp(28px, 4.2vw, 48px)' }}
                >
                  {t('La bonne bouteille est peut-être ', 'The right bottle may already be ')}
                  <span className="text-or">
                    {t('déjà plus près que vous pensez.', 'closer than you think.')}
                  </span>
                </h2>
                <p className="mx-auto mt-5 max-w-[50ch] text-[16px] leading-relaxed text-muted-foreground md:text-[17px] lg:mx-0">
                  {t(
                    'Dans votre cave ou près de chez vous, Octave vous aide à trouver une bouteille qui vous ressemble, au moment où vous en avez besoin.',
                    'In your cellar or near you, Octave helps you find a bottle that feels like you, right when you need it.',
                  )}
                </p>
              </FadeInOnScroll>
              <FadeInOnScroll delay={0.12}>
                <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-or/25 bg-[#241a12]/95 px-5 py-2.5 text-left text-[13.5px] tracking-wide text-foreground">
                  <OctaveAnneau size={15} className="shrink-0 text-or" />
                  {t(
                    'Disponible près de vous. Vérifié avant de vous y envoyer.',
                    'Available near you. Verified before sending you out.',
                  )}
                </p>
              </FadeInOnScroll>
            </div>
            {/* LA PREUVE : l'écran réel de l'application (capture STATIQUE,
                un résultat — cave, apogée, disponibilité — jamais une
                séquence). Règle corrigée d'Eric, 2026-08-14. */}
            <FadeInOnScroll delay={0.1}>
              <div>
                <figure className="mx-auto w-[min(230px,64%)] overflow-hidden rounded-[18px] border border-or/20 shadow-[0_34px_80px_-30px_rgba(0,0,0,0.9)]">
                  <picture>
                    <source type="image/avif" srcSet="/screenshots/06-recherche-hors-cave.avif" />
                    <source type="image/webp" srcSet="/screenshots/06-recherche-hors-cave.webp" />
                    <img
                      src="/screenshots/06-recherche-hors-cave.png"
                      alt={t(
                        'Écran réel de l’application : des bouteilles de votre cave, leur apogée et leur disponibilité.',
                        'Real app screen: bottles from your cellar, their peak window and availability.',
                      )}
                      width={638}
                      height={1384}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full"
                    />
                  </picture>
                </figure>
                <p className="mx-auto mt-4 max-w-[30ch] text-center text-[12.5px] leading-relaxed text-foreground-faint">
                  {t(
                    'Ce n’est pas une maquette : c’est l’application, telle quelle.',
                    'This isn’t a mockup: it’s the app, as is.',
                  )}
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ══ S5 · LA RÉSOLUTION — retour au jour, sur la personne ════════ */}
      <section className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 py-14 text-center lg:px-8 lg:py-16">
          <FadeInOnScroll>
            <p
              className="mx-auto max-w-[22ch] font-[family-name:var(--font-display)] font-medium italic leading-[1.2] text-encre"
              style={{ fontSize: 'clamp(26px, 3.8vw, 42px)' }}
            >
              {t('La bonne bouteille existe. ', 'The right bottle exists. ')}
              <span className="text-bordeaux-jour">
                {t('Celle qui vous ressemble.', 'The one that feels like you.')}
              </span>
            </p>
            <p className="mx-auto mt-4 text-[17px] leading-relaxed text-encre-2 md:text-[18px]">
              {t('Octave vous aide à la trouver.', 'Octave helps you find it.')}
            </p>
            <div className="mt-7">
              <a
                href={buildSignupUrl('choisir', { lang: locale })}
                onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'choisir' })}
              >
                <Button variant="primary" size="lg">{t('Rencontrer Octave', 'Meet Octave')}</Button>
              </a>
              <p className="mt-4 text-[13px] tracking-wide text-encre-3">
                {t(`Essai gratuit, ${TRIAL_SHORT.fr} · Sans carte`, `Free trial, ${TRIAL_SHORT.en} · No card required`)}
              </p>
            </div>
            <div className="mx-auto mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[14px]">
              <LocaleLink
                href="/carte-des-vins"
                className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
              >
                {t('La carte, au restaurant', 'The list, at the restaurant')}
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </LocaleLink>
              <LocaleLink
                href="/accord-mets-vins"
                className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
              >
                {t('Le repas, à table', 'The meal, at the table')}
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </LocaleLink>
              <LocaleLink
                href="/cellier-intelligent"
                className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
              >
                {t('Votre cave, sue par cœur', 'Your cellar, known by heart')}
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </LocaleLink>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </main>
  );
}
