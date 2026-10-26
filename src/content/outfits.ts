// The 3 M0 test outfits, the default appearance and the starter outfit.
import type { Appearance, Outfit } from '../game/save';

export const DEFAULT_APPEARANCE: Appearance = {
  skinTone: 'skin.caramel',
  hairStyle: 'hairstyle.doll-curls',
  hairColor: 'hair.dark-brown',
  eyeStyle: 'eyes.round',
  eyeColor: 'eye.brown',
  brows: 'brows.soft',
  freckles: true,
};

export interface TestOutfit {
  id: string;
  name: string;
  outfit: Outfit;
}

export const TEST_OUTFITS: TestOutfit[] = [
  {
    id: 'look.harbour-day',
    name: 'Harbour Day',
    outfit: {
      top: { itemId: 'top.sailor-tee' },
      bottom: { itemId: 'bottom.a-line-skirt' },
      shoes: { itemId: 'shoes.sneakers' },
      bag: { itemId: 'bag.crossbody' },
    },
  },
  {
    id: 'look.picnic',
    name: 'Picnic',
    outfit: {
      dress: { itemId: 'dress.picnic' },
      shoes: { itemId: 'shoes.mary-janes' },
      headwear: { itemId: 'headwear.sun-hat' },
    },
  },
  {
    id: 'look.cozy',
    name: 'Cozy Day',
    outfit: {
      top: { itemId: 'top.long-tee' },
      bottom: { itemId: 'bottom.wide-trousers' },
      outerwear: { itemId: 'outerwear.cardigan' },
      shoes: { itemId: 'shoes.boots' },
      eyewear: { itemId: 'eyewear.round-glasses' },
    },
  },
];

export const STARTER_OUTFIT: Outfit = TEST_OUTFITS[0].outfit;
