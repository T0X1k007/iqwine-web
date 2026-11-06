import { FREE_PLAN, PREMIUM_PLAN } from '@/lib/plans';
import type { Locale } from '@/lib/locale';

/**
 * LE GUIDE D'OCTAVE, VERSION PUBLIQUE (audit du 2026-11-06, lot P7).
 *
 * ── D'où vient ce texte ───────────────────────────────────────────────────
 * Du Guide de l'application, lu au tag servi `v0.163.0` de `cellier-vin` :
 * messages `Guide.<intention>` (fr.json, en.json) et la curation publique
 * `lib/guide/public.ts` (catégories démarrer, octave, cave, palais, apogée,
 * achat ; jamais abonnement, installer ni données). Chaque réponse est
 * RÉÉCRITE pour un visiteur : à la troisième personne, réponse directe
 * d'abord, 40 à 80 mots, lisible seule.
 *
 * ── Ce qui n'a PAS été repris, et pourquoi ────────────────────────────────
 *   · le mode d'emploi de l'interface (boutons, menus, chemins de l'app :
 *     « Gérer », « ambiances rapides », pastilles QR, historique, réglage des
 *     notifications) : utile dans l'app, sans valeur pour un visiteur ;
 *   · « scanner-plat » : la photo de plat est DORMANTE
 *     (`lib/scan/photo-de-plat.ts`, `PHOTO_DE_PLAT_DORMANTE = true`) ;
 *   · le budget en magasin et le magasin de référence : intentions dont la
 *     clé ou le texte portent un vocabulaire interdit sur le site ;
 *   · abonnement, installation, données : catégories privées de l'app.
 *
 * ── Une seule source pour le texte ET le JSON-LD ──────────────────────────
 * Le `FAQPage` de chaque page du Guide est dérivé de ces entrées : ce que
 * Google lit est mot pour mot ce que la page affiche.
 */

export type Texte = Record<Locale, string>;

export interface QuestionGuide {
  /** L'intention d'origine dans l'app (traçabilité), sert aussi d'ancre. */
  id: string;
  q: Texte;
  a: Texte;
}

export interface SectionGuide {
  id: string;
  titre: Texte;
  questions: QuestionGuide[];
}

export interface PageGuide {
  /** Chemin NU, canonique (dossier). */
  path: string;
  titre: Texte;
  accroche: Texte;
  sections: SectionGuide[];
}

// ─────────────────────────────────────────────────────────────────────────
// Premiers pas (sur la page d'accueil du Guide)
// ─────────────────────────────────────────────────────────────────────────

export const GUIDE_PREMIERS_PAS: QuestionGuide[] = [
  {
    id: 'premiers-pas',
    q: { fr: 'Par où commencer avec iQWine ?', en: 'Where do I start with iQWine?' },
    a: {
      fr: 'Par une envie de ce soir. Dites à Octave ce que vous mangez et regardez ce qu’il propose. Ajoutez ensuite quelques bouteilles à votre cave, notez celles que vous ouvrez, et votre palais se dessine au fil des soirs. Il n’y a pas d’ordre imposé, et nul besoin d’entrer toute votre cave pour recevoir un premier conseil.',
      en: 'With tonight’s craving. Tell Octave what you’re eating and see what he suggests. Then add a few bottles to your cellar, rate the ones you open, and your palate takes shape evening after evening. There’s no set order, and you don’t need to enter your whole cellar to get a first piece of advice.',
    },
  },
  {
    id: 'calibrer-palais-depart',
    q: {
      fr: 'Octave me connaît-il avant ma première dégustation ?',
      en: 'Does Octave know me before my first tasting?',
    },
    a: {
      fr: 'Un peu, si vous le voulez. Au premier lancement, quelques questions sensorielles, toutes facultatives, et un espace pour décrire avec vos mots le vin qui vous plaît lui donnent une première esquisse de votre goût. Rien n’est figé : vous pouvez passer et y revenir, et chaque vin noté ensuite affine le portrait.',
      en: 'A little, if you want him to. On first launch, a few sensory questions, all optional, and a space to describe in your own words the wine you enjoy give him a first sketch of your taste. Nothing is fixed: you can skip and come back, and every wine you rate afterwards sharpens the portrait.',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Page « Les conseils d'Octave »
// ─────────────────────────────────────────────────────────────────────────

export const GUIDE_CONSEILS: PageGuide = {
  path: '/guide/conseils-d-octave',
  titre: { fr: 'Les conseils d’Octave', en: 'Octave’s advice' },
  accroche: {
    fr: 'À table, au restaurant, en magasin : comment tirer le meilleur de votre sommelier, et comment il apprend ce que vous aimez.',
    en: 'At the table, at the restaurant, in store: how to get the best from your sommelier, and how he learns what you love.',
  },
  sections: [
    {
      id: 'a-table',
      titre: { fr: 'À table', en: 'At the table' },
      questions: [
        {
          id: 'bien-decrire-repas',
          q: { fr: 'Comment bien décrire son plat à Octave ?', en: 'How should I describe my dish to Octave?' },
          a: {
            fr: 'Comme à un ami sommelier : le plat, mais aussi sa cuisson, sa sauce et l’ambiance du moment. « Un bon rouge » le laisse deviner ; « magret de canard, sauce aux cerises, soir de fête » le met sur la bonne piste. Si vous comptez acheter, glissez votre budget dans la phrase, par exemple « autour de 30 $ ».',
            en: 'As you would to a sommelier friend: the dish, but also how it’s cooked, its sauce and the mood of the evening. “A good red” leaves him guessing; “duck breast, cherry sauce, a celebration” puts him on the right track. If you plan to buy, slip your budget into the sentence, for example “around $30”.',
          },
        },
        {
          id: 'accord-plusieurs-plats',
          q: { fr: 'Peut-on demander un seul vin pour plusieurs plats ?', en: 'Can I ask for one wine for several dishes?' },
          a: {
            fr: 'Oui. Nommez tous les plats dans une même phrase, reliés par « et » ou « avec ». Octave ne cherche plus alors le vin parfait pour chacun, mais le meilleur compromis pour tout le repas : un vin pivot, avec l’explication de son comportement plat par plat. Il vous propose le compromis ; la décision vous revient.',
            en: 'Yes. Name every dish in one sentence, joined by “and” or “with”. Octave then stops looking for the perfect wine for each and looks for the best compromise for the whole meal: a pivot wine, with an explanation of how it should behave with each dish. He suggests the compromise; the decision is yours.',
          },
        },
        {
          id: 'repas-invites',
          q: { fr: 'Comment choisir le vin d’un repas avec des invités ?', en: 'How do I choose the wine when I have guests?' },
          a: {
            fr: 'Décrivez le repas et l’esprit de la soirée. Pour une grande tablée conviviale, Octave penche vers un vin qui se partage ; pour un souper plus intime, vers un vin de précision. Il choisit l’accord, mais ne compte pas les bouteilles : les quantités restent entre vos mains, et il préfère vous le dire franchement.',
            en: 'Describe the meal and the spirit of the evening. For a big, lively table, Octave leans toward a wine made for sharing; for a more intimate dinner, toward a wine of precision. He chooses the pairing but doesn’t count bottles: quantities stay in your hands, and he’d rather tell you so plainly.',
          },
        },
        {
          id: 'menu-accorde',
          q: { fr: 'Comment accorder toute une soirée, de l’entrée au dessert ?', en: 'How do I pair a whole evening, from starter to dessert?' },
          a: {
            fr: 'Avec un menu accordé. Vous décrivez chaque service et un budget par bouteille ; Octave compose les accords à même votre cave, en pensant la progression de la soirée, du plus délicat au plus ample. Pour chaque vin, il dit pourquoi ce vin et comment le servir : température, carafe, ordre de passage. Le menu se partage par un lien avec votre tablée.',
            en: 'With a paired menu. You describe each course and a budget per bottle; Octave builds the pairings from your own cellar, thinking about how the evening unfolds, from the most delicate to the fullest. For each wine he says why this one and how to serve it: temperature, decanting, order. The menu can be shared with your guests by link.',
          },
        },
      ],
    },
    {
      id: 'comprendre-ses-choix',
      titre: { fr: 'Comprendre ses choix', en: 'Understanding his choices' },
      questions: [
        {
          id: 'pourquoi-ce-vin',
          q: { fr: 'Pourquoi Octave recommande-t-il ce vin plutôt qu’un autre ?', en: 'Why does Octave recommend this wine rather than another?' },
          a: {
            fr: 'Parce que l’accord avec votre plat passe d’abord. Ensuite seulement, votre palais départage les vins qui conviennent et fait remonter ceux qui vous ressemblent le plus. Sous chaque suggestion, Octave explique pourquoi le vin s’accorde au plat et ce qu’il dit de votre profil : c’est là que vit son raisonnement.',
            en: 'Because the match with your dish comes first. Only then does your palate decide between the wines that fit, bringing up the ones most like you. Under each suggestion, Octave explains why the wine suits the dish and what it says about your profile: that’s where his reasoning lives.',
          },
        },
        {
          id: 'audace-troisieme',
          q: { fr: 'Pourquoi la troisième suggestion est-elle souvent inattendue ?', en: 'Why is the third suggestion often unexpected?' },
          a: {
            fr: 'C’est un pas de côté voulu, qui reste dans ce que votre palais peut aimer : une autre couleur que le plat admet, un autre terroir du même registre, ou des bulles quand le plat les permet. Jamais un accord hasardeux, et Octave dit en quoi ce vin s’écarte des deux premiers. Dites « surprends-moi » pour plus d’audace, ou demandez une valeur sûre.',
            en: 'It’s a deliberate step sideways that stays within what your palate can enjoy: another colour the dish allows, another region in the same register, or bubbles when the dish welcomes them. Never a reckless pairing, and Octave says how it differs from the first two. Say “surprise me” for more daring, or ask him to play it safe.',
          },
        },
        {
          id: 'avis-sur-reco',
          q: { fr: 'À quoi sert de donner son avis sur une recommandation ?', en: 'Why give feedback on a recommendation?' },
          a: {
            fr: 'À régler les conseils suivants sur vous plutôt que sur une moyenne. Sous chaque suggestion, un avis se donne en un geste : « Excellent choix », « Pas pour moi », ou le signe que vous avez choisi cette bouteille ou allez l’acheter. C’est à chaud, juste après le conseil, que ce ressenti vaut le plus.',
            en: 'To tune the next pieces of advice to you rather than to an average. Under each suggestion, feedback takes one tap: “Great choice”, “Not for me”, or a sign that you chose this bottle or will buy it. It’s worth the most right after the advice, while the impression is still fresh.',
          },
        },
      ],
    },
    {
      id: 'restaurant-et-magasin',
      titre: { fr: 'Au restaurant et en magasin', en: 'At the restaurant and in store' },
      questions: [
        {
          id: 'carte-vins-resto',
          q: { fr: 'Comment choisir un vin sur une carte au restaurant ?', en: 'How do I choose from a restaurant wine list?' },
          a: {
            fr: 'Dites à Octave ce que vous mangez, puis photographiez la carte des vins. Il lit les vins et leurs prix et fait ressortir trois bouteilles : le meilleur accord, une valeur sûre, un choix plus audacieux. Chaque prix est situé par rapport au reste de cette carte, jamais par rapport au prix en boutique. Un vin mal lu se corrige, et il recalcule.',
            en: 'Tell Octave what you’re eating, then photograph the wine list. He reads the wines and their prices and brings out three bottles: the best pairing, a safe bet and a bolder pick. Each price is placed against the rest of that list, never against the retail price. If he misreads a wine, you correct it and he recalculates.',
          },
        },
        {
          id: 'choisir-source',
          q: { fr: 'Faut-il puiser dans sa cave ou acheter une bouteille ?', en: 'Should I open something from my cellar or buy a bottle?' },
          a: {
            fr: 'C’est vous qui le dites, à chaque demande. « Ma cave » garde Octave parmi vos bouteilles ; « En magasin » l’envoie chercher une bouteille à acheter près de chez vous ; « Les deux » les place côte à côte. Votre budget ne compte que pour un achat, jamais pour les vins déjà chez vous. La disponibilité en magasin couvre tout le Québec.',
            en: 'You decide, with every request. “My cellar” keeps Octave among your bottles; “In store” sends him looking for a bottle to buy near you; “Both” puts them side by side. Your budget only applies to a purchase, never to the wines you already own. In-store availability covers all of Québec.',
          },
        },
        {
          id: 'compagnon-en-magasin',
          q: { fr: 'Cette bouteille en rayon est-elle pour moi ?', en: 'Is this bottle on the shelf right for me?' },
          a: {
            fr: 'Photographiez-la devant le rayon : Octave rend un verdict qui n’est qu’à vous. Son affinité avec votre palais, si elle ferait doublon dans votre cave, le manque qu’elle comblerait, son apogée et son prix. Il ne vend rien et ne vous envoie vers aucun lien d’achat. Au fil de la visite, il garde la trace des bouteilles regardées.',
            en: 'Photograph it right there at the shelf: Octave gives a verdict that is yours alone. How well it fits your palate, whether it would double up on your cellar, the gap it would fill, its peak and its price. He sells nothing and never sends you to a purchase link. As you browse, he keeps track of the bottles you looked at.',
          },
        },
        {
          id: 'guetteur-envies',
          q: { fr: 'Comment savoir quand un vin revient en magasin ?', en: 'How do I know when a wine is back in store?' },
          a: {
            fr: 'Ajoutez-le à Vos envies depuis sa fiche, avec une priorité : À retrouver, À surveiller ou Un jour. Octave surveille sa disponibilité en magasin et vous prévient quand il réapparaît, avec le magasin. Une réserve, dite franchement : la fiche en magasin n’indique pas le millésime exact, il reste à confirmer devant le rayon.',
            en: 'Add it to Your Wishes from its page, with a priority: To find, To watch or Someday. Octave watches its in-store availability and lets you know when it reappears, with the store. One honest caveat: the in-store listing doesn’t show the exact vintage, so check it at the shelf.',
          },
        },
        {
          id: 'guetteur-arrivages',
          q: { fr: 'Que sont les arrivages du mois ?', en: 'What are the monthly arrivals?' },
          a: {
            fr: 'Une courte sélection, chaque mois, des nouveautés en magasin qui rejoignent votre palais. Octave confronte chaque nouveauté à votre profil et ne garde que celles qui vous ressemblent, avec le lien vers leur fiche. Une synthèse, pas un déluge. Le millésime exact, que le magasin n’affiche pas, reste à confirmer.',
            en: 'A short selection, each month, of new in-store wines that match your palate. Octave checks every new arrival against your profile and keeps only those that resemble you, each with a link to its listing. A digest, not a flood. The exact vintage, which the store doesn’t display, is still to be confirmed.',
          },
        },
        {
          id: 'equivalents-vin',
          q: { fr: 'Que faire quand un vin aimé est épuisé ?', en: 'What if a wine I love is sold out?' },
          a: {
            fr: 'Demandez un équivalent depuis sa fiche. Octave cherche en magasin un à trois vins réels, disponibles et au profil proche, chacun avec la raison qui le justifie. Quand rien ne tient vraiment la comparaison, il le dit, plutôt que de proposer un vin qui ne ressemble au vôtre que de nom.',
            en: 'Ask for an equivalent from its page. Octave looks in store for one to three real, available wines with a similar profile, each with the reason behind it. When nothing truly compares, he says so, rather than suggesting a wine that resembles yours in name only.',
          },
        },
      ],
    },
    {
      id: 'votre-palais',
      titre: { fr: 'Votre palais', en: 'Your palate' },
      questions: [
        {
          id: 'octave-apprend-palais',
          q: { fr: 'Comment Octave apprend-il mes goûts ?', en: 'How does Octave learn my taste?' },
          a: {
            fr: 'En écoutant vos dégustations. Chaque vin que vous notez lui en dit un peu plus sur ce qui vous séduit et ce qui vous laisse froid, et ses recommandations s’appuient sur votre histoire plutôt que sur une moyenne. C’est la note chiffrée qu’il écoute pour affiner votre palais ; vos mots, eux, enrichissent votre souvenir. Sur tous les forfaits.',
            en: 'By listening to your tastings. Every wine you rate tells him a little more about what wins you over and what leaves you cold, and his recommendations rest on your history rather than an average. The numeric score is what he listens to when refining your palate; your words enrich your memories. On every plan.',
          },
        },
        {
          id: 'lire-mon-palais',
          q: { fr: 'Peut-on voir ce qu’Octave a compris de soi ?', en: 'Can I see what Octave has understood about me?' },
          a: {
            fr: 'Oui, votre palais a sa propre page. Un badge dit sa maturité, de naissant à mûr, jamais en pourcentage, avec le nombre de dégustations qui le nourrissent. « Ce qu’Octave a appris » rassemble ses observations, chacune avec le nombre de dégustations sur lesquelles elle s’appuie. Il faut quelques dégustations pour que la page prenne vie.',
            en: 'Yes, your palate has its own page. A badge shows its maturity, from nascent to ripe, never as a percentage, along with the number of tastings behind it. “What Octave has learned” gathers his observations, each showing how many tastings it rests on. It takes a few tastings for the page to come alive.',
          },
        },
        {
          id: 'profil-declare',
          q: { fr: 'Peut-on dire soi-même ce qu’on aime ?', en: 'Can I tell Octave what I like myself?' },
          a: {
            fr: 'Oui. Votre profil gustatif se règle sur cinq axes, du classique à l’aventureux ou du frais à l’ample par exemple, et accueille vos affinités et vos mots libres. Octave le lit à chaque recommandation, sans jamais le confondre avec ce qu’il déduit de vos verres : ce que vous affirmez aimer et ce que vos dégustations révèlent restent deux voix distinctes.',
            en: 'Yes. Your tasting profile is set along five axes, from classic to adventurous or crisp to full-bodied for example, and welcomes your affinities and your own words. Octave reads it with every recommendation, never mixing it with what he deduces from your glasses: what you say you like and what your tastings reveal remain two distinct voices.',
          },
        },
        {
          id: 'memoire-reperes',
          q: { fr: 'Peut-on remettre à zéro ce qu’Octave a retenu ?', en: 'Can I reset what Octave has remembered?' },
          a: {
            fr: 'Oui. Sur la page de votre palais, Octave montre ce qu’il a retenu de vos habitudes : vos styles, vos régions de cœur, les ambiances qui reviennent, l’ordre de grandeur de vos choix, jamais un chiffre exact. « Réinitialiser les repères » lui rend la page blanche ; vos bouteilles, vos dégustations et votre compte restent intacts.',
            en: 'Yes. On your palate page, Octave shows what he has picked up from your habits: your styles, your favourite regions, the moods that recur, the price range of your choices, never an exact figure. “Reset cues” gives him a blank page; your bottles, your tastings and your account stay intact.',
          },
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Page « Votre cave »
// ─────────────────────────────────────────────────────────────────────────

export const GUIDE_CAVE: PageGuide = {
  path: '/guide/votre-cave',
  titre: { fr: 'Votre cave', en: 'Your cellar' },
  accroche: {
    fr: 'De la bouteille qui entre à celle qu’on sert : entrer, retrouver, déguster, garder.',
    en: 'From the bottle that comes in to the one you pour: adding, finding, tasting, keeping.',
  },
  sections: [
    {
      id: 'entrer-vos-bouteilles',
      titre: { fr: 'Entrer vos bouteilles', en: 'Adding your bottles' },
      questions: [
        {
          id: 'ajouter-bouteille',
          q: { fr: 'Comment ajouter une bouteille à sa cave ?', en: 'How do I add a bottle to my cellar?' },
          a: {
            fr: 'Par une recherche, le code-barres ou une photo de l’étiquette. Vous précisez ensuite le millésime, le format, le prix, la date et la source d’achat, puis l’emplacement : section, casier, position. Une bouteille offerte ou réservée à une occasion se marque comme telle, pour qu’Octave ne vous la propose pas par mégarde.',
            en: 'By searching, scanning the barcode or photographing the label. Then you add the vintage, the size, the price, the purchase date and source, and its spot: section, rack, position. A bottle received as a gift or set aside for an occasion can be marked as such, so Octave won’t suggest it by mistake.',
          },
        },
        {
          id: 'scanner-bouteille',
          q: { fr: 'Une photo de l’étiquette suffit-elle ?', en: 'Is a photo of the label enough?' },
          a: {
            fr: 'Oui. Montrez l’étiquette : Octave reconnaît le vin et remplit l’appellation, le millésime, l’apogée et la valeur. Vous confirmez toujours avant que rien ne soit enregistré. Le même geste, au restaurant, sert à photographier la carte des vins.',
            en: 'Yes. Show the label: Octave recognizes the wine and fills in the appellation, vintage, drinking window and value. You always confirm before anything is saved. The same gesture, at the restaurant, photographs the wine list.',
          },
        },
        {
          id: 'ajout-rafale',
          q: { fr: 'Comment inventorier beaucoup de bouteilles d’un coup ?', en: 'How do I log a lot of bottles at once?' },
          a: {
            fr: 'Avec l’Inventaire express : vous photographiez vos étagères une à une, et Octave lit les étiquettes. Il distingue ce qui est déjà en cave de ce qui est nouveau, et dit quand une étiquette lui échappe plutôt que de deviner. Vous révisez la liste, quantités et emplacements compris, et rien n’entre sans votre validation.',
            en: 'With Express inventory: you photograph your shelves one at a time, and Octave reads the labels. He tells what’s already in your cellar from what’s new, and says when a label escapes him rather than guessing. You review the list, quantities and locations included, and nothing goes in without your approval.',
          },
        },
        {
          id: 'importer-collection',
          q: { fr: 'Peut-on importer sa cave depuis un fichier ou une autre application ?', en: 'Can I import my cellar from a file or another app?' },
          a: {
            fr: 'Oui. Apportez un fichier CSV, Excel ou JSON : votre tableur, ou l’export d’une autre application de cave. Octave reconnaît vos colonnes (nom, millésime, prix), vous montre ce qu’il a compris, et rien n’entre sans votre accord. Les vins mal reconnus s’affichent pour que vous les corrigiez d’un regard, puis l’import s’applique.',
            en: 'Yes. Bring a CSV, Excel or JSON file: your spreadsheet, or an export from another cellar app. Octave recognizes your columns (name, vintage, price), shows you what he understood, and nothing goes in without your say. Wines he couldn’t recognize are flagged so you can fix them at a glance, then the import is applied.',
          },
        },
      ],
    },
    {
      id: 'retrouver-et-choisir',
      titre: { fr: 'Retrouver et choisir', en: 'Finding and choosing' },
      questions: [
        {
          id: 'retrouver-bouteille',
          q: { fr: 'Comment retrouver rapidement une bouteille ?', en: 'How do I quickly find a bottle?' },
          a: {
            fr: 'Tapez ce dont vous vous souvenez : un producteur, une cuvée, une région, une appellation. La liste se resserre à mesure, et des filtres trient par couleur, millésime ou maturité. Si vous pensez votre cave en images, la vue visuelle descend section par section jusqu’à l’emplacement de la bouteille.',
            en: 'Type whatever you remember: a producer, a cuvée, a region, an appellation. The list narrows as you go, and filters sort by colour, vintage or maturity. If you picture your cellar rather than list it, the visual view takes you down section by section to the bottle’s exact spot.',
          },
        },
        {
          id: 'vue-visuelle-cave',
          q: { fr: 'À quoi ressemble la vue visuelle de la cave ?', en: 'What does the visual cellar view look like?' },
          a: {
            fr: 'À votre vraie cave, par niveaux : d’abord vos sections, avec leur remplissage, leur valeur et leurs millésimes, puis les rangées et les casiers, puis chaque emplacement et la bouteille qui l’occupe. Depuis la fiche d’un vin, sa place apparaît en surbrillance : vous la trouvez d’un regard.',
            en: 'Like your real cellar, level by level: first your sections, with how full they are, their value and their vintages, then rows and racks, then each slot and the bottle in it. From a wine’s page, its spot is highlighted: you find it at a glance.',
          },
        },
        {
          id: 'choisir-dans-ma-cave',
          q: { fr: 'Quelle bouteille ouvrir ce soir ?', en: 'Which bottle should I open tonight?' },
          a: {
            fr: 'Celle qui vous attend. Octave place en tête les bouteilles proches de leur apogée, celles qui méritent d’être bues maintenant, et le repère « À boire maintenant » les signale. Si un plat ou une ambiance vous habite, dites-le en quelques mots : il cherche alors dans votre cave plutôt qu’en magasin. La bonne bouteille reste celle dont vous avez envie.',
            en: 'The one that’s waiting for you. Octave puts first the bottles near their peak, the ones that deserve to be drunk now, and the “Drink now” label points them out. If a dish or a mood is on your mind, say it in a few words: he’ll look in your cellar rather than in store. The right bottle is still the one you feel like.',
          },
        },
        {
          id: 'cave-partagee',
          q: { fr: 'Peut-on partager sa cave avec d’autres personnes ?', en: 'Can I share my cellar with other people?' },
          a: {
            fr: `Oui, sur invitation par courriel, avec un rôle : « Éditeur » pour ajouter, retirer ou modifier des bouteilles, « Lecteur » pour consulter la cave, noter et demander conseil à Octave. Chaque voix reste distincte : vos notes et celles d’un autre membre coexistent, jamais l’une par-dessus l’autre. Le nombre de personnes dépend du forfait, jusqu’à ${PREMIUM_PLAN.includedUsers} avec le Premium.`,
            en: `Yes, by email invitation, with a role: “Editor” to add, remove or change bottles, “Reader” to browse the cellar, rate wines and ask Octave for advice. Each voice stays distinct: your notes and another member’s sit side by side, never one over the other. The number of people depends on the plan, up to ${PREMIUM_PLAN.includedUsers} with Premium.`,
          },
        },
      ],
    },
    {
      id: 'deguster-et-se-souvenir',
      titre: { fr: 'Déguster et se souvenir', en: 'Tasting and remembering' },
      questions: [
        {
          id: 'noter-degustation',
          q: { fr: 'Comment noter un vin qu’on déguste ?', en: 'How do I rate a wine I’m tasting?' },
          a: {
            fr: 'En un geste d’abord : quatre paliers d’appréciation suffisent. Si le vin mérite plus, une note sur 100 s’ouvre, avec quelques observations à cocher, vos mots libres et le contexte du repas. Chaque couche est facultative. C’est la note chiffrée qu’Octave écoute pour affiner votre palais ; le reste enrichit votre souvenir.',
            en: 'With one tap first: four levels of appreciation are enough. If the wine deserves more, a score out of 100 opens up, with a few observations to tick, your own words and the context of the meal. Every layer is optional. The score is what Octave listens to when refining your palate; the rest enriches your memory of it.',
          },
        },
        {
          id: 'dicter-degustation',
          q: { fr: 'Peut-on dicter ses notes de dégustation ?', en: 'Can I dictate my tasting notes?' },
          a: {
            fr: 'Oui. Là où vous écririez, un court enregistrement se lance : vous parlez, et vos mots deviennent du texte, prêt à être relu et corrigé avant d’être gardé. Ce sont vos mots qui restent, pas l’enregistrement. Le texte dicté compte exactement comme un texte tapé pour affiner votre palais.',
            en: 'Yes. Wherever you would type, a short recording starts: you speak, and your words become text, ready to be reread and corrected before it’s saved. Your words are what’s kept, not the recording. Dictated text counts exactly like typed text when refining your palate.',
          },
        },
        {
          id: 'boire-noter-retirer',
          q: { fr: 'Boire, noter ou retirer : quelle différence ?', en: 'Drink, rate or remove: what’s the difference?' },
          a: {
            fr: 'Boire, c’est vivre l’instant ; noter, c’est en garder la trace et apprendre votre goût à Octave ; retirer, c’est dire pourquoi une bouteille quitte la cave : offerte, vendue, cassée ou perdue. « Boire & noter » fait les deux d’un coup. Si un vin compte pour vous, notez-le sur le moment : c’est ce qui affine vos prochains conseils.',
            en: 'Drinking is living the moment; rating keeps a trace of it and teaches Octave your taste; removing says why a bottle leaves the cellar: gifted, sold, broken or lost. “Drink & note” does both at once. If a wine matters to you, rate it in the moment: that’s what sharpens your next pieces of advice.',
          },
        },
        {
          id: 'carnet-bues',
          q: { fr: 'Où retrouver les vins déjà bus ?', en: 'Where do I find the wines I’ve already drunk?' },
          a: {
            fr: 'Dans le carnet. Une bouteille bue quitte votre cave et y entre, avec sa date, son moment et vos impressions, de la plus récente à la plus ancienne. Vous y relisez une dégustation passée, ou complétez à tête reposée une note écrite trop vite. C’est la mémoire de ce que vous avez vécu, pas seulement de ce que vous possédez.',
            en: 'In your journal. A bottle you drink leaves your cellar and goes there, with its date, its moment and your impressions, from most recent to oldest. You can reread a past tasting, or finish a hurried note at leisure. It remembers what you lived, not just what you own.',
          },
        },
        {
          id: 'editer-vin',
          q: { fr: 'Peut-on corriger la fiche d’un vin ?', en: 'Can I correct a wine’s details?' },
          a: {
            fr: 'Oui, et trois choses vous appartiennent : la photo, le prix et vos mots. Reprenez la photo si l’image trouvée n’est pas la bonne, indiquez le prix réellement payé pour ce millésime, et écrivez votre propre description, qui vit à côté de celle d’Octave, jamais par-dessus. Ses estimations sont des points de départ honnêtes, pas des vérités gravées.',
            en: 'Yes, and three things belong to you: the photo, the price and your words. Retake the photo if the one found isn’t right, enter the price you actually paid for that vintage, and write your own description, which sits beside Octave’s, never on top of it. His estimates are honest starting points, not truths set in stone.',
          },
        },
      ],
    },
    {
      id: 'garder-et-servir',
      titre: { fr: 'Garder et servir', en: 'Keeping and serving' },
      questions: [
        {
          id: 'comprendre-alertes',
          q: { fr: 'À quoi servent les alertes ?', en: 'What are the alerts for?' },
          a: {
            fr: 'À vous prévenir quand un moment le mérite vraiment : une bouteille prête à boire, une fenêtre qui se referme, une envie de nouveau disponible en magasin, des arrivages qui vous ressemblent. Octave regroupe et choisit pour ne jamais vous submerger. Une alerte lue s’écarte d’un geste, et leur intensité se règle selon votre goût.',
            en: 'To let you know when a moment truly calls for it: a bottle ready to drink, a window closing, a wished-for wine back in store, new arrivals that suit you. Octave groups and chooses so he never overwhelms you. A read alert is dismissed with one gesture, and how often you hear from him is up to you.',
          },
        },
        {
          id: 'service-vin',
          q: { fr: 'Comment servir un vin au mieux ?', en: 'How do I serve a wine at its best?' },
          a: {
            fr: 'Avec les repères propres à chaque bouteille. Sur sa fiche, Octave indique la température idéale, quand la sortir de la cave ou la rafraîchir, s’il faut la carafer, simplement l’ouvrir ou la servir telle quelle, et s’il faut la redresser à l’avance pour laisser tomber un dépôt. Une phrase dit pourquoi. Un vieux vin reçoit peu d’air, jamais une longue carafe.',
            en: 'With guidance specific to each bottle. On its page, Octave gives the ideal temperature, when to take it out of the cellar or chill it, whether to decant it, just open it or pour it as is, and whether to stand it up ahead of time to let the sediment settle. One sentence says why. An old wine gets little air, never a long decant.',
          },
        },
      ],
    },
  ],
};

/** Les pages thématiques, dans l'ordre de la page d'accueil du Guide. */
export const PAGES_GUIDE: PageGuide[] = [GUIDE_CONSEILS, GUIDE_CAVE];

/** Toutes les questions d'une page, à plat (pour le JSON-LD). */
export function questionsDe(page: PageGuide): QuestionGuide[] {
  return page.sections.flatMap((s) => s.questions);
}

/** Rappel des chiffres du Gratuit, pour les pages qui les citent. */
export const GRATUIT = {
  bouteilles: FREE_PLAN.maxBottles,
  conseils: FREE_PLAN.monthlyRecommendations,
  personnes: FREE_PLAN.includedUsers,
};
