// The single game store (data-model §4). Only `save` is persisted; `ui` is session state.
import { create } from 'zustand';
import { SAVE_CONTEXT } from '../content/saveContext';
import { WEARABLES } from '../content/wearables';
import { RANK_GIFTS } from '../content/cafe';
import { furniture } from '../content/furniture';
import { JOURNEY_COINS } from '../content/recipes';
import type { HomeSlot } from '../content/types';
import { priceOf } from '../content/wearables';
import { orderPay, rankFor, SHIFT_BONUS } from '../game/cafe';
import { cookReward } from '../game/cooking';
import { earn, grant, purchase } from '../game/economy';
import { load, newSave, validate, type Appearance, type Dish, type Outfit, type SaveGame } from '../game/save';
import { equip } from '../game/wardrobe';
import { log } from '../platform/log';
import { readSaves, requestPersist, scheduleWrite } from '../platform/storage';

export type SceneId = 'title' | 'town' | 'me' | 'home' | 'cafe' | 'boutique' | 'kitchen' | 'gallery' | 'spike';

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
  setSetting: <K extends keyof SaveGame['settings']>(k: K, v: SaveGame['settings'][K]) => void;
  /** Buys a wearable or furniture item; returns false when it can't be afforded. */
  buy: (itemId: string) => boolean;
  placeFurniture: (slot: HomeSlot, itemId: string) => void;
  /** A correct café serve. Returns coins earned and the new rank if it went up. */
  cafeServed: (firstTry: boolean) => { coins: number; rankUp: 2 | 3 | null };
  cafeShiftDone: () => number;
  cookDone: (dish: Dish, stars: 1 | 2 | 3) => number;
  completeJourney: (stepId: string) => void;
  boot: (fixture?: string | null) => Promise<void>;
}

let toastId = 0;

function touch(save: SaveGame): SaveGame {
  return { ...save, updatedAt: Date.now() };
}

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
  setSetting: (k, v) => {
    const s = getState().save;
    setState({ save: touch({ ...s, settings: { ...s.settings, [k]: v } }) });
  },
  buy: (itemId) => {
    const s = getState().save;
    const def = WEARABLES.find((w) => w.id === itemId) ?? furniture(itemId);
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
    if (!s.inventory.owned[itemId] || furniture(itemId)?.slot !== slot) return;
    setState({ save: touch({ ...s, home: { ...s.home, slots: { ...s.home.slots, [slot]: itemId } } }) });
    getState().completeJourney('journey.decorate');
  },
  cafeServed: (firstTry) => {
    let s = getState().save;
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
    s = { ...s, progress: { ...s.progress, cafe: { ...s.progress.cafe, shifts: s.progress.cafe.shifts + 1 } } };
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
    setState({ save: touch(s) });
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
