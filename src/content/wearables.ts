// Wearables catalog. M0 contains the items for the 3 test outfits; M1 grows this to 38.
import type { WearableDef, WearSlot } from './types';

const starter = { kind: 'starter' } as const;

export const WEARABLES: WearableDef[] = [
  {
    id: 'top.sailor-tee', type: 'wearable', slot: 'top', name: 'Sailor Tee', source: starter,
    tags: ['harbour', 'casual'], sleeve: 'short', sleeveTrim: 'stripe', art: 'wear/top/sailor-tee',
    tints: [{ id: 'main', default: 'cream' }, { id: 'accent', default: 'sea-deep' }],
  },
  {
    id: 'top.long-tee', type: 'wearable', slot: 'top', name: 'Cozy Long Tee', source: starter,
    tags: ['cozy'], sleeve: 'long', sleeveTrim: 'cuff', art: 'wear/top/long-tee',
    tints: [{ id: 'main', default: 'sea' }, { id: 'accent', default: 'cream' }],
  },
  {
    id: 'bottom.a-line-skirt', type: 'wearable', slot: 'bottom', name: 'A-line Skirt', source: starter,
    tags: ['casual'], art: 'wear/bottom/a-line-skirt',
    tints: [{ id: 'main', default: 'denim' }, { id: 'accent', default: 'sunshine' }],
  },
  {
    id: 'bottom.wide-trousers', type: 'wearable', slot: 'bottom', name: 'Wide Trousers', source: starter,
    tags: ['cozy'], art: 'wear/bottom/wide-trousers',
    tints: [{ id: 'main', default: 'denim' }],
  },
  {
    id: 'dress.picnic', type: 'wearable', slot: 'dress', name: 'Picnic Dress', source: starter,
    tags: ['park', 'sunny'], sleeve: 'puff', art: 'wear/dress/picnic',
    tints: [{ id: 'main', default: 'petal' }, { id: 'accent', default: 'cream' }],
  },
  {
    id: 'outerwear.cardigan', type: 'wearable', slot: 'outerwear', name: 'Button Cardigan', source: starter,
    tags: ['cozy'], sleeve: 'long', sleeveTrim: 'cuff', art: 'wear/outerwear/cardigan',
    tints: [{ id: 'main', default: 'coral' }, { id: 'accent', default: 'cream' }],
  },
  {
    id: 'shoes.sneakers', type: 'wearable', slot: 'shoes', name: 'Canvas Sneakers', source: starter,
    tags: ['casual', 'sporty'], art: 'wear/shoes/sneakers',
    tints: [{ id: 'main', default: 'cream' }, { id: 'accent', default: 'sea' }],
  },
  {
    id: 'shoes.mary-janes', type: 'wearable', slot: 'shoes', name: 'Mary Janes', source: starter,
    tags: ['dressy'], art: 'wear/shoes/mary-janes',
    tints: [{ id: 'main', default: 'berry' }],
  },
  {
    id: 'shoes.boots', type: 'wearable', slot: 'shoes', name: 'Ankle Boots', source: starter,
    tags: ['cozy'], art: 'wear/shoes/boots',
    tints: [{ id: 'main', default: 'cocoa' }],
  },
  {
    id: 'headwear.sun-hat', type: 'wearable', slot: 'headwear', name: 'Sun Hat', source: starter,
    tags: ['sunny', 'park'], art: 'wear/headwear/sun-hat',
    tints: [{ id: 'main', default: 'sunshine' }, { id: 'accent', default: 'petal' }],
  },
  {
    id: 'eyewear.round-glasses', type: 'wearable', slot: 'eyewear', name: 'Round Glasses', source: starter,
    tags: ['smart'], art: 'wear/eyewear/round-glasses',
    tints: [{ id: 'main', default: 'berry' }],
  },
  {
    id: 'bag.crossbody', type: 'wearable', slot: 'bag', name: 'Crossbody Bag', source: starter,
    tags: ['harbour'], art: 'wear/bag/crossbody',
    tints: [{ id: 'main', default: 'coral' }],
  },
];

export function wearable(id: string): WearableDef | undefined {
  return WEARABLES.find((w) => w.id === id);
}

export function wearablesFor(slot: WearSlot): WearableDef[] {
  return WEARABLES.filter((w) => w.slot === slot);
}
