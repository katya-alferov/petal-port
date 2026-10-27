// Puzzle Shop (game-systems §25): tap two pieces to swap them until the picture is whole. Pieces that are in
// the right place get a green rim. No timer, nothing taken away.
import { makeRng } from './rng';

export const PUZZLES = ['meadow', 'harbour', 'castle'] as const;
export const SIZES = [
  { cols: 2, rows: 2, pay: 10 },
  { cols: 3, rows: 2, pay: 14 },
  { cols: 3, rows: 3, pay: 20 },
] as const;

/** A shuffled arrangement: piece[i] is which part of the picture sits in slot i. Never already solved. */
export function shuffle(size: number, seed: number): number[] {
  const n = SIZES[Math.min(size, SIZES.length - 1)];
  const count = n.cols * n.rows;
  const rng = makeRng(seed * 8191 + size * 31 + 5);
  const order = Array.from({ length: count }, (_, i) => i);
  for (let tries = 0; tries < 20; tries++) {
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    if (order.some((v, i) => v !== i)) break;
  }
  if (order.every((v, i) => v === i)) [order[0], order[1]] = [order[1], order[0]];
  return order;
}

export function swap(order: readonly number[], a: number, b: number): number[] {
  const out = [...order];
  [out[a], out[b]] = [out[b], out[a]];
  return out;
}

export const solved = (order: readonly number[]) => order.every((v, i) => v === i);
export const puzzlePay = (size: number) => SIZES[Math.min(size, SIZES.length - 1)].pay;
