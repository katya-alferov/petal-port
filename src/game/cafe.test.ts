import { describe, expect, it } from 'vitest';
import { CAFE_MENU } from '../content/cafe';
import { addToBuilt, checkOrder, MAX_TOPPINGS, orderKey, orderPay, rankFor, shiftOrders, SHIFT_BONUS, TIP, type Built } from './cafe';

describe('café rules (game-systems §3)', () => {
  it('ranks up at 15 and 40 correct orders', () => {
    expect([0, 14, 15, 39, 40, 99].map(rankFor)).toEqual([1, 1, 2, 2, 3, 3]);
  });

  it('a shift is 5 orders, deterministic per shift, never two identical in a row', () => {
    for (let shift = 1; shift <= 60; shift++)
      for (const rank of [1, 2, 3] as const) {
        const a = shiftOrders(shift, rank, CAFE_MENU);
        expect(a).toHaveLength(5);
        expect(shiftOrders(shift, rank, CAFE_MENU)).toEqual(a);
        for (let i = 1; i < a.length; i++) expect(orderKey(a[i])).not.toBe(orderKey(a[i - 1]));
      }
  });

  it('rank 1 orders have one drink and at most one topping, no pastry, no caramel', () => {
    for (let s = 1; s <= 40; s++)
      for (const o of shiftOrders(s, 1, CAFE_MENU)) {
        expect(o.drink.toppings.length).toBeLessThanOrEqual(1);
        expect(o.pastry).toBeUndefined();
        expect(o.drink.toppings).not.toContain('top.caramel');
      }
  });

  it('rank 2 adds pastries and caramel; rank 3 adds stencil lattes', () => {
    const r2 = Array.from({ length: 40 }, (_, s) => shiftOrders(s + 1, 2, CAFE_MENU)).flat();
    expect(r2.some((o) => o.pastry)).toBe(true);
    expect(r2.some((o) => o.drink.toppings.includes('top.caramel'))).toBe(true);
    const r3 = Array.from({ length: 40 }, (_, s) => shiftOrders(s + 1, 3, CAFE_MENU)).flat();
    expect(r3.some((o) => o.drink.stencil)).toBe(true);
  });

  it('order of adding does not matter, and mistakes are reported', () => {
    const order = { drink: { cup: 'cup.small', base: 'base.cocoa', toppings: ['top.cream', 'top.sprinkles'] } };
    const built: Built = { cup: 'cup.small', base: 'base.cocoa', toppings: ['top.sprinkles', 'top.cream'] };
    expect(checkOrder(order, built).correct).toBe(true);
    const wrong = checkOrder(order, { cup: 'cup.large', base: 'base.cocoa', toppings: ['top.cream'] });
    expect(wrong).toEqual({ correct: false, missing: ['cup.small', 'top.sprinkles'], extra: ['cup.large'] });
  });

  it('the 5th topping does not fit', () => {
    let b: Built = { toppings: [] };
    for (const t of ['top.cream', 'top.marshmallow', 'top.lemon', 'top.sprinkles']) b = addToBuilt(b, 'topping', t)!;
    expect(b.toppings).toHaveLength(MAX_TOPPINGS);
    expect(addToBuilt(b, 'topping', 'top.caramel')).toBeNull();
  });

  it('pay matches the table: typical R1 shift 69, max 75 / 85 / 95', () => {
    expect(5 * orderPay(1, false) + 3 * TIP + SHIFT_BONUS).toBe(69);
    expect([1, 2, 3].map((r) => 5 * orderPay(r as 1 | 2 | 3, true) + SHIFT_BONUS)).toEqual([75, 85, 95]);
  });
});
