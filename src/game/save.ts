// SaveGame model + validate / sanitize / migrate (data-model §3, §5.4). Pure: no DOM, storage or clock.
import { BEDROOM_PARTS, type BedroomLook } from './bedroom';
import { MAX_DESIGNS } from './sweets';
import { MAX_PHOTOS, newTravel, type PhotoRecipe, type Travel } from './travel';
import type { HomeSlot, ItemId, WearSlot } from '../content/types';
import type { SwatchId } from '../content/palette';

export interface EquippedItem {
  itemId: ItemId;
  tint?: Partial<Record<'main' | 'accent', SwatchId>>;
}

export type Outfit = Partial<Record<WearSlot, EquippedItem>>;

export interface Appearance {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeStyle: string;
  eyeColor: string;
  brows: string;
  freckles: boolean;
}

export interface FavoriteLook {
  outfit: Outfit;
  hairStyle: string;
  hairColor: string;
  savedAt: number;
}

export interface DishTopping {
  id: string;
  /** Position on the plate, 0..1 in both axes. */
  x: number;
  y: number;
}

export interface Dish {
  recipeId: string;
  doneness: 'pale' | 'golden' | 'toasty';
  toppings: DishTopping[];
}

export interface PetState {
  kind: string;
  color: string;
  name: string;
  /** Pet accessory item id, or null. */
  accessory: string | null;
  fed: number;
  washed: number;
  played: number;
}

export type RequestGoal =
  | { kind: 'cook'; recipe: string; topping: string }
  | { kind: 'cafe'; base: string; count: number }
  | { kind: 'wear'; item: string }
  | { kind: 'place'; item: string }
  | { kind: 'pet'; action: PetAction };

export type PetAction = 'feed' | 'wash' | 'play';

export interface RequestNote {
  /** Running number: also the seed for the next note. */
  no: number;
  friend: string;
  goal: RequestGoal;
  /** Progress for counted goals (cook, cafe, pet). */
  have: number;
}

export interface Progress {
  cafe: { correctOrders: number; shifts: number; rank: 1 | 2 | 3 };
  recipes: Record<string, { cooked: number; stars: number }>;
  dish: Dish | null;
  /** Welcome Journey step ids that are done (game-systems §6.7). */
  journey: string[];
  /** Wave A (game-systems §8). */
  pet: PetState | null;
  /** Friendship hearts per regular id. */
  friends: Record<string, number>;
  requests: { made: number; done: number; board: RequestNote[] };
  /** Post Box: the last week index a letter was opened in, and how many were opened. */
  mail: { lastWeek: number; opened: number };
  /** Sticker ids earned, in order. */
  stickers: string[];
  /** A friend visiting the player's home, or null. */
  visitor: string | null;
  /** Wave B (game-systems §9): Starlight Stage shows walked, and the best stars per show theme. */
  shows: { done: number; best: Record<string, number> };
  /** Secret shell ids found, in order. */
  shells: string[];
  /** Wave C (game-systems §10): Glam Salon clients styled and shifts finished. */
  salon: { clients: number; shifts: number };
  /** Wave D (game-systems §12): Bun & Bite orders served and shifts finished. */
  burger: { orders: number; shifts: number };
  /** Wave D (game-systems §13): Sweet Spot customers, shifts and every different design served. */
  sweets: { served: number; shifts: number; made: string[] };
  /** Wave D (game-systems §15, §16): Dance Studio routines and shifts, Skate Park runs and best cleared count. */
  dance: { routines: number; shifts: number };
  skate: { runs: number; best: number };
  /** Petal Garden beds: the seed planted and the growth it has gathered. */
  garden: { beds: (GardenBed | null)[]; bloomed: string[]; picked: number };
  /** Wave D (game-systems §11): the Paris trip, souvenirs and photos kept as small recipes. */
  travel: Travel;
}

export interface GardenBed {
  seed: string;
  growth: number;
}

export interface SaveGame {
  schemaVersion: 1;
  createdAt: number;
  updatedAt: number;
  player: {
    name: string;
    appearance: Appearance;
    outfit: Outfit;
    favoriteLooks: (FavoriteLook | null)[];
  };
  inventory: { owned: Record<ItemId, { acquiredAt: number }> };
  wallet: { coins: number; lifetimeEarned: number };
  home: {
    homeId: 'harbour-loft' | 'meadow-cottage';
    themeId: string;
    /** Window view id (content/views). Missing in older saves means the harbour. */
    view?: string;
    /** Bedroom design (game-systems §17); missing parts use the starter look. */
    bedroom?: Partial<BedroomLook>;
    slots: Record<HomeSlot, ItemId>;
    shelf: ItemId[];
  };
  /** Added after M0 inside schema 1: older saves get defaults from sanitize(). */
  progress: Progress;
  settings: {
    music: boolean;
    sfx: boolean;
    reducedMotion: 'system' | 'on' | 'off';
    installCardDismissedAt?: number;
  };
}

export const CURRENT_SCHEMA = 1;
export const MAX_COINS = 99_999;
export const MAX_NAME = 12;
export const START_COINS = 120;
export const MAX_HEARTS = 10;
/** Petal Garden flower beds (game-systems §10.2). */
export const GARDEN_BEDS = 6;

export function newProgress(): Progress {
  return {
    cafe: { correctOrders: 0, shifts: 0, rank: 1 },
    recipes: {},
    dish: null,
    journey: [],
    pet: null,
    friends: {},
    requests: { made: 0, done: 0, board: [] },
    mail: { lastWeek: -1, opened: 0 },
    stickers: [],
    visitor: null,
    shows: { done: 0, best: {} },
    shells: [],
    salon: { clients: 0, shifts: 0 },
    burger: { orders: 0, shifts: 0 },
    sweets: { served: 0, shifts: 0, made: [] },
    dance: { routines: 0, shifts: 0 },
    skate: { runs: 0, best: 0 },
    garden: { beds: Array.from({ length: GARDEN_BEDS }, () => null), bloomed: [], picked: 0 },
    travel: newTravel(),
  };
}

/** The content facts that sanitize() needs, injected so this module stays pure. */
export interface SaveContext {
  knownItems: Set<ItemId>;
  starterOutfit: Outfit;
  starterHome: Record<HomeSlot, ItemId>;
  defaultAppearance: Appearance;
}

export function newSave(ctx: SaveContext, now: number): SaveGame {
  const owned: SaveGame['inventory']['owned'] = {};
  for (const e of Object.values(ctx.starterOutfit)) if (e) owned[e.itemId] = { acquiredAt: now };
  for (const id of Object.values(ctx.starterHome)) owned[id] = { acquiredAt: now };
  return {
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
    player: {
      name: '',
      appearance: { ...ctx.defaultAppearance },
      outfit: structuredClone(ctx.starterOutfit),
      favoriteLooks: [null, null, null, null],
    },
    inventory: { owned },
    wallet: { coins: START_COINS, lifetimeEarned: 0 },
    home: { homeId: 'harbour-loft', themeId: 'theme.seaside', slots: { ...ctx.starterHome }, shelf: [] },
    progress: newProgress(),
    settings: { music: true, sfx: true, reducedMotion: 'system' },
  };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isBool = (v: unknown): v is boolean => typeof v === 'boolean';

/** Structural check. Returns a list of problems; empty means valid. */
export function validate(v: unknown): string[] {
  const errs: string[] = [];
  if (!isObj(v)) return ['not an object'];
  if (v.schemaVersion !== CURRENT_SCHEMA) errs.push('schemaVersion');
  if (!isNum(v.createdAt) || !isNum(v.updatedAt)) errs.push('timestamps');

  const p = v.player;
  if (!isObj(p)) errs.push('player');
  else {
    if (!isStr(p.name)) errs.push('player.name');
    const a = p.appearance;
    if (!isObj(a)) errs.push('player.appearance');
    else {
      for (const k of ['skinTone', 'hairStyle', 'hairColor', 'eyeStyle', 'eyeColor', 'brows'] as const)
        if (!isStr(a[k])) errs.push(`player.appearance.${k}`);
      if (!isBool(a.freckles)) errs.push('player.appearance.freckles');
    }
    if (!isObj(p.outfit)) errs.push('player.outfit');
    else
      for (const [slot, e] of Object.entries(p.outfit))
        if (e !== undefined && !(isObj(e) && isStr(e.itemId))) errs.push(`player.outfit.${slot}`);
    if (!Array.isArray(p.favoriteLooks)) errs.push('player.favoriteLooks');
  }

  if (!isObj(v.inventory) || !isObj(v.inventory.owned)) errs.push('inventory');
  if (!isObj(v.wallet) || !isNum(v.wallet.coins) || !isNum(v.wallet.lifetimeEarned)) errs.push('wallet');

  const h = v.home;
  if (!isObj(h) || !isStr(h.homeId) || !isStr(h.themeId) || !isObj(h.slots) || !Array.isArray(h.shelf)) errs.push('home');

  const s = v.settings;
  if (!isObj(s) || !isBool(s.music) || !isBool(s.sfx) || !['system', 'on', 'off'].includes(s.reducedMotion as string))
    errs.push('settings');
  return errs;
}

/** Repairs soft problems in a structurally valid save (data-model §5.4). Returns a new object. */
export function sanitize(save: SaveGame, ctx: SaveContext): SaveGame {
  const s = structuredClone(save);
  const owned: SaveGame['inventory']['owned'] = {};
  for (const [id, rec] of Object.entries(s.inventory.owned)) if (ctx.knownItems.has(id)) owned[id] = rec;
  s.inventory.owned = owned;

  const outfit: Outfit = {};
  for (const [slot, e] of Object.entries(s.player.outfit) as [WearSlot, EquippedItem | undefined][])
    if (e && ctx.knownItems.has(e.itemId)) outfit[slot] = e;
  // Required slots: shoes always; top+bottom unless a dress is worn.
  const required: WearSlot[] = outfit.dress ? ['shoes'] : ['top', 'bottom', 'shoes'];
  for (const slot of required) if (!outfit[slot] && ctx.starterOutfit[slot]) outfit[slot] = ctx.starterOutfit[slot];
  if (outfit.dress) {
    delete outfit.top;
    delete outfit.bottom;
  }
  s.player.outfit = outfit;

  s.player.name = s.player.name.slice(0, MAX_NAME);
  const looks = s.player.favoriteLooks.slice(0, 4);
  while (looks.length < 4) looks.push(null);
  s.player.favoriteLooks = looks;

  s.wallet.coins = Math.max(0, Math.min(MAX_COINS, Math.floor(s.wallet.coins)));
  s.wallet.lifetimeEarned = Math.max(0, Math.floor(s.wallet.lifetimeEarned));

  for (const [slot, id] of Object.entries(s.home.slots) as [HomeSlot, ItemId][])
    if (!ctx.knownItems.has(id)) s.home.slots[slot] = ctx.starterHome[slot];
  for (const slot of Object.keys(ctx.starterHome) as HomeSlot[]) if (!s.home.slots[slot]) s.home.slots[slot] = ctx.starterHome[slot];
  s.home.shelf = s.home.shelf.filter((id) => ctx.knownItems.has(id)).slice(0, 3);
  const bedroom = s.home.bedroom as unknown;
  if (isObj(bedroom)) {
    const kept: Partial<BedroomLook> = {};
    for (const part of BEDROOM_PARTS)
      if (isStr(bedroom[part]) && (bedroom[part] as string).length <= 24) kept[part] = bedroom[part] as string;
    s.home.bedroom = kept;
  } else delete s.home.bedroom;
  s.progress = sanitizeProgress((s as Partial<SaveGame>).progress);
  return s;
}

const clampInt = (v: unknown, max = 1_000_000) => (isNum(v) ? Math.max(0, Math.min(max, Math.floor(v))) : 0);

function sanitizeProgress(raw: unknown): Progress {
  const p = newProgress();
  if (!isObj(raw)) return p;
  const cafe = raw.cafe;
  if (isObj(cafe)) {
    p.cafe.correctOrders = clampInt(cafe.correctOrders);
    p.cafe.shifts = clampInt(cafe.shifts);
    p.cafe.rank = ([1, 2, 3] as const).find((r) => r === cafe.rank) ?? 1;
  }
  if (isObj(raw.recipes))
    for (const [id, r] of Object.entries(raw.recipes))
      if (isObj(r)) p.recipes[id] = { cooked: clampInt(r.cooked), stars: clampInt(r.stars, 3) };
  const d = raw.dish;
  if (isObj(d) && isStr(d.recipeId) && ['pale', 'golden', 'toasty'].includes(d.doneness as string) && Array.isArray(d.toppings))
    p.dish = {
      recipeId: d.recipeId,
      doneness: d.doneness as Dish['doneness'],
      toppings: d.toppings
        .filter((t): t is DishTopping => isObj(t) && isStr(t.id) && isNum(t.x) && isNum(t.y))
        .slice(0, 8)
        .map((t) => ({ id: t.id, x: Math.max(0, Math.min(1, t.x)), y: Math.max(0, Math.min(1, t.y)) })),
    };
  if (Array.isArray(raw.journey)) p.journey = [...new Set(raw.journey.filter(isStr))];
  const pet = raw.pet;
  if (isObj(pet) && isStr(pet.kind) && isStr(pet.color) && isStr(pet.name))
    p.pet = {
      kind: pet.kind,
      color: pet.color,
      name: pet.name.slice(0, MAX_NAME),
      accessory: isStr(pet.accessory) ? pet.accessory : null,
      fed: clampInt(pet.fed),
      washed: clampInt(pet.washed),
      played: clampInt(pet.played),
    };
  if (isObj(raw.friends)) for (const [id, h] of Object.entries(raw.friends)) if (isNum(h)) p.friends[id] = clampInt(h, MAX_HEARTS);
  const rq = raw.requests;
  if (isObj(rq)) {
    p.requests.made = clampInt(rq.made);
    p.requests.done = clampInt(rq.done);
    if (Array.isArray(rq.board)) p.requests.board = rq.board.filter(isNote).slice(0, 3);
  }
  const mail = raw.mail;
  if (isObj(mail))
    p.mail = { lastWeek: isNum(mail.lastWeek) ? Math.max(-1, Math.floor(mail.lastWeek)) : -1, opened: clampInt(mail.opened) };
  if (Array.isArray(raw.stickers)) p.stickers = [...new Set(raw.stickers.filter(isStr))];
  if (isStr(raw.visitor)) p.visitor = raw.visitor;
  const shows = raw.shows;
  if (isObj(shows)) {
    p.shows.done = clampInt(shows.done);
    if (isObj(shows.best)) for (const [id, n] of Object.entries(shows.best)) if (isNum(n)) p.shows.best[id] = clampInt(n, 3);
  }
  if (Array.isArray(raw.shells)) p.shells = [...new Set(raw.shells.filter(isStr))];
  const salon = raw.salon;
  if (isObj(salon)) p.salon = { clients: clampInt(salon.clients), shifts: clampInt(salon.shifts) };
  const bg = raw.burger;
  if (isObj(bg)) p.burger = { orders: clampInt(bg.orders), shifts: clampInt(bg.shifts) };
  const dn = raw.dance;
  if (isObj(dn)) p.dance = { routines: clampInt(dn.routines), shifts: clampInt(dn.shifts) };
  const sk = raw.skate;
  if (isObj(sk)) p.skate = { runs: clampInt(sk.runs), best: clampInt(sk.best, 8) };
  const sw = raw.sweets;
  if (isObj(sw))
    p.sweets = {
      served: clampInt(sw.served),
      shifts: clampInt(sw.shifts),
      made: Array.isArray(sw.made) ? [...new Set(sw.made.filter(isStr))].slice(0, MAX_DESIGNS) : [],
    };
  const g = raw.garden;
  if (isObj(g)) {
    if (Array.isArray(g.beds))
      p.garden.beds = p.garden.beds.map((_, i) => {
        const b = (g.beds as unknown[])[i];
        return isObj(b) && isStr(b.seed) ? { seed: b.seed, growth: clampInt(b.growth, 99) } : null;
      });
    if (Array.isArray(g.bloomed)) p.garden.bloomed = [...new Set(g.bloomed.filter(isStr))];
    p.garden.picked = clampInt(g.picked);
  }
  const tr = raw.travel;
  if (isObj(tr)) {
    p.travel.ticket = tr.ticket === true;
    p.travel.trips = clampInt(tr.trips);
    if (Array.isArray(tr.souvenirs)) p.travel.souvenirs = [...new Set(tr.souvenirs.filter(isStr))];
    if (Array.isArray(tr.photos)) p.travel.photos = tr.photos.filter(isPhoto).slice(0, MAX_PHOTOS);
  }
  return p;
}

function isNote(n: unknown): n is RequestNote {
  if (!isObj(n) || !isNum(n.no) || !isStr(n.friend) || !isNum(n.have) || !isObj(n.goal)) return false;
  const g = n.goal;
  switch (g.kind) {
    case 'cook':
      return isStr(g.recipe) && isStr(g.topping);
    case 'cafe':
      return isStr(g.base) && isNum(g.count);
    case 'wear':
    case 'place':
      return isStr(g.item);
    case 'pet':
      return ['feed', 'wash', 'play'].includes(g.action as string);
    default:
      return false;
  }
}

type Migration = (old: Record<string, unknown>) => Record<string, unknown>;

/** migrations[n] upgrades a save from schemaVersion n to n+1. Empty until v2 exists. */
export const MIGRATIONS: Record<number, Migration> = {};

export function migrate(raw: unknown): unknown {
  if (!isObj(raw) || !isNum(raw.schemaVersion)) return raw;
  let cur = raw;
  while (isNum(cur.schemaVersion) && cur.schemaVersion < CURRENT_SCHEMA) {
    const step = MIGRATIONS[cur.schemaVersion];
    if (!step) return cur;
    cur = step(cur);
  }
  return cur;
}

export type LoadResult = { kind: 'ok'; save: SaveGame } | { kind: 'invalid'; errors: string[] };

/** parse → migrate → validate → sanitize, for one stored value. */
export function load(raw: unknown, ctx: SaveContext): LoadResult {
  let value = raw;
  if (typeof raw === 'string') {
    try {
      value = JSON.parse(raw);
    } catch {
      return { kind: 'invalid', errors: ['json'] };
    }
  }
  const migrated = migrate(value);
  const errors = validate(migrated);
  if (errors.length) return { kind: 'invalid', errors };
  return { kind: 'ok', save: sanitize(migrated as SaveGame, ctx) };
}

function isPhoto(v: unknown): v is PhotoRecipe {
  return (
    isObj(v) &&
    v.place === 'paris' &&
    isStr(v.pose) &&
    ['idle', 'wave', 'hips', 'cheer'].includes(v.pose) &&
    isStr(v.prop) &&
    ['none', 'beret', 'croissant', 'balloon'].includes(v.prop) &&
    Array.isArray(v.stickers) &&
    v.stickers.length <= 6 &&
    v.stickers.every((x) => x === null || isStr(x)) &&
    isNum(v.at)
  );
}
