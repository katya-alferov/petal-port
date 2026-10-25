// Appearance options (game-systems §1.1). Skin tones are listed in a mixed order, never light→dark.
import type { EyeColorDef, HairColorDef, HairStyleDef, SkinToneDef } from './types';

export const SKIN_TONES: SkinToneDef[] = [
  { id: 'skin.honey', name: 'Honey', base: '#E0A872', shadow: '#C28356', blush: '#E98A7A' },
  { id: 'skin.porcelain', name: 'Porcelain', base: '#FBE3D3', shadow: '#E8C0AC', blush: '#F6A2A0' },
  { id: 'skin.espresso', name: 'Espresso', base: '#6B4430', shadow: '#523222', blush: '#9A5146' },
  { id: 'skin.peach', name: 'Peach', base: '#F5C9A6', shadow: '#DDA481', blush: '#F2918A' },
  { id: 'skin.chestnut', name: 'Chestnut', base: '#9C6644', shadow: '#7E4E32', blush: '#C06A5C' },
  { id: 'skin.olive', name: 'Olive', base: '#C9A27A', shadow: '#A9815B', blush: '#D9846F' },
  { id: 'skin.ebony', name: 'Ebony', base: '#4E3124', shadow: '#3A2219', blush: '#7E4038' },
  { id: 'skin.rose', name: 'Rose', base: '#F0BFA8', shadow: '#D69C86', blush: '#EE8C8C' },
  { id: 'skin.caramel', name: 'Caramel', base: '#B97D52', shadow: '#99613C', blush: '#D27A64' },
  { id: 'skin.almond', name: 'Almond', base: '#D9B08C', shadow: '#BB8E6A', blush: '#E28E7D' },
];

export const HAIR_COLORS: HairColorDef[] = [
  { id: 'hair.black', name: 'Black', base: '#2E2433', shadow: '#1D1622', shine: '#5A4A63', fantasy: false },
  { id: 'hair.dark-brown', name: 'Dark brown', base: '#4A3026', shadow: '#33201A', shine: '#76503F', fantasy: false },
  { id: 'hair.chestnut', name: 'Chestnut', base: '#7A4A30', shadow: '#5A3422', shine: '#A8704F', fantasy: false },
  { id: 'hair.auburn', name: 'Auburn', base: '#9A3F2B', shadow: '#73291C', shine: '#C9664C', fantasy: false },
  { id: 'hair.copper', name: 'Copper', base: '#C8683A', shadow: '#9E4C27', shine: '#EC9466', fantasy: false },
  { id: 'hair.honey-blonde', name: 'Honey blonde', base: '#E0B266', shadow: '#BD8D47', shine: '#F6D99A', fantasy: false },
  { id: 'hair.platinum', name: 'Platinum', base: '#EDE3D1', shadow: '#CDBEA6', shine: '#FFFFFF', fantasy: false },
  { id: 'hair.lilac', name: 'Lilac', base: '#B9A2F0', shadow: '#8F78CF', shine: '#DCD0FF', fantasy: true },
  { id: 'hair.petal-pink', name: 'Petal pink', base: '#F59BBE', shadow: '#D8749B', shine: '#FFC8DD', fantasy: true },
  { id: 'hair.sea-teal', name: 'Sea teal', base: '#4DBFC1', shadow: '#2F9497', shine: '#9BE3E2', fantasy: true },
];

// M0 ships 3 of the 8 v0.1 styles so the rig can be judged with different silhouettes.
export const HAIR_STYLES: HairStyleDef[] = [
  { id: 'hairstyle.wavy-long', name: 'Long waves', art: 'hair/wavy-long', texture: 'wavy', tintable: 'hairColor' },
  { id: 'hairstyle.coily-puff', name: 'Coily puff', art: 'hair/coily-puff', texture: 'coily', tintable: 'hairColor' },
  { id: 'hairstyle.space-buns', name: 'Space buns', art: 'hair/space-buns', texture: 'straight', tintable: 'hairColor' },
];

export const EYE_COLORS: EyeColorDef[] = [
  { id: 'eye.brown', name: 'Brown', iris: '#7A4B2E' },
  { id: 'eye.dark-brown', name: 'Dark brown', iris: '#4A2E20' },
  { id: 'eye.hazel', name: 'Hazel', iris: '#8E7A3E' },
  { id: 'eye.green', name: 'Green', iris: '#4E8A57' },
  { id: 'eye.blue', name: 'Blue', iris: '#4A7FC1' },
  { id: 'eye.grey', name: 'Grey', iris: '#7D8794' },
  { id: 'eye.amber', name: 'Amber', iris: '#C27F2A' },
  { id: 'eye.violet', name: 'Violet', iris: '#8059C9' },
];

export const EYE_STYLES = ['eyes.round', 'eyes.almond'] as const;
export const BROWS = ['brows.soft'] as const;

export function byId<T extends { id: string }>(list: T[], id: string): T {
  return list.find((x) => x.id === id) ?? list[0];
}
