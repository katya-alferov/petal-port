// Wave A town life content: Petal Notes, Post Box letters and the sticker album (game-systems §8).
import type { LetterDef } from '../game/mail';
import type { RequestPools } from '../game/requests';
import type { RequestGoal } from '../game/save';
import type { StickerCond } from '../game/stickers';
import { CAFE_MENU, ingredient, REGULARS } from './cafe';
import { FURNITURE } from './furniture';
import { kitchenItem, RECIPES } from './recipes';
import { WEARABLES } from './wearables';

export const REQUEST_POOLS: RequestPools = {
  friends: REGULARS.map((r) => r.id),
  cook: RECIPES.map((r) => ({ recipe: r.id, toppings: r.toppings })),
  cafeBases: CAFE_MENU.bases,
  wear: WEARABLES.filter((w) => w.source.kind === 'shop').map((w) => w.id),
  place: FURNITURE.filter((f) => f.source.kind === 'shop').map((f) => f.id),
};

const itemName = (id: string) => WEARABLES.find((w) => w.id === id)?.name ?? FURNITURE.find((f) => f.id === id)?.name ?? id;

/** The words on a note. */
export function noteText(g: RequestGoal, petName?: string): string {
  switch (g.kind) {
    case 'cook': {
      const r = RECIPES.find((x) => x.id === g.recipe);
      return `I’m so hungry! Could you cook ${r?.name ?? 'something'} with ${kitchenItem(g.topping)?.name.toLowerCase() ?? 'toppings'} on top?`;
    }
    case 'cafe':
      return `My friends love ${ingredient(g.base)?.name.toLowerCase() ?? 'drinks'}! Can you serve ${g.count} at the Sunny Café?`;
    case 'wear':
      return `I want to see the ${itemName(g.item)}! Can you wear it and show me?`;
    case 'place':
      return `I heard about the ${itemName(g.item)}. Put one in your home for me to see!`;
    case 'pet':
      return g.action === 'feed'
        ? `Can ${petName ?? 'your pet'} have a yummy snack? Pets love treats!`
        : g.action === 'wash'
          ? `${petName ?? 'Your pet'} rolled in the mud again! Can you give them a bath?`
          : `Play catch with ${petName ?? 'your pet'}! I want to see them jump!`;
  }
}

/** A short "how to" for the note's button area. */
export function noteHint(g: RequestGoal): string {
  switch (g.kind) {
    case 'cook':
      return 'Cook it in your kitchen at home.';
    case 'cafe':
      return 'Serve them during a café shift.';
    case 'wear':
      return 'Find it at the Ribbon Boutique, then wear it.';
    case 'place':
      return 'Find it at the Boutique, then place it with Decorate.';
    case 'pet':
      return 'Visit your pet from home.';
  }
}

const reg = (i: number) => REGULARS[i].id;

/** Post Box letters, one per week, in this order (gifts are tried until one isn't owned yet). */
export const LETTERS: LetterDef[] = [
  {
    from: reg(2),
    text: 'Welcome to Petalport, dear! Here is a little something for your new home.',
    gifts: ['furn.cactus', 'furn.rainbow-print'],
    coins: 40,
  },
  {
    from: reg(0),
    text: 'I saw this and thought of you! Wear it to the café so I can see.',
    gifts: ['headwear.bow-headband', 'neck.heart-necklace'],
    coins: 40,
  },
  { from: reg(4), text: 'Guess what? I found extra coins in my sock drawer. Let’s share!', gifts: [], coins: 50 },
  {
    from: reg(3),
    text: 'A pretty print for a pretty home. Hang it somewhere sunny!',
    gifts: ['furn.rainbow-print', 'furn.curtains'],
    coins: 40,
  },
  {
    from: reg(1),
    text: 'Rainy days are puddle days! These will keep your toes dry.',
    gifts: ['shoes.rain-boots', 'neck.scarf'],
    coins: 40,
  },
  { from: reg(5), text: 'Fashion tip from me: a purse makes any outfit special!', gifts: ['bag.heart-purse', 'headwear.beret'], coins: 40 },
  {
    from: reg(6),
    text: 'Fun fact: mushrooms are not plants! This lamp is still cute though.',
    gifts: ['furn.mushroom-lamp', 'furn.heart-rug'],
    coins: 40,
  },
  { from: reg(7), text: 'Thank you for being my friend. See you at the harbour!', gifts: ['furn.heart-rug', 'top.tank-heart'], coins: 40 },
];

export type StickerMotif =
  | 'map'
  | 'cup'
  | 'star'
  | 'crown'
  | 'pancake'
  | 'crepe'
  | 'bag'
  | 'hanger'
  | 'sofa'
  | 'house'
  | 'paw'
  | 'heart'
  | 'ball'
  | 'trophy'
  | 'note'
  | 'friends'
  | 'envelope'
  | 'coin';

export interface StickerDef {
  id: string;
  name: string;
  hint: string;
  motif: StickerMotif;
  color: string;
  cond: StickerCond;
}

export const STICKERS: StickerDef[] = [
  {
    id: 'sticker.welcome',
    name: 'New in Town',
    hint: 'Finish the Welcome Journey',
    motif: 'map',
    color: '#7ED6A7',
    cond: { kind: 'journey' },
  },
  {
    id: 'sticker.first-shift',
    name: 'First Shift',
    hint: 'Work a café shift',
    motif: 'cup',
    color: '#FFC94A',
    cond: { kind: 'shifts', n: 1 },
  },
  {
    id: 'sticker.five-shifts',
    name: 'Café Regular',
    hint: 'Work 5 café shifts',
    motif: 'cup',
    color: '#FF8A65',
    cond: { kind: 'shifts', n: 5 },
  },
  { id: 'sticker.barista', name: 'Barista', hint: 'Reach café rank 2', motif: 'star', color: '#3BB7C4', cond: { kind: 'rank', n: 2 } },
  {
    id: 'sticker.head-barista',
    name: 'Head Barista',
    hint: 'Reach café rank 3',
    motif: 'crown',
    color: '#B39DFF',
    cond: { kind: 'rank', n: 3 },
  },
  {
    id: 'sticker.pancakes',
    name: 'Pancake Day',
    hint: 'Cook pancakes',
    motif: 'pancake',
    color: '#FFC94A',
    cond: { kind: 'cooked', recipe: 'recipe.pancakes' },
  },
  {
    id: 'sticker.pancake-star',
    name: 'Pancake Pro',
    hint: 'Get 3 stars on pancakes',
    motif: 'pancake',
    color: '#FF7BA9',
    cond: { kind: 'stars', recipe: 'recipe.pancakes' },
  },
  {
    id: 'sticker.crepes',
    name: 'Ooh La La',
    hint: 'Cook crêpes',
    motif: 'crepe',
    color: '#FFDE8D',
    cond: { kind: 'cooked', recipe: 'recipe.crepes' },
  },
  {
    id: 'sticker.crepe-star',
    name: 'Crêpe Star',
    hint: 'Get 3 stars on crêpes',
    motif: 'crepe',
    color: '#B39DFF',
    cond: { kind: 'stars', recipe: 'recipe.crepes' },
  },
  {
    id: 'sticker.shopper',
    name: 'Shopper',
    hint: 'Buy or get something new',
    motif: 'bag',
    color: '#FF7BA9',
    cond: { kind: 'owned', n: 1 },
  },
  {
    id: 'sticker.collector',
    name: 'Collector',
    hint: 'Own 10 new things',
    motif: 'hanger',
    color: '#B39DFF',
    cond: { kind: 'owned', n: 10 },
  },
  {
    id: 'sticker.decorator',
    name: 'Decorator',
    hint: 'Place something new at home',
    motif: 'sofa',
    color: '#3BB7C4',
    cond: { kind: 'placed', n: 1 },
  },
  {
    id: 'sticker.designer',
    name: 'Home Designer',
    hint: 'Place 5 new things at home',
    motif: 'house',
    color: '#FF8A65',
    cond: { kind: 'placed', n: 5 },
  },
  { id: 'sticker.pet', name: 'Pet Pal', hint: 'Adopt a pet', motif: 'paw', color: '#FFADCA', cond: { kind: 'pet' } },
  {
    id: 'sticker.pet-care',
    name: 'Loving Care',
    hint: 'Care for your pet 10 times',
    motif: 'heart',
    color: '#FF7BA9',
    cond: { kind: 'care', n: 10 },
  },
  {
    id: 'sticker.tricks',
    name: 'Clever Pet',
    hint: 'Teach your pet 3 tricks',
    motif: 'ball',
    color: '#7ED6A7',
    cond: { kind: 'tricks', n: 3 },
  },
  {
    id: 'sticker.all-tricks',
    name: 'Show Star',
    hint: 'Teach your pet every trick',
    motif: 'trophy',
    color: '#FFC94A',
    cond: { kind: 'tricks', n: 5 },
  },
  { id: 'sticker.first-note', name: 'Helper', hint: 'Finish a Petal Note', motif: 'note', color: '#FFDE8D', cond: { kind: 'notes', n: 1 } },
  {
    id: 'sticker.ten-notes',
    name: 'Town Hero',
    hint: 'Finish 10 Petal Notes',
    motif: 'note',
    color: '#FF8A65',
    cond: { kind: 'notes', n: 10 },
  },
  {
    id: 'sticker.friend',
    name: 'Good Friend',
    hint: 'Get 3 hearts with a friend',
    motif: 'heart',
    color: '#B39DFF',
    cond: { kind: 'hearts', n: 3 },
  },
  {
    id: 'sticker.bestie',
    name: 'Best Friends',
    hint: 'Get 10 hearts with a friend',
    motif: 'friends',
    color: '#FF7BA9',
    cond: { kind: 'hearts', n: 10 },
  },
  {
    id: 'sticker.popular',
    name: 'Everyone’s Pal',
    hint: 'Make 5 friends',
    motif: 'friends',
    color: '#3BB7C4',
    cond: { kind: 'friends', n: 5 },
  },
  {
    id: 'sticker.mail',
    name: 'You’ve Got Mail',
    hint: 'Open a letter in the Post Box',
    motif: 'envelope',
    color: '#FF7BA9',
    cond: { kind: 'mail', n: 1 },
  },
  { id: 'sticker.pen-pal', name: 'Pen Pal', hint: 'Open 4 letters', motif: 'envelope', color: '#7ED6A7', cond: { kind: 'mail', n: 4 } },
  {
    id: 'sticker.saver',
    name: 'Coin Jar',
    hint: 'Earn 500 coins in all',
    motif: 'coin',
    color: '#FFC94A',
    cond: { kind: 'coins', n: 500 },
  },
  {
    id: 'sticker.treasure',
    name: 'Treasure',
    hint: 'Earn 2000 coins in all',
    motif: 'coin',
    color: '#B39DFF',
    cond: { kind: 'coins', n: 2000 },
  },
];
