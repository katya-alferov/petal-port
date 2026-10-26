// Content types (data-model §2). Only the parts M0 needs are filled in so far.
import type { SwatchId } from './palette';

export type ItemId = string;
export type Coins = number;

export type WearSlot = 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'headwear' | 'eyewear' | 'neck' | 'bag';

export const WEAR_SLOTS: WearSlot[] = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'headwear', 'eyewear', 'neck', 'bag'];

export type SleeveType = 'none' | 'cap' | 'short' | 'long' | 'puff';

export type SleeveTrim = 'cuff' | 'stripe';

export type Lifestyle = 'urban' | 'countryside';

export type Source =
  { kind: 'starter'; lifestyle?: Lifestyle } | { kind: 'shop'; shop: string; price: Coins } | { kind: 'reward'; unlock: { kind: string } };

export interface TintRegion {
  id: 'main' | 'accent';
  default: SwatchId;
  allowed?: SwatchId[];
}

export interface WearableDef {
  id: ItemId;
  type: 'wearable';
  slot: WearSlot;
  name: string;
  source: Source;
  tags: string[];
  tints: TintRegion[];
  sleeve?: SleeveType;
  sleeveTrim?: SleeveTrim;
  hidesHairFront?: boolean;
  art: string;
}

export interface SkinToneDef {
  id: string;
  name: string;
  base: string;
  shadow: string;
  blush: string;
}

export interface HairColorDef {
  id: string;
  name: string;
  base: string;
  shadow: string;
  shine: string;
  fantasy: boolean;
}

export interface HairStyleDef {
  id: string;
  name: string;
  art: string;
  texture: 'coily' | 'curly' | 'wavy' | 'straight' | 'braids' | 'covering';
  tintable: 'hairColor' | 'fashionPalette';
}

export interface EyeColorDef {
  id: string;
  name: string;
  iris: string;
}

export type HomeSlot = 'wall' | 'window' | 'seat' | 'rug' | 'table' | 'lamp' | 'plant' | 'shelf';

export const HOME_SLOTS: HomeSlot[] = ['wall', 'window', 'seat', 'rug', 'table', 'lamp', 'plant', 'shelf'];

export interface FurnitureDef {
  id: ItemId;
  type: 'furniture';
  slot: HomeSlot;
  name: string;
  source: Source;
  tints: TintRegion[];
  art: string;
}

export interface HomeTheme {
  id: string;
  name: string;
  walls: string;
  floor: string;
  trim: string;
  /** Wallpaper motif; leaves by default. */
  pattern?: 'leaf' | 'dots' | 'quilt';
}

export interface SlotAnchor {
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
}

export interface HomeDef {
  id: 'harbour-loft' | 'meadow-cottage';
  lifestyle: Lifestyle;
  name: string;
  art: string;
  themes: HomeTheme[];
  slotAnchors: Record<HomeSlot, SlotAnchor>;
  starterFurniture: Record<HomeSlot, ItemId>;
}

/** Flower drawings in the Petal Garden (game-systems §10.2). */
export type FlowerArt = 'tulip' | 'sunflower' | 'daisy' | 'rose' | 'bell' | 'star';
