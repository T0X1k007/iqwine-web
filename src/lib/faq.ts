import {
  TRIAL_DAYS,
  TRIAL_DAYS_LABEL,
  TRIAL_MECHANICS,
  TRIAL_ON_SIGNUP_FULL,
} from "@/lib/trial";
import {
  FREE_PLAN,
  STANDARD_PLAN,
  PREMIUM_PLAN,
  annualSavingsCents,
  monthlyEquivalentCents,
  formatPriceCad,
  planLabel,
} from "@/lib/plans";

/**
 * Les chiffres de la réponse « Pourquoi choisir l'annuel ? » sont DÉRIVÉS.
 *
 * Ils étaient une phrase — « Deux mois offerts » — devenue fausse le jour où
 * l'annuel a cessé de valoir 10× le mensuel, et personne ne l'a vu parce
 * qu'aucune valeur ne la reliait à la grille. Une réponse qui cite un prix doit
 * le lire dans `plans.ts`, sans quoi elle survit au prix qu'elle décrit.
 */
function annuel(locale: "fr" | "en"): string {
  const eqS = formatPriceCad(monthlyEquivalentCents(STANDARD_PLAN), locale);
  const eqP = formatPriceCad(monthlyEquivalentCents(PREMIUM_PLAN), locale);
  const ecoS = formatPriceCad(annualSavingsCents(STANDARD_PLAN), locale);
  const ecoP = formatPriceCad(annualSavingsCents(PREMIUM_PLAN), locale);
  const nS = planLabel(STANDARD_PLAN.id, locale);
  const nP = planLabel(PREMIUM_PLAN.id, locale);
  return locale === "fr"
    ? `Le prix de lancement, et un palais qu’Octave affine toute l’année. À l’année, le ${nS} revient à ${eqS} $ par mois et le ${nP} à ${eqP} $, soit ${ecoS} $ et ${ecoP} $ de moins que douze mois au tarif mensuel. Il est offert aux premiers abonnés et pourra évoluer par la suite.`
    : `The launch price, and a palate Octave sharpens all year long. Yearly, ${nS} works out to $${eqS} a month and ${nP} to $${eqP}, which is $${ecoS} and $${ecoP} less than twelve months at the monthly rate. It is offered to our first subscribers and may change later on.`;
}

/**
 * LES QUESTIONS FRÉQUENTES, source unique, partagée avec le JSON-LD.
 *
 * ── Pourquoi elles ont quitté le composant ────────────────────────────────
 * MFP-09 lot C demande des données structurées de FAQ. Les écrire à côté du
 * composant aurait créé DEUX rédactions des mêmes questions : celle que
 * l'humain lit et celle que Google lit. Elles auraient divergé au premier
 * ajustement de formulation, et la divergence serait invisible, puisque
 * personne ne relit un `<script type="application/ld+json">`.
 *
 * Google est d'ailleurs explicite : le balisage FAQ doit refléter un contenu
 * RÉELLEMENT visible sur la page. Une source unique n'est donc pas seulement
 * plus propre, elle est la condition d'éligibilité.
 */
export const FAQ: {
  q: Record<"fr" | "en", string>;
  a: Record<"fr" | "en", string>;
}[] = [
  {
    /**
     * La réponse énonçait la double barrière — une information de DURÉE sous
     * une question de PAIEMENT. Elle répond maintenant à ce qu'on lui demande,
     * et pour les deux forfaits sans carte, pas seulement pour l'essai : c'est
     * l'endroit où un lecteur inquiet vérifie que la gratuité ne cache rien.
     * La mécanique de l'essai a sa propre entrée, deux questions plus bas.
     */
    q: {
      fr: "Dois-je donner ma carte de crédit ?",
      en: "Do I need a credit card?",
    },
    a: {
      fr: `Non, à aucun moment. L’inscription n’en demande pas, vos ${TRIAL_DAYS_LABEL.fr} de Passionné non plus, et le forfait Gratuit jamais. Vous ne donnez une carte que le jour où vous choisissez Standard ou Premium.`,
      en: `No, never. Signing up doesn’t ask for one, neither do your ${TRIAL_DAYS_LABEL.en} of Enthusiast, and the Free plan never does. You only give a card the day you choose Standard or Premium.`,
    },
  },
  {
    /**
     * ⚠️ LA QUESTION QUI PORTE TOUT LE DOSSIER DU 2026-09-14. Ne pas la
     * retirer, ne pas l'adoucir, ne pas la déplacer plus bas dans la liste.
     *
     * La page affiche deux choses gratuites de nature différente — un FORFAIT
     * permanent et l'ESSAI d'un autre forfait — et le visiteur les fondait en
     * une seule : « le gratuit dure 14 jours ». Toute la refonte de la grille
     * travaille à empêcher cette déduction ; cette réponse-ci est le filet,
     * pour celui qui l'a quand même faite et vient vérifier.
     *
     * Elle est posée AVANT « Quand mon essai se termine-t-il », délibérément :
     * la peur (« est-ce que je perds tout ? ») précède toujours la curiosité
     * mécanique (« comment ça compte ? »). Répondre dans l'autre ordre, c'est
     * expliquer un décompte à quelqu'un qui croit être sur le point d'être
     * coupé.
     *
     * Elle est reprise telle quelle dans le JSON-LD `FAQPage` : c'est aussi la
     * réponse qu'un assistant citera si on lui demande si iQWine est vraiment
     * gratuit.
     */
    q: {
      fr: `Le forfait Gratuit expire-t-il après les ${TRIAL_DAYS} premiers jours ?`,
      en: `Does the Free plan expire after the first ${TRIAL_DAYS} days?`,
    },
    a: {
      fr: `Non, jamais. Il n’y a pas d’essai d’un côté et un forfait de l’autre : il y a un forfait Gratuit, à 0 $, sans date de fin — et un cadeau de bienvenue posé dessus.

${TRIAL_ON_SIGNUP_FULL.fr} : toute nouvelle inscription reçoit les fonctionnalités du Passionné, sans carte et sans rien demander. Ensuite, ce cadeau s’arrête, mais le forfait, lui, continue : ${FREE_PLAN.maxBottles} bouteilles, ${FREE_PLAN.monthlyRecommendations} conseils personnalisés d’Octave par mois, un utilisateur, aussi longtemps que vous voudrez.

Votre cave, vos notes, vos souvenirs et le palais qu’Octave a appris restent en place. Rien ne se bloque, rien ne passe en lecture seule, rien ne vous est prélevé. Vous choisissez Passionné ou Premium le jour où vous en avez envie, ou jamais.`,
      en: `No, never. There isn’t a trial on one side and a plan on the other: there is a Free plan, at $0, with no end date — and a welcome gift laid on top of it.

${TRIAL_ON_SIGNUP_FULL.en}: every new sign-up receives the Enthusiast features, no card, nothing to ask for. Afterwards the gift stops, but the plan carries on: ${FREE_PLAN.maxBottles} bottles, ${FREE_PLAN.monthlyRecommendations} pieces of personalized advice from Octave per month, one user, for as long as you like.

Your cellar, your notes, your memories and the palate Octave has learned all stay put. Nothing locks, nothing goes read-only, nothing is charged to you. You choose Enthusiast or Premium the day you feel like it, or never.`,
    },
  },
  {
    q: { fr: "Puis-je résilier ?", en: "Can I cancel?" },
    a: {
      fr: "Oui, à tout moment. La résiliation prend effet au renouvellement de votre terme mensuel ou annuel.",
      en: "Yes, anytime. Cancellation takes effect at the renewal of your monthly or annual term.",
    },
  },
  {
    q: { fr: "Mes données sont-elles privées ?", en: "Is my data private?" },
    a: {
      fr: "Vos goûts et votre cave vous appartiennent : chiffrés, privés, exportables.",
      en: "Your taste and cellar are yours: encrypted, private, exportable.",
    },
  },
  {
    q: {
      fr: "Où Octave vérifie-t-il la disponibilité ?",
      en: "Where does Octave check availability?",
    },
    a: {
      fr: "La disponibilité par magasin est vérifiée à partir de données officielles à jour, partout au Québec. Ailleurs, iQWine recommande depuis votre cave et par scan d’étiquette ou de carte.",
      en: "Store-level availability is verified from up-to-date official data, across Québec. Elsewhere, iQWine recommends from your cellar and via label or menu scan.",
    },
  },
  {
    /**
     * LA QUESTION QUI DÉBLOQUE L'ACHAT (2026-08-19).
     *
     * Depuis la refonte du compteur côté application, « 2 / 50 / 200 » est
     * LITTÉRAL : une demande vaut un conseil, quel que soit le
     * travail fourni derrière. Les chiffres du site n'ont pas bougé, mais ils
     * ne disaient pas ce qu'ils comptaient, et celui qui hésite se demande
     * toujours la même chose : est-ce que remplir ma cave va les manger ?
     *
     * La réponse est non, et c'est le meilleur argument de la grille. Elle est
     * placée juste avant « Dois-je saisir toute ma cave ? », qui la prolonge.
     *
     * Règle d'écriture, la même qu'à `CONSEILS_NOTE` : jamais « requêtes »,
     * « crédits », « jetons » ni « appels IA », jamais un montant, jamais
     * « jusqu'à » ni « environ ». On décrit des conseils, pas de la mécanique.
     *
     * ⚠️ LE TERME PUBLIC EST « CONSEIL PERSONNALISÉ D'OCTAVE » depuis le
     * 2026-09-13 (Eric). « Interaction » a disparu de cette réponse comme du
     * reste du site. La phrase d'Eric — « Ajouter ou gérer vos bouteilles dans
     * la cave n'utilise aucun conseil » — est vérifiée vraie dans le code et
     * s'écrit sans réserve : c'est la question qui bloque l'achat.
     */
    q: {
      fr: "Qu’est-ce qu’un conseil personnalisé d’Octave ?",
      en: "What counts as a piece of personalized advice from Octave?",
    },
    a: {
      fr: `Un conseil personnalisé, c’est une fois où vous demandez conseil à Octave et où il vous répond. Une question sur ce que vous allez boire ce soir. Une carte des vins photographiée au restaurant. Un plat que vous lui montrez pour qu’il trouve l’accord. Un menu complet à accorder. Une question posée à voix haute, à table ou en cuisine. Une étiquette étrangère qu’il vous traduit. Une bouteille photographiée en succursale pour savoir si elle vous plairait.

Une demande, un conseil, peu importe le travail que ça lui demande derrière.

Ajouter ou gérer vos bouteilles dans la cave n’utilise aucun conseil. Scanner une étiquette pour entrer une bouteille, photographier une étagère, importer un ticket de caisse ou un fichier, compléter la fiche d’un vin, laisser Octave apprendre votre goût : tout cela fait partie de votre cave, pas de vos conseils. Vous pouvez entrer mille bouteilles sans en toucher un seul.

Vos conseils reviennent chaque mois, le jour de votre facturation. Si vous payez à l’année, ils reviennent quand même tous les mois.

Et si une panne technique empêche Octave de répondre, le conseil vous est rendu.`,
      en: `A piece of personalized advice is one time you ask Octave for advice and it answers. A question about what to drink tonight. A wine list photographed at the restaurant. A dish you show it so it finds the pairing. A whole menu to match, course by course. A question asked out loud, at the table or in the kitchen. A foreign label it translates for you. A bottle photographed in the store, to know whether you would like it.

One request, one piece of advice, however much work it takes behind the scenes.

Adding or managing bottles in your cellar never uses any advice. Scanning a label to add a bottle, photographing a shelf, importing a receipt or a file, completing a wine’s details, letting Octave learn your taste: all of it belongs to your cellar, not to your advice. You can enter a thousand bottles without using a single piece of it.

Your advice comes back every month, on your billing day. If you pay yearly, it still comes back every month.

And if a technical failure keeps Octave from answering, the advice is given back to you.`,
    },
  },
  {
    q: {
      fr: "Dois-je saisir toute ma cave ?",
      en: "Do I have to enter my whole cellar?",
    },
    a: {
      fr: "Non. Octave répond dès la première question ; ajoutez vos bouteilles à votre rythme.",
      en: "No. Octave answers from your very first question; add your bottles at your own pace.",
    },
  },
  {
    q: {
      fr: "Combien de temps avant ma première recommandation ?",
      en: "How long until my first recommendation?",
    },
    a: {
      fr: "Environ 30 secondes.",
      en: "About 30 seconds.",
    },
  },
  {
    q: { fr: "Sur quels appareils ?", en: "On which devices?" },
    a: {
      fr: "Sur le web et sur mobile (iOS et Android), installable en un geste.",
      en: "On the web and on mobile (iOS and Android), installable in one tap.",
    },
  },
  {
    q: {
      fr: `Quand mes ${TRIAL_DAYS} premiers jours se terminent-ils, exactement ?`,
      en: `When exactly do my first ${TRIAL_DAYS} days end?`,
    },
    a: {
      // ── LE SECOND NIVEAU, ET LE SEUL ENDROIT OÙ IL VIT (2026-09-14) ─────
      //
      // Arbitrage d'Eric : « 14 jours » est le message de premier niveau, net,
      // sans astérisque sur place ; les mécaniques additionnelles — la laisse
      // de douze conseils, la prolongation par remplissage de cave — ne
      // doivent pas le brouiller, mais peuvent s'expliquer secondairement.
      // C'est ici, sous une question qui les appelle explicitement, derrière
      // un accordéon replié : personne ne les rencontre par accident, tout le
      // monde les trouve en les cherchant.
      //
      // La prolongation ENTRE dans la copie à cette occasion. Elle joue à
      // l'inverse de la double barrière et le site l'ignorait : on décrivait
      // un essai qui ne pouvait que raccourcir, alors qu'il peut aussi
      // s'allonger jusqu'à `TRIAL_DAYS_MAX` jours. Texte lu depuis
      // `TRIAL_MECHANICS`, tous nombres dérivés.
      fr: `${TRIAL_MECHANICS.fr}

Rien d’automatique à l’arrivée : comme aucune carte n’a été donnée, vous n’êtes jamais débité par surprise. Vous basculez simplement sur le forfait Gratuit, à 0 $, et vous y restez aussi longtemps que vous voulez.`,
      en: `${TRIAL_MECHANICS.en}

Nothing is automatic at the end: since no card was ever given, you are never charged by surprise. You simply move on to the Free plan, at $0, and stay there as long as you like.`,
    },
  },
  {
    q: { fr: "Octave peut-il se tromper ?", en: "Can Octave be wrong?" },
    a: {
      fr: "Octave ne devine pas : il s’appuie sur des données de disponibilité réelles et à jour, votre cave et vos goûts, pas sur un assistant générique. Et il vous dit quand il hésite plutôt que d’inventer.",
      en: "Octave doesn’t guess: it relies on real, up-to-date availability data, your cellar and your taste, not a generic assistant. And it tells you when it’s unsure rather than making things up.",
    },
  },
  {
    /**
     * « Deux mois offerts » A ÉTÉ RETIRÉ D'ICI (2026-09-13), il était devenu
     * faux : l'économie ne vaut pas le même nombre de mois d'un forfait à
     * l'autre, et le compte change à chaque mouvement de prix — 3,37 mois de
     * Standard sous la grille à 129 $, 2,03 sous celle à 149 $. Aucun « n mois
     * offerts » ne peut décrire les deux forfaits à la fois, ni survivre au
     * prochain ajustement.
     *
     * La réponse énonce désormais ce que le lecteur peut vérifier lui-même avec
     * les chiffres de la page : l'équivalent mensuel et l'écart en dollars.
     */
    q: { fr: "Pourquoi choisir l’annuel ?", en: "Why choose annual?" },
    a: { fr: annuel("fr"), en: annuel("en") },
  },
  {
    /**
     * ⚠️ CETTE RÉPONSE NE PROMET RIEN AU-DELÀ DU LANCEMENT, et c'est
     * délibéré (Eric, 2026-09-13). Le prix de lancement n'est pas une garantie
     * à vie : n'y écrivez jamais « votre prix ne changera jamais », « garanti à
     * vie », « prix bloqué » ni « tarif permanent ». Une FAQ est lue comme un
     * engagement, et celle-ci est reprise telle quelle dans le JSON-LD, donc
     * citable hors du site.
     *
     * Le libellé disait « prix fondateur » jusqu'au 2026-09-14 : « fondateur »
     * s'entend comme un statut acquis, donc comme un tarif gardé à vie — la
     * chose même que cette réponse refuse de promettre.
     */
    q: {
      fr: "Qu’est-ce que le prix de lancement ?",
      en: "What is the launch price?",
    },
    a: {
      fr: "C’est le prix de lancement de l’abonnement annuel, offert aux premiers abonnés. Il ne s’applique qu’à l’annuel, jamais au mensuel, et il pourra évoluer par la suite.",
      en: "It is the launch price of the annual subscription, offered to our first subscribers. It applies to the annual plan only, never to monthly, and it may change later on.",
    },
  },
  {
    /**
     * LA QUESTION QUE LA GRILLE POSE, ET QUE PERSONNE N'OSE POSER : « qu'est-ce
     * qu'on me retire si je ne paie pas le plus cher ? » Rien. C'est établi par
     * audit du code applicatif, et c'est le meilleur argument de la page.
     */
    q: {
      fr: "Quelle est la différence entre les forfaits ?",
      en: "What is the difference between the plans?",
    },
    a: {
      fr: "Aucune fonctionnalité n’est réservée à un forfait : la cave, le scan, les accords, le mode Restaurant, l’exploration en magasin et les expériences de dégustation sont dans les trois, Gratuit compris. Ce qui change, c’est le nombre de conseils personnalisés d’Octave chaque mois, la taille de votre cave et le nombre d’utilisateurs — et chaque utilisateur garde son propre palais.",
      en: "No feature is reserved to a plan: the cellar, scanning, pairings, Restaurant mode, in-store exploration and tasting experiences are in all three, Free included. What changes is how much personalized advice you get from Octave each month, the size of your cellar and how many users — and each user keeps their own palate.",
    },
  },
  {
    q: { fr: "Et si je change d’avis ?", en: "What if I change my mind?" },
    a: {
      fr: "Vous résiliez en un geste, en tout temps. En annuel, vous pouvez aussi repasser au mensuel quand vous voulez.",
      en: "Cancel in one tap, anytime. On annual, you can also switch back to monthly whenever you like.",
    },
  },
];
