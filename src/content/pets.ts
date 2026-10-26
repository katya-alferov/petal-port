// Paw Parlour pets, foods and accessories (game-systems §8.1). Ids are permanent.
import type { Shade } from './palette';
import type { Source } from './types';

export interface PetKindDef {
  id: string;
  name: string;
  /** Foods the pet asks for, in rotation. */
  favourites: string[];
  names: string[];
}

export const PET_KINDS: PetKindDef[] = [
  {
    id: 'pet.kitten',
    name: 'Kitten',
    favourites: ['food.fish', 'food.milk', 'food.cookie'],
    names: ['Mochi', 'Luna', 'Pickle', 'Biscuit'],
  },
  {
    id: 'pet.puppy',
    name: 'Puppy',
    favourites: ['food.bone', 'food.apple', 'food.cookie'],
    names: ['Waffles', 'Pepper', 'Noodle', 'Sunny'],
  },
  { id: 'pet.bunny', name: 'Bunny', favourites: ['food.carrot', 'food.apple', 'food.berries'], names: ['Clover', 'Bean', 'Daisy', 'Pom'] },
];

export interface PetColorDef {
  id: string;
  name: string;
  fur: Shade;
  /** Belly, muzzle and inner ears. */
  light: string;
}

export const PET_COLORS: PetColorDef[] = [
  { id: 'petcolor.ginger', name: 'Ginger', fur: { base: '#F4A15D', shadow: '#CF7E48', highlight: '#FFC690' }, light: '#FFF1DE' },
  { id: 'petcolor.cream', name: 'Cream', fur: { base: '#F6E3C6', shadow: '#D8BC9C', highlight: '#FFF6E8' }, light: '#FFFFFF' },
  { id: 'petcolor.grey', name: 'Cloud grey', fur: { base: '#B9B4C7', shadow: '#948DA6', highlight: '#DAD6E4' }, light: '#F3F0F8' },
  { id: 'petcolor.cocoa', name: 'Cocoa', fur: { base: '#9A6A4A', shadow: '#77503A', highlight: '#C08D68' }, light: '#F2DCC0' },
  { id: 'petcolor.lilac', name: 'Lilac', fur: { base: '#C7B4FF', shadow: '#A08ADB', highlight: '#E2D8FF' }, light: '#FFF7FF' },
  { id: 'petcolor.petal', name: 'Petal pink', fur: { base: '#FFB0CB', shadow: '#E08AAC', highlight: '#FFD3E2' }, light: '#FFF7FA' },
];

export const PET_FOODS: { id: string; name: string }[] = [
  { id: 'food.fish', name: 'Fish' },
  { id: 'food.milk', name: 'Milk' },
  { id: 'food.cookie', name: 'Pet cookie' },
  { id: 'food.bone', name: 'Bone' },
  { id: 'food.apple', name: 'Apple' },
  { id: 'food.carrot', name: 'Carrot' },
  { id: 'food.berries', name: 'Berries' },
];

export interface PetAccessoryDef {
  id: string;
  name: string;
  source: Source;
  art: 'bow' | 'bandana' | 'crown' | 'bell';
  color: string;
}

const parlour = (price: number) => ({ kind: 'shop', shop: 'paw-parlour', price }) as const;

export const PET_ACCESSORIES: PetAccessoryDef[] = [
  { id: 'petacc.bow', name: 'Big Bow', source: parlour(25), art: 'bow', color: '#FF7BA9' },
  { id: 'petacc.bandana', name: 'Bandana', source: parlour(30), art: 'bandana', color: '#3BB7C4' },
  { id: 'petacc.bell', name: 'Bell Collar', source: parlour(35), art: 'bell', color: '#B39DFF' },
  { id: 'petacc.crown', name: 'Tiny Crown', source: parlour(45), art: 'crown', color: '#FFC94A' },
];

export const TRICK_NAMES = ['Sit', 'Spin', 'High five', 'Dance', 'Roll over'] as const;

export function petKind(id: string): PetKindDef {
  return PET_KINDS.find((k) => k.id === id) ?? PET_KINDS[0];
}
export function petColor(id: string): PetColorDef {
  return PET_COLORS.find((c) => c.id === id) ?? PET_COLORS[0];
}
export function petAccessory(id: string | null): PetAccessoryDef | undefined {
  return PET_ACCESSORIES.find((a) => a.id === id);
}
export function petFood(id: string): { id: string; name: string } | undefined {
  return PET_FOODS.find((f) => f.id === id);
}
