// Content facts the pure save functions need (injected so game/ stays content-agnostic).
import type { SaveContext } from '../game/save';
import { FURNITURE, HARBOUR_LOFT } from './furniture';
import { DEFAULT_APPEARANCE, STARTER_OUTFIT } from './outfits';
import { WEARABLES } from './wearables';

export const SAVE_CONTEXT: SaveContext = {
  knownItems: new Set([...WEARABLES.map((w) => w.id), ...FURNITURE.map((f) => f.id)]),
  starterOutfit: STARTER_OUTFIT,
  starterHome: HARBOUR_LOFT.starterFurniture,
  defaultAppearance: DEFAULT_APPEARANCE,
};
