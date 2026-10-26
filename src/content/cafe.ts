// Sunny Café menu and regulars (game-systems §3.4, §3.9).
import type { CafeMenu } from '../game/cafe';
import type { Appearance, Outfit } from '../game/save';
import type { SwatchId } from './palette';

export interface CafeIngredient {
  id: string;
  name: string;
  kind: 'cup' | 'base' | 'topping' | 'stencil' | 'pastry';
}

export const CAFE_INGREDIENTS: CafeIngredient[] = [
  { id: 'cup.small', name: 'Small cup', kind: 'cup' },
  { id: 'cup.large', name: 'Big mug', kind: 'cup' },
  { id: 'base.cocoa', name: 'Cocoa', kind: 'base' },
  { id: 'base.lemonade', name: 'Lemonade', kind: 'base' },
  { id: 'base.berry-tea', name: 'Berry tea', kind: 'base' },
  { id: 'top.cream', name: 'Whipped cream', kind: 'topping' },
  { id: 'top.marshmallow', name: 'Marshmallow', kind: 'topping' },
  { id: 'top.lemon', name: 'Lemon slice', kind: 'topping' },
  { id: 'top.sprinkles', name: 'Sprinkles', kind: 'topping' },
  { id: 'top.caramel', name: 'Caramel drizzle', kind: 'topping' },
  { id: 'pastry.croissant', name: 'Croissant', kind: 'pastry' },
  { id: 'pastry.cupcake', name: 'Cupcake', kind: 'pastry' },
  { id: 'pastry.cookie', name: 'Cookie', kind: 'pastry' },
  { id: 'base.petal-latte', name: 'Petal latte', kind: 'base' },
  { id: 'stencil.heart', name: 'Heart', kind: 'stencil' },
  { id: 'stencil.star', name: 'Star', kind: 'stencil' },
  { id: 'stencil.flower', name: 'Flower', kind: 'stencil' },
];

export const CAFE_MENU: CafeMenu = {
  cups: ['cup.small', 'cup.large'],
  bases: ['base.cocoa', 'base.lemonade', 'base.berry-tea'],
  toppings: ['top.cream', 'top.marshmallow', 'top.lemon', 'top.sprinkles'],
  rank2Toppings: ['top.caramel'],
  pastries: ['pastry.croissant', 'pastry.cupcake', 'pastry.cookie'],
  stencils: ['stencil.heart', 'stencil.star', 'stencil.flower'],
};

export function ingredient(id: string): CafeIngredient | undefined {
  return CAFE_INGREDIENTS.find((i) => i.id === id);
}

/** Rank-up gifts (§3.4). */
export const RANK_GIFTS: Record<2 | 3, { items: string[]; line: string }> = {
  2: { items: ['outerwear.cafe-apron'], line: 'You got a café apron and caramel drizzle!' },
  3: { items: ['headwear.barista-cap'], line: 'You got a barista cap!' },
};

export interface Regular {
  name: string;
  thanks: string;
  appearance: Appearance;
  outfit: Outfit;
}

const look = (skinTone: string, hairStyle: string, hairColor: string, eyeColor: string, freckles = false): Appearance => ({
  skinTone,
  hairStyle,
  hairColor,
  eyeStyle: freckles ? 'eyes.round' : 'eyes.almond',
  eyeColor,
  brows: 'brows.soft',
  freckles,
});

const wear = (top: string, main: SwatchId, extra: Outfit = {}): Outfit => ({
  top: { itemId: top, tint: { main } },
  bottom: { itemId: 'bottom.wide-trousers' },
  shoes: { itemId: 'shoes.sneakers' },
  ...extra,
});

/** Townsfolk who visit the counter, drawn with the same rig as the player. */
export const REGULARS: Regular[] = [
  {
    name: 'Mila',
    thanks: 'Best cocoa in Petalport!',
    appearance: look('skin.peach', 'hairstyle.space-buns', 'hair.copper', 'eye.green', true),
    outfit: wear('top.sailor-tee', 'petal'),
  },
  {
    name: 'Theo',
    thanks: 'You made my morning!',
    appearance: look('skin.espresso', 'hairstyle.coily-puff', 'hair.black', 'eye.dark-brown'),
    outfit: wear('top.long-tee', 'mint'),
  },
  {
    name: 'Grandma Rosa',
    thanks: 'Just like I used to make!',
    appearance: look('skin.olive', 'hairstyle.bob', 'hair.platinum', 'eye.hazel'),
    outfit: wear('top.long-tee', 'lilac', { eyewear: { itemId: 'eyewear.round-glasses' } }),
  },
  {
    name: 'Aiko',
    thanks: 'So pretty I almost didn’t drink it!',
    appearance: look('skin.porcelain', 'hairstyle.ponytail', 'hair.black', 'eye.brown'),
    outfit: wear('top.ruffle-blouse', 'sea'),
  },
  {
    name: 'Sam',
    thanks: 'Ten out of ten. No, eleven!',
    appearance: look('skin.chestnut', 'hairstyle.braids', 'hair.dark-brown', 'eye.amber'),
    outfit: wear('top.sailor-tee', 'sunshine'),
  },
  {
    name: 'Noor',
    thanks: 'Thank you, barista!',
    appearance: look('skin.honey', 'hairstyle.wavy-long', 'hair.black', 'eye.brown'),
    outfit: wear('top.ruffle-blouse', 'coral', { headwear: { itemId: 'headwear.bow-headband' } }),
  },
  {
    name: 'Leo',
    thanks: 'The sprinkles were perfect!',
    appearance: look('skin.rose', 'hairstyle.bob', 'hair.honey-blonde', 'eye.blue', true),
    outfit: wear('top.long-tee', 'coral'),
  },
  {
    name: 'Zuri',
    thanks: 'I’ll be back tomorrow!',
    appearance: look('skin.ebony', 'hairstyle.braids', 'hair.sea-teal', 'eye.dark-brown'),
    outfit: wear('top.tank-heart', 'mint'),
  },
];
