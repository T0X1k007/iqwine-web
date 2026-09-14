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
/** Plafond de la prolongation, en jours. */
export const TRIAL_MAX_BONUS_DAYS = TRIAL_BOTTLE_TIERS.length * TRIAL_TIER_BONUS_DAYS;
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
 * Nommer le forfait essayé est la moitié de la correction du 2026-09-14 ;
 * l'autre moitié est de dire où l'on atterrit ensuite (`TRIAL_STEP_2`).
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
   LE MESSAGE DE PREMIER NIVEAU — arbitrage d'Eric, 2026-09-14
   ══════════════════════════════════════════════════════════════════════════

   ── Le problème qu'il tranche ────────────────────────────────────────────
   La grille porte DEUX objets gratuits de nature différente : un FORFAIT
   (Gratuit, 0 $, permanent) et une MODALITÉ D'ACCÈS à un autre forfait
   (l'essai du Standard). Tant que les deux se disaient « gratuit » avec le
   même poids visuel, le visiteur en déduisait la seule chose cohérente :
   « le gratuit dure 14 jours ». C'est-à-dire l'inverse exact de la vérité.

   ── Ce qu'Eric a arbitré ─────────────────────────────────────────────────
   « 14 jours » reste écrit EN CLAIR, au premier niveau, sans astérisque qui le
   relativise sur place. Les mécaniques additionnelles — la laisse de
   `TRIAL_RECOS` conseils, la prolongation jusqu'à `TRIAL_DAYS_MAX` jours — ne
   doivent pas brouiller ce message ; elles vivent au second niveau (FAQ,
   ligne de précision plus bas).

   Cet arbitrage ASSOUPLIT la doctrine D5 (« n'écrire jamais 14 jours seul »)
   sans la supprimer : la règle ESLint tient toujours, la durée reste
   inécrivable à la main hors de ce fichier, et la double barrière reste
   énoncée sur la même page, dans la FAQ, via `TRIAL_MECHANICS`. Ce qui change,
   c'est l'ÉTAGE où elle se lit, pas le fait qu'elle se lise.

   ── La règle de rendu, à tenir ───────────────────────────────────────────
   Les deux temps se rendent TOUJOURS ensemble et dans cet ordre. `TRIAL_STEP_1`
   seul est le message d'origine du problème : il promet une gratuité sans dire
   où elle mène, donc le lecteur suppose qu'elle s'arrête.
   ══════════════════════════════════════════════════════════════════════════ */

/** Premier temps : ce qu'on essaie, gratuitement, et pendant combien de temps. */
export const TRIAL_STEP_1: Record<SiteLocale, string> = {
  fr: `Essayez Standard gratuitement pendant ${TRIAL_DAYS} jours.`,
  en: `Try Standard free for ${TRIAL_DAYS} days.`,
};

/**
 * Second temps : les DEUX sorties, dont aucune n'est un mur.
 *
 * « iQWine Gratuit » et non « gratuitement » seul : le mot est ici un NOM DE
 * PRODUIT, et c'est tout l'enjeu. Employé comme adjectif, « gratuit » décrit
 * l'essai autant que le forfait et les confond ; employé comme nom, il désigne
 * une destination qui existe après l'essai.
 */
export const TRIAL_STEP_2: Record<SiteLocale, string> = {
  fr: 'Ensuite, abonnez-vous ou continuez gratuitement avec iQWine Gratuit.',
  en: 'Then subscribe, or keep going for free with iQWine Free.',
};

/** Les deux temps en une phrase, pour un chapeau ou une métadonnée. */
export const TRIAL_HEADLINE: Record<SiteLocale, string> = {
  fr: `${TRIAL_STEP_1.fr} ${TRIAL_STEP_2.fr}`,
  en: `${TRIAL_STEP_1.en} ${TRIAL_STEP_2.en}`,
};

/**
 * « 14 jours », forme NOMINALE — celle qui suit un verbe ou tient seule :
 * « 14 jours gratuits, sans carte », « 14 days free, no card ».
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
 * `TRIAL_DAYS_LABEL` dans cette position produit « the 14 days trial », une
 * faute d'accord que la relecture en rendu réel a effectivement attrapée sur
 * deux chaînes.
 *
 * C'est le même réflexe que « pieces of personalized advice » : un mot anglais
 * ne se déduit pas du français, il se décide.
 */
export const TRIAL_DAYS_ADJ: Record<SiteLocale, string> = {
  fr: `de ${TRIAL_DAYS} jours`,
  en: `${TRIAL_DAYS}-day`,
};

/**
 * LE SECOND NIVEAU, la règle exacte et entière. Destination : la FAQ.
 *
 * Elle dit les trois mécaniques dans l'ordre où elles comptent pour le
 * lecteur : ce qui peut abréger l'essai (les deux seuils), puis ce qui peut le
 * rallonger (les paliers de cave). Les nombres sont tous dérivés, aucun n'est
 * écrit à la main — c'est la garde qui a manqué à « deux mois offerts ».
 */
export const TRIAL_MECHANICS: Record<SiteLocale, string> = {
  fr: `L’essai prend fin au premier des deux seuils atteints : ${TRIAL_DAYS} jours, ou ${TRIAL_RECOS} conseils personnalisés d’Octave. Si vous l’utilisez beaucoup, le second peut arriver avant le premier, et vous le voyez venir dans l’application.

Il peut aussi s’allonger : chaque palier de cave franchi — ${TRIAL_BOTTLE_TIERS.slice(0, -1).join(', ')} puis ${TRIAL_BOTTLE_TIERS.at(-1)} bouteilles — ajoute ${TRIAL_TIER_BONUS_DAYS} jours, jusqu’à ${TRIAL_MAX_BONUS_DAYS} jours de plus, soit ${TRIAL_DAYS_MAX} jours au total.`,
  en: `The trial ends at whichever limit you reach first: ${TRIAL_DAYS} days, or ${TRIAL_RECOS} pieces of personalized advice from Octave. If you use it a lot, the second can come before the first, and you see it coming inside the app.

It can also grow longer: every cellar milestone you pass — ${TRIAL_BOTTLE_TIERS.slice(0, -1).join(', ')} then ${TRIAL_BOTTLE_TIERS.at(-1)} bottles — adds ${TRIAL_TIER_BONUS_DAYS} days, up to ${TRIAL_MAX_BONUS_DAYS} extra days, for ${TRIAL_DAYS_MAX} days in all.`,
};

/**
 * CE QU'IL ADVIENT À LA FIN, en une phrase — la réponse à la peur réelle.
 *
 * La bascule est AUTOMATIQUE et le compte reste ACTIF : ce n'est ni un compte
 * bloqué, ni une archive en lecture seule, ni un prélèvement. Aucune de ces
 * trois phrases ne doit pouvoir se déduire de la copie du site.
 */
export const TRIAL_ENDS_FREE: Record<SiteLocale, string> = {
  fr: 'À la fin de l’essai, vous passez au forfait Gratuit — sauf si vous choisissez de vous abonner. Aucun prélèvement, aucune carte demandée.',
  en: 'When the trial ends you move to the Free plan — unless you choose to subscribe. No charge, no card asked for.',
};

/**
 * LE FORFAIT GRATUIT N'EXPIRE PAS. La phrase existe pour être répétée telle
 * quelle partout où le doute peut naître, et pour qu'aucune variante ne vienne
 * l'affaiblir d'un « pendant » ou d'un « jusqu'à ».
 */
export const FREE_NO_END: Record<SiteLocale, string> = {
  fr: 'Sans date de fin',
  en: 'No end date',
};
