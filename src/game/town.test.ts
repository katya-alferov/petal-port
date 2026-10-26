// Wave A rules (game-systems §8): pets, Petal Notes, friendships, Post Box, stickers.
import { describe, expect, it } from 'vitest';
import { PET_FOODS, PET_KINDS } from '../content/pets';
import { SAVE_CONTEXT } from '../content/saveContext';
import { LETTERS, REQUEST_POOLS, STICKERS } from '../content/town';
import { letterGift, letterWaiting, nextLetter, weekIndex } from './mail';
import { adopt, ballSpot, bowls, care, careToNextTrick, tricksKnown, wantedFood } from './pets';
import { addHeart, applyEvent, BOARD_SIZE, fillBoard, GIFT_AT, isReady, makeNote, VISIT_AT } from './requests';
import { load, newSave, sanitize, type SaveGame } from './save';
import { newStickers } from './stickers';

const fresh = () => newSave(SAVE_CONTEXT, 1_700_000_000_000);
const ctx = { hasPet: true, unlockedRecipes: ['recipe.pancakes'] };

describe('pets (§8.1)', () => {
  it('adopting gives a pet with nothing to lose: care only adds', () => {
    let p = adopt('pet.kitten', 'petcolor.ginger', '  Mochi  ');
    expect(p.name).toBe('Mochi');
    expect(tricksKnown(p)).toBe(1);
    expect(careToNextTrick(p)).toBe(3);
    const learned: (number | null)[] = [];
    for (let i = 0; i < 25; i++) {
      const r = care(p, (['feed', 'wash', 'play'] as const)[i % 3]);
      learned.push(r.newTrick);
      p = r.pet;
    }
    expect(learned.filter((t) => t !== null)).toEqual([1, 2, 3, 4]);
    expect(tricksKnown(p)).toBe(5);
    expect(careToNextTrick(p)).toBeNull();
  });
  it('an empty name falls back to a friendly default', () => {
    expect(adopt('pet.puppy', 'petcolor.cream', '   ').name).toBe('Buddy');
  });
  it('feeding asks for favourites in a fixed rotation, and the bowls always include the wanted food', () => {
    const kind = PET_KINDS[2];
    let p = adopt(kind.id, 'petcolor.grey', 'Bean');
    const wanted: string[] = [];
    for (let i = 0; i < 6; i++) {
      const want = wantedFood(p, kind.favourites);
      wanted.push(want);
      const b = bowls(
        p,
        kind.favourites,
        PET_FOODS.map((f) => f.id),
      );
      expect(new Set(b).size).toBe(3);
      expect(b).toContain(want);
      p = care(p, 'feed').pet;
    }
    expect(wanted).toEqual([...kind.favourites, ...kind.favourites]);
  });
  it('the ball lands inside the play area', () => {
    const p = adopt('pet.puppy', 'petcolor.cream', 'Pip');
    for (let n = 0; n < 3; n++) {
      const s = ballSpot(p, n);
      expect(s.x).toBeGreaterThan(0.1);
      expect(s.x).toBeLessThan(0.9);
    }
  });
});

describe('Petal Notes (§8.2)', () => {
  it('fills a board of three different friends and kinds, deterministically', () => {
    const a = fillBoard({ made: 0, done: 0, board: [] }, 42, REQUEST_POOLS, ctx);
    const b = fillBoard({ made: 0, done: 0, board: [] }, 42, REQUEST_POOLS, ctx);
    expect(a).toEqual(b);
    expect(a.board).toHaveLength(BOARD_SIZE);
    expect(a.made).toBe(BOARD_SIZE);
    expect(new Set(a.board.map((n) => n.friend)).size).toBe(BOARD_SIZE);
    expect(new Set(a.board.map((n) => n.goal.kind)).size).toBe(BOARD_SIZE);
  });
  it('never asks for pet care without a pet or for a locked recipe', () => {
    for (let no = 0; no < 200; no++) {
      const n = makeNote(no, 7, [], REQUEST_POOLS, { hasPet: false, unlockedRecipes: ['recipe.pancakes'] });
      expect(n.goal.kind).not.toBe('pet');
      if (n.goal.kind === 'cook') expect(n.goal.recipe).toBe('recipe.pancakes');
    }
  });
  it('counts matching activities and checks live goals', () => {
    const board = [
      { no: 0, friend: 'regular.mila', goal: { kind: 'cafe' as const, base: 'base.cocoa', count: 2 }, have: 0 },
      { no: 1, friend: 'regular.theo', goal: { kind: 'cook' as const, recipe: 'recipe.pancakes', topping: 'deco.berries' }, have: 0 },
      { no: 2, friend: 'regular.leo', goal: { kind: 'wear' as const, item: 'headwear.beret' }, have: 0 },
    ];
    let b = applyEvent(board, { kind: 'cafe', base: 'base.lemonade' });
    expect(b[0].have).toBe(0);
    b = applyEvent(applyEvent(applyEvent(b, { kind: 'cafe', base: 'base.cocoa' }), { kind: 'cafe', base: 'base.cocoa' }), {
      kind: 'cafe',
      base: 'base.cocoa',
    });
    expect(b[0].have).toBe(2);
    b = applyEvent(b, { kind: 'cook', recipe: 'recipe.pancakes', toppings: ['deco.banana'] });
    expect(b[1].have).toBe(0);
    b = applyEvent(b, { kind: 'cook', recipe: 'recipe.pancakes', toppings: ['deco.banana', 'deco.berries'] });
    const live = { wearing: [], placed: [] };
    expect(b.map((n) => isReady(n, live))).toEqual([true, true, false]);
    expect(isReady(b[2], { wearing: ['headwear.beret'], placed: [] })).toBe(true);
  });
  it('hearts give a gift at 3 and visits at 5, and stop at the max', () => {
    let h = 0;
    const gifts: number[] = [];
    const visits: number[] = [];
    for (let i = 0; i < 15; i++) {
      const r = addHeart(h);
      if (r.gift) gifts.push(r.hearts);
      if (r.visit) visits.push(r.hearts);
      h = r.hearts;
    }
    expect(gifts).toEqual([GIFT_AT]);
    expect(visits).toEqual([VISIT_AT]);
    expect(h).toBe(10);
  });
});

describe('Post Box (§8.4)', () => {
  it('weeks start on Monday in local time', () => {
    const sun = Date.UTC(2026, 9, 25, 12); // Sunday 25 Oct 2026
    const mon = Date.UTC(2026, 9, 26, 12);
    expect(weekIndex(mon, 0)).toBe(weekIndex(sun, 0) + 1);
    // 23:30 Sunday UTC is already Monday in Israel (UTC+2, offset -120).
    expect(weekIndex(Date.UTC(2026, 9, 25, 23, 30), -120)).toBe(weekIndex(mon, 0));
  });
  it('one letter waits per week; missing weeks neither stacks nor loses it', () => {
    expect(letterWaiting({ lastWeek: -1 }, 3000)).toBe(true);
    expect(letterWaiting({ lastWeek: 3000 }, 3000)).toBe(false);
    expect(letterWaiting({ lastWeek: 3000 }, 3009)).toBe(true);
  });
  it('letters come in order and send coins once every gift is owned', () => {
    expect(nextLetter(0, LETTERS)).toBe(LETTERS[0]);
    expect(nextLetter(LETTERS.length, LETTERS)).toBe(LETTERS[0]);
    const l = LETTERS[0];
    expect(letterGift(l, {})).toEqual({ item: l.gifts[0] });
    expect(letterGift(l, Object.fromEntries(l.gifts.map((g) => [g, 1])))).toEqual({ coins: l.coins });
  });
});

describe('stickers (§8.5)', () => {
  const facts = {
    journeySteps: 5,
    starters: new Set([...Object.values(SAVE_CONTEXT.starterOutfit).map((e) => e!.itemId), ...Object.values(SAVE_CONTEXT.starterHome)]),
  };
  it('a fresh save has no stickers; doing things earns them once', () => {
    const s = fresh();
    expect(newStickers(s, STICKERS, facts)).toEqual([]);
    const played: SaveGame = {
      ...s,
      progress: { ...s.progress, cafe: { ...s.progress.cafe, shifts: 1 }, pet: adopt('pet.bunny', 'petcolor.cream', 'Pom') },
    };
    expect(newStickers(played, STICKERS, facts)).toEqual(['sticker.first-shift', 'sticker.pet']);
    const recorded = { ...played, progress: { ...played.progress, stickers: ['sticker.first-shift', 'sticker.pet'] } };
    expect(newStickers(recorded, STICKERS, facts)).toEqual([]);
  });
});

describe('save: Wave A fields', () => {
  it('an old save without Wave A fields loads with safe defaults', () => {
    const s = fresh() as unknown as Record<string, unknown>;
    const old = structuredClone(s) as { progress: Record<string, unknown> };
    for (const k of ['pet', 'friends', 'requests', 'mail', 'stickers', 'visitor']) delete old.progress[k];
    const r = load(JSON.stringify(old), SAVE_CONTEXT);
    expect(r.kind).toBe('ok');
    if (r.kind === 'ok') {
      expect(r.save.progress.pet).toBeNull();
      expect(r.save.progress.requests).toEqual({ made: 0, done: 0, board: [] });
      expect(r.save.progress.mail).toEqual({ lastWeek: -1, opened: 0 });
    }
  });
  it('sanitize drops broken notes and clamps hearts', () => {
    const s = fresh();
    const raw = s.progress as unknown as Record<string, unknown>;
    raw.friends = { 'regular.mila': 99, bad: 'x' };
    raw.requests = { made: 5, done: 2, board: [{ no: 1, friend: 'regular.mila', goal: { kind: 'nope' }, have: 0 }] };
    const out = sanitize(s, SAVE_CONTEXT);
    expect(out.progress.friends).toEqual({ 'regular.mila': 10 });
    expect(out.progress.requests.board).toEqual([]);
  });
});
