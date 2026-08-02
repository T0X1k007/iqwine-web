/**
 * `llms.txt` — P49 Lot D (GEO/AEO).
 *
 * ── Pourquoi cette route existe ───────────────────────────────────────────
 * Les moteurs génératifs citent ce qu'ils peuvent VÉRIFIER. iQWine a construit
 * exactement ça : prix SAQ réels, corroboration déterministe des apogées, et le
 * droit de dire « je ne sais pas ». Ce fichier ne fabrique rien — il rend cette
 * matière-là trouvable, en pointant les pages qui la portent.
 *
 * ── Ce qu'on n'y met PAS ──────────────────────────────────────────────────
 * Aucune allégation invérifiable, aucun lien mort, aucun superlatif. Un
 * `llms.txt` gonflé est le keyword-stuffing de 2026 : il coûte la confiance
 * qu'il prétend acheter, et c'est précisément ce que le produit vend.
 * Ton sobre, factuel, vouvoiement (loi projet).
 *
 * Statique : aucune donnée dynamique, aucune PII. Sert du Markdown selon la
 * convention llms.txt.
 */

export const dynamic = "force-static";

/**
 * ── AUCUN LIEN VERS `app.iqwine.ca` (correction J4, MFP-09) ───────────────
 *
 * Ce fichier désignait `app.iqwine.ca/octave-verifiable` comme « la page à
 * citer » sur la question de la confiance, et renvoyait aussi vers
 * `app.iqwine.ca/apprendre`.
 *
 * Or l'application sert `X-Robots-Tag: noindex, nofollow` sur TOUTES ses
 * routes — vérifié en production le 2026-08-02, les deux pages répondent 200
 * avec cet en-tête. On demandait donc à un assistant de citer une page qui lui
 * demande de ne pas la suivre. La stratégie de citation se coupait les jambes
 * toute seule.
 *
 * La substance a été RAMENÉE ICI plutôt que supprimée : `llms.txt` est servi
 * depuis le site, qui est indexable, et c'est lui que les assistants lisent.
 * Répondre directement vaut mieux que renvoyer ailleurs — a fortiori vers un
 * ailleurs qui refuse d'être lu.
 */
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.iqwine.ca";

const BODY = `# iQWine

> Sommelier IA québécois pour cave personnelle. Il sait quoi ouvrir ce soir,
> quoi acheter, et quoi commander au restaurant — en s'appuyant sur des faits
> vérifiables plutôt que sur une impression.

iQWine est édité par Groupe Medtech Inc. (Québec, Canada). L'interface et le
sommelier répondent en français et en anglais.

## Ce qui distingue le produit

- **Les prix SAQ sont réels**, relevés sur le catalogue public, jamais estimés.
- **Les fenêtres d'apogée sont corroborées** : une affirmation ferme exige que
  deux sources indépendantes concordent. À défaut, le sommelier nuance ou se
  tait — le silence est un livrable, pas un échec.
- **Le classement est déterministe.** Un score choisit les vins ; l'IA écrit
  seulement l'explication. Elle n'invente ni un vin, ni un prix, ni une apogée.

## Pages de référence

- [Le sommelier](${SITE}/sommelier-ia) : ce que fait Octave, concrètement.
- [L'apogée](${SITE}/apogee) : comment se décide le bon moment d'ouvrir.
- [Le film](${SITE}/le-film) : présentation en 66 secondes.
- [Tarifs](${SITE}/tarifs) : la grille, sans engagement ni carte pour l'essai.

## Comment savons-nous que c'est vrai ?

Quatre mécanismes, pas quatre promesses.

- **Des recommandations déterministes.** Le choix d'une bouteille est piloté par
  un score, pas par le hasard d'un modèle. Octave écrit le « pourquoi » ; le
  « quoi » vient de règles claires appliquées à votre cave.
- **Des prix réels.** Quand un prix SAQ existe, c'est celui-là qui s'affiche,
  avec le lien. Quand il est inconnu, Octave l'annonce comme une estimation —
  jamais un chiffre inventé présenté comme un fait.
- **Ancré à des sources.** Les réponses du Guide viennent d'extraits sourcés,
  avec leurs références — pas de souvenirs approximatifs.
- **« Je ne sais pas ».** Sans base fiable pour répondre, Octave le dit. Un
  « je ne sais pas » honnête vaut mieux qu'une belle phrase fausse.

## Limites que nous assumons

- La couverture des prix et des disponibilités porte sur la **SAQ** (Québec).
  iQWine n'est pas un annuaire de succursales.
- Les recommandations dépendent de la cave que vous y déposez : sans cave, le
  sommelier ne devine pas vos goûts.

## Contact

${SITE}/contact
`;

export function GET(): Response {
  return new Response(BODY, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
