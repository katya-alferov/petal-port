// Secret shells (game-systems §9.2): small glossy collectibles in a 100×100 box, centred at 50,54.
import type { ReactElement } from 'react';
import { OUTLINE } from '../kit';

const sw = { stroke: OUTLINE, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Mixes a hex color toward white (t > 0) or the outline plum (t < 0). */
function tone(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const to = t > 0 ? [255, 255, 255] : [0x5b, 0x4a, 0x6e];
  const k = Math.abs(t);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v, i) => Math.round(v + (to[i] - v) * k));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const SHAPES: Record<string, (c: string) => ReactElement> = {
  scallop: (c) => (
    <g>
      <path d="M50,84 L40,74 C22,70 12,52 18,36 C26,18 44,14 50,14 C56,14 74,18 82,36 C88,52 78,70 60,74 Z" fill={c} {...sw} />
      {[-30, -15, 0, 15, 30].map((a) => (
        <path
          key={a}
          d={`M50,76 L${50 + a * 1.1},${24 + Math.abs(a) * 0.4}`}
          stroke={tone(c, -0.25)}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
      <path d="M40,74 L44,86 L56,86 L60,74 Z" fill={tone(c, -0.15)} {...sw} />
    </g>
  ),
  conch: (c) => (
    <g>
      <path d="M22,70 C14,52 26,26 50,18 C66,14 84,22 84,34 C84,44 74,48 66,52 C74,60 74,74 62,82 C48,90 28,84 22,70 Z" fill={c} {...sw} />
      <path
        d="M66,52 C58,56 50,54 46,48 M62,82 C56,72 46,68 36,70"
        fill="none"
        stroke={tone(c, -0.3)}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path d="M56,24 C64,24 72,28 74,34" fill="none" stroke={tone(c, -0.3)} strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  starfish: (c) => (
    <g>
      <path
        d="M50,14 C55,14 56,32 60,38 C66,42 86,38 88,44 C90,50 72,56 68,62 C68,70 80,84 76,88 C70,92 58,78 50,76 C42,78 30,92 24,88 C20,84 32,70 32,62 C28,56 10,50 12,44 C14,38 34,42 40,38 C44,32 45,14 50,14 Z"
        fill={c}
        {...sw}
      />
      {[
        [50, 30],
        [72, 46],
        [64, 74],
        [36, 74],
        [28, 46],
        [50, 54],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={3} fill={tone(c, 0.55)} />
      ))}
    </g>
  ),
  spiral: (c) => (
    <g>
      <circle cx={50} cy={54} r={32} fill={c} {...sw} />
      <path
        d="M50,54 C50,48 58,48 58,54 C58,62 44,64 42,54 C40,42 58,38 64,48 C72,62 58,76 44,74 C30,72 24,56 30,44"
        fill="none"
        stroke={tone(c, -0.35)}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
    </g>
  ),
};

export function ShellArt({ kind, color }: { kind: string; color: string }) {
  const draw = SHAPES[kind] ?? SHAPES.scallop;
  return (
    <g>
      {draw(color)}
      {/* Gloss and a twinkle so it reads as a treasure, not scenery */}
      <path d="M30,34 C34,26 40,22 46,20" fill="none" stroke="#FFFFFF" strokeWidth={4.5} strokeLinecap="round" opacity={0.9} />
      <path d="M84,8 L86.5,15 L93,17.5 L86.5,20 L84,27 L81.5,20 L75,17.5 L81.5,15 Z" fill="#FFF7EC" stroke={OUTLINE} strokeWidth={1.5} />
    </g>
  );
}
