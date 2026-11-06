import { DEMO_MEALS, getDemoCards, mealLabel, type DemoCard } from '@/lib/demoData';
import { formatPriceCad } from '@/lib/plans';
import type { Locale } from '@/lib/i18n';

/**
 * LA DÉMO D'ACCORDS, EN TEXTE : les quatre plats et toutes les réponses
 * d'Octave, présents dans le HTML servi (audit du 2026-11-06, constat V-14).
 *
 * ── Pourquoi ce composant existe ──────────────────────────────────────────
 * La démo jouable de /accord-mets-vins ne rend qu'UN plat à la fois : celui
 * que l'état React a choisi (la lasagne au chargement). Les trois autres
 * réponses n'existaient qu'après un clic, donc jamais pour un robot qui lit
 * le HTML, ni pour un lecteur d'écran qui parcourt la page sans piloter les
 * boutons. Trois réponses citables, écrites avec soin, restaient muettes.
 *
 * ── Ce qu'il est, et ce qu'il n'est pas ───────────────────────────────────
 * Une TRANSCRIPTION, visuellement masquée (`sr-only`), de ce que la démo
 * montre déjà : mêmes données (`demoData.ts`), mêmes libellés de source que
 * l'écran (« Votre cave », « Près de vous »), aucun mot de plus que la démo
 * n'en dit. Ce n'est pas du contenu caché pour les moteurs : c'est
 * l'équivalent textuel d'une interface visuelle, que tout visiteur obtient
 * en cliquant. La démo elle-même ne change pas d'un pixel.
 *
 * Aucun état, aucun effet : la page qui l'accueille est un composant client,
 * mais elle est rendue au serveur comme toutes les autres, et ce texte, qui
 * ne dépend d'aucun clic, est donc dans le HTML initial par construction.
 */

const LIBELLES = {
  titre: { fr: 'Les réponses d’Octave, plat par plat', en: 'Octave’s answers, dish by dish' },
  cave: { fr: 'Votre cave', en: 'Your cellar' },
  pres: { fr: 'Près de vous', en: 'Near you' },
  dispo: { fr: 'disponible', en: 'in stock' },
} as const;

/** Le prix tel que la démo l'affiche, avec le symbole placé selon la langue. */
function prix(card: DemoCard, locale: Locale): string | null {
  if (typeof card.priceCad !== 'number') return null;
  const montant = formatPriceCad(Math.round(card.priceCad * 100), locale);
  return locale === 'fr' ? `${montant} $` : `$${montant}`;
}

/** « Producteur, Cuvée 2022 (Région) », puis prix et disponibilité hors cave. */
function identite(card: DemoCard, locale: Locale): string {
  const vin = [card.cuvee, card.vintage].filter(Boolean).join(' ');
  const morceaux = [`${card.producer}, ${vin} (${card.region})`];
  const p = prix(card, locale);
  if (p) morceaux.push(p);
  if (card.available) morceaux.push(LIBELLES.dispo[locale]);
  return morceaux.join(', ');
}

export default function DemoTranscription({ locale }: { locale: Locale }) {
  const idTitre = `demo-transcription-${locale}`;
  return (
    <section className="sr-only" aria-labelledby={idTitre}>
      <h3 id={idTitre}>{LIBELLES.titre[locale]}</h3>
      {DEMO_MEALS.map((meal) => (
        <div key={meal}>
          <h4>{mealLabel(meal, locale)}</h4>
          <ul>
            {/* « Les deux » : la cave d'abord, puis le hors-cave, l'ordre de la démo. */}
            {getDemoCards(meal, 'both').map((card) => (
              <li key={`${meal}-${card.source}-${card.producer}`}>
                {card.source === 'cave' ? LIBELLES.cave[locale] : LIBELLES.pres[locale]}
                {/* Espace avant le deux-points en français, jamais en anglais. */}
                {locale === 'fr' ? ' : ' : ': '}
                {identite(card, locale)}. {card.why[locale]}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
