import { TRIAL_DAYS, TRIAL_RECOS, TRIAL_FULL } from '@/lib/trial';

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
export const FAQ: { q: Record<'fr' | 'en', string>; a: Record<'fr' | 'en', string> }[] = [
  {
    q: { fr: 'Dois-je donner ma carte de crédit ?', en: 'Do I need a credit card?' },
    a: {
      fr: `Non. L’essai dure ${TRIAL_FULL.fr}, sans carte. Vous décidez ensuite.`,
      en: `No. The trial runs for ${TRIAL_FULL.en}, no card. You decide afterwards.`,
    },
  },
  {
    q: { fr: 'Puis-je résilier ?', en: 'Can I cancel?' },
    a: {
      fr: 'Oui, à tout moment. La résiliation prend effet au renouvellement de votre terme mensuel ou annuel.',
      en: 'Yes, anytime. Cancellation takes effect at the renewal of your monthly or annual term.',
    },
  },
  {
    q: { fr: 'Mes données sont-elles privées ?', en: 'Is my data private?' },
    a: {
      fr: 'Vos goûts et votre cave vous appartiennent : chiffrés, privés, exportables.',
      en: 'Your taste and cellar are yours: encrypted, private, exportable.',
    },
  },
  {
    q: { fr: 'Où Octave vérifie-t-il la disponibilité ?', en: 'Where does Octave check availability?' },
    a: {
      fr: 'La disponibilité par magasin est vérifiée à partir de données officielles à jour, partout au Québec. Ailleurs, iQWine recommande depuis votre cave et par scan d’étiquette ou de carte.',
      en: 'Store-level availability is verified from up-to-date official data, across Québec. Elsewhere, iQWine recommends from your cellar and via label or menu scan.',
    },
  },
  {
    /**
     * LA QUESTION QUI DÉBLOQUE L'ACHAT (2026-08-19).
     *
     * Depuis la refonte du compteur côté application, « 50 / 110 / 200 » est
     * LITTÉRAL : une demande de conseil vaut une interaction, quel que soit le
     * travail fourni derrière. Les chiffres du site n'ont pas bougé, mais ils
     * ne disaient pas ce qu'ils comptaient, et celui qui hésite se demande
     * toujours la même chose : est-ce que remplir ma cave va les manger ?
     *
     * La réponse est non, et c'est le meilleur argument de la grille. Elle est
     * placée juste avant « Dois-je saisir toute ma cave ? », qui la prolonge.
     *
     * Règle d'écriture, la même qu'à `INTERACTION_NOTE` : jamais « requêtes »,
     * « crédits », « jetons » ni « appels IA », jamais un montant, jamais
     * « jusqu'à » ni « environ ». On décrit des conseils, pas de la mécanique.
     */
    q: {
      fr: 'Qu’est-ce qu’une interaction avec Octave ?',
      en: 'What counts as an interaction with Octave?',
    },
    a: {
      fr: `Une interaction, c’est une fois où vous demandez conseil à Octave et où il vous répond. Une question sur ce que vous allez boire ce soir. Une carte des vins photographiée au restaurant. Un plat que vous lui montrez pour qu’il trouve l’accord. Un menu complet à accorder. Une question posée à voix haute, à table ou en cuisine. Une étiquette étrangère qu’il vous traduit. Une bouteille photographiée en succursale pour savoir si elle vous plairait.

Une demande, une interaction, peu importe le travail que ça lui demande derrière.

Remplir et tenir votre cave ne consomme rien. Scanner une étiquette pour entrer une bouteille, photographier une étagère, importer un ticket de caisse ou un fichier, compléter la fiche d’un vin, laisser Octave apprendre votre goût : tout cela fait partie de votre cave, pas de vos conseils. Vous pouvez entrer mille bouteilles sans toucher à vos interactions.

Vos interactions reviennent chaque mois, le jour de votre facturation. Si vous payez à l’année, elles reviennent quand même tous les mois.

Et si une panne technique empêche Octave de répondre, l’interaction vous est rendue.`,
      en: `An interaction is one time you ask Octave for advice and it answers. A question about what to drink tonight. A wine list photographed at the restaurant. A dish you show it so it finds the pairing. A whole menu to match, course by course. A question asked out loud, at the table or in the kitchen. A foreign label it translates for you. A bottle photographed in the store, to know whether you would like it.

One request, one interaction, however much work it takes behind the scenes.

Filling and keeping your cellar costs nothing. Scanning a label to add a bottle, photographing a shelf, importing a receipt or a file, completing a wine’s details, letting Octave learn your taste: all of it belongs to your cellar, not to your advice. You can enter a thousand bottles without touching your interactions.

Your interactions come back every month, on your billing day. If you pay yearly, they still come back every month.

And if a technical failure keeps Octave from answering, the interaction is given back to you.`,
    },
  },
  {
    q: { fr: 'Dois-je saisir toute ma cave ?', en: 'Do I have to enter my whole cellar?' },
    a: {
      fr: 'Non. Octave répond dès la première question ; ajoutez vos bouteilles à votre rythme.',
      en: 'No. Octave answers from your very first question; add your bottles at your own pace.',
    },
  },
  {
    q: {
      fr: 'Combien de temps avant ma première recommandation ?',
      en: 'How long until my first recommendation?',
    },
    a: {
      fr: 'Environ 30 secondes.',
      en: 'About 30 seconds.',
    },
  },
  {
    q: { fr: 'Sur quels appareils ?', en: 'On which devices?' },
    a: {
      fr: 'Sur le web et sur mobile (iOS), installable en un geste.',
      en: 'On the web and on mobile (iOS), installable in one tap.',
    },
  },
  {
    q: {
      fr: 'Quand mon essai se termine-t-il, exactement ?',
      en: 'When exactly does my trial end?',
    },
    a: {
      // La question portait « à la fin des 14 jours » et ne décrivait que la
      // barrière temporelle. Un utilisateur actif peut atteindre les douze
      // recommandations en trois jours : la réponse doit nommer les DEUX
      // bornes, et dire laquelle arrive en premier.
      fr: `Au premier des deux : ${TRIAL_DAYS} jours, ou ${TRIAL_RECOS} recommandations d’Octave. Si vous l’utilisez beaucoup, la seconde borne peut arriver avant la première, c’est normal, et vous le voyez venir dans l’application. Rien d’automatique ensuite : comme l’essai est sans carte, vous n’êtes jamais débité par surprise, vous choisissez de continuer ou non. Votre cave et votre palais, eux, restent.`,
      en: `Whichever comes first: ${TRIAL_DAYS} days, or ${TRIAL_RECOS} of Octave’s recommendations. If you use it a lot, the second limit can arrive before the first, that is expected, and you see it coming inside the app. Nothing is automatic afterwards: since the trial needs no card, you are never charged by surprise, you choose whether to continue. Your cellar and your palate stay with you.`,
    },
  },
  {
    q: { fr: 'Octave peut-il se tromper ?', en: 'Can Octave be wrong?' },
    a: {
      fr: 'Octave ne devine pas : il s’appuie sur des données de disponibilité réelles et à jour, votre cave et vos goûts, pas sur un assistant générique. Et il vous dit quand il hésite plutôt que d’inventer.',
      en: 'Octave doesn’t guess: it relies on real, up-to-date availability data, your cellar and your taste, not a generic assistant. And it tells you when it’s unsure rather than making things up.',
    },
  },
  {
    q: { fr: 'Pourquoi choisir l’annuel ?', en: 'Why choose annual?' },
    a: {
      fr: 'Deux mois offerts, et un palais qu’Octave affine toute l’année. Vous vous installez pour de bon, c’est aussi le meilleur prix.',
      en: 'Two months free, and a palate Octave sharpens all year long. You settle in for good, and it’s the best price.',
    },
  },
  {
    q: { fr: 'Et si je change d’avis ?', en: 'What if I change my mind?' },
    a: {
      fr: 'Vous résiliez en un geste, en tout temps. En annuel, vous pouvez aussi repasser au mensuel quand vous voulez.',
      en: 'Cancel in one tap, anytime. On annual, you can also switch back to monthly whenever you like.',
    },
  },
];
