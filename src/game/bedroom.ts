// Bedroom (game-systems §17): a second room to design. All choices are free and can be changed any time.
export type BedroomPart = 'walls' | 'bedding' | 'lamp' | 'picture' | 'rug' | 'wardrobe';
export const BEDROOM_PARTS: readonly BedroomPart[] = ['walls', 'bedding', 'lamp', 'picture', 'rug', 'wardrobe'];

export type BedroomLook = Record<BedroomPart, string>;

export const DEFAULT_BEDROOM: BedroomLook = {
  walls: 'cream',
  bedding: 'pink',
  lamp: 'dome',
  picture: 'sunset',
  rug: 'round',
  wardrobe: 'white',
};

/** How many parts differ from the starter look (used for a sticker). */
export function changedParts(look: Partial<BedroomLook> | undefined): number {
  if (!look) return 0;
  return BEDROOM_PARTS.filter((p) => look[p] !== undefined && look[p] !== DEFAULT_BEDROOM[p]).length;
}

export function withPart(look: Partial<BedroomLook> | undefined, part: BedroomPart, id: string): Partial<BedroomLook> {
  return { ...look, [part]: id };
}
