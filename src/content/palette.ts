// UI tokens and the Fashion Palette (visual-design §3).
// Art receives resolved hex colors as props so photo export never depends on CSS variables.

export const TOKENS = {
  sea: '#3BB7C4',
  seaDeep: '#1F6F8B',
  petal: '#FF7BA9',
  sunshine: '#FFC94A',
  mint: '#7ED6A7',
  lilac: '#B39DFF',
  coral: '#FF8A65',
  cream: '#FFF7EC',
  paper2: '#FFEBD2',
  ink: '#3A2E4F',
  inkMuted: '#6B5C7E',
  outline: '#5B4A6E',
  night: '#2B2950',
  lantern: '#FFE08A',
  white: '#FFFFFF',
} as const;

export type TokenName = keyof typeof TOKENS;

export interface Shade {
  base: string;
  shadow: string;
  highlight: string;
}

export type SwatchId =
  'cream' | 'charcoal' | 'denim' | 'sea' | 'mint' | 'olive' | 'sunshine' | 'coral' | 'petal' | 'berry' | 'lilac' | 'cocoa' | 'sea-deep';

const SWATCH_BASE: Record<SwatchId, string> = {
  cream: '#FFF7EC',
  charcoal: '#3F3A48',
  denim: '#4A6FA5',
  sea: '#3BB7C4',
  mint: '#7ED6A7',
  olive: '#8A9A5B',
  sunshine: '#FFC94A',
  coral: '#FF8A65',
  petal: '#FF7BA9',
  berry: '#B23A6B',
  lilac: '#B39DFF',
  cocoa: '#8B5E3C',
  // Not one of the 12 player swatches; used for fixed accents such as sailor stripes.
  'sea-deep': '#1F6F8B',
};

/** The 12 swatches offered to players, in display order. */
export const FASHION_SWATCHES: SwatchId[] = [
  'cream',
  'charcoal',
  'denim',
  'sea',
  'mint',
  'olive',
  'sunshine',
  'coral',
  'petal',
  'berry',
  'lilac',
  'cocoa',
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.round(Math.max(0, Math.min(255, v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
      .toUpperCase()
  );
}

/** Linear mix of two hex colors, t in 0..1 (0 = a, 1 = b). */
export function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex([0, 1, 2].map((i) => ca[i] + (cb[i] - ca[i]) * t) as [number, number, number]);
}

/** Three-tone shade: shadow leans toward plum, highlight toward warm white. */
export function shadeOf(base: string): Shade {
  return {
    base,
    shadow: mix(base, '#4A3366', 0.22),
    highlight: mix(base, '#FFFDF7', 0.35),
  };
}

export const SWATCHES: Record<SwatchId, Shade> = Object.fromEntries(
  Object.entries(SWATCH_BASE).map(([id, hex]) => [id, shadeOf(hex)]),
) as Record<SwatchId, Shade>;

export function swatch(id: SwatchId | undefined, fallback: SwatchId = 'cream'): Shade {
  return SWATCHES[id ?? fallback] ?? SWATCHES[fallback];
}

/** WCAG 2 relative luminance contrast ratio. */
export function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const c = hexToRgb(hex).map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Every text-on-fill pair the UI uses (visual-design §3.2). Tested to be ≥ 4.5:1. */
export const TEXT_PAIRS: [TokenName, TokenName][] = [
  ['ink', 'cream'],
  ['ink', 'paper2'],
  ['ink', 'sea'],
  ['ink', 'petal'],
  ['ink', 'sunshine'],
  ['ink', 'mint'],
  ['ink', 'lilac'],
  ['ink', 'coral'],
  ['inkMuted', 'cream'],
  ['white', 'seaDeep'],
  ['white', 'ink'],
  ['lantern', 'night'],
];
