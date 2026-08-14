'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
import { ArrowRight, MapPin } from 'lucide-react';

/**
 * /cellier-intelligent — « Une cave qui se souvient. » (conception validée,
 * photos d'Eric intégrées, 2026-08-13).
 *
 * Cinq sections, la lumière suit le récit :
 *   S1 le problème (ivoire) → S2 le geste (ivoire) → S3 la mémoire (la
 *   descente dans la nuit) → S4 Octave comprend (nuit, courte) → S5 l'action
 *   (retour au jour). CTA transactionnel « Essai gratuit » (page BOFU).
 *
 * Vérité produit, tout vérifié : cinq chemins d'entrée (photo d'étiquette,
 * code-barres, caisse entière, reçu, import), fiche née d'un scan,
 * emplacements section/rangée/case, valeur (magnum au vrai prix, rapport
 * d'assurance), historique par bouteille, multi-caves, lecture hors ligne,
 * fenêtre par millésime ET format. Animation signature : les cases du
 * cellier visuel s'allument (fail-visible, coupée en reduced-motion).
 */

const CHEMINS: { fr: string; en: string }[] = [
  { fr: 'Photographiez l’étiquette : la fiche naît toute seule.', en: 'Photograph the label: the record writes itself.' },
  { fr: 'Scannez le code-barres, quand il y en a un.', en: 'Scan the barcode, when there is one.' },
  { fr: 'Une caisse entière ? Un seul parcours, pas six.', en: 'A whole case? One pass, not six.' },
  { fr: 'Le reçu d’un point de vente pris en charge : tout entre d’un coup.', en: 'A supported store receipt: everything gets in at once.' },
  { fr: 'Une cave déjà en tableur ? Elle s’importe.', en: 'A cellar already in a spreadsheet? It imports.' },
];

/** La vague qui allume les cases du cellier visuel (S3). */
function CellierVisuelAnime({ t }: { t: (fr: string, en: string) => string }) {
  const reduced = useReducedMotion();
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  const anime = monte && !reduced;

  return (
    <figure className="relative overflow-hidden rounded-[16px] border border-or/20 shadow-[0_40px_90px_-36px_rgba(0,0,0,0.9)]">
      <picture>
        <source type="image/avif" srcSet="/screenshots/08-cellier-desktop-1487.avif 1487w, /screenshots/08-cellier-desktop-2974.avif 2974w" sizes="(max-width: 1024px) 100vw, 60vw" />
        <source type="image/webp" srcSet="/screenshots/08-cellier-desktop-1487.webp 1487w, /screenshots/08-cellier-desktop-2974.webp 2974w" sizes="(max-width: 1024px) 100vw, 60vw" />
        <img
          src="/screenshots/08-cellier-desktop.png"
          alt={t('Le cellier visuel d’iQWine : sections, rangées et cases, chaque bouteille à sa place.', 'iQWine’s visual cellar: sections, rows and slots, every bottle in its place.')}
          width={1487}
          height={758}
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
      </picture>
      {/* La vague de mémoire : un balayage d'or discret traverse les cases. */}
      {anime && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-[34%]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(217, 182, 103, 0.14) 45%, rgba(217, 182, 103, 0.2) 50%, rgba(217, 182, 103, 0.14) 55%, transparent)',
          }}
          initial={{ left: '-36%' }}
          whileInView={{ left: '102%' }}
          viewport={{ once: true, margin: '0px 0px -16% 0px' }}
          transition={{ delay: 0.5, duration: 1.9, ease: [0.32, 0.72, 0.16, 1] }}
        />
      )}
    </figure>
  );
}

export default function CellierContent() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <main>
      {/* ══ S1 · LE PROBLÈME (ivoire) ═══════════════════════════════════ */}
      <section className="mouvement-jour relative" style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-8 lg:px-8 lg:pb-14 lg:pt-10">
          <FilAriane
            elements={[
              { label: t('Accueil', 'Home'), href: '/' },
              { label: t('Fonctions', 'Features'), href: '/fonctions' },
              { label: t('Le cellier', 'The cellar') },
            ]}
          />
          <div className="mt-9 grid items-center gap-10 lg:grid-cols-[0.54fr_0.46fr] lg:gap-14">
            <div>
              <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
                {t('Le cellier intelligent', 'The smart cellar')}
              </p>
              <h1
                className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}
              >
                {t('Vous savez que vous l’avez.', 'You know you have it.')}
                <br />
                <span className="text-bordeaux-jour">{t('Mais où ?', 'But where?')}</span>
              </h1>
              <p className="mt-5 max-w-[54ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">
                {t(
                  'La bouteille qu’on cherche à quatre pattes. La grande qu’on oublie des années. Celle qu’on rachète alors qu’on en avait deux. Une cave, ça déborde vite la mémoire qu’on en a.',
                  'The bottle you hunt for on your knees. The great one you forget for years. The one you buy again when you already had two. A cellar quickly outgrows the memory you keep of it.',
                )}
              </p>
            </div>
            <FadeInOnScroll delay={0.1}>
              <figure className="overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                <picture>
                  <source type="image/avif" srcSet="/photos/lifestyle/cellier-recherche-800.avif 800w, /photos/lifestyle/cellier-recherche-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 44vw" />
                  <source type="image/webp" srcSet="/photos/lifestyle/cellier-recherche-800.webp 800w, /photos/lifestyle/cellier-recherche-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 44vw" />
                  <img
                    src="/photos/lifestyle/cellier-recherche.jpg"
                    alt={t('Accroupi devant son casier, un homme écarte deux bouteilles pour lire une étiquette au fond.', 'Crouched at his rack, a man tilts two bottles apart to read a label at the back.')}
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

      {/* ══ S2 · LE GESTE (ivoire) ══════════════════════════════════════ */}
      <section className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto grid max-w-[1060px] items-center gap-10 lg:grid-cols-[0.46fr_0.54fr] lg:gap-14">
            <FadeInOnScroll className="lg:order-1">
              <figure className="relative overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                <picture>
                  <source type="image/avif" srcSet="/photos/lifestyle/cellier-geste-800.avif 800w, /photos/lifestyle/cellier-geste-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 40vw" />
                  <source type="image/webp" srcSet="/photos/lifestyle/cellier-geste-800.webp 800w, /photos/lifestyle/cellier-geste-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 40vw" />
                  <img
                    src="/photos/lifestyle/cellier-geste.jpg"
                    alt={t('Au comptoir, une main photographie l’étiquette d’une bouteille tout juste rapportée.', 'At the counter, a hand photographs the label of a freshly brought-home bottle.')}
                    width={1200}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full"
                  />
                </picture>
                {/* La preuve : la fiche née du scan, posée sur la scène. */}
                <div className="absolute bottom-3 right-3 w-[112px] overflow-hidden rounded-[10px] border border-encre/10 shadow-[0_18px_44px_-16px_rgba(36,27,20,0.6)] sm:w-[128px]">
                  <picture>
                    <source type="image/avif" srcSet="/screenshots/01-fiche-vin.avif" />
                    <source type="image/webp" srcSet="/screenshots/01-fiche-vin.webp" />
                    <img
                      src="/screenshots/01-fiche-vin.png"
                      alt={t('La fiche complète de la bouteille, créée par le scan.', 'The bottle’s complete record, created by the scan.')}
                      width={640}
                      height={1380}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full"
                    />
                  </picture>
                </div>
              </figure>
            </FadeInOnScroll>
            <div className="lg:order-2">
              <FadeInOnScroll>
                <h2
                  className="font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
                  style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}
                >
                  {t('Votre cave entre ', 'Your cellar gets in ')}
                  <span className="text-bordeaux-jour">{t('en un geste.', 'with one gesture.')}</span>
                </h2>
                <p className="mt-4 max-w-[50ch] text-[15.5px] leading-relaxed text-encre-2">
                  {t(
                    'Aucune saisie héroïque, aucun tableur du dimanche. Chaque bouteille a son chemin le plus court :',
                    'No heroic data entry, no Sunday spreadsheet. Every bottle takes its shortest path in:',
                  )}
                </p>
              </FadeInOnScroll>
              {/* La liste reste SECONDAIRE (micro-passe, Eric 2026-08-13) :
                  petits corps, encre douce, filets légers — le message est le
                  geste, la photo est la preuve, jamais une checklist. */}
              <div className="mt-6 max-w-[46ch] border-t border-encre/8">
                {CHEMINS.map((c) => (
                  <FadeInOnScroll key={c.fr} delay={0.04}>
                    <p className="border-b border-encre/8 py-2.5 text-[13.5px] leading-snug text-encre-3">
                      {t(c.fr, c.en)}
                    </p>
                  </FadeInOnScroll>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S3 · LA MÉMOIRE — la descente dans la nuit ══════════════════ */}
      <section
        className="relative overflow-hidden text-foreground"
        style={{
          background:
            'linear-gradient(180deg, var(--color-papier) 0%, #2a1d13 6%, #150f0c 16%, #150f0c 100%)',
        }}
        data-nav-delai="90"
        id="memoire"
      >
        <div className="relative mx-auto w-[min(480px,72%)] pt-10">
          <LigneAccord variante="inflexion" ton="nuit" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-6 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-[760px] text-center">
            <FadeInOnScroll>
              <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or">
                {t('La mémoire', 'The memory')}
              </p>
              <h2
                className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(30px, 4.4vw, 52px)' }}
              >
                {t('Une cave qui se souvient.', 'A cellar that remembers.')}
              </h2>
              <p className="mx-auto mt-4 max-w-[56ch] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
                {t(
                  'Où chaque bouteille est rangée, section, rangée, case. Ce qu’elle vaut, jusqu’au vrai prix d’un magnum, rapport d’assurance compris. Ce qu’elle a vécu : son entrée, ses déplacements, le soir où elle a été bue ou offerte.',
                  'Where every bottle rests, section, row, slot. What it’s worth, down to a magnum’s true price, insurance report included. What it has lived: its arrival, its moves, the night it was drunk or gifted.',
                )}
              </p>
            </FadeInOnScroll>
          </div>

          <div className="mx-auto mt-10 grid max-w-[1160px] items-center gap-8 lg:grid-cols-[0.62fr_0.38fr] lg:gap-12">
            <FadeInOnScroll>
              <CellierVisuelAnime t={t} />
              <p className="mt-3 text-center text-[12.5px] text-foreground-faint">
                {t('Le cellier visuel : chaque case est la vraie place de la bouteille.', 'The visual cellar: each slot is the bottle’s real place.')}
              </p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.12}>
              <figure className="relative mx-auto w-[min(240px,80%)] overflow-hidden rounded-[18px] border border-or/20 shadow-[0_34px_80px_-30px_rgba(0,0,0,0.9)]">
                <picture>
                  <source type="image/avif" srcSet="/screenshots/05-cave-visuelle.avif" />
                  <source type="image/webp" srcSet="/screenshots/05-cave-visuelle.webp" />
                  <img
                    src="/screenshots/05-cave-visuelle.png"
                    alt={t('La liste de cave : chaque bouteille avec son prix et sa fenêtre d’apogée.', 'The cellar list: every bottle with its price and peak window.')}
                    width={636}
                    height={1378}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full"
                  />
                </picture>
              </figure>
            </FadeInOnScroll>
          </div>

          <FadeInOnScroll delay={0.1}>
            <div className="mx-auto mt-10 grid max-w-[860px] gap-x-10 gap-y-3 text-[14.5px] text-muted-foreground sm:grid-cols-2">
              <p className="flex items-start gap-2.5">
                <MapPin size={15} strokeWidth={1.8} className="mt-1 shrink-0 text-or" aria-hidden />
                {t('Plusieurs caves ? Chacune la sienne : la maison, le chalet.', 'Several cellars? Each its own: the house, the cottage.')}
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin size={15} strokeWidth={1.8} className="mt-1 shrink-0 text-or" aria-hidden />
                {t('Lisible hors ligne, dans une vraie cave sans réseau.', 'Readable offline, in a real cellar with no signal.')}
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ══ S4 · OCTAVE COMPREND (nuit, courte) ═════════════════════════ */}
      <section className="relative overflow-hidden text-foreground" style={{ background: '#150f0c' }}>
        <div className="relative mx-auto max-w-[1440px] px-6 pb-14 pt-4 lg:px-8 lg:pb-16">
          <div className="mx-auto grid max-w-[1060px] items-center gap-10 lg:grid-cols-[0.46fr_0.54fr] lg:gap-14">
            <FadeInOnScroll>
              <figure className="overflow-hidden rounded-[18px] border border-or/15 shadow-[0_34px_80px_-30px_rgba(0,0,0,0.9)]">
                <picture>
                  <source type="image/avif" srcSet="/photos/lifestyle/cellier-memoire-800.avif 800w, /photos/lifestyle/cellier-memoire-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 40vw" />
                  <source type="image/webp" srcSet="/photos/lifestyle/cellier-memoire-800.webp 800w, /photos/lifestyle/cellier-memoire-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 40vw" />
                  <img
                    src="/photos/lifestyle/cellier-memoire.jpg"
                    alt={t('Le cellier la nuit, apaisé : une case vide, celle de la bouteille qu’on vient de prendre.', 'The cellar at night, at peace: one empty slot, the bottle just taken.')}
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
                  {t('Une mémoire, ', 'A memory, ')}
                  <span className="text-or">{t('pas un registre.', 'not a ledger.')}</span>
                </h2>
                <p className="mt-4 max-w-[42ch] font-[family-name:var(--font-display)] text-[19px] italic leading-snug text-foreground sm:text-[21px]">
                  {t(
                    'Octave ne sait pas seulement ce que vous avez. Il se souvient de ce que vous aimez.',
                    'Octave doesn’t just know what you have. He remembers what you love.',
                  )}
                </p>
                <p className="mt-4 max-w-[50ch] text-[15.5px] leading-relaxed text-muted-foreground">
                  {t(
                    'Alors quand vient le moment de choisir, il croise tout : votre palais, l’apogée, le millésime, le format, et ce que chaque bouteille a vécu. Une application de cave sait ce que vous possédez ; votre sommelier, lui, sait aussi quand l’ouvrir, et pour qui.',
                    'So when the moment comes, he weighs it all: your palate, the peak window, the vintage, the format, and what each bottle has lived. A cellar app knows what you own; your sommelier also knows when to open it, and for whom.',
                  )}
                </p>
              </FadeInOnScroll>
              <FadeInOnScroll delay={0.12}>
                <figure className="mt-6 rounded-[16px] border border-or/25 bg-[#241a12]/95 px-5 py-4">
                  <blockquote className="font-[family-name:var(--font-display)] text-[16.5px] italic leading-snug text-foreground sm:text-[18px]">
                    {t(
                      '« Votre Brunello de 2015 approche de son sommet. Le prochain souper qui le mérite, c’est lui. »',
                      '“Your 2015 Brunello is nearing its peak. The next dinner worthy of it, it’s the one.”',
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
                  href="/apogee"
                  className="mt-6 inline-flex items-center gap-2 text-[14.5px] font-medium text-or transition-colors hover:text-or-soft"
                >
                  {t('Et chaque bouteille attend son moment', 'And every bottle waits for its moment')}
                  <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
                </LocaleLink>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S5 · L'ACTION — retour à la lumière ═════════════════════════ */}
      <section className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 py-14 text-center lg:px-8 lg:py-16">
          <FadeInOnScroll>
            <p
              className="mx-auto max-w-[26ch] font-[family-name:var(--font-display)] font-medium italic leading-[1.2] text-encre"
              style={{ fontSize: 'clamp(26px, 3.8vw, 42px)' }}
            >
              {t('Votre cave a une mémoire. Donnez-lui la vôtre.', 'Your cellar has a memory. Give it yours.')}
            </p>
            <div className="mt-7">
              <a
                href={buildSignupUrl('cellier', { lang: locale })}
                onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'cellier' })}
              >
                <Button variant="primary" size="lg">{t('Essai gratuit', 'Free trial')}</Button>
              </a>
              <p className="mt-4 text-[13px] tracking-wide text-encre-3">
                {t(`${TRIAL_SHORT.fr} · Sans carte · Aucune cave à saisir à la main`, `${TRIAL_SHORT.en} · No card · No cellar to type in by hand`)}
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </main>
  );
}
