// Starlight Stage fashion show (game-systems §9.1): dress for a theme, walk the runway, and three
// judges cheer. Scoring only counts worn pieces that fit the theme, so the same look always gets the
// same stars, and every show earns at least one star.
export interface ShowThemeRule {
  id: string;
  tags: readonly string[];
}

export interface WornPiece {
  id: string;
  tags: readonly string[];
}

export const SHOW_PAY = { 1: 10, 2: 20, 3: 30 } as const;
/** Paid once per theme, the first time it gets three stars. */
export const FIRST_STARS_BONUS = 20;
export const JUDGES = 3;

export function fits(piece: WornPiece, theme: ShowThemeRule): boolean {
  return piece.tags.some((t) => theme.tags.includes(t));
}

/** Worn pieces that fit the theme, in the order given. */
export function fitting<T extends WornPiece>(worn: readonly T[], theme: ShowThemeRule): T[] {
  return worn.filter((p) => fits(p, theme));
}

/** 1 star for walking, 2 for two fitting pieces, 3 for four or more. */
export function showStars(fittingCount: number): 1 | 2 | 3 {
  return fittingCount >= 4 ? 3 : fittingCount >= 2 ? 2 : 1;
}

/** Themes come in a fixed order; "another theme" just moves along the list. */
export function themeFor<T>(done: number, skip: number, themes: readonly T[]): T {
  return themes[(done + skip) % themes.length];
}

/** Three different judges, rotating with each show. */
export function judgesFor(done: number, friends: readonly string[]): string[] {
  const n = friends.length;
  return Array.from({ length: Math.min(JUDGES, n) }, (_, i) => friends[(done + i * 3) % n]);
}

export function showReward(prevBest: number, stars: 1 | 2 | 3): { coins: number; best: number; firstStars: boolean } {
  const firstStars = stars === 3 && prevBest < 3;
  return { coins: SHOW_PAY[stars] + (firstStars ? FIRST_STARS_BONUS : 0), best: Math.max(prevBest, stars), firstStars };
}
