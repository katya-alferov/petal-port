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
  { id: 'ing.cheese', name: 'Cheese' },
  { id: 'ing.bread', name: 'Bread' },
  { id: 'deco.berries', name: 'Berries' },
  { id: 'deco.banana', name: 'Banana' },
  { id: 'deco.syrup', name: 'Syrup' },
  { id: 'deco.cream', name: 'Cream' },
  { id: 'deco.sprinkles', name: 'Sprinkles' },
  { id: 'deco.lemon', name: 'Lemon' },
  { id: 'deco.sugar', name: 'Sugar' },
  { id: 'deco.strawberry', name: 'Strawberry' },
  { id: 'deco.chocolate', name: 'Chocolate' },
  { id: 'deco.tomato', name: 'Tomato' },
  { id: 'deco.herbs', name: 'Herbs' },
  { id: 'deco.mushroom', name: 'Mushroom' },
  { id: 'deco.cheese', name: 'Grated cheese' },
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
  {
    id: 'recipe.omelette',
    name: 'Cheesy Omelette',
    steps: [
      { type: 'add', items: ['ing.egg', 'ing.milk', 'ing.cheese'] },
      { type: 'mix' },
      { type: 'pour' },
      { type: 'heat' },
      { type: 'fold' },
      { type: 'decorate' },
    ],
    shelf: ['ing.cheese', 'ing.carrot', 'ing.egg', 'ing.flour', 'ing.milk'],
    toppings: ['deco.tomato', 'deco.herbs', 'deco.mushroom', 'deco.cheese'],
    golden: [2.0, 4.5],
    unlockAfter: 'recipe.crepes',
  },
  {
    id: 'recipe.waffles',
    name: 'Waffles',
    steps: [
      { type: 'add', items: ['ing.flour', 'ing.egg', 'ing.milk', 'ing.butter'] },
      { type: 'mix' },
      { type: 'pour' },
      { type: 'heat' },
      { type: 'decorate' },
    ],
    shelf: ['ing.butter', 'ing.flour', 'ing.fish', 'ing.egg', 'ing.milk', 'ing.cheese'],
    toppings: ['deco.berries', 'deco.banana', 'deco.syrup', 'deco.cream', 'deco.chocolate'],
    golden: [3.0, 6.0],
    unlockAfter: 'recipe.crepes',
  },
  {
    id: 'recipe.toast',
    name: 'French Toast',
    steps: [
      { type: 'add', items: ['ing.bread', 'ing.egg', 'ing.milk'] },
      { type: 'mix' },
      { type: 'pour' },
      { type: 'heat' },
      { type: 'decorate' },
    ],
    shelf: ['ing.bread', 'ing.carrot', 'ing.egg', 'ing.fish', 'ing.milk'],
    toppings: ['deco.strawberry', 'deco.syrup', 'deco.sugar', 'deco.banana', 'deco.cream'],
    golden: [2.5, 5.0],
    unlockAfter: 'recipe.omelette',
  },
];

export const recipeName = (id: string | undefined) => RECIPES.find((r) => r.id === id)?.name.toLowerCase() ?? 'pancakes';

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
