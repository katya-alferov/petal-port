// Petal Posies (game-systems §19): a flower-shop job. Each customer wants a bouquet: some flowers and a
// wrapping color. Order doesn't matter. Checking names what is missing or extra; nothing is lost but the tip.
import { makeRng } from './rng';

export const FLOWERS = ['rose', 'tulip', 'daisy', 'sunflower', 'lilac', 'lily'] as const;
export type Flower = (typeof FLOWERS)[number];
export const WRAPS = ['pink', 'mint', 'sky', 'sun'] as const;
export type Wrap = (typeof WRAPS)[number];

export type Counts = Partial<Record<Flower, number>>;
export interface PosyOrder {
  counts: Counts;
  wrap: Wrap;
}

export const CUSTOMERS_PER_SHIFT = 4;
export const POSY_PAY = 14;
export const POSY_TIP = 4;
export const POSY_SHIFT_BONUS = 12;
export const MAX_FLOWERS = 8;

/** The bouquets for a shift, seeded by the shift number: 3, 4, 5, then 6 flowers of one to three kinds. */
export function posyOrders(shift: number): PosyOrder[] {
  const rng = makeRng(shift * 9173 + 3);
  return Array.from({ length: CUSTOMERS_PER_SHIFT }, (_, i) => {
    const total = i + 3;
    const kinds = i === 0 ? 1 : i === 3 ? 3 : 2;
    const pool = [...FLOWERS];
    const types: Flower[] = [];
    for (let k = 0; k < kinds; k++) types.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    const counts: Counts = {};
    types.forEach((t) => (counts[t] = 1));
    for (let n = kinds; n < total; n++) {
      const t = types[Math.floor(rng() * types.length)];
      counts[t] = (counts[t] ?? 0) + 1;
    }
    return { counts, wrap: WRAPS[Math.floor(rng() * WRAPS.length)] };
  });
}

export const countOf = (flowers: readonly Flower[]): Counts => {
  const c: Counts = {};
  for (const f of flowers) c[f] = (c[f] ?? 0) + 1;
  return c;
};

export interface Gap {
  flower: Flower;
  /** Positive: this many more are needed. Negative: this many too many. */
  need: number;
}

/** What differs between the order and the bouquet; an empty list and `wrapOk` mean it is right. */
export function checkPosy(order: PosyOrder, flowers: readonly Flower[], wrap: Wrap | null): { gaps: Gap[]; wrapOk: boolean } {
  const mine = countOf(flowers);
  const gaps: Gap[] = [];
  for (const f of FLOWERS) {
    const need = (order.counts[f] ?? 0) - (mine[f] ?? 0);
    if (need !== 0) gaps.push({ flower: f, need });
  }
  return { gaps, wrapOk: wrap === order.wrap };
}

export const posyPay = (clean: boolean) => POSY_PAY + (clean ? POSY_TIP : 0);
