// Trips beyond Paris (game-systems §31): more cities to fly to, and a paid attraction near each one with
// three interactive rides. Pure rules; the scenes supply time. Every ride is kind: a miss only means "try
// again", nothing is taken away, and a ride is finished by trying, not by being perfect.
import { makeRng } from './rng';

export type DestId = 'paris' | 'newyork';
export type AttractionId = 'storybook' | 'funfair';

export const NEWYORK_TICKET = 600;
/** Paid at the gate each visit; rides inside are free, and a visit can replay any ride. */
export const ATTRACTION_FEE = 150;

export interface RideDef {
  id: string;
  kind: 'stop' | 'lights' | 'wish';
}

export interface AttractionDef {
  id: AttractionId;
  /** The city the trip starts from. */
  from: DestId;
  rides: RideDef[];
}

export const ATTRACTIONS: AttractionDef[] = [
  {
    id: 'storybook',
    from: 'paris',
    rides: [
      { id: 'carousel', kind: 'stop' },
      { id: 'fireworks', kind: 'lights' },
      { id: 'fountain', kind: 'wish' },
    ],
  },
  {
    id: 'funfair',
    from: 'newyork',
    rides: [
      { id: 'wheel', kind: 'stop' },
      { id: 'bell', kind: 'stop' },
      { id: 'neon', kind: 'lights' },
    ],
  },
];

export const attraction = (id: string) => ATTRACTIONS.find((a) => a.id === id);
export const stampKey = (a: string, ride: string) => `${a}.${ride}`;

/** Souvenirs (ids) earned for a stamp, and for the full passport. */
export const RIDE_PRIZE: Record<string, string> = {
  'storybook.carousel': 'souvenir.snowdome',
  'storybook.fireworks': 'souvenir.rocketpin',
  'funfair.wheel': 'souvenir.skylens',
  'funfair.bell': 'souvenir.teddy',
};
export const FINALE_PRIZE: Record<string, string> = {
  storybook: 'souvenir.wand',
  funfair: 'souvenir.rainbowpop',
};

// ---- Stop games: a marker sweeps back and forth, tap to stop it in the glowing zone -------------------

export const STOP_ROUNDS = 5;
/** One sweep from one end to the other takes this long (seconds): slow on purpose. */
export const SWEEP_SECONDS = 1.8;
/** The glowing zone is this wide as a fraction of the track, and sits at a seeded spot each round. */
export const ZONE_WIDTH = 0.3;

/** Marker position 0..1 at time `t`: a triangle wave, so it sweeps there and back. */
export function markerAt(t: number): number {
  const p = (((t / SWEEP_SECONDS) % 2) + 2) % 2;
  return p <= 1 ? p : 2 - p;
}

/** Where the glowing zone starts for round `round` of a ride (seeded: the same every visit). */
export function zoneStart(seed: number, round: number): number {
  const r = makeRng(seed * 7919 + round * 131 + 3)();
  return 0.1 + r * (0.8 - ZONE_WIDTH);
}

export const inZone = (marker: number, start: number) => marker >= start && marker <= start + ZONE_WIDTH;

/** A stop ride is finished once all rounds were tried; stars show how many hit the zone. */
export function stopStars(hits: number): 1 | 2 | 3 {
  return hits >= 4 ? 3 : hits >= 2 ? 2 : 1;
}

// ---- Light games: watch the lights, repeat them in the same order ---------------------------------------

export const LIGHTS = 4;
export const LIGHT_ROUNDS = 3;
export const LIGHT_START_LENGTH = 3;

/** The lights to repeat in round `round` (0-based): 3, then 4, then 5 long; round n starts like round n-1. */
export function lightSequence(seed: number, round: number): number[] {
  const rng = makeRng(seed * 4423 + 7);
  const len = LIGHT_START_LENGTH + round;
  return Array.from({ length: len }, () => Math.floor(rng() * LIGHTS));
}

/** Tapping `light` as the `step`-th light of `seq`. */
export const rightLight = (seq: number[], step: number, light: number) => seq[step] === light;

// ---- The paid gate and the stamps ------------------------------------------------------------------------

export interface Passport {
  /** Stamp keys earned so far (`storybook.carousel`). */
  stamps: string[];
}

/** What a newly finished ride adds: its stamp, a prize for some rides, and the finale prize on the last stamp. */
export function stampRide(
  stamps: readonly string[],
  a: AttractionId,
  rideId: string,
): { stamps: string[]; first: boolean; prize: string | null; finale: string | null } {
  const key = stampKey(a, rideId);
  const first = !stamps.includes(key);
  const next = first ? [...stamps, key] : [...stamps];
  const def = attraction(a);
  const complete = def ? def.rides.every((r) => next.includes(stampKey(a, r.id))) : false;
  const wasComplete = def ? def.rides.every((r) => stamps.includes(stampKey(a, r.id))) : false;
  return {
    stamps: next,
    first,
    prize: first ? (RIDE_PRIZE[key] ?? null) : null,
    finale: complete && !wasComplete ? (FINALE_PRIZE[a] ?? null) : null,
  };
}
