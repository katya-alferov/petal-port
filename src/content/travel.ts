// Paris trip (game-systems §7): one ticket, one destination for now. Souvenirs are kept in the album.
// Ticket price (400) and album cap (60) live in game/travel.ts with the rules.

export interface SouvenirDef {
  id: string;
  name: string;
  /** Coins at the kiosk; 0 means it is a gift (the postcard comes with the first photo). */
  price: number;
  art: 'postcard' | 'tower' | 'beret' | 'macarons';
  color: string;
}

export const SOUVENIRS: SouvenirDef[] = [
  { id: 'souvenir.postcard', name: 'Paris Postcard', price: 0, art: 'postcard', color: '#8EC9FF' },
  { id: 'souvenir.tower', name: 'Mini Tower', price: 40, art: 'tower', color: '#FFC94A' },
  { id: 'souvenir.beret', name: 'Little Beret', price: 30, art: 'beret', color: '#FF7BA9' },
  { id: 'souvenir.macarons', name: 'Macaron Box', price: 35, art: 'macarons', color: '#B692F6' },
];

export const souvenir = (id: string) => SOUVENIRS.find((s) => s.id === id);

export type PhotoPose = 'idle' | 'wave' | 'hips' | 'cheer';
export type PhotoProp = 'none' | 'beret' | 'croissant' | 'balloon';

export const PHOTO_POSES: { id: PhotoPose; name: string }[] = [
  { id: 'wave', name: 'Wave' },
  { id: 'hips', name: 'Hands on hips' },
  { id: 'cheer', name: 'Cheer' },
  { id: 'idle', name: 'Relax' },
];
export const PHOTO_PROPS: { id: PhotoProp; name: string }[] = [
  { id: 'none', name: 'No prop' },
  { id: 'beret', name: 'Beret' },
  { id: 'croissant', name: 'Croissant' },
  { id: 'balloon', name: 'Balloon' },
];

export type PhotoStickerId = 'heart' | 'star' | 'bonjour' | 'tower' | 'macaron' | 'sparkle';
export const PHOTO_STICKERS: { id: PhotoStickerId; name: string }[] = [
  { id: 'heart', name: 'Heart' },
  { id: 'star', name: 'Star' },
  { id: 'bonjour', name: 'Bonjour!' },
  { id: 'tower', name: 'Mini tower' },
  { id: 'macaron', name: 'Macaron' },
  { id: 'sparkle', name: 'Sparkle' },
];
/** Fixed sticker spots (percent of the photo), so placing is a tap and works with a keyboard. */
export const STICKER_SPOTS: [number, number][] = [
  [16, 14],
  [84, 14],
  [14, 48],
  [86, 46],
  [20, 76],
  [80, 76],
];
