// Equip rules (game-systems §1.2): a dress replaces top + bottom; shoes are always required.
import type { WearableDef, WearSlot } from '../content/types';
import type { SwatchId } from '../content/palette';
import type { Outfit } from './save';

export function equip(outfit: Outfit, item: WearableDef, tint?: Partial<Record<'main' | 'accent', SwatchId>>): Outfit {
  const next: Outfit = { ...outfit, [item.slot]: { itemId: item.id, tint } };
  if (item.slot === 'dress') {
    delete next.top;
    delete next.bottom;
  }
  if (item.slot === 'top' || item.slot === 'bottom') delete next.dress;
  return next;
}

/** Removing is allowed only for optional slots; a dress can be removed only if top+bottom fallbacks are given. */
export function unequip(outfit: Outfit, slot: WearSlot, fallback: Outfit): Outfit {
  if (slot === 'shoes' || slot === 'top' || slot === 'bottom') return outfit;
  const next = { ...outfit };
  delete next[slot];
  if (slot === 'dress') {
    next.top = next.top ?? fallback.top;
    next.bottom = next.bottom ?? fallback.bottom;
  }
  return next;
}

/** Sleeve source for the arm layer: dress sleeve if wearing a dress, otherwise the top's. */
export function baseSleeveSlot(outfit: Outfit): 'dress' | 'top' | null {
  if (outfit.dress) return 'dress';
  if (outfit.top) return 'top';
  return null;
}
