import { describe, expect, it } from 'vitest';
import { RECIPES } from '../content/recipes';
import { cookReward, doneness, isRecipeUnlocked, stars } from './cooking';

describe('cooking rules (game-systems §4)', () => {
  it('pancake golden window is 2.5–5.5 s', () => {
    expect([0, 2.4, 2.5, 5.4, 5.5, 9].map((s) => doneness(s, [2.5, 5.5]))).toEqual([
      'pale',
      'pale',
      'golden',
      'golden',
      'toasty',
      'toasty',
    ]);
  });
  it('stars: finish = 1, no wrong ingredient = 2, plus golden = 3', () => {
    expect(stars(1, 'golden')).toBe(1);
    expect(stars(0, 'pale')).toBe(2);
    expect(stars(0, 'golden')).toBe(3);
  });
  it('coins only on first cook and first 3 stars (max 40 per recipe)', () => {
    expect(cookReward(undefined, 3)).toBe(40);
    expect(cookReward(undefined, 2)).toBe(20);
    expect(cookReward({ cooked: 1, stars: 2 }, 3)).toBe(20);
    expect(cookReward({ cooked: 2, stars: 3 }, 3)).toBe(0);
  });
  it('crêpes unlock after pancakes', () => {
    const crepes = RECIPES.find((r) => r.id === 'recipe.crepes')!;
    expect(isRecipeUnlocked(crepes, {})).toBe(false);
    expect(isRecipeUnlocked(crepes, { 'recipe.pancakes': { cooked: 1 } })).toBe(true);
  });
  it('every add step only asks for things on the shelf', () => {
    for (const r of RECIPES) for (const s of r.steps) for (const id of s.items ?? []) expect(r.shelf).toContain(id);
  });
});

describe('recipe content', () => {
  it('every recipe has its ingredients on the shelf and known icons', async () => {
    const { KITCHEN_ITEMS } = await import('../content/recipes');
    const known = new Set(KITCHEN_ITEMS.map((i) => i.id));
    const ids = new Set(RECIPES.map((r) => r.id));
    for (const r of RECIPES) {
      const want = r.steps.find((s) => s.type === 'add')!.items!;
      for (const w of want) expect(r.shelf, `${r.id} shelf has ${w}`).toContain(w);
      for (const id of [...r.shelf, ...r.toppings]) expect(known.has(id), `${r.id} ${id}`).toBe(true);
      if (r.unlockAfter) expect(ids.has(r.unlockAfter)).toBe(true);
    }
  });
});
