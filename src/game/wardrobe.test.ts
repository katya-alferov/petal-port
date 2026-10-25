import { describe, expect, it } from 'vitest';
import { wearable } from '../content/wearables';
import { STARTER_OUTFIT } from '../content/outfits';
import { equip, unequip } from './wardrobe';

describe('wardrobe rules', () => {
  it('a dress replaces top and bottom', () => {
    const o = equip(STARTER_OUTFIT, wearable('dress.picnic')!);
    expect(o.dress).toBeDefined();
    expect(o.top).toBeUndefined();
    expect(o.bottom).toBeUndefined();
  });
  it('a top removes the dress', () => {
    const o = equip(equip(STARTER_OUTFIT, wearable('dress.picnic')!), wearable('top.long-tee')!);
    expect(o.dress).toBeUndefined();
    expect(o.top?.itemId).toBe('top.long-tee');
  });
  it('shoes cannot be removed; removing a dress restores fallbacks', () => {
    expect(unequip(STARTER_OUTFIT, 'shoes', STARTER_OUTFIT)).toBe(STARTER_OUTFIT);
    const dressed = equip(STARTER_OUTFIT, wearable('dress.picnic')!);
    const o = unequip(dressed, 'dress', STARTER_OUTFIT);
    expect(o.top).toEqual(STARTER_OUTFIT.top);
    expect(o.bottom).toEqual(STARTER_OUTFIT.bottom);
  });
});
