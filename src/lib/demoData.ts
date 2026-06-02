import type { Locale } from './i18n';

/**
 * Données de démonstration — FACTICES mais crédibles, alignées sur ce que le
 * produit réel sait faire (reco cave / SAQ / hybride, badge dispo SAQ, badge
 * apogée « À son meilleur », explication contextualisée au plat).
 *
 * AUCUN appel API. AUCUNE promesse non supportée par le produit.
 * Réutilisé par le hero vivant (HeroLiveDemo) et la démo jouable (SectionDemo).
 */

export type DemoSource = 'cave' | 'saq' | 'both';
export type DemoMeal = 'lasagne' | 'huitres' | 'boeuf' | 'sushi';
export type WineColor = 'ROUGE' | 'BLANC' | 'EFFERVESCENT';

export interface DemoCard {
  source: 'cave' | 'saq';
  producer: string;
  cuvee: string;
  region: string;
  color: WineColor;
  /** Prix CAD — SAQ uniquement. */
  priceCad?: number;
  /** Badge « Disponible à votre SAQ » — SAQ uniquement. */
  available?: boolean;
  /** Badge « À son meilleur » (apogée) — cave uniquement. */
  atPeak?: boolean;
  why: Record<Locale, string>;
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
      atPeak: true,
      why: {
        fr: "L'acidité du Sangiovese tranche la tomate ; les tanins tiennent tête au bœuf.",
        en: 'Sangiovese acidity cuts the tomato; the tannins stand up to the beef.',
      },
    },
    saq: [
      {
        source: 'saq',
        producer: 'Masciarelli',
        cuvee: "Montepulciano d'Abruzzo",
        region: 'Abruzzes',
        color: 'ROUGE',
        priceCad: 18.95,
        available: true,
        why: {
          fr: 'Souple et fruité, il épouse la sauce sans la dominer.',
          en: 'Supple and fruity, it hugs the sauce without overpowering it.',
        },
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
      atPeak: true,
      why: {
        fr: "Tension minérale et finale iodée : l'accord classique des huîtres.",
        en: 'Mineral tension and a saline finish — the classic oyster pairing.',
      },
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
        why: {
          fr: "Vif et salin, l'acidité tranche le gras et accompagne l'iode.",
          en: 'Bright and saline, its acidity cuts the fat and carries the brine.',
        },
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
      why: {
        fr: 'Les bulles et la tension nettoient le palais entre chaque bouchée crue.',
        en: 'Bubbles and tension cleanse the palate between each raw bite.',
      },
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
        why: {
          fr: 'Sec et citronné, son acidité épouse le poisson cru, le soja et le gingembre.',
          en: 'Dry and citrusy, its acidity meets raw fish, soy and ginger.',
        },
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
      atPeak: true,
      why: {
        fr: 'Structure tannique et profondeur pour une viande longuement braisée.',
        en: 'Tannic structure and depth for a long-braised cut.',
      },
    },
    saq: [
      {
        source: 'saq',
        producer: 'Domaine de la Présidente',
        cuvee: 'Côtes-du-Rhône Villages',
        region: 'Rhône',
        color: 'ROUGE',
        priceCad: 21.9,
        available: true,
        why: {
          fr: "Épicé et charnu, il soutient le braisé sans l'écraser.",
          en: 'Spicy and fleshy, it supports the braise without crushing it.',
        },
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
