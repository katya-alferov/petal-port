// Paris trip rules (game-systems §7). Pure: every function returns a new value.
import type { PhotoPose, PhotoProp } from '../content/travel';
import type { SaveGame } from './save';

export const PARIS_TICKET = 400;
export const MAX_PHOTOS = 60;

export interface PhotoRecipe {
  place: 'paris';
  pose: PhotoPose;
  prop: PhotoProp;
  /** Sticker ids by spot index (null = empty spot). */
  stickers: (string | null)[];
  at: number;
}

export interface Travel {
  ticket: boolean;
  trips: number;
  souvenirs: string[];
  photos: PhotoRecipe[];
}

export const newTravel = (): Travel => ({ ticket: false, trips: 0, souvenirs: [], photos: [] });

export function buyTicket(save: SaveGame): SaveGame | null {
  if (save.progress.travel.ticket || save.wallet.coins < PARIS_TICKET) return null;
  return {
    ...save,
    wallet: { ...save.wallet, coins: save.wallet.coins - PARIS_TICKET },
    progress: { ...save.progress, travel: { ...save.progress.travel, ticket: true } },
  };
}

export function buySouvenir(save: SaveGame, id: string, price: number): SaveGame | null {
  const t = save.progress.travel;
  if (price <= 0 || t.souvenirs.includes(id) || save.wallet.coins < price) return null;
  return {
    ...save,
    wallet: { ...save.wallet, coins: save.wallet.coins - price },
    progress: { ...save.progress, travel: { ...t, souvenirs: [...t.souvenirs, id] } },
  };
}

/** Keeps a photo; the first one also brings the free postcard. Returns null when the album is full. */
export function addPhoto(save: SaveGame, photo: PhotoRecipe): { save: SaveGame; first: boolean } | null {
  const t = save.progress.travel;
  if (t.photos.length >= MAX_PHOTOS) return null;
  const first = t.photos.length === 0;
  const souvenirs = first && !t.souvenirs.includes('souvenir.postcard') ? [...t.souvenirs, 'souvenir.postcard'] : t.souvenirs;
  return { save: { ...save, progress: { ...save.progress, travel: { ...t, souvenirs, photos: [...t.photos, photo] } } }, first };
}

export function removePhoto(save: SaveGame, index: number): SaveGame {
  const t = save.progress.travel;
  return { ...save, progress: { ...save.progress, travel: { ...t, photos: t.photos.filter((_, i) => i !== index) } } };
}
