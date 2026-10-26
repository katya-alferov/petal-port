// Furniture catalog and homes. M0 has the Harbour Loft starter set; the cottage arrives in M2.
import type { FurnitureDef, HomeDef } from './types';

const starter = { kind: 'starter', lifestyle: 'urban' } as const;
const shop = (price: number) => ({ kind: 'shop', shop: 'boutique', price }) as const;
const friendGift = { kind: 'reward', unlock: { kind: 'friend' } } as const;

export const FURNITURE: FurnitureDef[] = [
  {
    id: 'furn.modern-sofa',
    type: 'furniture',
    slot: 'seat',
    name: 'Modern Sofa',
    source: starter,
    art: 'furn/seat/modern-sofa',
    tints: [
      { id: 'main', default: 'sea' },
      { id: 'accent', default: 'sunshine' },
    ],
  },
  {
    id: 'furn.round-rug',
    type: 'furniture',
    slot: 'rug',
    name: 'Round Rug',
    source: starter,
    art: 'furn/rug/round',
    tints: [
      { id: 'main', default: 'cream' },
      { id: 'accent', default: 'coral' },
    ],
  },
  {
    id: 'furn.harbour-print',
    type: 'furniture',
    slot: 'wall',
    name: 'Harbour Print',
    source: starter,
    art: 'furn/wall/harbour-print',
    tints: [
      { id: 'main', default: 'cocoa' },
      { id: 'accent', default: 'sea' },
    ],
  },
  {
    id: 'furn.arc-lamp',
    type: 'furniture',
    slot: 'lamp',
    name: 'Arc Lamp',
    source: starter,
    art: 'furn/lamp/arc',
    tints: [{ id: 'main', default: 'cream' }],
  },
  {
    id: 'furn.fiddle-leaf',
    type: 'furniture',
    slot: 'plant',
    name: 'Fiddle-leaf Plant',
    source: starter,
    art: 'furn/plant/fiddle-leaf',
    tints: [{ id: 'main', default: 'coral' }],
  },
  {
    id: 'furn.bistro-table',
    type: 'furniture',
    slot: 'table',
    name: 'Bistro Table',
    source: starter,
    art: 'furn/table/bistro',
    tints: [{ id: 'main', default: 'cream' }],
  },
  {
    id: 'furn.floating-shelf',
    type: 'furniture',
    slot: 'shelf',
    name: 'Floating Shelf',
    source: starter,
    art: 'furn/shelf/floating',
    tints: [{ id: 'main', default: 'cocoa' }],
  },
  {
    id: 'furn.blinds',
    type: 'furniture',
    slot: 'window',
    name: 'Blinds',
    source: starter,
    art: 'furn/window/blinds',
    tints: [
      { id: 'main', default: 'cream' },
      { id: 'accent', default: 'sea' },
    ],
  },
  // Ribbon Boutique, Home tab
  {
    id: 'furn.heart-rug',
    type: 'furniture',
    slot: 'rug',
    name: 'Heart Rug',
    source: shop(60),
    art: 'furn/rug/heart',
    tints: [
      { id: 'main', default: 'petal' },
      { id: 'accent', default: 'cream' },
    ],
  },
  {
    id: 'furn.rainbow-print',
    type: 'furniture',
    slot: 'wall',
    name: 'Rainbow Print',
    source: shop(40),
    art: 'furn/wall/rainbow-print',
    tints: [{ id: 'main', default: 'sunshine' }],
  },
  {
    id: 'furn.cactus',
    type: 'furniture',
    slot: 'plant',
    name: 'Happy Cactus',
    source: shop(30),
    art: 'furn/plant/cactus',
    tints: [{ id: 'main', default: 'sea' }],
  },
  {
    id: 'furn.mushroom-lamp',
    type: 'furniture',
    slot: 'lamp',
    name: 'Mushroom Lamp',
    source: shop(70),
    art: 'furn/lamp/mushroom',
    tints: [
      { id: 'main', default: 'coral' },
      { id: 'accent', default: 'cream' },
    ],
  },
  {
    id: 'furn.loveseat',
    type: 'furniture',
    slot: 'seat',
    name: 'Petal Loveseat',
    source: shop(120),
    art: 'furn/seat/loveseat',
    tints: [
      { id: 'main', default: 'petal' },
      { id: 'accent', default: 'cream' },
    ],
  },
  {
    id: 'furn.curtains',
    type: 'furniture',
    slot: 'window',
    name: 'Flowy Curtains',
    source: shop(50),
    art: 'furn/window/curtains',
    tints: [
      { id: 'main', default: 'lilac' },
      { id: 'accent', default: 'sunshine' },
    ],
  },
  // Friendship gifts (game-systems §8.3)
  {
    id: 'furn.sunflower',
    type: 'furniture',
    slot: 'plant',
    name: 'Sunflower Pot',
    source: friendGift,
    art: 'furn/plant/sunflower',
    tints: [{ id: 'main', default: 'sea' }],
  },
  {
    id: 'furn.patchwork-rug',
    type: 'furniture',
    slot: 'rug',
    name: 'Patchwork Rug',
    source: friendGift,
    art: 'furn/rug/patchwork',
    tints: [
      { id: 'main', default: 'lilac' },
      { id: 'accent', default: 'sunshine' },
    ],
  },
  {
    id: 'furn.blossom-print',
    type: 'furniture',
    slot: 'wall',
    name: 'Blossom Print',
    source: friendGift,
    art: 'furn/wall/blossom-print',
    tints: [{ id: 'main', default: 'cocoa' }],
  },
  {
    id: 'furn.star-lamp',
    type: 'furniture',
    slot: 'lamp',
    name: 'Star Lamp',
    source: friendGift,
    art: 'furn/lamp/star',
    tints: [{ id: 'main', default: 'sunshine' }],
  },
];

export function furnitureFor(slot: FurnitureDef['slot']): FurnitureDef[] {
  return FURNITURE.filter((f) => f.slot === slot);
}

export function furniture(id: string): FurnitureDef | undefined {
  return FURNITURE.find((f) => f.id === id);
}

// Scene canvas is 1170×2532; hotspots and furniture stay inside the 1170×1800 safe band (y 366–2166).
export const HARBOUR_LOFT: HomeDef = {
  id: 'harbour-loft',
  lifestyle: 'urban',
  name: 'Harbour Loft',
  art: 'scene/harbour-loft',
  themes: [
    { id: 'theme.seaside', name: 'Seaside', walls: '#CDEEEA', floor: '#E6C29A', trim: '#FFF7EC' },
    { id: 'theme.sunset', name: 'Sunset', walls: '#FFD9C9', floor: '#D7A07A', trim: '#B39DFF' },
    { id: 'theme.night-market', name: 'Night Market', walls: '#2F5F78', floor: '#8B5E3C', trim: '#FFC94A' },
    { id: 'theme.candy', name: 'Candy Doll', walls: '#FFCFE1', floor: '#F7AECB', trim: '#FFF7EC', pattern: 'dots' },
    { id: 'theme.lilac-dream', name: 'Lilac Dream', walls: '#E6DCFF', floor: '#CDBDF5', trim: '#FF9BBE', pattern: 'quilt' },
  ],
  slotAnchors: {
    wall: { x: 150, y: 640, w: 340, h: 340, z: 1 },
    window: { x: 600, y: 560, w: 480, h: 480, z: 2 },
    shelf: { x: 130, y: 900, w: 380, h: 380, z: 1 },
    plant: { x: -10, y: 1420, w: 300, h: 300, z: 3 },
    lamp: { x: 780, y: 1180, w: 420, h: 420, z: 3 },
    seat: { x: 170, y: 1260, w: 600, h: 600, z: 4 },
    rug: { x: 180, y: 1540, w: 820, h: 820, z: 2 },
    table: { x: 790, y: 1560, w: 340, h: 340, z: 5 },
  },
  starterFurniture: {
    wall: 'furn.harbour-print',
    window: 'furn.blinds',
    shelf: 'furn.floating-shelf',
    lamp: 'furn.arc-lamp',
    seat: 'furn.modern-sofa',
    rug: 'furn.round-rug',
    table: 'furn.bistro-table',
    plant: 'furn.fiddle-leaf',
  },
};
