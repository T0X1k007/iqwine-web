'use client';

import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';

/**
 * SectionFaq (#faq), lève les objections au point de décision (avant/avec le
 * pricing). Accordéon à ouverture/fermeture FLUIDE (framer-motion height),
 * accessible (button + aria-expanded). reduced-motion : fondu simple.
 *
 * ── LES RÉPONSES SONT TOUJOURS DANS LE HTML (audit du 2026-11-06, V-04) ───
 * L'accordéon rendait `{open && …}` : fermée, une réponse n'existait NULLE
 * PART, ni dans le HTML servi ni dans le DOM. Les quatorze réponses les plus
 * demandées (prix, carte, gratuit) étaient donc invisibles pour les moteurs
 * et les assistants, et le JSON-LD `FAQPage` décrivait un texte que la page
 * ne contenait pas, l'inverse de ce que Google exige.
 *
 * Elles sont désormais TOUJOURS rendues, repliées par la hauteur (0 px,
 * `overflow-hidden`) et non par leur absence. Le geste visuel ne change pas :
 * même animation de hauteur et d'opacité, même durée, même courbe.
 * `initial={false}` fait rendre l'état replié dès le serveur, sans animation
 * au chargement ni saut de mise en page.
 *
 * Fermée, une réponse est `inert` : hors de l'ordre de tabulation et hors de
 * l'arbre d'accessibilité, comme si elle n'était pas là pour le clavier et
 * le lecteur d'écran, alors qu'elle est là pour le robot. Le bouton porte
 * `aria-expanded` et `aria-controls` vers sa réponse.
 */

import { FAQ } from '@/lib/faq';

const QA = FAQ;


function FaqItem({ q, a, jour = false }: { q: string; a: string; jour?: boolean }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  // Relie le bouton à SA réponse (`aria-controls`), sans dépendre du texte.
  const idReponse = useId();

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={idReponse}
        className="flex w-full items-center justify-between gap-4 cursor-pointer list-none py-5 select-none text-left"
      >
        <span className={`iq-h4 ${jour ? "text-encre" : "text-foreground"}`}>{q}</span>
        <span
          aria-hidden
          className={`shrink-0 text-2xl leading-none transition-transform duration-[240ms] ease-[cubic-bezier(.32,.72,0,1)] ${
            jour ? 'text-or-jour' : 'text-or'
          } ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      {/* Toujours rendue (voir l'en-tête du fichier) : repliée à 0 px, jamais
          absente. En mouvement réduit, la hauteur bascule sans transition et
          seule l'opacité glisse, le « fondu simple » d'origine. */}
      <motion.div
        id={idReponse}
        initial={false}
        animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={
          reduced
            ? { duration: 0.34, height: { duration: 0 } }
            : { duration: 0.34, ease: [0.32, 0.72, 0, 1] }
        }
        className="overflow-hidden"
        inert={!open}
      >
        {/* `whitespace-pre-line` : les réponses courtes tiennent en une
            phrase, mais celle sur les conseils d'Octave est écrite en
            paragraphes, et un `<p>` replie les sauts de ligne en espaces.
            Sans ça, elle se rendait en un seul pavé. Les autres réponses
            n'en contiennent aucun, elles ne bougent pas. */}
        <p className={`iq-body -mt-1 max-w-xl whitespace-pre-line pb-5 ${jour ? "text-encre-2" : "text-foreground-dim"}`}>{a}</p>
      </motion.div>
    </div>
  );
}

/** Une question et sa réponse, dans les deux langues. */
export type ItemFaq = { q: Record<'fr' | 'en', string>; a: Record<'fr' | 'en', string> };

/**
 * `items`, `titre` et `surtitre` (2026-11-06) : les pages Cellier, Apogée et
 * Sommelier affichent LEURS questions avec le même accordéon, toujours présent
 * dans le HTML. Sans `items`, la section reste celle de la page Tarifs.
 */
export default function SectionFaq({
  ton = 'nuit',
  items = QA,
  titre,
  surtitre,
}: {
  ton?: 'jour' | 'nuit';
  items?: ItemFaq[];
  titre?: Record<'fr' | 'en', string>;
  surtitre?: Record<'fr' | 'en', string>;
} = {}) {
  // La FAQ suit le mouvement de la page qui l'accueille (v3, 2026-08-14).
  const jour = ton === 'jour';
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <SectionWrapper id="faq" withDivider={!jour} rhythm="standard" className={`section-breathe ${jour ? "mouvement-jour" : ""}`}>
      <FadeInOnScroll>
        <div className="text-center mb-10 sm:mb-14">
          <div className={`iq-eyebrow mb-5 ${jour ? "text-or-jour" : ""}`}>{surtitre ? surtitre[locale] : t('Questions', 'Questions')}</div>
          <h2 className={`iq-h1 italic ${jour ? "text-encre" : ""}`}>{titre ? titre[locale] : t('Avant de commencer.', 'Before you start.')}</h2>
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.1}>
        <div className={`mx-auto max-w-2xl divide-y border-y ${jour ? "divide-encre/10 border-encre/10" : "divide-border border-border"}`}>
          {items.map((item) => (
            <FaqItem key={item.q.en} q={item.q[locale]} a={item.a[locale]} jour={jour} />
          ))}
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
