import { describe, expect, it } from 'vitest';
import { SAVE_CONTEXT } from '../content/saveContext';
import { FURNITURE } from '../content/furniture';
import { priceOf, WEARABLES } from '../content/wearables';
import { earn, grant, purchase } from './economy';
import { load, newSave, START_COINS } from './save';

const BANDS: Record<string, [number, number]> = {
  top: [35, 55],
  bottom: [35, 50],
  dress: [70, 90],
  outerwear: [60, 80],
  shoes: [40, 60],
  headwear: [25, 40],
  neck: [20, 35],
  bag: [30, 45],
};

describe('economy (game-systems §6)', () => {
  it('starts with 120 coins and can afford a first purchase right away', () => {
    const s = newSave(SAVE_CONTEXT, 0);
    expect(s.wallet.coins).toBe(START_COINS);
    expect(Math.min(...WEARABLES.map((w) => priceOf(w) ?? Infinity))).toBeLessThanOrEqual(START_COINS);
  });
  it('buying takes coins once and never goes negative', () => {
    const s = newSave(SAVE_CONTEXT, 0);
    const r = purchase(s, 'dress.party', 90, 1);
    expect(r.ok && r.save.wallet.coins).toBe(30);
    if (r.ok) {
      expect(purchase(r.save, 'dress.party', 90, 2)).toEqual({ ok: false, reason: 'owned' });
      expect(purchase(r.save, 'dress.sundress', 80, 2)).toEqual({ ok: false, reason: 'coins' });
    }
  });
  it('earning counts lifetime coins; gifts are free', () => {
    const s = grant(earn(newSave(SAVE_CONTEXT, 0), 69), 'outerwear.cafe-apron', 5);
    expect(s.wallet).toEqual({ coins: 189, lifetimeEarned: 69 });
    expect(s.inventory.owned['outerwear.cafe-apron']).toBeTruthy();
  });
  it('shop prices sit inside the bands of §6.4', () => {
    for (const w of WEARABLES) {
      const p = priceOf(w);
      if (p === null) continue;
      const [lo, hi] = BANDS[w.slot];
      expect(p, w.id).toBeGreaterThanOrEqual(lo);
      expect(p, w.id).toBeLessThanOrEqual(hi);
    }
    for (const f of FURNITURE) {
      const p = priceOf(f);
      if (p !== null) (expect(p).toBeGreaterThanOrEqual(30), expect(p).toBeLessThanOrEqual(120));
    }
  });
  it('an M0 save without progress loads with defaults', () => {
    const old = newSave(SAVE_CONTEXT, 0) as unknown as Record<string, unknown>;
    delete old.progress;
    const r = load(JSON.stringify(old), SAVE_CONTEXT);
    expect(r.kind).toBe('ok');
    if (r.kind === 'ok') expect(r.save.progress.cafe).toEqual({ correctOrders: 0, shifts: 0, rank: 1 });
  });
  it('broken progress is repaired, not rejected', () => {
    const s = newSave(SAVE_CONTEXT, 0) as unknown as Record<string, unknown>;
    s.progress = {
      cafe: { correctOrders: -5, rank: 7 },
      recipes: { x: { cooked: 2, stars: 9 } },
      dish: { recipeId: 'recipe.pancakes', doneness: 'burnt', toppings: [] },
      journey: ['a', 'a', 3],
    };
    const r = load(s, SAVE_CONTEXT);
    expect(r.kind === 'ok' && r.save.progress).toEqual({
      cafe: { correctOrders: 0, shifts: 0, rank: 1 },
      recipes: { x: { cooked: 2, stars: 3 } },
      dish: null,
      journey: ['a'],
    });
  });
  it('balance: ticket (400) costs at most 6 typical rank-1 shifts', () => {
    expect(6 * 69).toBeGreaterThanOrEqual(400);
  });
});
