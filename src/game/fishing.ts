// Fishing Dock (game-systems §26): cast, wait for the splash, then reel in. Early or late taps just mean
// "cast again". Each catch pays a little and the next fish is always one you have not got yet, until the
// aquarium is full. No timer pressure beyond a generous splash window.
import { makeRng } from './rng';

export const FISH_IDS = [
  'minnow',
  'goldfish',
  'clownfish',
  'bluetang',
  'seahorse',
  'pufferfish',
  'angelfish',
  'jellyfish',
  'starfish',
  'whale',
] as const;

export const CATCH_PAY = 6;
export const NEW_FISH_BONUS = 10;
/** The splash lasts this long; tapping Reel in during it always catches. */
export const BITE_MS = 2200;

/** How long the bobber floats before the splash: 1.2 to 2.8 seconds, seeded by the cast number. */
export function biteDelay(cast: number): number {
  return 1200 + Math.floor(makeRng(cast * 4099 + 13)() * 1600);
}

/** The fish for this catch: a new one while any is missing, otherwise any (seeded by the catch count). */
export function nextFish(have: readonly string[], catches: number): string {
  const rng = makeRng(catches * 2287 + 29);
  const missing = FISH_IDS.filter((f) => !have.includes(f));
  const list = missing.length > 0 ? missing : FISH_IDS;
  return list[Math.floor(rng() * list.length)];
}

export const catchPay = (isNew: boolean) => CATCH_PAY + (isNew ? NEW_FISH_BONUS : 0);
