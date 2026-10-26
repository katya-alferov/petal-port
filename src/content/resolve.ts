// Resolves player choices into plain color/art specs for the art layer. Art never looks up content
// itself (data-model §7), and every color it receives is a hex value, so photo export is safe.
import type { Appearance, Outfit } from '../game/save';
import { byId, EYE_COLORS, HAIR_COLORS, SKIN_TONES } from './appearance';
import { furniture } from './furniture';
import { mix, shadeOf, swatch, type Shade, type SwatchId } from './palette';
import type { HomeDef, HomeSlot, SleeveTrim, SleeveType, WearSlot, FurnitureDef, WearableDef } from './types';
import { wearable } from './wearables';

export interface RigItem {
  id: string;
  name: string;
  art: string;
  sleeve: SleeveType;
  sleeveTrim?: SleeveTrim;
  hidesHairFront: boolean;
  main: Shade;
  accent: Shade;
}

export interface RigSpec {
  skin: Shade;
  blush: string;
  hair: Shade;
  hairArt: string;
  iris: string;
  eyeStyle: string;
  freckles: boolean;
  items: Partial<Record<WearSlot, RigItem>>;
}

type Tint = Partial<Record<'main' | 'accent', SwatchId>>;

function tints(def: WearableDef | FurnitureDef, tint?: Tint) {
  const main = def.tints.find((t) => t.id === 'main');
  const accent = def.tints.find((t) => t.id === 'accent');
  return {
    main: swatch(tint?.main ?? main?.default),
    accent: swatch(tint?.accent ?? accent?.default ?? main?.default),
  };
}

export function resolveRig(appearance: Appearance, outfit: Outfit): RigSpec {
  const skin = byId(SKIN_TONES, appearance.skinTone);
  const hair = byId(HAIR_COLORS, appearance.hairColor);
  const items: RigSpec['items'] = {};
  for (const [slot, eq] of Object.entries(outfit) as [WearSlot, Outfit[WearSlot]][]) {
    const def = eq && wearable(eq.itemId);
    if (!eq || !def) continue;
    items[slot] = {
      id: def.id,
      name: def.name,
      art: def.art,
      sleeve: def.sleeve ?? 'none',
      sleeveTrim: def.sleeveTrim,
      hidesHairFront: def.hidesHairFront ?? false,
      ...tints(def, eq.tint),
    };
  }
  return {
    skin: { base: skin.base, shadow: skin.shadow, highlight: skin.base },
    blush: skin.blush,
    hair: { base: hair.base, shadow: hair.shadow, highlight: hair.shine },
    hairArt: `hair/${appearance.hairStyle.replace('hairstyle.', '')}`,
    iris: byId(EYE_COLORS, appearance.eyeColor).iris,
    eyeStyle: appearance.eyeStyle,
    freckles: appearance.freckles,
    items,
  };
}

export interface FurnSpec {
  id: string;
  name: string;
  art: string;
  main: Shade;
  accent: Shade;
}

export function resolveFurniture(itemId: string, tint?: Tint): FurnSpec | null {
  const def = furniture(itemId);
  if (!def) return null;
  return { id: def.id, name: def.name, art: def.art, ...tints(def, tint) };
}

export interface RoomSpec {
  name: string;
  themeName: string;
  night: boolean;
  walls: string;
  wallPattern: string;
  pattern: 'leaf' | 'dots' | 'quilt';
  floor: Shade;
  trim: Shade;
  anchors: HomeDef['slotAnchors'];
  slots: Partial<Record<HomeSlot, FurnSpec>>;
}

export function resolveRoom(home: HomeDef, themeId: string, slots: Partial<Record<HomeSlot, string>>): RoomSpec {
  const theme = home.themes.find((t) => t.id === themeId) ?? home.themes[0];
  const out: RoomSpec['slots'] = {};
  for (const [slot, id] of Object.entries(slots) as [HomeSlot, string][]) {
    const f = resolveFurniture(id);
    if (f) out[slot] = f;
  }
  return {
    name: home.name,
    themeName: theme.name,
    night: theme.id === 'theme.night-market',
    walls: theme.walls,
    wallPattern: mix(theme.walls, '#4A3366', 0.1),
    pattern: theme.pattern ?? 'leaf',
    floor: shadeOf(theme.floor),
    trim: shadeOf(theme.trim),
    anchors: home.slotAnchors,
    slots: out,
  };
}
