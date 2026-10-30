// Pet care rules (game-systems §8.1). Pets never get hungry, sick or sad: care only adds.
import type { PetAction, PetState } from './save';

/** Total care needed to know each trick, in order (index = trick number). */
export const TRICK_AT = [0, 3, 8, 15, 25] as const;
export const WASH_SPOTS = 5;
export const CATCHES = 3;
/** A little pocket money for each finished care activity (game-systems §32). */
export const CARE_PAY: Record<PetAction, number> = { feed: 1, wash: 2, play: 2 };

export function careCount(pet: PetState): number {
  return pet.fed + pet.washed + pet.played;
}

/** How many tricks the pet knows (at least 1: every pet can sit). */
export function tricksKnown(pet: PetState): number {
  const c = careCount(pet);
  return TRICK_AT.filter((at) => c >= at).length;
}

/** Care still needed before the next trick, or null when all are known. */
export function careToNextTrick(pet: PetState): number | null {
  const next = TRICK_AT[tricksKnown(pet)];
  return next === undefined ? null : next - careCount(pet);
}

export function adopt(kind: string, color: string, name: string): PetState {
  return { kind, color, name: name.trim().slice(0, 12) || 'Buddy', accessory: null, fed: 0, washed: 0, played: 0 };
}

const FIELD: Record<PetAction, 'fed' | 'washed' | 'played'> = { feed: 'fed', wash: 'washed', play: 'played' };

/** Records one finished care activity; reports a newly learned trick number, if any. */
export function care(pet: PetState, action: PetAction): { pet: PetState; newTrick: number | null } {
  const before = tricksKnown(pet);
  const next = { ...pet, [FIELD[action]]: pet[FIELD[action]] + 1 };
  const after = tricksKnown(next);
  return { pet: next, newTrick: after > before ? after - 1 : null };
}

/** The food the pet asks for next: a fixed rotation through its favourites, so it is never random. */
export function wantedFood(pet: PetState, favourites: readonly string[]): string {
  return favourites[pet.fed % favourites.length];
}

/** Three bowls: the wanted food plus two others, in an order that changes each meal. */
export function bowls(pet: PetState, favourites: readonly string[], allFoods: readonly string[]): string[] {
  const want = wantedFood(pet, favourites);
  const others = allFoods.filter((f) => f !== want);
  const a = others[pet.fed % others.length];
  const b = others[(pet.fed + 2) % others.length];
  const set = [want, a, b === a ? others[(pet.fed + 3) % others.length] : b];
  const r = pet.fed % 3;
  return [...set.slice(r), ...set.slice(0, r)];
}

/** Where the ball lands for catch number n (0..CATCHES-1): fixed spots, 0..1 in both axes. */
export function ballSpot(pet: PetState, n: number): { x: number; y: number } {
  const spots = [
    { x: 0.22, y: 0.3 },
    { x: 0.78, y: 0.36 },
    { x: 0.5, y: 0.18 },
    { x: 0.3, y: 0.55 },
    { x: 0.72, y: 0.6 },
  ];
  return spots[(pet.played * CATCHES + n) % spots.length];
}
