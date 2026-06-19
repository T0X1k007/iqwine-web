import type { Locale } from './i18n';

/**
 * Données de démonstration — FACTICES mais crédibles, alignées sur ce que le
 * produit réel sait faire. Depuis C1 (2026-06), chaque carte est une VRAIE fiche
 * de sommelier : personnalité, pourquoi l'accord fonctionne, notes de bouche,
 * fenêtre de dégustation, service, autres accords, et trois axes de profil.
 *
 * AUCUN appel API. AUCUNE promesse non supportée par le produit.
 * Utilisé par la démo jouable (SectionDemo) — la vitrine d'Octave.
 */

export type DemoSource = 'cave' | 'saq' | 'both';
export type DemoMeal = 'lasagne' | 'huitres' | 'boeuf' | 'sushi';
export type WineColor = 'ROUGE' | 'BLANC' | 'EFFERVESCENT';

/** Trois axes universels (0-10) — lisibles pour rouge, blanc ou bulles. */
export interface DemoAxes {
  acidity: number;
  body: number;
  intensity: number;
}

export interface DemoCard {
  source: 'cave' | 'saq';
  producer: string;
  cuvee: string;
  region: string;
  color: WineColor;
  vintage?: number;
  /** Prix CAD — SAQ uniquement. */
  priceCad?: number;
  /** Badge « Disponible à votre SAQ » — SAQ uniquement. */
  available?: boolean;
  /** Badge « À son meilleur » (apogée) — cave uniquement. */
  atPeak?: boolean;
  /** Caractère du vin en quelques mots. */
  personality: Record<Locale, string>;
  /** L'accord : pourquoi ce vin va avec CE plat (voix sommelier). */
  why: Record<Locale, string>;
  /** Notes de bouche : arômes + palais. */
  tasting: Record<Locale, string>;
  /** Fenêtre de dégustation / évolution. */
  window: Record<Locale, string>;
  /** Conseil de service (température, carafage). */
  serving: Record<Locale, string>;
  /** Autres accords possibles. */
  alsoPairs: Record<Locale, string>;
  axes: DemoAxes;
}

interface MealData {
  label: Record<Locale, string>;
  cave: DemoCard;
  saq: DemoCard[];
}

const DATA: Record<DemoMeal, MealData> = {
  lasagne: {
    label: { fr: 'lasagne', en: 'lasagna' },
    cave: {
      source: 'cave',
      producer: 'Castello di Ama',
      cuvee: 'Chianti Classico',
      region: 'Toscane',
      color: 'ROUGE',
      vintage: 2022,
      atPeak: true,
      personality: { fr: 'Élégant, tendu, méditerranéen.', en: 'Elegant, tense, Mediterranean.' },
      why: {
        fr: 'Le Sangiovese a exactement l’acidité qu’il faut pour trancher la tomate et la richesse de la béchamel, pendant que ses tanins fins tiennent tête au bœuf. Ce n’est pas un compromis : ce vin est né pour ce plat.',
        en: 'Sangiovese has precisely the acidity to cut the tomato and the richness of the béchamel, while its fine tannins stand up to the beef. This isn’t a compromise: the wine was born for this dish.',
      },
      tasting: {
        fr: 'Cerise noire, violette, une pointe de cuir et d’herbes sèches. La bouche est droite, savoureuse, la finale poudrée de tanins.',
        en: 'Black cherry, violet, a hint of leather and dried herbs. The palate is straight and savoury, the finish dusted with tannin.',
      },
      window: {
        fr: 'À son apogée, et il s’y tiendra deux à trois ans encore. Aucune raison d’attendre.',
        en: 'At its peak, and it will hold there for two or three more years. No reason to wait.',
      },
      serving: { fr: '16-17 °C, ouvert une demi-heure avant.', en: '16-17 °C, opened half an hour ahead.' },
      alsoPairs: {
        fr: 'Aussi parfait sur un osso buco ou une pizza aux champignons.',
        en: 'Equally perfect with osso buco or a mushroom pizza.',
      },
      axes: { acidity: 8, body: 6, intensity: 7 },
    },
    saq: [
      {
        source: 'saq',
        producer: 'Masciarelli',
        cuvee: "Montepulciano d'Abruzzo",
        region: 'Abruzzes',
        color: 'ROUGE',
        priceCad: 19.65,
        available: true,
        personality: { fr: 'Souple, juteux, généreux.', en: 'Supple, juicy, generous.' },
        why: {
          fr: 'Plus rond et fruité que le Chianti, il épouse la sauce sans jamais la dominer. Le choix facile et chaleureux, prêt ce soir, pour moins de 20 $.',
          en: 'Rounder and fruitier than the Chianti, it hugs the sauce without ever overpowering it. The easy, warming pick — ready tonight, under $20.',
        },
        tasting: {
          fr: 'Prune, mûre, réglisse douce. Tanins fondus, bouche gourmande et accessible.',
          en: 'Plum, blackberry, sweet liquorice. Melted tannins, a generous, easy palate.',
        },
        window: { fr: 'À boire maintenant, sur son fruit.', en: 'Drink now, on its fruit.' },
        serving: { fr: '16 °C.', en: '16 °C.' },
        alsoPairs: { fr: 'Charcuteries, pâtes au ragù, pizza.', en: 'Charcuterie, ragù pasta, pizza.' },
        axes: { acidity: 6, body: 6, intensity: 6 },
      },
    ],
  },
  huitres: {
    label: { fr: 'huîtres', en: 'oysters' },
    cave: {
      source: 'cave',
      producer: 'Domaine William Fèvre',
      cuvee: 'Chablis',
      region: 'Bourgogne',
      color: 'BLANC',
      vintage: 2022,
      atPeak: true,
      personality: { fr: 'Minéral, tendu, salin.', en: 'Mineral, tense, saline.' },
      why: {
        fr: 'L’accord de manuel, et pour une bonne raison : la tension calcaire du Chablis répond à l’iode des huîtres comme un écho. Le citron du verre remplace celui de l’assiette.',
        en: 'The textbook pairing, and for good reason: Chablis’ chalky tension echoes the oysters’ brine. The lemon in the glass replaces the one on the plate.',
      },
      tasting: {
        fr: 'Citron vert, craie mouillée, pomme verte. Bouche vibrante, finale saline qui appelle la bouchée suivante.',
        en: 'Lime, wet chalk, green apple. A vibrant palate, a saline finish that calls for the next bite.',
      },
      window: {
        fr: 'Jeune et électrique aujourd’hui ; il gagnera en rondeur d’ici deux ans.',
        en: 'Young and electric today; it will round out over the next two years.',
      },
      serving: { fr: '9-10 °C.', en: '9-10 °C.' },
      alsoPairs: { fr: 'Aussi sur un ceviche ou un chèvre frais.', en: 'Also with ceviche or fresh goat cheese.' },
      axes: { acidity: 9, body: 4, intensity: 6 },
    },
    saq: [
      {
        source: 'saq',
        producer: 'Château de la Ragotière',
        cuvee: 'Muscadet Sèvre-et-Maine',
        region: 'Loire',
        color: 'BLANC',
        priceCad: 17.45,
        available: true,
        personality: { fr: 'Vif, salin, sans détour.', en: 'Bright, saline, no frills.' },
        why: {
          fr: 'Le compagnon naturel des coquillages : vif et salin, il tranche le gras et porte l’iode. Difficile de faire mieux à ce prix.',
          en: 'The natural companion to shellfish: bright and saline, it cuts the fat and carries the brine. Hard to beat at this price.',
        },
        tasting: {
          fr: 'Agrume, embrun, une pointe de levure (élevé sur lie). Sec et net.',
          en: 'Citrus, sea spray, a touch of yeast (aged on lees). Dry and clean.',
        },
        window: { fr: 'À boire jeune, bien frais.', en: 'Drink young, well chilled.' },
        serving: { fr: '8-9 °C.', en: '8-9 °C.' },
        alsoPairs: { fr: 'Crevettes, calmars frits, sushis.', en: 'Shrimp, fried calamari, sushi.' },
        axes: { acidity: 8, body: 3, intensity: 5 },
      },
    ],
  },
  sushi: {
    label: { fr: 'sushi', en: 'sushi' },
    cave: {
      source: 'cave',
      producer: 'Pierre Gimonnet',
      cuvee: 'Champagne Blanc de Blancs',
      region: 'Champagne',
      color: 'EFFERVESCENT',
      atPeak: true,
      personality: { fr: 'Fin, ciselé, crayeux.', en: 'Fine, chiselled, chalky.' },
      why: {
        fr: 'Les bulles nettoient le palais entre chaque bouchée crue, et la tension du Blanc de Blancs souligne la délicatesse du poisson sans jamais l’écraser. Même le wasabi s’incline.',
        en: 'The bubbles cleanse the palate between each raw bite, and the tension of the Blanc de Blancs lifts the fish’s delicacy without ever crushing it. Even the wasabi bows.',
      },
      tasting: {
        fr: 'Fleur blanche, citron, brioche légère, craie. Mousse fine et crémeuse.',
        en: 'White flowers, lemon, light brioche, chalk. A fine, creamy mousse.',
      },
      window: {
        fr: 'Prêt et radieux ; il tiendra plusieurs années si la patience vous gagne.',
        en: 'Ready and radiant; it will keep for years if patience wins out.',
      },
      serving: { fr: '8-9 °C, dans un verre tulipe.', en: '8-9 °C, in a tulip glass.' },
      alsoPairs: { fr: 'Huîtres, tempura, fromage vieilli.', en: 'Oysters, tempura, aged cheese.' },
      axes: { acidity: 8, body: 4, intensity: 6 },
    },
    saq: [
      {
        source: 'saq',
        producer: 'Trimbach',
        cuvee: 'Riesling',
        region: 'Alsace',
        color: 'BLANC',
        priceCad: 23.95,
        available: true,
        personality: { fr: 'Sec, citronné, droit.', en: 'Dry, citrusy, straight.' },
        why: {
          fr: 'Sec et tranchant, son acidité épouse le poisson cru, dompte le soja et rafraîchit le gingembre. Le Riesling alsacien est le secret le mieux gardé du sushi.',
          en: 'Dry and incisive, its acidity meets raw fish, tames the soy and refreshes the ginger. Alsatian Riesling is sushi’s best-kept secret.',
        },
        tasting: {
          fr: 'Citron, lime, une note pétrolée naissante, finale minérale.',
          en: 'Lemon, lime, a budding petrol note, a mineral finish.',
        },
        window: { fr: 'Excellent maintenant ; les amateurs le gardent dix ans.', en: 'Excellent now; lovers cellar it for ten years.' },
        serving: { fr: '9-10 °C.', en: '9-10 °C.' },
        alsoPairs: { fr: 'Cuisine thaïe, tarte à l’oignon, truite.', en: 'Thai food, onion tart, trout.' },
        axes: { acidity: 9, body: 4, intensity: 6 },
      },
    ],
  },
  boeuf: {
    label: { fr: 'bœuf braisé', en: 'braised beef' },
    cave: {
      source: 'cave',
      producer: 'Pio Cesare',
      cuvee: 'Barolo',
      region: 'Piémont',
      color: 'ROUGE',
      vintage: 2022,
      atPeak: true,
      personality: { fr: 'Puissant, noble, tannique.', en: 'Powerful, noble, tannic.' },
      why: {
        fr: 'Un braisé long appelle un vin de structure : le Nebbiolo répond avec ses tanins fermes et sa profondeur, et les heures passées en cocotte font écho aux années passées en cave. Une grande rencontre.',
        en: 'A long braise calls for a wine of structure: Nebbiolo answers with firm tannins and depth, and the hours in the pot echo the years in the cellar. A great meeting.',
      },
      tasting: {
        fr: 'Rose, goudron, cerise séchée, truffe. Tanins puissants mais nobles, finale interminable.',
        en: 'Rose, tar, dried cherry, truffle. Powerful yet noble tannins, an endless finish.',
      },
      window: {
        fr: 'Il entre dans sa fenêtre : superbe ce soir avec un carafage, sublime d’ici cinq ans.',
        en: 'It’s entering its window: superb tonight with a decant, sublime within five years.',
      },
      serving: { fr: '17-18 °C, carafé une heure.', en: '17-18 °C, decanted for an hour.' },
      alsoPairs: { fr: 'Gibier, risotto à la truffe, fromages affinés.', en: 'Game, truffle risotto, aged cheeses.' },
      axes: { acidity: 7, body: 9, intensity: 9 },
    },
    saq: [
      {
        source: 'saq',
        producer: 'E. Guigal',
        cuvee: 'Côtes-du-Rhône',
        region: 'Rhône',
        color: 'ROUGE',
        vintage: 2022,
        priceCad: 24.5,
        available: true,
        personality: { fr: 'Épicé, charnu, chaleureux.', en: 'Spicy, fleshy, warming.' },
        why: {
          fr: 'Charnu et épicé, il soutient le braisé sans l’écraser, avec juste ce qu’il faut de fraîcheur pour relancer l’appétit. Le rapport plaisir-prix du soir.',
          en: 'Fleshy and spicy, it supports the braise without crushing it, with just enough freshness to reawaken the appetite. Tonight’s best pleasure-to-price.',
        },
        tasting: {
          fr: 'Mûre, poivre, garrigue. Bouche ronde, tanins souples.',
          en: 'Blackberry, pepper, garrigue. A round palate, supple tannins.',
        },
        window: { fr: 'À boire dans les deux prochaines années.', en: 'Drink within the next two years.' },
        serving: { fr: '16-17 °C.', en: '16-17 °C.' },
        alsoPairs: { fr: 'Agneau aux herbes, merguez, ratatouille.', en: 'Herb lamb, merguez, ratatouille.' },
        axes: { acidity: 6, body: 7, intensity: 7 },
      },
    ],
  },
};

export const DEMO_MEALS: DemoMeal[] = ['lasagne', 'sushi', 'huitres', 'boeuf'];

export function mealLabel(meal: DemoMeal, locale: Locale): string {
  return DATA[meal].label[locale];
}

/** Cartes pour un plat + une source. Ordre : cave d'abord, puis SAQ. */
export function getDemoCards(meal: DemoMeal, source: DemoSource): DemoCard[] {
  const m = DATA[meal];
  if (source === 'cave') return [m.cave];
  if (source === 'saq') return m.saq;
  return [m.cave, ...m.saq]; // « Les deux » : le meilleur de chaque source
}
