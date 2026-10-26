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
