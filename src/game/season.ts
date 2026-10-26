// Seasons (game-systems §10.3): a purely decorative touch from the device's calendar month.
// It never gives or hides anything, so nothing can be missed.
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/** Month is 0–11, as Date.getMonth(). Northern-hemisphere seasons. */
export function seasonFor(month: number): Season {
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}
