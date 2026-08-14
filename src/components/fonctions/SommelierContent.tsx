'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useInView } from 'framer-motion';
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
import { ArrowRight, ArrowUpRight } from 'lucide-react';

/**
 * /sommelier-ia — REFONTE (conception LOCK avec corrections S4 + S2,
 * Eric 2026-08-13). La page de la RELATION : qui est Octave, et pourquoi ses
 * conseils deviennent personnels avec le temps.
 *
 * S1 qui il est (ivoire) → S2 la différence (« Même question. Deux
 * réponses. », la voix qui s'écrit = « construite pour vous ») → S3
 * l'apprentissage (Jour 1/Mois 3/Mois 12 + carnet + suggestions, les vraies
 * captures) → S4 la cohérence (nuit : calculé, explicable, jamais
 * « immuable ») → S5 l'honnêteté (nuit courte : dire non, limites,
 * indépendance, lien vérifiable) → S6 l'action (retour au jour).
 *
 * Vérité produit : profil nourri par les dégustations notées (tous les
 * forfaits) ; choix calculés et explicables — Octave peut changer d'avis
 * quand il apprend, jamais au hasard ; il sait dire non ; admet ses
 * limites ; iQWine ne vend pas de vin. Aucun « propulsé par l'IA ».
 */

/** La voix qui s'écrit — fail-visible : texte complet sans JS / reduced. */
function TypeVoix({ texte, actif }: { texte: string; actif: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!actif) return;
    setN(0);
    const id = setInterval(() => {
      setN((v) => {
        if (v >= texte.length) {
          clearInterval(id);
          return v;
        }
        return v + 2;
      });
    }, 36);
    return () => clearInterval(id);
  }, [actif, texte]);
  return <>{actif ? texte.slice(0, n) : texte}</>;
}

export default function SommelierContent() {
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  // Déclenchement de la voix : montée + entrée au viewport + motion permise.
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  const refVoix = useRef<HTMLDivElement>(null);
  const enVue = useInView(refVoix, { once: true, margin: '0px 0px -18% 0px' });
  const voixActive = monte && !reduced && enVue;

  const reponseOctave = t(
    'Votre Chianti de 2022 : votre palais aime son fruit net, et il accompagnera vos pâtes de ce soir. Rangée 2, case 5.',
    'Your 2022 Chianti: your palate loves its clean fruit, and it will carry tonight’s pasta. Row 2, slot 5.',
  );

  return (
    <main>
      {/* ══ S1 · QUI IL EST (ivoire) ════════════════════════════════════ */}
      <section className="mouvement-jour relative" style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-8 lg:px-8 lg:pb-14 lg:pt-10">
          <FilAriane
            elements={[
              { label: t('Accueil', 'Home'), href: '/' },
              { label: t('Octave, sommelier IA', 'Octave, AI sommelier') },
            ]}
          />
          <div className="mt-9 grid items-center gap-10 lg:grid-cols-[0.5fr_0.5fr] lg:gap-14">
            <div>
              <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
                {t('Rencontrez Octave', 'Meet Octave')}
              </p>
              <h1
                className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}
              >
                {t('Le sommelier qui apprend', 'The sommelier who learns')}
                <br />
                <span className="text-bordeaux-jour">{t('votre goût.', 'your taste.')}</span>
              </h1>
              <p className="mt-5 max-w-[52ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">
                {t(
                  'Un sommelier connaît les vins. Octave apprend à connaître vos goûts, votre palais et ce qui vous fait vraiment aimer une bouteille. Pas un chatbot, pas une note moyenne : quelqu’un qui se souvient de vous.',
                  'A sommelier knows wine. Octave gets to know your taste, your palate, and what truly makes you love a bottle. Not a chatbot, not an average score: someone who remembers you.',
                )}
              </p>
            </div>
            <FadeInOnScroll delay={0.1}>
              <div className="relative">
                <figure className="overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                  <picture>
                    <source type="image/avif" srcSet="/photos/lifestyle/octave-conversation-800.avif 800w, /photos/lifestyle/octave-conversation-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 46vw" />
                    <source type="image/webp" srcSet="/photos/lifestyle/octave-conversation-800.webp 800w, /photos/lifestyle/octave-conversation-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 46vw" />
                    <img
                      src="/photos/lifestyle/octave-conversation.jpg"
                      alt={t(
                        'En fin de journée, une personne détendue dans un fauteuil échange avec Octave, un verre à peine entamé à côté.',
                        'At dusk, someone relaxed in an armchair chats with Octave, a barely touched glass nearby.',
                      )}
                      width={1200}
                      height={800}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-auto w-full"
                    />
                  </picture>
                </figure>
                {/* La voix d'Octave, posée dans l'espace calme de la photo. */}
                <div className="relative z-[1] mx-4 -mt-10 sm:absolute sm:right-4 sm:top-6 sm:mx-0 sm:mt-0 sm:w-[min(300px,52%)]">
                  <figure className="rounded-[16px] border border-encre/10 bg-[#fdfaf3]/97 px-4 py-3.5 shadow-[0_24px_60px_-24px_rgba(36,27,20,0.55)]">
                    <blockquote className="font-[family-name:var(--font-display)] text-[14.5px] italic leading-snug text-encre sm:text-[15.5px]">
                      {t(
                        '« Le Barolo attend encore un an. Pour ce soir, j’ai mieux, et il est déjà chez vous. »',
                        '“The Barolo needs another year. For tonight I have better, and it’s already at home.”',
                      )}
                    </blockquote>
                    <figcaption className="mt-2 inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-or-jour">
                      <OctaveAnneau size={13} className="text-or-jour" />
                      Octave
                    </figcaption>
                  </figure>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ══ S2 · LA DIFFÉRENCE (ivoire) ═════════════════════════════════ */}
      <section className="mouvement-jour relative" id="difference">
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-[1060px]">
            <FadeInOnScroll>
              <h2
                className="text-center font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(28px, 4.2vw, 50px)' }}
              >
                {t('Même question. ', 'Same question. ')}
                <span className="text-bordeaux-jour">{t('Deux réponses.', 'Two answers.')}</span>
              </h2>
              <p className="mx-auto mt-3 max-w-[52ch] text-center text-[15.5px] leading-relaxed text-encre-2">
                {t('« Un vin pour ce soir, avec des pâtes ? »', '“A wine for tonight, with pasta?”')}
              </p>
            </FadeInOnScroll>

            <div ref={refVoix} className="mt-9 grid gap-5 lg:grid-cols-2 lg:gap-8">
              {/* L'assistant générique — d'un bloc, terne. */}
              <FadeInOnScroll>
                <div className="flex h-full flex-col rounded-[16px] border border-encre/8 bg-papier-2/70 p-6">
                  <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-encre-3">
                    {t('Un assistant générique', 'A generic assistant')}
                  </p>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-encre-3">
                    {t(
                      '« Avec des pâtes, un rouge italien est un choix populaire. Le Chianti, le Barbera ou le Montepulciano plaisent au plus grand nombre. »',
                      '“With pasta, an Italian red is a popular choice. Chianti, Barbera or Montepulciano please most people.”',
                    )}
                  </p>
                  <p className="mt-auto pt-4 text-[12.5px] italic text-encre-3/70">
                    {t('Une réponse pour tout le monde. Donc pour personne.', 'An answer for everyone. So for no one.')}
                  </p>
                </div>
              </FadeInOnScroll>

              {/* Octave — la réponse qui s'écrit : construite POUR VOUS. */}
              <FadeInOnScroll delay={0.08}>
                <div className="flex h-full flex-col rounded-[16px] border border-or-jour/30 bg-[#fdfaf3] p-6 shadow-[0_24px_60px_-30px_rgba(60,38,18,0.4)]">
                  <p className="inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.2em] text-or-jour">
                    <OctaveAnneau size={14} className="text-or-jour" />
                    Octave
                  </p>
                  <p className="mt-3 min-h-[72px] font-[family-name:var(--font-display)] text-[17px] italic leading-snug text-encre sm:text-[18px]">
                    {t('« ', '“')}
                    <TypeVoix texte={reponseOctave} actif={voixActive} />
                    {t(' »', '”')}
                  </p>
                  <p className="mt-auto pt-4 text-[12.5px] text-encre-2">
                    {t('Construite pour vous : votre palais, votre cave, votre soir.', 'Built for you: your palate, your cellar, your evening.')}
                  </p>
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S3 · L'APPRENTISSAGE (ivoire) ═══════════════════════════════ */}
      <section className="mouvement-jour relative" id="apprentissage">
        {/* Rythme mobile compacté (micro-passe, Eric 2026-08-13) : toutes les
            étapes restent, seuls les espacements, corps secondaires et la
            taille de la preuve finale se resserrent sous lg. */}
        <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-[1060px]">
            <FadeInOnScroll>
              <h2
                className="max-w-[26ch] font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}
              >
                {t('Chaque dégustation ', 'Every tasting ')}
                <span className="text-bordeaux-jour">{t('lui apprend quelque chose.', 'teaches him something.')}</span>
              </h2>
              <p className="mt-4 max-w-[58ch] text-[15.5px] leading-relaxed text-encre-2">
                {t(
                  'Vous notez ce que vous avez pensé d’une bouteille ; votre profil de goût s’affine ; et les conseils suivants vous ressemblent un peu plus. Sur tous les forfaits : apprendre votre palais n’est pas une option, c’est le produit.',
                  'You note what you thought of a bottle; your taste profile sharpens; and the next recommendations resemble you a little more. On every plan: learning your palate isn’t an option, it’s the product.',
                )}
              </p>
            </FadeInOnScroll>

            <div className="mt-6 grid items-start gap-5 lg:mt-9 lg:grid-cols-[0.58fr_0.42fr] lg:gap-12">
              <FadeInOnScroll>
                <div className="relative">
                  <figure className="overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                    <picture>
                      <source type="image/avif" srcSet="/photos/lifestyle/octave-note-800.avif 800w, /photos/lifestyle/octave-note-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 52vw" />
                      <source type="image/webp" srcSet="/photos/lifestyle/octave-note-800.webp 800w, /photos/lifestyle/octave-note-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 52vw" />
                      <img
                        src="/photos/lifestyle/octave-note.jpg"
                        alt={t(
                          'Après la première gorgée, une main note la dégustation sur le téléphone, verre servi et bouteille ouverte.',
                          'After the first sip, a hand notes the tasting on a phone, glass poured and bottle open.',
                        )}
                        width={1200}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full"
                      />
                    </picture>
                  </figure>
                  {/* La preuve réelle : le carnet, né de ces notes. */}
                  <div className="absolute bottom-3 right-3 w-[104px] overflow-hidden rounded-[10px] border border-encre/10 shadow-[0_18px_44px_-16px_rgba(36,27,20,0.6)] sm:w-[120px]">
                    <picture>
                      <source type="image/avif" srcSet="/screenshots/04-carnet.avif" />
                      <source type="image/webp" srcSet="/screenshots/04-carnet.webp" />
                      <img
                        src="/screenshots/04-carnet.png"
                        alt={t('Le carnet de dégustation dans iQWine.', 'The tasting journal in iQWine.')}
                        width={640}
                        height={1380}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full"
                      />
                    </picture>
                  </div>
                </div>
              </FadeInOnScroll>

              {/* La progression — Jour 1 / Mois 3 / Mois 12. */}
              <div className="flex flex-col gap-2.5 lg:gap-3">
                {[
                  {
                    quand: t('Jour 1', 'Day 1'),
                    quoi: t('Octave vous découvre : quelques questions, vos premières bouteilles.', 'Octave discovers you: a few questions, your first bottles.'),
                    fort: false,
                  },
                  {
                    quand: t('Mois 3', 'Month 3'),
                    quoi: t('Vos dégustations parlent : ce que vous aimez commence à se dessiner.', 'Your tastings speak: what you love starts to take shape.'),
                    fort: false,
                  },
                  {
                    quand: t('Mois 12', 'Month 12'),
                    quoi: t('Ses conseils vous ressemblent : il connaît votre palais mieux que vos invités.', 'His advice resembles you: he knows your palate better than your guests do.'),
                    fort: true,
                  },
                ].map((e, i) => (
                  <FadeInOnScroll key={e.quand} delay={0.08 * i}>
                    <div
                      className={`rounded-[14px] border p-4 lg:p-5 ${
                        e.fort
                          ? 'border-or-jour/40 bg-or-jour/[0.07]'
                          : 'border-encre/8 bg-[#fdfaf3]'
                      }`}
                    >
                      <p className={`text-[11px] font-medium uppercase tracking-[0.2em] ${e.fort ? 'text-or-jour' : 'text-encre-3'}`}>
                        {e.quand}
                      </p>
                      <p className="mt-1 text-[13.5px] leading-snug text-encre-2 lg:text-[14.5px]">{e.quoi}</p>
                    </div>
                  </FadeInOnScroll>
                ))}
                <FadeInOnScroll delay={0.26}>
                  <figure className="mx-auto mt-1 w-[min(124px,44%)] overflow-hidden rounded-[12px] lg:mt-2 lg:w-[min(150px,60%)] border border-encre/10 shadow-[0_18px_44px_-18px_rgba(36,27,20,0.45)]">
                    <picture>
                      <source type="image/avif" srcSet="/screenshots/02-home-suggestions.avif" />
                      <source type="image/webp" srcSet="/screenshots/02-home-suggestions.webp" />
                      <img
                        src="/screenshots/02-home-suggestions.png"
                        alt={t('Les suggestions personnelles d’Octave dans iQWine.', 'Octave’s personal suggestions in iQWine.')}
                        width={640}
                        height={1380}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full"
                      />
                    </picture>
                  </figure>
                </FadeInOnScroll>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S4 · LA COHÉRENCE — la nuit du conseil ══════════════════════ */}
      <section
        id="coherence"
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
        <div className="relative mx-auto max-w-[1440px] px-6 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-[760px] text-center">
            <FadeInOnScroll>
              <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or">
                {t('Au moment du service', 'When the advice is poured')}
              </p>
              <h2
                className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.12] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(30px, 4.4vw, 52px)' }}
              >
                {t('Des choix calculés. ', 'Computed choices. ')}
                <span className="text-or">{t('Jamais improvisés.', 'Never improvised.')}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-[56ch] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
                {t(
                  'Même contexte, même logique : chaque conseil peut s’expliquer. Et quand Octave change d’avis, c’est qu’il a appris quelque chose, une dégustation notée, une bouteille entrée, une fenêtre qui avance. Jamais au hasard.',
                  'Same context, same logic: every recommendation can be explained. And when Octave changes his mind, it’s because he learned something, a rated tasting, a new bottle, a window moving. Never at random.',
                )}
              </p>
            </FadeInOnScroll>
          </div>

          {/* La grande recommandation — la preuve, avec ses repères réels. */}
          <FadeInOnScroll delay={0.12}>
            <figure className="mx-auto mt-10 max-w-3xl rounded-2xl border border-or/15 bg-or/[0.03] p-7 lg:p-10">
              <div className="flex items-start gap-4">
                <OctaveAnneau size={32} className="shrink-0 text-or" />
                <blockquote>
                  {/* Hiérarchie (micro-passe) : 1. LA recommandation respire ·
                      2. le pourquoi la porte · toujours la voix d'Octave. */}
                  <p className="font-[family-name:var(--font-display)] text-[21px] italic leading-snug text-foreground sm:text-[24px]">
                    {t(
                      '« Ce Châteauneuf-du-Pape, ce soir, avec votre carré d’agneau aux herbes. »',
                      '“This Châteauneuf-du-Pape, tonight, with your herb-crusted rack of lamb.”',
                    )}
                  </p>
                  <p className="mt-4 font-[family-name:var(--font-display)] text-[16px] italic leading-relaxed text-foreground/80 sm:text-[17px]">
                    {t(
                      '« Il traverse une magnifique phase d’expression : la mûre, la garrigue et les épices douces se posent sur des tanins fondus. Il tiendra tête à un plateau de fromages affinés. Exceptionnel ce soir, encore plus complexe d’ici deux à trois ans, carafez-le une heure. »',
                      '“It’s in a beautiful phase of expression: blackberry, garrigue and sweet spice settle over melted tannins. It will stand up to aged cheeses. Exceptional tonight, more complex still in two to three years, decant it for an hour.”',
                    )}
                  </p>
                </blockquote>
              </div>
              <figcaption className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 border-t border-white/10 pt-5 sm:grid-cols-4">
                {[
                  { l: t('Apogée', 'Peak'), v: t('maintenant → 2 ans', 'now → 2 yrs') },
                  { l: t('Corps', 'Body'), v: t('ample', 'full') },
                  { l: t('Tanins', 'Tannins'), v: t('fondus', 'melted') },
                  { l: t('Acidité', 'Acidity'), v: t('fraîche', 'fresh') },
                ].map((r) => (
                  <span key={r.l} className="block">
                    <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-foreground-faint">{r.l}</span>
                    <span className="mt-0.5 block text-[13.5px] text-foreground-dim">{r.v}</span>
                  </span>
                ))}
              </figcaption>
            </figure>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ══ S5 · L'HONNÊTETÉ — nuit, courte ═════════════════════════════ */}
      <section className="relative overflow-hidden text-foreground" style={{ background: '#150f0c' }} id="honnetete">
        <div className="relative mx-auto max-w-[1440px] px-6 pb-14 pt-4 lg:px-8 lg:pb-16">
          <div className="mx-auto max-w-[1060px]">
            <FadeInOnScroll>
              <h2
                className="max-w-[30ch] font-[family-name:var(--font-display)] font-medium leading-[1.14] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(26px, 3.8vw, 42px)' }}
              >
                {t('La confiance vient aussi de ', 'Trust also comes from ')}
                <span className="text-or">{t('ce qu’il ne fait pas.', 'what he doesn’t do.')}</span>
              </h2>
            </FadeInOnScroll>

            <div className="mt-8 grid gap-5 lg:grid-cols-[0.55fr_0.45fr] lg:gap-12">
              <div className="space-y-4">
                {[
                  {
                    fr: 'Il sait dire non. Si aucune bouteille de votre cave ne mérite le plat, il le dit, et vous indique quoi chercher.',
                    en: 'He knows how to say no. If no bottle in your cellar deserves the dish, he says so, and tells you what to look for.',
                  },
                  {
                    fr: 'Il admet ses limites. Quand une donnée lui manque, il préfère le silence à l’invention.',
                    en: 'He admits his limits. When data is missing, he prefers silence to invention.',
                  },
                  {
                    fr: 'iQWine ne vend pas de vin. Aucun placement, aucune commission : ses conseils ne servent que vous.',
                    en: 'iQWine sells no wine. No placement, no commission: his advice serves only you.',
                  },
                ].map((l, i) => (
                  <FadeInOnScroll key={l.fr} delay={0.07 * i}>
                    <p className="border-b border-white/10 pb-4 text-[15.5px] leading-relaxed text-muted-foreground">
                      {t(l.fr, l.en)}
                    </p>
                  </FadeInOnScroll>
                ))}
                <FadeInOnScroll delay={0.24}>
                  <a
                    href="https://app.iqwine.ai/octave-verifiable"
                    className="inline-flex items-center gap-2 text-[13.5px] font-medium text-or transition-colors hover:text-or-soft"
                  >
                    {t('Octave vérifiable : voir sur quoi il s’appuie', 'Verifiable Octave: see what his advice stands on')}
                    <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
                  </a>
                </FadeInOnScroll>
              </div>
              <FadeInOnScroll delay={0.12}>
                <figure className="rounded-[16px] border border-or/25 bg-[#241a12]/95 px-5 py-4">
                  <blockquote className="font-[family-name:var(--font-display)] text-[16.5px] italic leading-snug text-foreground sm:text-[18px]">
                    {t(
                      '« Pour vos huîtres, rien dans votre cave ne rendra justice au plat. Un Muscadet sur lie ferait mieux : en voici trois, disponibles près de vous. »',
                      '“For your oysters, nothing in your cellar will do the dish justice. A Muscadet sur lie would serve you better: here are three, available near you.”',
                    )}
                  </blockquote>
                  <figcaption className="mt-2.5 inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.22em] text-or">
                    <OctaveAnneau size={14} className="text-or" />
                    Octave
                  </figcaption>
                </figure>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S6 · L'ACTION — retour au jour ══════════════════════════════ */}
      <section className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 py-14 text-center lg:px-8 lg:py-16">
          <FadeInOnScroll>
            <p
              className="mx-auto max-w-[26ch] font-[family-name:var(--font-display)] font-medium italic leading-[1.2] text-encre"
              style={{ fontSize: 'clamp(26px, 3.8vw, 42px)' }}
            >
              {t('Votre prochaine bouteille vous attend.', 'Your next bottle is waiting for you.')}
            </p>
            <div className="mt-7">
              <a
                href={buildSignupUrl('octave', { lang: locale })}
                onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'octave' })}
              >
                <Button variant="primary" size="lg">{t('Rencontrer Octave', 'Meet Octave')}</Button>
              </a>
              <p className="mt-4 text-[13px] tracking-wide text-encre-3">
                {t(`Essai gratuit, ${TRIAL_SHORT.fr} · Sans carte`, `Free trial, ${TRIAL_SHORT.en} · No card required`)}
              </p>
            </div>
            <div className="mx-auto mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[14px]">
              <LocaleLink
                href="/cellier-intelligent"
                className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
              >
                {t('Il connaît aussi votre cave', 'He also knows your cellar')}
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </LocaleLink>
              <LocaleLink
                href="/accord-mets-vins"
                className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
              >
                {t('Et votre table', 'And your table')}
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </LocaleLink>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </main>
  );
}
