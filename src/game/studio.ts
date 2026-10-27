// Art Studio (game-systems §24): a coloring book. Tap a picture's parts to paint them; there is no wrong
// color. Hanging a finished picture in the gallery pays once per picture.
export const PICTURES = [
  { id: 'butterfly', name: 'Butterfly', parts: 8 },
  { id: 'cupcake', name: 'Cupcake', parts: 6 },
  { id: 'house', name: 'Little House', parts: 8 },
] as const;
export type PictureId = (typeof PICTURES)[number]['id'];
export const PAINTS = ['rose', 'berry', 'orange', 'sun', 'mint', 'sky', 'lilac', 'cream', 'brown'] as const;
export type Paint = (typeof PAINTS)[number];

export const FIRST_PICTURE_COINS = 15;
export const MAX_WORKS = 12;
export interface Work {
  pic: string;
  colors: string[];
}

export const partsOf = (pic: string) => PICTURES.find((p) => p.id === pic)?.parts ?? 0;
export const blank = (pic: string): (Paint | null)[] => Array(partsOf(pic)).fill(null);
export const finished = (colors: readonly (string | null)[]) => colors.length > 0 && colors.every((c) => c !== null);

/** Coins for hanging a picture: only the first time for each picture. */
export const hangCoins = (made: readonly string[], pic: string) => (made.includes(pic) ? 0 : FIRST_PICTURE_COINS);

/** Adds a finished picture to the gallery, keeping the newest MAX_WORKS. */
export function addWork(works: readonly Work[], w: Work): Work[] {
  return [...works, w].slice(-MAX_WORKS);
}
