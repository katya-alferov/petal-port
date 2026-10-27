// Picnic Pairs (game-systems §21): a memory game at Petal Park. Flip two cards; a match stays. There is no
// timer and nothing is taken away: a mismatch just turns back over. Three board sizes.
import { makeRng } from './rng';

export const SYMBOLS = ['cupcake', 'flower', 'star', 'burger', 'pancake', 'music'] as const;
export type Symbol = (typeof SYMBOLS)[number];

export const BOARDS = [
  { pairs: 3, pay: 10, cols: 3 },
  { pairs: 4, pay: 14, cols: 4 },
  { pairs: 6, pay: 20, cols: 4 },
] as const;
/** Paid on top when the board was cleared with at most this many extra tries per pair... one miss per pair. */
export const SHARP_BONUS = 4;

/** A shuffled board: each symbol twice, seeded by the game number so it is repeatable in tests. */
export function deal(level: number, game: number): Symbol[] {
  const rng = makeRng(game * 2731 + level * 97 + 11);
  const board = BOARDS[Math.min(level, BOARDS.length - 1)];
  const picks = [...SYMBOLS];
  const chosen: Symbol[] = [];
  for (let i = 0; i < board.pairs; i++) chosen.push(picks.splice(Math.floor(rng() * picks.length), 1)[0]);
  const cards = [...chosen, ...chosen];
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export const isMatch = (cards: readonly Symbol[], a: number, b: number) => a !== b && cards[a] === cards[b];

export const sharp = (level: number, misses: number) => misses <= BOARDS[Math.min(level, BOARDS.length - 1)].pairs;
export const pairsPay = (level: number, misses: number) =>
  BOARDS[Math.min(level, BOARDS.length - 1)].pay + (sharp(level, misses) ? SHARP_BONUS : 0);
