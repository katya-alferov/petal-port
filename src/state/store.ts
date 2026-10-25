// The single game store (data-model §4). Only `save` is persisted; `ui` is session state.
import { create } from 'zustand';
import { SAVE_CONTEXT } from '../content/saveContext';
import { WEARABLES } from '../content/wearables';
import { load, newSave, validate, type Appearance, type Outfit, type SaveGame } from '../game/save';
import { equip } from '../game/wardrobe';
import { log } from '../platform/log';
import { readSaves, requestPersist, scheduleWrite } from '../platform/storage';

export type SceneId = 'title' | 'me' | 'home' | 'gallery' | 'spike';

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
  boot: async (fixture) => {
    if (fixture === 'fresh') {
      setState({ ready: true });
      return;
    }
    const stored = await readSaves();
    if (stored) {
      for (const [name, raw] of [['current', stored.current], ['previous', stored.previous]] as const) {
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
