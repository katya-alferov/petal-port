// Sweet Spot cupcake shop (game-systems §13): a fourth job and a collection. Each customer's card names
// a frosting, a swirl and a topping; decorate, then serve. A wrong look says what to change.
// Every different design you serve is kept in the album's Treats page.
import { makeRng, pick } from './rng';

export interface SweetMenu {
  frostings: readonly string[];
  swirls: readonly string[];
  toppings: readonly string[];
}

export interface Cupcake {
  frosting: string;
  swirl: string;
  topping: string;
}

export const CUSTOMERS_PER_SHIFT = 3;
export const SWEET_PAY = 12;
export const SWEET_TIP = 4;
export const SWEET_SHIFT_BONUS = 10;
export const MAX_DESIGNS = 60;

export const designKey = (c: Cupcake) => `${c.frosting}|${c.swirl}|${c.topping}`;

export function sweetOrders(shift: number, menu: SweetMenu): Cupcake[] {
  const rng = makeRng(shift * 5281 + 3);
  const out: Cupcake[] = [];
  while (out.length < CUSTOMERS_PER_SHIFT) {
    const c = { frosting: pick(rng, menu.frostings), swirl: pick(rng, menu.swirls), topping: pick(rng, menu.toppings) };
    if (!out.some((o) => designKey(o) === designKey(c))) out.push(c);
  }
  return out;
}

export type SweetPart = keyof Cupcake;

export function checkCupcake(want: Cupcake, have: Cupcake): { correct: boolean; wrong: SweetPart[] } {
  const wrong = (['frosting', 'swirl', 'topping'] as const).filter((k) => want[k] !== have[k]);
  return { correct: wrong.length === 0, wrong: [...wrong] };
}

export const sweetPay = (firstLook: boolean) => SWEET_PAY + (firstLook ? SWEET_TIP : 0);

/** Adds a design to the collection once; returns the same list when it is known or the album is full. */
export function addDesign(made: readonly string[], c: Cupcake): readonly string[] {
  const k = designKey(c);
  return made.includes(k) || made.length >= MAX_DESIGNS ? made : [...made, k];
}
