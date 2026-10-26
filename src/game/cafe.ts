// Sunny Café "Order Up!" rules (game-systems §3). Pure: menus come in as data, no DOM or clock.
import { makeRng, pick, type Rng } from './rng';

export type CafeRank = 1 | 2 | 3;

export interface CafeMenu {
  cups: readonly string[];
  bases: readonly string[];
  /** Toppings available at rank 1; rank 2 adds `rank2Toppings`. */
  toppings: readonly string[];
  rank2Toppings: readonly string[];
  pastries: readonly string[];
  stencils: readonly string[];
}

export interface Drink {
  cup: string;
  base: string;
  toppings: string[];
  /** Rank 3 "Petal Latte" only: the cocoa-dust shape. */
  stencil?: string;
}

export interface Order {
  drink: Drink;
  pastry?: string;
}

/** What the player has built on the counter so far. */
export interface Built {
  cup?: string;
  base?: string;
  toppings: string[];
  stencil?: string;
  pastry?: string;
}

export const MAX_TOPPINGS = 4;
export const ORDERS_PER_SHIFT = 5;
export const RANK_AT: Record<CafeRank, number> = { 1: 0, 2: 15, 3: 40 };
export const PAY: Record<CafeRank, number> = { 1: 10, 2: 12, 3: 14 };
export const TIP = 3;
export const SHIFT_BONUS = 10;
export const RANK_NAMES: Record<CafeRank, string> = { 1: 'New Barista', 2: 'Barista', 3: 'Head Barista' };
export const LATTE_BASE = 'base.petal-latte';

export function rankFor(correctOrders: number): CafeRank {
  return correctOrders >= RANK_AT[3] ? 3 : correctOrders >= RANK_AT[2] ? 2 : 1;
}

function pickToppings(rng: Rng, pool: readonly string[], max: number): string[] {
  const n = Math.floor(rng() * (max + 1));
  const left = [...pool];
  const out: string[] = [];
  for (let i = 0; i < n && left.length; i++) out.push(left.splice(Math.floor(rng() * left.length), 1)[0]);
  return out.sort();
}

export function orderKey(o: Order): string {
  return [o.drink.cup, o.drink.base, ...o.drink.toppings, o.drink.stencil ?? '', o.pastry ?? ''].join('|');
}

function makeOrder(rng: Rng, rank: CafeRank, menu: CafeMenu): Order {
  const cup = pick(rng, menu.cups);
  if (rank === 3 && rng() < 0.3) return { drink: { cup, base: LATTE_BASE, toppings: [], stencil: pick(rng, menu.stencils) } };
  const pool = rank >= 2 ? [...menu.toppings, ...menu.rank2Toppings] : menu.toppings;
  const drink: Drink = { cup, base: pick(rng, menu.bases), toppings: pickToppings(rng, pool, rank >= 2 ? 2 : 1) };
  const pastry = rank >= 2 && rng() < 0.5 ? pick(rng, menu.pastries) : undefined;
  return pastry ? { drink, pastry } : { drink };
}

/** The 5 orders of a shift: seeded by shift number, never two identical in a row (§3.3). */
export function shiftOrders(shift: number, rank: CafeRank, menu: CafeMenu): Order[] {
  const rng = makeRng(shift * 7919 + rank);
  const out: Order[] = [];
  while (out.length < ORDERS_PER_SHIFT) {
    const o = makeOrder(rng, rank, menu);
    if (out.length && orderKey(out[out.length - 1]) === orderKey(o)) continue;
    out.push(o);
  }
  return out;
}

export interface Check {
  correct: boolean;
  /** Ids that are required but not on the counter. */
  missing: string[];
  /** Ids on the counter that the order doesn't want. */
  extra: string[];
}

/** Order of adding doesn't matter; the cup must contain exactly the required items (§3.3). */
export function checkOrder(order: Order, built: Built): Check {
  const want = [
    order.drink.cup,
    order.drink.base,
    ...order.drink.toppings,
    ...(order.drink.stencil ? [order.drink.stencil] : []),
    ...(order.pastry ? [order.pastry] : []),
  ];
  const have = [built.cup, built.base, ...built.toppings, built.stencil, built.pastry].filter((x): x is string => Boolean(x));
  const missing = want.filter((id) => !have.includes(id));
  const extra = have.filter((id) => !want.includes(id));
  return { correct: missing.length === 0 && extra.length === 0, missing, extra };
}

/** Adds an ingredient by kind. Returns null when the cup is full (the 5th topping shakes, §3.3). */
export function addToBuilt(built: Built, kind: 'cup' | 'base' | 'topping' | 'stencil' | 'pastry', id: string): Built | null {
  if (kind === 'topping') {
    if (built.toppings.includes(id)) return built;
    if (built.toppings.length >= MAX_TOPPINGS) return null;
    return { ...built, toppings: [...built.toppings, id] };
  }
  return { ...built, [kind]: id };
}

export function orderPay(rank: CafeRank, firstTry: boolean): number {
  return PAY[rank] + (firstTry ? TIP : 0);
}
