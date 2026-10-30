// Paris trip (game-systems §7): one ticket, one destination for now. Souvenirs are kept in the album.
// Ticket price (400) and album cap (60) live in game/travel.ts with the rules.

export interface SouvenirDef {
  id: string;
  name: string;
  /** Coins at the kiosk; 0 means it is a gift (the postcard comes with the first photo, rides give prizes). */
  price: number;
  art:
    | 'postcard'
    | 'tower'
    | 'beret'
    | 'macarons'
    | 'snowglobe'
    | 'cab'
    | 'pretzel'
    | 'snowdome'
    | 'rocketpin'
    | 'wand'
    | 'skylens'
    | 'teddy'
    | 'rainbowpop';
  color: string;
  /** Where it comes from: the kiosk of that place, or a ride prize there. Old Paris souvenirs have `paris`. */
  place: 'paris' | 'newyork' | 'storybook' | 'funfair';
}

export const SOUVENIRS: SouvenirDef[] = [
  { id: 'souvenir.postcard', name: 'Paris Postcard', price: 0, art: 'postcard', color: '#8EC9FF', place: 'paris' },
  { id: 'souvenir.tower', name: 'Mini Tower', price: 40, art: 'tower', color: '#FFC94A', place: 'paris' },
  { id: 'souvenir.beret', name: 'Little Beret', price: 30, art: 'beret', color: '#FF7BA9', place: 'paris' },
  { id: 'souvenir.macarons', name: 'Macaron Box', price: 35, art: 'macarons', color: '#B692F6', place: 'paris' },
  { id: 'souvenir.snowglobe', name: 'Skyline Snow Globe', price: 45, art: 'snowglobe', color: '#8EC9FF', place: 'newyork' },
  { id: 'souvenir.cab', name: 'Yellow Cab', price: 40, art: 'cab', color: '#FFC94A', place: 'newyork' },
  { id: 'souvenir.pretzel', name: 'Pretzel Keychain', price: 30, art: 'pretzel', color: '#D9964E', place: 'newyork' },
  { id: 'souvenir.snowdome', name: 'Castle Snow-Dome', price: 0, art: 'snowdome', color: '#B692F6', place: 'storybook' },
  { id: 'souvenir.rocketpin', name: 'Rocket Pin', price: 0, art: 'rocketpin', color: '#FF7BA9', place: 'storybook' },
  { id: 'souvenir.wand', name: 'Sparkle Wand', price: 0, art: 'wand', color: '#FFC94A', place: 'storybook' },
  { id: 'souvenir.skylens', name: 'Sky Wheel Lens', price: 0, art: 'skylens', color: '#3BB7C4', place: 'funfair' },
  { id: 'souvenir.teddy', name: 'Bell Ringer Teddy', price: 0, art: 'teddy', color: '#D9964E', place: 'funfair' },
  { id: 'souvenir.rainbowpop', name: 'Rainbow Lollipop', price: 0, art: 'rainbowpop', color: '#FF7BA9', place: 'funfair' },
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

export type PhotoStickerId = 'heart' | 'star' | 'bonjour' | 'tower' | 'macaron' | 'sparkle' | 'beret';
export const PHOTO_STICKERS: { id: PhotoStickerId; name: string }[] = [
  { id: 'heart', name: 'Heart' },
  { id: 'star', name: 'Star' },
  { id: 'bonjour', name: 'Bonjour!' },
  { id: 'tower', name: 'Mini tower' },
  { id: 'macaron', name: 'Macaron' },
  { id: 'sparkle', name: 'Sparkle' },
  { id: 'beret', name: 'Beret' },
];
/** Fixed sticker spots (percent of the photo), so placing is a tap and works with a keyboard. */
export const STICKER_SPOTS: [number, number][] = [
  [16, 14],
  [84, 14],
  [14, 48],
  [86, 46],
  [20, 76],
  [80, 76],
  [50, 8],
];
