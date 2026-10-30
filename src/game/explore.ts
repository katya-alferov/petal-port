// Explore places (game-systems §30): Tide Pools (turn over rocks to find the creatures on your list) and
// Starlight Hill (tap the stars in order to draw a constellation). Pure rules; both are kind: a wrong
// guess only gives a hint, and nothing is ever taken away.
import { makeRng } from './rng';

export const CREATURE_IDS = ['crab', 'hermit', 'snail', 'urchin', 'octopus', 'seastar', 'clam', 'shrimp'] as const;
export const ROCKS = 8;
export const TARGETS = 4;
export const TIDE_PAY = 12;
export const TIDE_NEW = 4;

export interface Pools {
  /** The creatures on the list, in order. */
  targets: string[];
  /** What is under each of the 8 rocks (`null` is just sand). */
  rocks: (string | null)[];
}

function shuffle<T>(list: readonly T[], rng: () => number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * The pools for visit number `visit`. The list prefers creatures you have not met yet; four more rocks hold
 * two other creatures and two empty spots. Seeded by the visit number, so a visit is always the same.
 */
export function tidePools(visit: number, have: readonly string[]): Pools {
  const rng = makeRng(visit * 3203 + 17);
  const order = shuffle(CREATURE_IDS, rng);
  const fresh = order.filter((c) => !have.includes(c));
  const seen = order.filter((c) => have.includes(c));
  const targets = [...fresh, ...seen].slice(0, TARGETS);
  const others = order.filter((c) => !targets.includes(c)).slice(0, 2);
  const slots = shuffle(
    Array.from({ length: ROCKS }, (_, i) => i),
    rng,
  );
  const rocks: (string | null)[] = Array(ROCKS).fill(null);
  [...targets, ...others].forEach((c, i) => (rocks[slots[i]] = c));
  return { targets, rocks };
}

export const tidePay = (newCount: number) => TIDE_PAY + Math.max(0, newCount) * TIDE_NEW;

export interface Constellation {
  id: string;
  /** Stars in tapping order, 0..100 in both directions. */
  stars: [number, number][];
  /** Draw a line from the last star back to the first. */
  closed: boolean;
}

export const CONSTELLATIONS: readonly Constellation[] = [
  {
    id: 'kitty',
    closed: true,
    stars: [
      [24, 74],
      [24, 34],
      [40, 48],
      [60, 48],
      [76, 34],
      [76, 74],
    ],
  },
  {
    id: 'heart',
    closed: true,
    stars: [
      [50, 82],
      [22, 56],
      [20, 34],
      [36, 24],
      [50, 38],
      [64, 24],
      [80, 34],
      [78, 56],
    ],
  },
  {
    id: 'crown',
    closed: true,
    stars: [
      [18, 72],
      [18, 36],
      [36, 54],
      [50, 28],
      [64, 54],
      [82, 36],
      [82, 72],
    ],
  },
  {
    id: 'gem',
    closed: true,
    stars: [
      [30, 28],
      [70, 28],
      [88, 50],
      [50, 88],
      [12, 50],
    ],
  },
  {
    id: 'boat',
    closed: false,
    stars: [
      [14, 62],
      [30, 84],
      [70, 84],
      [86, 62],
      [52, 62],
      [52, 14],
      [76, 44],
    ],
  },
];

export const STAR_PAY = 10;
export const STAR_FIRST = 12;
export const starPay = (first: boolean) => STAR_PAY + (first ? STAR_FIRST : 0);
