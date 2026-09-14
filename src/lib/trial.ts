/**
 * LA RÈGLE D'ESSAI, source unique de la copie du site.
 *
 * ── L'écart que ce fichier ferme (décision D5, Eric 2026-08-02) ───────────
 * Le produit applique un essai à **double barrière** : 14 jours **ou** 12
 * recommandations d'Octave, au premier des deux atteint. Le site écrivait
 * « 14 jours » **trente-cinq fois** et ne mentionnait **jamais** les douze.
 *
 * Un utilisateur actif peut donc voir son essai s'arrêter au bout de trois
 * jours après avoir lu quatre fois « 14 jours ». C'est le seul écart du dossier
 * qui puisse se retourner en litige : la promesse écrite ne correspond pas au
 * produit livré.
 *
 * Décision d'Eric : **garder la règle, corriger la copie.** La double barrière
 * protège une économie unitaire réelle, la retirer exposerait le budget IA.
 * L'écrire, en revanche, est obligatoire.
 *
 * ── Pourquoi une source unique, et pas trente-cinq corrections ────────────
 * Trente-cinq occurrences dispersées dans douze fichiers, c'est la CAUSE, pas
 * le symptôme. Les corriger une à une laisserait la trente-sixième naître au
 * prochain texte écrit. La règle vit donc ici, en un seul endroit, et une règle
 * ESLint refuse désormais toute mention littérale de « 14 jours » ailleurs.
 *
 * ── Ce qui doit rester synchronisé ────────────────────────────────────────
 * `TRIAL_DAYS` et `TRIAL_RECOS` doublent `lib/billing/plan-catalog.ts` du dépôt
 * applicatif (`TRIAL_DAYS = 14`, `TRIAL_AI_RECOMMENDATIONS = 12`). Deux dépôts,
 * deux déploiements : la duplication est inévitable, l'oubli ne doit pas
 * l'être. **Changer l'un OBLIGE à changer l'autre**, c'est exactement la
 * classe d'écart que ce fichier existe pour empêcher.
 */

/**
 * ⚠️ LE COMPTEUR SE DIT « CONSEIL PERSONNALISÉ D'OCTAVE » (Eric, 2026-09-13).
 *
 * Ce fichier écrivait « interactions avec Octave », la FAQ de l'essai écrivait
 * « recommandations d'Octave » : deux mots pour un seul compteur, sur la même
 * page. Les deux disent désormais « conseils personnalisés d'Octave », le terme
 * public unique, et « interaction » ne paraît plus nulle part.
 *
 * Côté anglais, « advice » est indénombrable : « 12 pieces of personalized
 * advice from Octave », jamais « 12 personalized advice ».
 */

/** Durée de base de l'essai, en jours. Doit égaler `TRIAL_DAYS` de l'app. */
export const TRIAL_DAYS = 14;

/**
 * Recommandations d'Octave incluses dans l'essai. Doit égaler
 * `TRIAL_AI_RECOMMENDATIONS` de l'app.
 */
export const TRIAL_RECOS = 12;

/**
 * LA PROLONGATION PAR REMPLISSAGE DE CAVE, troisième mécanique de l'essai,
 * entrée dans ce fichier le 2026-09-14 (Eric).
 *
 * Elle joue dans le sens INVERSE de la double barrière : chaque palier de cave
 * franchi ajoute des jours. `TRIAL_DAYS` n'est donc plus un plafond, c'est un
 * point de départ — écrire « l'essai dure au maximum 14 jours » serait faux.
 *
 * ⚠️ D6, à répliquer côté application : ces valeurs doublent la mécanique de
 * `cellier-vin`. Changer l'une OBLIGE à changer l'autre.
 */
export const TRIAL_BOTTLE_TIERS = [10, 25, 50, 100] as const;
/** Jours ajoutés à chaque palier franchi. */
export const TRIAL_TIER_BONUS_DAYS = 2;
/**
 * Plafond de la prolongation, en jours. ÉCRIT, et non dérivé du nombre de
 * paliers — bien que les deux valent 8 aujourd'hui (4 paliers × 2 jours).
 *
 * L'application l'applique comme une borne PROPRE. Le dériver ferait qu'un
 * cinquième palier ajouté côté produit relèverait tout seul la promesse du
 * site à 24 jours, sans que personne n'ait écrit ce nombre ni décidé de
 * l'annoncer. Une valeur dérivée n'est sûre que si la dérivation est la règle
 * réelle ; ici elle n'est qu'une coïncidence arithmétique.
 */
export const TRIAL_MAX_BONUS_DAYS = 8;
/** Durée maximale ATTEIGNABLE, prolongation comprise. */
export const TRIAL_DAYS_MAX = TRIAL_DAYS + TRIAL_MAX_BONUS_DAYS;

export type SiteLocale = 'fr' | 'en';

/**
 * L'ESSAI EST CELUI DU STANDARD, et d'aucun autre forfait.
 *
 * Il reflète la grille du Standard — sa cave, ses conseils. Le site l'a
 * longtemps présenté sans objet (« Essai gratuit », tout court), ce qui le
 * rendait interchangeable avec le forfait Gratuit dans l'esprit du visiteur :
 * deux choses « gratuites », aucune raison de les distinguer.
 *
 * ⚠️ CE N'EST PLUS UN PARAMÈTRE DE ROUTAGE (Eric, 2026-09-14, seconde
 * direction). Il a transité quelques heures dans `?plan=` sur les CTA d'entrée
 * ; il n'y a plus rien à y mettre, puisqu'il n'y a plus qu'UNE porte
 * d'inscription. La constante demeure comme DOCUMENTATION du palier que
 * l'essai reflète — le fait reste vrai côté application
 * (`TRIAL_REFLECTS_TIER = "STANDARD"`), et la copie s'appuie dessus.
 */
export const TRIAL_PLAN_ID = 'standard';

/**
 * La phrase qui dit les deux bornes, celles qui peuvent RACCOURCIR l'essai.
 *
 * ⚠️ ELLE N'EST PLUS « LA VÉRITÉ ENTIÈRE » : depuis que la prolongation par
 * remplissage de cave est documentée ici, la règle complète s'écrit
 * `TRIAL_MECHANICS`. Celle-ci en garde la moitié qui protège l'utilisateur —
 * l'essai peut finir avant le quatorzième jour — et c'est la seule moitié dont
 * l'omission puisse se retourner en litige (écart D5).
 *
 * Elle vit désormais au SECOND niveau : FAQ, balisage, pages de fonctions.
 * Le message de premier niveau, lui, est `TRIAL_HEADLINE`.
 */
export const TRIAL_FULL: Record<SiteLocale, string> = {
  fr: `${TRIAL_DAYS} jours ou ${TRIAL_RECOS} conseils personnalisés d’Octave, au premier des deux`,
  en: `${TRIAL_DAYS} days or ${TRIAL_RECOS} pieces of personalized advice from Octave, whichever comes first`,
};

/**
 * La forme COURTE, pour un libellé de bouton.
 *
 * Refonte v3 (Eric, 2026-08-12) : le bouton ne cite PLUS la durée du tout.
 * « Essai gratuit 14 jours » seul contredisait la double barrière, la navbar
 * le portait sans réassurance adjacente. Règle désormais : un bouton dit
 * « Essai gratuit », et CHAQUE endroit où l'essai est décrit porte la
 * formulation exacte `TRIAL_SHORT`/`TRIAL_FULL`. Aucune variante entre navbar,
 * pricing, FAQ ou CTA.
 */
export const TRIAL_CTA: Record<SiteLocale, string> = {
  fr: 'Essai gratuit',
  en: 'Free trial',
};

/** Forme brève mais HONNÊTE, tient sur une ligne de réassurance. */
export const TRIAL_SHORT: Record<SiteLocale, string> = {
  fr: `${TRIAL_DAYS} jours ou ${TRIAL_RECOS} conseils`,
  en: `${TRIAL_DAYS} days or ${TRIAL_RECOS} pieces of advice`,
};

/* ══════════════════════════════════════════════════════════════════════════
   LE MODÈLE DE PREMIER NIVEAU — seconde direction d'Eric, 2026-09-14
   ══════════════════════════════════════════════════════════════════════════

   ── Ce qui a changé, et pourquoi c'est plus simple ────────────────────────
   Il n'y a plus « trois forfaits PLUS un essai ». Il y a TROIS FORFAITS, et
   les 14 jours sont un BÉNÉFICE DE L'INSCRIPTION :

     toute nouvelle inscription au forfait Gratuit reçoit automatiquement les
     fonctionnalités du Standard pendant ses 14 premiers jours ; ensuite on
     reste sur Gratuit à 0 $, ou on choisit Standard, ou on choisit Premium.

   La première direction rattachait l'essai à la carte Standard. C'était déjà
   mieux qu'un essai flottant, mais cela laissait DEUX objets à comparer — un
   forfait et une modalité — et donc toujours une question à trancher pour le
   visiteur. Le nouveau modèle en supprime un : l'essai n'est plus quelque
   chose qu'on choisit, c'est quelque chose qu'on REÇOIT.

   ⚠️ RÈGLE DE FORME ABSOLUE : il ne doit exister visuellement AUCUN quatrième
   choix « Essai 14 jours ». Ni carte, ni encadré, ni bouton, ni colonne. Dès
   qu'un élément de la page se présente comme sélectionnable, il redevient un
   objet à comparer, et la confusion revient par la porte qu'on vient de
   fermer.

   ⚠️ RÈGLE DE VÉRITÉ, ADOSSÉE AU CODE : cette promesse n'est vraie que parce
   que l'inscription passe par la porte PAR DÉFAUT, celle qui accorde l'essai.
   Le parcours « Gratuit » explicite de l'application pose `trialDays: 0` et
   n'accorde RIEN. Aucun CTA d'entrée de ce site ne doit donc transporter de
   `?plan=`. Voir la note dans `Pricing.tsx`, qui portait ce paramètre.
   ══════════════════════════════════════════════════════════════════════════ */

/** Le titre : ce qu'on fait, et ce qu'on obtient. */
export const SIGNUP_HEADLINE: Record<SiteLocale, string> = {
  fr: 'Commencez gratuitement. Découvrez tout iQWine.',
  en: 'Start for free. Discover all of iQWine.',
};

/**
 * Le sous-titre : les 14 jours, puis les trois sorties.
 *
 * Les trois forfaits sont NOMMÉS, et dans l'ordre de la grille. Une phrase qui
 * dirait « ensuite, choisissez votre forfait » laisserait le lecteur supposer
 * qu'il doit payer ; nommer « Gratuit » en tête de liste dit le contraire sans
 * avoir à le plaider.
 */
export const SIGNUP_SUB: Record<SiteLocale, string> = {
  fr: `Profitez de Standard pendant vos ${TRIAL_DAYS} premiers jours. Ensuite, choisissez Gratuit, Standard ou Premium selon vos besoins.`,
  en: `Enjoy Standard for your first ${TRIAL_DAYS} days. Then choose Free, Standard or Premium, as you need.`,
};

/**
 * LE CTA D'ENTRÉE, unique sur tout le site.
 *
 * « Commencer gratuitement » est vrai à la lettre : l'inscription est gratuite
 * et sans carte. Il ne nomme pas le Standard — délibérément. Le nommer ferait
 * du bénéfice une offre, donc un choix, donc le quatrième objet interdit.
 */
export const SIGNUP_CTA: Record<SiteLocale, string> = {
  fr: 'Commencer gratuitement',
  en: 'Start for free',
};

/**
 * LE REPLI SOUS 375 px, mesuré et non supposé.
 *
 * La barre mobile aligne sélecteur de langue + bouton + hamburger dans un bloc
 * incompressible (le bouton est `whitespace-nowrap`). Vérifié au navigateur :
 * un libellé long y pousse le hamburger HORS de l'écran à 320 et 360 px —
 * `nav.scrollWidth` passe de 320/360 à 370. Aucun libellé ne vaut de casser la
 * navigation d'un iPhone SE. Le libellé plein s'affiche dès qu'il y a la
 * place, et se replie en dessous.
 */
export const SIGNUP_CTA_TINY: Record<SiteLocale, string> = {
  fr: 'Commencer',
  en: 'Start free',
};

/**
 * LE BÉNÉFICE, forme COURTE — bandeau de la carte Gratuit.
 *
 * « offert » et non « inclus » : « inclus » décrit le contenu d'un forfait et
 * ferait croire que le Standard fait partie du Gratuit ; « offert » décrit un
 * cadeau daté, ce qu'il est.
 */
export const TRIAL_ON_SIGNUP: Record<SiteLocale, string> = {
  fr: `Standard offert ${TRIAL_DAYS} jours`,
  en: `Standard free for ${TRIAL_DAYS} days`,
};

/** Le même bénéfice, forme PLEINE — chapeaux, preuves, réponses. */
export const TRIAL_ON_SIGNUP_FULL: Record<SiteLocale, string> = {
  fr: `Standard offert les ${TRIAL_DAYS} premiers jours`,
  en: `Standard included for your first ${TRIAL_DAYS} days`,
};

/**
 * CE QU'IL ADVIENT ENSUITE, en une phrase.
 *
 * La bascule est AUTOMATIQUE et le compte reste ACTIF : ni compte bloqué, ni
 * archive en lecture seule, ni prélèvement. Aucune de ces trois lectures ne
 * doit pouvoir se déduire de la copie du site.
 */
export const TRIAL_ENDS_FREE: Record<SiteLocale, string> = {
  fr: `Après vos ${TRIAL_DAYS} premiers jours, vous restez sur le forfait Gratuit à 0 $ — sauf si vous choisissez Standard ou Premium. Aucun prélèvement, aucune carte demandée.`,
  en: `After your first ${TRIAL_DAYS} days you stay on the Free plan at $0 — unless you choose Standard or Premium. No charge, no card asked for.`,
};

/** La permanence du Gratuit, forme courte : bandeau, en-tête de comparatif. */
export const FREE_ALWAYS: Record<SiteLocale, string> = {
  fr: 'Toujours gratuit',
  en: 'Always free',
};

/** La même, tournée vers l'échéance qu'il n'a pas. */
export const FREE_NO_END: Record<SiteLocale, string> = {
  fr: 'Sans date de fin',
  en: 'No end date',
};

/**
 * « 14 jours », forme NOMINALE — celle qui suit un verbe ou tient seule.
 */
export const TRIAL_DAYS_LABEL: Record<SiteLocale, string> = {
  fr: `${TRIAL_DAYS} jours`,
  en: `${TRIAL_DAYS} days`,
};

/**
 * La même durée, forme ÉPITHÈTE — celle qui qualifie « essai » / « trial ».
 *
 * Elle existe parce que l'anglais ne se compose pas comme le français : le
 * français postpose (« l'essai DE 14 JOURS »), l'anglais antépose et met le
 * nombre au singulier avec trait d'union (« the 14-DAY trial »). Réutiliser
 * `TRIAL_DAYS_LABEL` dans cette position produit « the 14 days trial », faute
 * que la relecture en rendu réel a effectivement attrapée sur deux chaînes.
 *
 * Même réflexe que « pieces of personalized advice » : un mot anglais ne se
 * déduit pas du français, il se décide.
 */
export const TRIAL_DAYS_ADJ: Record<SiteLocale, string> = {
  fr: `de ${TRIAL_DAYS} jours`,
  en: `${TRIAL_DAYS}-day`,
};

/**
 * LE SECOND NIVEAU, la règle exacte et entière. Destination : la FAQ, et elle
 * seule.
 *
 * Arbitrage d'Eric maintenu dans les deux directions successives : « 14 jours »
 * est le message de premier niveau, sans astérisque qui le relativise sur
 * place. La laisse de `TRIAL_RECOS` conseils et la prolongation jusqu'à
 * `TRIAL_DAYS_MAX` jours vivent ICI, derrière une question qui les appelle et
 * un accordéon replié : personne ne les rencontre par accident, tout le monde
 * les trouve en les cherchant.
 *
 * Les nombres sont tous dérivés, aucun n'est écrit à la main — c'est la garde
 * qui a manqué à « deux mois offerts ».
 */
export const TRIAL_MECHANICS: Record<SiteLocale, string> = {
  fr: `Les fonctionnalités du Standard s’arrêtent au premier des deux seuils atteints : ${TRIAL_DAYS} jours, ou ${TRIAL_RECOS} conseils personnalisés d’Octave. Si vous en profitez beaucoup, le second peut arriver avant le premier, et vous le voyez venir dans l’application.

Ils peuvent aussi durer plus longtemps : chaque palier de cave franchi — ${TRIAL_BOTTLE_TIERS.slice(0, -1).join(', ')} puis ${TRIAL_BOTTLE_TIERS.at(-1)} bouteilles — ajoute ${TRIAL_TIER_BONUS_DAYS} jours, jusqu’à ${TRIAL_MAX_BONUS_DAYS} jours de plus, soit ${TRIAL_DAYS_MAX} jours au total.`,
  en: `The Standard features stop at whichever limit you reach first: ${TRIAL_DAYS} days, or ${TRIAL_RECOS} pieces of personalized advice from Octave. If you make the most of them, the second can come before the first, and you see it coming inside the app.

They can also last longer: every cellar milestone you pass — ${TRIAL_BOTTLE_TIERS.slice(0, -1).join(', ')} then ${TRIAL_BOTTLE_TIERS.at(-1)} bottles — adds ${TRIAL_TIER_BONUS_DAYS} days, up to ${TRIAL_MAX_BONUS_DAYS} extra days, for ${TRIAL_DAYS_MAX} days in all.`,
};
