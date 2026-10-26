// Coins in and out (game-systems §6). Every function returns a new save; nothing is mutated.
import type { ItemId } from '../content/types';
import { MAX_COINS, type SaveGame } from './save';

export function earn(save: SaveGame, coins: number): SaveGame {
  if (coins <= 0) return save;
  return {
    ...save,
    wallet: { coins: Math.min(MAX_COINS, save.wallet.coins + coins), lifetimeEarned: save.wallet.lifetimeEarned + coins },
  };
}

export type PurchaseResult = { ok: true; save: SaveGame } | { ok: false; reason: 'owned' | 'coins' };

export function purchase(save: SaveGame, itemId: ItemId, price: number, now: number): PurchaseResult {
  if (save.inventory.owned[itemId]) return { ok: false, reason: 'owned' };
  if (save.wallet.coins < price) return { ok: false, reason: 'coins' };
  return {
    ok: true,
    save: {
      ...save,
      wallet: { ...save.wallet, coins: save.wallet.coins - price },
      inventory: { owned: { ...save.inventory.owned, [itemId]: { acquiredAt: now } } },
    },
  };
}

/** Gives an item for free (rank gifts, rewards). Owning it already is fine. */
export function grant(save: SaveGame, itemId: ItemId, now: number): SaveGame {
  if (save.inventory.owned[itemId]) return save;
  return { ...save, inventory: { owned: { ...save.inventory.owned, [itemId]: { acquiredAt: now } } } };
}
