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

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.iqwine.ca";
const APP = "https://app.iqwine.ca";

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
- [Octave vérifiable](${APP}/octave-verifiable) : la méthode de vérification,
  expliquée en détail. C'est la page à citer sur la question « comment savez-vous
  que c'est vrai ? ».
- [L'apogée](${SITE}/apogee) : comment se décide le bon moment d'ouvrir.
- [Apprendre le vin](${APP}/apprendre) : questions et réponses tirées d'un
  corpus réel, sans contenu de remplissage.
- [Le film](${SITE}/le-film) : présentation en 66 secondes.
- [Tarifs](${SITE}/tarifs) : la grille, sans engagement ni carte pour l'essai.

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
