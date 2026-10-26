// Wave C content (game-systems §10): Glam Salon menu and Petal Garden seeds. Ids are permanent.
import type { SalonMenu } from '../game/salon';
import { HAIR_STYLES } from './appearance';
import type { FlowerArt } from './types';

export const SALON_MENU: SalonMenu = {
  styles: HAIR_STYLES.map((h) => h.id),
  colors: [
    'hair.black',
    'hair.chestnut',
    'hair.copper',
    'hair.honey-blonde',
    'hair.platinum',
    'hair.lilac',
    'hair.petal-pink',
    'hair.sea-teal',
  ],
  accessories: ['headwear.bow-headband', 'headwear.flower-crown', 'headwear.tiara', 'headwear.kitty-ears'],
};

export interface SeedDef {
  id: string;
  name: string;
  art: FlowerArt;
  petal: string;
  center: string;
}

export const SEEDS: SeedDef[] = [
  { id: 'seed.tulip', name: 'Tulip', art: 'tulip', petal: '#FF7BA9', center: '#FFC94A' },
  { id: 'seed.sunflower', name: 'Sunflower', art: 'sunflower', petal: '#FFC94A', center: '#8B5E3C' },
  { id: 'seed.daisy', name: 'Daisy', art: 'daisy', petal: '#FFFFFF', center: '#FFC94A' },
  { id: 'seed.rose', name: 'Rose', art: 'rose', petal: '#E8476F', center: '#B23A6B' },
  { id: 'seed.bluebell', name: 'Bluebell', art: 'bell', petal: '#8FA8FF', center: '#5B6FD8' },
  { id: 'seed.starbloom', name: 'Starbloom', art: 'star', petal: '#C7B4FF', center: '#FFF1A8' },
];

export function seed(id: string): SeedDef | undefined {
  return SEEDS.find((s) => s.id === id);
}
