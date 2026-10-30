import { makeRng } from './rng';

// Post Box (game-systems §8.4): one letter waits each calendar week. A missed week is not lost
// or stacked; the letter simply waits until the player opens the box.
const DAY = 86_400_000;

/** Monday-based week number in the player's local time. 1970-01-01 was a Thursday, hence +3. */
export function weekIndex(now: number, tzOffsetMinutes: number): number {
  const days = Math.floor((now - tzOffsetMinutes * 60_000) / DAY);
  return Math.floor((days + 3) / 7);
}

export function letterWaiting(mail: { lastWeek: number }, week: number): boolean {
  return week > mail.lastWeek;
}

export interface LetterDef {
  from: string;
  text: string;
  /** Gifts tried in order; the first one the player doesn't own yet is sent. */
  gifts: readonly string[];
  /** Sent instead when every gift is already owned. */
  coins: number;
}

/** Letters come in a fixed order, then repeat. */
export function nextLetter(opened: number, letters: readonly LetterDef[]): LetterDef {
  return letters[opened % letters.length];
}

export function letterGift(letter: LetterDef, owned: Readonly<Record<string, unknown>>): { item: string } | { coins: number } {
  const item = letter.gifts.find((g) => !owned[g]);
  return item ? { item } : { coins: letter.coins };
}

// ---- The weekly prize wheel (game-systems §32) --------------------------------------------------------------
// Each week's letter comes with a wheel of 6 boutique clothes. The spin is for fun: the winning wedge is
// fixed by the week (seeded), the prize is always given when the letter is opened, and nothing is bought,
// risked or taken away.

export const WHEEL_WEDGES = 6;
/** Coins instead, when the winning clothes are already in the closet. */
export const WHEEL_COINS = 40;

export interface Wheel {
  /** Six wearable ids, in wedge order. */
  wedges: string[];
  /** Index of the winning wedge. */
  win: number;
}

/** The wheel for a week: unowned boutique clothes first, so the wedges are things worth winning. */
export function weeklyWheel(week: number, opened: number, boutique: readonly string[], owned: Readonly<Record<string, unknown>>): Wheel {
  const rng = makeRng(week * 6151 + opened * 17 + 5);
  const order = [...boutique];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const fresh = order.filter((id) => !owned[id]);
  const rest = order.filter((id) => owned[id]);
  const wedges = [...fresh, ...rest].slice(0, WHEEL_WEDGES);
  return { wedges, win: Math.floor(rng() * wedges.length) };
}

export interface MailLog {
  week: number;
  /** Regular id of the sender. */
  from: string;
  text: string;
  /** The clothes won (an item id), or null when it was coins instead. */
  prize: string | null;
  coins: number;
}

export const MAX_LOG = 60;
