// Petal Garden (game-systems §10.2): plant free seeds; every finished activity (café shift, dish,
// show, salon shift, note, pet care) gives each planted flower one step of growth. Flowers never
// wilt and wait forever once they bloom, so there is nothing to miss.
import type { GardenBed, Progress } from './save';

export const SPROUT_AT = 1;
export const BUD_AT = 3;
export const BLOOM_AT = 5;
export const PICK_COINS = 5;

export type Stage = 'seed' | 'sprout' | 'bud' | 'bloom';

export function stage(growth: number): Stage {
  return growth >= BLOOM_AT ? 'bloom' : growth >= BUD_AT ? 'bud' : growth >= SPROUT_AT ? 'sprout' : 'seed';
}

/** Activities still needed before the flower blooms. */
export function toBloom(bed: GardenBed): number {
  return Math.max(0, BLOOM_AT - bed.growth);
}

export function plant(garden: Progress['garden'], i: number, seed: string): Progress['garden'] {
  if (i < 0 || i >= garden.beds.length || garden.beds[i]) return garden;
  return { ...garden, beds: garden.beds.map((b, j) => (j === i ? { seed, growth: 0 } : b)) };
}

/** One finished activity: every planted bed grows one step (up to bloom). */
export function grow(garden: Progress['garden']): Progress['garden'] {
  if (!garden.beds.some((b) => b && b.growth < BLOOM_AT)) return garden;
  return { ...garden, beds: garden.beds.map((b) => (b ? { ...b, growth: Math.min(BLOOM_AT, b.growth + 1) } : b)) };
}

/** Picks a bloom: the bed empties and the flower kind joins the collection. */
export function pickBloom(garden: Progress['garden'], i: number): { garden: Progress['garden']; seed: string; first: boolean } | null {
  const bed = garden.beds[i];
  if (!bed || stage(bed.growth) !== 'bloom') return null;
  const first = !garden.bloomed.includes(bed.seed);
  return {
    garden: {
      beds: garden.beds.map((b, j) => (j === i ? null : b)),
      bloomed: first ? [...garden.bloomed, bed.seed] : garden.bloomed,
      picked: garden.picked + 1,
    },
    seed: bed.seed,
    first,
  };
}
