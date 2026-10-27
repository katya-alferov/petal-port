// Wave A rules (game-systems §8): pets, Petal Notes, friendships, Post Box, stickers.
import { describe, expect, it } from 'vitest';
import { PET_FOODS, PET_KINDS } from '../content/pets';
import { SAVE_CONTEXT } from '../content/saveContext';
import { LETTERS, REQUEST_POOLS, STICKERS } from '../content/town';
import { letterGift, letterWaiting, nextLetter, weekIndex } from './mail';
import { adopt, ballSpot, bowls, care, careToNextTrick, tricksKnown, wantedFood } from './pets';
import { addHeart, applyEvent, BOARD_SIZE, fillBoard, GIFT_AT, isReady, makeNote, VISIT_AT } from './requests';
import { GARDEN_BEDS, load, newSave, sanitize, type SaveGame } from './save';
import { newStickers } from './stickers';
import { FIRST_STARS_BONUS, fits, fitting, judgesFor, SHOW_PAY, showReward, showStars, themeFor } from './show';
import { SHELLS, SHOW_THEMES } from '../content/show';
import { WEARABLES, wearable } from '../content/wearables';
import { HAIR_COLORS } from '../content/appearance';
import { SALON_MENU, SEEDS } from '../content/wavec';
import { BLOOM_AT, grow, pickBloom, plant, stage } from './garden';
import { seasonFor } from './season';
import { dancePay, danceOrders, MOVES, ROUTINES_PER_SHIFT, stepMove } from './dance';
import { cleared, course, OBSTACLES, reachTime, runEnd, SKATE_PAY, SLACK, skatePay, SPEED } from './skate';
import { nextGoals } from './goals';
import { addDesign, checkCupcake, designKey, MAX_DESIGNS, sweetOrders, sweetPay } from './sweets';
import { SWEET_MENU } from '../content/sweets';
import { BURGER_PAY, BURGER_TIP, burgerOrders, burgerPay, CUSTOMERS_PER_SHIFT, tapPart } from './burger';
import { MAX_PHOTOS, PARIS_TICKET, addPhoto, buySouvenir, buyTicket, newTravel, removePhoto, type PhotoRecipe } from './travel';
import { WINDOW_VIEWS, windowView } from '../content/views';
import { viewUnlocked } from './views';
import { CLIENTS_PER_SHIFT, SALON_PAY, SALON_TIP, checkLook, clientPay, salonOrders } from './salon';

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
    for (const k of ['pet', 'friends', 'requests', 'mail', 'stickers', 'visitor', 'shows', 'shells', 'salon', 'garden'])
      delete old.progress[k];
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

describe('Starlight Stage (§9.1)', () => {
  const theme = { id: 'show.sunny-picnic', tags: ['sunny', 'park'] };
  it('counts only pieces that fit the theme, and every walk earns a star', () => {
    const worn = [
      { id: 'a', tags: ['sunny'] },
      { id: 'b', tags: ['cozy'] },
      { id: 'c', tags: ['park', 'casual'] },
    ];
    expect(fitting(worn, theme).map((w) => w.id)).toEqual(['a', 'c']);
    expect([0, 1, 2, 3, 4, 8].map(showStars)).toEqual([1, 1, 2, 2, 3, 3]);
  });
  it('pays by stars, with a one-time bonus for the first three stars on a theme', () => {
    expect(showReward(0, 1)).toEqual({ coins: SHOW_PAY[1], best: 1, firstStars: false });
    expect(showReward(2, 3)).toEqual({ coins: SHOW_PAY[3] + FIRST_STARS_BONUS, best: 3, firstStars: true });
    expect(showReward(3, 3)).toEqual({ coins: SHOW_PAY[3], best: 3, firstStars: false });
    expect(showReward(3, 1).best).toBe(3);
  });
  it('themes rotate in order and judges are three different friends', () => {
    expect(themeFor(0, 0, SHOW_THEMES)).toBe(SHOW_THEMES[0]);
    expect(themeFor(4, 3, SHOW_THEMES)).toBe(SHOW_THEMES[1]);
    for (let d = 0; d < 20; d++) expect(new Set(judgesFor(d, REQUEST_POOLS.friends)).size).toBe(3);
  });
  it('every theme can reach three stars with shop and starter clothes', () => {
    const buyable = WEARABLES.filter((w) => w.source.kind === 'shop' || w.source.kind === 'starter');
    for (const t of SHOW_THEMES) {
      const slots = new Set(buyable.filter((w) => fits(w, t)).map((w) => w.slot));
      // A dress takes the place of top + bottom, so count it as one piece.
      const pieces = [...slots].filter((s) => s !== 'dress').length || 1;
      expect(pieces, t.id).toBeGreaterThanOrEqual(4);
    }
  });
});

describe('secret shells (§9.2)', () => {
  it('ids are unique and the album stickers match the content', () => {
    expect(new Set(SHELLS.map((s) => s.id)).size).toBe(SHELLS.length);
    const all = STICKERS.find((s) => s.id === 'sticker.all-shells')!;
    expect(all.cond).toEqual({ kind: 'shells', n: SHELLS.length });
    const icon = STICKERS.find((s) => s.id === 'sticker.style-icon')!;
    expect(icon.cond).toEqual({ kind: 'showStars', n: SHOW_THEMES.length });
  });
  it('old saves get empty Wave B progress, and sanitize keeps it safe', () => {
    const s = fresh();
    const raw = s.progress as unknown as Record<string, unknown>;
    delete raw.shows;
    raw.shells = ['shell.pond', 'shell.pond', 7];
    const out = sanitize(s, SAVE_CONTEXT);
    expect(out.progress.shows).toEqual({ done: 0, best: {} });
    expect(out.progress.shells).toEqual(['shell.pond']);
  });
});

describe('Glam Salon (§10.1)', () => {
  it('a shift has three different wishes, the same every time for the same shift', () => {
    const a = salonOrders(4, SALON_MENU);
    expect(a).toEqual(salonOrders(4, SALON_MENU));
    expect(a).toHaveLength(CLIENTS_PER_SHIFT);
    expect(new Set(a.map((l) => `${l.style}|${l.color}|${l.accessory}`)).size).toBe(CLIENTS_PER_SHIFT);
    expect(salonOrders(5, SALON_MENU)).not.toEqual(a);
  });
  it('checks which parts still differ, and pays a tip only for a right first look', () => {
    const want = { style: 'hairstyle.bob', color: 'hair.lilac', accessory: 'headwear.tiara' };
    expect(checkLook(want, want)).toEqual({ correct: true, wrong: [] });
    expect(checkLook(want, { style: 'hairstyle.bob' })).toEqual({ correct: false, wrong: ['color', 'accessory'] });
    expect(clientPay(true)).toBe(SALON_PAY + SALON_TIP);
    expect(clientPay(false)).toBe(SALON_PAY);
  });
  it('every menu item exists in the catalogs', () => {
    for (const id of SALON_MENU.colors)
      expect(
        HAIR_COLORS.some((c) => c.id === id),
        id,
      ).toBe(true);
    for (const id of SALON_MENU.accessories) expect(wearable(id)?.slot, id).toBe('headwear');
  });
});

describe('Petal Garden (§10.2)', () => {
  const empty = () => newSave(SAVE_CONTEXT, 1).progress.garden;
  it('plants once per bed, and growth stops at bloom', () => {
    let g = plant(empty(), 0, 'seed.tulip');
    expect(plant(g, 0, 'seed.rose')).toBe(g);
    expect(g.beds[0]).toEqual({ seed: 'seed.tulip', growth: 0 });
    for (let i = 0; i < 9; i++) g = grow(g);
    expect(g.beds[0]!.growth).toBe(BLOOM_AT);
    expect(stage(g.beds[0]!.growth)).toBe('bloom');
    expect(grow(g)).toBe(g);
  });
  it('stages follow growth and the empty garden never changes', () => {
    expect([0, 1, 2, 3, 4, 5].map(stage)).toEqual(['seed', 'sprout', 'sprout', 'bud', 'bud', 'bloom']);
    const e = empty();
    expect(grow(e)).toBe(e);
  });
  it('only a bloom can be picked; picking empties the bed and collects the kind once', () => {
    let g = plant(empty(), 1, 'seed.rose');
    expect(pickBloom(g, 1)).toBeNull();
    for (let i = 0; i < BLOOM_AT; i++) g = grow(g);
    const r = pickBloom(g, 1)!;
    expect(r.first).toBe(true);
    expect(r.garden.beds[1]).toBeNull();
    expect(r.garden.bloomed).toEqual(['seed.rose']);
    let again = plant(r.garden, 2, 'seed.rose');
    for (let i = 0; i < BLOOM_AT; i++) again = grow(again);
    const second = pickBloom(again, 2)!;
    expect(second.first).toBe(false);
    expect(second.garden.bloomed).toEqual(['seed.rose']);
    expect(second.garden.picked).toBe(2);
  });
  it('old saves get an empty garden and salon, and broken garden data is cleaned', () => {
    const s = fresh();
    const raw = s.progress as unknown as Record<string, unknown>;
    delete raw.salon;
    raw.garden = { beds: [{ seed: 'seed.tulip', growth: 999 }, 'x'], bloomed: ['seed.rose', 'seed.rose', 3], picked: -4 };
    const out = sanitize(s, SAVE_CONTEXT);
    expect(out.progress.salon).toEqual({ clients: 0, shifts: 0 });
    expect(out.progress.garden.beds).toHaveLength(GARDEN_BEDS);
    expect(out.progress.garden.beds[0]).toEqual({ seed: 'seed.tulip', growth: 99 });
    expect(out.progress.garden.beds[1]).toBeNull();
    expect(out.progress.garden.bloomed).toEqual(['seed.rose']);
    expect(out.progress.garden.picked).toBe(0);
  });
  it('Wave C stickers match the content', () => {
    const star = STICKERS.find((s) => s.id === 'sticker.garden')!;
    expect(star.cond).toEqual({ kind: 'blooms', n: SEEDS.length });
  });
});

describe('seasons (§10.3)', () => {
  it('maps each calendar month to one season', () => {
    expect(Array.from({ length: 12 }, (_, m) => seasonFor(m))).toEqual([
      'winter',
      'winter',
      'spring',
      'spring',
      'spring',
      'summer',
      'summer',
      'summer',
      'autumn',
      'autumn',
      'autumn',
      'winter',
    ]);
  });
});

describe('window views (§10.5)', () => {
  const p = () => newSave(SAVE_CONTEXT, 1).progress;
  it('only the harbour is open on a new save and unknown ids fall back to it', () => {
    expect(WINDOW_VIEWS.filter((v) => viewUnlocked(v, p())).map((v) => v.id)).toEqual(['harbour']);
    expect(windowView(undefined).id).toBe('harbour');
    expect(windowView('nope').id).toBe('harbour');
  });
  it('opens views from blooms, shows and shells', () => {
    const q = p();
    q.garden.bloomed = ['seed.rose'];
    q.shows.done = 1;
    q.shells = ['shell.beach', 'shell.pond', 'shell.windmill', 'shell.home', 'shell.cafe'];
    expect(WINDOW_VIEWS.every((v) => viewUnlocked(v, q))).toBe(true);
  });
  it('an older save without a view still loads', () => {
    const s = newSave(SAVE_CONTEXT, 1);
    expect(s.home.view).toBeUndefined();
    expect(sanitize(JSON.parse(JSON.stringify(s)), SAVE_CONTEXT).home.homeId).toBe('harbour-loft');
  });
});

describe('Paris trip (§11)', () => {
  const photo: PhotoRecipe = { place: 'paris', pose: 'wave', prop: 'none', stickers: [null, 'heart', null, null, null, null], at: 1 };
  const rich = () => {
    const s = newSave(SAVE_CONTEXT, 1);
    s.wallet.coins = 500;
    return s;
  };
  it('the ticket costs 400, once', () => {
    const poor = newSave(SAVE_CONTEXT, 1);
    poor.wallet.coins = 399;
    expect(buyTicket(poor)).toBeNull();
    const s = buyTicket(rich())!;
    expect(s.wallet.coins).toBe(500 - PARIS_TICKET);
    expect(s.progress.travel.ticket).toBe(true);
    expect(buyTicket(s)).toBeNull();
  });
  it('souvenirs cost their price, once, and free ones cannot be bought', () => {
    const s = rich();
    const a = buySouvenir(s, 'souvenir.tower', 40)!;
    expect(a.wallet.coins).toBe(460);
    expect(buySouvenir(a, 'souvenir.tower', 40)).toBeNull();
    expect(buySouvenir(s, 'souvenir.postcard', 0)).toBeNull();
    const poor = newSave(SAVE_CONTEXT, 1);
    poor.wallet.coins = 10;
    expect(buySouvenir(poor, 'souvenir.tower', 40)).toBeNull();
  });
  it('the first photo brings the postcard; the album holds 60', () => {
    const r = addPhoto(rich(), photo)!;
    expect(r.first).toBe(true);
    expect(r.save.progress.travel.souvenirs).toEqual(['souvenir.postcard']);
    const r2 = addPhoto(r.save, photo)!;
    expect(r2.first).toBe(false);
    expect(r2.save.progress.travel.souvenirs).toEqual(['souvenir.postcard']);
    const full = rich();
    full.progress.travel.photos = Array.from({ length: MAX_PHOTOS }, () => photo);
    expect(addPhoto(full, photo)).toBeNull();
    expect(removePhoto(r2.save, 0).progress.travel.photos).toHaveLength(1);
  });
  it('old saves get an empty trip and bad photo data is dropped', () => {
    const raw = JSON.parse(JSON.stringify(newSave(SAVE_CONTEXT, 1)));
    delete raw.progress.travel;
    expect(sanitize(raw, SAVE_CONTEXT).progress.travel).toEqual(newTravel());
    raw.progress.travel = { ticket: true, trips: 2, souvenirs: ['souvenir.tower'], photos: [photo, { pose: 'moonwalk' }, 'x'] };
    const out = sanitize(raw, SAVE_CONTEXT).progress.travel;
    expect(out.photos).toEqual([photo]);
    expect(out.ticket).toBe(true);
    expect(out.trips).toBe(2);
  });
  it('travel stickers match the content', () => {
    expect(STICKERS.find((s) => s.id === 'sticker.paris')!.cond).toEqual({ kind: 'photos', n: 1 });
  });
});

describe('Bun & Bite (§12)', () => {
  it('a shift has 4 burgers with 1 to 4 different toppings, bun at both ends, same for the same shift', () => {
    const o = burgerOrders(3);
    expect(o).toHaveLength(CUSTOMERS_PER_SHIFT);
    o.forEach((b, i) => {
      expect(b[0]).toBe('bun-bottom');
      expect(b[1]).toBe('patty');
      expect(b[b.length - 1]).toBe('bun-top');
      const tops = b.slice(2, -1);
      expect(tops).toHaveLength(i + 1);
      expect(new Set(tops).size).toBe(tops.length);
    });
    expect(burgerOrders(3)).toEqual(o);
    expect(burgerOrders(4)).not.toEqual(o);
  });
  it('taps must follow the order; a wrong tap names the next layer', () => {
    const order = burgerOrders(1)[0];
    expect(tapPart(order, 0, 'bun-top')).toEqual({ ok: false, next: 'bun-bottom' });
    expect(tapPart(order, 0, 'bun-bottom')).toEqual({ ok: true, done: false });
    expect(tapPart(order, order.length - 1, 'bun-top')).toEqual({ ok: true, done: true });
  });
  it('pays 14 and a 4 tip for a clean burger', () => {
    expect(burgerPay(false)).toBe(BURGER_PAY);
    expect(burgerPay(true)).toBe(BURGER_PAY + BURGER_TIP);
  });
  it('old saves get an empty burger record', () => {
    const raw = JSON.parse(JSON.stringify(newSave(SAVE_CONTEXT, 1)));
    delete raw.progress.burger;
    expect(sanitize(raw, SAVE_CONTEXT).progress.burger).toEqual({ orders: 0, shifts: 0 });
  });
});

describe('Sweet Spot (§13)', () => {
  it('a shift has 3 different orders, the same for the same shift', () => {
    const o = sweetOrders(2, SWEET_MENU);
    expect(o).toHaveLength(3);
    expect(new Set(o.map(designKey)).size).toBe(3);
    expect(sweetOrders(2, SWEET_MENU)).toEqual(o);
  });
  it('checks each part and pays 12 plus a 4 tip for a first-look match', () => {
    const want = { frosting: 'pink', swirl: 'swirl', topping: 'cherry' };
    expect(checkCupcake(want, want)).toEqual({ correct: true, wrong: [] });
    expect(checkCupcake(want, { ...want, topping: 'star' })).toEqual({ correct: false, wrong: ['topping'] });
    expect(sweetPay(false)).toBe(12);
    expect(sweetPay(true)).toBe(16);
  });
  it('the collection keeps each design once and stops at the cap', () => {
    const c = { frosting: 'pink', swirl: 'flat', topping: 'star' };
    const a = addDesign([], c);
    expect(a).toEqual(['pink|flat|star']);
    expect(addDesign(a, c)).toBe(a);
    const full = Array.from({ length: MAX_DESIGNS }, (_, i) => `x${i}`);
    expect(addDesign(full, c)).toBe(full);
  });
  it('old saves get an empty collection and bad data is cleaned', () => {
    const raw = JSON.parse(JSON.stringify(newSave(SAVE_CONTEXT, 1)));
    delete raw.progress.sweets;
    expect(sanitize(raw, SAVE_CONTEXT).progress.sweets).toEqual({ served: 0, shifts: 0, made: [] });
    raw.progress.sweets = { served: 3, shifts: 1, made: ['a|b|c', 'a|b|c', 7] };
    expect(sanitize(raw, SAVE_CONTEXT).progress.sweets).toEqual({ served: 3, shifts: 1, made: ['a|b|c'] });
  });
});

describe('Next up ideas (§14)', () => {
  it('suggests at most 3 things, starting with the ticket on a new save', () => {
    const g = nextGoals(newSave(SAVE_CONTEXT, 1));
    expect(g).toHaveLength(3);
    expect(g[0].id).toBe('ticket');
    expect(g[0].text).toContain('120 of 400');
  });
  it('a ready flower comes first, and finished things drop off the list', () => {
    const s = newSave(SAVE_CONTEXT, 1);
    s.progress.garden.beds[0] = { seed: 'seed.tulip', growth: 5 };
    s.progress.travel.ticket = true;
    s.progress.shows.done = 1;
    s.progress.salon.shifts = 1;
    const g = nextGoals(s, 10).map((x) => x.id);
    expect(g[0]).toBe('pick');
    expect(g).toContain('photo');
    expect(g).not.toContain('show');
    expect(g).not.toContain('salon');
    expect(g).not.toContain('plant');
  });
});

describe('Dance Studio (§15)', () => {
  it('a shift has 4 routines of 3, 4, 5 and 6 moves, never one move three times in a row, and is repeatable', () => {
    const o = danceOrders(2);
    expect(o.map((r) => r.length)).toEqual([3, 4, 5, 6]);
    for (const r of o) {
      r.forEach((m, i) => {
        expect(MOVES).toContain(m);
        if (i >= 2) expect(!(r[i - 1] === m && r[i - 2] === m)).toBe(true);
      });
    }
    expect(danceOrders(2)).toEqual(o);
    expect(danceOrders(3)).not.toEqual(o);
    expect(o).toHaveLength(ROUTINES_PER_SHIFT);
  });
  it('steps must follow the routine; a wrong one names the expected move', () => {
    const r = danceOrders(1)[0];
    expect(stepMove(r, 0, r[0])).toEqual({ ok: true, done: false });
    const wrong = MOVES.find((m) => m !== r[0])!;
    expect(stepMove(r, 0, wrong)).toEqual({ ok: false, expected: r[0] });
    expect(stepMove(r, r.length - 1, r[r.length - 1])).toEqual({ ok: true, done: true });
  });
  it('pays 14 and a 4 tip when clean', () => {
    expect(dancePay(false)).toBe(14);
    expect(dancePay(true)).toBe(18);
  });
});

describe('Skate Park (§16)', () => {
  it('the course has 8 obstacles, far apart, and is the same for the same run', () => {
    const c = course(1);
    expect(c).toHaveLength(OBSTACLES);
    for (let i = 1; i < c.length; i++) expect(c[i].at - c[i - 1].at).toBeGreaterThanOrEqual(330);
    expect(course(1)).toEqual(c);
    expect(course(2)).not.toEqual(c);
  });
  it('an obstacle is cleared only when the jump covers the moment it reaches the skater', () => {
    const o = course(1)[0];
    const reach = reachTime(o);
    expect(cleared(o, reach - 0.3)).toBe(true);
    expect(cleared(o, reach - 1.2)).toBe(false);
    expect(cleared(o, reach + 0.3)).toBe(false);
    expect(cleared(o, null)).toBe(false);
    expect(cleared(o, reach - 0.8 - SLACK / SPEED / 2)).toBe(true);
  });
  it('pays 20 for rolling, 3 per obstacle and 10 for a perfect run', () => {
    expect(skatePay(0)).toBe(SKATE_PAY);
    expect(skatePay(5)).toBe(35);
    expect(skatePay(8)).toBe(20 + 24 + 10);
    expect(runEnd(course(1))).toBeGreaterThan(reachTime(course(1)[7]));
  });
  it('old saves get empty dance and skate records', () => {
    const raw = JSON.parse(JSON.stringify(newSave(SAVE_CONTEXT, 1)));
    delete raw.progress.dance;
    delete raw.progress.skate;
    const p = sanitize(raw, SAVE_CONTEXT).progress;
    expect(p.dance).toEqual({ routines: 0, shifts: 0 });
    expect(p.skate).toEqual({ runs: 0, best: 0 });
  });
});
