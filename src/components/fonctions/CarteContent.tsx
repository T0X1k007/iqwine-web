'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import FilAriane from '@/components/ui/FilAriane';
import LigneAccord from '@/components/ui/LigneAccord';
import LocaleLink from '@/components/ui/LocaleLink';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import OctaveDemoVideo from '@/components/sections/OctaveDemoVideo';
import Button from '@/components/ui/Button';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { TRIAL_SHORT } from '@/lib/trial';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { ArrowRight } from 'lucide-react';

/**
 * /carte-des-vins — « La carte arrive. Et soudain, 80 vins vous regardent. »
 * (conception LOCK + amendements, photos d'Eric, 2026-08-13).
 *
 * La page la plus NOCTURNE du site, assumé : le restaurant se vit le soir.
 * S1 ivoire (l'appréhension est universelle) → S2 la descente → S3 nuit, le
 * cœur (la VIDÉO RÉELLE du scan, climax produit, ne quitte jamais cette
 * page) → S4 nuit courte (la commande) → S5 retour au jour.
 *
 * Amendements respectés : aucun texte web ne dépend de l'espace d'une photo
 * (copy et photographie restent deux objets éditoriaux distincts) ; S3 ne
 * compare aucun produit et ne nomme personne — une moyenne dit le goût des
 * autres, Octave connaît le vôtre, et la vidéo prouve.
 *
 * Vérité produit : photographier une carte des vins → lecture et mise en
 * évidence = capacité réelle, quelle que soit la langue de la carte ; le
 * pourquoi en une phrase ; la vidéo est un enregistrement d'écran réel.
 */

export default function CarteContent() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <main>
      {/* ══ S1 · LA CARTE ARRIVE (ivoire) ═══════════════════════════════ */}
      <section className="mouvement-jour relative" style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-8 lg:px-8 lg:pb-14 lg:pt-10">
          <FilAriane
            elements={[
              { label: t('Accueil', 'Home'), href: '/' },
              { label: t('Fonctions', 'Features'), href: '/fonctions' },
              { label: t('Au restaurant', 'At the restaurant') },
            ]}
          />
          <div className="mt-9 grid items-center gap-10 lg:grid-cols-[0.52fr_0.48fr] lg:gap-14">
            <div>
              <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
                {t('Au restaurant', 'At the restaurant')}
              </p>
              <h1
                className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(32px, 4.8vw, 58px)' }}
              >
                {t('La carte arrive.', 'The list arrives.')}
                <br />
                <span className="text-bordeaux-jour">
                  {t('Et soudain, 80 vins vous regardent.', 'And suddenly, 80 wines are staring at you.')}
                </span>
              </h1>
              <p className="mt-5 max-w-[52ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">
                {t(
                  'Vous en connaissez cinq, peut-être. La table attend, le serveur aussi. Et parfois, la carte n’est même pas dans votre langue.',
                  'You know five of them, maybe. The table is waiting, so is the server. And sometimes the list isn’t even in your language.',
                )}
              </p>
            </div>
            <FadeInOnScroll delay={0.1}>
              <figure className="overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                <picture>
                  <source type="image/avif" srcSet="/photos/lifestyle/carte-examen-800.avif 800w, /photos/lifestyle/carte-examen-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 46vw" />
                  <source type="image/webp" srcSet="/photos/lifestyle/carte-examen-800.webp 800w, /photos/lifestyle/carte-examen-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 46vw" />
                  <img
                    src="/photos/lifestyle/carte-examen.jpg"
                    alt={t(
                      'Vue à la première personne : une carte des vins dense, ouverte à deux mains, dans un restaurant le soir.',
                      'First-person view: a dense wine list held open in two hands, in a restaurant at night.',
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
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ══ S2 · LE GESTE — la descente dans la nuit ════════════════════ */}
      <section
        id="geste"
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
          <div className="mx-auto grid max-w-[1060px] items-center gap-10 lg:grid-cols-[0.58fr_0.42fr] lg:gap-14">
            <div>
              <FadeInOnScroll>
                <h2
                  className="font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em]"
                  style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}
                >
                  {t('Photographiez-la. ', 'Photograph it. ')}
                  <span className="text-or">{t('C’est tout.', 'That’s all.')}</span>
                </h2>
                <p className="mt-4 max-w-[50ch] text-[15.5px] leading-relaxed text-muted-foreground">
                  {t(
                    'Une photo discrète, sous la table s’il le faut. Octave lit la carte : celle de ce restaurant-ci, ce soir, avec ses millésimes et ses prix. Et si elle est en italien ou en allemand, ça ne change rien.',
                    'One discreet photo, under the table if you must. Octave reads the list: this restaurant’s list, tonight, with its vintages and its prices. And if it’s in Italian or German, that changes nothing.',
                  )}
                </p>
              </FadeInOnScroll>
            </div>
            <FadeInOnScroll delay={0.12}>
              <figure className="mx-auto w-[min(210px,64%)] overflow-hidden rounded-[18px] border border-or/20 shadow-[0_34px_80px_-30px_rgba(0,0,0,0.9)]">
                <picture>
                  <source type="image/avif" srcSet="/screenshots/03-menu-scan.avif" />
                  <source type="image/webp" srcSet="/screenshots/03-menu-scan.webp" />
                  <img
                    src="/screenshots/03-menu-scan.png"
                    alt={t('La carte des vins photographiée, lue par iQWine.', 'The wine list photographed, read by iQWine.')}
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
      </section>

      {/* ══ S3 · LA LECTURE — nuit, le cœur ═════════════════════════════ */}
      <section id="lecture" className="relative overflow-hidden text-foreground" style={{ background: '#150f0c' }}>
        <div className="relative mx-auto max-w-[1440px] px-6 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-[760px] text-center">
            <FadeInOnScroll>
              <h2
                className="font-[family-name:var(--font-display)] font-medium leading-[1.12] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(30px, 4.4vw, 52px)' }}
              >
                {t('Il ne lit pas la carte. ', 'He doesn’t read the list. ')}
                <span className="text-or">{t('Il la lit pour vous.', 'He reads it for you.')}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-[54ch] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
                {t(
                  'Deux ou trois vins ressortent, avec le pourquoi en une phrase. Une note moyenne dit ce que le monde a aimé ; Octave, lui, sait ce que VOUS aimez, et ce que vous mangez ce soir.',
                  'Two or three wines stand out, with the why in one sentence. An average score tells you what the world liked; Octave knows what YOU like, and what you’re eating tonight.',
                )}
              </p>
            </FadeInOnScroll>
          </div>

          {/* LA PREUVE MAÎTRESSE : l'enregistrement d'écran réel. */}
          <FadeInOnScroll delay={0.12}>
            <div className="mt-10">
              <OctaveDemoVideo locale={locale} />
              <p className="mx-auto mt-5 max-w-[46ch] text-center text-[13px] leading-relaxed text-foreground-faint">
                {t(
                  'Ce n’est pas une animation : c’est l’application, enregistrée telle quelle.',
                  'This isn’t an animation: it’s the app, recorded as is.',
                )}
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ══ S4 · LA COMMANDE — nuit, courte ═════════════════════════════ */}
      <section id="commande" className="relative overflow-hidden text-foreground" style={{ background: '#150f0c' }}>
        <div className="relative mx-auto max-w-[1440px] px-6 pb-14 pt-6 lg:px-8 lg:pb-16">
          <div className="mx-auto grid max-w-[1060px] items-center gap-10 lg:grid-cols-[0.5fr_0.5fr] lg:gap-14">
            <FadeInOnScroll>
              <figure className="overflow-hidden rounded-[18px] border border-or/15 shadow-[0_34px_80px_-30px_rgba(0,0,0,0.9)]">
                <picture>
                  <source type="image/avif" srcSet="/photos/lifestyle/carte-soiree-800.avif 800w, /photos/lifestyle/carte-soiree-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 46vw" />
                  <source type="image/webp" srcSet="/photos/lifestyle/carte-soiree-800.webp 800w, /photos/lifestyle/carte-soiree-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 46vw" />
                  <img
                    src="/photos/lifestyle/carte-soiree.jpg"
                    alt={t(
                      'Le vin choisi est versé au restaurant ; la carte des vins, refermée, repose au coin de la table.',
                      'The chosen wine is poured at the restaurant; the wine list, closed, rests at the corner of the table.',
                    )}
                    width={1200}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full"
                  />
                </picture>
              </figure>
            </FadeInOnScroll>
            <div>
              <FadeInOnScroll>
                <h2
                  className="font-[family-name:var(--font-display)] font-medium leading-[1.12] tracking-[-0.02em]"
                  style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}
                >
                  {t('Commandez ', 'Order ')}
                  <span className="text-or">{t('avec aplomb.', 'with confidence.')}</span>
                </h2>
                <p className="mt-4 max-w-[48ch] text-[15.5px] leading-relaxed text-muted-foreground">
                  {t(
                    'Vous refermez la carte, vous nommez votre choix, la conversation reprend. Le vin qui arrive n’est pas le plus populaire de la carte : c’est le vôtre.',
                    'You close the list, you name your choice, the conversation resumes. The wine that arrives isn’t the list’s most popular: it’s yours.',
                  )}
                </p>
              </FadeInOnScroll>
              <FadeInOnScroll delay={0.12}>
                <figure className="mt-6 rounded-[16px] border border-or/25 bg-[#241a12]/95 px-5 py-4">
                  <blockquote className="font-[family-name:var(--font-display)] text-[16.5px] italic leading-snug text-foreground sm:text-[18px]">
                    {t(
                      '« Le Chablis 2021, à 78 $ : la minéralité que votre palais réclame, et il tiendra tête à vos huîtres. »',
                      '“The 2021 Chablis, at $78: the minerality your palate craves, and it will stand up to your oysters.”',
                    )}
                  </blockquote>
                  <figcaption className="mt-2.5 inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.22em] text-or">
                    <OctaveAnneau size={14} className="text-or" />
                    Octave
                  </figcaption>
                </figure>
              </FadeInOnScroll>
              <FadeInOnScroll delay={0.18}>
                <LocaleLink
                  href="/accord-mets-vins"
                  className="mt-6 inline-flex items-center gap-2 text-[14.5px] font-medium text-or transition-colors hover:text-or-soft"
                >
                  {t('Et le plat, lui ?', 'And the dish?')}
                  <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
                </LocaleLink>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S5 · L'ACTION — retour au jour ══════════════════════════════ */}
      <section className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 py-14 text-center lg:px-8 lg:py-16">
          <FadeInOnScroll>
            <p
              className="mx-auto max-w-[24ch] font-[family-name:var(--font-display)] font-medium italic leading-[1.2] text-encre"
              style={{ fontSize: 'clamp(26px, 3.8vw, 42px)' }}
            >
              {t('Votre sommelier est déjà à table.', 'Your sommelier is already at the table.')}
            </p>
            <div className="mt-7">
              <a
                href={buildSignupUrl('carte', { lang: locale })}
                onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'carte' })}
              >
                <Button variant="primary" size="lg">{t('Rencontrer Octave', 'Meet Octave')}</Button>
              </a>
              <p className="mt-4 text-[13px] tracking-wide text-encre-3">
                {t(`Essai gratuit, ${TRIAL_SHORT.fr} · Sans carte`, `Free trial, ${TRIAL_SHORT.en} · No card required`)}
              </p>
            </div>
            <div className="mx-auto mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[14px]">
              <LocaleLink
                href="/accord-mets-vins"
                className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
              >
                {t('Les accords mets-vins', 'Wine pairing')}
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </LocaleLink>
              <LocaleLink
                href="/sommelier-ia"
                className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
              >
                {t('Comment Octave vous connaît', 'How Octave knows you')}
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </LocaleLink>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </main>
  );
}
