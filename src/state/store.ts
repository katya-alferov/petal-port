// The single game store (data-model §4). Only `save` is persisted; `ui` is session state.
import { type BedroomPart, withPart } from '../game/bedroom';
import { DANCE_SHIFT_BONUS, dancePay } from '../game/dance';
import { pairsPay, BOARDS } from '../game/pairs';
import { SONG_PAY, SONGS } from '../game/piano';
import { NAILS_SHIFT_BONUS, nailsPay } from '../game/nails';
import { POSY_SHIFT_BONUS, posyPay } from '../game/posies';
import { OBSTACLES, skatePay } from '../game/skate';
import { addDesign, SWEET_SHIFT_BONUS, sweetPay, type Cupcake } from '../game/sweets';
import { BURGER_SHIFT_BONUS, burgerPay } from '../game/burger';
import { souvenir } from '../content/travel';
import { addPhoto, buySouvenir as doBuySouvenir, buyTicket as doBuyTicket, removePhoto, type PhotoRecipe } from '../game/travel';
import { WINDOW_VIEWS } from '../content/views';
import { viewUnlocked } from '../game/views';
import { create } from 'zustand';
import { SAVE_CONTEXT } from '../content/saveContext';
import { WEARABLES } from '../content/wearables';
import { RANK_GIFTS, regular } from '../content/cafe';
import { petAccessory, petKind } from '../content/pets';
import { LETTERS, REQUEST_POOLS, STICKERS } from '../content/town';
import { RECIPES } from '../content/recipes';
import { furniture } from '../content/furniture';
import { JOURNEY_COINS, JOURNEY_STEPS } from '../content/recipes';
import type { HomeSlot } from '../content/types';
import { priceOf } from '../content/wearables';
import { orderPay, rankFor, SHIFT_BONUS } from '../game/cafe';
import { cookReward, isRecipeUnlocked } from '../game/cooking';
import { letterGift, letterWaiting, nextLetter, weekIndex, type LetterDef } from '../game/mail';
import { adopt, care } from '../game/pets';
import { addHeart, applyEvent, fillBoard, isReady, NOTE_PAY, type GameEvent } from '../game/requests';
import { showReward } from '../game/show';
import { clientPay, SALON_SHIFT_BONUS } from '../game/salon';
import { grow, pickBloom, PICK_COINS, plant } from '../game/garden';
import { newStickers } from '../game/stickers';
import { earn, grant, purchase } from '../game/economy';
import { load, newSave, validate, type Appearance, type Dish, type Outfit, type PetAction, type SaveGame } from '../game/save';
import { equip } from '../game/wardrobe';
import { TEST_HOOKS_ENABLED } from '../platform/hooks';
import { log } from '../platform/log';
import { readSaves, requestPersist, scheduleWrite } from '../platform/storage';

export type SceneId =
  | 'park'
  | 'nails'
  | 'posies'
  | 'bedroom'
  | 'dance'
  | 'skate'
  | 'sweets'
  | 'burger'
  | 'airport'
  | 'paris'
  | 'photo'
  | 'title'
  | 'town'
  | 'me'
  | 'home'
  | 'cafe'
  | 'boutique'
  | 'kitchen'
  | 'petshop'
  | 'pet'
  | 'board'
  | 'album'
  | 'show'
  | 'salon'
  | 'garden'
  | 'gallery'
  | 'spike';

export interface ToastMsg {
  id: number;
  message: string;
  icon?: string;
}

interface GameStore {
  save: SaveGame;
  ready: boolean;
  scene: SceneId;
  toast: ToastMsg | null;
  setScene: (s: SceneId) => void;
  showToast: (message: string, icon?: string) => void;
  clearToast: () => void;
  setAppearance: (patch: Partial<Appearance>) => void;
  setOutfit: (outfit: Outfit) => void;
  equipItem: (itemId: string) => void;
  setTheme: (themeId: string) => void;
  setHomeView: (viewId: string) => void;
  setBedroomPart: (part: BedroomPart, id: string) => void;
  setSetting: <K extends keyof SaveGame['settings']>(k: K, v: SaveGame['settings'][K]) => void;
  /** Buys a wearable or furniture item; returns false when it can't be afforded. */
  buy: (itemId: string) => boolean;
  placeFurniture: (slot: HomeSlot, itemId: string) => void;
  /** A correct café serve. Returns coins earned and the new rank if it went up. */
  cafeServed: (firstTry: boolean, base?: string) => { coins: number; rankUp: 2 | 3 | null };
  cafeShiftDone: () => number;
  cookDone: (dish: Dish, stars: 1 | 2 | 3) => number;
  completeJourney: (stepId: string) => void;
  adoptPet: (kind: string, color: string, name: string) => void;
  setPetAccessory: (id: string | null) => void;
  /** A finished feed / wash / play. Returns the trick number learned, if any. */
  petCared: (action: PetAction) => number | null;
  /** Tops the Petal Notes board up to three notes. */
  refreshBoard: () => void;
  deliverNote: (no: number) => { coins: number; hearts: number; gift: string | null; visit: boolean } | null;
  swapNote: (no: number) => void;
  /** Opens this week's letter, if one is waiting. */
  openMail: () => { letter: LetterDef; gift: { item: string } | { coins: number } } | null;
  inviteFriend: (id: string | null) => void;
  /** Wave B (game-systems §9). A finished runway walk; returns the coins paid. */
  showDone: (themeId: string, stars: 1 | 2 | 3) => { coins: number; firstStars: boolean };
  /** Picks up a secret shell; returns how many are found now, or null if it was already found. */
  findShell: (id: string) => number | null;
  /** Wave C (game-systems §10). A styled client; returns the coins paid. */
  salonServed: (firstLook: boolean) => number;
  salonShiftDone: () => number;
  /** Wave D (game-systems §12). */
  burgerServed: (clean: boolean) => number;
  burgerShiftDone: () => number;
  /** Wave D (game-systems §13): returns the coins paid and whether the design is new to the collection. */
  sweetServed: (c: Cupcake, firstLook: boolean) => { coins: number; isNew: boolean };
  sweetShiftDone: () => number;
  /** Wave D (game-systems §15, §16). */
  danceServed: (clean: boolean) => number;
  danceShiftDone: () => number;
  skateDone: (clearedCount: number) => number;
  /** Wave E (game-systems §18, §19). */
  /** Wave E (game-systems §21, §22): coins paid; a song pays once. */
  pairsDone: (level: number, misses: number) => number;
  songDone: (id: string) => number;
  nailsServed: (clean: boolean) => number;
  nailsShiftDone: () => number;
  posyServed: (clean: boolean) => number;
  posyShiftDone: () => number;
  plantSeed: (bed: number, seed: string) => void;
  /** Wave D (game-systems §11). Each returns whether it worked. */
  buyTicket: () => boolean;
  flyToParis: () => void;
  buySouvenir: (id: string) => boolean;
  takePhoto: (photo: PhotoRecipe) => { first: boolean } | null;
  deletePhoto: (index: number) => void;
  pickFlower: (bed: number) => { coins: number; seed: string; first: boolean } | null;
  boot: (fixture?: string | null) => Promise<void>;
}

let toastId = 0;

function touch(save: SaveGame): SaveGame {
  return { ...save, updatedAt: Date.now() };
}

/** Counts a finished activity on the Petal Notes board. */
/** A finished activity helps every planted flower grow (game-systems §10.2). */
function grown(s: SaveGame): SaveGame {
  const garden = grow(s.progress.garden);
  return garden === s.progress.garden ? s : { ...s, progress: { ...s.progress, garden } };
}

function withEvent(s: SaveGame, e: GameEvent): SaveGame {
  const board = applyEvent(s.progress.requests.board, e);
  return { ...s, progress: { ...s.progress, requests: { ...s.progress.requests, board } } };
}

export function currentWeek(): number {
  const now = Date.now();
  return weekIndex(now, new Date(now).getTimezoneOffset());
}

export function liveState(s: SaveGame) {
  return { wearing: Object.values(s.player.outfit).map((e) => e!.itemId), placed: Object.values(s.home.slots) };
}

export const STICKER_FACTS = {
  journeySteps: JOURNEY_STEPS.length,
  starters: new Set([...Object.values(SAVE_CONTEXT.starterOutfit).map((e) => e!.itemId), ...Object.values(SAVE_CONTEXT.starterHome)]),
};

export const useGame = create<GameStore>((setState, getState) => ({
  save: newSave(SAVE_CONTEXT, Date.now()),
  ready: false,
  scene: 'title',
  toast: null,
  setScene: (scene) => setState({ scene }),
  showToast: (message, icon) => setState({ toast: { id: ++toastId, message, icon } }),
  clearToast: () => setState({ toast: null }),
  setAppearance: (patch) => {
    const s = getState().save;
    setState({ save: touch({ ...s, player: { ...s.player, appearance: { ...s.player.appearance, ...patch } } }) });
  },
  setOutfit: (outfit) => {
    const s = getState().save;
    setState({ save: touch({ ...s, player: { ...s.player, outfit } }) });
  },
  equipItem: (itemId) => {
    const def = WEARABLES.find((w) => w.id === itemId);
    if (!def) return;
    const s = getState().save;
    setState({ save: touch({ ...s, player: { ...s.player, outfit: equip(s.player.outfit, def) } }) });
  },
  setTheme: (themeId) => {
    const s = getState().save;
    setState({ save: touch({ ...s, home: { ...s.home, themeId } }) });
  },
  setHomeView: (view) => {
    const s = getState().save;
    const def = WINDOW_VIEWS.find((v) => v.id === view);
    if (!def || !viewUnlocked(def, s.progress)) return;
    setState({ save: touch({ ...s, home: { ...s.home, view } }) });
  },
  setBedroomPart: (part, id) => {
    const s = getState().save;
    setState({ save: touch({ ...s, home: { ...s.home, bedroom: withPart(s.home.bedroom, part, id) } }) });
  },
  setSetting: (k, v) => {
    const s = getState().save;
    setState({ save: touch({ ...s, settings: { ...s.settings, [k]: v } }) });
  },
  buy: (itemId) => {
    const s = getState().save;
    const def = WEARABLES.find((w) => w.id === itemId) ?? furniture(itemId) ?? petAccessory(itemId);
    const price = def ? priceOf(def) : null;
    if (price === null) return false;
    const r = purchase(s, itemId, price, Date.now());
    if (!r.ok) return false;
    setState({ save: touch(r.save) });
    getState().completeJourney('journey.boutique');
    return true;
  },
  placeFurniture: (slot, itemId) => {
    const s = getState().save;
    if (!s.inventory.owned[itemId] || furniture(itemId)?.slot !== slot || s.home.slots[slot] === itemId) return;
    setState({ save: touch({ ...s, home: { ...s.home, slots: { ...s.home.slots, [slot]: itemId } } }) });
    getState().completeJourney('journey.decorate');
  },
  cafeServed: (firstTry, base) => {
    let s = getState().save;
    if (base) s = withEvent(s, { kind: 'cafe', base });
    const before = s.progress.cafe.rank;
    const coins = orderPay(before, firstTry);
    const correctOrders = s.progress.cafe.correctOrders + 1;
    const rank = rankFor(correctOrders);
    s = earn(s, coins);
    s = { ...s, progress: { ...s.progress, cafe: { ...s.progress.cafe, correctOrders, rank } } };
    let rankUp: 2 | 3 | null = null;
    if (rank > before) {
      rankUp = rank as 2 | 3;
      for (const id of RANK_GIFTS[rankUp].items) s = grant(s, id, Date.now());
    }
    setState({ save: touch(s) });
    return { coins, rankUp };
  },
  cafeShiftDone: () => {
    let s = earn(getState().save, SHIFT_BONUS);
    s = grown({ ...s, progress: { ...s.progress, cafe: { ...s.progress.cafe, shifts: s.progress.cafe.shifts + 1 } } });
    setState({ save: touch(s) });
    getState().completeJourney('journey.cafe');
    return SHIFT_BONUS;
  },
  cookDone: (dish, stars) => {
    let s = getState().save;
    const prev = s.progress.recipes[dish.recipeId];
    const coins = cookReward(prev, stars);
    s = earn(s, coins);
    const rec = { cooked: (prev?.cooked ?? 0) + 1, stars: Math.max(prev?.stars ?? 0, stars) };
    s = { ...s, progress: { ...s.progress, dish, recipes: { ...s.progress.recipes, [dish.recipeId]: rec } } };
    s = withEvent(s, { kind: 'cook', recipe: dish.recipeId, toppings: dish.toppings.map((t) => t.id) });
    setState({ save: touch(grown(s)) });
    getState().completeJourney('journey.cook');
    return coins;
  },
  completeJourney: (stepId) => {
    const s = getState().save;
    if (s.progress.journey.includes(stepId)) return;
    const next = earn({ ...s, progress: { ...s.progress, journey: [...s.progress.journey, stepId] } }, JOURNEY_COINS);
    setState({ save: touch(next) });
    getState().showToast(`Journey step done! +${JOURNEY_COINS} coins`, 'sparkle');
  },
  adoptPet: (kind, color, name) => {
    const s = getState().save;
    if (s.progress.pet) return;
    const pet = adopt(kind, color, name || petKind(kind).names[0]);
    setState({ save: touch({ ...s, progress: { ...s.progress, pet } }) });
  },
  setPetAccessory: (id) => {
    const s = getState().save;
    const pet = s.progress.pet;
    if (!pet || (id && !s.inventory.owned[id])) return;
    setState({ save: touch({ ...s, progress: { ...s.progress, pet: { ...pet, accessory: id } } }) });
  },
  petCared: (action) => {
    let s = getState().save;
    if (!s.progress.pet) return null;
    const r = care(s.progress.pet, action);
    s = withEvent({ ...s, progress: { ...s.progress, pet: r.pet } }, { kind: 'pet', action });
    setState({ save: touch(grown(s)) });
    return r.newTrick;
  },
  refreshBoard: () => {
    const s = getState().save;
    const ctx = {
      hasPet: s.progress.pet !== null,
      unlockedRecipes: RECIPES.filter((r) => isRecipeUnlocked(r, s.progress.recipes)).map((r) => r.id),
    };
    const requests = fillBoard(s.progress.requests, s.createdAt, REQUEST_POOLS, ctx);
    if (requests.made === s.progress.requests.made) return;
    setState({ save: touch({ ...s, progress: { ...s.progress, requests } }) });
  },
  deliverNote: (no) => {
    let s = getState().save;
    const note = s.progress.requests.board.find((n) => n.no === no);
    if (!note || !isReady(note, liveState(s))) return null;
    const coins = NOTE_PAY[note.goal.kind];
    const h = addHeart(s.progress.friends[note.friend] ?? 0);
    s = earn(s, coins);
    const gift = h.gift ? (regular(note.friend)?.gift ?? null) : null;
    if (gift) s = grant(s, gift, Date.now());
    const board = s.progress.requests.board.filter((n) => n.no !== no);
    s = {
      ...s,
      progress: {
        ...s.progress,
        friends: { ...s.progress.friends, [note.friend]: h.hearts },
        requests: { ...s.progress.requests, done: s.progress.requests.done + 1, board },
      },
    };
    setState({ save: touch(grown(s)) });
    getState().refreshBoard();
    return { coins, hearts: h.hearts, gift, visit: h.visit };
  },
  swapNote: (no) => {
    const s = getState().save;
    const board = s.progress.requests.board.filter((n) => n.no !== no);
    if (board.length === s.progress.requests.board.length) return;
    setState({ save: touch({ ...s, progress: { ...s.progress, requests: { ...s.progress.requests, board } } }) });
    getState().refreshBoard();
  },
  openMail: () => {
    let s = getState().save;
    const week = currentWeek();
    if (!letterWaiting(s.progress.mail, week)) return null;
    const letter = nextLetter(s.progress.mail.opened, LETTERS);
    const gift = letterGift(letter, s.inventory.owned);
    s = 'item' in gift ? grant(s, gift.item, Date.now()) : earn(s, gift.coins);
    s = { ...s, progress: { ...s.progress, mail: { lastWeek: week, opened: s.progress.mail.opened + 1 } } };
    setState({ save: touch(s) });
    return { letter, gift };
  },
  inviteFriend: (id) => {
    const s = getState().save;
    setState({ save: touch({ ...s, progress: { ...s.progress, visitor: id } }) });
  },
  showDone: (themeId, stars) => {
    let s = getState().save;
    const r = showReward(s.progress.shows.best[themeId] ?? 0, stars);
    s = earn(s, r.coins);
    s = {
      ...s,
      progress: { ...s.progress, shows: { done: s.progress.shows.done + 1, best: { ...s.progress.shows.best, [themeId]: r.best } } },
    };
    setState({ save: touch(grown(s)) });
    return { coins: r.coins, firstStars: r.firstStars };
  },
  findShell: (id) => {
    const s = getState().save;
    if (s.progress.shells.includes(id)) return null;
    const shells = [...s.progress.shells, id];
    setState({ save: touch({ ...s, progress: { ...s.progress, shells } }) });
    return shells.length;
  },
  buyTicket: () => {
    const next = doBuyTicket(getState().save);
    if (!next) return false;
    setState({ save: touch(next) });
    return true;
  },
  flyToParis: () => {
    const s = getState().save;
    if (!s.progress.travel.ticket) return;
    const t = s.progress.travel;
    setState({ save: touch({ ...s, progress: { ...s.progress, travel: { ...t, trips: t.trips + 1 } } }) });
    getState().setScene('paris');
  },
  buySouvenir: (id) => {
    const price = souvenir(id)?.price ?? 0;
    const next = doBuySouvenir(getState().save, id, price);
    if (!next) return false;
    setState({ save: touch(next) });
    return true;
  },
  takePhoto: (photo) => {
    const r = addPhoto(getState().save, photo);
    if (!r) return null;
    setState({ save: touch(r.save) });
    return { first: r.first };
  },
  deletePhoto: (index) => {
    setState({ save: touch(removePhoto(getState().save, index)) });
  },
  salonServed: (firstLook) => {
    let s = getState().save;
    const coins = clientPay(firstLook);
    s = earn(s, coins);
    s = { ...s, progress: { ...s.progress, salon: { ...s.progress.salon, clients: s.progress.salon.clients + 1 } } };
    setState({ save: touch(s) });
    return coins;
  },
  salonShiftDone: () => {
    let s = earn(getState().save, SALON_SHIFT_BONUS);
    s = grown({ ...s, progress: { ...s.progress, salon: { ...s.progress.salon, shifts: s.progress.salon.shifts + 1 } } });
    setState({ save: touch(s) });
    return SALON_SHIFT_BONUS;
  },
  burgerServed: (clean) => {
    let s = getState().save;
    const coins = burgerPay(clean);
    s = earn(s, coins);
    s = { ...s, progress: { ...s.progress, burger: { ...s.progress.burger, orders: s.progress.burger.orders + 1 } } };
    setState({ save: touch(s) });
    return coins;
  },
  burgerShiftDone: () => {
    let s = earn(getState().save, BURGER_SHIFT_BONUS);
    s = grown({ ...s, progress: { ...s.progress, burger: { ...s.progress.burger, shifts: s.progress.burger.shifts + 1 } } });
    setState({ save: touch(s) });
    return BURGER_SHIFT_BONUS;
  },
  sweetServed: (c, firstLook) => {
    let s = getState().save;
    const coins = sweetPay(firstLook);
    s = earn(s, coins);
    const sw = s.progress.sweets;
    const made = addDesign(sw.made, c);
    s = { ...s, progress: { ...s.progress, sweets: { ...sw, served: sw.served + 1, made: [...made] } } };
    setState({ save: touch(s) });
    return { coins, isNew: made.length !== sw.made.length };
  },
  sweetShiftDone: () => {
    let s = earn(getState().save, SWEET_SHIFT_BONUS);
    s = grown({ ...s, progress: { ...s.progress, sweets: { ...s.progress.sweets, shifts: s.progress.sweets.shifts + 1 } } });
    setState({ save: touch(s) });
    return SWEET_SHIFT_BONUS;
  },
  danceServed: (clean) => {
    let s = getState().save;
    const coins = dancePay(clean);
    s = earn(s, coins);
    s = { ...s, progress: { ...s.progress, dance: { ...s.progress.dance, routines: s.progress.dance.routines + 1 } } };
    setState({ save: touch(s) });
    return coins;
  },
  danceShiftDone: () => {
    let s = earn(getState().save, DANCE_SHIFT_BONUS);
    s = grown({ ...s, progress: { ...s.progress, dance: { ...s.progress.dance, shifts: s.progress.dance.shifts + 1 } } });
    setState({ save: touch(s) });
    return DANCE_SHIFT_BONUS;
  },
  skateDone: (clearedCount) => {
    const n = Math.max(0, Math.min(clearedCount, OBSTACLES));
    const coins = skatePay(n);
    let s = earn(getState().save, coins);
    const sk = s.progress.skate;
    s = grown({ ...s, progress: { ...s.progress, skate: { runs: sk.runs + 1, best: Math.max(sk.best, n) } } });
    setState({ save: touch(s) });
    return coins;
  },
  pairsDone: (level, misses) => {
    const lv = Math.max(0, Math.min(level, BOARDS.length - 1));
    const coins = pairsPay(lv, Math.max(0, misses));
    let s = earn(getState().save, coins);
    const pk = s.progress.park;
    s = grown({ ...s, progress: { ...s.progress, park: { ...pk, games: pk.games + 1, hard: pk.hard || lv === BOARDS.length - 1 } } });
    setState({ save: touch(s) });
    return coins;
  },
  songDone: (id) => {
    const pk = getState().save.progress.park;
    if (!SONGS.some((x) => x.id === id) || pk.songs.includes(id)) return 0;
    let s = earn(getState().save, SONG_PAY);
    s = { ...s, progress: { ...s.progress, park: { ...pk, songs: [...pk.songs, id] } } };
    setState({ save: touch(s) });
    return SONG_PAY;
  },
  nailsServed: (clean) => {
    let s = getState().save;
    const coins = nailsPay(clean);
    s = earn(s, coins);
    s = { ...s, progress: { ...s.progress, nails: { ...s.progress.nails, clients: s.progress.nails.clients + 1 } } };
    setState({ save: touch(s) });
    return coins;
  },
  nailsShiftDone: () => {
    let s = earn(getState().save, NAILS_SHIFT_BONUS);
    s = grown({ ...s, progress: { ...s.progress, nails: { ...s.progress.nails, shifts: s.progress.nails.shifts + 1 } } });
    setState({ save: touch(s) });
    return NAILS_SHIFT_BONUS;
  },
  posyServed: (clean) => {
    let s = getState().save;
    const coins = posyPay(clean);
    s = earn(s, coins);
    s = { ...s, progress: { ...s.progress, posies: { ...s.progress.posies, bouquets: s.progress.posies.bouquets + 1 } } };
    setState({ save: touch(s) });
    return coins;
  },
  posyShiftDone: () => {
    let s = earn(getState().save, POSY_SHIFT_BONUS);
    s = grown({ ...s, progress: { ...s.progress, posies: { ...s.progress.posies, shifts: s.progress.posies.shifts + 1 } } });
    setState({ save: touch(s) });
    return POSY_SHIFT_BONUS;
  },
  plantSeed: (bed, seedId) => {
    const s = getState().save;
    const garden = plant(s.progress.garden, bed, seedId);
    if (garden === s.progress.garden) return;
    setState({ save: touch({ ...s, progress: { ...s.progress, garden } }) });
  },
  pickFlower: (bed) => {
    let s = getState().save;
    const r = pickBloom(s.progress.garden, bed);
    if (!r) return null;
    s = earn({ ...s, progress: { ...s.progress, garden: r.garden } }, PICK_COINS);
    setState({ save: touch(s) });
    return { coins: PICK_COINS, seed: r.seed, first: r.first };
  },
  boot: async (fixture) => {
    if (fixture === 'fresh') {
      setState({ ready: true });
      return;
    }
    const stored = await readSaves();
    if (stored) {
      for (const [name, raw] of [
        ['current', stored.current],
        ['previous', stored.previous],
      ] as const) {
        if (raw === undefined) continue;
        const r = load(raw, SAVE_CONTEXT);
        if (r.kind === 'ok') {
          setState({ save: r.save });
          if (name === 'previous') getState().showToast('We found your game from a moment ago!');
          break;
        }
        log('warn', `save:${name} unreadable: ${r.errors.join(', ')}`);
      }
    }
    setState({ ready: true });
  },
}));

// Persist: validate before every write; never write an invalid save (data-model §5.2).
let persistAsked = false;
useGame.subscribe((state, prev) => {
  if (!state.ready || state.save === prev.save) return;
  // Stickers are earned by what the player did; announce each one once (game-systems §8.5).
  const fresh = newStickers(state.save, STICKERS, STICKER_FACTS);
  if (fresh.length) {
    const s = state.save;
    useGame.setState({ save: { ...s, progress: { ...s.progress, stickers: [...s.progress.stickers, ...fresh] } } });
    const first = STICKERS.find((d) => d.id === fresh[0]);
    if (prev.ready) state.showToast(`New sticker: ${first?.name}!`, 'star');
    return;
  }
  const errs = validate(state.save);
  if (errs.length) {
    log('error', `save invalid, write skipped: ${errs.join(', ')}`);
    return;
  }
  scheduleWrite(JSON.stringify(state.save));
  if (!persistAsked) {
    persistAsked = true;
    void requestPersist().then((r) => log('info', `storage.persist() → ${String(r)}`));
  }
});

// Preview builds only: lets e2e tests and AI testers read state and jump between scenes.
if (TEST_HOOKS_ENABLED) (window as unknown as { __petal: typeof useGame }).__petal = useGame;
