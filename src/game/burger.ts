// Bun & Bite Burger Bar (game-systems §12): a third job. Each customer's order card shows the burger
// from bottom to top; tap the ingredients in that order. A wrong tap wobbles and names the next
// ingredient: no timer, nothing lost, only the tip is missed.
import { makeRng } from './rng';

export type BurgerPart = 'bun-bottom' | 'patty' | 'cheese' | 'lettuce' | 'tomato' | 'pickle' | 'bun-top';
export const TOPPINGS: readonly BurgerPart[] = ['cheese', 'lettuce', 'tomato', 'pickle'];

export const CUSTOMERS_PER_SHIFT = 4;
export const BURGER_PAY = 14;
/** Paid on top when no tap was wrong. */
export const BURGER_TIP = 4;
export const BURGER_SHIFT_BONUS = 12;

/** The burgers for a shift, seeded by the shift number: toppings grow from 1 to 4 across the shift. */
export function burgerOrders(shift: number): BurgerPart[][] {
  const rng = makeRng(shift * 7331 + 5);
  return Array.from({ length: CUSTOMERS_PER_SHIFT }, (_, i) => {
    const pool = [...TOPPINGS];
    const tops: BurgerPart[] = [];
    for (let k = 0; k < i + 1; k++) tops.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    return ['bun-bottom', 'patty', ...tops, 'bun-top'];
  });
}

export type Tap = { ok: true; done: boolean } | { ok: false; next: BurgerPart };

/** Checks one tap against the order, given how many layers are already stacked. */
export function tapPart(order: readonly BurgerPart[], stacked: number, part: BurgerPart): Tap {
  const next = order[stacked];
  if (part !== next) return { ok: false, next };
  return { ok: true, done: stacked + 1 >= order.length };
}

export const burgerPay = (clean: boolean) => BURGER_PAY + (clean ? BURGER_TIP : 0);
