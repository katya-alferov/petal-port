// Home cooking recipes (game-systems §4.3).
import type { RecipeDef } from '../game/cooking';

export interface KitchenItem {
  id: string;
  name: string;
}

export const KITCHEN_ITEMS: KitchenItem[] = [
  { id: 'ing.flour', name: 'Flour' },
  { id: 'ing.egg', name: 'Egg' },
  { id: 'ing.milk', name: 'Milk' },
  { id: 'ing.butter', name: 'Butter' },
  { id: 'ing.carrot', name: 'Carrot' },
  { id: 'ing.fish', name: 'Fish' },
  { id: 'deco.berries', name: 'Berries' },
  { id: 'deco.banana', name: 'Banana' },
  { id: 'deco.syrup', name: 'Syrup' },
  { id: 'deco.cream', name: 'Cream' },
  { id: 'deco.sprinkles', name: 'Sprinkles' },
  { id: 'deco.lemon', name: 'Lemon' },
  { id: 'deco.sugar', name: 'Sugar' },
  { id: 'deco.strawberry', name: 'Strawberry' },
  { id: 'deco.chocolate', name: 'Chocolate' },
];

export const RECIPES: RecipeDef[] = [
  {
    id: 'recipe.pancakes',
    name: 'Fluffy Pancakes',
    steps: [
      { type: 'add', items: ['ing.flour', 'ing.egg', 'ing.milk'] },
      { type: 'mix' },
      { type: 'pour' },
      { type: 'heat' },
      { type: 'decorate' },
    ],
    shelf: ['ing.flour', 'ing.carrot', 'ing.egg', 'ing.fish', 'ing.milk'],
    toppings: ['deco.berries', 'deco.banana', 'deco.syrup', 'deco.cream', 'deco.sprinkles'],
    golden: [2.5, 5.5],
  },
  {
    id: 'recipe.crepes',
    name: 'Crêpes',
    steps: [
      { type: 'add', items: ['ing.flour', 'ing.egg', 'ing.milk', 'ing.butter'] },
      { type: 'mix' },
      { type: 'pour' },
      { type: 'heat' },
      { type: 'fold' },
      { type: 'decorate' },
    ],
    shelf: ['ing.butter', 'ing.flour', 'ing.carrot', 'ing.egg', 'ing.milk', 'ing.fish'],
    toppings: ['deco.lemon', 'deco.sugar', 'deco.strawberry', 'deco.chocolate'],
    golden: [2.0, 4.5],
    unlockAfter: 'recipe.pancakes',
  },
];

export function kitchenItem(id: string): KitchenItem | undefined {
  return KITCHEN_ITEMS.find((i) => i.id === id);
}

/** Welcome Journey (game-systems §6.7). Paris arrives with travel. */
export const JOURNEY_STEPS = [
  { id: 'journey.character', label: 'Make your character' },
  { id: 'journey.cook', label: 'Cook your first dish' },
  { id: 'journey.cafe', label: 'Work a café shift' },
  { id: 'journey.boutique', label: 'Buy something at the Boutique' },
  { id: 'journey.decorate', label: 'Decorate your home' },
] as const;
export const JOURNEY_COINS = 15;
