// Sweet Spot menu (game-systems §13).
export interface SweetOption {
  id: string;
  name: string;
  /** Swatch color for frostings. */
  color?: string;
}

export const FROSTINGS: SweetOption[] = [
  { id: 'pink', name: 'Strawberry pink', color: '#FF9EC4' },
  { id: 'cream', name: 'Vanilla cream', color: '#FFF1D0' },
  { id: 'choc', name: 'Chocolate', color: '#8A5A3C' },
  { id: 'mint', name: 'Mint', color: '#9BE3C2' },
  { id: 'lilac', name: 'Lilac', color: '#C8B3FF' },
  { id: 'sky', name: 'Sky blue', color: '#A9D8FF' },
];
export const SWIRLS: SweetOption[] = [
  { id: 'swirl', name: 'Tall swirl' },
  { id: 'flat', name: 'Smooth top' },
];
export const SWEET_TOPPINGS: SweetOption[] = [
  { id: 'cherry', name: 'Cherry' },
  { id: 'sprinkles', name: 'Sprinkles' },
  { id: 'star', name: 'Gold star' },
  { id: 'heart', name: 'Candy heart' },
  { id: 'candle', name: 'Candle' },
];

export const SWEET_MENU = {
  frostings: FROSTINGS.map((f) => f.id),
  swirls: SWIRLS.map((f) => f.id),
  toppings: SWEET_TOPPINGS.map((f) => f.id),
};
export const frosting = (id: string) => FROSTINGS.find((f) => f.id === id);
export const nameOf = (list: SweetOption[], id: string) => list.find((o) => o.id === id)?.name ?? id;
