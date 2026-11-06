import { FREE_PLAN, PREMIUM_PLAN, STANDARD_PLAN } from '@/lib/plans';
import { TRIAL_DAYS, TRIAL_RECOS } from '@/lib/trial';
import type { Texte } from '@/lib/guide';

/**
 * LES QUESTIONS DES PAGES CELLIER ET APOGÉE (audit du 2026-11-06, P1 et P2).
 *
 * Visibles (accordéon toujours dans le HTML, `SectionFaq`) ET balisées en
 * `FAQPage` par le `page.tsx` de chaque page : une seule source.
 *
 * Preuves produit, au tag servi `v0.163.0` de `cellier-vin` :
 *   · Gratuit : `lib/billing/plan-catalog.ts` l. 351-358 (`FREE_BOTTLES = 100`,
 *     `FREE_RECOMMENDATIONS = 2`, `maxMembers: 1`), aucun plafond mensuel
 *     d'ajouts ni de scans l. 365-369, droits acquis au-dessus du plafond
 *     l. 342-344 ; Passionné 200 bouteilles l. 161, Premium illimité l. 204 ;
 *   · essai : `TRIAL_DAYS = 14` l. 73, `TRIAL_AI_RECOMMENDATIONS = 25` l. 77 ;
 *   · import : `app/(authed)/import/import-flow.tsx` l. 343 (CSV, TSV, Excel,
 *     JSON, XML acceptés), `lib/import/parse.ts` l. 312-320 ;
 *   · Android sans achat : `lib/native/contexte-natif.ts` l. 114-116
 *     (`achatPossible` rend faux sur Android natif) ; aucun abonnement Play ;
 *   · apogée : `components/data-viz/FenetreDegustation.tsx` et les libellés
 *     `Apogee.carte.*` de `messages/fr.json` / `en.json`, `Guide.pourquoi-apogee`,
 *     `Guide.apogee-vs-vers`, `Guide.editer-apogee`.
 *
 * Les nombres se lisent dans `plans.ts` et `trial.ts` du site, eux-mêmes
 * alignés sur l'app : une réponse qui cite un chiffre ne le recopie jamais.
 */

const n = (v: number) => String(v);

export const FAQ_CELLIER: { q: Texte; a: Texte }[] = [
  {
    q: { fr: 'L’application de cave iQWine est-elle gratuite ?', en: 'Is the iQWine cellar app free?' },
    a: {
      fr: `Oui. Le forfait Gratuit n’a pas de date de fin et ne demande aucune carte : jusqu’à ${n(FREE_PLAN.maxBottles)} bouteilles, ${n(FREE_PLAN.monthlyRecommendations)} conseils personnalisés d’Octave par mois, une personne. À l’inscription, vous recevez en plus les fonctionnalités du Passionné pendant ${n(TRIAL_DAYS)} jours, ${n(TRIAL_RECOS)} conseils compris. Ensuite, vous restez sur le Gratuit, votre cave intacte.`,
      en: `Yes. The Free plan has no end date and asks for no card: up to ${n(FREE_PLAN.maxBottles)} bottles, ${n(FREE_PLAN.monthlyRecommendations)} pieces of personalized advice from Octave per month, one person. When you sign up, you also get the Enthusiast features for ${n(TRIAL_DAYS)} days, ${n(TRIAL_RECOS)} pieces of advice included. After that, you stay on Free, your cellar intact.`,
    },
  },
  {
    q: { fr: 'Combien de bouteilles peut-on entrer ?', en: 'How many bottles can I add?' },
    a: {
      fr: `${n(FREE_PLAN.maxBottles)} avec le Gratuit, ${n(STANDARD_PLAN.maxBottles)} avec le Passionné, sans limite avec le Premium. Aucun forfait ne limite le nombre d’ajouts ou de scans par mois : seule la taille de la cave compte. Et ajouter ou ranger vos bouteilles n’utilise aucun conseil d’Octave.`,
      en: `${n(FREE_PLAN.maxBottles)} on Free, ${n(STANDARD_PLAN.maxBottles)} on Enthusiast, unlimited on Premium. No plan limits how many bottles you add or scan each month: only the size of the cellar counts. And adding or organizing bottles never uses any of Octave’s advice.`,
    },
  },
  {
    q: {
      fr: 'Puis-je importer ma cave depuis Excel ou une autre application ?',
      en: 'Can I import my cellar from Excel or another app?',
    },
    a: {
      fr: 'Oui. Apportez un fichier CSV, Excel ou JSON : votre tableur, ou l’export d’une autre application de cave. Octave reconnaît vos colonnes, vous montre ce qu’il a compris, et rien n’entre sans votre accord. Les vins mal reconnus s’affichent pour que vous les corrigiez d’un regard.',
      en: 'Yes. Bring a CSV, Excel or JSON file: your spreadsheet, or an export from another cellar app. Octave recognizes your columns, shows you what he understood, and nothing goes in without your say. Wines he couldn’t recognize are flagged so you can fix them at a glance.',
    },
  },
  {
    q: { fr: 'Sur quels appareils ?', en: 'On which devices?' },
    a: {
      fr: 'Sur iPhone (App Store), sur Android (Google Play, au Canada) et sur le web. Sur Android, l’application ne propose pas d’achat : un forfait payant se choisit sur le web. Vous retrouvez votre compte et votre cave d’un appareil à l’autre.',
      en: 'On iPhone (App Store), on Android (Google Play, in Canada) and on the web. On Android, the app doesn’t sell anything: a paid plan is chosen on the web. Your account and your cellar follow you from one device to another.',
    },
  },
  {
    q: { fr: 'Puis-je gérer plusieurs caves ?', en: 'Can I manage several cellars?' },
    a: {
      fr: 'Oui : la maison, le chalet, chacune avec sa structure, ses sections, ses rangées et ses cases, et chaque bouteille à sa vraie place. La cave reste lisible hors ligne, même au fond d’une cave sans réseau.',
      en: 'Yes: the house, the cottage, each with its own layout, sections, rows and slots, and every bottle in its real place. Your cellar stays readable offline, even deep in a cellar with no signal.',
    },
  },
  {
    q: { fr: 'Peut-on partager sa cave ?', en: 'Can I share my cellar?' },
    a: {
      fr: `Oui, avec le Premium, jusqu’à ${n(PREMIUM_PLAN.includedUsers)} personnes, chacune avec son propre palais. Un membre s’invite par courriel, comme « Éditeur » pour agir sur la cave ou « Lecteur » pour la consulter, noter et demander conseil à Octave.`,
      en: `Yes, with Premium, up to ${n(PREMIUM_PLAN.includedUsers)} people, each with their own palate. A member is invited by email, as an “Editor” to act on the cellar or a “Reader” to browse it, rate wines and ask Octave for advice.`,
    },
  },
];

export const FAQ_APOGEE: { q: Texte; a: Texte }[] = [
  {
    q: { fr: 'Qu’est-ce que l’apogée d’un vin ?', en: 'What is a wine’s peak?' },
    a: {
      fr: 'C’est la période où un vin donne le meilleur de lui-même. Un vin évolue en bouteille : trop tôt, il est encore fermé ; à son apogée, il s’exprime pleinement ; trop tard, il s’essouffle. Octave résume ce parcours en années pour chaque bouteille de votre cave, afin que vous choisissiez le bon soir sans deviner.',
      en: 'It’s the period when a wine is at its very best. Wine evolves in the bottle: too early, it’s still closed; at its peak, it fully expresses itself; too late, it runs out of breath. Octave sums up that journey in years for every bottle in your cellar, so you can pick the right evening without guessing.',
    },
  },
  {
    q: { fr: 'Comment Octave sait-il quand ouvrir une bouteille ?', en: 'How does Octave know when to open a bottle?' },
    a: {
      fr: 'Il cherche d’abord des dates publiées pour ce vin et ce millésime : celles du producteur, ou la fiche du vin en magasin. À défaut, il estime la fenêtre pour ce vin précis. La pastille de la carte dit d’où vient la fenêtre, et trois petites barres sa fiabilité. Un grand format garde plus longtemps : la fenêtre est estimée pour lui.',
      en: 'He first looks for dates published for that wine and vintage: the producer’s, or the in-store listing. Failing that, he estimates the window for that particular wine. The badge on the card says where the window comes from, and three small bars how reliable it is. A large format keeps longer: the window is estimated for it.',
    },
  },
  {
    q: { fr: 'Que veut dire « Sûr jusqu’en » ?', en: 'What does “Safe until” mean?' },
    a: {
      fr: 'C’est l’année jusqu’à laquelle, selon Octave, ce vin restera vraiment bon après son apogée. La garde maximale va plus loin : c’est la limite qu’il peut atteindre en théorie, bien conservé, avec un déclin doux entre les deux. « Sûr jusqu’en » est un jugement porté sur ce vin, pas une garantie.',
      en: 'It’s the year until which, in Octave’s judgment, this wine will stay truly good after its peak. Maximum ageing goes further: the limit it can reach in theory, well stored, with a gentle decline in between. “Safe until” is a judgment about this wine, not a guarantee.',
    },
  },
  {
    q: { fr: '« Apogée confirmée » ou « Vers 2028 » : quelle différence ?', en: '“Confirmed peak” or “Around 2028”: what’s the difference?' },
    a: {
      fr: '« Vers 2028 » signale une estimation : l’année autour de laquelle Octave juge que le vin sera à son meilleur. Quand le producteur publie l’apogée, la carte dit « Apogée confirmée » et donne l’année seule. Dans les deux cas, rien ne vous oblige à ouvrir pile cette année-là : c’est un repère, jamais une échéance.',
      en: '“Around 2028” marks an estimate: the year around which Octave judges the wine will be at its best. When the producer publishes the peak, the card says “Confirmed peak” and shows the year alone. Either way, nothing obliges you to open it that exact year: it’s a guide, never a deadline.',
    },
  },
  {
    q: { fr: 'Que veut dire « Vin évolué, à goûter » ?', en: 'What does “Evolved wine, worth tasting” mean?' },
    a: {
      fr: 'C’est ce que la carte affiche pour un vin déjà bien évolué le jour où vous l’ajoutez à votre cave. Octave ne vous presse pas pour lui : il vous invite à le goûter pour juger vous-même où il en est.',
      en: 'That’s what the card shows for a wine that is already well evolved on the day you add it to your cellar. Octave doesn’t rush you with it: he invites you to taste it and judge for yourself where it stands.',
    },
  },
  {
    q: { fr: 'Peut-on corriger la fenêtre d’un vin ?', en: 'Can I correct a wine’s window?' },
    a: {
      fr: 'Oui. Sur la fiche du vin, la fenêtre s’ajuste en trois années : début, apogée, fin, dans cet ordre. Une fois enregistrée, votre fenêtre remplace l’estimation d’Octave partout, et vos bouteilles se replacent selon elle. Utile quand vous connaissez déjà ce vin, ou que vous l’aimez plus jeune ou plus mûr.',
      en: 'Yes. On the wine’s page, the window adjusts in three years: start, peak, end, in that order. Once saved, your window replaces Octave’s estimate everywhere, and your bottles reorder around it. Handy when you already know the wine, or like it younger or more mature.',
    },
  },
  {
    q: { fr: 'Ma cave change-t-elle quelque chose ?', en: 'Does my cellar make a difference?' },
    a: {
      fr: 'Oui. Toutes ces dates supposent une cave fraîche, sombre et stable. Une bouteille gardée dans une pièce chaude ou à la lumière évolue plus vite. C’est pourquoi Octave parle de repères : un repère, jamais une garantie, parce qu’une bouteille reste vivante.',
      en: 'Yes. All these dates assume a cool, dark, stable cellar. A bottle kept in a warm room or in the light evolves faster. That’s why Octave speaks of guides: a guide, never a guarantee, because a bottle stays alive.',
    },
  },
];
