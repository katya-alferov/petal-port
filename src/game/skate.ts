// Skate Park (game-systems §16): a gentle course of obstacles. Tap Jump as one reaches you. A bump just
// makes the skater wobble and roll on; it never ends the run and never takes coins. Pure rules only:
// the scene supplies the clock.
import { makeRng } from './rng';

export type ObstacleKind = 'cone' | 'rail' | 'ramp';

export interface Obstacle {
  kind: ObstacleKind;
  /** Distance along the course in track units (1 unit = 1 px of the 1000-wide track). */
  at: number;
}

export const OBSTACLES = 8;
export const SKATE_PAY = 20;
/** Paid per obstacle cleared. */
export const SKATE_CLEAR = 3;
/** Extra for a perfect run (all cleared). */
export const SKATE_PERFECT = 10;
export const SPEED = 190; // track units per second: slow on purpose
export const JUMP_SECONDS = 0.8;
export const SKATER_X = 120;
/** An obstacle is cleared if it passes the skater while airborne (a bit of slack before and after). */
export const SLACK = 26;

const KINDS: readonly ObstacleKind[] = ['cone', 'rail', 'ramp'];

/** The course for a run, seeded by the run number: 8 obstacles at least 330 units apart. */
export function course(run: number): Obstacle[] {
  const rng = makeRng(run * 3571 + 9);
  let at = 900;
  return Array.from({ length: OBSTACLES }, () => {
    const o = { kind: KINDS[Math.floor(rng() * KINDS.length)], at };
    at += 330 + Math.floor(rng() * 160);
    return o;
  });
}

/** Where the obstacle is on screen, `t` seconds into the run (it moves toward the skater). */
export const screenX = (o: Obstacle, t: number) => o.at - t * SPEED;

/** Time the obstacle reaches the skater. */
export const reachTime = (o: Obstacle) => (o.at - SKATER_X) / SPEED;

/** Was the skater in the air when the obstacle reached them? `jumpStart` is the last jump's start time. */
export function cleared(o: Obstacle, jumpStart: number | null): boolean {
  if (jumpStart === null) return false;
  const reach = reachTime(o);
  const slack = SLACK / SPEED;
  return reach >= jumpStart - slack && reach <= jumpStart + JUMP_SECONDS + slack;
}

export const runEnd = (c: Obstacle[]) => reachTime(c[c.length - 1]) + 1;

export const skatePay = (clearedCount: number) => SKATE_PAY + clearedCount * SKATE_CLEAR + (clearedCount >= OBSTACLES ? SKATE_PERFECT : 0);
