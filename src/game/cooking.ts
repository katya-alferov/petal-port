// Cooking step engine rules (game-systems §4). Pure: timings come in as numbers.
export type StepType = 'add' | 'mix' | 'pour' | 'heat' | 'fold' | 'decorate';

export interface RecipeStep {
  type: StepType;
  /** `add`: the ingredient ids that belong in the bowl. */
  items?: string[];
}

export interface RecipeDef {
  id: string;
  name: string;
  steps: RecipeStep[];
  /** Ingredient ids offered on the `add` shelf, including a few that don't belong. */
  shelf: string[];
  toppings: string[];
  /** Seconds: [golden from, toasty from]. */
  golden: [number, number];
  unlockAfter?: string;
}

export type Doneness = 'pale' | 'golden' | 'toasty';

export function doneness(seconds: number, golden: [number, number]): Doneness {
  return seconds < golden[0] ? 'pale' : seconds < golden[1] ? 'golden' : 'toasty';
}

/** ★ always, ★★ no wrong ingredient, ★★★ also golden (§4.4). */
export function stars(wrongAdds: number, result: Doneness): 1 | 2 | 3 {
  if (wrongAdds > 0) return 1;
  return result === 'golden' ? 3 : 2;
}

export const FIRST_COOK_COINS = 20;
export const FIRST_THREE_STAR_COINS = 20;
export const MAX_DECORATIONS = 8;

/** Coins for finishing a cook, given the previous record (repeat cooks earn nothing, §4.5). */
export function cookReward(prev: { cooked: number; stars: number } | undefined, newStars: number): number {
  let coins = 0;
  if (!prev || prev.cooked === 0) coins += FIRST_COOK_COINS;
  if (newStars === 3 && (!prev || prev.stars < 3)) coins += FIRST_THREE_STAR_COINS;
  return coins;
}

export function isRecipeUnlocked(recipe: RecipeDef, cooked: Record<string, { cooked: number }>): boolean {
  return !recipe.unlockAfter || (cooked[recipe.unlockAfter]?.cooked ?? 0) > 0;
}
