// Content lint: every id points at art that exists and items referenced by other content are real.
import { describe, expect, it } from 'vitest';
import { FURN_ART } from '../art/furn';
import { HAIR_BACK, HAIR_FRONT } from '../art/parts/hair';
import { WEAR_ART } from '../art/wear';
import { HAIR_STYLES } from '../content/appearance';
import { CAFE_INGREDIENTS, CAFE_MENU, RANK_GIFTS, REGULARS } from '../content/cafe';
import { FURNITURE } from '../content/furniture';
import { KITCHEN_ITEMS, RECIPES } from '../content/recipes';
import { wearable, WEARABLES } from '../content/wearables';

describe('content lint', () => {
  it('ids are unique', () => {
    const ids = [...WEARABLES, ...FURNITURE].map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('every wearable and furniture item has art', () => {
    for (const w of WEARABLES) expect(WEAR_ART[w.art], w.id).toBeTypeOf('function');
    for (const f of FURNITURE) expect(FURN_ART[f.art], f.id).toBeTypeOf('function');
  });
  it('every hairstyle has back or front art', () => {
    for (const h of HAIR_STYLES) expect(Boolean(HAIR_BACK[h.art] || HAIR_FRONT[h.art]), h.id).toBe(true);
  });
  it('regulars and rank gifts use real items and hairstyles', () => {
    for (const r of REGULARS) {
      for (const e of Object.values(r.outfit)) expect(wearable(e!.itemId), `${r.name}: ${e!.itemId}`).toBeTruthy();
      expect(
        HAIR_STYLES.some((h) => h.id === r.appearance.hairStyle),
        r.name,
      ).toBe(true);
    }
    for (const g of Object.values(RANK_GIFTS)) for (const id of g.items) expect(wearable(id)?.source.kind).toBe('reward');
  });
  it('café menu and recipes only use known ingredients', () => {
    const cafe = new Set(CAFE_INGREDIENTS.map((i) => i.id));
    for (const id of Object.values(CAFE_MENU).flat()) expect(cafe.has(id), id).toBe(true);
    const kitchen = new Set(KITCHEN_ITEMS.map((i) => i.id));
    for (const r of RECIPES) for (const id of [...r.shelf, ...r.toppings]) expect(kitchen.has(id), id).toBe(true);
  });
});
