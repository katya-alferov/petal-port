// Petal Notes: townsfolk requests and friendship hearts (game-systems §8.2–8.3).
// Notes never expire; a player can swap any note for a new one at no cost.
import { makeRng, pick } from './rng';
import { MAX_HEARTS, type PetAction, type RequestGoal, type RequestNote } from './save';

export const BOARD_SIZE = 3;
export const CAFE_COUNT = 2;
export const NOTE_PAY: Record<RequestGoal['kind'], number> = { cook: 20, cafe: 15, wear: 10, place: 10, pet: 10 };
/** Hearts at which a friend sends their gift, and starts visiting your home. */
export const GIFT_AT = 3;
export const VISIT_AT = 5;

/** Everything a note can ask for, supplied by content. */
export interface RequestPools {
  friends: readonly string[];
  cook: readonly { recipe: string; toppings: readonly string[] }[];
  cafeBases: readonly string[];
  wear: readonly string[];
  place: readonly string[];
}

/** What the player has unlocked right now, so notes only ask for possible things. */
export interface RequestContext {
  hasPet: boolean;
  unlockedRecipes: readonly string[];
}

export type GameEvent =
  { kind: 'cook'; recipe: string; toppings: readonly string[] } | { kind: 'cafe'; base: string } | { kind: 'pet'; action: PetAction };

/** What `wear` and `place` goals look at. */
export interface LiveState {
  wearing: readonly string[];
  placed: readonly string[];
}

const PET_ACTIONS: PetAction[] = ['feed', 'wash', 'play'];

export function goalKey(g: RequestGoal): string {
  switch (g.kind) {
    case 'cook':
      return `cook:${g.recipe}:${g.topping}`;
    case 'cafe':
      return `cafe:${g.base}`;
    case 'pet':
      return `pet:${g.action}`;
    default:
      return `${g.kind}:${g.item}`;
  }
}

/** A new note, deterministic for (seed, no). It avoids friends and goal kinds already on the board. */
export function makeNote(no: number, seed: number, board: readonly RequestNote[], pools: RequestPools, ctx: RequestContext): RequestNote {
  const rng = makeRng((seed ^ Math.imul(no + 1, 0x9e3779b1)) >>> 0);
  const busyFriends = new Set(board.map((n) => n.friend));
  const freeFriends = pools.friends.filter((f) => !busyFriends.has(f));
  const friend = pick(rng, freeFriends.length ? freeFriends : pools.friends);

  const busyKinds = new Set(board.map((n) => n.goal.kind));
  const cook = pools.cook.filter((c) => ctx.unlockedRecipes.includes(c.recipe));
  const kinds = (['cook', 'cafe', 'wear', 'place', 'pet'] as const).filter(
    (k) => !busyKinds.has(k) && (k !== 'pet' || ctx.hasPet) && (k !== 'cook' || cook.length > 0),
  );
  const kind = pick(rng, kinds.length ? kinds : (['cafe'] as const));

  let goal: RequestGoal;
  if (kind === 'cook') {
    const c = pick(rng, cook);
    goal = { kind, recipe: c.recipe, topping: pick(rng, c.toppings) };
  } else if (kind === 'cafe') goal = { kind, base: pick(rng, pools.cafeBases), count: CAFE_COUNT };
  else if (kind === 'wear') goal = { kind, item: pick(rng, pools.wear) };
  else if (kind === 'place') goal = { kind, item: pick(rng, pools.place) };
  else goal = { kind, action: pick(rng, PET_ACTIONS) };
  return { no, friend, goal, have: 0 };
}

/** Tops the board up to BOARD_SIZE notes. */
export function fillBoard(
  req: { made: number; done: number; board: RequestNote[] },
  seed: number,
  pools: RequestPools,
  ctx: RequestContext,
): { made: number; done: number; board: RequestNote[] } {
  const board = [...req.board];
  let made = req.made;
  while (board.length < BOARD_SIZE) board.push(makeNote(made++, seed, board, pools, ctx));
  return { ...req, made, board };
}

export function need(g: RequestGoal): number {
  return g.kind === 'cafe' ? g.count : 1;
}

/** Counts a finished activity towards every note it matches. */
export function applyEvent(board: readonly RequestNote[], e: GameEvent): RequestNote[] {
  return board.map((n) => {
    const g = n.goal;
    const hit =
      (e.kind === 'cook' && g.kind === 'cook' && g.recipe === e.recipe && e.toppings.includes(g.topping)) ||
      (e.kind === 'cafe' && g.kind === 'cafe' && g.base === e.base) ||
      (e.kind === 'pet' && g.kind === 'pet' && g.action === e.action);
    return hit && n.have < need(g) ? { ...n, have: n.have + 1 } : n;
  });
}

export function isReady(n: RequestNote, live: LiveState): boolean {
  const g = n.goal;
  if (g.kind === 'wear') return live.wearing.includes(g.item);
  if (g.kind === 'place') return live.placed.includes(g.item);
  return n.have >= need(g);
}

/** Hearts after one more finished note, and whether that crossed the gift or visit line. */
export function addHeart(hearts: number): { hearts: number; gift: boolean; visit: boolean } {
  const next = Math.min(MAX_HEARTS, hearts + 1);
  return { hearts: next, gift: hearts < GIFT_AT && next >= GIFT_AT, visit: hearts < VISIT_AT && next >= VISIT_AT };
}
