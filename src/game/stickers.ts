// Sticker album (game-systems §8.5): every sticker is earned by something the player did.
// Conditions only look at counters that never go down, so a sticker can never be lost.
import { PUZZLES } from './puzzle';
import { changedParts } from './bedroom';
import { CONSTELLATIONS, CREATURE_IDS } from './explore';
import { careCount, tricksKnown } from './pets';
import type { SaveGame } from './save';

export type StickerCond =
  | { kind: 'journey' }
  | { kind: 'shifts'; n: number }
  | { kind: 'rank'; n: number }
  | { kind: 'cooked'; recipe: string }
  | { kind: 'stars'; recipe: string }
  | { kind: 'owned'; n: number }
  | { kind: 'placed'; n: number }
  | { kind: 'pet' }
  | { kind: 'care'; n: number }
  | { kind: 'tricks'; n: number }
  | { kind: 'notes'; n: number }
  | { kind: 'hearts'; n: number }
  | { kind: 'friends'; n: number }
  | { kind: 'mail'; n: number }
  | { kind: 'coins'; n: number }
  | { kind: 'shows'; n: number }
  | { kind: 'showStars'; n: number }
  | { kind: 'shells'; n: number }
  | { kind: 'salonShifts'; n: number }
  | { kind: 'blooms'; n: number }
  | { kind: 'photos'; n: number }
  | { kind: 'burgerShifts'; n: number }
  | { kind: 'sweetShifts'; n: number }
  | { kind: 'danceShifts'; n: number }
  | { kind: 'bedroom'; n: number }
  | { kind: 'skateRuns'; n: number }
  | { kind: 'skatePerfect' }
  | { kind: 'skateSky' }
  | { kind: 'tideVisits'; n: number }
  | { kind: 'tideAll' }
  | { kind: 'skyGames'; n: number }
  | { kind: 'skyAll' }
  | { kind: 'skateTricks'; n: number }
  | { kind: 'nailShifts'; n: number }
  | { kind: 'pairsGames'; n: number }
  | { kind: 'pictures'; n: number }
  | { kind: 'puzzles'; n: number }
  | { kind: 'puzzleMaster' }
  | { kind: 'fishCaught'; n: number }
  | { kind: 'pairsHard' }
  | { kind: 'songs'; n: number }
  | { kind: 'posyShifts'; n: number }
  | { kind: 'designs'; n: number }
  | { kind: 'souvenirs'; n: number };

export interface StickerFacts {
  journeySteps: number;
  /** Starter item ids, which don't count as "owned" for collection stickers. */
  starters: ReadonlySet<string>;
}

export function meets(save: SaveGame, c: StickerCond, facts: StickerFacts): boolean {
  const p = save.progress;
  switch (c.kind) {
    case 'journey':
      return p.journey.length >= facts.journeySteps;
    case 'shifts':
      return p.cafe.shifts >= c.n;
    case 'rank':
      return p.cafe.rank >= c.n;
    case 'cooked':
      return (p.recipes[c.recipe]?.cooked ?? 0) > 0;
    case 'stars':
      return (p.recipes[c.recipe]?.stars ?? 0) >= 3;
    case 'owned':
      return Object.keys(save.inventory.owned).filter((id) => !facts.starters.has(id)).length >= c.n;
    case 'placed':
      return Object.values(save.home.slots).filter((id) => !facts.starters.has(id)).length >= c.n;
    case 'pet':
      return p.pet !== null;
    case 'care':
      return p.pet !== null && careCount(p.pet) >= c.n;
    case 'tricks':
      return p.pet !== null && tricksKnown(p.pet) >= c.n;
    case 'notes':
      return p.requests.done >= c.n;
    case 'hearts':
      return Object.values(p.friends).some((h) => h >= c.n);
    case 'friends':
      return Object.values(p.friends).filter((h) => h > 0).length >= c.n;
    case 'mail':
      return p.mail.opened >= c.n;
    case 'coins':
      return save.wallet.lifetimeEarned >= c.n;
    case 'shows':
      return p.shows.done >= c.n;
    case 'showStars':
      return Object.values(p.shows.best).filter((b) => b >= 3).length >= c.n;
    case 'shells':
      return p.shells.length >= c.n;
    case 'salonShifts':
      return p.salon.shifts >= c.n;
    case 'blooms':
      return p.garden.bloomed.length >= c.n;
    case 'bedroom':
      return changedParts(save.home.bedroom) >= c.n;
    case 'danceShifts':
      return p.dance.shifts >= c.n;
    case 'skateRuns':
      return p.skate.runs >= c.n;
    case 'pictures':
      return p.studio.made.length >= c.n;
    case 'puzzles':
      return p.puzzle.games >= c.n;
    case 'puzzleMaster':
      return PUZZLES.every((x) => p.puzzle.done.includes(`${x}-2`));
    case 'fishCaught':
      return p.fishing.fish.length >= c.n;
    case 'pairsGames':
      return p.park.games >= c.n;
    case 'pairsHard':
      return p.park.hard;
    case 'songs':
      return p.park.songs.length >= c.n;
    case 'nailShifts':
      return p.nails.shifts >= c.n;
    case 'posyShifts':
      return p.posies.shifts >= c.n;
    case 'skatePerfect':
      return p.skate.best >= 8;
    case 'tideVisits':
      return p.tide.visits >= c.n;
    case 'tideAll':
      return CREATURE_IDS.every((x) => p.tide.found.includes(x));
    case 'skyGames':
      return p.sky.games >= c.n;
    case 'skyAll':
      return CONSTELLATIONS.every((k) => p.sky.done.includes(k.id));
    case 'skateSky':
      return p.skate.stars >= 6;
    case 'skateTricks':
      return p.skate.tricks >= c.n;
    case 'sweetShifts':
      return p.sweets.shifts >= c.n;
    case 'designs':
      return p.sweets.made.length >= c.n;
    case 'burgerShifts':
      return p.burger.shifts >= c.n;
    case 'photos':
      return p.travel.photos.length >= c.n;
    case 'souvenirs':
      return p.travel.souvenirs.length >= c.n;
  }
}

/** Sticker ids newly earned since the save's list was last updated, in album order. */
export function newStickers(save: SaveGame, defs: readonly { id: string; cond: StickerCond }[], facts: StickerFacts): string[] {
  const have = new Set(save.progress.stickers);
  return defs.filter((d) => !have.has(d.id) && meets(save, d.cond, facts)).map((d) => d.id);
}
