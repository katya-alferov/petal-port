// Skate Park (game-systems §16): a gentle course of obstacles. Tap Jump as one reaches you. A bump just
// makes the skater wobble and roll on; it never ends the run and never takes coins. Pure rules only:
// the scene supplies the clock. A second tap in the air is a double jump (higher, needed for walls and star arcs).
import { makeRng } from './rng';

export type ObstacleKind = 'cone' | 'rail' | 'ramp' | 'wall';

export interface Obstacle {
  kind: ObstacleKind;
  /** Distance along the course in track units (1 unit = 1 px of the 1000-wide track). */
  at: number;
}

export const OBSTACLES = 8;
export const STARS = 6;
export const SKATE_PAY = 20;
/** Paid per obstacle cleared. */
export const SKATE_CLEAR = 3;
/** Extra for a perfect run (all cleared). */
export const SKATE_PERFECT = 10;
/** Paid per sky star caught and per spin trick (an obstacle cleared in a high double jump). */
export const SKATE_STAR = 2;
export const SKATE_TRICK = 2;
export const SPEED = 190; // track units per second: slow on purpose
export const JUMP_SECONDS = 0.8;
export const SKATER_X = 120;
/** An obstacle is cleared if it passes the skater while airborne (a bit of slack before and after). */
export const SLACK = 26;

/** Heights are in "hops": 1 is the peak of a single jump. */
export const GRAVITY = 12.5;
export const JUMP_V = 5; // peak = V² / 2g = 1 hop, airtime = 2V / g = 0.8 s
/** The second tap must come at least this long after the first. */
export const DOUBLE_GAP = 0.12;
/** Feet height needed to clear a wall, to catch a star, and to count as a spin trick. */
export const WALL_NEED = 1.4;
export const STAR_NEED = 1.5;
export const TRICK_NEED = 1.05;

const KINDS: readonly ObstacleKind[] = ['cone', 'rail', 'ramp'];

/** The two gaps (between obstacle i and i + 1) that hold a star arc; they are made wider so a double jump has room. */
function starGaps(run: number): [number, number] {
  const rng = makeRng(run * 977 + 41);
  return [Math.floor(rng() * 3), 4 + Math.floor(rng() * 3)];
}
const STAR_GAP_EXTRA = 200;

/** The course for a run, seeded by the run number: 8 obstacles at least 330 units apart, 2 of them walls. */
export function course(run: number): Obstacle[] {
  const rng = makeRng(run * 3571 + 9);
  const w1 = 2 + Math.floor(rng() * 2); // index 2 or 3
  const w2 = 5 + Math.floor(rng() * 3); // index 5, 6 or 7
  const gaps = starGaps(run);
  let at = 900;
  return Array.from({ length: OBSTACLES }, (_, i) => {
    const o: Obstacle = { kind: i === w1 || i === w2 ? 'wall' : KINDS[Math.floor(rng() * KINDS.length)], at };
    at += 330 + Math.floor(rng() * 160) + (gaps.includes(i) ? STAR_GAP_EXTRA : 0);
    return o;
  });
}

/** Two arcs of three sky stars, each centred between two obstacles; they need a double jump. */
export function stars(run: number): { at: number }[] {
  const c = course(run);
  return starGaps(run).flatMap((i) => {
    const mid = (c[i].at + c[i + 1].at) / 2;
    return [-40, 0, 40].map((d) => ({ at: mid + d }));
  });
}

/** Where the obstacle is on screen, `t` seconds into the run (it moves toward the skater). */
export const screenX = (o: { at: number }, t: number) => o.at - t * SPEED;

/** Time the obstacle reaches the skater. */
export const reachTime = (o: { at: number }) => (o.at - SKATER_X) / SPEED;

/** One take-off: a jump from the ground or a double jump from the air. */
export interface Flight {
  t0: number;
  y0: number;
  v0: number;
  double: boolean;
}

const landing = (f: Flight) => f.t0 + (f.v0 + Math.sqrt(f.v0 * f.v0 + 2 * GRAVITY * f.y0)) / GRAVITY;

/** Height of the skater's feet at time `t` (0 on the ground). */
export function heightAt(flights: Flight[], t: number): number {
  let f: Flight | undefined;
  for (const x of flights) if (x.t0 <= t) f = x;
  if (!f) return 0;
  const tau = t - f.t0;
  return Math.max(0, f.y0 + f.v0 * tau - 0.5 * GRAVITY * tau * tau);
}

/** A tap at time `t`: jumps from the ground, double-jumps once in the air, and is ignored otherwise. */
export function tap(flights: Flight[], t: number): Flight[] {
  const last = flights[flights.length - 1];
  if (!last || t >= landing(last)) return [...flights, { t0: t, y0: 0, v0: JUMP_V, double: false }];
  if (last.double || t - last.t0 < DOUBLE_GAP) return flights;
  return [...flights, { t0: t, y0: heightAt(flights, t), v0: JUMP_V, double: true }];
}

const SAMPLES = 12;
function window$(at: { at: number }, flights: Flight[]): number[] {
  const reach = reachTime(at);
  const slack = SLACK / SPEED;
  return Array.from({ length: SAMPLES + 1 }, (_, i) => heightAt(flights, reach - slack + (2 * slack * i) / SAMPLES));
}

/** Was the skater high enough while the obstacle passed? Walls need a double jump, the rest any jump. */
export function cleared(o: Obstacle, flights: Flight[]): boolean {
  const hs = window$(o, flights);
  return o.kind === 'wall' ? Math.max(...hs) >= WALL_NEED : Math.max(...hs) > 0.05;
}

export function caught(star: { at: number }, flights: Flight[]): boolean {
  return Math.max(...window$(star, flights)) >= STAR_NEED;
}

/** A cleared obstacle taken in a high double jump is a spin trick. */
export const trick = (o: Obstacle, flights: Flight[]) => cleared(o, flights) && Math.max(...window$(o, flights)) >= TRICK_NEED;

export const runEnd = (c: Obstacle[]) => reachTime(c[c.length - 1]) + 1;

export const skatePay = (clearedCount: number, starCount = 0, tricks = 0) =>
  SKATE_PAY + clearedCount * SKATE_CLEAR + (clearedCount >= OBSTACLES ? SKATE_PERFECT : 0) + starCount * SKATE_STAR + tricks * SKATE_TRICK;
