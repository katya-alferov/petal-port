import { describe, expect, it } from 'vitest';
import { SAVE_CONTEXT } from '../content/saveContext';
import { load, MAX_COINS, newSave, sanitize, validate } from './save';

const fresh = () => newSave(SAVE_CONTEXT, 1_700_000_000_000);

describe('save model', () => {
  it('a new save is valid', () => {
    expect(validate(fresh())).toEqual([]);
  });
  it('rejects garbage and wrong versions', () => {
    expect(validate(null)).not.toEqual([]);
    expect(validate({ ...fresh(), schemaVersion: 99 })).toContain('schemaVersion');
    expect(load('{not json', SAVE_CONTEXT)).toEqual({ kind: 'invalid', errors: ['json'] });
  });
  it('round-trips through JSON', () => {
    const r = load(JSON.stringify(fresh()), SAVE_CONTEXT);
    expect(r.kind).toBe('ok');
  });
  it('sanitize drops unknown items, refills required slots, clamps coins', () => {
    const s = fresh();
    s.wallet.coins = 1e9;
    s.inventory.owned['top.deleted-item'] = { acquiredAt: 1 };
    s.player.outfit = { top: { itemId: 'top.deleted-item' } };
    s.player.favoriteLooks = [];
    s.home.slots.lamp = 'furn.gone';
    const out = sanitize(s, SAVE_CONTEXT);
    expect(out.wallet.coins).toBe(MAX_COINS);
    expect(out.inventory.owned['top.deleted-item']).toBeUndefined();
    expect(out.player.outfit.top?.itemId).toBe(SAVE_CONTEXT.starterOutfit.top?.itemId);
    expect(out.player.outfit.shoes).toBeDefined();
    expect(out.player.favoriteLooks).toHaveLength(4);
    expect(out.home.slots.lamp).toBe(SAVE_CONTEXT.starterHome.lamp);
  });
  it('a dress clears top and bottom on sanitize', () => {
    const s = fresh();
    s.player.outfit = { ...s.player.outfit, dress: { itemId: 'dress.picnic' } };
    const out = sanitize(s, SAVE_CONTEXT);
    expect(out.player.outfit.top).toBeUndefined();
    expect(out.player.outfit.bottom).toBeUndefined();
  });
  it('sanitize does not mutate its input', () => {
    const s = fresh();
    s.wallet.coins = -5;
    sanitize(s, SAVE_CONTEXT);
    expect(s.wallet.coins).toBe(-5);
  });
});
